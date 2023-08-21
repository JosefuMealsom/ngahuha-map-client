import { useAppStore } from '../store/app.store';

export const ProtectedLayout = (props: { children: any }) => {
  const { loggedIn } = useAppStore();

  if (!loggedIn) {
    return null;
  }

  return props.children;
};
