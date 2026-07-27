import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Table, CheckCircle, Sparkles } from 'lucide-react';
import { SAMPLE_CROSSWORD_GRID, CROSSWORD_CLUES } from '../../../data/miniGamesData';
import { GameNotificationModal } from '../ui/GameNotificationModal';

interface CrosswordProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

export const CrosswordGame: React.FC<CrosswordProps> = ({ onComplete, onBack }) => {
  const [grid, setGrid] = useState(SAMPLE_CROSSWORD_GRID);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    message: '',
    type: 'error'
  });

  const handleCellChange = (r: number, c: number, val: string) => {
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === r && ci === c) {
          return { ...cell, userLetter: val.toUpperCase() };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const handleCheckSolution = () => {
    let allCorrect = true;
    grid.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlocked && cell.userLetter !== cell.letter) {
          allCorrect = false;
        }
      });
    });

    if (allCorrect) {
      setIsCompleted(true);
      onComplete(45);
    } else {
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Vẫn còn một số ô chữ chưa điền đúng! Hãy kiểm tra lại các gợi ý Ngang / Dọc nhé.'
      });
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#00D2FF' }}>🔍 Vocabulary Crossword</h2>
      </div>

      {isCompleted ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={48} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h2>GIẢI XONG Ô CHỮ TIẾNG ANH!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Tất cả các từ vựng đã được điền chính xác 100%!</p>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+45 XP Nhận Được! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Grid View */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {grid.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    style={{
                      width: '45px',
                      height: '45px',
                      border: '1px solid var(--glass-border)',
                      backgroundColor: cell.isBlocked ? '#111' : 'rgba(255,255,255,0.08)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cell.number && (
                      <span style={{ position: 'absolute', top: '2px', left: '4px', fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                        {cell.number}
                      </span>
                    )}
                    {!cell.isBlocked && (
                      <input
                        type="text"
                        maxLength={1}
                        value={cell.userLetter || ''}
                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          textAlign: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 700
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <Button variant="primary" style={{ marginTop: '1.5rem' }} onClick={handleCheckSolution}>
              Kiểm Tra Ô Chữ <CheckCircle size={18} style={{ marginLeft: '0.4rem' }} />
            </Button>
          </div>

          {/* Clues Panel */}
          <div>
            <h3>Gợi Ý Ô Chữ</h3>
            {CROSSWORD_CLUES.map((clue, i) => (
              <Card key={i} hoverable={false} style={{ marginBottom: '0.75rem', padding: '0.85rem' }}>
                <strong>#{clue.number} ({clue.direction}):</strong> {clue.clue}
              </Card>
            ))}
          </div>
        </div>
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
