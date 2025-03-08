import { Menu as AntdMenu, Popover, notification } from 'antd';
import { Heart, Home, Menu, PlusCircle, Search, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import AuthService from '../services/auth/auth.service';
import CreatePostModal from './create-post-modal';
import FollowRequestService from '../services/friendship/follow-request.service';
import { ResponseEnum } from '../enums/follow-request-status.enum';
import { RootState } from '../store';
import { RouteConstants } from '../constants/route.constants';
import { getInitials } from '../utils/string.utils';
import { isEmpty } from 'lodash';
import { logout } from '../features/auth/auth-slice';
import { motion } from 'framer-motion';
import { removeFollowRequest } from '../features/follow-request/follow-request-slice';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [followRequestsVisible, setFollowRequestsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const user = useSelector((state: RootState) => state.auth.user);

  const followRequests = useSelector(
    (state: RootState) => state.followRequests.followRequests
  );

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuContent = (
    <AntdMenu
      selectedKeys={
        location.pathname === RouteConstants.PROFILE ? [`profile`] : []
      }
    >
      <AntdMenu.Item key='profile'>
        <Link to={RouteConstants.PROFILE}>My Account</Link>
      </AntdMenu.Item>
      <AntdMenu.Item key='logout' onClick={handleLogout}>
        Logout
      </AntdMenu.Item>
    </AntdMenu>
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchVisible(false);
        setSearchQuery('');
        setSearchResults([]);
      }
      if (e.key === 'Enter' && searchQuery.trim()) {
        fetchUsers();
      } else if (e.key === 'Enter' && isEmpty(searchQuery)) {
        setSearchResults([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const fetchUsers = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const users = await AuthService.fetchUsers(searchQuery);
      setSearchResults(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    setSearchVisible(false);
    setSearchResults([]);
    setSearchQuery('');
    navigate(`/user/${userId}`);
  };

  const handleRespondToRequest = async (
    requestToken: string,
    status: ResponseEnum
  ) => {
    try {
      const followRequest = await FollowRequestService.respondToRequest(
        requestToken,
        status
      );

      api['success']({
        message: `Follow request ${status} successfully 🎉`,
      });
      if (followRequest.isExpired) {
        dispatch(removeFollowRequest(requestToken));
      }
    } catch (error) {
      api['error']({
        message: 'Oops 🚨',
        description: 'Failed to respond to request! Please try again!',
      });
    }
  };

  return (
    <>
      <div
        className={`h-screen fixed left-0 top-0 ${
          collapsed ? 'w-20' : 'w-64'
        } bg-black text-white p-5 flex flex-col transition-all duration-300 border-r-2 border-[#696969]`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${collapsed ? 'self-center mb-12' : 'self-end mb-4'} `}
        >
          <Menu size={24} />
        </button>

        {!collapsed && (
          <p className='font-[cursive] text-lg text-center mb-6 text-[25px]'>
            Everstory
          </p>
        )}

        <nav className='flex flex-col gap-5'>
          <button
            onClick={() => navigate(RouteConstants.HOME)}
            className={`flex no-border-hover items-center gap-2 p-3 rounded-lg bg-black transition-all duration-300
      bg-gradient-to-r from-black to-black hover:from-gray-700 hover:to-black ${
        collapsed ? 'w-12 h-12 !p-[0.3em]' : ''
      }`}
          >
            <Home color='white' /> {!collapsed && 'Home'}
          </button>

          <button
            onClick={() => setSearchVisible(true)}
            className={`flex no-border-hover items-center gap-2 p-3 rounded-lg bg-black transition-all duration-300
      bg-gradient-to-r from-black to-black hover:from-gray-700 hover:to-black ${
        collapsed ? 'w-12 h-12 !p-[0.3em]' : ''
      }`}
          >
            <Search color='white' />
            {!collapsed && 'Search'}
          </button>

          <button
            key={followRequests.length}
            onClick={() => setFollowRequestsVisible(true)}
            className={`relative no-border-hover ${
              collapsed && 'h-[48px] w-[48px]'
            } flex items-center gap-2 rounded-lg bg-black transition-all duration-300
      bg-gradient-to-r from-black to-black hover:from-gray-700 hover:to-black ${
        collapsed && '!p-[5px]'
      }`}
          >
            <div className='relative'>
              <Heart color='white' />
              {followRequests.length > 0 && (
                <span className='absolute -top-2 -right-2.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                  {followRequests.length > 99 ? '99+' : followRequests.length}
                </span>
              )}
            </div>
            {!collapsed && 'Follow Requests'}
          </button>

          <button
            onClick={() => {
              setCreatePostModalVisible(true);
            }}
            className={`flex no-border-hover items-center gap-2 p-3 rounded-lg bg-black transition-all duration-300
      bg-gradient-to-r from-black to-black hover:from-gray-700 hover:to-black ${
        collapsed ? 'w-12 h-12 !p-[0.3em]' : ''
      }`}
          >
            <PlusCircle color='white' /> {!collapsed && 'Create Post'}
          </button>
        </nav>

        <div
          className={`mt-auto ${
            !collapsed && 'self-start'
          } flex items-center justify-center p-3 rounded-lg`}
        >
          {user ? (
            <Popover
              content={
                <div onClick={() => setVisible(false)}>{menuContent}</div>
              }
              trigger='click'
              placement='rightTop'
              open={visible}
              onOpenChange={setVisible}
            >
              <div className='flex items-center gap-2 cursor-pointer'>
                <div className='w-10 h-10 bg-white text-black flex items-center justify-center text-lg font-bold rounded-md'>
                  {getInitials(user.firstName)}
                  {getInitials(user.lastName)}
                </div>
                {!collapsed && (
                  <span className='text-white'>
                    {user.firstName} {user.lastName}
                  </span>
                )}
              </div>
            </Popover>
          ) : (
            <span className='text-gray-400'>Loading...</span>
          )}
        </div>
        <CreatePostModal
          visible={createPostModalVisible}
          onClose={() => setCreatePostModalVisible(false)}
          userId={user?.id || ''}
        />
      </div>
      {searchVisible && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.4 }}
          className='fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-start pt-20 z-50'
        >
          <div className='relative w-[40%]'>
            <input
              type='text'
              placeholder='Search users...'
              className='w-full p-4 rounded-md bg-gray-800 text-white text-lg outline-none border-none'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                if (isEmpty(searchQuery)) setSearchResults([]);
                else fetchUsers();
              }}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white'
            >
              <Search />
            </button>
          </div>

          {loading && <p className='text-gray-400 mt-4'>Fetching users...</p>}

          <div className='mt-4 w-[40%] bg-gray-900 rounded-lg p-4'>
            {searchResults.length > 0
              ? searchResults.map((user) => (
                  <div
                    key={user._id}
                    className='p-3 hover:bg-gray-700 cursor-pointer rounded-md flex items-center space-x-3'
                    onClick={() => handleUserClick(user.id)}
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={`${user.firstName} ${user.lastName}`}
                        className='w-10 h-10 rounded-md object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 flex items-center justify-center bg-white text-gray-900 font-semibold rounded-md'>
                        {user.firstName[0]?.toUpperCase()}
                        {user.lastName[0]?.toUpperCase()}
                      </div>
                    )}

                    <span className='text-white'>
                      {user.firstName} {user?.lastName}
                    </span>
                  </div>
                ))
              : !loading && <p className='text-gray-500'>No users found.</p>}
          </div>

          <button
            className='absolute top-6 right-6 text-white'
            onClick={() => {
              setSearchVisible(false);
              setSearchResults([]);
              setSearchQuery('');
            }}
          >
            <X size={32} />
          </button>
        </motion.div>
      )}

      {followRequestsVisible && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.4 }}
          className='fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-start pt-20 z-50'
        >
          <div className='relative w-[40%] !bg-[#222] rounded-lg p-4'>
            <h2 className='text-white text-lg font-bold mb-4'>
              Follow Requests
            </h2>

            {followRequests.length > 0 ? (
              followRequests.map((request) => (
                <div
                  key={request._id}
                  className='p-4 cursor-pointer rounded-md flex items-center space-x-4'
                  onClick={() => {
                    setFollowRequestsVisible(false);
                    navigate(`/user/${request.requestBy.id}`);
                  }}
                >
                  {request.requestBy.profilePhoto ? (
                    <img
                      src={request.requestBy.profilePhoto}
                      alt={request.requestBy.firstName}
                      className='w-16 h-20 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='w-14 h-14 flex items-center justify-center bg-white text-gray-900 font-semibold rounded-lg'>
                      {getInitials(request.requestBy.firstName)}
                      {getInitials(request.requestBy.lastName)}
                    </div>
                  )}

                  <div className='flex flex-col items-center gap-[5px]'>
                    <span className='text-white font-medium'>
                      {request.requestBy.firstName} {request.requestBy.lastName}
                    </span>

                    <div className='flex space-x-2 mt-1'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRespondToRequest(
                            request.requestToken,
                            ResponseEnum.ACCEPTED
                          );
                        }}
                        className='w-[7em] h-[2em] !text-sm !p-0 !bg-blue-500 text-white rounded-md !hover:bg-blue-600'
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRespondToRequest(
                            request.requestToken,
                            ResponseEnum.REJECTED
                          );
                        }}
                        className='w-[7em] h-[2em] !text-sm !p-0 !bg-red-500 text-white rounded-md !hover:bg-red-600'
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No pending follow requests.</p>
            )}
          </div>

          <button
            className='absolute top-6 right-6 text-white'
            onClick={() => setFollowRequestsVisible(false)}
          >
            <X size={32} />
          </button>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
