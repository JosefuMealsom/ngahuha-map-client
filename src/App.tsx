import { ConnectionStatus } from './components/ConnectionStatus';
import { GeolocationStatus } from './components/GeolocationStatus';
import { PhotoViewer } from './components/PhotoViewer';
import { PlantPhotoForm } from './components/PlantPhotoForm';

function App() {
  return (
    <div>
      <ConnectionStatus></ConnectionStatus>
      <GeolocationStatus></GeolocationStatus>
      <PhotoViewer></PhotoViewer>
      <PlantPhotoForm></PlantPhotoForm>
    </div>
  );
}

export default App;
