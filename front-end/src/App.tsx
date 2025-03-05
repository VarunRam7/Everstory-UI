import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthService from './services/auth/auth-service';
import Home from './pages/home';
import Layout from './components/layout';
import Login from './pages/login';
import Profile from './pages/profile';
import ProtectedRoute from './components/protected-route';
import { RootState } from './store';
import { RouteConstants } from './constants/route.constants';
import Signup from './pages/signup';
import { login } from './features/auth/auth-slice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchProfile = async () => {
    try {
      const userProfile = await AuthService.getProfile();
      dispatch(
        login({
          user: { ...userProfile, id: userProfile._id },
          accessToken:
            localStorage.getItem('accessToken') || 'dummy_access_token',
        })
      );
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [dispatch, user]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={RouteConstants.SIGNUP} element={<Signup />} />
        <Route path={RouteConstants.LOGIN} element={<Login />} />

        {/* Protected Routes with Sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path={RouteConstants.HOME} element={<Home />} />
            <Route path={RouteConstants.PROFILE} element={<Profile />} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route
          path={RouteConstants.NOT_FOUND}
          element={<h1>404 - Page Not Found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
