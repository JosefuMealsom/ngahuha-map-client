import { ConnectionStatus } from './components/ConnectionStatus';
import { PhotoViewer } from './components/PhotoViewer';
import { PlantPhotoForm } from './components/PlantPhotoForm';

function App() {
  return (
    <div>
      <ConnectionStatus></ConnectionStatus>
      <PhotoViewer></PhotoViewer>
      <PlantPhotoForm></PlantPhotoForm>
    </div>
  );
}

export default App;
