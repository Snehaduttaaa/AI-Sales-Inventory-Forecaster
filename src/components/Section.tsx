import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function Section({
  title,
  description,
  children,
  action,
}: SectionProps) {
  return (
    <section className="section">
      <div className="section__header">
        <div>
          <h2 className="section__title">{title}</h2>
          {description && (
            <p className="section__description">{description}</p>
          )}
        </div>
        {action && <div className="section__action">{action}</div>}
      </div>
      <div className="section__body">{children}</div>
    </section>
  );
}
