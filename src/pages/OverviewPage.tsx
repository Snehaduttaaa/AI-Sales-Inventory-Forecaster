import { useEffect, useState } from 'react';
import { getDashboardSummary, getDatasetInfo } from '../services/api';
import type { DashboardSummary, DatasetInfo } from '../types';
import { PageHeader } from '../components/PageHeader';
import { KpiStrip } from '../components/KpiStrip';
import { Section } from '../components/Section';
import { InsightList } from '../components/InsightList';
import { DataState } from '../components/DataState';
import { SourceTag } from '../components/SourceTag';
import { formatLongDate } from '../utils/date';

export default function OverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const [result, info] = await Promise.all([getDashboardSummary(), getDatasetInfo()]);
        if (active) {
          setSummary(result);
          setDatasetInfo(info);
        }
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

  if (error || !summary || !datasetInfo) {
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
        <Section title="Dataset at a glance">
          <div className="dataset-info-grid">
            <div className="overview-stat dataset-info-card">
              <span className="dataset-info-card__label">Retail Location</span>
              <strong>{datasetInfo.counts.stores.toLocaleString()} stores</strong>
              <span className="dataset-info-card__value">
                {datasetInfo.seriesByState.map((state) => state.label).join(', ')}
              </span>
            </div>
            <div className="overview-stat dataset-info-card">
              <span className="dataset-info-card__label">Demand History</span>
              <strong>
                {formatLongDate(datasetInfo.coverage.start)} – {formatLongDate(datasetInfo.coverage.end)}
              </strong>
              <span className="dataset-info-card__value">
                {datasetInfo.coverage.days.toLocaleString()} days
              </span>
            </div>
            <div className="overview-stat dataset-info-card">
              <span className="dataset-info-card__label">Prediction Window</span>
              <strong>{summary.forecastHorizonDays} days ahead</strong>
            </div>
            <div className="overview-stat dataset-info-card">
              <span className="dataset-info-card__label">Demo Data</span>
              <strong>Demonstration</strong>
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
