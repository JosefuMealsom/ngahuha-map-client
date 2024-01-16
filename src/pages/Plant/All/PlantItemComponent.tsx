import { Link } from 'react-router-dom';
import { Plant } from '../../../types/api/plant.type';
import { useEffect, useState } from 'react';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { usePlantPhotos } from '../../../hooks/use-plant-photos.hook';

export function PlantItemComponent(props: Plant) {
  const plantSitePhotos = usePlantPhotos(props.id);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!plantSitePhotos) return;

    const getPlantImage = async () => {
      let displayPhoto = plantSitePhotos[0];

      setPreviewImage(displayPhoto.dataUrl);
    };

    getPlantImage();
  }, [plantSitePhotos]);

  function renderImage() {
    if (previewImage.length === 0) return;

    return <img src={previewImage} className="w-full h-full object-cover" />;
  }

  function renderPlantInfo() {
    return (
      <div className="h-full sm:h-96 cursor-pointer hover:opacity-90 bg-white">
        <div
          className={`w-full h-full relative min-h-[15rem] ${
            previewImage ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        >
          {renderImage()}
          <div className="absolute top-0 p-3 rounded-br-lg bg-black bg-opacity-50 max-w-fit">
            <PlantTitleComponent {...props} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/plants/${props.id}`}>
      <div className="w-full">{renderPlantInfo()}</div>
    </Link>
  );
}
