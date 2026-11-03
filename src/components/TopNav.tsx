import { Activity, Boxes, LayoutDashboard, Lightbulb, TrendingUp } from 'lucide-react';
import { useHashRoute } from '../hooks/useHashRoute';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'performance', label: 'Model Performance', icon: Activity },
  { id: 'insights', label: 'Data Insights', icon: Lightbulb },
];

export function TopNav() {
  const [route, navigate] = useHashRoute('overview');

  return (
    <header className="topnav">
      <button
        type="button"
        className="topnav__brand"
        onClick={() => navigate('overview')}
      >
        <span className="topnav__brand-mark">S</span>
        <span>Stockwise</span>
      </button>

      <nav className="topnav__links" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = route === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`topnav__link ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(item.id)}
            >
              <Icon className="topnav__icon" size={18} strokeWidth={1.8} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
