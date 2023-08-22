import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/app.store';

export const ProtectedRoute = (props: { children: JSX.Element }) => {
  const { loggedIn } = useAppStore();

  if (!loggedIn) {
    return <Navigate to="/" />;
  }

  return props.children;
};
