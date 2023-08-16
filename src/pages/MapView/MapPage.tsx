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
      <nav className="fixed bottom-3 pb-safe left-0 w-full flex justify-evenly sm:hidden">
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
      <nav className="fixed left-0 pb-safe hidden bg-white pt-10 drop-shadow-lg sm:inline-block">
        <div className="block text-sm pl-4 pr-10">
          {renderPendingUploadLink()}
        </div>
        <div
          data-cy="open-plant-list"
          className="block pt-5 text-sm pl-4 pr-10"
        >
          <LinkComponent link="/plants" text="All plants" />
        </div>
        <div
          data-cy="open-plant-form"
          className="block pt-5 text-sm pl-4 pr-10"
        >
          <LinkComponent link="/plant-site/new" text="New plant site" />
        </div>
        <div
          data-cy="new-plant-form"
          className="block pt-5 text-sm pl-4 pr-14 pb-10"
        >
          <LinkComponent link="/plants/new" text="Create new plant" />
        </div>
      </nav>
    </div>
  );
}
