export function ConnectionStatus() {
  return (
    <div className="mb-4">
      <h3>Connection status:</h3>
      <p>{navigator.onLine ? 'Online' : 'Offline'}</p>
    </div>
  );
}
