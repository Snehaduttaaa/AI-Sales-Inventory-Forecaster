import { PageHeader } from './components/PageHeader';
import { Section } from './components/Section';
import { useHashRoute } from './hooks/useHashRoute';
import DemandForecastPage from './pages/DemandForecastPage';
import OverviewPage from './pages/OverviewPage';

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="page">
      <PageHeader
        eyebrow="STOCKWISE"
        title={title}
        description={description}
      />
      <Section title="Coming soon" description="This area is part of the Stockwise workspace.">
        <p className="muted">
          This view is not available yet. Continue exploring the overview and demand forecast.
        </p>
      </Section>
    </div>
  );
}

export function AppRoutes() {
  const [route] = useHashRoute('overview');

  switch (route) {
    case 'forecast':
      return <DemandForecastPage />;
    case 'inventory':
      return (
        <PlaceholderPage
          title="Inventory planning"
          description="Review stock levels and plan replenishment around expected demand."
        />
      );
    case 'performance':
      return (
        <PlaceholderPage
          title="Model performance"
          description="Explore forecast accuracy and compare model results."
        />
      );
    case 'insights':
      return (
        <PlaceholderPage
          title="Data insights"
          description="Understand the data behind Stockwise forecasts and recommendations."
        />
      );
    case 'overview':
    default:
      return <OverviewPage />;
  }
}
