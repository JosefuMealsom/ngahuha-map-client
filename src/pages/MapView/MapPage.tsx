import { useLiveQuery } from 'dexie-react-hooks';
import { MapContainer } from './MapContainer';
import { LinkComponent } from '../../components/LinkComponent';
import { plantSiteUploadTable } from '../../services/offline.database';
import { Link } from 'react-router-dom';
import { ProtectedLayout } from '../ProtectedLayout';

export function MapPage() {
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());

  function renderPendingUploadLink() {
    if (plantUploadCount === 0) return;

    return (
      <LinkComponent link="/plant-site/pending-upload" text="Upload changes" />
    );
  }

  function renderDesktopUploadLink() {
    if (plantUploadCount === 0) return;

    return (
      <Link to="/plant-site/pending-upload" data-cy="open-upload-form">
        <div className="text-sm h-8 w-40 hover:bg-slate-100 align-middle flex items-center pl-3">
          Upload
        </div>
      </Link>
    );
  }

  return (
    <div>
      <MapContainer />
      <nav className="fixed bottom-3 pb-safe left-0 w-full flex justify-evenly sm:hidden">
        <div>
          <LinkComponent link="/plants" text="All plants" />
        </div>
        <div>
          <LinkComponent link="/login" text="Login" />
        </div>
        <ProtectedLayout>
          {renderPendingUploadLink()}
          <div>
            <LinkComponent link="/plant-site/new" text="New plant site" />
          </div>
          <div>
            <LinkComponent link="/plants/new" text="New plant" />
          </div>
        </ProtectedLayout>
      </nav>
      <nav className="fixed hidden bg-white pt-10 pb-10 pl-3 pr-8 drop-shadow-lg sm:inline-block">
        <Link to="/plants" data-cy="open-plant-list">
          <div className="text-sm h-8 w-40 hover:bg-slate-100 align-middle flex items-center pl-3">
            All plants
          </div>
        </Link>
        <Link to="/login" data-cy="login-page">
          <div className="text-sm h-8 w-40 hover:bg-slate-100 align-middle flex items-center pl-3">
            Login
          </div>
        </Link>
        <ProtectedLayout>
          {renderDesktopUploadLink()}
          <Link to="/plants/new" data-cy="new-plant-form">
            <div className="text-sm h-8 w-40 hover:bg-slate-100 align-middle flex items-center pl-3">
              Create new plant
            </div>
          </Link>
          <Link to="/plant-site/new" data-cy="open-plant-form">
            <div className="text-sm h-8 w-40 hover:bg-slate-100 align-middle flex items-center pl-3">
              New plant site
            </div>
          </Link>
        </ProtectedLayout>
      </nav>
    </div>
  );
}
