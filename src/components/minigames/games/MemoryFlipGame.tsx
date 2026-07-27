import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { RotateCw, Sparkles, Trophy } from 'lucide-react';

interface MemoryFlipProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

const MEMORY_CARDS_DATA = [
  { id: '1', term: 'Ubiquitous', hint: 'Present everywhere', isFlipped: false },
  { id: '2', term: 'Serendipity', hint: 'Happy chance occurrence', isFlipped: false },
  { id: '3', term: 'Perseverance', hint: 'Persistence in effort', isFlipped: false }
];

export const MemoryFlipGame: React.FC<MemoryFlipProps> = ({ onComplete, onBack }) => {
  const [cards, setCards] = useState(MEMORY_CARDS_DATA);
  const [flippedCount, setFlippedCount] = useState<number>(0);

  const handleFlip = (id: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, isFlipped: !c.isFlipped } : c));
    setFlippedCount(prev => prev + 1);
    if (flippedCount >= cards.length * 2) {
      onComplete(30);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#3B82F6' }}>🃏 Memory Flip Cards</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            style={{
              height: '160px',
              borderRadius: 'var(--radius-md)',
              background: card.isFlipped ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
              border: card.isFlipped ? '2px solid #3B82F6' : '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {card.isFlipped ? (
              <>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-cyan)' }}>{card.term}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{card.hint}</p>
              </>
            ) : (
              <span style={{ fontSize: '2rem' }}>🎴</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
      </div>
    </div>
  );
};
