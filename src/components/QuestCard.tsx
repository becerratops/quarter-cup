import { useState } from 'react';
import type { Quest } from '../data/quests';

const EFFORT_DISPLAY: Record<string, { stars: string; label: string }> = {
  XS: { stars: '*', label: '< 1 hour' },
  S: { stars: '**', label: '1-3 hours' },
  M: { stars: '***', label: '3-8 hours' },
  L: { stars: '****', label: '1-2 days' },
  XL: { stars: '*****', label: '3-5 days' },
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'URGENT',
  crucial: 'CRUCIAL',
  'would-love': 'WOULD LOVE',
  'nice-to-have': 'NICE TO HAVE',
};

export function QuestCard({ quest, index }: { quest: Quest; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const effort = EFFORT_DISPLAY[quest.effort] || EFFORT_DISPLAY.M;

  return (
    <div
      className="pixel-card"
      style={{
        cursor: 'pointer',
        animation: `slide-up 0.3s ease-out ${index * 0.05}s both`,
        opacity: quest.status === 'completed' ? 0.6 : 1,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row: ID + Priority + Points */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            {quest.id}
            {quest.jiraUrl && (
              <a
                href={quest.jiraUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  color: 'var(--neon-blue)',
                  textDecoration: 'none',
                  opacity: 0.7,
                  fontSize: 10,
                }}
                title="Open in Jira"
              >
                {'[>]'}
              </a>
            )}
          </span>
          <span className={`priority-badge ${quest.priority}`}>
            {PRIORITY_LABELS[quest.priority]}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 14,
          color: 'var(--neon-gold)',
          textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
        }}>
          {quest.points}<span style={{ fontSize: 7, marginLeft: 2 }}>pts</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 10,
        color: quest.status === 'completed' ? 'var(--neon-green)' : 'var(--text-primary)',
        lineHeight: 1.6,
        marginBottom: 8,
      }}>
        {quest.status === 'completed' && '> '}
        {quest.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 16,
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
        marginBottom: 12,
        display: '-webkit-box',
        WebkitLineClamp: expanded ? 999 : 2,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }}>
        {quest.description}
      </p>

      {/* Effort + Status + Tags */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Effort */}
          <div title={effort.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="effort-stars">{effort.stars}</span>
            <span style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 14,
              color: 'var(--text-secondary)',
            }}>
              {effort.label}
            </span>
          </div>
        </div>

        {/* Status */}
        <StatusBadge status={quest.status} claimedBy={quest.claimedBy} completedBy={quest.completedBy} />
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        marginTop: 8,
      }}>
        {quest.tags.map(tag => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-terminal)',
              fontSize: 13,
              color: 'var(--neon-blue)',
              opacity: 0.6,
              padding: '1px 6px',
              border: '1px solid var(--neon-blue)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Expanded: Acceptance Criteria */}
      {expanded && (
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid #333',
        }}>
          {quest.acceptanceCriteria.length > 0 && (
            <>
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 8,
                color: 'var(--neon-green)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 8,
              }}>
                Acceptance Criteria
              </div>
              <ul style={{
                fontFamily: 'var(--font-terminal)',
                fontSize: 16,
                color: 'var(--text-primary)',
                paddingLeft: 20,
                lineHeight: 1.6,
              }}>
                {quest.acceptanceCriteria.map((criteria, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    <span style={{ color: 'var(--neon-green)', marginRight: 8 }}>{'>'}</span>
                    {criteria}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* How to claim */}
          {quest.status === 'open' && (
            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              background: 'var(--bg-highlight)',
              border: '1px solid #333',
              fontFamily: 'var(--font-terminal)',
              fontSize: 14,
              color: 'var(--text-secondary)',
            }}>
              {quest.jiraUrl ? (
                <>
                  Claim this quest by assigning yourself in{' '}
                  <a
                    href={quest.jiraUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ color: 'var(--neon-blue)' }}
                  >
                    Jira
                  </a>
                  {' '}and referencing <span style={{ color: 'var(--neon-gold)' }}>{quest.id}</span> in
                  your PR title or branch name
                </>
              ) : (
                <>
                  To claim this quest, reference <span style={{ color: 'var(--neon-gold)' }}>{quest.id}</span> in
                  your PR title or branch name (e.g., <span style={{ color: 'var(--neon-blue)' }}>fix/{quest.id.toLowerCase()}-{quest.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}</span>)
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
  claimedBy,
  completedBy,
}: {
  status: string;
  claimedBy?: string | null;
  completedBy?: string | null;
}) {
  const config = {
    open: { label: 'OPEN', color: 'var(--text-secondary)', bg: 'transparent' },
    claimed: { label: `CLAIMED${claimedBy ? ` · @${claimedBy}` : ''}`, color: 'var(--neon-orange)', bg: 'rgba(255,140,0,0.1)' },
    completed: { label: `DONE${completedBy ? ` · @${completedBy}` : ''}`, color: 'var(--neon-green)', bg: 'rgba(57,255,20,0.1)' },
  }[status] || { label: status, color: '#666', bg: 'transparent' };

  return (
    <span style={{
      fontFamily: 'var(--font-pixel)',
      fontSize: 7,
      color: config.color,
      padding: '3px 8px',
      border: `1px solid ${config.color}`,
      background: config.bg,
      textTransform: 'uppercase',
      letterSpacing: 1,
    }}>
      {config.label}
    </span>
  );
}
