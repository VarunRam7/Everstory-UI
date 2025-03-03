import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from '../store';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return accessToken ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
