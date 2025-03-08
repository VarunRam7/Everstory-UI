import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthService from './services/auth/auth.service';
import { ConfigProvider } from 'antd';
import FollowRequestService from './services/friendship/follow-request.service';
import Home from './pages/home';
import Layout from './components/layout';
import Login from './pages/login';
import Profile from './pages/profile';
import ProtectedRoute from './components/protected-route';
import PublicRoute from './components/public-route';
import { RootState } from './store';
import { RouteConstants } from './constants/route.constants';
import Signup from './pages/signup';
import UserProfile from './pages/user-profile';
import { login } from './features/auth/auth-slice';
import { setFollowRequests } from './features/follow-request/follow-request-slice';
import { useEffect } from 'react';

const queryClient = new QueryClient();

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

  const fetchFollowRequests = async () => {
    if (!user?.id) return;
    try {
      const requests = await FollowRequestService.getFollowRequests(user.id);
      dispatch(setFollowRequests(requests));
    } catch (error) {
      console.error('Error fetching follow requests:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfile();
    } else {
      fetchFollowRequests();
    }
  }, [user]);

  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path={RouteConstants.SIGNUP} element={<Signup />} />
              <Route path={RouteConstants.LOGIN} element={<Login />} />
              <Route path={'/'} element={<Login />} />
            </Route>
            {/* Protected Routes with Sidebar */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path={RouteConstants.HOME} element={<Home />} />
                <Route path={RouteConstants.PROFILE} element={<Profile />} />
                <Route
                  path={RouteConstants.USER_PROFILE}
                  element={<UserProfile />}
                />
              </Route>
            </Route>

            {/* Default Route */}
            <Route
              path={RouteConstants.NOT_FOUND}
              element={<h1>404 - Page Not Found</h1>}
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
