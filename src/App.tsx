import { useState } from 'react';
import { Header } from './components/Header';
import { Leaderboard } from './components/Leaderboard';
import { QuestBoard } from './components/QuestBoard';
import { HowItWorks } from './components/HowItWorks';
import './theme/retro.css';

type Tab = 'leaderboard' | 'quests' | 'how-it-works';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quests');

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="stars-bg" />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <Header />

        {/* Tab bar */}
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={`tab ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            Quest Board
          </button>
          <button
            className={`tab ${activeTab === 'how-it-works' ? 'active' : ''}`}
            onClick={() => setActiveTab('how-it-works')}
          >
            How It Works
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'quests' && <QuestBoard />}
        {activeTab === 'how-it-works' && <HowItWorks />}

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '40px 0',
          borderTop: '1px solid #222',
          marginTop: 40,
        }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: 'var(--text-secondary)',
            letterSpacing: 1,
          }}>
            QUARTER CUP v1.0
          </div>
          <div style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: 14,
            color: '#444',
            marginTop: 4,
          }}>
            Open source engineering gamification
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
