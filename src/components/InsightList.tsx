import type { Insight } from '../types';

interface InsightListProps {
  insights: Insight[];
}

export function InsightList({ insights }: InsightListProps) {
  if (insights.length === 0) {
    return (
      <p className="empty-state">
        No additional insights are available.
      </p>
    );
  }

  return (
    <div className="insight-list">
      {insights.map((insight) => (
        <article className="insight-item" key={insight.id}>
          <div className="insight-item__top">
            <strong className="insight-item__figure">
              {insight.figure}
            </strong>
            <span className="insight-item__source">
              {insight.source === 'actual' ? 'Historical' : 'Demo'}
            </span>
          </div>
          <h3 className="insight-item__title">{insight.title}</h3>
          <p className="insight-item__detail">{insight.detail}</p>
        </article>
      ))}
    </div>
  );
}
