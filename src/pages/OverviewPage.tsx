import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/api';
import type { DashboardSummary } from '../types';
import { PageHeader } from '../components/PageHeader';
import { KpiStrip } from '../components/KpiStrip';
import { Section } from '../components/Section';
import { InsightList } from '../components/InsightList';
import { DataState } from '../components/DataState';
import { SourceTag } from '../components/SourceTag';

export default function OverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const result = await getDashboardSummary();
        if (active) setSummary(result);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <DataState title="Loading your overview" message="Preparing dashboard data..." />;
  }

  if (error || !summary) {
    return <DataState title="Dashboard unavailable" message={error ?? 'No dashboard data available.'} />;
  }

  return (
    <div className="page page--overview">
      <PageHeader
        eyebrow="RETAIL INTELLIGENCE"
        title="Good decisions start with a clearer picture."
        description="An overview of sales patterns, demand signals, and inventory planning across your retail network."
        action={<SourceTag source="demo" />}
      />

      <KpiStrip summary={summary} />

      <div className="overview-grid">
        <Section title="Network overview" description="A snapshot of the retail data used by Stockwise.">
          <div className="overview-stat-grid">
            <div className="overview-stat">
              <span className="overview-stat__label">Products:</span>
              <strong>{summary.totalProducts.toLocaleString()}</strong>
            </div>
            <div className="overview-stat">
              <span className="overview-stat__label">Stores:</span>
              <strong>{summary.totalStores.toLocaleString()}</strong>
            </div>
            <div className="overview-stat">
              <span className="overview-stat__label">Product-store series:</span>
              <strong>{summary.totalSeries.toLocaleString()}</strong>
            </div>
          </div>
        </Section>

        <Section title="What needs attention" description="Signals that may deserve a closer look.">
          <InsightList insights={[...summary.trends, ...summary.risks]} />
        </Section>
      </div>

      <p className="page-footnote">
        Dashboard figures and demonstration forecasts are not live retail data.
      </p>
    </div>
  );
}
