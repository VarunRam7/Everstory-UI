import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { RootState } from '../store';
import { RouteConstants } from '../constants/route.constants';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (user) {
    return (
      <Navigate to={location.state?.from || RouteConstants.HOME} replace />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
