import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Activity, Trophy, Flame } from 'lucide-react';

interface WordRunnerProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const RUNNER_STAGES = [
  { target: 'Happiness (Sự hạnh phúc)', wordA: 'Happiness', wordB: 'Hapiness', correct: 'A' },
  { target: 'Delicious (Ngon miệng)', wordA: 'Delicius', wordB: 'Delicious', correct: 'B' },
  { target: 'Environment (Môi trường)', wordA: 'Environment', wordB: 'Enviroment', correct: 'A' }
];

export const WordRunnerGame: React.FC<WordRunnerProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const current = RUNNER_STAGES[index];

  const handleChoice = (lane: 'A' | 'B') => {
    if (lane === current.correct) {
      setScore(prev => prev + 1);
    }
    if (index + 1 >= RUNNER_STAGES.length) {
      setIsFinished(true);
      onComplete(35);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#FF00E5' }}>🏃 Word Runner Arcade</h2>
        <span>Chặng: <strong>{index + 1}/{RUNNER_STAGES.length}</strong></span>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2>HOÀN THÀNH ĐƯỜNG CHẠY!</h2>
          <p>Thu thập từ đúng: {score}/{RUNNER_STAGES.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+35 XP Thưởng! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,0,229,0.1), transparent)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🏃‍♂️</div>
          <h3 style={{ marginBottom: '1.5rem' }}>Mục tiêu: {current.target}</h3>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Né từ sai chính tả và chạy vào làn đường đúng chính tả:</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Button variant="primary" size="lg" onClick={() => handleChoice('A')} style={{ padding: '2rem 1rem', fontSize: '1.2rem' }}>
              Làn 1: {current.wordA}
            </Button>
            <Button variant="primary" size="lg" onClick={() => handleChoice('B')} style={{ padding: '2rem 1rem', fontSize: '1.2rem', background: 'linear-gradient(135deg, #7000FF, #FF00E5)' }}>
              Làn 2: {current.wordB}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
