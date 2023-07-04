import { MouseEventHandler, useEffect, useState } from 'react';

export function OnlineComponent() {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  window.addEventListener('offline', (e) => setOnlineStatus(false));
  window.addEventListener('online', (e) => setOnlineStatus(true));

  return (
    <div className="absolute bottom-2 left-2">
      <p className="text-black font-bold text-lg">
        {onlineStatus ? 'Online' : 'Offline'}
      </p>
    </div>
  );
}
