export interface Player {
  id: string;
  name: string;
  githubUsername: string;
  avatar: string;
  role: string;
  totalPoints: number;
  questsCompleted: string[];
  questsClaimed: string[];
}

// ============================================================
// EXAMPLE PLAYERS — Replace with your own team
// ============================================================
// To use your own players, create data/players.local.ts
// (gitignored) or connect to your GitHub org via the config.
// ============================================================

export const PLAYERS: Player[] = [
  {
    id: 'p-1',
    name: 'Alex',
    githubUsername: 'alex-dev',
    avatar: '',
    role: 'Lead Engineer',
    totalPoints: 0,
    questsCompleted: [],
    questsClaimed: [],
  },
  {
    id: 'p-2',
    name: 'Jordan',
    githubUsername: 'jordan-codes',
    avatar: '',
    role: 'Full Stack Engineer',
    totalPoints: 0,
    questsCompleted: [],
    questsClaimed: [],
  },
  {
    id: 'p-3',
    name: 'Sam',
    githubUsername: 'sam-ships',
    avatar: '',
    role: 'Frontend Engineer',
    totalPoints: 0,
    questsCompleted: [],
    questsClaimed: [],
  },
  {
    id: 'p-4',
    name: 'Riley',
    githubUsername: 'riley-ops',
    avatar: '',
    role: 'DevOps Engineer',
    totalPoints: 0,
    questsCompleted: [],
    questsClaimed: [],
  },
];

export interface Season {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const CURRENT_SEASON: Season = {
  name: 'Launch Sprint — Q1 2026',
  startDate: '2026-03-18',
  endDate: '2026-03-30',
  isActive: true,
};
