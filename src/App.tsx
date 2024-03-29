import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { SyncComponent } from './SyncComponent';
import { usePosition } from './hooks/use-position.hook';
import { useEffect } from 'react';
import { useAppStore } from './store/app.store';
import { AdminNavigation } from './pages/Navigation/AdminNavigation';
import { syncDataFromServer } from './services/api/sync-data.service';

function App() {
  const position = usePosition();
  const { setPosition } = useAppStore();

  useEffect(() => {
    setPosition(position);
  }, [position]);

  useEffect(() => {
    syncDataFromServer();
  }, []);

  return (
    <div>
      <Outlet />
      <ToastContainer className="pt-safe" />
      <div className="fixed left-1/2 -translate-x-1/2 bottom-5 pb-safe pointer-events-none z-40">
        <SyncComponent />
      </div>
      <ScrollRestoration />
      <AdminNavigation />
    </div>
  );
}

export default App;
