import { UserProfile } from '../types';

const USER_STORAGE_KEY = 'english_hnq_user_profile';

export const defaultUserProfile: UserProfile = {
  id: 'user_1',
  name: 'Học Viên HNQ',
  avatar: 'H',
  rank: 'bronze',
  xp: 150,
  streak: 3,
  lastActiveDate: new Date().toISOString(),
  wordsLearned: 12,
  grammarCompleted: 2,
  shadowingCompleted: 1,
  placementTestDone: false,
  weakTopics: ['Present Perfect vs Past Simple', 'Prepositions of Time'],
  weakWords: ['environment', 'resilient', 'enthusiastic'],
  geminiApiKey: ''
};

export const getUserProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading user profile from localStorage:', e);
  }
  return defaultUserProfile;
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile to localStorage:', e);
  }
};

export const addXpToUser = (amount: number): UserProfile => {
  const current = getUserProfile();
  const newXp = current.xp + amount;
  
  // Calculate Rank progression logic:
  // Bronze: 0 - 299 XP
  // Silver: 300 - 699 XP
  // Gold: 700 - 1499 XP
  // Platinum: 1500 - 2999 XP
  // Diamond: 3000 - 5999 XP
  // Master: >= 6000 XP
  let newRank = current.rank;
  if (newXp >= 6000) newRank = 'master';
  else if (newXp >= 3000) newRank = 'diamond';
  else if (newXp >= 1500) newRank = 'platinum';
  else if (newXp >= 700) newRank = 'gold';
  else if (newXp >= 300) newRank = 'silver';
  else newRank = 'bronze';

  const updated: UserProfile = {
    ...current,
    xp: newXp,
    rank: newRank
  };
  saveUserProfile(updated);
  return updated;
};
