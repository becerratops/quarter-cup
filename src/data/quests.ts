import questData from './generated/quests.json';

export type Priority = 'urgent' | 'crucial' | 'would-love' | 'nice-to-have';
export type Effort = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type QuestStatus = 'open' | 'claimed' | 'completed';

export interface Quest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  effort: Effort;
  points: number;
  status: QuestStatus;
  claimedBy?: string | null;
  completedBy?: string | null;
  completedAt?: string | null;
  acceptanceCriteria: string[];
  tags: string[];
  jiraUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  jiraStatus?: string;
  issueType?: string;
  reporterName?: string | null;
  assigneeName?: string | null;
}

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

export function calculatePoints(priority: Priority, effort: Effort): number {
  return PRIORITY_MULTIPLIER[priority] * EFFORT_MULTIPLIER[effort];
}

export const QUESTS: Quest[] = questData.quests as Quest[];
export const SYNCED_AT: string | null = questData.syncedAt;

// Derived stats
export const TOTAL_POINTS = QUESTS.reduce((sum, q) => sum + q.points, 0);
export const QUEST_COUNT = QUESTS.length;
export const URGENT_COUNT = QUESTS.filter(q => q.priority === 'urgent').length;
