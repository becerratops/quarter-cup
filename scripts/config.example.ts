// ============================================================
// Quarter Cup — Instance Configuration
// ============================================================
// Copy this file to config.ts and customize for your team.
// config.ts is gitignored — it stays private to your instance.
//
// Credentials are always via env vars (never in config):
//   JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN
//   GITHUB_TOKEN (optional — needed for PR scanning)
// ============================================================

export interface PlayerConfig {
  jiraDisplayName: string;
  githubUsername: string;
  name: string;
  role: string;
}

export interface Config {
  /** Jira project key (e.g., "MYPROJECT") */
  projectKey: string;

  /** Map of Jira display names → GitHub usernames + display info */
  players: PlayerConfig[];

  /** Current sprint/season configuration */
  sprint: {
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };

  /** Sprint multiplier bonuses (applied during active sprint only) */
  sprintMultipliers: {
    /** Jira label that marks a ticket as a blocker */
    blockerLabel: string;
    /** Multiplier for blocker tickets (e.g., 1.5 = 50% bonus) */
    blockerBonus: number;
    /** Multiplier for high-impact tickets (e.g., 1.25 = 25% bonus) */
    highImpactBonus: number;
  };

  /** Flat point bonuses for special achievements */
  bonuses: {
    /** One-time bonus for a player's first merged PR */
    firstPrMerged: number;
    /** Bonus for fixing a bug reported by someone else */
    fixingSomeoneElsesBug: number;
  };

  /** GitHub configuration for PR scanning (optional) */
  github?: {
    /** GitHub org or user that owns the repos */
    org: string;
    /** List of repo names to scan for merged PRs */
    repos: string[];
    /** Points awarded for a merged PR that doesn't link to an issue (default: 6) */
    unlinkedPrPoints?: number;
    /** Fraction of quest points awarded to PR reviewer (default: 0.25) */
    reviewPointsFraction?: number;
  };
}

export const CONFIG: Config = {
  projectKey: 'MYPROJECT',

  players: [
    {
      jiraDisplayName: 'Alex Developer',
      githubUsername: 'alex-dev',
      name: 'Alex',
      role: 'Lead Engineer',
    },
    {
      jiraDisplayName: 'Jordan Coder',
      githubUsername: 'jordan-codes',
      name: 'Jordan',
      role: 'Full Stack Engineer',
    },
    {
      jiraDisplayName: 'Sam Shipper',
      githubUsername: 'sam-ships',
      name: 'Sam',
      role: 'Frontend Engineer',
    },
    {
      jiraDisplayName: 'Riley Operator',
      githubUsername: 'riley-ops',
      name: 'Riley',
      role: 'DevOps Engineer',
    },
  ],

  sprint: {
    name: 'Sprint 1 — Q1 2026',
    startDate: '2026-03-18',
    endDate: '2026-03-30',
    isActive: true,
  },

  sprintMultipliers: {
    blockerLabel: 'blocker',
    blockerBonus: 1.5,
    highImpactBonus: 1.25,
  },

  bonuses: {
    firstPrMerged: 10,
    fixingSomeoneElsesBug: 3,
  },

  github: {
    org: 'my-org',
    repos: ['frontend', 'backend'],
    unlinkedPrPoints: 6,
    reviewPointsFraction: 0.25,
  },
};
