import playerData from './generated/players.json';

export interface Player {
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

export interface Season {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const PLAYERS: Player[] = playerData.players as Player[];

export const CURRENT_SEASON: Season = playerData.season as Season;

export const SYNCED_AT: string | null = playerData.syncedAt;
