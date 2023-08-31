import { beforeEach, expect, describe, it } from 'vitest';
import {
  featureUploadTable,
  featurePhotoUploadTable,
} from '../../offline.database';
import featureUploadFactory from '../../../test-helpers/factories/feature-upload';
import featurePhotoUploadFactory from '../../../test-helpers/factories/feature-photo-upload';
import { serializeCreateFeature } from '../feature/feature-create.serializer';

describe('serializeCreateFeature()', () => {
  const featureUpload = featureUploadFactory.create({
    name: 'Joes feature',
    description: 'Cool description',
    id: 1,
    accuracy: 10,
    latitude: 20,
    longitude: 20,
  });

  const featurePhotoUpload1 = featurePhotoUploadFactory.create({
    featureUploadId: 1,
    blobKey: 'mr blobby',
  });
  const featurePhotoUpload2 = featurePhotoUploadFactory.create({
    featureUploadId: 1,
    blobKey: 'senor blobo',
  });

  beforeEach(async () => {
    await featureUploadTable.add(featureUpload);
    await featurePhotoUploadTable.add(featurePhotoUpload1);
    await featurePhotoUploadTable.add(featurePhotoUpload2);
  });

  it('generates the correct json', async () => {
    expect(await serializeCreateFeature(featureUpload)).toEqual({
      name: 'Joes feature',
      description: 'Cool description',
      accuracy: 10,
      latitude: 20,
      longitude: 20,
      featurePhotos: [{ blobKey: 'mr blobby' }, { blobKey: 'senor blobo' }],
    });
  });
});
