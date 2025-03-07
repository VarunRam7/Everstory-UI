import { useEffect, useState } from 'react';

import AuthService from '../services/auth/auth-service';
import { Spin } from 'antd';
import { getInitials } from '../utils/string.utils';
import { notification } from 'antd';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AuthService.getUserDetailsById(userId as string);
        setUser(userData);
        setProfileImage(userData?.profilePhoto || null);
      } catch (err) {
        api.error({
          message: 'Oops 🚨',
          description: 'Failed to fetch user profile',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className='text-gray-500'>Loading user profile...</p>;

  if (!user)
    return <p className='text-gray-500'>{contextHolder} User not found.</p>;

  return (
    <div className='flex flex-col mt-5 items-center text-white relative'>
      {contextHolder}

      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
          <Spin size='large' />
        </div>
      )}

      <div
        className={`w-32 h-32 flex items-center justify-center rounded-full bg-white relative`}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt='Profile'
            className='rounded-full w-full h-full object-cover border-1 border-white'
          />
        ) : (
          <span className='font-bold text-black text-5xl'>
            {getInitials(user.firstName)}
            {getInitials(user.lastName)}
          </span>
        )}
      </div>

      <h2 className='mt-4 text-2xl font-[cursive]'>
        {user?.firstName} {user?.lastName}
      </h2>

      <div className='flex gap-6 mt-2'>
        <span>
          <strong>{user.totalPosts}</strong> Posts
        </span>
        <span>
          <strong>0</strong> Followers
        </span>
        <span>
          <strong>0</strong> Following
        </span>
      </div>
    </div>
  );
};

export default UserProfile;
