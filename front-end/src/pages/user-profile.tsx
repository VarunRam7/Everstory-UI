import { Button, Dropdown, Menu, Spin, Switch, notification } from 'antd';
import { useEffect, useState } from 'react';

import AuthService from '../services/auth/auth.service';
import { DownOutlined } from '@ant-design/icons';
import FollowRequestService from '../services/friendship/follow-request.service';
import MyPosts from './my-posts';
import RelationshipService from '../services/friendship/relationship.service';
import { RootState } from '../store';
import { getInitials } from '../utils/string.utils';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [api, contextHolder] = notification.useNotification();
  const [totalPosts, setTotalPosts] = useState(0);
  const queryClient = useQueryClient();

  const showError = (description: string) => {
    api['error']({
      message: 'Oops 🚨',
      description,
    });
  };

  const fetchUser = async () => {
    try {
      const userData = await AuthService.getUserDetailsById(userId as string);
      setUserProfile(userData);
      setTotalPosts(userData?.totalPosts || 0);
      setProfileImage(userData?.profilePhoto || null);
    } catch (err) {
      showError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleFollowRequest = async () => {
    try {
      await FollowRequestService.createFollowRequest(userProfile.id);
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });

      if (userProfile.isPrivate)
        api.success({
          message: 'Follow request sent successfully 🎉',
        });
      else {
        api.success({
          message: `You started following ${userProfile.firstName} 🎉`,
        });
      }
    } catch (error: any) {
      showError(error || 'Failed to send follow request');
    }
  };

  const handleUnfollow = async () => {
    try {
      await RelationshipService.unfollowUser(userProfile.id);
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ['homeFeed'] });
      api.success({ message: 'User unfollowed successfully 🎉' });
    } catch (error: any) {
      showError(error || 'Failed to unfollow user');
    }
  };

  const handleRevokeRequest = async () => {
    try {
      await FollowRequestService.revokeRequest(userProfile.id);
      fetchUser();
      api.success({ message: 'Revoked request successfully 🎉' });
    } catch (error: any) {
      showError(error || 'Failed to revoke request');
    }
  };

  const menu = (
    <Menu className='unfollow-button'>
      <Menu.Item key='1' onClick={handleUnfollow}>
        Unfollow
      </Menu.Item>
    </Menu>
  );

  if (loading) return <p className='text-gray-500'>Loading user profile...</p>;

  if (!userProfile) return <p className='text-gray-500'>User not found.</p>;

  return (
    <>
      {contextHolder}
      <div className='flex flex-col mt-5 items-center text-white relative'>
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
            <Spin size='large' />
          </div>
        )}

        <div className='w-32 h-32 flex items-center justify-center rounded-full bg-white relative'>
          {profileImage ? (
            <img
              src={profileImage}
              alt='Profile'
              className='rounded-full w-full h-full object-cover border-1 border-white'
            />
          ) : (
            <span className='font-bold text-black text-5xl'>
              {getInitials(userProfile.firstName)}
              {getInitials(userProfile.lastName)}
            </span>
          )}
        </div>

        <h2 className='mt-4 text-2xl font-[cursive]'>
          {userProfile?.firstName} {userProfile?.lastName}
        </h2>

        <div className='flex gap-6 mt-2'>
          <span>
            <strong>{totalPosts || 0}</strong> Posts
          </span>
          <span>
            <strong>{userProfile.followersCount || 0}</strong> Followers
          </span>
          <span>
            <strong>{userProfile.followingCount || 0}</strong> Following
          </span>
        </div>

        {userProfile.isFollowing ? (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type='primary' className='mt-4 !font-semibold'>
              Following{' '}
              <DownOutlined
                style={{
                  fontSize: '10px',
                  marginLeft: '5px',
                  marginTop: '3px',
                }}
              />
            </Button>
          </Dropdown>
        ) : userProfile.isRequested ? (
          <Button
            type='default'
            className='mt-4 !font-semibold'
            onClick={handleRevokeRequest}
          >
            Requested
          </Button>
        ) : (
          <Button
            type='primary'
            className='mt-4 !font-semibold'
            onClick={handleFollowRequest}
          >
            Follow
          </Button>
        )}
        <div className='flex flex-row gap-2 mt-[10px] items-center'>
          <span
            style={{
              fontFamily: 'math',
            }}
            className='text-sm'
          >
            Public
          </span>
          <Switch
            size='small'
            checked={userProfile.isPrivate}
            disabled={true}
            style={{
              backgroundColor: userProfile.isPrivate ? '#1677ff' : '#555',
            }}
          />
          <span
            style={{
              fontFamily: 'math',
            }}
            className='text-sm'
          >
            Private
          </span>
        </div>
        {(userProfile.isFollowing || !userProfile.isPrivate) && (
          <MyPosts
            userId={userId || ''}
            isMyProfile={false}
            setTotalPosts={setTotalPosts}
          />
        )}
      </div>
    </>
  );
};

export default UserProfile;
