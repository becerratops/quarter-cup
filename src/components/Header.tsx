import { CURRENT_SEASON } from '../data/players';
import { TOTAL_POINTS, QUEST_COUNT, URGENT_COUNT } from '../data/quests';
import { Trophy } from './Trophy';

export function Header() {
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(CURRENT_SEASON.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <header style={{
      padding: '32px 24px',
      textAlign: 'center',
      borderBottom: '2px solid #333',
      position: 'relative',
    }}>
      <div style={{ marginBottom: 16 }}>
        <Trophy size={80} />
      </div>

      <h1 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 28,
        color: 'var(--neon-gold)',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
        marginBottom: 8,
        letterSpacing: 2,
      }}>
        QUARTER CUP
      </h1>

      <p style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 9,
        color: 'var(--text-secondary)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>
        {CURRENT_SEASON.name}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        flexWrap: 'wrap',
      }}>
        <StatBlock label="Quests" value={String(QUEST_COUNT)} color="var(--neon-blue)" />
        <StatBlock label="Total Pts" value={String(TOTAL_POINTS)} color="var(--neon-gold)" />
        <StatBlock label="Urgent" value={String(URGENT_COUNT)} color="var(--neon-red)" />
        <StatBlock label="Days Left" value={String(daysLeft)} color={daysLeft <= 3 ? 'var(--neon-red)' : 'var(--neon-green)'} />
      </div>
    </header>
  );
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 24,
        color,
        textShadow: `0 0 12px ${color}40`,
        animation: 'count-up 0.5s ease-out',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 8,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  );
}
