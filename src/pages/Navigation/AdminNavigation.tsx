import { Link, useSearchParams } from 'react-router-dom';
import { ProtectedLayout } from '../ProtectedLayout';
import userImageUrl from '../../assets/svg/user.svg';
import plusImageUrl from '../../assets/svg/plus.svg';
import refreshDataUrl from '../../assets/svg/refresh-cw.svg';
import uploadUrl from '../../assets/svg/upload-cloud-white.svg';
import { useLiveQuery } from 'dexie-react-hooks';

import {
  featureUploadTable,
  plantSitePhotoUploadTable,
  plantSiteUploadTable,
} from '../../services/offline.database';
import { syncDataFromServer } from '../../services/api/sync-data.service';
import { useAppStore } from '../../store/app.store';

export function AdminNavigation() {
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const featureUploadCount = useLiveQuery(() => featureUploadTable.count());
  const plantPhotoUploadCount = useLiveQuery(() =>
    plantSitePhotoUploadTable.count(),
  );

  const { loggedIn } = useAppStore();
  const [params] = useSearchParams();

  function renderPendingUploadLink() {
    if (
      plantUploadCount === 0 &&
      featureUploadCount === 0 &&
      plantPhotoUploadCount === 0
    )
      return;

    return (
      <ProtectedLayout>
        <Link to="/plant-site/pending-upload" data-cy="open-upload-form">
          <div className="rounded-full flex items-center drop-shadow-sm bg-indigo-700 p-3 mb-3 mr-2">
            <img src={uploadUrl} className="inline-block w-6 text-center" />
          </div>
        </Link>
      </ProtectedLayout>
    );
  }

  function renderLayout() {
    if (!loggedIn && !params.get('showlogin')) {
      return;
    }

    return (
      <div className="bottom-1 right-1 pb-safe fixed z-30">
        <div className="flex">
          <ProtectedLayout>
            <div
              className="rounded-full flex items-center drop-shadow-sm bg-emerald-800 p-3 cursor-pointer mb-3 mr-2"
              onClick={syncDataFromServer}
            >
              <img
                src={refreshDataUrl}
                className="inline-block w-6 text-center"
              />
            </div>
          </ProtectedLayout>
          {renderPendingUploadLink()}
          <ProtectedLayout>
            <Link to="/plant-site/new" data-cy="open-add-page">
              <div className="rounded-full flex items-center drop-shadow-sm bg-sky-500 p-3 mb-3 mr-2">
                <img
                  src={plusImageUrl}
                  className="inline-block w-6 text-center"
                />
              </div>
            </Link>
          </ProtectedLayout>
          <Link to="/login">
            <div className="rounded-full flex items-center drop-shadow-sm bg-forest p-3 mr-2">
              <img
                src={userImageUrl}
                className="inline-block w-6 text-center"
              />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return renderLayout();
}
