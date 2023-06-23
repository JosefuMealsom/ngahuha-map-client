import { MapCanvas } from './components/MapCanvas';
import { useEffect } from 'react';
import gardenAreaService from './services/api/garden-area.service';
import genusService from './services/api/genus.service';
import speciesService from './services/api/species.service';
import plantSiteService from './services/api/plant-site.service';

function App() {
  useEffect(() => {
    const syncData = async () => {
      await genusService.fetch();
      await genusService.syncOffline();
      await gardenAreaService.syncOffline();
      await speciesService.syncOffline();
      plantSiteService.syncOffline();
    };
    syncData();
  }, []);

  return (
    <div className="touch-pan-y">
      <MapCanvas></MapCanvas>
    </div>
  );
}

export default App;
