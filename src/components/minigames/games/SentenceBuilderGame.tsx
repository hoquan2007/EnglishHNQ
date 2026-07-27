import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Layers, CheckCircle, Trophy } from 'lucide-react';
import { SENTENCE_BUILDER_POOL } from '../../../data/miniGamesData';

interface SentenceBuilderProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

// Fisher-Yates shuffle algorithm to guarantee words are properly scrambled
const shuffleWords = (arr: string[]): string[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // If scrambled result matches original order by chance, swap adjacent elements
  if (copy.length > 1 && copy.join(' ') === arr.join(' ')) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
};

export const SentenceBuilderGame: React.FC<SentenceBuilderProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    shuffleWords(SENTENCE_BUILDER_POOL[0].scrambled)
  );
  const [score, setScore] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const currentItem = SENTENCE_BUILDER_POOL[index];

  const handleSelectWord = (word: string, wIndex: number) => {
    setSelectedWords([...selectedWords, word]);
    const nextAvail = [...availableWords];
    nextAvail.splice(wIndex, 1);
    setAvailableWords(nextAvail);
  };

  const handleDeselectWord = (word: string, sIndex: number) => {
    const nextSel = [...selectedWords];
    nextSel.splice(sIndex, 1);
    setSelectedWords(nextSel);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheck = () => {
    if (selectedWords.join(' ') === currentItem.correct) {
      setScore(prev => prev + 1);
    }
    if (index + 1 >= SENTENCE_BUILDER_POOL.length) {
      setIsDone(true);
      onComplete(40);
    } else {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      setSelectedWords([]);
      setAvailableWords(shuffleWords(SENTENCE_BUILDER_POOL[nextIdx].scrambled));
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#FFB800' }}>🏗️ Sentence Builder</h2>
        <span>{index + 1}/{SENTENCE_BUILDER_POOL.length}</span>
      </div>

      {isDone ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Trophy size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2>XẾP CÂU HOÀN HẢO!</h2>
          <p>Điểm: {score}/{SENTENCE_BUILDER_POOL.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+40 XP Đã Thêm! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Dịch câu: <em>"{currentItem.translation}"</em></p>
          
          <div style={{ minHeight: '60px', borderBottom: '2px dashed var(--accent-cyan)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
            {selectedWords.map((w, i) => (
              <Button key={i} variant="primary" size="sm" onClick={() => handleDeselectWord(w, i)}>
                {w}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {availableWords.map((w, i) => (
              <Button key={i} variant="secondary" size="sm" onClick={() => handleSelectWord(w, i)}>
                {w}
              </Button>
            ))}
          </div>

          <Button variant="primary" onClick={handleCheck} disabled={availableWords.length > 0}>
            Xác Nhận Xếp Câu <CheckCircle size={18} style={{ marginLeft: '0.4rem' }} />
          </Button>
        </Card>
      )}
    </div>
  );
};
