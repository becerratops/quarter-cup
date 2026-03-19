import { PLAYERS } from '../data/players';
import type { Player } from '../data/players';
import { QUESTS } from '../data/quests';
import { PixelAvatar } from './PixelAvatar';

const ROLE_COLORS: Record<string, string> = {
  'Head of Product': 'var(--neon-purple)',
  'Head of Engineering': 'var(--neon-blue)',
  'Product Engineer': 'var(--neon-green)',
  'COO': 'var(--neon-orange)',
  'CEO': 'var(--neon-gold)',
  'Manager of Sales': 'var(--neon-orange)',
  'Head of Partnerships': 'var(--neon-blue)',
};

function getPlayerStats(player: Player) {
  const completed = QUESTS.filter(q => q.completedBy === player.githubUsername);
  const claimed = QUESTS.filter(q => q.claimedBy === player.githubUsername && q.status === 'claimed');
  const discovered = player.questsDiscovered?.length || 0;

  // Use pre-calculated points from sync, fall back to quest-based calculation
  const points = player.totalPoints > 0
    ? player.totalPoints
    : completed.reduce((sum, q) => sum + q.points, 0);

  return {
    completed: completed.length,
    claimed: claimed.length,
    discovered,
    points,
    discoveryPoints: player.discoveryPoints || 0,
    completionPoints: player.completionPoints || 0,
    reviewPoints: player.reviewPoints || 0,
  };
}

export function Leaderboard() {
  const ranked = [...PLAYERS]
    .map(p => ({ ...p, stats: getPlayerStats(p) }))
    .sort((a, b) => b.stats.points - a.stats.points);

  const maxPoints = Math.max(...ranked.map(r => r.stats.points), 1);

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 14,
        color: 'var(--neon-gold)',
        textAlign: 'center',
        marginBottom: 32,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>
        Leaderboard
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ranked.map((player, index) => (
          <LeaderboardRow
            key={player.id}
            player={player}
            rank={index + 1}
            stats={player.stats}
            maxPoints={maxPoints}
          />
        ))}
      </div>

      {ranked.every(r => r.stats.points === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-terminal)',
          fontSize: 22,
        }}>
          No points scored yet. The quest board awaits...
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 10,
            marginTop: 16,
            color: 'var(--neon-gold)',
            opacity: 0.6,
          }}>
            File a Jira ticket to discover quests, merge PRs to complete them!
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({
  player,
  rank,
  stats,
  maxPoints,
}: {
  player: Player;
  rank: number;
  stats: {
    completed: number;
    claimed: number;
    discovered: number;
    points: number;
    discoveryPoints: number;
    completionPoints: number;
    reviewPoints: number;
  };
  maxPoints: number;
}) {
  const rankColors = ['var(--neon-gold)', '#c0c0c0', '#cd7f32'];
  const rankColor = rank <= 3 ? rankColors[rank - 1] : 'var(--text-secondary)';
  const barWidth = maxPoints > 0 ? (stats.points / maxPoints) * 100 : 0;
  const roleColor = ROLE_COLORS[player.role] || 'var(--text-secondary)';

  return (
    <div
      className="pixel-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 16px',
        borderColor: rank === 1 && stats.points > 0 ? 'var(--neon-gold)' : '#333',
        animation: rank === 1 && stats.points > 0 ? 'glow-gold 2s ease-in-out infinite' : 'none',
      }}
    >
      {/* Rank */}
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 18,
        color: rankColor,
        width: 36,
        textAlign: 'center',
        textShadow: rank === 1 && stats.points > 0 ? `0 0 10px ${rankColor}` : 'none',
      }}>
        #{rank}
      </div>

      {/* Avatar */}
      <PixelAvatar name={player.name} size={40} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 11,
            color: 'var(--text-primary)',
          }}>
            {player.name}
          </span>
          <span style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: 16,
            color: 'var(--text-secondary)',
          }}>
            @{player.githubUsername}
          </span>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 7,
            color: roleColor,
            padding: '1px 6px',
            border: `1px solid ${roleColor}`,
            opacity: 0.8,
          }}>
            {player.role}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 8,
          background: '#1a1a2e',
          borderRadius: 0,
          border: '1px solid #333',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${rankColor}, ${rankColor}88)`,
            transition: 'width 0.5s ease-out',
            boxShadow: barWidth > 0 ? `0 0 8px ${rankColor}40` : 'none',
          }} />
        </div>

        {/* Point breakdown */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 4,
          fontFamily: 'var(--font-terminal)',
          fontSize: 14,
          color: 'var(--text-secondary)',
          flexWrap: 'wrap',
        }}>
          {stats.discoveryPoints > 0 && (
            <span title="Points from filing Jira tickets">
              <span style={{ color: 'var(--neon-purple)' }}>{stats.discoveryPoints}</span> discovered
            </span>
          )}
          {stats.completionPoints > 0 && (
            <span title="Points from completing quests">
              <span style={{ color: 'var(--neon-green)' }}>{stats.completionPoints}</span> completed
            </span>
          )}
          {stats.reviewPoints > 0 && (
            <span title="Points from reviewing PRs">
              <span style={{ color: 'var(--neon-blue)' }}>{stats.reviewPoints}</span> reviewed
            </span>
          )}
          {stats.points === 0 && (
            <>
              <span>{stats.completed} completed</span>
              <span>{stats.claimed} in progress</span>
            </>
          )}
        </div>
      </div>

      {/* Points */}
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 16,
        color: stats.points > 0 ? rankColor : 'var(--text-secondary)',
        textAlign: 'right',
        minWidth: 60,
        textShadow: stats.points > 0 ? `0 0 8px ${rankColor}40` : 'none',
      }}>
        {stats.points}
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 7,
          color: 'var(--text-secondary)',
          marginTop: 2,
        }}>
          PTS
        </div>
      </div>
    </div>
  );
}
