import AuthService from '../services/auth/auth.service';
import { RouteConstants } from '../constants/route.constants';
import { login } from '../features/auth/auth-slice';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

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
    fetchProfile();
    if (!sessionStorage.getItem('initialLoading')) {
      if (location.state?.from === RouteConstants.LOGIN)
        api['success']({
          message: 'Logged into Everstory successfully 🎉',
        });
      else if (location.state?.from === RouteConstants.SIGNUP)
        api['success']({
          message: `Looks like you're all set 🎉`,
          description: 'Welcome to Everstory',
        });
    }
    sessionStorage.setItem('initialLoading', 'true');
  }, []);

  return (
    <>
      {contextHolder}
      <div className='flex h-full w-full justify-center items-center bg-black'>
        <h1 className='text-4xl font-bold text-white'>Welcome to Everstory</h1>
      </div>
    </>
  );
};

export default Home;
