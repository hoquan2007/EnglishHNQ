import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Shuffle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { GameNotificationModal } from '../ui/GameNotificationModal';

interface WordUnscrambleProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const WORDS_POOL = [
  { word: 'RESILIENCE', hint: 'Khả năng phục hồi, sự kiên cường' },
  { word: 'SUSTAINABILITY', hint: 'Sự phát triển bền vững' },
  { word: 'SERENDIPITY', hint: 'Sự may mắn cờ duyên' },
  { word: 'PERSEVERANCE', hint: 'Sự kiên trì bền chí' },
  { word: 'INNOVATION', hint: 'Sự đổi mới, sáng tạo' }
];

export const WordUnscrambleGame: React.FC<WordUnscrambleProps> = ({ onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    message: '',
    type: 'error'
  });

  useEffect(() => {
    loadWord(currentIndex);
  }, [currentIndex]);

  const loadWord = (index: number) => {
    if (index >= WORDS_POOL.length) {
      setIsFinished(true);
      onComplete(40);
      return;
    }
    const current = WORDS_POOL[index];
    const letters = current.word.split('');
    letters.sort(() => Math.random() - 0.5);
    setScrambled(letters);
    setUserLetters([]);
  };

  const handleLetterClick = (letter: string, index: number) => {
    setUserLetters([...userLetters, letter]);
    const newScrambled = [...scrambled];
    newScrambled.splice(index, 1);
    setScrambled(newScrambled);
  };

  const handleRemoveUserLetter = (letter: string, index: number) => {
    const newUserLetters = [...userLetters];
    newUserLetters.splice(index, 1);
    setUserLetters(newUserLetters);
    setScrambled([...scrambled, letter]);
  };

  const handleCheckAnswer = () => {
    const wordObj = WORDS_POOL[currentIndex];
    if (userLetters.join('') === wordObj.word) {
      setScore(prev => prev + 1);
      setCurrentIndex(prev => prev + 1);
    } else {
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Chưa chính xác! Thử bấm vào các chữ cái đã ghép để bỏ và xếp lại nhé.'
      });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--accent-purple)' }}>🔤 Word Unscramble</h2>
        <span>Câu: <strong>{currentIndex + 1}/{WORDS_POOL.length}</strong></span>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#FFB800' }}>HOÀN THÀNH THỬ THÁCH XẾP TỪ!</h2>
          <p>Bạn đã giải đúng {score}/{WORDS_POOL.length} từ vựng!</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+40 XP Đã Nhận! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Gợi ý: {WORDS_POOL[currentIndex].hint}
          </div>

          {/* User Built Word */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', minHeight: '50px', marginBottom: '2rem' }}>
            {userLetters.map((char, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveUserLetter(char, idx)}
                style={{
                  width: '40px',
                  height: '45px',
                  borderRadius: '8px',
                  background: 'var(--accent-purple)',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Available Scrambled Letters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {scrambled.map((char, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(char, idx)}
                style={{
                  width: '40px',
                  height: '45px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
              >
                {char}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={handleCheckAnswer} disabled={scrambled.length > 0}>
            Xác Nhận Đáp Án <CheckCircle size={18} style={{ marginLeft: '0.4rem' }} />
          </Button>
        </Card>
      )}

      <GameNotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
