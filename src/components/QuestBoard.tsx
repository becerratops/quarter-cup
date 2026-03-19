import { useState } from 'react';
import { QUESTS } from '../data/quests';
import type { Priority } from '../data/quests';
import { QuestCard } from './QuestCard';

type FilterPriority = 'all' | Priority;
type FilterStatus = 'active' | 'open' | 'claimed' | 'completed' | 'all';

export function QuestBoard() {
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('active');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = QUESTS.filter(q => {
    if (priorityFilter !== 'all' && q.priority !== priorityFilter) return false;
    if (statusFilter === 'active' && q.status === 'completed') return false;
    if (statusFilter === 'open' && q.status !== 'open') return false;
    if (statusFilter === 'claimed' && q.status !== 'claimed') return false;
    if (statusFilter === 'completed' && q.status !== 'completed') return false;
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

  const activeQuests = QUESTS.filter(q => q.status !== 'completed');
  const completedCount = QUESTS.filter(q => q.status === 'completed').length;

  const pointsByPriority = (p: Priority) =>
    activeQuests.filter(q => q.priority === p).reduce((sum, q) => sum + q.points, 0);

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 18,
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
          count={activeQuests.filter(q => q.priority === 'urgent').length}
          points={pointsByPriority('urgent')}
          color="var(--color-urgent)"
          active={priorityFilter === 'urgent'}
          onClick={() => setPriorityFilter(priorityFilter === 'urgent' ? 'all' : 'urgent')}
        />
        <PrioritySummary
          label="Crucial"
          count={activeQuests.filter(q => q.priority === 'crucial').length}
          points={pointsByPriority('crucial')}
          color="var(--color-crucial)"
          active={priorityFilter === 'crucial'}
          onClick={() => setPriorityFilter(priorityFilter === 'crucial' ? 'all' : 'crucial')}
        />
        <PrioritySummary
          label="Would Love"
          count={activeQuests.filter(q => q.priority === 'would-love').length}
          points={pointsByPriority('would-love')}
          color="var(--color-would-love)"
          active={priorityFilter === 'would-love'}
          onClick={() => setPriorityFilter(priorityFilter === 'would-love' ? 'all' : 'would-love')}
        />
        <PrioritySummary
          label="Nice to Have"
          count={activeQuests.filter(q => q.priority === 'nice-to-have').length}
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
            padding: '10px 14px',
            background: 'var(--bg-card)',
            border: 'var(--border-pixel)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-terminal)',
            fontSize: 20,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'active' as FilterStatus, label: 'To Do' },
            { key: 'open' as FilterStatus, label: 'Open' },
            { key: 'claimed' as FilterStatus, label: 'Claimed' },
            { key: 'completed' as FilterStatus, label: 'Done' },
            { key: 'all' as FilterStatus, label: 'All' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              style={{
                fontFamily: 'var(--font-terminal)',
                fontSize: 18,
                padding: '8px 14px',
                border: `2px solid ${statusFilter === key ? 'var(--neon-gold)' : '#555'}`,
                background: statusFilter === key ? 'rgba(255,215,0,0.1)' : 'transparent',
                color: statusFilter === key ? 'var(--neon-gold)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 20,
        color: 'var(--text-secondary)',
        marginBottom: 16,
      }}>
        {sorted.length} quest{sorted.length !== 1 ? 's' : ''} ·{' '}
        {sorted.reduce((s, q) => s + q.points, 0)} pts available
        {statusFilter === 'active' && completedCount > 0 && (
          <span style={{ marginLeft: 12, color: 'var(--neon-green)', opacity: 0.6 }}>
            ({completedCount} completed, hidden)
          </span>
        )}
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
          fontSize: 22,
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
        padding: '10px 18px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.15s ease',
        minWidth: 110,
      }}
    >
      <div style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 20,
        color,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        fontWeight: 'bold',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 16,
        color: 'var(--text-primary)',
      }}>
        {count}
      </div>
      <div style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: 18,
        color: 'var(--text-secondary)',
      }}>
        {points} pts
      </div>
    </button>
  );
}
