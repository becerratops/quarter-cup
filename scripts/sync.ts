#!/usr/bin/env node
// ============================================================
// Quarter Cup — Jira Sync Script
// ============================================================
// Fetches issues from Jira and generates quest/player JSON data.
// Run locally:  npx tsx scripts/sync.ts
// Run in CI:    GitHub Actions (see .github/workflows/jira-sync.yml)
//
// Required env vars:
//   JIRA_BASE_URL   — e.g., https://myorg.atlassian.net
//   JIRA_EMAIL      — Jira account email
//   JIRA_API_TOKEN  — Jira API token
//
// Optional env vars:
//   JIRA_PROJECT_KEY — override project key from config (default: from config.ts)
//   GITHUB_TOKEN     — for scanning PR history (review points)
// ============================================================

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Config, PlayerConfig } from './config.example.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, '..', 'src', 'data', 'generated');

// ---- Load Configuration ----

let config: Config;
try {
  const mod = await import('./config.ts');
  config = mod.CONFIG;
  console.log('Loaded custom config from scripts/config.ts');
} catch {
  try {
    const mod = await import('./config.example.ts');
    config = mod.CONFIG;
    console.log('Using example config (copy scripts/config.example.ts to scripts/config.ts to customize)');
  } catch (err) {
    console.error('Failed to load config:', err);
    process.exit(1);
  }
}

// Override project key from env if set
if (process.env.JIRA_PROJECT_KEY) {
  config.projectKey = process.env.JIRA_PROJECT_KEY;
}

// ---- Jira API Setup ----

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('Missing required environment variables:');
  if (!JIRA_BASE_URL) console.error('  - JIRA_BASE_URL');
  if (!JIRA_EMAIL) console.error('  - JIRA_EMAIL');
  if (!JIRA_API_TOKEN) console.error('  - JIRA_API_TOKEN');
  console.error('\nSet these env vars or create a .env file.');
  process.exit(1);
}

const jiraAuth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jiraFetch(endpoint: string, options?: { method?: string; body?: unknown }): Promise<any> {
  const url = `${JIRA_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      Authorization: `Basic ${jiraAuth}`,
      Accept: 'application/json',
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API ${res.status}: ${body}`);
  }
  return res.json();
}

// ---- Label → Quest Mapping ----

type Priority = 'urgent' | 'crucial' | 'would-love' | 'nice-to-have';
type Effort = 'XS' | 'S' | 'M' | 'L' | 'XL';
type QuestStatus = 'open' | 'claimed' | 'completed';

const IMPACT_MAP: Record<string, Priority> = {
  'impact-critical': 'urgent',
  'impact-high': 'crucial',
  'impact-medium': 'would-love',
  'impact-low': 'nice-to-have',
};

const EFFORT_MAP: Record<string, Effort> = {
  'effort-xs': 'XS',
  'effort-s': 'S',
  'effort-m': 'M',
  'effort-l': 'L',
  'effort-xl': 'XL',
};

const PRIORITY_MULTIPLIER: Record<Priority, number> = {
  urgent: 4,
  crucial: 3,
  'would-love': 2,
  'nice-to-have': 1,
};

const EFFORT_MULTIPLIER: Record<Effort, number> = {
  XS: 1,
  S: 2,
  M: 3,
  L: 5,
  XL: 8,
};

function calculatePoints(priority: Priority, effort: Effort): number {
  return PRIORITY_MULTIPLIER[priority] * EFFORT_MULTIPLIER[effort];
}

function mapStatus(jiraStatus: string): QuestStatus {
  const s = jiraStatus.toLowerCase();
  if (s === 'done' || s === 'done/implemented' || s === 'closed' || s === 'resolved') {
    return 'completed';
  }
  if (s === 'in progress' || s === 'in review' || s === 'working' || s === 'in development') {
    return 'claimed';
  }
  return 'open';
}

// ---- ADF Text Extraction ----

interface ADFNode {
  type: string;
  text?: string;
  content?: ADFNode[];
}

function extractTextFromADF(doc: ADFNode | string | null): string {
  if (!doc || typeof doc === 'string') return doc || '';
  if (!doc.content) return '';

  const texts: string[] = [];

  function walk(node: ADFNode) {
    if (node.type === 'text' && node.text) {
      texts.push(node.text);
    }
    if (node.type === 'hardBreak') {
      texts.push(' ');
    }
    if (node.content) {
      for (const child of node.content) {
        walk(child);
      }
      // Add space after block-level nodes
      if (['paragraph', 'heading', 'listItem', 'bulletList', 'orderedList'].includes(node.type)) {
        texts.push(' ');
      }
    }
  }

  walk(doc);
  return texts.join('').replace(/\s+/g, ' ').trim();
}

// ---- Player Lookup ----

function findPlayer(jiraDisplayName: string | null): PlayerConfig | undefined {
  if (!jiraDisplayName) return undefined;
  return config.players.find(
    p => p.jiraDisplayName.toLowerCase() === jiraDisplayName.toLowerCase()
  );
}

// ---- Main Sync ----

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description: ADFNode | string | null;
    status: { name: string };
    assignee: { displayName: string } | null;
    reporter: { displayName: string } | null;
    labels: string[];
    issuetype: { name: string };
    priority: { name: string } | null;
    resolutiondate: string | null;
    created: string;
    updated: string;
  };
}

async function fetchAllIssues(): Promise<JiraIssue[]> {
  const allIssues: JiraIssue[] = [];
  const maxResults = 100;
  let nextPageToken: string | undefined;

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = {
      jql: `project=${config.projectKey} ORDER BY key ASC`,
      fields: ['summary', 'description', 'status', 'assignee', 'reporter', 'labels', 'issuetype', 'priority', 'resolutiondate', 'created', 'updated'],
      maxResults,
    };
    if (nextPageToken) {
      body.nextPageToken = nextPageToken;
    }

    const data = await jiraFetch('/rest/api/3/search/jql', {
      method: 'POST',
      body,
    });

    allIssues.push(...data.issues);
    const total = data.total ?? '?';
    console.log(`  Fetched ${allIssues.length} / ${total} issues`);

    if (!data.nextPageToken) break;
    nextPageToken = data.nextPageToken;
  }

  return allIssues;
}

interface QuestData {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  effort: Effort;
  points: number;
  status: QuestStatus;
  claimedBy: string | null;
  completedBy: string | null;
  completedAt: string | null;
  acceptanceCriteria: string[];
  tags: string[];
  jiraUrl: string;
  createdAt: string;
  updatedAt: string;
  jiraStatus: string;
  issueType: string;
  reporterName: string | null;
  assigneeName: string | null;
  // Internal fields (not written to output)
  _reporterGithub: string | null;
  _completedByGithub: string | null;
  _issueType: string;
}

function mapIssueToQuest(issue: JiraIssue): QuestData {
  const labels = issue.fields.labels || [];

  // Extract impact/effort from labels
  const impactLabel = labels.find((l: string) => l.startsWith('impact-'));
  const effortLabel = labels.find((l: string) => l.startsWith('effort-'));

  const priority: Priority = impactLabel
    ? IMPACT_MAP[impactLabel] || 'would-love'
    : 'would-love';
  const effort: Effort = effortLabel
    ? EFFORT_MAP[effortLabel] || 'M'
    : 'M';
  const points = calculatePoints(priority, effort);

  // Status
  const jiraStatus = issue.fields.status?.name || 'To Do';
  const status = mapStatus(jiraStatus);

  // Filter impact/effort labels from display tags
  const tags = labels.filter(
    (l: string) => !l.startsWith('impact-') && !l.startsWith('effort-')
  );

  // Description
  let description = extractTextFromADF(issue.fields.description);
  if (description.length > 300) {
    description = description.slice(0, 297) + '...';
  }

  // Player mapping
  const assigneeName = issue.fields.assignee?.displayName || null;
  const reporterName = issue.fields.reporter?.displayName || null;
  const assigneePlayer = findPlayer(assigneeName);
  const reporterPlayer = findPlayer(reporterName);

  return {
    id: issue.key,
    title: issue.fields.summary,
    description,
    priority,
    effort,
    points,
    status,
    claimedBy: status !== 'open' && assigneePlayer ? assigneePlayer.githubUsername : null,
    completedBy: status === 'completed' && assigneePlayer ? assigneePlayer.githubUsername : null,
    completedAt: issue.fields.resolutiondate || null,
    acceptanceCriteria: [],
    tags,
    jiraUrl: `${JIRA_BASE_URL}/browse/${issue.key}`,
    createdAt: issue.fields.created,
    updatedAt: issue.fields.updated,
    jiraStatus: jiraStatus,
    issueType: issue.fields.issuetype?.name || 'Task',
    reporterName: reporterName,
    assigneeName: assigneeName,
    _reporterGithub: reporterPlayer?.githubUsername || null,
    _completedByGithub: status === 'completed' && assigneePlayer ? assigneePlayer.githubUsername : null,
    _issueType: issue.fields.issuetype?.name || 'Task',
  };
}

interface PlayerData {
  id: string;
  name: string;
  githubUsername: string;
  avatar: string;
  role: string;
  totalPoints: number;
  discoveryPoints: number;
  completionPoints: number;
  reviewPoints: number;
  questsCompleted: string[];
  questsClaimed: string[];
  questsDiscovered: string[];
}

function buildPlayerData(quests: QuestData[]): PlayerData[] {
  const playerMap = new Map<string, PlayerData>();

  // Initialize all configured players
  for (const p of config.players) {
    playerMap.set(p.githubUsername, {
      id: `p-${p.githubUsername}`,
      name: p.name,
      githubUsername: p.githubUsername,
      avatar: '',
      role: p.role,
      totalPoints: 0,
      discoveryPoints: 0,
      completionPoints: 0,
      reviewPoints: 0,
      questsCompleted: [],
      questsClaimed: [],
      questsDiscovered: [],
    });
  }

  for (const quest of quests) {
    // Discovery points: 50% for reporter
    if (quest._reporterGithub && playerMap.has(quest._reporterGithub)) {
      const player = playerMap.get(quest._reporterGithub)!;
      const discoveryPts = Math.round(quest.points * 0.5);
      player.discoveryPoints += discoveryPts;
      player.totalPoints += discoveryPts;
      if (!player.questsDiscovered.includes(quest.id)) {
        player.questsDiscovered.push(quest.id);
      }
    }

    // Completion points: 100% for assignee when done
    if (quest.status === 'completed' && quest._completedByGithub && playerMap.has(quest._completedByGithub)) {
      const player = playerMap.get(quest._completedByGithub)!;
      let completionPts = quest.points;

      // Sprint multipliers (only during active sprint)
      if (config.sprint.isActive) {
        if (quest.tags.includes(config.sprintMultipliers.blockerLabel)) {
          completionPts = Math.round(completionPts * config.sprintMultipliers.blockerBonus);
        } else if (quest.priority === 'urgent' || quest.priority === 'crucial') {
          completionPts = Math.round(completionPts * config.sprintMultipliers.highImpactBonus);
        }
      }

      // Bonus: fixing someone else's bug
      if (quest._issueType === 'Bug' && quest._reporterGithub !== quest._completedByGithub) {
        completionPts += config.bonuses.fixingSomeoneElsesBug;
      }

      player.completionPoints += completionPts;
      player.totalPoints += completionPts;
      if (!player.questsCompleted.includes(quest.id)) {
        player.questsCompleted.push(quest.id);
      }
    }

    // Track claimed quests
    if (quest.status === 'claimed' && quest.claimedBy && playerMap.has(quest.claimedBy)) {
      const player = playerMap.get(quest.claimedBy)!;
      if (!player.questsClaimed.includes(quest.id)) {
        player.questsClaimed.push(quest.id);
      }
    }
  }

  // Sort by total points descending
  return Array.from(playerMap.values()).sort((a, b) => b.totalPoints - a.totalPoints);
}

// ---- GitHub PR Scanning ----

interface PRContribution {
  repo: string;
  prNumber: number;
  title: string;
  url: string;
  linkedQuest: string | null;
  points: number;
  type: 'merge' | 'review';
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function githubFetch(endpoint: string): Promise<any> {
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not set');
  const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

function extractQuestIds(text: string): string[] {
  const pattern = new RegExp(`${config.projectKey}-\\d+`, 'gi');
  const matches = text.match(pattern) || [];
  return [...new Set(matches.map(m => m.toUpperCase()))];
}

function findPlayerByGithub(username: string): PlayerConfig | undefined {
  return config.players.find(
    p => p.githubUsername.toLowerCase() === username.toLowerCase()
  );
}

async function scanPRs(quests: QuestData[], players: PlayerData[]): Promise<void> {
  if (!GITHUB_TOKEN || !config.github) {
    console.log('\nSkipping PR scan (no GITHUB_TOKEN or github config)');
    return;
  }

  const { org, repos } = config.github;
  const reviewFraction = config.github.reviewPointsFraction ?? 0.25;
  const unlinkedPrPoints = config.github.unlinkedPrPoints ?? 6;

  console.log(`\nScanning PRs across ${repos.length} repos...`);

  const playerMap = new Map(players.map(p => [p.githubUsername.toLowerCase(), p]));
  const questMap = new Map(quests.map(q => [q.id, q]));
  const firstPrSeen = new Set<string>();
  const allContributions: PRContribution[] = [];

  for (const repo of repos) {
    try {
      // Fetch recent merged PRs (last 100)
      const prs = await githubFetch(
        `/repos/${org}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100`
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedPrs = prs.filter((pr: any) => pr.merged_at);
      console.log(`  ${repo}: ${mergedPrs.length} merged PRs`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const pr of mergedPrs) {
        const authorLogin: string = pr.user?.login || '';
        const authorPlayer = findPlayerByGithub(authorLogin);
        const prTitle: string = pr.title || '';
        const prBody: string = pr.body || '';
        const prBranch: string = pr.head?.ref || '';

        // Extract linked quest IDs from title, body, branch
        const linkedIds = extractQuestIds(`${prTitle} ${prBody} ${prBranch}`);

        // Author gets contribution credit for unlinked PRs
        if (linkedIds.length === 0 && authorPlayer) {
          const player = playerMap.get(authorPlayer.githubUsername.toLowerCase());
          if (player) {
            player.completionPoints += unlinkedPrPoints;
            player.totalPoints += unlinkedPrPoints;
            allContributions.push({
              repo, prNumber: pr.number, title: prTitle, url: pr.html_url,
              linkedQuest: null, points: unlinkedPrPoints, type: 'merge',
            });
          }
        }

        // First PR merged bonus
        if (authorPlayer && !firstPrSeen.has(authorPlayer.githubUsername.toLowerCase())) {
          firstPrSeen.add(authorPlayer.githubUsername.toLowerCase());
          const player = playerMap.get(authorPlayer.githubUsername.toLowerCase());
          if (player && config.bonuses.firstPrMerged > 0) {
            player.completionPoints += config.bonuses.firstPrMerged;
            player.totalPoints += config.bonuses.firstPrMerged;
          }
        }

        // Fetch reviewers for this PR
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const reviews: any[] = await githubFetch(
            `/repos/${org}/${repo}/pulls/${pr.number}/reviews`
          );

          // Get unique approving/commenting reviewers (not the author)
          const reviewerLogins = [...new Set(
            reviews
              .filter(r => r.user?.login?.toLowerCase() !== authorLogin.toLowerCase())
              .filter(r => ['APPROVED', 'COMMENTED', 'CHANGES_REQUESTED'].includes(r.state))
              .map(r => r.user?.login as string)
          )];

          for (const reviewerLogin of reviewerLogins) {
            const reviewerPlayer = findPlayerByGithub(reviewerLogin);
            if (!reviewerPlayer) continue;
            const player = playerMap.get(reviewerPlayer.githubUsername.toLowerCase());
            if (!player) continue;

            // Calculate review points based on linked quests
            let reviewPts = 0;
            if (linkedIds.length > 0) {
              for (const qid of linkedIds) {
                const quest = questMap.get(qid);
                if (quest) {
                  reviewPts += Math.round(quest.points * reviewFraction);
                }
              }
            } else {
              // Unlinked PR: fraction of the unlinked PR points
              reviewPts = Math.round(unlinkedPrPoints * reviewFraction);
            }

            if (reviewPts > 0) {
              player.reviewPoints += reviewPts;
              player.totalPoints += reviewPts;
              allContributions.push({
                repo, prNumber: pr.number, title: prTitle, url: pr.html_url,
                linkedQuest: linkedIds[0] || null, points: reviewPts, type: 'review',
              });
            }
          }
        } catch {
          // Reviews API might fail for some PRs, skip silently
        }
      }
    } catch (err) {
      console.log(`  ${repo}: Error scanning — ${err instanceof Error ? err.message : err}`);
    }
  }

  // Re-sort players after PR points
  players.sort((a, b) => b.totalPoints - a.totalPoints);

  console.log(`  PR contributions found: ${allContributions.length}`);
}

async function sync() {
  console.log(`\nQuarter Cup Sync`);
  console.log(`================`);
  console.log(`Project: ${config.projectKey}`);
  console.log(`Sprint: ${config.sprint.name} (${config.sprint.isActive ? 'ACTIVE' : 'inactive'})`);
  console.log(`Players: ${config.players.length}\n`);

  // Fetch all Jira issues
  console.log('Fetching issues from Jira...');
  const issues = await fetchAllIssues();
  console.log(`  Total: ${issues.length} issues\n`);

  // Map to quests
  console.log('Mapping issues to quests...');
  const quests = issues.map(mapIssueToQuest);

  // Sort by priority then points
  const priorityOrder: Priority[] = ['urgent', 'crucial', 'would-love', 'nice-to-have'];
  quests.sort((a, b) => {
    const ai = priorityOrder.indexOf(a.priority);
    const bi = priorityOrder.indexOf(b.priority);
    if (ai !== bi) return ai - bi;
    return b.points - a.points;
  });

  // Stats
  const byPriority = {
    urgent: quests.filter(q => q.priority === 'urgent').length,
    crucial: quests.filter(q => q.priority === 'crucial').length,
    'would-love': quests.filter(q => q.priority === 'would-love').length,
    'nice-to-have': quests.filter(q => q.priority === 'nice-to-have').length,
  };
  const byStatus = {
    open: quests.filter(q => q.status === 'open').length,
    claimed: quests.filter(q => q.status === 'claimed').length,
    completed: quests.filter(q => q.status === 'completed').length,
  };

  console.log(`  Priority: ${byPriority.urgent} urgent, ${byPriority.crucial} crucial, ${byPriority['would-love']} would-love, ${byPriority['nice-to-have']} nice-to-have`);
  console.log(`  Status: ${byStatus.open} open, ${byStatus.claimed} claimed, ${byStatus.completed} completed`);

  // Check for missing labels
  const missingImpact = quests.filter(q => {
    const issue = issues.find(i => i.key === q.id)!;
    return !issue.fields.labels?.some((l: string) => l.startsWith('impact-'));
  });
  const missingEffort = quests.filter(q => {
    const issue = issues.find(i => i.key === q.id)!;
    return !issue.fields.labels?.some((l: string) => l.startsWith('effort-'));
  });

  if (missingImpact.length > 0 || missingEffort.length > 0) {
    console.log(`\n  Warning: ${missingImpact.length} issues missing impact labels, ${missingEffort.length} missing effort labels`);
    console.log(`  These issues use default scoring (would-love/M = 6 pts)`);
  }

  // Build player data
  console.log('\nCalculating player scores...');
  const players = buildPlayerData(quests);

  // Scan GitHub PRs for review points + unlinked contributions
  await scanPRs(quests, players);

  console.log('\nFinal scores:');
  for (const p of players) {
    if (p.totalPoints > 0) {
      console.log(`  ${p.name}: ${p.totalPoints} pts (${p.discoveryPoints} discovery + ${p.completionPoints} completion + ${p.reviewPoints} review)`);
    }
  }

  // Write output
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  const syncedAt = new Date().toISOString();

  // quests.json — strip internal fields
  const questsOutput = {
    quests: quests.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      priority: q.priority,
      effort: q.effort,
      points: q.points,
      status: q.status,
      claimedBy: q.claimedBy,
      completedBy: q.completedBy,
      completedAt: q.completedAt,
      acceptanceCriteria: q.acceptanceCriteria,
      tags: q.tags,
      jiraUrl: q.jiraUrl,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      jiraStatus: q.jiraStatus,
      issueType: q.issueType,
      reporterName: q.reporterName,
      assigneeName: q.assigneeName,
    })),
    syncedAt,
  };

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'quests.json'),
    JSON.stringify(questsOutput, null, 2) + '\n'
  );

  // players.json
  const playersOutput = {
    players,
    season: config.sprint,
    syncedAt,
  };

  fs.writeFileSync(
    path.join(GENERATED_DIR, 'players.json'),
    JSON.stringify(playersOutput, null, 2) + '\n'
  );

  console.log(`\nSync complete!`);
  console.log(`  Quests written: ${quests.length}`);
  console.log(`  Total points available: ${quests.reduce((s, q) => s + q.points, 0)}`);
  console.log(`  Output: ${GENERATED_DIR}`);
  console.log(`  Synced at: ${syncedAt}`);
}

// Run
sync().catch(err => {
  console.error('\nSync failed:', err);
  process.exit(1);
});
