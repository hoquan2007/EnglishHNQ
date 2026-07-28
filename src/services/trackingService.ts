import { LearningAnalytics, RecommendedTask, RemediationQuestion, UserProfile } from '../types';

const ANALYTICS_STORAGE_KEY = 'english_hnq_analytics';
const DAILY_TASKS_KEY = 'english_hnq_daily_tasks';

// Storage for daily tasks with date tracking
interface DailyTasksData {
  date: string; // YYYY-MM-DD format
  tasks: RecommendedTask[];
  completedTaskIds: string[];
}

export const defaultAnalytics: LearningAnalytics = {
  weakWords: [
    { term: 'environment', count: 3 },
    { term: 'resilient', count: 2 },
    { term: 'enthusiastic', count: 2 },
    { term: 'phenomenon', count: 1 }
  ],
  weakTopics: [
    { topic: 'Present Perfect vs Past Simple', count: 4 },
    { topic: 'Prepositions of Time & Place', count: 3 },
    { topic: 'Conditionals (Type 2 & 3)', count: 2 }
  ],
  shadowingHistory: [
    { id: '1', lessonTitle: 'Mastering English Small Talk', score: 78, date: new Date().toISOString() },
    { id: '2', lessonTitle: 'Business Meeting Expressions', score: 85, date: new Date().toISOString() }
  ],
  chatFixHistory: [
    {
      id: '1',
      original: 'I am agree with your opinion',
      corrected: 'I agree with your opinion',
      explanation: '"Agree" là một động từ, không dùng to-be "am agree". Hãy dùng "I agree".',
      date: new Date().toISOString()
    },
    {
      id: '2',
      original: 'Yesterday I go to the cinema',
      corrected: 'Yesterday I went to the cinema',
      explanation: 'Thì quá khứ đơn (Past Simple) dùng động từ quá khứ "went" cho hành động đã xảy ra.',
      date: new Date().toISOString()
    }
  ],
  overallAccuracy: 82,
  recommendedDailyXp: 150
};

export const getLearningAnalytics = (): LearningAnalytics => {
  try {
    const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading learning analytics from localStorage:', e);
  }
  return defaultAnalytics;
};

export const saveLearningAnalytics = (analytics: LearningAnalytics): void => {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error saving learning analytics to localStorage:', e);
  }
};

export const trackWeakWord = (term: string): void => {
  const analytics = getLearningAnalytics();
  const index = analytics.weakWords.findIndex((w) => w.term.toLowerCase() === term.toLowerCase());
  if (index >= 0) {
    analytics.weakWords[index].count += 1;
  } else {
    analytics.weakWords.push({ term, count: 1 });
  }
  // Sort by count descending
  analytics.weakWords.sort((a, b) => b.count - a.count);
  saveLearningAnalytics(analytics);
};

export const trackWeakTopic = (topic: string): void => {
  const analytics = getLearningAnalytics();
  const index = analytics.weakTopics.findIndex((t) => t.topic.toLowerCase() === topic.toLowerCase());
  if (index >= 0) {
    analytics.weakTopics[index].count += 1;
  } else {
    analytics.weakTopics.push({ topic, count: 1 });
  }
  analytics.weakTopics.sort((a, b) => b.count - a.count);
  saveLearningAnalytics(analytics);
};

export const trackShadowingScore = (lessonTitle: string, score: number): void => {
  const analytics = getLearningAnalytics();
  analytics.shadowingHistory.unshift({
    id: Date.now().toString(),
    lessonTitle,
    score,
    date: new Date().toISOString()
  });
  // Keep last 20
  if (analytics.shadowingHistory.length > 20) {
    analytics.shadowingHistory = analytics.shadowingHistory.slice(0, 20);
  }
  // Recalculate average score
  const totalScore = analytics.shadowingHistory.reduce((sum, item) => sum + item.score, 0);
  analytics.overallAccuracy = Math.round(totalScore / analytics.shadowingHistory.length);
  saveLearningAnalytics(analytics);
};

export const recordChatGrammarFix = (original: string, corrected: string, explanation: string): void => {
  const analytics = getLearningAnalytics();
  analytics.chatFixHistory.unshift({
    id: Date.now().toString(),
    original,
    corrected,
    explanation,
    date: new Date().toISOString()
  });
  if (analytics.chatFixHistory.length > 20) {
    analytics.chatFixHistory = analytics.chatFixHistory.slice(0, 20);
  }
  saveLearningAnalytics(analytics);
};

// Helper to get today's date string
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get today's date in Vietnamese format
const getTodayVietnamese = (): string => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  return today.toLocaleDateString('vi-VN', options);
};

/**
 * Get daily tasks - generates new tasks if it's a new day
 * Tasks are cached per day to provide consistent daily experience
 */
export const generateDailyTasks = (user: UserProfile): RecommendedTask[] => {
  const today = getTodayString();

  try {
    const saved = localStorage.getItem(DAILY_TASKS_KEY);
    if (saved) {
      const data: DailyTasksData = JSON.parse(saved);
      // If same day, return cached tasks
      if (data.date === today) {
        return data.tasks;
      }
    }
  } catch (e) {
    console.error('Error reading daily tasks:', e);
  }

  // Generate new tasks for today
  const analytics = getLearningAnalytics();
  const todayFormatted = getTodayVietnamese();
  const topWeakWord = analytics.weakWords[0]?.term || 'environment';
  const topWeakTopic = analytics.weakTopics[0]?.topic || 'Present Perfect';

  // Dynamic task generation based on user weakness data
  const tasks: RecommendedTask[] = [];

  // Task 1: Vocabulary practice for weakest word
  if (analytics.weakWords.length > 0) {
    tasks.push({
      id: 'task_1',
      title: `Ôn tập từ vựng: "${topWeakWord}"`,
      description: `Hôm nay ${todayFormatted} - Bạn chưa ghi nhớ vững từ "${topWeakWord}" (sai ${analytics.weakWords[0]?.count || 1} lần). Ôn ngay!`,
      category: 'vocabulary',
      targetTab: 'vocabulary',
      xpReward: 30
    });
  } else {
    tasks.push({
      id: 'task_1',
      title: 'Luyện từ vựng mới',
      description: `Hôm nay ${todayFormatted} - Học thêm 5 từ vựng mới để mở rộng vốn từ!`,
      category: 'vocabulary',
      targetTab: 'vocabulary',
      xpReward: 25
    });
  }

  // Task 2: Grammar for weakest topic
  if (analytics.weakTopics.length > 0) {
    tasks.push({
      id: 'task_2',
      title: `Củng cố: ${topWeakTopic}`,
      description: `Hôm nay ${todayFormatted} - Phân tích cho thấy bạn cần ôn lại "${topWeakTopic}". Hãy làm bài tập!`,
      category: 'grammar',
      targetTab: 'grammar',
      xpReward: 40
    });
  } else {
    tasks.push({
      id: 'task_2',
      title: 'Luyện ngữ pháp nâng cao',
      description: `Hôm nay ${todayFormatted} - Thử sức với các bài ngữ pháp nâng cao để tiến bộ hơn!`,
      category: 'grammar',
      targetTab: 'grammar',
      xpReward: 35
    });
  }

  // Task 3: Shadowing practice
  const shadowingScore = analytics.overallAccuracy || 75;
  tasks.push({
    id: 'task_3',
    title: shadowingScore < 80 ? 'Luyện Shadowing nâng điểm (>80%)' : 'Luyện Shadowing duy trì phong độ',
    description: `Hôm nay ${todayFormatted} - Điểm Shadowing hiện tại: ${shadowingScore}%. ${shadowingScore < 80 ? 'Cần cải thiện!' : 'Giữ vững phong độ!'}`,
    category: 'shadowing',
    targetTab: 'shadowing',
    xpReward: 50
  });

  // Task 4: Chat with AI
  const chatFixCount = analytics.chatFixHistory.length;
  tasks.push({
    id: 'task_4',
    title: chatFixCount > 0 ? `Trò chuyện AI - Sửa lỗi hội thoại` : 'Trò chuyện 10 phút với AI',
    description: `Hôm nay ${todayFormatted} - ${chatFixCount > 0 ? `Bạn đã mắc ${chatFixCount} lỗi hội thoại gần đây. Hãy luyện tương tác!` : 'Luyện phản xạ giao tiếp tự nhiên cùng Adam & Eva!'}`,
    category: 'chatbot',
    targetTab: 'chatbot',
    xpReward: 35
  });

  // Save today's tasks
  const dailyData: DailyTasksData = {
    date: today,
    tasks,
    completedTaskIds: []
  };
  try {
    localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(dailyData));
  } catch (e) {
    console.error('Error saving daily tasks:', e);
  }

  return tasks;
};

/**
 * Mark a daily task as completed
 */
export const markDailyTaskCompleted = (taskId: string): void => {
  try {
    const saved = localStorage.getItem(DAILY_TASKS_KEY);
    if (saved) {
      const data: DailyTasksData = JSON.parse(saved);
      if (!data.completedTaskIds.includes(taskId)) {
        data.completedTaskIds.push(taskId);
        localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(data));
      }
    }
  } catch (e) {
    console.error('Error marking task completed:', e);
  }
};

/**
 * Get completed task IDs for today
 */
export const getCompletedTaskIds = (): string[] => {
  try {
    const saved = localStorage.getItem(DAILY_TASKS_KEY);
    if (saved) {
      const data: DailyTasksData = JSON.parse(saved);
      if (data.date === getTodayString()) {
        return data.completedTaskIds;
      }
    }
  } catch (e) {
    console.error('Error reading completed tasks:', e);
  }
  return [];
};

/**
 * Shuffle array utility - Fisher-Yates algorithm
 */
const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateRemediationQuiz = (analytics: LearningAnalytics): RemediationQuestion[] => {
  const questions: RemediationQuestion[] = [];

  // Word meaning questions - create dynamic options based on weak word
  if (analytics.weakWords.length > 0) {
    const w1 = analytics.weakWords[0]?.term || 'environment';
    const meanings1: Record<string, string[]> = {
      'environment': ['Môi trường sống', 'Sự kiên cường', 'Hiện tượng tự nhiên', 'Nhiệt tình'],
      'resilient': ['Kiên cường, có khả năng phục hồi', 'Yếu ớt, dễ tổn thương', 'Nhanh nhẹn, hoạt bát', 'Thông minh, sáng lắp'],
      'enthusiastic': ['Nhiệt tình, hào hứng', 'Buồn chán, thờ ơ', 'Tức giận, khó chịu', 'Lo lắng, bất an'],
      'phenomenon': ['Hiện tượng tự nhiên hoặc xã hội', 'Sự kiện thường ngày', 'Một loại sinh vật', 'Một loại vật chất']
    };
    const options1 = meanings1[w1.toLowerCase()] || ['Môi trường sống', 'Sự kiên cường', 'Hiện tượng tự nhiên', 'Nhiệt tình'];
    const shuffled1 = shuffleArray(options1);
    const correctIdx1 = shuffled1.indexOf(options1[0]);

    questions.push({
      id: 'rem_w1',
      type: 'word',
      question: `Chọn nghĩa đúng của từ vựng yếu "${w1}":`,
      options: shuffled1,
      correctAnswer: correctIdx1,
      explanation: `"${w1}" có nghĩa là ${options1[0].toLowerCase()}.`,
      targetItem: w1
    });
  }

  if (analytics.weakWords.length > 1) {
    const w2 = analytics.weakWords[1]?.term || 'resilient';
    const options2 = shuffleArray([w2, 'environment', 'enthusiastic', 'phenomenon']);

    questions.push({
      id: 'rem_w2',
      type: 'word',
      question: `Điền từ thích hợp vào chỗ trống: "She is a very ________ person who recovers quickly from hardship."`,
      options: options2,
      correctAnswer: options2.indexOf(w2),
      explanation: `"${w2}" là tính từ nghĩa là kiên cường, có khả năng phục hồi nhanh chóng sau khó khăn.`,
      targetItem: w2
    });
  }

  // Grammar questions with shuffled options
  const grammarOptions1 = shuffleArray(['I agree with your opinion.', 'I am agreed with your opinion.', 'I agreeing with your opinion.', 'I was agree with your opinion.']);
  questions.push({
      id: 'rem_g1',
      type: 'grammar',
      question: 'Sửa lỗi sai trong câu: "I am agree with your opinion."',
      options: grammarOptions1,
      correctAnswer: grammarOptions1.indexOf('I agree with your opinion.'),
      explanation: '"Agree" là động từ thường, không kết hợp to-be "am agree". Đáp án đúng là "I agree with your opinion."',
      targetItem: 'Present Simple vs To-Be'
  });

  const grammarOptions2 = shuffleArray(['go', 'went', 'have gone', 'gone']);
  questions.push({
      id: 'rem_g2',
      type: 'grammar',
      question: 'Chọn dạng đúng của động từ: "Yesterday, I ________ (go) to the cinema with my friends."',
      options: grammarOptions2,
      correctAnswer: grammarOptions2.indexOf('went'),
      explanation: 'Có dấu hiệu thời gian "Yesterday" trong quá khứ xác định, sử dụng thì Quá khứ đơn (Past Simple): "went".',
      targetItem: 'Past Simple'
  });

  return questions;
};
