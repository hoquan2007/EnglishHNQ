import { GrammarLesson } from '../types';

export const initialGrammarLessons: GrammarLesson[] = [
  {
    id: 'g_1',
    title: 'Present Simple vs Present Continuous',
    level: 'A1',
    category: 'Tenses',
    summary: 'Phân biệt Thì Hiện Tại Đơn (thói quen, sự thật) & Hiện Tại Tiếp Diễn (hành động đang diễn ra).',
    explanationMarkdown: `
### 1. Thì Hiện Tại Đơn (Present Simple)
- **Công thức:** 
  - Khẳng định: \`S + V(s/es)\`
  - Phủ định: \`S + do/does + not + V-bare\`
  - Nghi vấn: \`Do/Does + S + V-bare?\`
- **Cách dùng:** Diễn tả thói quen lặp đi lặp lại, sự thật hiển nhiên, lịch trình cố định.
- **Từ nhận biết:** *always, usually, often, sometimes, everyday, on Mondays...*

### 2. Thì Hiện Tại Tiếp Diễn (Present Continuous)
- **Công thức:** \`S + am/is/are + V-ing\`
- **Cách dùng:** Diễn tả hành động đang xảy ra ngay tại thời điểm nói hoặc xung quanh thời điểm nói.
- **Từ nhận biết:** *now, right now, at the moment, look!, listen!...*
    `,
    examples: [
      { english: 'I usually drink coffee in the morning, but today I am drinking tea.', vietnamese: 'Tôi thường uống cà phê vào buổi sáng, nhưng hôm nay tôi đang uống trà.' },
      { english: 'Look! The rain is falling heavily outside.', vietnamese: 'Nhìn kìa! Trời đang mưa rất to ở bên ngoài.' }
    ],
    quizzes: [
      {
        id: 'q_g1_1',
        question: 'Listen! Somebody ___ at the door right now.',
        options: ['knocks', 'is knocking', 'knocked', 'has knocked'],
        correctAnswer: 1,
        explanation: 'Từ nhận biết "Listen!" và "right now" chỉ hành động đang diễn ra -> Dùng Present Continuous (is knocking).'
      },
      {
        id: 'q_g1_2',
        question: 'The Earth ___ around the Sun once every 365 days.',
        options: ['revolves', 'is revolving', 'revolved', 'revolve'],
        correctAnswer: 0,
        explanation: 'Chuyển động của Trái Đất là sự thật hiển nhiên -> Dùng Present Simple (revolves).'
      }
    ]
  },

  {
    id: 'g_2',
    title: 'Present Perfect (Thì Hiện Tại Hoàn Thành)',
    level: 'A2',
    category: 'Tenses',
    summary: 'Diễn tả hành động đã xảy ra trong quá khứ nhưng kết quả hoặc ảnh hưởng vẫn còn đến hiện tại.',
    explanationMarkdown: `
### Thì Hiện Tại Hoàn Thành (Present Perfect)
- **Công thức:** \`S + have/has + V3/ed\`
- **Cách dùng tiêu biểu:**
  1. Trải nghiệm sống tính đến thời điểm hiện tại (*have you ever...?*).
  2. Hành động bắt đầu ở quá khứ và kéo dài đến hiện tại (*for / since*).
  3. Hành động vừa mới xảy ra (*just, already, recently*).

#### Phân biệt "Since" & "For":
- **Since + Mốc thời gian:** *since 2010, since last week, since I was young.*
- **For + Khoảng thời gian:** *for 5 years, for two hours, for a long time.*
    `,
    examples: [
      { english: 'I have lived in Hanoi for more than ten years.', vietnamese: 'Tôi đã sống ở Hà Nội hơn 10 năm nay (hiện vẫn đang sống).' },
      { english: 'Have you ever visited Japan before?', vietnamese: 'Bạn đã từng ghé thăm Nhật Bản trước đây chưa?' }
    ],
    quizzes: [
      {
        id: 'q_g2_1',
        question: 'She has been working as a software developer ___ 2018.',
        options: ['for', 'since', 'in', 'from'],
        correctAnswer: 1,
        explanation: '"2018" là mốc thời gian cụ thể trong quá khứ -> Dùng "since".'
      },
      {
        id: 'q_g2_2',
        question: 'I cannot open the door because I ___ my keys.',
        options: ['lost', 'have lost', 'am losing', 'had lost'],
        correctAnswer: 1,
        explanation: 'Việc mất chìa khóa xảy ra ở quá khứ nhưng hậu quả đến hiện tại là không mở được cửa -> Dùng Present Perfect (have lost).'
      }
    ]
  },

  {
    id: 'g_3',
    title: 'Conditionals Type 1 & Type 2 (Câu Điều Kiện Loạt 1 & 2)',
    level: 'B1',
    category: 'Conditionals',
    summary: 'Luyện tập câu điều kiện có thật ở hiện tại/tương lai (Loại 1) và giả định không có thật ở hiện tại (Loại 2).',
    explanationMarkdown: `
### 1. Câu điều kiện Loại 1 (Real Conditional)
- **Công thức:** \`If + S + V(present simple), S + will/can + V-bare\`
- **Ý nghĩa:** Tình huống có khả năng xảy ra ở hiện tại hoặc tương lai.

### 2. Câu điều kiện Loại 2 (Unreal Present Conditional)
- **Công thức:** \`If + S + V2/ed (were for all subjects), S + would/could + V-bare\`
- **Ý nghĩa:** Giả định trái ngược với thực tế ở hiện tại.

*Ví dụ so sánh:*
- *Type 1:* If it rains tomorrow, we will stay at home. (Trời có thể mưa)
- *Type 2:* If I were a bird, I would fly everywhere. (Thực tế tôi không phải là chim)
    `,
    examples: [
      { english: 'If you study hard, you will pass the English test easily.', vietnamese: 'Nếu bạn học chăm chỉ, bạn sẽ vượt qua bài test tiếng Anh dễ dàng.' },
      { english: 'If I had 1 million dollars right now, I would buy a luxury villa.', vietnamese: 'Nếu tôi có 1 triệu đô ngay lúc này, tôi sẽ mua một căn biệt thự sang trọng.' }
    ],
    quizzes: [
      {
        id: 'q_g3_1',
        question: 'If she ___ more free time, she would take up oil painting.',
        options: ['has', 'had', 'will have', 'would have'],
        correctAnswer: 1,
        explanation: 'Mệnh đề có "would take" thuộc Loại 2 -> Mệnh đề If dùng Past Simple ("had").'
      },
      {
        id: 'q_g3_2',
        question: 'If you don\'t hurry up, you ___ the last bus home.',
        options: ['missed', 'would miss', 'will miss', 'miss'],
        correctAnswer: 2,
        explanation: 'Đây là câu điều kiện Loại 1 (khả năng có thật) -> Dùng "will miss".'
      }
    ]
  },

  {
    id: 'g_4',
    title: 'Passive Voice (Câu Bị Động)',
    level: 'B2',
    category: 'Sentence Structure',
    summary: 'Chuyển đổi câu chủ động sang bị động, nhấn mạnh vào đối tượng chịu tác động của hành động.',
    explanationMarkdown: `
### Quy tắc chuyển sang Câu Bị Động (Passive Voice)
- **Công thức tổng quát:** \`Object + Be (thì tương ứng) + V3/ed (+ by Subject)\`

#### Các Thì Phổ Biến Trong Câu Bị Động:
1. **Present Simple:** \`am/is/are + V3/ed\`
2. **Past Simple:** \`was/were + V3/ed\`
3. **Present Perfect:** \`have/has + been + V3/ed\`
4. **Modal Verbs:** \`can/must/should + be + V3/ed\`

*Lưu ý:* Bỏ *by someone, by people, by them...* khi chủ thể không rõ ràng hoặc không quan trọng.
    `,
    examples: [
      { english: 'Active: The engineer repaired the laptop.', vietnamese: 'Kỹ sư đã sửa chiếc máy tính xách tay.' },
      { english: 'Passive: The laptop was repaired by the engineer.', vietnamese: 'Chiếc máy tính xách tay đã được sửa bởi kỹ sư.' }
    ],
    quizzes: [
      {
        id: 'q_g4_1',
        question: 'Thousands of new apartments ___ in this district every year.',
        options: ['build', 'are built', 'were built', 'have built'],
        correctAnswer: 1,
        explanation: 'Hành động xây nhà diễn ra thường xuyên ("every year") ở dạng bị động -> Dùng Present Simple Passive ("are built").'
      }
    ]
  },

  {
    id: 'g_5',
    title: 'Inversion with Negative Adverbs (Đảo Ngữ)',
    level: 'C1',
    category: 'Advanced Grammar',
    summary: 'Cấu trúc đảo ngữ đưa trợ động từ lên trước chủ ngữ để nhấn mạnh khi câu bắt đầu bằng trạng từ phủ định.',
    explanationMarkdown: `
### Cấu Trúc Đảo Ngữ Nâng Cao (Inversion)
Khi các từ/cụm từ phủ định đứng đầu câu để tạo sự nhấn mạnh (Emphasis), chúng ta thực hiện đảo trợ động từ lên trước chủ ngữ:

- **Các trạng từ thường gặp:** *Never, Seldom, Rarely, Hardly, Scarcely, No sooner, Only when...*
- **Công thức:** \`Trạng từ phủ định + Auxiliary Verb (do/does/did/have/had) + Subject + Main Verb\`

#### Cấu trúc đặc biệt:
- \`Hardly / Scarcely + had + S + V3... WHEN + S + V2\`
- \`No sooner + had + S + V3... THAN + S + V2\`
    `,
    examples: [
      { english: 'Rarely have I seen such an inspiring performance.', vietnamese: 'Hiếm khi nào tôi được chứng kiến một màn trình diễn truyền cảm hứng đến vậy.' },
      { english: 'No sooner had he arrived than the rain started.', vietnamese: 'Anh ấy vừa mới tới nơi thì trời bắt đầu mưa.' }
    ],
    quizzes: [
      {
        id: 'q_g5_1',
        question: 'Seldom ___ such remarkable resilience in young students.',
        options: ['we witness', 'do we witness', 'we have witnessed', 'witnessed we'],
        correctAnswer: 1,
        explanation: 'Đứng đầu câu là trạng từ phủ định "Seldom" -> Đảo trợ động từ "do" lên trước "we witness".'
      }
    ]
  }
];

export const grammarCategories = [
  'All',
  'Tenses',
  'Conditionals',
  'Sentence Structure',
  'Advanced Grammar'
];
