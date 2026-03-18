import { useState } from 'react';
import { QUESTS } from '../data/quests';
import type { Quest, Priority } from '../data/quests';
import { QuestCard } from './QuestCard';

type FilterPriority = 'all' | Priority;
type FilterStatus = 'all' | 'open' | 'claimed' | 'completed';

export function QuestBoard() {
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = QUESTS.filter(q => {
    if (priorityFilter !== 'all' && q.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (searchTerm && !q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !q.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const priorityOrder: Priority[] = ['urgent', 'crucial', 'would-love', 'nice-to-have'];
  const sorted = [...filtered].sort((a, b) => {
    const ai = priorityOrder.indexOf(a.priority);
    const bi = priorityOrder.indexOf(b.priority);
    if (ai !== bi) return ai - bi;
    return b.points - a.points;
  });

  const pointsByPriority = (p: Priority) =>
    QUESTS.filter(q => q.priority === p).reduce((sum, q) => sum + q.points, 0);

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 14,
        color: 'var(--neon-gold)',
        textAlign: 'center',
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>
        Quest Board
      </h2>

      {/* Priority summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        <PrioritySummary
          label="Urgent"
          count={QUESTS.filter(q => q.priority === 'urgent').length}
          points={pointsByPriority('urgent')}
          color="var(--color-urgent)"
          active={priorityFilter === 'urgent'}
          onClick={() => setPriorityFilter(priorityFilter === 'urgent' ? 'all' : 'urgent')}
        />
        <PrioritySummary
          label="Crucial"
          count={QUESTS.filter(q => q.priority === 'crucial').length}
          points={pointsByPriority('crucial')}
          color="var(--color-crucial)"
          active={priorityFilter === 'crucial'}
          onClick={() => setPriorityFilter(priorityFilter === 'crucial' ? 'all' : 'crucial')}
        />
        <PrioritySummary
          label="Would Love"
          count={QUESTS.filter(q => q.priority === 'would-love').length}
          points={pointsByPriority('would-love')}
          color="var(--color-would-love)"
          active={priorityFilter === 'would-love'}
          onClick={() => setPriorityFilter(priorityFilter === 'would-love' ? 'all' : 'would-love')}
        />
        <PrioritySummary
          label="Nice to Have"
          count={QUESTS.filter(q => q.priority === 'nice-to-have').length}
          points={pointsByPriority('nice-to-have')}
          color="var(--color-nice-to-have)"
          active={priorityFilter === 'nice-to-have'}
          onClick={() => setPriorityFilter(priorityFilter === 'nice-to-have' ? 'all' : 'nice-to-have')}
        />
      </div>

      {/* Search + Status filter */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Search quests..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '8px 12px',
            background: 'var(--bg-card)',
            border: 'var(--border-pixel)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-terminal)',
            fontSize: 18,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'open', 'claimed', 'completed'] as FilterStatus[]).map(s => (
            <button
              key={s}
              className="pixel-btn"
              onClick={() => setStatusFilter(s)}
              style={{
                fontSize: 8,
                padding: '6px 10px',
                borderColor: statusFilter === s ? 'var(--neon-gold)' : '#555',
                color: statusFilter === s ? 'var(--neon-gold)' : 'var(--text-secondary)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 16,
        color: 'var(--text-secondary)',
        marginBottom: 16,
      }}>
        {sorted.length} quest{sorted.length !== 1 ? 's' : ''} ·{' '}
        {sorted.reduce((s, q) => s + q.points, 0)} pts available
      </div>

      {/* Quest grid */}
      <div className="quest-grid">
        {sorted.map((quest, i) => (
          <QuestCard key={quest.id} quest={quest} index={i} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 40,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-terminal)',
          fontSize: 20,
        }}>
          No quests match your filters.
        </div>
      )}
    </div>
  );
}

function PrioritySummary({
  label,
  count,
  points,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  points: number;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${color}15` : 'var(--bg-card)',
        border: `2px solid ${active ? color : '#333'}`,
        padding: '8px 16px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.15s ease',
        minWidth: 100,
      }}
    >
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 8,
        color,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 14,
        color: 'var(--text-primary)',
      }}>
        {count}
      </div>
      <div style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 14,
        color: 'var(--text-secondary)',
      }}>
        {points} pts
      </div>
    </button>
  );
}
