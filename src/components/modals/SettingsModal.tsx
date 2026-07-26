import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Key, ExternalLink, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveApiKey
}) => {
  const [apiKey, setApiKey] = useState(user.geminiApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#121824',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--accent-cyan)' }}>
            <Key size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Cấu Hình Gemini API Key</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dành cho Chatbot 1:1 (Adam & Eva) và AI Gia Sư</span>
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            backgroundColor: 'rgba(138, 43, 226, 0.12)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            lineHeight: 1.6
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <ShieldCheck size={18} />
            <span>Cách lấy API Key Miễn Phí (Google AI Studio)</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            1. Đăng nhập bằng chính tài khoản Google của bạn tại <strong>Google AI Studio</strong>.
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            2. Nhấn nút <strong>"Get API key"</strong> và tạo Key miễn phí (Model Gemini 1.5 Flash).
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--accent-cyan)',
              fontWeight: 600,
              marginTop: '0.5rem',
              textDecoration: 'none'
            }}
          >
            Mở Google AI Studio ngay <ExternalLink size={14} />
          </a>
        </div>

        {/* Input Form */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Nhập Gemini API Key của bạn:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {savedSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={16} /> Đã lưu API Key thành công!
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Hủy Bỏ
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!apiKey.trim()}>
            Lưu API Key
          </Button>
        </div>
      </div>
    </div>
  );
};
