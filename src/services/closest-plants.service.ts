import type { PlantSite } from '../types/api/plant-site.type';
import type { LatLong } from '../types/lat-long.type';

export const getPlantSitesWithinDistance = (
  distance: number,
  location: LatLong,
  plantSites: PlantSite[],
) => {
  const plantSitesWithDistance = plantSites.map((plantSite) => ({
    distance: distanceBetweenCoords(location, {
      latitude: plantSite.latitude,
      longitude: plantSite.longitude,
      accuracy: plantSite.accuracy,
    }),
    ...plantSite,
  }));

  return plantSitesWithDistance
    .filter((plantSite) => plantSite.distance <= distance)
    .sort((a, b) => a.distance - b.distance);
};

// Haversine formula for calculating distance http://www.movable-type.co.uk/scripts/latlong.html
function distanceBetweenCoords(position1: LatLong, position2: LatLong) {
  const radiusOfEarthInMetres = 6371 * 1000;
  const deltaLat = degreesToRadians(position2.latitude - position1.latitude);
  const deltaLon = degreesToRadians(position2.longitude - position1.longitude);
  const halfChordLengthSquared =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(degreesToRadians(position1.latitude)) *
      Math.cos(degreesToRadians(position2.latitude)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const angularDistanceInRadians =
    2 *
    Math.atan2(
      Math.sqrt(halfChordLengthSquared),
      Math.sqrt(1 - halfChordLengthSquared),
    );
  return radiusOfEarthInMetres * angularDistanceInRadians;
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}
