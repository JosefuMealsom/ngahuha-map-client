import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/app.store';

import { CreateNavigationBar } from '../Navigation/CreateNavigationBar';
import offlineDatabase, {
  pathNodeTable,
  pathTable,
} from '../../services/offline.database';
import { toast } from 'react-toastify';
import { PathMapContainer } from './PathMapContainer';
import { usePathTracerStore } from '../../store/path-tracer.store';
import { useLiveQuery } from 'dexie-react-hooks';
import { sortBy, where } from 'underscore';

const PathEditorPage: React.FC = () => {
  const { position } = useAppStore();
  const [pathName, setPathName] = useState('');
  const [isTracingPath, setIsTracingPath] = useState(false);
  const { path, setPath, addPathNode, setSavedPaths } = usePathTracerStore();
  const savedPaths = useLiveQuery(() => pathTable.toArray());
  const savedPathNodes = useLiveQuery(() => pathNodeTable.toArray());

  function tracePath() {
    setIsTracingPath(true);

    if (position) {
      setPath([position]);
    } else {
      setPath([]);
    }
  }

  async function finishTracingPath() {
    setIsTracingPath(false);
    try {
      await savePath();
      toast('Path successfully saved');
    } catch (error) {
      toast(`Error saving path ${(error as Error).message}`);
    }
  }

  useEffect(() => {
    if (!savedPaths || !savedPathNodes) return;

    const savedNodes = savedPaths.map((path) => {
      const nodesForPath = where(savedPathNodes, { pathId: path.id });
      const sortedNodes = sortBy(nodesForPath, (node) => node.order);
      return { path: path, pathNodes: sortedNodes };
    });

    setSavedPaths(savedNodes);
  }, [savedPaths, savedPathNodes]);

  async function savePath() {
    return offlineDatabase.transaction(
      'rw',
      pathTable,
      pathNodeTable,
      async () => {
        const pathId = await pathTable.put({ name: pathName });

        const pathNodes = path.map((coord, index) => ({
          pathId: pathId,
          order: index,
          accuracy: coord.accuracy,
          latitude: coord.latitude,
          longitude: coord.longitude,
        }));

        await pathNodeTable.bulkAdd(pathNodes);

        return pathId;
      },
    );
  }

  useEffect(() => {
    if (!isTracingPath || !position) return;

    addPathNode(position);
  }, [position]);

  function renderPathTracerButtons() {
    if (!isTracingPath) {
      return (
        <button
          className="bg-red-400 border-red-400 border
          py-2 px-4 text-xs font-semibold text-white cursor-pointer rounded-full"
          onClick={() => {
            if (pathName.length > 0) {
              tracePath();
            }
          }}
        >
          Start tracing path
        </button>
      );
    }

    return (
      <button
        className="bg-sky-500 border-sky-500 border py-2 px-4 text-xs
        font-semibold text-white cursor-pointer rounded-full"
        onClick={finishTracingPath}
      >
        Finish tracing path
      </button>
    );
  }

  return (
    <div className="pt-safe w-full h-full relative">
      <PathMapContainer />
      <div className="absolute top-0 left-0 pt-safe w-full">
        <CreateNavigationBar activePage="Path tracer" />
        <div className="w-full px-6 pt-7 sm:max-w-md">
          <label className="mb-2 text-white text-sm font-bold block">
            Path name
          </label>
          <input
            type="text"
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
            placeholder="Path name"
            value={pathName}
            disabled={isTracingPath}
            onChange={(event) => setPathName(event.target.value)}
          />
          {renderPathTracerButtons()}
        </div>
      </div>
    </div>
  );
};

export default PathEditorPage;
