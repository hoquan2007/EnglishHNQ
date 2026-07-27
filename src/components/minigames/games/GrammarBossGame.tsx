import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Swords, Shield, Heart, Sparkles } from 'lucide-react';
import { BOSS_BATTLE_STAGES } from '../../../data/miniGamesData';

interface GrammarBossProps {
  onComplete: (xp: number) => void;
  onBack: () => void;
}

export const GrammarBossGame: React.FC<GrammarBossProps> = ({ onComplete, onBack }) => {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [qIndex, setQIndex] = useState<number>(0);
  const [bossHp, setBossHp] = useState<number>(BOSS_BATTLE_STAGES[0].hp);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const stage = BOSS_BATTLE_STAGES[stageIndex];
  const question = stage.questions[qIndex];

  const handleAttack = (chosenIndex: number) => {
    if (chosenIndex === question.ans) {
      const damage = question.damage;
      const newBossHp = Math.max(0, bossHp - damage);
      setBossHp(newBossHp);
      if (newBossHp === 0) {
        if (stageIndex + 1 >= BOSS_BATTLE_STAGES.length) {
          setIsVictory(true);
          onComplete(50);
        } else {
          setStageIndex(prev => prev + 1);
          setQIndex(0);
          setBossHp(BOSS_BATTLE_STAGES[stageIndex + 1].hp);
        }
        return;
      }
    } else {
      setPlayerHp(prev => Math.max(0, prev - 25));
    }
    setQIndex(prev => (prev + 1) % stage.questions.length);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#FF3333' }}>⚔️ Grammar Boss Battle RPG</h2>
        <span>Màn: <strong>{stageIndex + 1}/{BOSS_BATTLE_STAGES.length}</strong></span>
      </div>

      {isVictory ? (
        <Card hoverable={false} style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={64} color="#FFB800" style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: '#FFB800' }}>ĐÃ TIÊU DIỆT TẤT CẢ TRÙM NGỮ PHÁP!</h1>
          <p>Bạn là Dũng Sĩ Ngữ Pháp Đỉnh Cao!</p>
          <div style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)', margin: '1.5rem 0' }}>+50 XP Thưởng Khủng! ⚡</div>
          <Button variant="primary" onClick={onBack}>Về Arcade Hub</Button>
        </Card>
      ) : (
        <div>
          {/* Battle Arena View */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Player Card */}
            <Card hoverable={false} style={{ padding: '1.5rem', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>🧙‍♂️</span>
                <div>
                  <h4 style={{ margin: 0 }}>Dũng Sĩ HNQ</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FF3333', fontSize: '0.85rem' }}>
                    <Heart size={14} /> HP: {playerHp}/100
                  </div>
                </div>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${playerHp}%`, height: '100%', background: '#FF3333', transition: 'all 0.3s ease' }}></div>
              </div>
            </Card>

            {/* Boss Card */}
            <Card hoverable={false} style={{ padding: '1.5rem', background: 'rgba(255, 51, 51, 0.05)', border: '1px solid rgba(255, 51, 51, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{stage.avatar}</span>
                <div>
                  <h4 style={{ margin: 0, color: '#FF3333' }}>{stage.bossName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FFB800', fontSize: '0.85rem' }}>
                    <Shield size={14} /> Boss HP: {bossHp}/{stage.hp}
                  </div>
                </div>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(bossHp / stage.hp) * 100}%`, height: '100%', background: '#FFB800', transition: 'all 0.3s ease' }}></div>
              </div>
            </Card>
          </div>

          {/* Question Skill Attack */}
          <Card hoverable={false} style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>🔥 Tấn công bằng chiêu thức Ngữ pháp: "{question.q}"</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {question.options.map((opt, idx) => (
                <Button key={idx} variant="primary" onClick={() => handleAttack(idx)}>
                  ⚔️ {opt}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
