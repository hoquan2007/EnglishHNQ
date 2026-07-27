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

  // 1. Try URL parsing
  try {
    const formattedUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(formattedUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      // Query param ?v=
      if (parsed.searchParams.has('v')) {
        const v = parsed.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      }

      // Path based: /shorts/ID, /embed/ID, /v/ID, or youtu.be/ID
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (/^[a-zA-Z0-9_-]{11}$/.test(part)) {
          return part;
        }
      }
    }
  } catch (e) {
    // Ignore and fallback to regex
  }

  // 2. Comprehensive Regex fallback
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/,
  ];

  for (const pattern of regexPatterns) {
    const match = trimmed.match(pattern);
    if (match) {
      if (match[1] && match[1].length === 11) return match[1];
      if (match[2] && match[2].length === 11) return match[2];
    }
  }

  return null;
};

/**
 * Fetch YouTube video title via public oEmbed endpoint
 */
export const fetchYouTubeVideoTitle = async (youtubeId: string): Promise<string | null> => {
  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${youtubeId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return data.title;
      }
    }
  } catch (e) {
    console.warn('Could not fetch YouTube oEmbed metadata:', e);
  }
  return null;
};

/**
 * Generate timed transcript for custom YouTube URL using YouTube Metadata + Gemini AI or rich dynamic fallback
 */
export const fetchOrGenerateTranscript = async (
  youtubeId: string,
  apiKey?: string
): Promise<ShadowingLesson> => {
  // Try fetching actual video title from YouTube oEmbed API
  const videoTitle = await fetchYouTubeVideoTitle(youtubeId);
  const displayTitle = videoTitle || `YouTube Interactive Video (${youtubeId})`;

  const defaultLesson: ShadowingLesson = {
    id: `custom-${youtubeId}`,
    title: displayTitle,
    youtubeId: youtubeId,
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    duration: '03:45',
    level: 'B2',
    category: 'Custom Learning Video',
    transcript: [
      {
        id: 'line-1',
        startTime: 0,
        endTime: 4.5,
        text: `Welcome to this shadowing lesson on "${displayTitle}".`,
        translation: `Chào mừng bạn đến với bài học nhại giọng cho video "${displayTitle}".`,
      },
      {
        id: 'line-2',
        startTime: 4.8,
        endTime: 9.5,
        text: 'Listen carefully to the native speaker\'s pronunciation and rhythm in this clip.',
        translation: 'Hãy lắng nghe kỹ phát âm và nhịp điệu của người bản xứ trong đoạn clip này.',
      },
      {
        id: 'line-3',
        startTime: 9.8,
        endTime: 15.0,
        text: 'Shadowing this content helps you absorb key topic vocabulary and natural sentence patterns.',
        translation: 'Luyện nhại giọng theo nội dung này giúp bạn hấp thụ từ vựng chủ đề và mẫu câu tự nhiên.',
      },
      {
        id: 'line-4',
        startTime: 15.3,
        endTime: 20.2,
        text: 'Pay close attention to word stress, linking sounds, and natural intonation pauses.',
        translation: 'Chú ý kỹ trọng âm từ, âm nối và các điểm dừng ngữ điệu tự nhiên.',
      },
      {
        id: 'line-5',
        startTime: 20.5,
        endTime: 26.0,
        text: 'Use the microphone to record your voice and instantly evaluate your speaking accuracy.',
        translation: 'Sử dụng micro để ghi âm giọng nói của bạn và đánh giá ngay độ chính xác khi phát âm.',
      },
      {
        id: 'line-6',
        startTime: 26.3,
        endTime: 32.0,
        text: 'Click any word in the interactive transcript below to view its Vietnamese definition.',
        translation: 'Bấm vào bất kỳ từ nào trong phụ đề bên dưới để xem định nghĩa tiếng Việt tương ứng.',
      },
      {
        id: 'line-7',
        startTime: 32.3,
        endTime: 38.0,
        text: 'Repeating sentences multiple times builds strong muscle memory for spoken English fluency.',
        translation: 'Lặp lại các câu nhiều lần tạo phản xạ nói tự nhiên và trôi chảy.',
      },
      {
        id: 'line-8',
        startTime: 38.3,
        endTime: 45.0,
        text: 'Excellent work! Keep practicing to master real-world English communication.',
        translation: 'Tuyệt vời! Hãy tiếp tục luyện tập để làm chủ giao tiếp tiếng Anh thực tế.',
      }
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
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
You are an AI English Tutor analyzing a YouTube Video titled "${displayTitle}" with Video ID "${youtubeId}".

Based on the title "${displayTitle}", perform a realistic content analysis of this video's topic.
Generate an accurate, sequential 8 to 12 sentence English shadowing transcript that accurately reflects the video's subject, dialogue, or educational material.

Output ONLY valid JSON matching this schema:
{
  "title": "${displayTitle.replace(/"/g, "'")}",
  "category": "Educational / Business / Tech / Daily Conversation",
  "level": "A2 or B1 or B2 or C1",
  "transcript": [
    {
      "id": "line-1",
      "startTime": 0,
      "endTime": 5.0,
      "text": "First natural spoken English sentence relevant to this video topic",
      "translation": "Accurate Vietnamese translation"
    },
    ... (8 to 12 sequential timed lines starting at 0.0s to 50.0s)
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
        title: parsed.title || displayTitle,
        youtubeId: youtubeId,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        duration: '03:45',
        level: parsed.level || 'B2',
        category: parsed.category || 'Custom Video',
        transcript: parsed.transcript.map((line: any, index: number) => ({
          id: line.id || `line-${index + 1}`,
          startTime: typeof line.startTime === 'number' ? line.startTime : index * 5,
          endTime: typeof line.endTime === 'number' ? line.endTime : (index + 1) * 5,
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
