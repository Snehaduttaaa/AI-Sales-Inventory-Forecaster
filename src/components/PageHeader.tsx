import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__content">
        <span className="page-header__eyebrow">{eyebrow}</span>
        <h1 className="page-header__title">{title}</h1>
        {description && (
          <p className="page-header__description">{description}</p>
        )}
      </div>
      {action && <div className="page-header__action">{action}</div>}
    </div>
  );
}
