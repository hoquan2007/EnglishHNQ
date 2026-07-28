import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '2rem',
            textAlign: 'center',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '50%',
              background: 'rgba(255, 77, 77, 0.15)',
              border: '1px solid rgba(255, 77, 77, 0.3)',
            }}
          >
            <AlertTriangle size={48} color="#ff4d4d" />
          </div>

          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                color: '#ff4d4d',
                marginBottom: '0.5rem',
              }}
            >
              Đã xảy ra lỗi không mong muốn
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '500px',
                marginBottom: '1rem',
              }}
            >
              {this.state.error?.message ||
                'Một lỗi không xác định đã xảy ra. Vui lòng thử tải lại trang.'}
            </p>
          </div>

          <Button
            variant="gradient"
            onClick={this.handleReset}
            icon={<RefreshCw size={16} />}
          >
            Thử Lại
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
