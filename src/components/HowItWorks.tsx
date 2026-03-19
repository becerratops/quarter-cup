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
          title="Discover Quests"
          description="File a Jira ticket to discover a quest. You earn 50% of the quest's point value just for finding and documenting the issue. Good bug reports and feature requests are valuable."
          color="var(--neon-purple)"
        />
        <Step
          number={2}
          title="Claim a Quest"
          description="Assign yourself to a Jira ticket to claim the quest. Reference the ticket ID in your branch name (e.g., fix/ISSUETRACK-73-login-error). The quest board updates every 15 minutes."
          color="var(--neon-blue)"
        />
        <Step
          number={3}
          title="Build & Ship"
          description="Write the code to satisfy all acceptance criteria. Each quest has specific conditions — meet them all to earn full points. Quality over quantity."
          color="var(--neon-orange)"
        />
        <Step
          number={4}
          title="Review & Test"
          description="Someone else must review and test your work. Reviewers earn 25% of the quest's points for thorough code review and QA. Self-review doesn't count."
          color="var(--neon-green)"
        />
        <Step
          number={5}
          title="Score Points"
          description="When your PR is merged, you earn 100% of the quest's points. If you also discovered the quest, that's 150% total. The leaderboard updates automatically."
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
                <th style={{ ...thStyle, color: 'var(--color-xl, #ff4444)' }}>XL (3-5d)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-urgent)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Urgent (4x)</td>
                <td style={tdStyle}>4</td>
                <td style={tdStyle}>8</td>
                <td style={tdStyle}>12</td>
                <td style={tdStyle}>20</td>
                <td style={tdHighlight}>32</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-crucial)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Crucial (3x)</td>
                <td style={tdStyle}>3</td>
                <td style={tdStyle}>6</td>
                <td style={tdStyle}>9</td>
                <td style={tdStyle}>15</td>
                <td style={tdHighlight}>24</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-would-love)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Would Love (2x)</td>
                <td style={tdStyle}>2</td>
                <td style={tdStyle}>4</td>
                <td style={tdStyle}>6</td>
                <td style={tdStyle}>10</td>
                <td style={tdHighlight}>16</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, color: 'var(--color-nice-to-have)', fontFamily: 'var(--font-pixel)', fontSize: 9 }}>Nice to Have (1x)</td>
                <td style={tdStyle}>1</td>
                <td style={tdStyle}>2</td>
                <td style={tdStyle}>3</td>
                <td style={tdStyle}>5</td>
                <td style={tdHighlight}>8</td>
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

      {/* Point allocation */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 11,
          color: 'var(--text-primary)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          How Points Are Earned
        </h3>

        <div className="pixel-card">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            fontFamily: 'var(--font-terminal)',
            fontSize: 18,
            color: 'var(--text-primary)',
          }}>
            <PointRow
              label="Discovery"
              detail="File a Jira ticket"
              value="50%"
              color="var(--neon-purple)"
            />
            <PointRow
              label="Completion"
              detail="Close a ticket / merge a PR"
              value="100%"
              color="var(--neon-green)"
            />
            <PointRow
              label="Review"
              detail="Review & test someone else's PR"
              value="25%"
              color="var(--neon-blue)"
            />
            <div style={{
              borderTop: '1px solid #333',
              paddingTop: 12,
              fontSize: 16,
              color: 'var(--text-secondary)',
            }}>
              Find it AND fix it? That's 150% of the quest value.
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Bonuses */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 11,
          color: 'var(--text-primary)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Sprint Bonuses
        </h3>

        <div className="pixel-card">
          <ul style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: 18,
            color: 'var(--text-primary)',
            paddingLeft: 20,
            lineHeight: 1.8,
          }}>
            <li><span style={{ color: 'var(--neon-red)' }}>{'>'}</span> Blocker tickets: <span style={{ color: 'var(--neon-gold)' }}>1.5x</span> completion points</li>
            <li><span style={{ color: 'var(--neon-orange)' }}>{'>'}</span> High-impact tickets: <span style={{ color: 'var(--neon-gold)' }}>1.25x</span> completion points</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> First PR merged ever: <span style={{ color: 'var(--neon-gold)' }}>+10 pts</span> flat bonus</li>
            <li><span style={{ color: 'var(--neon-blue)' }}>{'>'}</span> Fixing someone else's bug: <span style={{ color: 'var(--neon-gold)' }}>+3 pts</span> flat bonus</li>
          </ul>
        </div>
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
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> All acceptance criteria must be met for full points</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> PR must be merged to earn completion points</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Someone else must review your PR — no self-reviews</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Reviewers must pull down and test, not just click approve</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Quality over quantity — a single 32-pt quest beats 32 low-effort tickets</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Helping teammates is encouraged — collaboration is not penalized</li>
            <li><span style={{ color: 'var(--neon-green)' }}>{'>'}</span> Anyone can earn discovery points — you don't need a GitHub account</li>
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

const tdHighlight: React.CSSProperties = {
  ...tdStyle,
  color: 'var(--neon-gold)',
  fontWeight: 'bold',
};

function Step({ number, title, description, color }: {
  number: number;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="pixel-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 20,
        color,
        textShadow: `0 0 12px ${color}40`,
        minWidth: 36,
        textAlign: 'center',
      }}>
        {number}
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 10,
          color,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          {title}
        </div>
        <p style={{
          fontFamily: 'var(--font-terminal)',
          fontSize: 18,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function PointRow({ label, detail, value, color }: {
  label: string;
  detail: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <div>
        <span style={{ color, fontFamily: 'var(--font-pixel)', fontSize: 9 }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>{detail}</span>
      </div>
      <span style={{ color: 'var(--neon-gold)', fontFamily: 'var(--font-pixel)', fontSize: 11 }}>{value}</span>
    </div>
  );
}
