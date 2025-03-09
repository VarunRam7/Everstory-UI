import { Modal, Spin, Switch, Upload, message } from 'antd';
import { useEffect, useState } from 'react';

import AuthService from '../services/auth/auth.service';
import ImageService from '../services/image/image.service';
import MyPosts from './my-posts';
import { RootState } from '../store';
import { getInitials } from '../utils/string.utils';
import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePhoto || null
  );
  const [totalPosts, setTotalPosts] = useState(0);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);

  useEffect(() => {
    if (user?.profilePhoto) {
      setProfileImage(user.profilePhoto);
    }
  }, [user?.profilePhoto]);

  useEffect(() => {
    if (user) {
      setIsPrivate(user.isPrivate);
    }
  }, [user]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setIsModalOpen(false);
    try {
      const uploadedImageUrl = await ImageService.uploadProfilePhoto(file);
      setProfileImage(uploadedImageUrl);
      message.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Upload failed', error);
      message.error('Profile photo upload failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (isPrivate: boolean) => {
    try {
      await AuthService.updatePrivacySettings(isPrivate);
    } catch (error) {
      console.error('Updating privacy settings failed', error);
    }
  };

  const handleRemovePhoto = async () => {
    setLoading(true);
    setIsModalOpen(false);
    try {
      const response = await ImageService.removeProfilePhoto(
        profileImage || ''
      );
      setProfileImage(null);
      message.success(response);
    } catch (error) {
      console.error('Remove failed', error);
      message.error('Failed to remove profile photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col mt-5 items-center text-white relative'>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
          <Spin size='large' />
        </div>
      )}

      <div
        className={`w-32 h-32 flex items-center justify-center rounded-full bg-white cursor-pointer relative ${
          loading ? 'opacity-50' : ''
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt='Profile'
            className='rounded-full w-full h-full object-cover border-1 border-white'
          />
        ) : (
          <span className='font-bold text-black text-5xl'>
            {user
              ? getInitials(user.firstName) + getInitials(user.lastName)
              : ''}
          </span>
        )}
      </div>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        closable={false}
        maskClosable={true}
        className='custom-profile-modal'
      >
        <div className='flex flex-col text-center'>
          <h3
            style={{ fontFamily: 'Figtree' }}
            className='text-lg font-semibold text-white px-4 py-6 border-b border-gray-600'
          >
            Change Profile Photo
          </h3>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            disabled={loading}
            style={{ width: '100%' }}
          >
            <button className='text-blue-500 text-md py-3 border-b border-[#696969] w-full'>
              Upload Photo
            </button>
          </Upload>
          {profileImage && (
            <button
              className='text-red-500 text-md py-3 border-b border-gray-600 w-full'
              onClick={handleRemovePhoto}
            >
              Remove Current Photo
            </button>
          )}
          <button
            className='text-white text-md py-3 w-full'
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <h2 className='mt-4 text-2xl font-[cursive]'>
        {user?.firstName} {user?.lastName}
      </h2>

      <div className='flex gap-6 mt-2'>
        <span>
          <strong>{totalPosts || 0}</strong> Posts
        </span>
        <span>
          <strong>{user?.followers || 0}</strong> Followers
        </span>
        <span>
          <strong>{user?.following || 0}</strong> Following
        </span>
      </div>
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
          checked={isPrivate}
          onChange={(e) => {
            updatePrivacySettings(e);
            setIsPrivate(!isPrivate);
          }}
          style={{
            backgroundColor: isPrivate ? '#1677ff' : '#555',
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

      <MyPosts
        userId={user?.id || ''}
        isMyProfile={true}
        setTotalPosts={setTotalPosts}
      />
    </div>
  );
};

export default Profile;
