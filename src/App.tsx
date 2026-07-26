import React, { useState, useEffect } from 'react';
import { UserProfile, ActiveTab } from './types';
import { getUserProfile, saveUserProfile } from './services/storage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/modals/SettingsModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Award, BookOpen, Bot, Youtube, GraduationCap, Settings as SettingsIcon } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleSaveApiKey = (key: string) => {
    const updated = { ...user, geminiApiKey: key };
    setUser(updated);
    saveUserProfile(updated);
  };

  const renderModuleContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView user={user} onNavigate={setActiveTab} />;

      case 'placement':
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Award size={50} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
            <h2>Phân Hệ: Bài Test Phân Trình Độ (Placement Test)</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Kiểm tra toàn diện A1-C2 (Trắc nghiệm, Điền từ, Nghe) để xếp hạng Rank khởi đầu (Phase 2).
            </p>
            <Button variant="gradient" onClick={() => setActiveTab('dashboard')}>
              Quay lại Trang Chủ
            </Button>
          </div>
        );

      case 'vocabulary':
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <BookOpen size={50} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
            <h2>Phân Hệ: Từ Vựng CEFR & Flashcards 3D</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Kho 3000+ từ vựng Oxford phân cấp A1-C2, audio IPA chuẩn, thẻ lật 3D (Phase 2).
            </p>
            <Button variant="secondary" onClick={() => setActiveTab('dashboard')}>
              Quay lại Trang Chủ
            </Button>
          </div>
        );

      case 'grammar':
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <BookOpen size={50} color="var(--accent-pink)" style={{ marginBottom: '1rem' }} />
            <h2>Phân Hệ: Ngữ Pháp Tương Tác AI</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Hệ thống bài giảng ngữ pháp sinh động & bài tập AI điền từ (Phase 2).
            </p>
            <Button variant="secondary" onClick={() => setActiveTab('dashboard')}>
              Quay lại Trang Chủ
            </Button>
          </div>
        );

      case 'chatbot':
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Bot size={50} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
            <h2>Phân Hệ: Chatbot AI 1:1 (Adam & Eva)</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Luyện giao tiếp tiếng Anh bằng Giọng nói (Web Speech STT/TTS) với Gemini 1.5 (Phase 3).
            </p>
            <Button variant="primary" onClick={() => setIsSettingsOpen(true)}>
              Cấu hình Gemini API Key trước
            </Button>
          </div>
        );

      case 'shadowing':
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Youtube size={50} color="var(--accent-orange)" style={{ marginBottom: '1rem' }} />
            <h2>Phân Hệ: YouTube Shadowing English</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Dán URL YouTube &rarr; Tách phụ đề &rarr; Thu âm nhại giọng &amp; Chấm điểm phát âm % (Phase 4).
            </p>
            <Button variant="secondary" onClick={() => setActiveTab('dashboard')}>
              Quay lại Trang Chủ
            </Button>
          </div>
        );

      case 'tutor':
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <GraduationCap size={50} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
            <h2>Phân Hệ: AI Gia Sư Tổng Quan (Learning Analytics)</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Gia sư AI theo dõi điểm yếu, phân tích lỗi sai & gợi ý lộ trình cá nhân hóa (Phase 5).
            </p>
            <Button variant="secondary" onClick={() => setActiveTab('dashboard')}>
              Quay lại Trang Chủ
            </Button>
          </div>
        );

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <SettingsIcon size={28} color="var(--accent-cyan)" />
              <h2 style={{ margin: 0 }}>Cấu Hình Hệ Thống</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Quản lý Gemini API Key của bạn để kết nối với các trợ lý AI Adam, Eva và AI Gia Sư.
            </p>
            <Card hoverable={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Gemini API Key</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {user.geminiApiKey ? 'Đã lưu API Key' : 'Chưa cấu hình API Key'}
                  </span>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsSettingsOpen(true)}>
                  Thay đổi API Key
                </Button>
              </div>
            </Card>
          </div>
        );

      default:
        return <DashboardView user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Container */}
      <div className="main-content">
        <Header user={user} onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="page-container">
          {renderModuleContent()}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        user={user}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
};

export default App;
