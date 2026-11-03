import { TopNav } from './components/TopNav';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <div className="app">
      <TopNav />
      <main className="app__main">
        <AppRoutes />
      </main>
    </div>
  );
}
