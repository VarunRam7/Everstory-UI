import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from '../store';
import { RouteConstants } from '../constants/route.constants';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const storedToken = localStorage.getItem('accessToken');

  if (!accessToken && !storedToken) {
    return <Navigate to={RouteConstants.LOGIN} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
