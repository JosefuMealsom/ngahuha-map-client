export function AccuracyIndicator(props: { position: GeolocationCoordinates }) {
  const { position } = props;

  function getAccuracyColorIndicator(accuracy: number) {
    if (accuracy > 20) {
      return 'text-red-600';
    } else if (accuracy > 10 && accuracy < 20) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  }

  return (
    <div className="mb-5">
      <div className="inline-block">
        <h3 className="font-bold">Latitude</h3>
        <p>{position.latitude.toFixed(2)}</p>
      </div>
      <div className="inline-block ml-6">
        <h3 className="font-bold">Longitude</h3>
        <p>{position.longitude.toFixed(2)}</p>
      </div>
      <div className="block mt-3 ">
        <p>
          Accurate to within{' '}
          <span className={getAccuracyColorIndicator(position.accuracy)}>
            {position.accuracy.toFixed(2)}
            <b>m</b>
          </span>
        </p>
      </div>
    </div>
  );
}
