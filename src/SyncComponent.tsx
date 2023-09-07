import { useEffect, useState } from 'react';
import { useAppStore } from './store/app.store';

export function SyncComponent() {
  const { syncStatus } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncText, setSyncText] = useState('');

  useEffect(() => {
    switch (syncStatus) {
      case 'Not syncing':
        setIsSyncing(false);
        break;
      case 'Syncing data':
        setIsSyncing(true);
        setSyncText('Syncing data');
        break;
      case 'Syncing photos':
        setIsSyncing(true);
        setSyncText('Syncing photos');
        break;
    }
  }, [syncStatus]);

  return (
    <div
      className={`py-2 px-4 text-white text-sm font-semibold rounded-full
     bg-sky-500 transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-0'}`}
    >
      {syncText}
    </div>
  );
}
