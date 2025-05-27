import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { Preloader } from '../ui/preloader';
import { getUserState } from '../../services/slices/userSlice/userSlice';

type ProtectedRouteProps = {
  // children: React.ReactElement;
  onlyUnAuth?: boolean;
};

type AuthState = {
  userData: any;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

const useAuthState = (): AuthState => {
  const { userData, isAuthChecked, isAuthenticated } =
    useSelector(getUserState);
  return { userData, isAuthChecked, isAuthenticated };
};

const useAuthRedirect = (onlyUnAuth: boolean | undefined, location: any) => {
  const { isAuthenticated } = useAuthState();

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return null;
};

const ProtectedRouteComponent = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked } = useAuthState();

  const redirect = useAuthRedirect(onlyUnAuth, location);
  if (redirect) return redirect;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return <Outlet />;
};

export const ProtectedRoute = ProtectedRouteComponent;
