import type { DataSource } from '../types';

interface SourceTagProps {
  source: DataSource;
}

export function SourceTag({ source }: SourceTagProps) {
  return (
    <span className={`source-tag source-tag--${source}`}>
      <span className="source-tag__dot" />
      {source === 'actual' ? 'Historical data' : 'Demo data'}
    </span>
  );
}
