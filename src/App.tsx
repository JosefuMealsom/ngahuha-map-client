import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { SyncComponent } from './SyncComponent';

function App() {
  return (
    <div>
      <Outlet />
      <ToastContainer className="pt-safe" />
      <div className="fixed left-1/2 -translate-x-1/2 bottom-5 pb-safe">
        <SyncComponent />
      </div>
    </div>
  );
}

export default App;
