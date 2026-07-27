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
 * Generate timed transcript for custom YouTube URL using Gemini AI or rich interactive fallback
 */
export const fetchOrGenerateTranscript = async (
  youtubeId: string,
  apiKey?: string
): Promise<ShadowingLesson> => {
  const defaultLesson: ShadowingLesson = {
    id: `custom-${youtubeId}`,
    title: `YouTube Interactive Video (${youtubeId})`,
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
      {
        id: 'line-4',
        startTime: 15.3,
        endTime: 20.2,
        text: 'Focus on imitating the intonation, stress patterns, and rhythm of the native speaker.',
        translation: 'Tập trung vào việc nhại theo ngữ điệu, trọng âm và nhịp điệu của người bản xứ.',
      },
      {
        id: 'line-5',
        startTime: 20.5,
        endTime: 26.0,
        text: 'Record your voice and compare it with the original video audio for instant self-assessment.',
        translation: 'Ghi âm giọng nói của bạn và so sánh với video gốc để tự đánh giá ngay lập tức.',
      },
      {
        id: 'line-6',
        startTime: 26.3,
        endTime: 32.0,
        text: 'Consistent daily practice will expand your practical vocabulary and spoken response speed.',
        translation: 'Luyện tập đều đặn hàng ngày sẽ mở rộng vốn từ vựng thực tế và tốc độ phản xạ nói.',
      },
      {
        id: 'line-7',
        startTime: 32.3,
        endTime: 38.0,
        text: 'Click on any unfamiliar word in the transcript to inspect definitions and IPA pronunciation.',
        translation: 'Bấm vào bất kỳ từ mới nào trong phụ đề để xem nghĩa tiếng Việt và phiên âm IPA.',
      },
      {
        id: 'line-8',
        startTime: 38.3,
        endTime: 45.0,
        text: 'Great job! Keep going to master advanced English communication step by step.',
        translation: 'Tốt lắm! Hãy tiếp tục rèn luyện để làm chủ giao tiếp tiếng Anh nâng cao từng bước.',
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
Create a full English shadowing transcript JSON for a YouTube video with ID "${youtubeId}".
Output ONLY valid JSON matching this schema:
{
  "title": "A short descriptive English title for the video",
  "category": "Daily Conversation or Business English or Educational or Technology",
  "level": "A2 or B1 or B2 or C1",
  "transcript": [
    {
      "id": "line-1",
      "startTime": 0,
      "endTime": 5.0,
      "text": "Natural spoken English sentence for shadowing practice",
      "translation": "Accurate Vietnamese translation"
    },
    ... (provide 8 to 12 sequential timed lines matching realistic dialogue)
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
