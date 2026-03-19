import { useState } from 'react';
import { PLAYERS } from '../data/players';
import type { Player } from '../data/players';
import { QUESTS } from '../data/quests';
import type { Quest } from '../data/quests';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ranked = [...PLAYERS]
    .map(p => ({ ...p, stats: getPlayerStats(p) }))
    .sort((a, b) => b.stats.points - a.stats.points);

  const maxPoints = Math.max(...ranked.map(r => r.stats.points), 1);

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 18,
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
            isExpanded={expandedId === player.id}
            onToggle={() => setExpandedId(expandedId === player.id ? null : player.id)}
          />
        ))}
      </div>

      {ranked.every(r => r.stats.points === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-terminal)',
          fontSize: 24,
        }}>
          No points scored yet. The quest board awaits...
          <div style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: 20,
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

function PointPill({ value, label, color }: { value: number; label: string; color: string }) {
  if (value === 0) return null;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      background: `${color}15`,
      border: `1px solid ${color}40`,
    }}>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 14, color }}>
        {value}
      </span>
      <span style={{ fontFamily: 'var(--font-terminal)', fontSize: 20, color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}

function QuestLine({ quest, pointLabel, color }: { quest: Quest; pointLabel: string; color: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '5px 0',
      fontFamily: 'var(--font-terminal)',
      fontSize: 20,
      color: 'var(--text-secondary)',
    }}>
      <span style={{ color, fontFamily: 'var(--font-terminal)', fontSize: 20, fontWeight: 'bold', minWidth: 70, textAlign: 'right' }}>
        {pointLabel}
      </span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {quest.jiraUrl ? (
          <a
            href={quest.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--neon-blue)', textDecoration: 'none' }}
            onClick={e => e.stopPropagation()}
          >
            {quest.id}
          </a>
        ) : (
          <span style={{ color: 'var(--text-primary)' }}>{quest.id}</span>
        )}
        <span style={{ color: 'var(--text-primary)' }}>: {quest.title}</span>
      </span>
    </div>
  );
}

function ExpandedDetails({ player }: { player: Player }) {
  const completedQuests = (player.questsCompleted || [])
    .map(id => QUESTS.find(q => q.id === id))
    .filter((q): q is Quest => !!q);

  const discoveredQuests = (player.questsDiscovered || [])
    .map(id => QUESTS.find(q => q.id === id))
    .filter((q): q is Quest => !!q);

  const claimedQuests = (player.questsClaimed || [])
    .map(id => QUESTS.find(q => q.id === id))
    .filter((q): q is Quest => !!q && q.status === 'claimed');

  const hasActivity = completedQuests.length > 0 || discoveredQuests.length > 0 || claimedQuests.length > 0;

  if (!hasActivity) {
    return (
      <div style={{
        padding: '20px 0 8px',
        fontFamily: 'var(--font-terminal)',
        fontSize: 22,
        color: 'var(--text-secondary)',
        textAlign: 'center',
      }}>
        No quest activity yet. The board awaits!
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 0 4px', borderTop: '1px solid #333', marginTop: 12 }}>
      {completedQuests.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 22,
              color: 'var(--neon-green)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 'bold',
            }}>
              Completed ({completedQuests.length})
            </span>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 18,
              color: 'var(--text-secondary)',
            }}>
              full quest value for merging the fix
            </span>
          </div>
          {completedQuests.map(q => (
            <QuestLine key={q.id} quest={q} pointLabel={`+${q.points} pts`} color="var(--neon-green)" />
          ))}
        </div>
      )}

      {claimedQuests.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 22,
              color: 'var(--neon-orange)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 'bold',
            }}>
              In Progress ({claimedQuests.length})
            </span>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 18,
              color: 'var(--text-secondary)',
            }}>
              points awarded when completed
            </span>
          </div>
          {claimedQuests.map(q => (
            <QuestLine key={q.id} quest={q} pointLabel={`${q.points} pts`} color="var(--neon-orange)" />
          ))}
        </div>
      )}

      {discoveredQuests.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 22,
              color: 'var(--neon-purple)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 'bold',
            }}>
              Discovered ({discoveredQuests.length})
            </span>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 18,
              color: 'var(--text-secondary)',
            }}>
              50% of quest value for filing the ticket
            </span>
          </div>
          {discoveredQuests.map(q => (
            <QuestLine key={q.id} quest={q} pointLabel={`+${Math.round(q.points * 0.5)} pts`} color="var(--neon-purple)" />
          ))}
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
  isExpanded,
  onToggle,
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
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const rankColors = ['var(--neon-gold)', '#c0c0c0', '#cd7f32'];
  const rankColor = rank <= 3 ? rankColors[rank - 1] : 'var(--text-secondary)';
  const barWidth = maxPoints > 0 ? (stats.points / maxPoints) * 100 : 0;
  const roleColor = ROLE_COLORS[player.role] || 'var(--text-secondary)';

  return (
    <div
      className="pixel-card"
      onClick={onToggle}
      style={{
        padding: '16px 20px',
        borderColor: rank === 1 && stats.points > 0 ? 'var(--neon-gold)' : isExpanded ? 'var(--neon-blue)' : '#333',
        animation: rank === 1 && stats.points > 0 ? 'glow-gold 2s ease-in-out infinite' : 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Rank — pixel font, big */}
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 22,
          color: rankColor,
          width: 50,
          textAlign: 'center',
          textShadow: rank === 1 && stats.points > 0 ? `0 0 10px ${rankColor}` : 'none',
        }}>
          #{rank}
        </div>

        {/* Avatar */}
        <PixelAvatar name={player.name} size={48} />

        {/* Info — terminal font for readability */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 26,
              color: 'var(--text-primary)',
              fontWeight: 'bold',
            }}>
              {player.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 22,
              color: 'var(--text-secondary)',
            }}>
              @{player.githubUsername}
            </span>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 18,
              color: roleColor,
              padding: '2px 8px',
              border: `1px solid ${roleColor}`,
            }}>
              {player.role}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 10,
            background: '#1a1a2e',
            borderRadius: 0,
            border: '1px solid #333',
            overflow: 'hidden',
            marginBottom: 10,
          }}>
            <div style={{
              height: '100%',
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, ${rankColor}, ${rankColor}88)`,
              transition: 'width 0.5s ease-out',
              boxShadow: barWidth > 0 ? `0 0 8px ${rankColor}40` : 'none',
            }} />
          </div>

          {/* Point breakdown pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <PointPill value={stats.discoveryPoints} label="pts filing tickets" color="var(--neon-purple)" />
            <PointPill value={stats.completionPoints} label="pts building" color="var(--neon-green)" />
            <PointPill value={stats.reviewPoints} label="pts reviewing" color="var(--neon-blue)" />
            {stats.points === 0 && (
              <span style={{ fontFamily: 'var(--font-terminal)', fontSize: 20, color: 'var(--text-secondary)' }}>
                {stats.claimed > 0 ? `${stats.claimed} quests in progress` : 'No points yet'}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-terminal)', fontSize: 18, opacity: 0.5, color: 'var(--text-secondary)' }}>
              {isExpanded ? '▲ collapse' : '▼ details'}
            </span>
          </div>
        </div>

        {/* Points — pixel font, big accent */}
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 22,
          color: stats.points > 0 ? rankColor : 'var(--text-secondary)',
          textAlign: 'right',
          minWidth: 80,
          textShadow: stats.points > 0 ? `0 0 8px ${rankColor}40` : 'none',
        }}>
          {stats.points}
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 10,
            color: 'var(--text-secondary)',
            marginTop: 2,
          }}>
            PTS
          </div>
        </div>
      </div>

      {isExpanded && <ExpandedDetails player={player} />}
    </div>
  );
}
