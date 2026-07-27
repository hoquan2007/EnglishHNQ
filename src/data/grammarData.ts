import { GrammarLesson } from '../types';

export const initialGrammarLessons: GrammarLesson[] = [
  // ==================== A1 LEVEL ====================
  {
    id: 'g_a1_1',
    title: 'Present Simple vs Present Continuous (Thì Hiện Tại Đơn & Hiện Tại Tiếp Diễn)',
    level: 'A1',
    category: 'Tenses',
    summary: 'Phân biệt hành động thói quen/sự thật hiển nhiên (Present Simple) và hành động đang diễn ra ngay lúc nói (Present Continuous).',
    explanationMarkdown: `### 1. Thì Hiện Tại Đơn (Present Simple)
#### Công thức:
- **Khẳng định:** S + V(s/es)
- **Phủ định:** S + do/does + not + V-bare
- **Nghi vấn:** Do/Does + S + V-bare?

#### Cách dùng:
- Diễn tả sự thật hiển nhiên hoặc thực tế khách quan (The sun rises in the East).
- Thói quen hoặc hành động lặp đi lặp lại hàng ngày (I go to school every day).
- Dấu hiệu: *always, usually, often, sometimes, never, every day, on Mondays*.

### 2. Thì Hiện Tại Tiếp Diễn (Present Continuous)
#### Công thức:
- **Khẳng định:** S + am/is/are + V-ing
- **Phủ định:** S + am/is/are + not + V-ing
- **Nghi vấn:** Am/Is/Are + S + V-ing?

#### Cách dùng:
- Diễn tả hành động đang xảy ra ngay tại thời điểm nói (She is reading a book right now).
- Dấu hiệu: *now, right now, at the moment, Look!, Listen!*.`,
    examples: [
      { english: 'She drinks coffee every morning.', vietnamese: 'Cô ấy uống cà phê mỗi buổi sáng. (Thói quen)' },
      { english: 'Look! It is raining outside.', vietnamese: 'Nhìn kìa! Trời đang mưa ở bên ngoài. (Hành động ngay lúc nói)' }
    ],
    quizzes: [
      {
        id: 'q_a1_1_1',
        question: 'Listen! Someone _______ at the front door.',
        options: ['knocks', 'is knocking', 'knocked', 'knocking'],
        correctAnswer: 1,
        explanation: 'Từ "Listen!" báo hiệu hành động đang xảy ra ngay thời điểm nói -> Dùng Hiện tại tiếp diễn (is knocking).'
      },
      {
        id: 'q_a1_1_2',
        question: 'My father usually _______ to work by car.',
        options: ['is going', 'go', 'goes', 'went'],
        correctAnswer: 2,
        explanation: 'Trạng từ "usually" chỉ thói quen hàng ngày -> Dùng Hiện tại đơn với chủ ngữ số ít "My father" (goes).'
      }
    ]
  },
  {
    id: 'g_a1_2',
    title: 'Past Simple Tense (Thì Quá Khứ Đơn)',
    level: 'A1',
    category: 'Tenses',
    summary: 'Diễn tả hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ tại mốc thời gian xác định.',
    explanationMarkdown: `### Thì Quá Khứ Đơn (Past Simple)
#### Công thức:
- **Động từ To Be:** S + was/were
- **Động từ thường:** S + V2/ed
- **Phủ định:** S + did not (didn't) + V-bare
- **Nghi vấn:** Did + S + V-bare?

#### Cách dùng:
- Diễn tả sự việc diễn ra và kết thúc hoàn toàn trong quá khứ.
- Dấu hiệu: *yesterday, last night/week/year, 2 days ago, in 2020*.`,
    examples: [
      { english: 'We visited Hanoi last weekend.', vietnamese: 'Chúng tôi đã thăm Hà Nội vào cuối tuần trước.' },
      { english: 'She did not buy the red dress yesterday.', vietnamese: 'Cô ấy đã không mua chiếc váy đỏ ngày hôm qua.' }
    ],
    quizzes: [
      {
        id: 'q_a1_2_1',
        question: 'They _______ a new house two years ago.',
        options: ['buy', 'buys', 'bought', 'have bought'],
        correctAnswer: 2,
        explanation: 'Có trạng từ chỉ thời gian quá khứ "two years ago" -> Dùng V2 của buy là bought.'
      }
    ]
  },

  // ==================== A2 LEVEL ====================
  {
    id: 'g_a2_1',
    title: 'Present Perfect Simple (Thì Hiện Tại Hoàn Thành)',
    level: 'A2',
    category: 'Tenses',
    summary: 'Diễn tả hành động xảy ra trong quá khứ nhưng không đề cập thời gian cụ thể hoặc kéo dài đến hiện tại.',
    explanationMarkdown: `### Thì Hiện Tại Hoàn Thành
#### Công thức:
- **Khẳng định:** S + have/has + V3/ed
- **Phủ định:** S + have/has + not + V3/ed
- **Nghi vấn:** Have/Has + S + V3/ed?

#### Dấu hiệu nhận biết:
- *already, yet, just, ever, never, since (+ mốc thời gian), for (+ khoảng thời gian)*.`,
    examples: [
      { english: 'I have lived in London for 5 years.', vietnamese: 'Tôi đã sống ở London được 5 năm (và hiện tại vẫn đang sống ở đó).' },
      { english: 'Have you ever visited Japan?', vietnamese: 'Bạn đã từng đến Nhật Bản bao giờ chưa?' }
    ],
    quizzes: [
      {
        id: 'q_a2_1_1',
        question: 'She _______ her homework yet.',
        options: ['has not finished', 'did not finish', 'finished', 'is not finishing'],
        correctAnswer: 0,
        explanation: 'Từ "yet" đứng cuối câu phủ định -> Dùng Hiện tại hoàn thành (has not finished).'
      }
    ]
  },
  {
    id: 'g_a2_2',
    title: 'Comparatives & Superlatives (So Sánh Hơn & So Sánh Nhất)',
    level: 'A2',
    category: 'Modifiers',
    summary: 'Cấu trúc so sánh tính từ ngắn và tính từ dài trong tiếng Anh.',
    explanationMarkdown: `### 1. So Sánh Hơn (Comparatives)
- Tính từ ngắn: adj + -er + than (tall -> taller than)
- Tính từ dài: more + adj + than (beautiful -> more beautiful than)

### 2. So Sánh Nhất (Superlatives)
- Tính từ ngắn: the + adj + -est (tall -> the tallest)
- Tính từ dài: the most + adj (beautiful -> the most beautiful)`,
    examples: [
      { english: 'Tokyo is larger than Paris.', vietnamese: 'Tokyo lớn hơn Paris.' },
      { english: 'Mount Everest is the highest mountain in the world.', vietnamese: 'Đỉnh Everest là ngọn núi cao nhất thế giới.' }
    ],
    quizzes: [
      {
        id: 'q_a2_2_1',
        question: 'This lesson is _______ than the previous one.',
        options: ['easy', 'easier', 'more easy', 'easiest'],
        correctAnswer: 1,
        explanation: 'Easy là tính từ ngắn kết thúc bằng -y -> Đổi y thành i rồi thêm -er thành easier.'
      }
    ]
  },

  // ==================== B1 LEVEL ====================
  {
    id: 'g_b1_1',
    title: 'Conditionals Type 1 & 2 (Câu Điều Kiện Loại 1 & 2)',
    level: 'B1',
    category: 'Conditionals',
    summary: 'Câu điều kiện có thật ở hiện tại/tương lai (Loại 1) và giả định không có thật ở hiện tại (Loại 2).',
    explanationMarkdown: `### 1. Câu Điều Kiện Loại 1 (Có thật ở hiện tại/tương lai)
- **Mệnh đề If:** If + Present Simple (V1)
- **Mệnh đề chính:** Will + V-bare

### 2. Câu Điều Kiện Loại 2 (Giả định không có thật ở hiện tại)
- **Mệnh đề If:** If + Past Simple (V2 / were)
- **Mệnh đề chính:** Would/Could + V-bare`,
    examples: [
      { english: 'If it rains tomorrow, we will stay at home.', vietnamese: 'Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà. (Loại 1)' },
      { english: 'If I were rich, I would buy a luxury yacht.', vietnamese: 'Nếu tôi giàu, tôi sẽ mua một chiếc du thuyền hạng sang. (Loại 2)' }
    ],
    quizzes: [
      {
        id: 'q_b1_1_1',
        question: 'If I _______ you, I would accept their job offer immediately.',
        options: ['am', 'was', 'were', 'had been'],
        correctAnswer: 2,
        explanation: 'Câu điều kiện loại 2 giả định trái ngược hiện tại -> Dùng "were" cho tất cả các ngôi.'
      }
    ]
  },
  {
    id: 'g_b1_2',
    title: 'Passive Voice (Câu Bị Động)',
    level: 'B1',
    category: 'Sentence Structures',
    summary: 'Chuyển đổi câu chủ động sang câu bị động tập trung vào đối tượng chịu tác động của hành động.',
    explanationMarkdown: `### Cấu Trúc Tổng Quát:
**Subject + Be + V3/ed (+ by Object)**

#### Động từ "Be" biến đổi theo thì:
- Hiện tại đơn: am/is/are + V3
- Quá khứ đơn: was/were + V3
- Hiện tại hoàn thành: have/has been + V3
- Động từ khuyết thiếu: can/must/should + be + V3`,
    examples: [
      { english: 'Active: The chef cooked a delicious dinner.', vietnamese: 'Chủ động: Đầu bếp đã nấu bữa tối ngon miệng.' },
      { english: 'Passive: A delicious dinner was cooked by the chef.', vietnamese: 'Bị động: Bữa tối ngon miệng đã được nấu bởi đầu bếp.' }
    ],
    quizzes: [
      {
        id: 'q_b1_2_1',
        question: 'The new bridge _______ by local workers last month.',
        options: ['built', 'was built', 'is built', 'has been built'],
        correctAnswer: 1,
        explanation: 'Chủ ngữ "The new bridge" là vật + thời gian "last month" -> Câu bị động quá khứ đơn (was built).'
      }
    ]
  },

  // ==================== B2 LEVEL ====================
  {
    id: 'g_b2_1',
    title: 'Conditionals Type 3 & Mixed Conditionals (Câu Điều Kiện Loại 3 & Hỗn Hợp)',
    level: 'B2',
    category: 'Conditionals',
    summary: 'Giả định tiếc nuối trái ngược hoàn toàn với thực tế trong quá khứ.',
    explanationMarkdown: `### 1. Câu Điều Kiện Loại 3 (Giả định trái với quá khứ)
- **Mệnh đề If:** If + Past Perfect (had + V3)
- **Mệnh đề chính:** Would have + V3

### 2. Câu Điều Kiện Hỗn Hợp (Trái quá khứ -> Dẫn đến kết quả ở hiện tại)
- **Mệnh đề If:** If + Past Perfect (had + V3)
- **Mệnh đề chính:** Would + V-bare (now)`,
    examples: [
      { english: 'If I had studied harder, I would have passed the exam.', vietnamese: 'Nếu quá khứ tôi học chăm hơn, tôi đã đậu kỳ thi rồi. (Loại 3)' },
      { english: 'If I had caught the early train, I would be in London now.', vietnamese: 'Nếu tôi bắt chuyến tàu sớm lúc trước, bây giờ tôi đã ở London rồi. (Hỗn hợp)' }
    ],
    quizzes: [
      {
        id: 'q_b2_1_1',
        question: 'If you had told me about the meeting, I _______ it.',
        options: ['would attend', 'attended', 'would have attended', 'had attended'],
        correctAnswer: 2,
        explanation: 'Giả định sự việc trong quá khứ (If had V3) -> Mệnh đề chính loại 3 chọn "would have attended".'
      }
    ]
  },
  {
    id: 'g_b2_2',
    title: 'Relative Clauses (Mệnh Đề Quan Hệ Defining & Non-defining)',
    level: 'B2',
    category: 'Clause Structures',
    summary: 'Sử dụng đại từ quan hệ Who, Whom, Which, That, Whose để nối câu và bổ nghĩa cho danh từ.',
    explanationMarkdown: `### 1. Đại Từ Quan Hệ:
- **Who:** Thay cho người (chủ ngữ)
- **Whom:** Thay cho người (tân ngữ)
- **Which:** Thay cho vật/sự việc
- **Whose:** Chỉ sở hữu (whose + noun)
- **That:** Thay cho who/which trong mệnh đề xác định (không dùng sau dấu phẩy).`,
    examples: [
      { english: 'The man who lives next door is a famous scientist.', vietnamese: 'Người đàn ông sống cạnh nhà là một nhà khoa học nổi tiếng.' },
      { english: 'My laptop, which I bought last week, works perfectly.', vietnamese: 'Laptop của tôi, cái mà tôi mua tuần trước, hoạt động hoàn hảo.' }
    ],
    quizzes: [
      {
        id: 'q_b2_2_1',
        question: 'The student _______ essay won first place was awarded a scholarship.',
        options: ['who', 'whom', 'whose', 'which'],
        correctAnswer: 2,
        explanation: 'Từ "essay" thuộc sở hữu của "The student" -> Dùng đại từ sở hữu "whose".'
      }
    ]
  },

  // ==================== C1 LEVEL ====================
  {
    id: 'g_c1_1',
    title: 'Advanced Inversion (Đảo Ngữ Nâng Cao)',
    level: 'C1',
    category: 'Advanced Grammar',
    summary: 'Nhấn mạnh câu bằng cách đưa trạng từ phủ định hoặc cụm giới từ lên đầu câu và đảo trợ động từ lên trước chủ ngữ.',
    explanationMarkdown: `### Cấu Trúc Đảo Ngữ:
**Negative Adverb + Auxiliary Verb + Subject + Main Verb**

#### Các Trạng Từ Phủ Định Thường Gặp:
- *Never, Seldom, Rarely, Hardly... when, No sooner... than, Only by, Not only... but also*.`,
    examples: [
      { english: 'Seldom have I seen such an inspiring performance.', vietnamese: 'Hiếm khi nào tôi được chứng kiến một màn trình diễn truyền cảm hứng đến vậy.' },
      { english: 'No sooner had he arrived than the rain started.', vietnamese: 'Ngay khi anh ấy vừa tới nơi thì trời bắt đầu đổ mưa.' }
    ],
    quizzes: [
      {
        id: 'q_c1_1_1',
        question: 'Not only _______ the match, but they also broke the championship record.',
        options: ['they won', 'did they win', 'they have won', 'have they won'],
        correctAnswer: 1,
        explanation: 'Cấu trúc đảo ngữ "Not only" đứng đầu câu quá khứ -> mượn trợ động từ "did they win".'
      }
    ]
  }
];

export const grammarCategories = [
  'All',
  'Tenses',
  'Conditionals',
  'Sentence Structures',
  'Modifiers',
  'Clause Structures',
  'Advanced Grammar'
];
