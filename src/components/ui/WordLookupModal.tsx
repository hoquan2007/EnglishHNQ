import React, { useEffect, useState } from 'react';
import { Volume2, ExternalLink, BookmarkPlus, Check, X, BookOpen, Sparkles } from 'lucide-react';
import { DetailedWordLookup } from '../../types';
import { lookupWord } from '../../services/dictionaryService';
import { speakText } from '../../services/speechService';
import { saveUserMasteredWord } from '../../services/storage';

interface WordLookupModalProps {
  word: string | null;
  onClose: () => void;
  merriamWebsterApiKey?: string;
  onWordAdded?: (word: string) => void;
}

export const WordLookupModal: React.FC<WordLookupModalProps> = ({
  word,
  onClose,
  merriamWebsterApiKey,
  onWordAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState<DetailedWordLookup | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!word) {
      setWordData(null);
      setSaved(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setSaved(false);

    lookupWord(word, merriamWebsterApiKey)
      .then(res => {
        if (isMounted) {
          setWordData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [word, merriamWebsterApiKey]);

  if (!word) return null;

  const handlePlayAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => speakText(word));
    } else {
      speakText(word);
    }
  };

  const handleSaveWord = () => {
    saveUserMasteredWord(word);
    setSaved(true);
    if (onWordAdded) onWordAdded(word);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Instant Dictionary & Lookup</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400">Fetching definitions & phonetics for "{word}"...</p>
            </div>
          ) : wordData ? (
            <>
              {/* Word Header Card */}
              <div className="flex items-start justify-between bg-slate-800/60 border border-slate-700/50 p-5 rounded-xl">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight capitalize flex items-center gap-3">
                    {wordData.word}
                    <button
                      onClick={() => handlePlayAudio(wordData.phonetics.find(p => p.audio)?.audio)}
                      className="p-2 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition shadow-sm"
                      title="Phát âm"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </h2>

                  {/* Phonetics Chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {wordData.phonetics.length > 0 ? (
                      wordData.phonetics.map((p, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-700/60 text-cyan-300 font-mono"
                        >
                          {p.tag && <span className="text-[10px] uppercase font-bold text-slate-400">{p.tag}:</span>}
                          {p.text || '/.../'}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">/{wordData.word}/</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveWord}
                  disabled={saved}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                    saved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 shadow-md'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save Word</span>
                    </>
                  )}
                </button>
              </div>

              {/* Meanings by Part of Speech */}
              <div className="space-y-4">
                {wordData.meanings.map((meaning, idx) => (
                  <div key={idx} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {meaning.partOfSpeech}
                    </div>

                    <ul className="space-y-3 pl-1">
                      {meaning.definitions.map((def, dIdx) => (
                        <li key={dIdx} className="text-sm text-slate-200 space-y-1">
                          <p className="font-medium text-slate-100">
                            <span className="text-cyan-400 mr-2 font-bold">{dIdx + 1}.</span>
                            {def.definition}
                          </p>

                          {def.example && (
                            <p className="text-xs text-slate-400 italic pl-5 border-l-2 border-slate-700">
                              "{def.example}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Synonyms */}
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Synonyms:</span>
                        {meaning.synonyms.slice(0, 6).map((syn, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                            {syn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* External Source Link */}
              {wordData.sourceUrl && (
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <a
                    href={wordData.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition"
                  >
                    <span>View full dictionary details</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-slate-400">
              No definition found for "{word}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
