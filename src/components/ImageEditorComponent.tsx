import React, { useState } from 'react';
import { Photo } from '../types/api/photo.type';
import { FullScreenImagePreviewComponent } from './FullScreenImagePreviewComponent';
import closeImgUrl from '../assets/svg/x-white.svg';
import starImgUrl from '../assets/svg/star.svg';
import plusImageUrl from '../assets/svg/plus.svg';
import cloudImageUrl from '../assets/svg/upload-cloud.svg';

export function ImageEditorComponent(props: {
  photos: Photo[];
  photosToUpload: Photo[];
  onClose: () => any;
  onImageAdded: (evt: React.ChangeEvent<HTMLInputElement>) => any;
  onSetPrimaryPhoto: (id: string) => any;
  onDeletePhoto: (id: string) => any;
  onDeletePhotoUpload: (id: string) => any;
}) {
  const [viewFullScreen, setViewFullScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  function onPreviewClick(imageSrc: string) {
    setSelectedImage(imageSrc);
    setViewFullScreen(true);
  }

  function renderFullScreenPreview() {
    if (!viewFullScreen) return;

    return (
      <FullScreenImagePreviewComponent
        src={selectedImage}
        onClose={() => setViewFullScreen(false)}
      />
    );
  }

  function renderPrimaryPhotoIndicator(photo: Photo) {
    if (!photo.primaryPhoto) return;

    return <img src={starImgUrl} className="absolute top-3 right-3 h-7 w-7" />;
  }

  function renderPrimaryPhotoButton(photo: Photo) {
    if (photo.primaryPhoto) return;

    return (
      <button
        className="rounded-full text-xs bg-emerald-600 py-2 px-4 mr-2 mb-1
      text-white font-semibold hover:outline hover:outline-2 hover:outline-blue-500"
        onClick={() => props.onSetPrimaryPhoto(photo.id)}
      >
        Set as primary photo
      </button>
    );
  }

  function renderDeleteButton(photo: Photo) {
    if (props.photos.length <= 1 || photo.primaryPhoto) return;

    return (
      <button
        className="rounded-full text-xs bg-red-600 py-2 px-4 mr-2
      text-white font-semibold hover:outline hover:outline-2 hover:outline-blue-500"
        onClick={() => props.onDeletePhoto(photo.id)}
      >
        Delete
      </button>
    );
  }

  return (
    <div className="relative pt-safe">
      <div className="mb-4 w-full h-full overflow-scroll p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-visible">
          {props.photos.map((photo) => (
            <div
              className="overflow-hidden rounded-md hover:outline-blue-500
              hover:outline hover:outline-2 cursor-pointer h-48 sm:h-80 relative"
              key={photo.id}
            >
              <img
                className="object-cover h-full w-full"
                src={photo.dataUrl}
                draggable={false}
                onClick={() => onPreviewClick(photo.dataUrl)}
              />
              {renderPrimaryPhotoIndicator(photo)}
              <div className="absolute bottom-2 right-2 flex flex-col sm:flex-row">
                {renderPrimaryPhotoButton(photo)}
                {renderDeleteButton(photo)}
              </div>
            </div>
          ))}
          {props.photosToUpload.map((photo) => (
            <div className="relative" key={photo.id}>
              <img
                className="w-full mb-3 h-48 sm:h-80 object-cover rounded-md cursor-pointer
                hover:outline-blue-500 hover:outline hover:outline-2"
                src={photo.dataUrl || ''}
                onClick={() => onPreviewClick(photo.dataUrl)}
                draggable={false}
              />
              <p className="absolute top-2 right-2 text-sky-500 py-1 px-2 text-sm flex items-center">
                <img className="w-8 h-8" src={cloudImageUrl} />
              </p>
              <div className="absolute bottom-5 right-0 flex">
                <button
                  className="rounded-full text-xs bg-red-600 py-2 px-4 mr-2
      text-white font-semibold hover:outline hover:outline-2 hover:outline-blue-500"
                  onClick={() => props.onDeletePhotoUpload(photo.id)}
                >
                  Remove upload
                </button>
              </div>
            </div>
          ))}
          <label>
            <div
              className="bg-gray-700 bg-opacity-60 flex items-center
          justify-center flex-col h-48 sm:h-80 rounded-md hover:outline-blue-500
          hover:outline hover:outline-2 cursor-pointer"
            >
              <img
                className="w-14 h-14 mb-3"
                src={plusImageUrl}
                draggable={false}
              />
              <p className="text-white font-semibold text-sm">Add image</p>
            </div>
            <input
              type="file"
              className="hidden"
              capture="environment"
              id="photo"
              accept="image/*"
              onChange={props.onImageAdded}
            />
          </label>
        </div>
      </div>
      <img
        src={closeImgUrl}
        className="absolute top-3 right-3 h-7 w-7 cursor-pointer"
        onClick={props.onClose}
      />
      {renderFullScreenPreview()}
    </div>
  );
}
