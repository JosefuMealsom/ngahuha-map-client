import type { PlantSite } from '../types/api/plant-site.type';
import type { LatLong } from '../types/lat-long.type';

export const getPlantSitesWithinDistance = (
  distance: number,
  location: LatLong,
  plantSites: PlantSite[],
) => {
  return plantSites.filter(
    (plantSite) =>
      distanceBetweenCoords(location, {
        latitude: plantSite.latitude,
        longitude: plantSite.longitude,
      }) <= distance,
  );
};

const distanceBetweenCoords = (position1: LatLong, position2: LatLong) => {
  const position1ToMetres = convertToMetres(position1);
  const position2ToMetres = convertToMetres(position2);

  return Math.hypot(
    position2ToMetres.latitudeToMetres - position1ToMetres.latitudeToMetres,
    position2ToMetres.longitudeToMetres - position1ToMetres.longitudeToMetres,
  );
};

// https://en.wikipedia.org/wiki/Geographic_coordinate_system#Length_of_a_degree
const convertToMetres = (latLong: LatLong) => {
  const { latitude, longitude } = latLong;
  const latitudeToMetres =
    111132.92 -
    559.82 * Math.cos(2 * latitude) +
    1.1175 * Math.cos(4 * latitude) -
    0.0023 * Math.cos(6 * latitude);

  const longitudeToMetres =
    111412.84 * Math.cos(longitude) -
    93.5 * Math.cos(3 * longitude) +
    0.118 * Math.cos(5 * longitude);

  return {
    latitudeToMetres: latitudeToMetres,
    longitudeToMetres: longitudeToMetres,
  };
};
