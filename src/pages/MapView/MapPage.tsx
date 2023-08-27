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
      <nav className="fixed bottom-3 pb-safe left-0 w-full flex justify-evenly sm:hidden">
        <ProtectedLayout>
          <div>
            <LinkComponent link="/plants/new" text="New plant" />
          </div>
        </ProtectedLayout>
      </nav>
      <nav className="fixed hidden bg-white right-0 top-0 pt-3 pb-3 pl-3 pr-8 drop-shadow-lg sm:inline-block">
        <ProtectedLayout>
          <Link to="/plants/new" data-cy="new-plant-form">
            <div className="text-sm h-8 w-40 hover:bg-slate-100 align-middle flex items-center pl-3">
              Create new plant
            </div>
          </Link>
        </ProtectedLayout>
      </nav>

      <div className="bottom-3 right-5 pb-safe fixed">
        {renderPendingUploadLink()}
        <ProtectedLayout>
          <Link to="/plant-site/new" data-cy="open-plant-form">
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
