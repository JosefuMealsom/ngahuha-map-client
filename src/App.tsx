import { MapCanvas } from './components/MapCanvas';
import { PlantPhotosToUpload } from './components/PlantPhotosToUpload';
import { PlantPhotoForm } from './components/PlantPhotoForm';

function App() {
  return (
    <div className="touch-pan-y">
      <MapCanvas></MapCanvas>
      <PlantPhotosToUpload></PlantPhotosToUpload>
      <PlantPhotoForm></PlantPhotoForm>
    </div>
  );
}

export default App;
