import React from 'react';
import { ActiveTab } from '../../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Bot, 
  Youtube, 
  Award, 
  GraduationCap, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Trang Chủ', icon: LayoutDashboard },
    { id: 'placement', label: 'Test Phân Rank', icon: Award, badge: 'Hot' },
    { id: 'vocabulary', label: 'Từ Vựng CEFR', icon: BookOpen },
    { id: 'grammar', label: 'Ngữ Pháp AI', icon: FileText },
    { id: 'chatbot', label: 'Chatbot 1:1 (Adam/Eva)', icon: Bot, badge: 'AI Voice' },
    { id: 'shadowing', label: 'YouTube Shadowing', icon: Youtube },
    { id: 'tutor', label: 'AI Gia Sư Tổng Quan', icon: GraduationCap },
    { id: 'settings', label: 'Cấu Hình System', icon: Settings }
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'rgba(18, 24, 36, 0.6)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}
    >
      <div style={{ padding: '0 0.5rem 1.25rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 700 }}>
          MENU DÂN HỌC
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              className={isActive ? 'pulse-glow' : ''}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: item.badge === 'AI Voice' ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' : 'var(--accent-cyan)',
                    color: item.badge === 'AI Voice' ? '#fff' : '#000',
                    fontWeight: 700
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        <p>English HNQ v1.0</p>
        <p style={{ marginTop: '0.2rem', color: 'var(--accent-cyan)' }}>Powered by Gemini 1.5</p>
      </div>
    </aside>
  );
};
