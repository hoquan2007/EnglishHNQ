import { DatamuseSuggestion, DetailedWordLookup, DictionaryMeaning, DictionaryPhonetic } from '../types';

/**
 * Fetch word entry from Free Dictionary API (api.dictionaryapi.dev)
 */
export const fetchFreeDictionary = async (word: string): Promise<DetailedWordLookup | null> => {
  const cleanWord = word.trim().toLowerCase();
  if (!cleanWord) return null;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];
    const phonetics: DictionaryPhonetic[] = (entry.phonetics || []).map((p: any) => ({
      text: p.text,
      audio: p.audio,
      tag: p.audio ? (p.audio.includes('-uk') ? 'UK' : p.audio.includes('-au') ? 'AU' : 'US') : undefined,
    }));

    const meanings: DictionaryMeaning[] = (entry.meanings || []).map((m: any) => ({
      partOfSpeech: m.partOfSpeech || 'noun',
      definitions: (m.definitions || []).map((d: any) => ({
        definition: d.definition || '',
        example: d.example || '',
        synonyms: d.synonyms || [],
        antonyms: d.antonyms || [],
      })),
      synonyms: m.synonyms || [],
      antonyms: m.antonyms || [],
    }));

    return {
      word: entry.word || cleanWord,
      phonetics: phonetics.filter(p => p.text || p.audio),
      meanings,
      sourceUrl: entry.sourceUrls?.[0] || `https://en.wiktionary.org/wiki/${cleanWord}`,
    };
  } catch (error) {
    console.warn('Free Dictionary API lookup failed:', error);
    return null;
  }
};

/**
 * Fetch word entry from FreeDictionaryAPI.com (Wiktionary Data)
 */
export const fetchFreeDictionaryAPICom = async (word: string): Promise<DetailedWordLookup | null> => {
  const cleanWord = word.trim().toLowerCase();
  if (!cleanWord) return null;

  try {
    const res = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(cleanWord)}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !Array.isArray(data.entries) || data.entries.length === 0) return null;

    const phonetics: DictionaryPhonetic[] = [];
    const meaningsMap: Record<string, DictionaryMeaning> = {};

    data.entries.forEach((entry: any) => {
      (entry.pronunciations || []).forEach((pr: any) => {
        if (pr.text) {
          phonetics.push({
            text: pr.text,
            tag: pr.tags?.[0] || pr.type || 'General',
          });
        }
      });

      const pos = entry.partOfSpeech || 'general';
      if (!meaningsMap[pos]) {
        meaningsMap[pos] = {
          partOfSpeech: pos,
          definitions: [],
          synonyms: entry.synonyms || [],
          antonyms: entry.antonyms || [],
        };
      }

      (entry.senses || []).forEach((s: any) => {
        if (s.definition) {
          meaningsMap[pos].definitions.push({
            definition: s.definition,
            example: s.examples?.[0] || '',
            synonyms: s.synonyms || [],
            antonyms: s.antonyms || [],
          });
        }
      });
    });

    return {
      word: data.word || cleanWord,
      phonetics,
      meanings: Object.values(meaningsMap),
      sourceUrl: data.source?.url || `https://en.wiktionary.org/wiki/${cleanWord}`,
    };
  } catch (error) {
    console.warn('FreeDictionaryAPI.com lookup failed:', error);
    return null;
  }
};

/**
 * Fetch Merriam-Webster Dictionary API entry if user provided API Key
 */
export const fetchMerriamWebster = async (word: string, apiKey: string): Promise<DetailedWordLookup | null> => {
  const cleanWord = word.trim().toLowerCase();
  if (!cleanWord || !apiKey) return null;

  try {
    const res = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(cleanWord)}?key=${apiKey}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0 || typeof data[0] === 'string') return null;

    const entry = data[0];
    const pr = entry.hwi?.prs?.[0]?.mw;
    const soundName = entry.hwi?.prs?.[0]?.sound?.audio;
    let audioUrl: string | undefined;

    if (soundName) {
      let subdirectory = soundName.substring(0, 1);
      if (soundName.startsWith('bix')) subdirectory = 'bix';
      else if (soundName.startsWith('gg')) subdirectory = 'gg';
      else if (/^\d/.test(soundName) || /^[_\W]/.test(soundName)) subdirectory = 'number';
      audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${soundName}.mp3`;
    }

    const shortDefs: string[] = entry.shortdef || [];

    return {
      word: cleanWord,
      phonetics: pr ? [{ text: `/${pr}/`, audio: audioUrl, tag: 'Merriam-Webster (US)' }] : [],
      meanings: [
        {
          partOfSpeech: entry.fl || 'general',
          definitions: shortDefs.map((def: string) => ({ definition: def })),
        },
      ],
      sourceUrl: `https://www.merriam-webster.com/dictionary/${cleanWord}`,
    };
  } catch (error) {
    console.warn('Merriam-Webster API lookup failed:', error);
    return null;
  }
};

/**
 * Combined Dictionary Lookup Engine (Primary -> Secondary -> Merriam-Webster)
 */
export const lookupWord = async (word: string, mwApiKey?: string): Promise<DetailedWordLookup> => {
  const cleanWord = word.trim().replace(/^[^\w]+|[^\w]+$/g, '');

  // 1. Try Free Dictionary API first (has MP3 audio direct link & clear structure)
  const primaryResult = await fetchFreeDictionary(cleanWord);
  
  // 2. Try FreeDictionaryAPI.com (Wiktionary detailed regional IPA)
  const secondaryResult = await fetchFreeDictionaryAPICom(cleanWord);

  // 3. Try Merriam-Webster if Key provided
  let mwResult: DetailedWordLookup | null = null;
  if (mwApiKey) {
    mwResult = await fetchMerriamWebster(cleanWord, mwApiKey);
  }

  // Merge results seamlessly
  const mergedWord = primaryResult?.word || secondaryResult?.word || cleanWord;
  
  // Combine phonetics without duplicates and clean up raw tags
  const phoneticsMap = new Map<string, DictionaryPhonetic>();
  [...(primaryResult?.phonetics || []), ...(secondaryResult?.phonetics || []), ...(mwResult?.phonetics || [])].forEach(p => {
    if (!p.text && !p.audio) return;
    
    // Clean string if text contains ipa: or US:
    let cleanText = (p.text || '').replace(/^(ipa:|US:|UK:|AU:|\/)+/gi, '/').trim();
    if (cleanText && !cleanText.startsWith('/')) cleanText = `/${cleanText}`;
    if (cleanText && !cleanText.endsWith('/')) cleanText = `${cleanText}/`;

    const tag = p.tag || (cleanText.includes('US') ? 'US' : cleanText.includes('UK') ? 'UK' : 'IPA');
    const cleanedPhonetic: DictionaryPhonetic = {
      text: cleanText || `/${cleanWord}/`,
      audio: p.audio,
      tag: tag
    };

    const key = `${cleanedPhonetic.text}-${cleanedPhonetic.audio || ''}`;
    if (!phoneticsMap.has(key)) phoneticsMap.set(key, cleanedPhonetic);
  });

  // Combine meanings
  const meaningsMap = new Map<string, DictionaryMeaning>();
  [...(primaryResult?.meanings || []), ...(secondaryResult?.meanings || []), ...(mwResult?.meanings || [])].forEach(m => {
    if (!meaningsMap.has(m.partOfSpeech)) {
      meaningsMap.set(m.partOfSpeech, m);
    } else {
      const existing = meaningsMap.get(m.partOfSpeech)!;
      existing.definitions = [...existing.definitions, ...m.definitions];
    }
  });

  // Fallback default structure if no API returned results
  if (phoneticsMap.size === 0 && meaningsMap.size === 0) {
    return {
      word: cleanWord,
      phonetics: [{ text: `/${cleanWord}/`, tag: 'Standard' }],
      meanings: [
        {
          partOfSpeech: 'word',
          definitions: [
            {
              definition: `Entry for "${cleanWord}". Click for external lookup or use AI Tutor for full details.`,
            },
          ],
        },
      ],
      sourceUrl: `https://en.wiktionary.org/wiki/${cleanWord}`,
    };
  }

  return {
    word: mergedWord,
    phonetics: Array.from(phoneticsMap.values()),
    meanings: Array.from(meaningsMap.values()),
    sourceUrl: primaryResult?.sourceUrl || secondaryResult?.sourceUrl || `https://en.wiktionary.org/wiki/${cleanWord}`,
  };
};

/**
 * Datamuse Autocomplete API (api.datamuse.com/sug?s=)
 */
export const fetchDatamuseSuggestions = async (prefix: string): Promise<DatamuseSuggestion[]> => {
  const clean = prefix.trim();
  if (!clean || clean.length < 2) return [];

  try {
    const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(clean)}&max=8`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).map((item: any) => ({
      word: item.word,
      score: item.score,
    }));
  } catch (error) {
    console.warn('Datamuse Autocomplete API failed:', error);
    return [];
  }
};

/**
 * Datamuse Related Words by Context/Meaning API (api.datamuse.com/words?ml=)
 */
export const fetchDatamuseRelatedWords = async (concept: string): Promise<DatamuseSuggestion[]> => {
  const clean = concept.trim();
  if (!clean) return [];

  try {
    const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(clean)}&max=10`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).map((item: any) => ({
      word: item.word,
      score: item.score,
      tags: item.tags || [],
    }));
  } catch (error) {
    console.warn('Datamuse Related Words API failed:', error);
    return [];
  }
};
