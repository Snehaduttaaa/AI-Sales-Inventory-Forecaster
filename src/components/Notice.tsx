import type { ReactNode } from 'react';

interface NoticeProps {
  tone?: 'info' | 'warning' | 'success';
  title: string;
  children: ReactNode;
}

export function Notice({
  tone = 'info',
  title,
  children,
}: NoticeProps) {
  return (
    <aside className={`notice notice--${tone}`} role="note">
      <div className="notice__content">
        <strong className="notice__title">{title}</strong>
        <div className="notice__message">{children}</div>
      </div>
    </aside>
  );
}
