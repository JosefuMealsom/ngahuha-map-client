import { MapCanvas } from './components/MapCanvas';
import { PhotoViewer } from './components/PhotoViewer';
import { PlantPhotoForm } from './components/PlantPhotoForm';

function App() {
  return (
    <div className="touch-pan-y">
      <MapCanvas></MapCanvas>
      <PhotoViewer></PhotoViewer>
      <PlantPhotoForm></PlantPhotoForm>
    </div>
  );
}

export default App;
