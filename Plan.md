# DỰ ÁN: ENGLISH HNQ - NỀN TẢNG HỌC TIẾNG ANH AI THÔNG MINH

> **Tài liệu Kế hoạch Tổng thể, Quy chuẩn Kỹ thuật, Lộ trình Chi tiết & Nhật ký Tiến độ Project.**
> *Lưu ý cho AI Agent / Developer: Đọc file này ở đầu mỗi phiên chat để hiểu toàn bộ bối cảnh, quy tắc và trạng thái dự án hiện tại.*

---

## 1. TỔNG QUAN DỰ ÁN

**English HNQ** là nền tảng web học tiếng Anh đa tương tác tích hợp Trí tuệ nhân tạo (AI Gemini), mang lại trải nghiệm học tập cá nhân hóa toàn diện gồm các phân hệ:
1. **Từ vựng & Ngữ pháp (Vocabulary & Grammar):** Kho bài học phân cấp theo chuẩn CEFR (A1 -> C2), thẻ ghi nhớ (Flashcards), bài tập tương tác.
2. **Hệ thống Rank & Bài test phân cấp (Placement & Leveling System):** Đánh giá đầu vào, tích điểm XP, tăng hạng rank (Đồng, Bạc, Vàng, Kim Cương, Cao Thủ...), mở khóa bài học theo trình độ.
3. **Chatbot 1:1 Giao tiếp (Adam & Eva):** Gia sư AI với 2 persona độc lập, tích hợp Voice Input (STT) & Voice Output (TTS).
4. **Shadowing English qua YouTube Video:** Nhập URL YouTube -> AI/App tách Transcript -> Đồng bộ phụ đề -> Luyện nghe, nhại giọng (Shadowing).
5. **AI Tutor Gia sư Tổng quản (Smart Central AI Tutor):** AI nắm toàn bộ dữ liệu học tập, đưa ra lời khuyên & bài tập gợi ý.

---

## 2. BÁO CÁO ĐÁNH GIÁ CODE - ISSUES FOUND (2026-07-28)

### 2.1. VẤN ĐỀ BẢO MẬT NGHIÊM TRỌNG 🔴

| # | Vấn đề | File | Mức độ |
|---|---------|------|---------|
| 1 | **API Key bị hardcode dạng base64** trong code | `storage.ts:11` | CRITICAL |
| 2 | **Giải mã API key** client-side = ai cũng đọc được qua DevTools | `storage.ts:11` | CRITICAL |
| 3 | **API key lưu localStorage** = XSS có thể đánh cắp | `storage.ts` | HIGH |
| 4 | **Fallback API key** tự động ghi đè localStorage mỗi lần load | `storage.ts:40-43` | HIGH |

**HÀNH ĐỘNG KHẮC PHỤC:**
- [ ] XÓA ngay base64 encoded key từ storage.ts
- [ ] Chỉ dùng `import.meta.env.VITE_GEMINI_API_KEY` (env variable)
- [ ] KHÔNG lưu API key vào localStorage - chỉ dùng session
- [ ] Thêm cảnh báo bảo mật nếu user nhập key thủ công

### 2.2. LOGIC BUGS CẦN SỬA 🟡

| # | Vấn đề | File | Ảnh hưởng |
|---|---------|------|-----------|
| 1 | **VocabularyView**: Gọi `lookupWord` 2 lần (modal + function) | `VocabularyView:1001-1006` | Duplicate modal |
| 2 | **ShadowingView**: Tự cộng XP thủ công thay vì gọi `addXpToUser` | `ShadowingView:93-104` | Miss rank-up |
| 3 | **GrammarView**: `quizScore` không reset khi chuyển bài | `GrammarView` | State leak |
| 4 | **MiniGamesHub**: XP update không qua `addXpToUser` → miss rank-up | `MiniGamesHub:56-63` | Miss rank-up |
| 5 | **TrackingService**: Remediation quiz hardcoded answers cố định | `trackingService.ts:160-212` | Chỉ 1 đáp án đúng |
| 6 | **ChatbotView**: `chatHistory[persona]` bị mutate trực tiếp | `ChatbotView:89-93` | React state mutation |

**HÀNH ĐỘNG KHẮC PHỤC:**
- [ ] Sửa VocabularyView - chỉ gọi 1 trong 2 (modal HOẶC function)
- [ ] ShadowingView/MiniGamesHub - dùng `addXpToUser` thay vì tự tính
- [ ] GrammarView - reset quizScore khi chuyển lesson
- [ ] TrackingService - tạo quiz động từ weak data thực
- [ ] ChatbotView - dùng Immer hoặc spread operator đúng cách

### 2.3. UI/UX ISSUES 🟠

| # | Vấn đề | File | Mô tả |
|---|---------|------|--------|
| 1 | **YouTube Transcript**: CORS proxy allorigins.win không reliable | `youtubeTranscriptService.ts` | Có thể fail |
| 2 | **Shadowing**: Chỉ lấy 10 dòng transcript đầu tiên | `youtubeTranscriptService.ts:144` | Giới hạn không cần |
| 3 | **Flashcard**: Flip animation không smooth trên mobile | CSS | UX kém |
| 4 | **Settings Modal**: Body scroll vẫn hoạt động khi modal mở | Toàn app | Scroll conflict |
| 5 | **Typing Indicator**: Không hiển thị khi AI đang xử lý | `ChatbotView` | UX unclear |
| 6 | **Error States**: Không có error boundary toàn cục | Toàn app | Crash toàn trang |

### 2.4. PERFORMANCE ISSUES 🟡

| # | Vấn đề | File | Ảnh hưởng |
|---|---------|------|-----------|
| 1 | **VocabularyData**: 5200+ words import 1 lần | `vocabularyData.ts` | Bundle ~500KB |
| 2 | **Chat History**: Không có pagination/culling | `ChatbotView` | localStorage满了 |
| 3 | **Speech Recognition**: Cleanup không triệt để | `speechService.ts` | Memory leak |
| 4 | **Re-renders**: State management có thể gây unnecessary renders | Nhiều component | Chậm |

### 2.5. MISSING FEATURES CẦN IMPLEMENT 🌟

| # | Tính năng | Trạng thái hiện tại |
|---|-----------|---------------------|
| 1 | **Streak system** | Chỉ hiển thị, không update theo ngày |
| 2 | **Daily tasks** | Hardcoded, không tạo task mới theo ngày |
| 3 | **Weak word tracking** | Mock data, chưa auto track thật |
| 4 | **Placement test** | 20 câu fixed, cần shuffle |
| 5 | **Speaking practice** | STT hoạt động nhưng chưa chấm điểm chi tiết |
| 6 | **Progress persistence** | Một số state không được persist |

---

## 3. QUY TẮC PHÁT TRIỂN MỚI

### 3.1. Nguyên tắc Bảo Mật (BẮT BUỘC)

```
1. KHÔNG BAO GIỜ hardcode API keys trong code
2. KHÔNG BAO GIỜ lưu sensitive keys vào localStorage
3. Chỉ dùng environment variables (VITE_*)
4. Nếu cần lưu user API key → encrypt trước khi lưu
```

### 3.2. Nguyên tắc State Management

```
1. KHÔNG bao giờ mutate state trực tiếp (use immer hoặc spread)
2. LUÔN dùng addXpToUser() cho XP updates (để check rank-up)
3. Reset local state khi unmount hoặc chuyển view
4. Cleanup effects và subscriptions trong useEffect return
```

### 3.3. Nguyên tắc Error Handling

```
1. Tất cả async calls phải có try-catch
2. Luôn có fallback khi API fail
3. Hiển thị user-friendly error messages
4. Log errors ra console cho debugging
```

---

## 4. LỘ TRÌNH SỬA LỖI VÀ NÂNG CẤP

### PHASE 1: SỬA BẢO MẬT KHẨN CẤP (Ngay lập tức)

- [ ] **Task 1.1**: Xóa base64 encoded API key từ `storage.ts`
- [ ] **Task 1.2**: Chuyển sang environment variable `VITE_GEMINI_API_KEY`
- [ ] **Task 1.3**: Không auto-fill API key vào localStorage
- [ ] **Task 1.4**: Thêm warning khi user lưu API key vào localStorage

### PHASE 2: SỬA LOGIC BUGS

- [ ] **Task 2.1**: Sửa VocabularyView - loại bỏ duplicate modal call
- [ ] **Task 2.2**: ShadowingView - dùng `addXpToUser()` đúng cách
- [ ] **Task 2.3**: MiniGamesHub - dùng `addXpToUser()` đúng cách
- [ ] **Task 2.4**: GrammarView - reset quizScore khi chuyển lesson
- [ ] **Task 2.5**: TrackingService - generate quiz động từ weak data
- [ ] **Task 2.6**: ChatbotView - fix state mutation

### PHASE 3: CẢI THIỆN UI/UX

- [ ] **Task 3.1**: Thêm body scroll lock khi mở modal
- [ ] **Task 3.2**: Cải thiện YouTube transcript fetching (fallback reliable hơn)
- [ ] **Task 3.3**: Tăng số lượng transcript lines (hoặc infinite scroll)
- [ ] **Task 3.4**: Thêm Error Boundary toàn cục
- [ ] **Task 3.5**: Cải thiện Flashcard animation cho mobile
- [ ] **Task 3.6**: Thêm skeleton loading states

### PHASE 4: NÂNG CẤP PERFORMANCE

- [ ] **Task 4.1**: Lazy load vocabularyData (chỉ load khi cần)
- [ ] **Task 4.2**: Implement chat history pagination (max 50 messages)
- [ ] **Task 4.3**: Cleanup speech recognition properly
- [ ] **Task 4.4**: Add React.memo cho các component nặng

### PHASE 5: HOÀN THIỆN TÍNH NĂNG

- [ ] **Task 5.1**: Implement real streak tracking (check ngày liên tiếp)
- [ ] **Task 5.2**: Generate daily tasks động mỗi ngày
- [ ] **Task 5.3**: Auto track weak words từ quiz wrong answers
- [ ] **Task 5.4**: Shuffle/randomize placement test questions
- [ ] **Task 5.5**: Persist tất cả progress state vào localStorage

### PHASE 6: TESTING VÀ DEPLOY

- [ ] **Task 6.1**: Chạy `npm run build` verify 0 errors
- [ ] **Task 6.2**: Manual test tất cả user flows
- [ ] **Task 6.3**: Git commit và push lên GitHub
- [ ] **Task 6.4**: Verify Vercel deployment

---

## 5. CÔNG NGHỆ BỘ KHUNG (TECH STACK)

- **Frontend Framework:** React 18 + Vite 6 + TypeScript
- **Styling:** Vanilla CSS Custom Properties + Glassmorphism
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash)
- **Media & Speech:** Web Speech API, YouTube IFrame Player API
- **State Management:** React hooks + localStorage (nâng cấp: Zustand)
- **Optional State:** Immer cho immutable updates

---

## 6. NHẬT KÝ TIẾN ĐỘ VÀ THAY ĐỔI

| Ngày | Nội dung hoạt động / Cập nhật | Trạng thái |
|------|-------------------------------|------------|
| **2026-07-27** | Khởi tạo file `Plan.md` v1. Hoàn thành phân tích kiến trúc, tài nguyên, giải đáp thắc mắc Gemini API và lập lộ trình chi tiết. | **ĐÃ HOÀN THÀNH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 1:** Khởi tạo project React + TypeScript + Vite, xây dựng Design System (Dark Glassmorphism, Ranks: Đồng -> Cao Thủ), Data Models (User, Word, Grammar, Chat, Shadowing), Header, Sidebar Navigation, Dashboard & Settings Modal với Gemini API Config. | **HOÀN THÀNH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 2:** Xây dựng Phân hệ Placement Test (A1-C2), Phân hệ Từ Vựng (Flashcards lật 3D, Web Speech Audio, Bộ lọc CEFR/Topic, Mini-Game Nối từ), Phân hệ Ngữ Pháp (Lý thuyết minh họa, ví dụ song ngữ audio, bài tập trắc nghiệm giải thích chi tiết), Hệ thống Toast thông báo thăng Rank & cộng XP. | **HOÀN THÀNH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 3:** Xây dựng Phân hệ Chatbot AI Giao tiếp 1:1 với 2 Persona (Adam & Eva), tích hợp Gemini 1.5 Flash SDK, Web Speech STT/TTS, tính năng Instant Grammar Correction, Topic Starter Pills gợi ý hội thoại & thưởng +15 XP sau mỗi 3 lượt trò chuyện. | **HOÀN THÀNH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 4:** Xây dựng Phân hệ YouTube Shadowing English: Tích hợp YouTube Iframe Player API, Interactive Transcript đồng bộ mốc thời gian, Thu âm giọng nói nhại giọng (Web Speech STT), Thuật toán chấm điểm độ chính xác % phát âm (Levenshtein Distance), Khả năng nhập URL YouTube tùy chỉnh & Gemini AI transcript generator. | **HOÀN THÀNH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 5:** Xây dựng Phân hệ Smart Central AI Tutor (Dr. HNQ): Tracking Engine tự động theo dõi từ vựng yếu, bài tập ngữ pháp sai, Báo cáo phân tích học tập cá nhân hóa, Đề xuất lộ trình hàng ngày (Daily Recommended Tasks), Phòng Sửa Điểm Yếu (Remediation Lab), Chat 1:1 với Dr. HNQ có Voice STT/TTS, Floating AI Tutor Widget. | **HOÀN THÀNH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 6:** Kiểm thử toàn bộ User Flow, Tối ưu Responsive CSS cho Mobile/Tablet, hoàn thiện xử lý ngoại lệ & Smart Offline Fallback khi không có API Key, chạy `npm run build` đạt 100% clean build. | **HOÀN THÀNH** |
| **2026-07-28** | **ĐÁNH GIÁ CODE TOÀN DIỆN:** Phát hiện 5 vấn đề bảo mật nghiêm trọng (API key hardcode base64), 6 logic bugs (XP calculation, state mutation), 6 UI/UX issues, 4 performance issues, 6 missing features. Lập kế hoạch sửa lỗi toàn diện Phase 1-6. | **ĐÃ HOÀN THÀNH ĐÁNH GIÁ** |
| **2026-07-28** | **TẠO PLAN.MD V2:** Cập nhật Plan.md với báo cáo đánh giá chi tiết, quy tắc phát triển mới (bảo mật, state management, error handling), lộ trình sửa lỗi 6 phases từ bảo mật khẩn cấp đến testing và deploy. | **ĐANG THỰC HIỆN** |

---

## 7. CHI TIẾT CÁC TASK SỬA LỖI

### Task 1.1: Xóa Base64 Encoded API Key

```typescript
// TRƯỚC (storage.ts)
const getFallbackGeminiKey = (): string => {
  if (import.meta.env.VITE_GEMINI_API_KEY && ...) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  try {
    return atob('QVEuQWI4Uk42Sy13NTlRMEtDaWQta0VmdU9XbFpYYUpQY2Z6QUlYcTlkU01QVmNCaDVZa0E='); // XÓA NGAY!
  } catch (e) {
    return '';
  }
};

// SAU - CHỈ dùng env variable
const getGeminiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};
```

### Task 2.1: Sửa VocabularyView Duplicate Modal

```typescript
// TRƯỚC - 2 lần gọi cùng lúc
{lookupWord && (
  <WordLookupModal ... />  // Lần 1
)}

{lookupWord && (
  <WordLookupModal ... />  // Lần 2 - DUPLICATE!
)}

// SAU - Chỉ 1 lần
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
// TRƯỚC
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
// THÊM khi chuyển lesson
const handleSelectLesson = (lessonId: string) => {
  setActiveLessonId(lessonId);
  setCurrentQuizIndex(0);
  setSelectedOption(null);
  setShowExplanation(false);
  setQuizScore(0); // RESET - thêm dòng này!
};
```

---

*Dự án Nền tảng Học Tiếng Anh AI English HNQ - Plan.md v2.0 - Cập nhật: 2026-07-28*
