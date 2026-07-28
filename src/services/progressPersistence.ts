/**
 * Progress Persistence Service
 * Lưu trữ tất cả progress state của user vào localStorage
 * Giúp user không mất dữ liệu khi reload hoặc đóng trình duyệt
 */

import { ActiveTab } from '../types';

// Key prefixes cho localStorage
const PROGRESS_KEYS = {
  VOCABULARY: 'hnq_progress_vocabulary',
  GRAMMAR: 'hnq_progress_grammar',
  SHADOWING: 'hnq_progress_shadowing',
  MINIGAMES: 'hnq_progress_minigames',
  EXAMS: 'hnq_progress_exams',
  CHATBOT: 'hnq_progress_chatbot',
  DAILY_TASKS: 'hnq_progress_daily_tasks',
  LEARNING_STATS: 'hnq_progress_learning_stats',
  LAST_TAB: 'hnq_last_active_tab',
  APP_STATE: 'hnq_app_state',
} as const;

// ==================== Vocabulary Progress ====================
export interface VocabularyProgress {
  selectedLevel: string;
  selectedTopic: string;
  currentCardIndex: number;
  isFlipped: boolean;
  searchQuery: string;
  customWords: string[]; // Danh sách từ đã thêm từ online search
  masteredWords: string[]; // IDs của từ đã thuộc
  lastUpdated: string;
}

const defaultVocabularyProgress: VocabularyProgress = {
  selectedLevel: 'All',
  selectedTopic: 'All',
  currentCardIndex: 0,
  isFlipped: false,
  searchQuery: '',
  customWords: [],
  masteredWords: [],
  lastUpdated: new Date().toISOString(),
};

export const saveVocabularyProgress = (progress: Partial<VocabularyProgress>): void => {
  try {
    const current = loadVocabularyProgress();
    const updated: VocabularyProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.VOCABULARY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving vocabulary progress:', e);
  }
};

export const loadVocabularyProgress = (): VocabularyProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.VOCABULARY);
    if (saved) {
      const parsed = JSON.parse(saved) as VocabularyProgress;
      // Merge with defaults to handle new fields
      return { ...defaultVocabularyProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading vocabulary progress:', e);
  }
  return { ...defaultVocabularyProgress };
};

// ==================== Grammar Progress ====================
export interface GrammarProgress {
  completedLessons: string[]; // IDs của bài đã hoàn thành
  currentLessonId: string | null;
  quizScores: Record<string, number>; // lessonId -> best score
  lastLessonTab: string;
  lastUpdated: string;
}

const defaultGrammarProgress: GrammarProgress = {
  completedLessons: [],
  currentLessonId: null,
  quizScores: {},
  lastLessonTab: 'list',
  lastUpdated: new Date().toISOString(),
};

export const saveGrammarProgress = (progress: Partial<GrammarProgress>): void => {
  try {
    const current = loadGrammarProgress();
    const updated: GrammarProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.GRAMMAR, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving grammar progress:', e);
  }
};

export const loadGrammarProgress = (): GrammarProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.GRAMMAR);
    if (saved) {
      const parsed = JSON.parse(saved) as GrammarProgress;
      return { ...defaultGrammarProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading grammar progress:', e);
  }
  return { ...defaultGrammarProgress };
};

// ==================== Shadowing Progress ====================
export interface ShadowingProgress {
  completedLessons: string[]; // IDs của bài đã hoàn thành
  lastLessonId: string | null;
  youtubeUrlHistory: string[]; // Lịch sử URL đã nhập
  scores: Record<string, number>; // lessonId -> best score
  lastUpdated: string;
}

const defaultShadowingProgress: ShadowingProgress = {
  completedLessons: [],
  lastLessonId: null,
  youtubeUrlHistory: [],
  scores: {},
  lastUpdated: new Date().toISOString(),
};

export const saveShadowingProgress = (progress: Partial<ShadowingProgress>): void => {
  try {
    const current = loadShadowingProgress();
    const updated: ShadowingProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.SHADOWING, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving shadowing progress:', e);
  }
};

export const loadShadowingProgress = (): ShadowingProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.SHADOWING);
    if (saved) {
      const parsed = JSON.parse(saved) as ShadowingProgress;
      return { ...defaultShadowingProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading shadowing progress:', e);
  }
  return { ...defaultShadowingProgress };
};

// ==================== Mini-Games Progress ====================
export interface MiniGamesProgress {
  highScores: Record<string, number>; // gameId -> high score
  gamesPlayed: Record<string, number>; // gameId -> times played
  lastPlayedGame: string | null;
  achievements: string[];
  lastUpdated: string;
}

const defaultMiniGamesProgress: MiniGamesProgress = {
  highScores: {},
  gamesPlayed: {},
  lastPlayedGame: null,
  achievements: [],
  lastUpdated: new Date().toISOString(),
};

export const saveMiniGamesProgress = (progress: Partial<MiniGamesProgress>): void => {
  try {
    const current = loadMiniGamesProgress();
    const updated: MiniGamesProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.MINIGAMES, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving mini-games progress:', e);
  }
};

export const loadMiniGamesProgress = (): MiniGamesProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.MINIGAMES);
    if (saved) {
      const parsed = JSON.parse(saved) as MiniGamesProgress;
      return { ...defaultMiniGamesProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading mini-games progress:', e);
  }
  return { ...defaultMiniGamesProgress };
};

export const updateMiniGameScore = (gameId: string, score: number): void => {
  const current = loadMiniGamesProgress();
  const currentHighScore = current.highScores[gameId] || 0;
  const currentGamesPlayed = current.gamesPlayed[gameId] || 0;

  if (score > currentHighScore) {
    saveMiniGamesProgress({
      highScores: { ...current.highScores, [gameId]: score },
      gamesPlayed: { ...current.gamesPlayed, [gameId]: currentGamesPlayed + 1 },
      lastPlayedGame: gameId,
    });
  } else {
    saveMiniGamesProgress({
      gamesPlayed: { ...current.gamesPlayed, [gameId]: currentGamesPlayed + 1 },
      lastPlayedGame: gameId,
    });
  }
};

// ==================== Exams Progress ====================
export interface ExamProgress {
  completedExams: string[]; // exam IDs đã làm
  bestScores: Record<string, number>; // examId -> best percentage
  examHistory: Array<{
    examId: string;
    score: number;
    date: string;
    timeSpent: number;
  }>;
  lastExamId: string | null;
  lastUpdated: string;
}

const defaultExamProgress: ExamProgress = {
  completedExams: [],
  bestScores: {},
  examHistory: [],
  lastExamId: null,
  lastUpdated: new Date().toISOString(),
};

export const saveExamProgress = (progress: Partial<ExamProgress>): void => {
  try {
    const current = loadExamProgress();
    const updated: ExamProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.EXAMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving exam progress:', e);
  }
};

export const loadExamProgress = (): ExamProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.EXAMS);
    if (saved) {
      const parsed = JSON.parse(saved) as ExamProgress;
      return { ...defaultExamProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading exam progress:', e);
  }
  return { ...defaultExamProgress };
};

// ==================== Chatbot Progress ====================
export interface ChatbotProgress {
  chatHistoryAdam: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
  chatHistoryEva: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
  selectedPersona: 'adam' | 'eva';
  lastConversationDate: string | null;
  totalConversations: number;
  lastUpdated: string;
}

const defaultChatbotProgress: ChatbotProgress = {
  chatHistoryAdam: [],
  chatHistoryEva: [],
  selectedPersona: 'adam',
  lastConversationDate: null,
  totalConversations: 0,
  lastUpdated: new Date().toISOString(),
};

export const saveChatbotProgress = (progress: Partial<ChatbotProgress>): void => {
  try {
    const current = loadChatbotProgress();
    const updated: ChatbotProgress = {
      ...current,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.CHATBOT, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving chatbot progress:', e);
  }
};

export const loadChatbotProgress = (): ChatbotProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.CHATBOT);
    if (saved) {
      const parsed = JSON.parse(saved) as ChatbotProgress;
      return { ...defaultChatbotProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading chatbot progress:', e);
  }
  return { ...defaultChatbotProgress };
};

// ==================== Daily Tasks Progress ====================
export interface DailyTasksProgress {
  completedTaskIds: string[];
  currentDate: string; // YYYY-MM-DD
  tasksGeneratedDate: string | null;
  lastUpdated: string;
}

const defaultDailyTasksProgress: DailyTasksProgress = {
  completedTaskIds: [],
  currentDate: new Date().toISOString().split('T')[0],
  tasksGeneratedDate: null,
  lastUpdated: new Date().toISOString(),
};

export const saveDailyTasksProgress = (progress: Partial<DailyTasksProgress>): void => {
  try {
    const current = loadDailyTasksProgress();
    const today = new Date().toISOString().split('T')[0];

    // Nếu sang ngày mới, reset completed tasks
    let updated = {
      ...current,
      ...progress,
      currentDate: today,
      lastUpdated: new Date().toISOString(),
    };

    if (current.currentDate !== today) {
      updated.completedTaskIds = [];
      updated.tasksGeneratedDate = null;
    }

    localStorage.setItem(PROGRESS_KEYS.DAILY_TASKS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving daily tasks progress:', e);
  }
};

export const loadDailyTasksProgress = (): DailyTasksProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.DAILY_TASKS);
    if (saved) {
      const parsed = JSON.parse(saved) as DailyTasksProgress;
      const today = new Date().toISOString().split('T')[0];

      // Nếu data cũ từ ngày khác, reset
      if (parsed.currentDate !== today) {
        return {
          ...defaultDailyTasksProgress,
          currentDate: today,
        };
      }
      return { ...defaultDailyTasksProgress, ...parsed };
    }
  } catch (e) {
    console.error('Error loading daily tasks progress:', e);
  }
  return { ...defaultDailyTasksProgress, currentDate: new Date().toISOString().split('T')[0] };
};

export const markDailyTaskCompleted = (taskId: string): void => {
  const current = loadDailyTasksProgress();
  if (!current.completedTaskIds.includes(taskId)) {
    saveDailyTasksProgress({
      completedTaskIds: [...current.completedTaskIds, taskId],
    });
  }
};

// ==================== Learning Stats Progress ====================
export interface LearningStats {
  totalStudyTimeMinutes: number;
  sessionsCount: number;
  lastStudySession: string | null;
  weeklyGoalMinutes: number;
  weeklyProgressMinutes: number;
  weeklyProgressStartDate: string | null;
  dailyStudyMinutes: Record<string, number>; // date -> minutes
  lastUpdated: string;
}

const defaultLearningStats: LearningStats = {
  totalStudyTimeMinutes: 0,
  sessionsCount: 0,
  lastStudySession: null,
  weeklyGoalMinutes: 210, // 3.5 hours/week default
  weeklyProgressMinutes: 0,
  weeklyProgressStartDate: null,
  dailyStudyMinutes: {},
  lastUpdated: new Date().toISOString(),
};

export const saveLearningStats = (stats: Partial<LearningStats>): void => {
  try {
    const current = loadLearningStats();
    const updated: LearningStats = {
      ...current,
      ...stats,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.LEARNING_STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving learning stats:', e);
  }
};

export const loadLearningStats = (): LearningStats => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.LEARNING_STATS);
    if (saved) {
      const parsed = JSON.parse(saved) as LearningStats;
      return { ...defaultLearningStats, ...parsed };
    }
  } catch (e) {
    console.error('Error loading learning stats:', e);
  }
  return { ...defaultLearningStats };
};

export const addStudyTime = (minutes: number): void => {
  const current = loadLearningStats();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  // Check if we need to reset weekly progress
  const weekStart = getWeekStart(new Date());
  const currentWeekStart = current.weeklyProgressStartDate
    ? getWeekStart(new Date(current.weeklyProgressStartDate))
    : null;

  let weeklyProgressMinutes = current.weeklyProgressMinutes;
  if (!currentWeekStart || weekStart.getTime() !== currentWeekStart.getTime()) {
    weeklyProgressMinutes = 0;
  }

  const dailyMinutes = current.dailyStudyMinutes[today] || 0;

  saveLearningStats({
    totalStudyTimeMinutes: current.totalStudyTimeMinutes + minutes,
    sessionsCount: current.sessionsCount + 1,
    lastStudySession: now,
    weeklyProgressMinutes: weeklyProgressMinutes + minutes,
    weeklyProgressStartDate: current.weeklyProgressStartDate || today,
    dailyStudyMinutes: {
      ...current.dailyStudyMinutes,
      [today]: dailyMinutes + minutes,
    },
  });
};

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ==================== App State (Quick access) ====================
export interface AppState {
  lastActiveTab: ActiveTab;
  sidebarCollapsed: boolean;
  tutorWidgetVisible: boolean;
  notificationsEnabled: boolean;
  lastUpdated: string;
}

const defaultAppState: AppState = {
  lastActiveTab: 'dashboard',
  sidebarCollapsed: false,
  tutorWidgetVisible: true,
  notificationsEnabled: true,
  lastUpdated: new Date().toISOString(),
};

export const saveAppState = (state: Partial<AppState>): void => {
  try {
    const current = loadAppState();
    const updated: AppState = {
      ...current,
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEYS.APP_STATE, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving app state:', e);
  }
};

export const loadAppState = (): AppState => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEYS.APP_STATE);
    if (saved) {
      const parsed = JSON.parse(saved) as AppState;
      return { ...defaultAppState, ...parsed };
    }
  } catch (e) {
    console.error('Error loading app state:', e);
  }
  return { ...defaultAppState };
};

// ==================== Utility Functions ====================

/**
 * Export all progress data for backup
 */
export const exportAllProgress = (): string => {
  const data = {
    vocabulary: loadVocabularyProgress(),
    grammar: loadGrammarProgress(),
    shadowing: loadShadowingProgress(),
    minigames: loadMiniGamesProgress(),
    exams: loadExamProgress(),
    chatbot: loadChatbotProgress(),
    dailyTasks: loadDailyTasksProgress(),
    learningStats: loadLearningStats(),
    appState: loadAppState(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

/**
 * Import progress data from backup
 */
export const importAllProgress = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);

    if (data.vocabulary) localStorage.setItem(PROGRESS_KEYS.VOCABULARY, JSON.stringify(data.vocabulary));
    if (data.grammar) localStorage.setItem(PROGRESS_KEYS.GRAMMAR, JSON.stringify(data.grammar));
    if (data.shadowing) localStorage.setItem(PROGRESS_KEYS.SHADOWING, JSON.stringify(data.shadowing));
    if (data.minigames) localStorage.setItem(PROGRESS_KEYS.MINIGAMES, JSON.stringify(data.minigames));
    if (data.exams) localStorage.setItem(PROGRESS_KEYS.EXAMS, JSON.stringify(data.exams));
    if (data.chatbot) localStorage.setItem(PROGRESS_KEYS.CHATBOT, JSON.stringify(data.chatbot));
    if (data.dailyTasks) localStorage.setItem(PROGRESS_KEYS.DAILY_TASKS, JSON.stringify(data.dailyTasks));
    if (data.learningStats) localStorage.setItem(PROGRESS_KEYS.LEARNING_STATS, JSON.stringify(data.learningStats));
    if (data.appState) localStorage.setItem(PROGRESS_KEYS.APP_STATE, JSON.stringify(data.appState));

    return true;
  } catch (e) {
    console.error('Error importing progress:', e);
    return false;
  }
};

/**
 * Clear all progress data (for reset)
 */
export const clearAllProgress = (): void => {
  Object.values(PROGRESS_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get summary of all progress for dashboard display
 */
export const getProgressSummary = () => {
  const vocab = loadVocabularyProgress();
  const grammar = loadGrammarProgress();
  const shadowing = loadShadowingProgress();
  const miniGames = loadMiniGamesProgress();
  const exams = loadExamProgress();
  const stats = loadLearningStats();

  return {
    vocabulary: {
      masteredWords: vocab.masteredWords.length,
      customWords: vocab.customWords.length,
      lastStudy: vocab.lastUpdated,
    },
    grammar: {
      completedLessons: grammar.completedLessons.length,
      bestScores: grammar.quizScores,
    },
    shadowing: {
      completedLessons: shadowing.completedLessons.length,
      totalPracticeTime: Object.values(shadowing.scores).length * 5, // Estimate 5 min per lesson
    },
    miniGames: {
      totalGamesPlayed: Object.values(miniGames.gamesPlayed).reduce((a, b) => a + b, 0),
      highScores: miniGames.highScores,
    },
    exams: {
      completedExams: exams.completedExams.length,
      bestScore: exams.bestScores,
    },
    learningStats: {
      totalStudyTime: stats.totalStudyTimeMinutes,
      weeklyProgress: stats.weeklyProgressMinutes,
      weeklyGoal: stats.weeklyGoalMinutes,
    },
  };
};
