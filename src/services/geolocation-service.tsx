export class GeolocationService {
  getCurrentPosition(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      const onSuccess = (position: GeolocationPosition) => {
        resolve(position.coords);
      };

      const onError = (error: GeolocationPositionError) => {
        reject(error);
      };
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    });
  }
}
