import { AppProvider } from './hooks/useAppState';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
