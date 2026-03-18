export function HowItWorks() {
  return (
    <div style={{ padding: '24px 0', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 14,
        color: 'var(--neon-gold)',
        textAlign: 'center',
        marginBottom: 32,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>
        How It Works
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Step
          number={1}
          title="Pick a Quest"
          description="Browse the Quest Board and find something you want to tackle. Each quest has a point value based on priority and effort. Higher priority + harder quests = more points."
          color="var(--neon-blue)"
        />
        <Step
          number={2}
          title="Claim It"
          description='Create a branch referencing the quest ID in your branch name (e.g., fix/q-001-rc-showing-error). This marks it as claimed so others know you&apos;re on it.'
          color="var(--neon-purple)"
        />
        <Step
          number={3}
          title="Build & Ship"
          description="Write the code to satisfy all acceptance criteria listed on the quest card. Each quest has specific test conditions — meet them all to earn full points."
          color="var(--neon-orange)"
        />
        <Step
          number={4}
          title="Score Points"
          description="When your PR is merged to dev, your points are awarded. The leaderboard updates and everyone can see you climbing the ranks."
          color="var(--neon-green)"
        />
        <Step
          number={5}
          title="Win the Cup"
          description="At the end of the sprint, the engineer with the most points wins the Quarter Cup. Glory, bragging rights, and a real reward await."
          color="var(--neon-gold)"
        />
      </div>

      {/* Points table */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 11,
          color: 'var(--text-primary)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Point Values
        </h3>

        <div className="pixel-card" style={{ overflow: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-terminal)',
            fontSize: 18,
          }}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={{ ...thStyle, color: 'var(--color-xs)' }}>XS (&lt;1h)</th>
                <th style={{ ...thStyle, color: 'var(--color-s)' }}>S (1-3h)</th>
                <th style={{ ...thStyle, color: 'var(--color-m)' }}>M (3-8h)</th>
                <th style={{ ...thStyle, color: 'var(--color-l)' }}>L (1-2d)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-urgent)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Urgent (4x)</td>
                <td style={tdStyle}>4</td>
                <td style={tdStyle}>8</td>
                <td style={tdStyle}>12</td>
                <td style={tdStyle}>20</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-crucial)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Crucial (3x)</td>
                <td style={tdStyle}>3</td>
                <td style={tdStyle}>6</td>
                <td style={tdStyle}>9</td>
                <td style={tdStyle}>15</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-would-love)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Would Love (2x)</td>
                <td style={tdStyle}>2</td>
                <td style={tdStyle}>4</td>
                <td style={tdStyle}>6</td>
                <td style={tdStyle}>10</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-nice-to-have)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Nice to Have (1x)</td>
                <td style={tdStyle}>1</td>
                <td style={tdStyle}>2</td>
                <td style={tdStyle}>3</td>
                <td style={tdStyle}>5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{
          fontFamily: 'var(--font-terminal)',
          fontSize: 16,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginTop: 12,
        }}>
          Points = Priority Multiplier x Effort Multiplier
        </p>
      </div>

      {/* Rules */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 11,
          color: 'var(--text-primary)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Rules
        </h3>

        <div className="pixel-card">
          <ul style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: 18,
            color: 'var(--text-primary)',
            paddingLeft: 20,
            lineHeight: 1.8,
          }}>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> One quest claimed at a time per person (finish or release before claiming another)</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> All acceptance criteria must be met for full points</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> PR must be merged to <code style={{ color: 'var(--neon-blue)' }}>dev</code> to score</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Code quality matters — rushed PRs that break things lose points</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Helping teammates doesn't cost you — collaboration is encouraged</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> If you're stuck, ask. The goal is shipping, not struggling alone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'center',
  borderBottom: '1px solid #333',
  fontFamily: 'var(--font-pixel)',
  fontSize: 9,
};

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'center',
  borderBottom: '1px solid #222',
  color: 'var(--text-primary)',
};
