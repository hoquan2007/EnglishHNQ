import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types';
import { RankBadge } from '../ui/RankBadge';
import { Flame, Key, Search, X, Loader2, BookOpen, Zap, Crown, Star } from 'lucide-react';
import { WordLookupModal } from '../ui/WordLookupModal';
import { fetchDatamuseSuggestions } from '../../services/dictionaryService';
import { DatamuseSuggestion } from '../../types';

interface HeaderProps {
  user: UserProfile;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenSettings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DatamuseSuggestion[]>([]);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate XP progress percentage
  const nextRankXp = 1000;
  const xpProgress = Math.min((user.xp % nextRankXp) / nextRankXp * 100, 100);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await fetchDatamuseSuggestions(searchQuery);
        setSuggestions(results.slice(0, 8));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (word: string) => {
    setLookupWord(word);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLookupWord(searchQuery.trim());
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Get rank glow color
  const getRankGlow = () => {
    switch (user.rank) {
      case 'master': return '0 0 25px rgba(255, 0, 85, 0.6)';
      case 'diamond': return '0 0 25px rgba(168, 85, 247, 0.6)';
      case 'platinum': return '0 0 25px rgba(0, 229, 255, 0.6)';
      case 'gold': return '0 0 25px rgba(255, 215, 0, 0.6)';
      case 'silver': return '0 0 25px rgba(168, 178, 193, 0.6)';
      default: return '0 0 25px rgba(205, 127, 50, 0.6)';
    }
  };

  return (
    <>
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(10, 13, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          gap: '1.5rem',
        }}
      >
        {/* Left: Quick Stats - Redesigned */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexShrink: 0,
        }}>
          {/* Streak Badge - Glowing Fire */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: user.streak > 0
                ? 'linear-gradient(135deg, rgba(255, 100, 0, 0.2), rgba(255, 50, 0, 0.15))'
                : 'rgba(255, 255, 255, 0.03)',
              border: user.streak > 0
                ? '1px solid rgba(255, 140, 0, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              boxShadow: user.streak > 0
                ? '0 0 20px rgba(255, 100, 0, 0.3), inset 0 0 15px rgba(255, 100, 0, 0.1)'
                : 'none',
            }}
            title="Chuỗi ngày học liên tiếc"
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Flame
                size={22}
                style={{
                  color: user.streak > 0 ? '#ff6600' : '#666',
                  filter: user.streak > 0
                    ? 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.8))'
                    : 'none',
                  animation: user.streak > 0 ? 'flame-flicker 0.8s ease-in-out infinite alternate' : 'none',
                }}
              />
              {user.streak >= 7 && (
                <Crown
                  size={12}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    color: '#ffd700',
                    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: user.streak > 0 ? '#ff8800' : '#666',
                lineHeight: 1,
              }}>
                {user.streak}
              </span>
              <span style={{
                fontSize: '0.6rem',
                color: '#888',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}>
                STREAK
              </span>
            </div>
          </div>

          {/* XP Badge with Rank - Glowing */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 0.75rem 0.4rem 0.5rem',
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(100, 0, 180, 0.1))',
            border: '1px solid rgba(138, 43, 226, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.25), inset 0 0 15px rgba(138, 43, 226, 0.08)',
          }}>
            <div style={{
              position: 'relative',
              filter: `drop-shadow(${getRankGlow()})`,
            }}>
              <RankBadge rank={user.rank} size="md" />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Zap size={12} style={{ color: '#a855f7' }} />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#c084fc',
                }}>
                  {user.xp}
                </span>
              </div>
              <div style={{
                width: '60px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${xpProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                  borderRadius: '9999px',
                  boxShadow: '0 0 8px rgba(168, 85, 247, 0.6)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Compact Search Bar with Highlighted Magnifying Glass */}
        <div
          ref={searchRef}
          style={{
            flex: 1,
            maxWidth: '420px',
            position: 'relative',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              {/* Subtle Glow Container */}
              <div style={{
                position: 'absolute',
                inset: '-1px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.4), rgba(138, 43, 226, 0.3))',
                opacity: 0.6,
              }} />

              {/* Main Search Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                padding: '0.65rem 0.9rem 0.65rem 0.9rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(18, 24, 36, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.25s ease',
              }}>

                {/* Magnifying Glass Icon - Highlighted */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* Subtle glow ring */}
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, transparent 70%)',
                  }} />

                  {/* Magnifying glass */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(138, 43, 226, 0.1))',
                    border: '1.5px solid #00f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.4), inset 0 0 8px rgba(0, 240, 255, 0.15)',
                    position: 'relative',
                  }}>
                    {isSearching ? (
                      <Loader2
                        size={16}
                        style={{
                          color: '#00f0ff',
                          filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.8))',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                    ) : (
                      <Search
                        size={16}
                        style={{
                          color: '#00f0ff',
                          filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.8))',
                        }}
                      />
                    )}

                    {/* Handle */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-3px',
                      right: '-3px',
                      width: '8px',
                      height: '8px',
                      background: 'linear-gradient(135deg, #00f0ff, #8a2be2)',
                      borderRadius: '2px',
                      transform: 'rotate(45deg)',
                      boxShadow: '0 0 6px rgba(0, 240, 255, 0.5)',
                    }} />
                  </div>
                </div>

                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsFocused(true);
                    suggestions.length > 0 && setShowSuggestions(true);
                  }}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Tra từ vựng..."
                  style={{
                    flex: 1,
                    padding: '0',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                />

                {/* Clear Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      background: 'rgba(255, 100, 100, 0.15)',
                      border: '1px solid rgba(255, 100, 100, 0.3)',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#ff6464',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(15, 20, 35, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 240, 255, 0.1)',
              overflow: 'hidden',
              zIndex: 100,
              animation: 'dropdown-appear 0.2s ease',
            }}>
              <div style={{
                padding: '0.5rem 0.85rem',
                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(138, 43, 226, 0.05))',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <Search size={12} style={{ color: '#00f0ff' }} />
                <span style={{
                  fontSize: '0.7rem',
                  color: '#00f0ff',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}>
                  Gợi ý từ vựng
                </span>
              </div>

              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion.word)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Search size={13} style={{ color: '#00f0ff', opacity: 0.7 }} />
                  <span style={{ fontWeight: 500 }}>{suggestion.word}</span>
                  {suggestion.score && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 215, 0, 0.15)',
                    }}>
                      <Star size={9} fill="#ffd700" style={{ marginRight: '3px', verticalAlign: 'middle' }} />
                      {suggestion.score}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions & User */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexShrink: 0,
        }}>
          {/* API Key Status - Glowing */}
          <button
            onClick={onOpenSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '14px',
              background: user.geminiApiKey
                ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 200, 100, 0.1))'
                : 'linear-gradient(135deg, rgba(255, 100, 100, 0.15), rgba(255, 60, 60, 0.1))',
              border: `1px solid ${
                user.geminiApiKey
                  ? 'rgba(0, 255, 136, 0.4)'
                  : 'rgba(255, 100, 100, 0.4)'
              }`,
              boxShadow: user.geminiApiKey
                ? '0 0 15px rgba(0, 255, 136, 0.2)'
                : '0 0 15px rgba(255, 100, 100, 0.2)',
              color: user.geminiApiKey
                ? '#00ff88'
                : '#ff6464',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              letterSpacing: '0.02em',
            }}
            title={user.geminiApiKey ? 'API Key đã cấu hình' : 'Chưa có API Key - Click để cấu hình'}
          >
            <Key size={16} />
            <span>{user.geminiApiKey ? 'API OK' : 'Set API'}</span>
          </button>

          {/* User Avatar - Glowing */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 25px rgba(138, 43, 226, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onClick={onOpenSettings}
            title="Cấu hình tài khoản"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Word Lookup Modal */}
      <WordLookupModal
        word={lookupWord}
        onClose={() => setLookupWord(null)}
        merriamWebsterApiKey={user.merriamWebsterApiKey}
      />
    </>
  );
};
