import React, { useState, useEffect } from 'react';
import { UserProfile, CEFRLevel, WordItem, DatamuseSuggestion } from '../../types';
import { initialVocabulary, vocabularyTopics } from '../../data/vocabularyData';
import { addXpToUser, saveUserProfile } from '../../services/storage';
import { fetchDatamuseSuggestions } from '../../services/dictionaryService';
import { WordLookupModal } from '../ui/WordLookupModal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { BookOpen, Volume2, RotateCw, CheckCircle, ChevronLeft, ChevronRight, Shuffle, Gamepad2, Award, Sparkles, Search, ExternalLink } from 'lucide-react';

interface VocabularyViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({ user, onUpdateUser }) => {
  const [words, setWords] = useState<WordItem[]>(initialVocabulary);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'matching' | 'quiz'>('flashcards');

  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<DatamuseSuggestion[]>([]);
  const [lookupWord, setLookupWord] = useState<string | null>(null);

  // Flashcard state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Matching game state
  const [matchingCards, setMatchingCards] = useState<{ id: string; text: string; type: 'en' | 'vi'; wordId: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchingScore, setMatchingScore] = useState<number>(0);

  // Datamuse Autocomplete Effect
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchDatamuseSuggestions(searchQuery).then(res => setSuggestions(res));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtered words
  const filteredWords = words.filter((w) => {
    const levelMatch = selectedLevel === 'All' || w.level === selectedLevel;
    const topicMatch = selectedTopic === 'All' || w.topic === selectedTopic;
    const searchMatch = !searchQuery || w.term.toLowerCase().includes(searchQuery.toLowerCase()) || w.vietnameseMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    return levelMatch && topicMatch && searchMatch;
  });

  const currentWord = filteredWords[currentIndex] || filteredWords[0];

  const handlePlayAudio = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleMastered = (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedWords = words.map((w) => {
      if (w.id === wordId) {
        const nextMastered = !w.mastered;
        if (nextMastered) {
          const updatedUser = {
            ...user,
            wordsLearned: user.wordsLearned + 1
          };
          saveUserProfile(updatedUser);
          onUpdateUser(addXpToUser(15));
        }
        return { ...w, mastered: nextMastered };
      }
      return w;
    });
    setWords(updatedWords);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (filteredWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (filteredWords.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    }
  };

  const handleRandomCard = () => {
    setIsFlipped(false);
    if (filteredWords.length > 1) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      setCurrentIndex(randomIndex);
    }
  };

  // Setup Matching Game
  const startMatchingGame = () => {
    const subset = [...words].sort(() => 0.5 - Math.random()).slice(0, 4);
    const cards: { id: string; text: string; type: 'en' | 'vi'; wordId: string }[] = [];

    subset.forEach((w) => {
      cards.push({ id: `en_${w.id}`, text: w.term, type: 'en', wordId: w.id });
      cards.push({ id: `vi_${w.id}`, text: w.vietnameseMeaning, type: 'vi', wordId: w.id });
    });

    setMatchingCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedCardId(null);
    setMatchedIds([]);
    setMatchingScore(0);
    setActiveTab('matching');
  };

  const handleCardClick = (card: { id: string; text: string; type: 'en' | 'vi'; wordId: string }) => {
    if (matchedIds.includes(card.id)) return;
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      return;
    }

    if (!selectedCardId) {
      setSelectedCardId(card.id);
      if (card.type === 'en') handlePlayAudio(card.text);
      return;
    }

    // Comparing two cards
    const firstCard = matchingCards.find((c) => c.id === selectedCardId);
    if (firstCard && firstCard.wordId === card.wordId && firstCard.type !== card.type) {
      // Match found!
      const newMatched = [...matchedIds, firstCard.id, card.id];
      setMatchedIds(newMatched);
      setSelectedCardId(null);
      setMatchingScore((prev) => prev + 1);

      if (newMatched.length === matchingCards.length) {
        // Complete matching round
        onUpdateUser(addXpToUser(30));
      }
    } else {
      // Mismatch
      setSelectedCardId(card.id);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Dictionary Lookup Modal */}
      {lookupWord && (
        <WordLookupModal
          word={lookupWord}
          onClose={() => setLookupWord(null)}
          merriamWebsterApiKey={user.merriamWebsterApiKey}
        />
      )}

      {/* Top Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen color="var(--accent-purple)" size={32} />
            Học Từ Vựng Tiếng Anh CEFR
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Khám phá từ vựng chuẩn Oxford & Wiktionary, Autocomplete thông minh &amp; Thẻ lật 3D.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveTab('flashcards')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'flashcards' ? 'var(--accent-purple)' : 'transparent',
              color: activeTab === 'flashcards' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600
            }}
          >
            🎴 Thẻ Lật 3D
          </button>
          <button
            onClick={startMatchingGame}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'matching' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'matching' ? '#000' : 'var(--text-secondary)',
              fontWeight: 600
            }}
          >
            🎮 Game Nối Từ
          </button>
        </div>
      </div>

      {/* Autocomplete Search & Filter Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Search Bar with Datamuse Suggestions */}
        <div className="relative">
          <Input
            placeholder="Tra cứu từ vựng (Datamuse Autocomplete API)... Ví dụ: raw, dynamic, hello"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />

          {/* Autocomplete Dropdown List */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchQuery(sug.word);
                    setLookupWord(sug.word);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2.5 flex items-center justify-between text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer transition"
                >
                  <span className="font-medium">{sug.word}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    Tra từ điển <ExternalLink size={12} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level & Topic Filters */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.75rem', fontWeight: 600 }}>CẤP ĐỘ CEFR:</span>
            {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => { setSelectedLevel(lvl); setCurrentIndex(0); }}
                style={{
                  padding: '0.3rem 0.75rem',
                  marginRight: '0.35rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  background: selectedLevel === lvl ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedLevel === lvl ? '#000' : 'var(--text-secondary)',
                  fontWeight: selectedLevel === lvl ? 700 : 500
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }} />

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.75rem', fontWeight: 600 }}>CHỦ ĐỀ:</span>
            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setCurrentIndex(0); }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {vocabularyTopics.map((topic) => (
                <option key={topic} value={topic} style={{ background: '#121824' }}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Render */}
      {activeTab === 'flashcards' ? (
        <div>
          {filteredWords.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Không tìm thấy từ vựng nào phù hợp với từ khóa "{searchQuery}".
              </p>
              {searchQuery && (
                <Button variant="gradient" onClick={() => setLookupWord(searchQuery)}>
                  Tra trực tiếp từ "{searchQuery}" trong Từ điển Online
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* 3D Flip Card Container */}
              <div 
                style={{ 
                  perspective: '1000px', 
                  maxWidth: '650px', 
                  margin: '0 auto 2rem auto', 
                  height: '380px', 
                  cursor: 'pointer' 
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      padding: '2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(18, 24, 36, 0.9))',
                      border: '1px solid rgba(138, 43, 226, 0.3)'
                    }}
                  >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge" style={{ background: 'rgba(0, 240, 255, 0.2)', color: 'var(--accent-cyan)' }}>
                        {currentWord.level} • {currentWord.topic}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLookupWord(currentWord.term);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-white transition flex items-center gap-1"
                        >
                          <Search size={14} /> Tra Chi Tiết
                        </button>

                        <button
                          onClick={(e) => handleToggleMastered(currentWord.id, e)}
                          style={{
                            background: currentWord.mastered ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: currentWord.mastered ? 'var(--accent-green)' : 'var(--text-muted)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem'
                          }}
                        >
                          <CheckCircle size={16} /> {currentWord.mastered ? 'Đã Thuộc (+15 XP)' : 'Đánh dấu thuộc'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                        {currentWord.term}
                      </h2>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)', fontSize: '1.2rem', fontWeight: 500 }}>
                        <span>{currentWord.phonetic}</span>
                        <button
                          onClick={(e) => handlePlayAudio(currentWord.term, e)}
                          style={{ background: 'rgba(0, 240, 255, 0.15)', padding: '0.4rem', borderRadius: '50%', color: 'var(--accent-cyan)' }}
                        >
                          <Volume2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <RotateCw size={14} /> Chạm vào thẻ để xem nghĩa &amp; ví dụ
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      padding: '2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(18, 24, 36, 0.95))',
                      border: '1px solid rgba(0, 240, 255, 0.3)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        Nghĩa Tiếng Việt:
                      </div>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-green)', marginBottom: '1rem' }}>
                        {currentWord.vietnameseMeaning}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                        <strong>Định nghĩa:</strong> {currentWord.definition}
                      </p>
                    </div>

                    <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.04)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Ví dụ thực tế:
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.25rem' }}>
                        "{currentWord.exampleSentence}"
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        &rarr; {currentWord.exampleTranslation}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Chạm lại để lật về mặt trước
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <Button variant="secondary" onClick={handlePrevCard}>
                  <ChevronLeft size={20} /> Từ Trước
                </Button>

                <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {currentIndex + 1} / {filteredWords.length}
                </span>

                <Button variant="secondary" onClick={handleRandomCard}>
                  <Shuffle size={18} style={{ marginRight: '0.35rem' }} /> Ngẫu Nhiên
                </Button>

                <Button variant="gradient" onClick={handleNextCard}>
                  Từ Tiếp Theo <ChevronRight size={20} style={{ marginLeft: '0.25rem' }} />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Matching Game UI */
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gamepad2 color="var(--accent-cyan)" /> Mini-Game: Nối Từ Vựng &amp; Nghĩa
            </h2>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
              Đã ghép: {matchingScore} / 4 cặp
            </div>
          </div>

          {matchedIds.length === matchingCards.length && matchingCards.length > 0 ? (
            <div style={{ padding: '2rem 0' }}>
              <Sparkles size={60} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                Chúc Mừng! Bạn Đã Thắng Game Nối Từ
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Bạn được cộng thêm **+30 XP** vào tài khoản!
              </p>
              <Button variant="gradient" size="lg" onClick={startMatchingGame}>
                <RotateCw size={18} style={{ marginRight: '0.5rem' }} /> Chơi Lượt Mới
              </Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {matchingCards.map((card) => {
                const isMatched = matchedIds.includes(card.id);
                const isSelected = selectedCardId === card.id;

                let bg = 'rgba(255, 255, 255, 0.04)';
                let border = '1px solid var(--glass-border)';
                let color = 'var(--text-primary)';

                if (isMatched) {
                  bg = 'rgba(0, 255, 136, 0.15)';
                  border = '1.5px solid var(--accent-green)';
                  color = 'var(--accent-green)';
                } else if (isSelected) {
                  bg = 'rgba(0, 240, 255, 0.18)';
                  border = '1.5px solid var(--accent-cyan)';
                }

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isMatched}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      border: border,
                      color: color,
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      transition: 'all 0.2s ease',
                      opacity: isMatched ? 0.6 : 1
                    }}
                  >
                    {card.text}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="secondary" size="sm" onClick={startMatchingGame}>
              Làm Mới Trận Đấu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
