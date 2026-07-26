import { PlacementQuestion } from '../types';

export const placementQuestions: PlacementQuestion[] = [
  // A1 Level
  {
    id: 'pq_a1_1',
    type: 'multiple-choice',
    level: 'A1',
    question: 'Choose the correct form of the verb "to be": "She ___ a talented student."',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'is',
    explanation: 'With singular third-person pronouns ("she"), we use "is" in the present simple tense.'
  },
  {
    id: 'pq_a1_2',
    type: 'fill-blank',
    level: 'A1',
    question: 'Complete the sentence: "I usually go to school ___ bicycle in the morning."',
    options: ['by', 'on', 'in', 'with'],
    correctAnswer: 'by',
    explanation: 'We use the preposition "by" when referring to modes of transportation (by bicycle, by car, by bus).'
  },
  {
    id: 'pq_a1_3',
    type: 'listening',
    level: 'A1',
    question: 'Listen to the audio and select the word you hear:',
    audioText: 'Good morning! How are you doing today?',
    options: ['Good evening', 'Good morning', 'Good afternoon', 'Good night'],
    correctAnswer: 'Good morning',
    explanation: 'The speaker says "Good morning! How are you doing today?".'
  },

  // A2 Level
  {
    id: 'pq_a2_1',
    type: 'multiple-choice',
    level: 'A2',
    question: 'Which sentence is grammatically correct?',
    options: [
      'Yesterday I visit my grandparents.',
      'Yesterday I visited my grandparents.',
      'Yesterday I have visited my grandparents.',
      'Yesterday I am visiting my grandparents.'
    ],
    correctAnswer: 'Yesterday I visited my grandparents.',
    explanation: 'The past simple tense ("visited") is used with finished past time expressions like "Yesterday".'
  },
  {
    id: 'pq_a2_2',
    type: 'fill-blank',
    level: 'A2',
    question: 'Choose the correct word: "This apartment is much ___ than our previous one."',
    options: ['more big', 'bigger', 'biggest', 'as big'],
    correctAnswer: 'bigger',
    explanation: 'For short one-syllable adjectives like "big", the comparative form adds "-ger" (bigger).'
  },

  // B1 Level
  {
    id: 'pq_b1_1',
    type: 'multiple-choice',
    level: 'B1',
    question: 'Choose the best option: "If I ___ enough money, I would travel around the world."',
    options: ['have', 'had', 'will have', 'would have'],
    correctAnswer: 'had',
    explanation: 'In second conditional sentences (hypothetical present/future), we use: If + Past Simple, would + verb.'
  },
  {
    id: 'pq_b1_2',
    type: 'listening',
    level: 'B1',
    question: 'Listen to the sentence and complete the key word: "We need to ___ our environmental impact."',
    audioText: 'We need to reduce our environmental impact.',
    options: ['reduce', 'increase', 'remove', 'produce'],
    correctAnswer: 'reduce',
    explanation: 'The speaker says "We need to reduce our environmental impact."'
  },
  {
    id: 'pq_b1_3',
    type: 'fill-blank',
    level: 'B1',
    question: 'Select the correct relative pronoun: "The scientist ___ discovered the new remedy was awarded a medal."',
    options: ['which', 'who', 'whom', 'whose'],
    correctAnswer: 'who',
    explanation: '"Who" is used as the relative pronoun to refer to people (the scientist).'
  },

  // B2 Level
  {
    id: 'pq_b2_1',
    type: 'multiple-choice',
    level: 'B2',
    question: 'Select the best phrase: "By the time we arrive at the theater, the movie ___."',
    options: ['will start', 'starts', 'will have started', 'is starting'],
    correctAnswer: 'will have started',
    explanation: 'Future Perfect ("will have started") is used for an action that will be completed before a specified point in the future.'
  },
  {
    id: 'pq_b2_2',
    type: 'fill-blank',
    level: 'B2',
    question: 'Choose the correct idiom/phrasal verb: "She refused to ___ up with his rude behavior any longer."',
    options: ['put', 'take', 'catch', 'keep'],
    correctAnswer: 'put',
    explanation: '"Put up with" is a phrasal verb meaning to tolerate or accept an unpleasant situation.'
  },

  // C1 Level
  {
    id: 'pq_c1_1',
    type: 'multiple-choice',
    level: 'C1',
    question: 'Select the inverted sentence structure: "Scarcely ___ the project when a new crisis emerged."',
    options: [
      'we had completed',
      'had we completed',
      'we completed',
      'did we complete'
    ],
    correctAnswer: 'had we completed',
    explanation: 'After negative adverbs like "Scarcely" or "Hardly", negative inversion requires auxiliary verb before subject: Scarcely had we completed...'
  },
  {
    id: 'pq_c1_2',
    type: 'fill-blank',
    level: 'C1',
    question: 'Choose the vocabulary word that best fits: "His argument was so ___ that even his opponent agreed."',
    options: ['compelling', 'tentative', 'superficial', 'ambiguous'],
    correctAnswer: 'compelling',
    explanation: '"Compelling" means convincing, powerful, and demanding attention.'
  },

  // C2 Level
  {
    id: 'pq_c2_1',
    type: 'multiple-choice',
    level: 'C2',
    question: 'Select the most precise expression: "The CEO\'s speech was filled with subtle ___, hinting at future restructuring without stating it directly."',
    options: ['innuendos', 'nuances', 'tautologies', 'paradoxes'],
    correctAnswer: 'nuances',
    explanation: '"Nuances" refers to subtle differences or shades of meaning, expression, or tone.'
  }
];
