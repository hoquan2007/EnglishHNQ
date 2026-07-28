import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
  style
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        ...style
      }}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
  avatar?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  avatar = true
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      {avatar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Skeleton width={40} height={40} borderRadius="50%" />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={14} />
            <div style={{ marginTop: '4px' }}>
              <Skeleton width="40%" height={10} />
            </div>
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height={14}
        />
      ))}
    </div>
  );
};

interface SkeletonFlashcardProps {}

export const SkeletonFlashcard: React.FC<SkeletonFlashcardProps> = () => {
  return (
    <div
      style={{
        perspective: '1200px',
        maxWidth: '650px',
        margin: '0 auto 2rem auto',
        height: '380px',
      }}
    >
      <div
        className="glass-panel flashcard-skeleton"
        style={{
          width: '100%',
          height: '100%',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width={80} height={24} borderRadius="20px" />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Skeleton width={100} height={28} borderRadius="20px" />
              <Skeleton width={120} height={28} borderRadius="20px" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Skeleton width={200} height={48} borderRadius="12px" />
          <Skeleton width={150} height={24} borderRadius="8px" />
        </div>

        <Skeleton width={200} height={16} borderRadius="8px" />
      </div>
    </div>
  );
};

interface SkeletonListProps {
  items?: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ items = 5 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} lines={2} avatar={false} />
      ))}
    </div>
  );
};

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 2,
  rows = 3
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem'
      }}
    >
      {Array.from({ length: columns * rows }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
};

interface SkeletonStatsProps {}

export const SkeletonStats: React.FC<SkeletonStatsProps> = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem'
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="glass-panel"
          style={{ padding: '1.25rem', textAlign: 'center' }}
        >
          <Skeleton width={40} height={40} borderRadius="50%" className="" style={{ margin: '0 auto 0.5rem' }} />
          <Skeleton width="60%" height={28} borderRadius="8px" style={{ margin: '0 auto 0.25rem' }} />
          <Skeleton width="80%" height={12} borderRadius="6px" style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
  );
};

interface SkeletonChatBubbleProps {
  isUser?: boolean;
}

export const SkeletonChatBubble: React.FC<SkeletonChatBubbleProps> = ({ isUser = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.75rem'
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          gap: '0.5rem'
        }}
      >
        {!isUser && <Skeleton width={32} height={32} borderRadius="50%" />}
        <div
          className="glass-panel"
          style={{
            padding: '0.75rem 1rem',
            minWidth: '120px'
          }}
        >
          <Skeleton width={isUser ? 80 : 100} height={14} />
          <div style={{ marginTop: '4px' }}>
            <Skeleton width={isUser ? 60 : 140} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface SkeletonChatListProps {
  messages?: number;
}

export const SkeletonChatList: React.FC<SkeletonChatListProps> = ({ messages = 5 }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <SkeletonChatBubble isUser={false} />
      <SkeletonChatBubble isUser={true} />
      <SkeletonChatBubble isUser={false} />
      <SkeletonChatBubble isUser={true} />
      <SkeletonChatBubble isUser={false} />
    </div>
  );
};
