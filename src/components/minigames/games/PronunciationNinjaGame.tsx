import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Mic, Volume2, Trophy, Sparkles } from 'lucide-react';
import { startSpeechRecognition } from '../../../utils/speechUtils';

interface PronunciationNinjaProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const TARGET_WORDS = [
  { word: 'Perseverance', vi: 'Sự kiên trì' },
  { word: 'Sustainability', vi: 'Phát triển bền vững' },
  { word: 'Serendipity', vi: 'Sự may mắn cờ duyên' }
];

export const PronunciationNinjaGame: React.FC<PronunciationNinjaProps> = ({ onComplete, onBack }) => {
  const [index, setIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const current = TARGET_WORDS[index];

  const handleRecord = () => {
    setIsRecording(true);
    setSpokenText('Đang lắng nghe giọng nói của Ninja...');

    startSpeechRecognition(
      (transcript: string) => {
        setIsRecording(false);
        setSpokenText(transcript);
        if (transcript.toLowerCase().includes(current.word.toLowerCase())) {
          setScore(prev => prev + 1);
        }
      },
      (error: string) => {
        setIsRecording(false);
        setSpokenText('Chưa nghe rõ, hãy thử bấm nói lại nhé!');
      }
    );
  };

  const handleNext = () => {
    if (index + 1 >= TARGET_WORDS.length) {
      setIsFinished(true);
      onComplete(45);
    } else {
      setIndex(prev => prev + 1);
      setSpokenText('');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#A855F7' }}>🥷 Pronunciation Ninja</h2>
        <span>{index + 1}/{TARGET_WORDS.length}</span>
      </div>

      {isFinished ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2>NINJA PHÁT ÂM THUẦN THỤC!</h2>
          <p>Phát âm chuẩn: {score}/{TARGET_WORDS.length}</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+45 XP Thưởng! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <Card hoverable={false} style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>{current.word}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>({current.vi})</p>

          <Button
            variant="primary"
            size="lg"
            onClick={handleRecord}
            disabled={isRecording}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isRecording ? '#FF3333' : 'linear-gradient(135deg, #A855F7, #7000FF)'
            }}
          >
            <Mic size={40} />
          </Button>

          {spokenText && (
            <p style={{ fontStyle: 'italic', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>
              Giọng bạn thu được: "{spokenText}"
            </p>
          )}

          <Button variant="secondary" onClick={handleNext}>
            Chuyển Từ Tiếp Theo ➡️
          </Button>
        </Card>
      )}
    </div>
  );
};
