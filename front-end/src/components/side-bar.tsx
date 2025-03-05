import { Menu as AntdMenu, Popover } from 'antd';
import { Home, Menu, PlusCircle, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CreatePostModal from './create-post-modal';
import { RootState } from '../store';
import { RouteConstants } from '../constants/route.constants';
import { getInitials } from '../utils/string.utils';
import { logout } from '../features/auth/auth-slice';
import { useState } from 'react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
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

  return (
    <div
      className={`h-screen ${
        collapsed ? 'w-20' : 'w-64'
      } bg-black text-white p-5 flex flex-col transition-all duration-300 border-r-2 border-[#696969]`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`${collapsed ? 'self-center' : 'self-end'} mb-4`}
      >
        <Menu size={24} />
      </button>

      {!collapsed && (
        <p className='font-[cursive] text-lg text-center mb-6 text-[25px]'>
          Everstory
        </p>
      )}

      <nav className='flex flex-col gap-4'>
        <Link
          to={RouteConstants.HOME}
          className='flex items-center gap-2 p-3 hover:bg-gray-800 rounded-lg'
        >
          <Home color='white' /> {!collapsed && 'Home'}
        </Link>
        <Link
          to={RouteConstants.SEARCH}
          className='flex items-center gap-2 p-3 hover:bg-gray-800 rounded-lg'
        >
          <Search color='white' /> {!collapsed && 'Search'}
        </Link>
        <button
          onClick={() => {
            setCreatePostModalVisible(true);
          }}
          className='flex items-center gap-2 p-3 hover:bg-gray-800 rounded-lg'
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
            content={<div onClick={() => setVisible(false)}>{menuContent}</div>}
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
                <span className='text-white'>{user.firstName}</span>
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
        onPostCreated={() => {
          //TODO make an api call to get posts
        }}
      />
    </div>
  );
};

export default Sidebar;
