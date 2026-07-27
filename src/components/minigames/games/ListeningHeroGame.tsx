import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Headphones, Volume2, Trophy } from 'lucide-react';
import { playTtsSpeech } from '../../../utils/speechUtils';

interface ListeningHeroProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const LISTENING_WORDS = [
  { word: 'Happiness', options: ['Happiness', 'Sadness', 'Friendship', 'Loneliness'], correct: 0 },
  { word: 'Innovation', options: ['Tradition', 'Innovation', 'Creation', 'Invention'], correct: 1 },
  { word: 'Perseverance', options: ['Patience', 'Tolerance', 'Perseverance', 'Persistence'], correct: 2 }
];

export const ListeningHeroGame: React.FC<ListeningHeroProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const item = LISTENING_WORDS[index];

  const handlePlayAudio = () => {
    if (item) playTtsSpeech(item.word, 'en-US');
  };

  const handleChoice = (i: number) => {
    if (i === item.correct) setScore(prev => prev + 1);
    if (index + 1 >= LISTENING_WORDS.length) {
      setIsDone(true);
      onComplete(35);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#00FF66' }}>🎧 Listening Hero</h2>
        <span>{index + 1}/{LISTENING_WORDS.length}</span>
      </div>

      {isDone ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2>HOÀN THÀNH LISTENING HERO!</h2>
          <p>Điểm tai nghe chuẩn: {score}/{LISTENING_WORDS.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+35 XP Nhận Được! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Bấm nút loa bên dưới để nghe âm thanh từ bản ngữ:</p>
          <Button variant="primary" size="lg" onClick={handlePlayAudio} style={{ marginBottom: '2rem', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 2rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 size={36} />
          </Button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {item.options.map((opt, i) => (
              <Button key={i} variant="secondary" onClick={() => handleChoice(i)}>
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
