import { useLiveQuery } from 'dexie-react-hooks';
import { MapContainer } from './MapContainer';
import { LinkComponent } from '../../components/LinkComponent';
import { plantSiteUploadTable } from '../../services/offline.database';
import { Link } from 'react-router-dom';
import { ProtectedLayout } from '../ProtectedLayout';
import userImageUrl from '../../assets/svg/user.svg';
import plusImageUrl from '../../assets/svg/plus.svg';
import uploadUrl from '../../assets/svg/upload-cloud-white.svg';

export function MapPage() {
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());

  function renderPendingUploadLink() {
    if (plantUploadCount === 0) return;

    return (
      <ProtectedLayout>
        <Link to="/plant-site/pending-upload" data-cy="open-upload-form">
          <div className="rounded-full flex items-center drop-shadow-sm bg-indigo-700 p-3 mb-3">
            <img src={uploadUrl} className="inline-block w-6 text-center" />
          </div>
        </Link>
      </ProtectedLayout>
    );
  }

  return (
    <div>
      <MapContainer />

      <div className="bottom-3 right-5 pb-safe fixed">
        {renderPendingUploadLink()}
        <ProtectedLayout>
          <Link to="/plant-site/new" data-cy="open-add-page">
            <div className="rounded-full flex items-center drop-shadow-sm bg-sky-500 p-3 mb-3">
              <img
                src={plusImageUrl}
                className="inline-block w-6 text-center"
              />
            </div>
          </Link>
        </ProtectedLayout>
        <Link to="/login">
          <div className="rounded-full flex items-center drop-shadow-sm bg-forest p-3">
            <img src={userImageUrl} className="inline-block w-6 text-center" />
          </div>
        </Link>
      </div>
    </div>
  );
}
