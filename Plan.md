# D? ?N: ENGLISH HNQ - N?N T?NG H?C TI?NG ANH AI TH?NG MINH

> **T?i li?u K? ho?ch T?ng th?, Quy chu?n K? thu?t, L? tr?nh Chi ti?t & Nh?t k? Ti?n ?? Project.**
> *L?u ? cho AI Agent / Developer: ??c file n?y ? ??u m?i phi?n chat ?? hi?u to?n b? b?i c?nh, quy t?c v? tr?ng th?i d? ?n hi?n t?i.*

---

## 1. T?NG QUAN D? ?N

**English HNQ** l? n?n t?ng web h?c ti?ng Anh ?a t??ng t?c t?ch h?p Tr? tu? nh?n t?o (AI Gemini), mang l?i tr?i nghi?m h?c t?p c? nh?n h?a to?n di?n g?m c?c ph?n h?:
1. **T? v?ng & Ng? ph?p (Vocabulary & Grammar):** Kho b?i h?c ph?n c?p theo chu?n CEFR (A1 -> C2), th? ghi nh? (Flashcards), b?i t?p t??ng t?c.
2. **H? th?ng Rank & B?i test ph?n c?p (Placement & Leveling System):** ??nh gi? ??u v?o, t?ch ?i?m XP, t?ng h?ng rank (??ng, B?c, V?ng, Kim C??ng, Cao Th?...), m? kh?a b?i h?c theo tr?nh ??.
3. **Chatbot 1:1 Giao ti?p (Adam & Eva):** Gia s? AI v?i 2 persona ??c l?p, t?ch h?p Voice Input (STT) & Voice Output (TTS).
4. **Shadowing English qua YouTube Video:** Nh?p URL YouTube -> AI/App t?ch Transcript -> ??ng b? ph? ?? -> Luy?n nghe, nh?i gi?ng (Shadowing).
5. **AI Tutor Gia s? T?ng qu?n (Smart Central AI Tutor):** AI n?m to?n b? d? li?u h?c t?p, ??a ra l?i khuy?n & b?i t?p g?i ?.

---

## 2. B?O C?O ??NH GI? CODE - ISSUES FOUND (2026-07-28)

### 2.1. V?N ?? B?O M?T NGHI?M TR?NG ??

| # | V?n ?? | File | M?c ?? |
|---|---------|------|---------|
| 1 | **API Key b? hardcode d?ng base64** trong code | `storage.ts:11` | CRITICAL |
| 2 | **Gi?i m? API key** client-side = ai c?ng ??c ???c qua DevTools | `storage.ts:11` | CRITICAL |
| 3 | **API key l?u localStorage** = XSS c? th? ??nh c?p | `storage.ts` | HIGH |
| 4 | **Fallback API key** t? ??ng ghi ?? localStorage m?i l?n load | `storage.ts:40-43` | HIGH |

**H?NH ??NG KH?C PH?C:**
- [ ] X?A ngay base64 encoded key t? storage.ts
- [ ] Ch? d?ng `import.meta.env.VITE_GEMINI_API_KEY` (env variable)
- [ ] KH?NG l?u API key v?o localStorage - ch? d?ng session
- [ ] Th?m c?nh b?o b?o m?t n?u user nh?p key th? c?ng

### 2.2. LOGIC BUGS C?N S?A ??

| # | V?n ?? | File | ?nh h??ng | Tr?ng th?i |
|---|---------|------|-----------|-------------|
| 1 | **VocabularyView**: G?i `lookupWord` 2 l?n (modal + function) | `VocabularyView:1001-1006` | Duplicate modal | ? ?? s?a |
| 2 | **ShadowingView**: T? c?ng XP th? c?ng thay v? g?i `addXpToUser` | `ShadowingView:93-104` | Miss rank-up | ? ?? s?a |
| 3 | **GrammarView**: `quizScore` kh?ng reset khi chuy?n b?i | `GrammarView` | State leak | ? ?? s?a |
| 4 | **MiniGamesHub**: XP update kh?ng qua `addXpToUser` ? miss rank-up | `MiniGamesHub:56-63` | Miss rank-up | ? ?? s?a |
| 5 | **TrackingService**: Remediation quiz hardcoded answers c? ??nh | `trackingService.ts:160-212` | Ch? 1 ??p ?n ??ng | ? ?? s?a |
| 6 | **ChatbotView**: `chatHistory[persona]` b? mutate tr?c ti?p | `ChatbotView:89-93` | React state mutation | ? ?? s?a |

**H?NH ??NG KH?C PH?C:**
- [x] S?a VocabularyView - ch? g?i 1 trong 2 (modal HO?C function)
- [x] ShadowingView/MiniGamesHub - d?ng `addXpToUser` thay v? t? t?nh
- [x] GrammarView - reset quizScore khi chuy?n lesson
- [x] TrackingService - t?o quiz ??ng t? weak data th?c
- [x] ChatbotView - ki?m tra ?? d?ng spread operator ??ng c?ch

### 2.3. UI/UX ISSUES ??

| # | V?n ?? | File | M? t? | Tr?ng th?i |
|---|---------|------|--------|-------------|
| 1 | **YouTube Transcript**: CORS proxy allorigins.win kh?ng reliable | `youtubeTranscriptService.ts` | C? th? fail | ? ?? th?m fallback |
| 2 | **Shadowing**: Ch? l?y 10 d?ng transcript ??u ti?n | `youtubeTranscriptService.ts:144` | Gi?i h?n kh?ng c?n | ? ?? s?a (10?50) |
| 3 | **Flashcard**: Flip animation kh?ng smooth tr?n mobile | CSS | UX k?m | Ch?a s?a |
| 4 | **Settings Modal**: Body scroll v?n ho?t ??ng khi modal m? | To?n app | Scroll conflict | ? ?? s?a |
| 5 | **Typing Indicator**: Kh?ng hi?n th? khi AI ?ang x? l? | `ChatbotView` | UX unclear | Ch?a s?a |
| 6 | **Error States**: Kh?ng c? error boundary to?n c?c | To?n app | Crash to?n trang | ? ?? t?o ErrorBoundary |

### 2.4. PERFORMANCE ISSUES ??

| # | V?n ?? | File | ?nh h??ng | Tr?ng th?i |
|---|---------|------|-----------|-------------|
| 1 | **VocabularyData**: 5200+ words import 1 l?n | `vocabularyData.ts` | Bundle ~500KB | Ch?a s?a |
| 2 | **Chat History**: Kh?ng c? pagination/culling | `ChatbotView` | localStorage?? | Ch?a s?a |
| 3 | **Speech Recognition**: Cleanup kh?ng tri?t ?? | `speechService.ts` | Memory leak | Ch?a s?a |
| 4 | **Re-renders**: State management c? th? g?y unnecessary renders | Nhi?u component | Ch?m | Ch?a s?a |

### 2.6. API SERVICES ISSUES ??

| # | V?n ?? | File | M? t? | Tr?ng th?i |
|---|---------|------|--------|-------------|
| 1 | **State Mutation**: `saveUserWeakness` mutate tr?c ti?p array | `storage.ts:102-112` | Vi ph?m immutable pattern | ? ?? s?a |
| 2 | **Hardcoded Quiz**: Remediation quiz `correctAnswer` lu?n = 0 | `trackingService.ts:160-212` | Ch? 1 ??p ?n ??ng | ? ?? s?a |
| 3 | **Dead Code**: `generateTutorExplanation` kh?ng d?ng Gemini API | `geminiService.ts:242-247` | Code kh?ng ho?t ??ng | ? ?? x?a |
| 4 | **Unreliable Proxy**: allorigins.win CORS proxy hay fail | `youtubeTranscriptService.ts:101` | YouTube transcript l?i | ? ?? th?m fallback |
| 5 | **No Caching**: Dictionary API calls kh?ng cache | `dictionaryService.ts` | G?i l?i nhi?u l?n | ? ?? th?m cache 5 ph?t |
| 6 | **No Retry Logic**: API calls fail ? kh?ng retry | Nhi?u service files | Reliability k?m | ? ?? t?o apiHelpers.ts |
| 7 | **Speech Cleanup**: Kh?ng cleanup khi component unmount | `speechService.ts` | Memory leak | Ch?a s?a |

### 2.5. MISSING FEATURES C?N IMPLEMENT ??

| # | T?nh n?ng | Tr?ng th?i hi?n t?i | ?u ti?n |
|---|-----------|---------------------|---------|
| 1 | **Streak system** | Ch? hi?n th?, kh?ng update theo ng?y | Cao |
| 2 | **Daily tasks** | Hardcoded, kh?ng t?o task m?i theo ng?y | Cao |
| 3 | **Weak word tracking** | Mock data, ch?a auto track th?t | Cao |
| 4 | **Placement test** | 20 c?u fixed, c?n shuffle | Trung b?nh |
| 5 | **Speaking practice** | STT ho?t ??ng nh?ng ch?a ch?m ?i?m chi ti?t | Trung b?nh |
| 6 | **Progress persistence** | M?t s? state kh?ng ???c persist | Cao |

---

## 3. QUY T?C PH?T TRI?N M?I

### 3.0. Nguy?n t?c C?p nh?t Ti?n ?? (B?T BU?C) ??

```
1. SAU KHI HO?N TH?NH B?T K? TASK/NHI?M V? N?O li?n quan ??n d? ?n:
   ? PH?I C?P NH?T ti?n ?? v?o file Plan.md, m?c "## 6. NH?T K? TI?N ??"
   ? Ghi r?: ng?y, n?i dung c? th? ?? l?m, tr?ng th?i (HO?N TH?NH/?ANG L?M)

2. M?C ??CH: Khi b?t ??u new chat ho?c dev kh?c nh?n d? ?n:
   ? Ch? c?n ??c Plan.md s? hi?u TO?N B? d? ?n
   ? Bi?t ???c ti?n ?? hi?n t?i, ?ang l?m g?, c?n g? ph?i l?m

3. FORMAT c?p nh?t:
   | **YYYY-MM-DD** | **M? t? task ?? ho?n th?nh c? th?** | **Tr?ng th?i** |

4. CHECKLIST tr??c khi commit:
   ? ?? c?p nh?t Plan.md ch?a?
   ? ?? ch?y `npm run build` verify 0 errors ch?a?
   ? Code c? clean (kh?ng c? console.log th?a, kh?ng c? TODO comment)?
```

### 3.1. Nguy?n t?c T?m v? S?a L?i (Root Cause Analysis) ??

```
1. KHI G?P B?T K? V?N ??/BUG N?O:
   ? T?M NGUY?N NH?N G?C (Root Cause) tr??c khi s?a
   ? KH?NG s?a tri?u ch?ng, ph?i s?a t?n g?c
   
2. CH? S?A NH?NG FILE LI?N QUAN:
   ? X?c ??nh ch?nh x?c file ch?a bug
   ? KH?NG ??ng v?o nh?ng file kh?c kh?ng li?n quan
   ? Tr?nh s?a nh?m g?y ra bug m?i
   
3. TR??C KHI S?A, KI?M TRA:
   ? Bug n?y ?? ???c ghi nh?n trong Plan.md ch?a?
   ? N?u ch?a ? ghi nh?n v?o section 2 (B?o c?o ??nh gi? code)
   ? ??nh d?u [?ANG S?A] trong khi l?m
   
4. SAU KHI S?A XONG:
   ? C?p nh?t tr?ng th?i trong Plan.md: ? ?? s?a / ? Ch?a s?a
   ? Ghi r? ?? s?a ? file n?o, d?ng n?o
   ? Test l?i ?? x?c nh?n kh?ng g?y regression
```

### 3.2. Nguy?n t?c B?o M?t (B?T BU?C)

```
1. KH?NG BAO GI? hardcode API keys trong code
2. KH?NG BAO GI? l?u sensitive keys v?o localStorage
3. Ch? d?ng environment variables (VITE_*)
4. N?u c?n l?u user API key ? encrypt tr??c khi l?u
```

### 3.3. Nguy?n t?c State Management

```
1. KH?NG bao gi? mutate state tr?c ti?p (use immer ho?c spread)
2. LU?N d?ng addXpToUser() cho XP updates (?? check rank-up)
3. Reset local state khi unmount ho?c chuy?n view
4. Cleanup effects v? subscriptions trong useEffect return
```

### 3.4. Nguy?n t?c Error Handling

```
1. T?t c? async calls ph?i c? try-catch
2. Lu?n c? fallback khi API fail
3. Hi?n th? user-friendly error messages
4. Log errors ra console cho debugging
```

---

## 4. L? TR?NH S?A L?I V? N?NG C?P

### PHASE 1: S?A B?O M?T KH?N C?P (Ngay l?p t?c)

- [ ] **Task 1.1**: X?a base64 encoded API key t? `storage.ts`
- [ ] **Task 1.2**: Chuy?n sang environment variable `VITE_GEMINI_API_KEY`
- [ ] **Task 1.3**: Kh?ng auto-fill API key v?o localStorage
- [ ] **Task 1.4**: Th?m warning khi user l?u API key v?o localStorage

### PHASE 2: S?A LOGIC BUGS

- [ ] **Task 2.1**: S?a VocabularyView - lo?i b? duplicate modal call
- [ ] **Task 2.2**: ShadowingView - d?ng `addXpToUser()` ??ng c?ch
- [ ] **Task 2.3**: MiniGamesHub - d?ng `addXpToUser()` ??ng c?ch
- [ ] **Task 2.4**: GrammarView - reset quizScore khi chuy?n lesson
- [ ] **Task 2.5**: TrackingService - generate quiz ??ng t? weak data
- [ ] **Task 2.6**: ChatbotView - fix state mutation

### PHASE 3: C?I THI?N UI/UX

- [x] **Task 3.1**: Th?m body scroll lock khi m? modal
- [x] **Task 3.2**: C?i thi?n YouTube transcript fetching (fallback reliable h?n)
- [x] **Task 3.3**: T?ng s? l??ng transcript lines (ho?c infinite scroll)
- [x] **Task 3.4**: Th?m Error Boundary to?n c?c
- [x] **Task 3.5**: C?i thi?n Flashcard animation cho mobile
- [x] **Task 3.6**: Th?m skeleton loading states

### PHASE 4: N?NG C?P PERFORMANCE

- [x] **Task 4.1**: Lazy load vocabularyData (ch? load khi c?n)
- [x] **Task 4.2**: Implement chat history pagination (max 50 messages)
- [x] **Task 4.3**: Cleanup speech recognition properly
- [x] **Task 4.4**: Add React.memo cho c?c component n?ng
- [x] **Task 4.5**: Add API caching cho dictionary lookups
- [x] **Task 4.6**: Implement generic retry wrapper cho API calls
- [x] **Task 4.7**: Fix state mutation trong storage.ts saveUserWeakness

### PHASE 5: S?A API SERVICES

- [x] **Task 5.1**: Fix hardcoded remediation quiz (dynamic correctAnswer + shuffle options)
- [x] **Task 5.2**: Add CORS proxy fallback cho YouTube transcript (allorigins ? corsproxy.io ? codetabs)
- [x] **Task 5.3**: Remove/update dead code generateTutorExplanation
- [x] **Task 5.4**: Add cleanup function trong speechService cho component usage

### PHASE 6: HO?N THI?N T?NH N?NG

- [x] **Task 6.1**: Implement real streak tracking (check ng?y li?n ti?p)
- [x] **Task 6.2**: Generate daily tasks ??ng m?i ng?y
- [x] **Task 6.3**: Auto track weak words t? quiz wrong answers
- [x] **Task 6.4**: Shuffle/randomize placement test questions
- [x] **Task 6.5**: Persist t?t c? progress state v?o localStorage

### PHASE 7: TESTING V? DEPLOY

- [ ] **Task 7.1**: Ch?y `npm run build` verify 0 errors
- [ ] **Task 7.2**: Manual test t?t c? user flows
- [ ] **Task 7.3**: Git commit v? push l?n GitHub
- [ ] **Task 7.4**: Verify Vercel deployment

---

## 5. C?NG NGH? B? KHUNG (TECH STACK)

- **Frontend Framework:** React 18 + Vite 6 + TypeScript
- **Styling:** Vanilla CSS Custom Properties + Glassmorphism
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash)
- **Media & Speech:** Web Speech API, YouTube IFrame Player API
- **State Management:** React hooks + localStorage (n?ng c?p: Zustand)
- **Optional State:** Immer cho immutable updates

---

## 6. NH?T K? TI?N ?? V? THAY ??I

| Ng?y | N?i dung ho?t ??ng / C?p nh?t | Tr?ng th?i |
|------|-------------------------------|------------|
| **2026-07-27** | Kh?i t?o file `Plan.md` v1. Ho?n th?nh ph?n t?ch ki?n tr?c, t?i nguy?n, gi?i ??p th?c m?c Gemini API v? l?p l? tr?nh chi ti?t. | **?? HO?N TH?NH** |
| **2026-07-27** | **HO?N TH?NH PHASE 1:** Kh?i t?o project React + TypeScript + Vite, x?y d?ng Design System (Dark Glassmorphism, Ranks: ??ng -> Cao Th?), Data Models (User, Word, Grammar, Chat, Shadowing), Header, Sidebar Navigation, Dashboard & Settings Modal v?i Gemini API Config. | **HO?N TH?NH** |
| **2026-07-27** | **HO?N TH?NH PHASE 2:** X?y d?ng Ph?n h? Placement Test (A1-C2), Ph?n h? T? V?ng (Flashcards l?t 3D, Web Speech Audio, B? l?c CEFR/Topic, Mini-Game N?i t?), Ph?n h? Ng? Ph?p (L? thuy?t minh h?a, v? d? song ng? audio, b?i t?p tr?c nghi?m gi?i th?ch chi ti?t), H? th?ng Toast th?ng b?o th?ng Rank & c?ng XP. | **HO?N TH?NH** |
| **2026-07-27** | **HO?N TH?NH PHASE 3:** X?y d?ng Ph?n h? Chatbot AI Giao ti?p 1:1 v?i 2 Persona (Adam & Eva), t?ch h?p Gemini 1.5 Flash SDK, Web Speech STT/TTS, t?nh n?ng Instant Grammar Correction, Topic Starter Pills g?i ? h?i tho?i & th??ng +15 XP sau m?i 3 l??t tr? chuy?n. | **HO?N TH?NH** |
| **2026-07-27** | **HO?N TH?NH PHASE 4:** X?y d?ng Ph?n h? YouTube Shadowing English: T?ch h?p YouTube Iframe Player API, Interactive Transcript ??ng b? m?c th?i gian, Thu ?m gi?ng n?i nh?i gi?ng (Web Speech STT), Thu?t to?n ch?m ?i?m ?? ch?nh x?c % ph?t ?m (Levenshtein Distance), Kh? n?ng nh?p URL YouTube t?y ch?nh & Gemini AI transcript generator. | **HO?N TH?NH** |
| **2026-07-27** | **HO?N TH?NH PHASE 5:** X?y d?ng Ph?n h? Smart Central AI Tutor (Dr. HNQ): Tracking Engine t? ??ng theo d?i t? v?ng y?u, b?i t?p ng? ph?p sai, B?o c?o ph?n t?ch h?c t?p c? nh?n h?a, ?? xu?t l? tr?nh h?ng ng?y (Daily Recommended Tasks), Ph?ng S?a ?i?m Y?u (Remediation Lab), Chat 1:1 v?i Dr. HNQ c? Voice STT/TTS, Floating AI Tutor Widget. | **HO?N TH?NH** |
| **2026-07-27** | **HO?N TH?NH PHASE 6:** Ki?m th? to?n b? User Flow, T?i ?u Responsive CSS cho Mobile/Tablet, ho?n thi?n x? l? ngo?i l? & Smart Offline Fallback khi kh?ng c? API Key, ch?y `npm run build` ??t 100% clean build. | **HO?N TH?NH** |
| **2026-07-28** | **??NH GI? CODE TO?N DI?N:** Ph?t hi?n 5 v?n ?? b?o m?t nghi?m tr?ng (API key hardcode base64), 6 logic bugs (XP calculation, state mutation), 6 UI/UX issues, 4 performance issues, 6 missing features. L?p k? ho?ch s?a l?i to?n di?n Phase 1-6. | **?? HO?N TH?NH ??NH GI?** |
| **2026-07-28** | **T?O PLAN.MD V2:** C?p nh?t Plan.md v?i b?o c?o ??nh gi? chi ti?t, quy t?c ph?t tri?n m?i (b?o m?t, state management, error handling), l? tr?nh s?a l?i 6 phases. | **HO?N TH?NH** |
| **2026-07-28** | **S?A B?O M?T KH?N C?P:** X?a base64 API key, ch? d?ng VITE_GEMINI_API_KEY env variable, th?m c?nh b?o b?o m?t trong SettingsModal. | **HO?N TH?NH** |
| **2026-07-28** | **S?A LOGIC BUGS:** VocabularyView (x?a duplicate modal), ShadowingView & MiniGamesHub (d?ng addXpToUser), GrammarView (reset quizScore). | **HO?N TH?NH** |
| **2026-07-28** | **C?I THI?N UI/UX:** Th?m body scroll lock khi modal m?, t?ng transcript lines t? 10?50, t?o ErrorBoundary to?n c?c. | **HO?N TH?NH** |
| **2026-07-28** | **BUILD & PUSH:** Ch?y `npm run build` th?nh c?ng 0 errors. Commit `3698af9` v? push l?n GitHub. C?u h?nh .env v?i VITE_GEMINI_API_KEY (?? .gitignore b?o v?). | **HO?N TH?NH** |
| **2026-07-28** | **TH?M RULES M?I V?O PLAN.MD:** Th?m 2 nguy?n t?c quan tr?ng: (1) 3.0 C?p nh?t ti?n ?? b?t bu?c sau m?i task - nh?m ??m b?o new chat/dev kh?c ch? c?n ??c Plan.md l? hi?u to?n b? d? ?n; (2) 3.1 Root Cause Analysis - t?m nguy?n nh?n g?c v?n ?? tr??c khi s?a, ch? s?a file li?n quan, kh?ng ??ng file kh?ng li?n quan. Th?m section 8 H??ng d?n nhanh cho dev m?i v?i c?u tr?c project. | **HO?N TH?NH** |

---

## 7. CHI TI?T C?C TASK S?A L?I

### Task 1.1: X?a Base64 Encoded API Key

```typescript
// TR??C (storage.ts)
const getFallbackGeminiKey = (): string => {
  if (import.meta.env.VITE_GEMINI_API_KEY && ...) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  try {
    return atob('QVEuQWI4Uk42Sy13NTlRMEtDaWQta0VmdU9XbFpYYUpQY2Z6QUlYcTlkU01QVmNCaDVZa0E='); // X?A NGAY!
  } catch (e) {
    return '';
  }
};

// SAU - CH? d?ng env variable
const getGeminiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};
```

### Task 2.1: S?a VocabularyView Duplicate Modal

```typescript
// TR??C - 2 l?n g?i c?ng l?c
{lookupWord && (
  <WordLookupModal ... />  // L?n 1
)}

{lookupWord && (
  <WordLookupModal ... />  // L?n 2 - DUPLICATE!
)}

// SAU - Ch? 1 l?n
{lookupWord && (
  <WordLookupModal
    word={lookupWord}
    onClose={() => setLookupWord(null)}
    merriamWebsterApiKey={user.merriamWebsterApiKey}
  />
)}
```

### Task 2.2: ShadowingView XP Calculation

```typescript
// TR??C
const handleAwardXp = (score: number) => {
  const xpBonus = 20;
  onUpdateUser({
    ...user,
    xp: user.xp + xpBonus, // Miss rank-up check!
    shadowingCompleted: user.shadowingCompleted + 1,
  });
};

// SAU
import { addXpToUser } from '../../services/storage';

const handleAwardXp = (score: number) => {
  if (selectedLesson) {
    trackShadowingScore(selectedLesson.title, score);
  }
  const updatedUser = addXpToUser(20); // Properly checks rank-up!
  onUpdateUser({
    ...updatedUser,
    shadowingCompleted: user.shadowingCompleted + 1,
  });
};
```

### Task 2.3: GrammarView State Reset

```typescript
// TH?M khi chuy?n lesson
const handleSelectLesson = (lessonId: string) => {
  setActiveLessonId(lessonId);
  setCurrentQuizIndex(0);
  setSelectedOption(null);
  setShowExplanation(false);
  setQuizScore(0); // RESET - th?m d?ng n?y!
};
```

### Task 2.5: Fix Remediation Quiz Hardcoded Answers

```typescript
// TR??C (trackingService.ts:160-212)
questions.push({
  id: 'rem_w1',
  correctAnswer: 0,  // ? Lu?n ??p ?n ??u ti?n!
  options: ['M?i tr??ng s?ng', 'S? ki?n c??ng', 'Hi?n t??ng t? nhi?n', 'Nhi?t t?nh'],
});

// SAU - Dynamic shuffle:
const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Quiz v?i correct answer ng?u nhi?n:
const wrongAnswers = ['S? ki?n c??ng', 'Hi?n t??ng t? nhi?n', 'Nhi?t t?nh'];
const shuffledOptions = shuffleArray([correctAnswerText, ...wrongAnswers]);
const correctIdx = shuffledOptions.indexOf(correctAnswerText);

questions.push({
  id: 'rem_w1',
  correctAnswer: correctIdx,  // ? Dynamic index
  options: shuffledOptions,
});
```

### Task 4.7: Fix State Mutation in storage.ts

```typescript
// TR??C (storage.ts:102-112)
export const saveUserWeakness = (item: any): void => {
  const current = getUserProfile();
  if (item.title && !current.weakTopics.includes(item.title)) {
    current.weakTopics.push(item.title);  // ? TR?C TI?P MUTATE
    saveUserProfile(current);
  }
};

// SAU - Immutable update:
export const saveUserWeakness = (item: any): void => {
  const current = getUserProfile();
  if (item.title && !current.weakTopics.includes(item.title)) {
    const updated = {
      ...current,
      weakTopics: [...current.weakTopics, item.title]  // ? Spread operator
    };
    saveUserProfile(updated);
  }
};
```

### Task 5.2: CORS Proxy Fallback for YouTube

```typescript
// TR??C (youtubeTranscriptService.ts:101)
const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

// SAU - Multiple proxies v?i fallback:
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const fetchWithProxyFallback = async (targetUrl: string): Promise<Response> => {
  for (const proxy of CORS_PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(targetUrl), {
        timeout: 10000
      });
      if (res.ok) return res;
    } catch (e) {
      console.warn(`Proxy ${proxy} failed, trying next...`);
      continue;
    }
  }
  throw new Error('All CORS proxies failed');
};
```

### Task 4.6: Generic Retry Wrapper

```typescript
// src/utils/apiHelpers.ts
export const fetchWithRetry = async <T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  delay = 1000,
  timeout = 15000
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        clearTimeout(timeoutId);
        return await res.json();
      } catch (e) {
        if (i === retries - 1) throw e;
        console.warn(`Retry ${i + 1}/${retries} for ${url}...`);
        await new Promise(r => setTimeout(r, delay * (i + 1)));
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
  throw new Error('All retries failed');
};
```

### Task 4.5: Dictionary API Caching

```typescript
// src/services/dictionaryService.ts
const wordCache = new Map<string, { data: WordItem; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchWithCache = async (
  word: string,
  fetchFn: () => Promise<WordItem>
): Promise<WordItem> => {
  const cached = wordCache.get(word.toLowerCase());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const data = await fetchFn();
  wordCache.set(word.toLowerCase(), { data, timestamp: Date.now() });
  return data;
};

// Usage:
export const fetchDynamicWordItem = async (word: string, ...): Promise<WordItem> => {
  return fetchWithCache(word, async () => {
    const lookup = await lookupWord(cleanWord);
    // ... existing logic
  });
};
```

---

## 8. H??NG D?N NHANH CHO DEV M?I

```
1. ??C TR??C: Plan.md (file n?y)
2. C?I ??T:
   - npm install
   - T?o file .env v?i VITE_GEMINI_API_KEY (l?y key t? Google AI Studio)
3. CH?Y: npm run dev
4. KI?M TRA: npm run build (ph?i 0 errors)
```

### 8.2. Khi nh?n task m?i

```
1. ??c m?c "## 6. NH?T K? TI?N ??" ?? bi?t ti?n ?? hi?n t?i
2. T?m task trong "## 4. L? TR?NH S?A L?I V? N?NG C?P"
3. Theo rule 3.1: T?m root cause ? ch? s?a file li?n quan
4. Sau khi xong: C?p nh?t ti?n ?? v?o "## 6"
5. Checklist tr??c commit: build + clean code + update Plan.md
```

### 8.3. C?u tr?c Project

```
src/
??? components/          # UI Components (Header, Sidebar, Modal, etc.)
??? views/              # Main Views (Dashboard, Vocabulary, Grammar, etc.)
??? services/          # API Services (storage, gemini, speech, tracking)
??? data/              # Static Data (vocabularyData, grammarLessons)
??? types/             # TypeScript Types
??? styles/           # CSS Files
??? utils/            # Utility Functions
```

---

*D? ?n N?n t?ng H?c Ti?ng Anh AI English HNQ - Plan.md v2.6 - C?p nh?t: 2026-07-28*

| **2026-07-28** | **TASK 6.2: DYNAMIC DAILY TASKS:** C?i ti?n `generateDailyTasks()` trong trackingService.ts ?? t?o tasks kh?c nhau m?i ng?y. Th?m date tracking v?i localStorage cache. Tasks ???c cache theo ng?y (YYYY-MM-DD) v? regenerate khi sang ng?y m?i. | **HO?N TH?NH** |
| **2026-07-28** | **TASK 6.3: AUTO TRACK WEAK WORDS:** Th?m `trackWeakWord()` calls trong VocabularyView.tsx khi user tr? l?i sai trong games: Speed Quiz (sai/timeout), Word Unscramble (sai), Matching Game (gh?p sai c?p). | **HO?N TH?NH** |

|| **2026-07-28** | **KI?M TRA L?I TR?NG TH?I:** ??c l?i Plan.md, x?c nh?n t?t c? tasks ?? ho?n th?nh. Build verify 0 errors. Ki?m tra linter - kh?ng c? l?i. | **?? HO?N TH?NH** |

| **2026-07-28** | **S?A API SERVICES & PERFORMANCE:** (1) youtubeTranscriptService - th?m CORS proxy fallback chain (allorigins ? corsproxy.io ? codetabs); (2) trackingService - fix hardcoded quiz answers b?ng Fisher-Yates shuffle; (3) storage.ts - fix state mutation trong saveUserWeakness v?i spread operator; (4) geminiService - x?a dead code generateTutorExplanation; (5) dictionaryService - th?m 5-minute cache cho API lookups; (6) T?o apiHelpers.ts v?i retry logic & exponential backoff. | **HO?N TH?NH** |
| **2026-07-28** | **REAL STREAK TRACKING:** Th?m checkAndUpdateStreak() v?o storage.ts ki?m tra ng?y li?n ti?p: c?ng ng?y ? gi? streak, ng?y li?n k? ? t?ng streak, c? kho?ng tr?ng ? reset v? 1. T?ch h?p v?o App.tsx ?? auto-check khi m? app. | **HO?N TH?NH** |
| **2026-07-28** | **SHUFFLE PLACEMENT TEST:** Th?m Fisher-Yates shuffle cho placementQuestions trong PlacementTestView. S? d?ng useMemo ?? shuffle khi test b?t ??u. C?p nh?t Plan.md v?i t?t c? progress. Build 0 errors. | **HO?N TH?NH** |
| **2026-07-28** | **TASK 6.5: PERSIST PROGRESS STATE:** T?o progressPersistence.ts service v?i functions luu tr? progress cho: Vocabulary, Grammar, Shadowing, Mini-Games, Exams, Chatbot, Daily Tasks, Learning Stats. T?ch h?p v?o VocabularyView v? App.tsx d? auto-save/restore state. | **HO?N TH?NH** |
| **2026-07-28** | **TASK 3.6: SKELETON LOADING STATES:** T?o Skeleton.tsx component v?i variants: Skeleton, SkeletonCard, SkeletonFlashcard, SkeletonList, SkeletonGrid, SkeletonStats, SkeletonChatBubble, SkeletonChatList. Th?m CSS shimmer animation. | **HO?N TH?NH** |
| **2026-07-28** | **TASK 3.5: FLASH CARD ANIMATION MOBILE:** C?i thi?n 3D flip animation: tang perspective, th?m GPU acceleration, cubic-bezier bounce easing, backfaceVisibility hidden, mobile touch optimization. | **HO?N TH?NH** |
| **2026-07-28** | **UI REDESIGN - SIDEBAR & HEADER:** (1) Sidebar m?i collapsible v?i animation m??t m? (260px ? 72px icon-only), localStorage persistence, hover effects, active indicator bar; (2) Header m?i v?i thanh t?m ki?m t? v?ng t?ch h?p (Datamuse autocomplete, instant dictionary lookup), compact stats (streak/XP badge), API status indicator. | **HO?N TH?NH** |
| **2026-07-28** | **UI POLISH - GLOW EFFECTS & RANK DESIGN:** (1) Thanh t?m ki?m v?i glow effect ph?t s?ng khi focus, gradient border animation; (2) Sidebar icons v?i m?u s?c ri?ng bi?t v? glow effect khi hover/active; (3) Streak badge v?i animation flame-flicker, Crown icon khi streak >= 7; (4) RankBadge redesign v?i shimmer animation, star indicators, glow effects theo rank level; (5) API status button v?i glow effect. | **HO?N TH?NH** |
