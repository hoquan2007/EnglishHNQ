import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Bot,
  Youtube,
  Award,
  GraduationCap,
  Settings,
  Gamepad2,
  Trophy,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Zap,
  PenTool,
  Mic
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  iconColor?: string;
  glowColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Trang Chủ', icon: LayoutDashboard, iconColor: '#00f0ff', glowColor: 'rgba(0, 240, 255, 0.4)' },
    { id: 'vocabulary', label: 'Từ Vựng', icon: BookOpen, iconColor: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.4)' },
    { id: 'grammar', label: 'Ngữ Pháp', icon: FileText, iconColor: '#ffd700', glowColor: 'rgba(255, 215, 0, 0.4)' },
    { id: 'chatbot', label: 'Chatbot AI', icon: Bot, iconColor: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.4)' },
    { id: 'shadowing', label: 'Luyện Phát Âm', icon: Mic, iconColor: '#ff6b6b', glowColor: 'rgba(255, 107, 107, 0.4)' },
    { id: 'minigames', label: 'Mini Games', icon: Gamepad2, iconColor: '#ff9500', glowColor: 'rgba(255, 149, 0, 0.4)' },
    { id: 'exams', label: 'Luyện Đề', icon: Trophy, iconColor: '#ffd700', glowColor: 'rgba(255, 215, 0, 0.4)' },
    { id: 'placement', label: 'Test Rank', icon: Award, iconColor: '#ff5e3a', glowColor: 'rgba(255, 94, 58, 0.4)' },
    { id: 'tutor', label: 'AI Gia Sư', icon: GraduationCap, iconColor: '#00e5ff', glowColor: 'rgba(0, 229, 255, 0.4)' },
    { id: 'settings', label: 'Cấu Hình', icon: Settings, iconColor: '#94a3b8', glowColor: 'rgba(148, 163, 184, 0.3)' }
  ];

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{
        width: isCollapsed ? '76px' : '260px',
        minWidth: isCollapsed ? '76px' : '260px',
        backgroundColor: 'rgba(10, 13, 20, 0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: 40,
      }}
    >
      {/* Header with Logo & Toggle */}
      <div
        style={{
          padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '0.75rem',
          minHeight: '76px',
          transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCollapsed ? 0 : '0.75rem',
            overflow: 'hidden',
            flex: isCollapsed ? 0 : 1,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00f0ff, #8a2be2, #ff007f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(138, 43, 226, 0.3)',
              flexShrink: 0,
              animation: 'logo-glow 3s ease-in-out infinite',
            }}
          >
            <Sparkles size={24} color="#fff" />
          </div>
          {!isCollapsed && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <h2 style={{
                fontSize: '1.2rem',
                margin: 0,
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                ENGLISH <span style={{
                  background: 'linear-gradient(135deg, #00f0ff, #8a2be2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>HNQ</span>
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px'
              }}>
                <Zap size={10} style={{ color: '#ffd700' }} />
                <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}>
                  AI Learning Platform
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button - Only show when expanded */}
        {!isCollapsed && (
          <button
            onClick={handleToggle}
            className="sidebar-toggle-btn"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}
            title="Thu gọn sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        flex: 1,
        padding: isCollapsed ? '1rem 0.5rem' : '1rem 0.75rem',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHovered = hoveredItem === item.id;
          const color = item.iconColor || '#94a3b8';
          const glowColor = item.glowColor || 'rgba(148, 163, 184, 0.3)';

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '0.85rem',
                padding: isCollapsed ? '0.9rem' : '0.85rem 1rem',
                borderRadius: '14px',
                backgroundColor: isActive
                  ? `rgba(${hexToRgb(color)}, 0.15)`
                  : isHovered
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'transparent',
                border: isActive
                  ? `1px solid rgba(${hexToRgb(color)}, 0.35)`
                  : '1px solid transparent',
                color: isActive ? color : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: isActive || isHovered
                  ? `0 0 20px ${glowColor}`
                  : 'none',
              }}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '28px',
                    borderRadius: '0 4px 4px 0',
                    background: `linear-gradient(180deg, ${color}, ${color}aa)`,
                    boxShadow: `0 0 15px ${color}`,
                  }}
                />
              )}

              {/* Icon with Glow */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: '24px',
                height: '24px',
                filter: isActive || isHovered
                  ? `drop-shadow(0 0 8px ${color})`
                  : 'none',
                transform: isHovered && !isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.25s ease',
              }}>
                <Icon
                  size={22}
                  style={{
                    color: isActive || isHovered ? color : 'var(--text-muted)',
                    transition: 'color 0.3s ease',
                  }}
                />
              </div>

              {/* Label - Only show when not collapsed */}
              {!isCollapsed && (
                <span style={{
                  flex: 1,
                  transition: 'all 0.3s ease',
                  transform: isHovered && !isActive ? 'translateX(3px)' : 'translateX(0)',
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expand Button - Only show when collapsed */}
      {isCollapsed && (
        <div style={{
          padding: '1rem 0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={handleToggle}
            className="sidebar-toggle-btn"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              color: 'var(--text-secondary)',
            }}
            title="Mở rộng sidebar"
          >
            <PanelLeft size={20} />
          </button>
        </div>
      )}

      {/* Footer Info */}
      {!isCollapsed && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            English HNQ v1.0
          </p>
          <p style={{
            fontSize: '0.65rem',
            background: 'linear-gradient(135deg, #00f0ff, #8a2be2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0.15rem 0 0 0',
            fontWeight: 600,
          }}>
            Powered by Gemini 1.5
          </p>
        </div>
      )}
    </aside>
  );
};

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}
