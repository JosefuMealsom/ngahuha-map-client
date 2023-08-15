import { useLiveQuery } from 'dexie-react-hooks';
import { MapContainer } from './MapContainer';
import { LinkComponent } from '../../components/LinkComponent';
import { plantSiteUploadTable } from '../../services/offline.database';

export function MapPage() {
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());

  function renderPendingUploadLink() {
    if (plantUploadCount === 0) return;

    return (
      <div data-cy="open-upload-form">
        <LinkComponent
          link="/plant-site/pending-upload"
          text="Upload changes"
        />
      </div>
    );
  }

  return (
    <div>
      <MapContainer />
      <nav className="absolute bottom-0 left-0 w-full flex justify-evenly">
        {renderPendingUploadLink()}
        <div data-cy="open-plant-list">
          <LinkComponent link="/plants" text="All plants" />
        </div>
        <div data-cy="open-plant-form">
          <LinkComponent link="/plant-site/new" text="New plant site" />
        </div>
        <div data-cy="new-plant-form">
          <LinkComponent link="/plants/new" text="Create new plant" />
        </div>
      </nav>
    </div>
  );
}
