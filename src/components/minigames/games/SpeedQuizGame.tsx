import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Zap, Clock, Trophy } from 'lucide-react';

interface SpeedQuizProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const QUESTIONS = [
  { q: 'Synonym of "Huge":', options: ['Tiny', 'Enormous', 'Narrow', 'Slender'], ans: 1 },
  { q: 'She _______ coffee right now.', options: ['drinks', 'is drinking', 'drank', 'drunk'], ans: 1 },
  { q: 'Antonym of "Ancient":', options: ['Old', 'Modern', 'Historic', 'Antique'], ans: 1 },
  { q: 'If it rains, we _______ at home.', options: ['stay', 'will stay', 'stayed', 'would stay'], ans: 1 },
  { q: 'Choose the correct spelling:', options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accommodat'], ans: 1 }
];

export const SpeedQuizGame: React.FC<SpeedQuizProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isFinished) return;
    if (timeLeft <= 0) {
      handleNext(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleNext = (correct: boolean) => {
    if (correct) setScore(prev => prev + 1);
    if (index + 1 >= QUESTIONS.length) {
      setIsFinished(true);
      onComplete(30);
    } else {
      setIndex(prev => prev + 1);
      setTimeLeft(10);
    }
  };

  const q = QUESTIONS[index];

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#FF007A' }}>⚡ Speed Quiz 10s</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft <= 3 ? '#FF3333' : 'var(--accent-cyan)', fontWeight: 700 }}>
          <Clock size={20} /> {timeLeft}s
        </div>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#FFB800' }}>TỐC ĐỘ XUẤT SẮC!</h2>
          <p>Điểm số: {score}/{QUESTIONS.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+30 XP Thưởng! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>{q.q}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {q.options.map((opt, i) => (
              <Button key={i} variant="secondary" onClick={() => handleNext(i === q.ans)}>
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
