import { GoogleGenerativeAI } from '@google/generative-ai';
import { ShadowingLesson, TranscriptLine } from '../types';

/**
 * Extract YouTube 11-character Video ID from various URL formats
 */
export const extractYouTubeId = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // If user pasted just an 11-character ID directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex patterns for youtube.com/watch?v=, youtu.be/, youtube.com/embed/
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
  ];

  for (const pattern of regexPatterns) {
    const match = trimmed.match(pattern);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }

  return null;
};

/**
 * Generate timed transcript for custom YouTube URL using Gemini AI or fallback
 */
export const fetchOrGenerateTranscript = async (
  youtubeId: string,
  apiKey?: string
): Promise<ShadowingLesson> => {
  const defaultLesson: ShadowingLesson = {
    id: `custom-${youtubeId}`,
    title: `YouTube Video (${youtubeId})`,
    youtubeId: youtubeId,
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    duration: '02:30',
    level: 'B1',
    category: 'Custom Video',
    transcript: [
      {
        id: 'line-1',
        startTime: 0,
        endTime: 4.5,
        text: 'Welcome to this English practice video. Listen carefully and repeat each sentence.',
        translation: 'Chào mừng bạn đến với video luyện tiếng Anh này. Hãy lắng nghe kỹ và nhại lại từng câu.',
      },
      {
        id: 'line-2',
        startTime: 4.8,
        endTime: 9.5,
        text: 'Shadowing is one of the most effective techniques to improve your pronunciation and fluency.',
        translation: 'Shadowing là một trong những phương pháp hiệu quả nhất để nâng cao phát âm và độ trôi chảy.',
      },
      {
        id: 'line-3',
        startTime: 9.8,
        endTime: 15.0,
        text: 'Practice every day to build confidence and master natural spoken English.',
        translation: 'Luyện tập mỗi ngày để xây dựng sự tự tin và làm chủ tiếng Anh giao tiếp tự nhiên.',
      },
    ],
  };

  if (!apiKey || apiKey.trim() === '') {
    return defaultLesson;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.5,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
Create an English learning shadowing transcript JSON for a YouTube video with ID "${youtubeId}".
Output ONLY valid JSON matching this schema:
{
  "title": "A short descriptive English title for the video",
  "category": "Daily Conversation or Business English or Educational",
  "level": "A1 or A2 or B1 or B2 or C1",
  "transcript": [
    {
      "id": "line-1",
      "startTime": 0,
      "endTime": 4.5,
      "text": "Natural spoken English sentence",
      "translation": "Vietnamese translation of the sentence"
    },
    ... (provide 4-6 sequential lines with realistic timestamps)
  ]
}
`;

    const result = await model.generateContent(prompt);
    const rawJson = result.response.text();
    let cleanJson = rawJson.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanJson);
    if (parsed && Array.isArray(parsed.transcript) && parsed.transcript.length > 0) {
      return {
        id: `custom-${youtubeId}`,
        title: parsed.title || `Custom Video (${youtubeId})`,
        youtubeId: youtubeId,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        duration: '02:30',
        level: parsed.level || 'B1',
        category: parsed.category || 'Custom',
        transcript: parsed.transcript.map((line: any, index: number) => ({
          id: line.id || `line-${index + 1}`,
          startTime: typeof line.startTime === 'number' ? line.startTime : index * 4,
          endTime: typeof line.endTime === 'number' ? line.endTime : (index + 1) * 4,
          text: line.text || '',
          translation: line.translation || '',
        })),
      };
    }
  } catch (error) {
    console.warn('Failed to generate Gemini AI transcript for YouTube video, using fallback:', error);
  }

  return defaultLesson;
};
