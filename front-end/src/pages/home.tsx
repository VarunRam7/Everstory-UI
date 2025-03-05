import AuthService from '../services/auth/auth-service';
import { login } from '../features/auth/auth-slice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const Home = () => {
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const userProfile = await AuthService.getProfile();
      dispatch(
        login({
          user: userProfile,
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
  }, []);

  return (
    <div className='flex h-full w-full justify-center items-center bg-black'>
      <h1 className='text-4xl font-bold text-white'>Welcome to Everstory</h1>
    </div>
  );
};

export default Home;
