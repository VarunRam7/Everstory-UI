import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';
import { RootState } from '../store';
import Sidebar from './side-bar';
import { friendshipSocket } from '../context/friendship-socket';
import { setFollowRequests } from '../features/follow-request/follow-request-slice';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    friendshipSocket.on('newFollowRequest', (data: any) => {
      if (user && data.userId === user.id) {
        dispatch(setFollowRequests(data.requests));
      }
    });

    return () => {
      friendshipSocket.off('newFollowRequest');
    };
  }, [user]);

  return (
    <div className='flex bg-black'>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 ${
          collapsed ? 'ml-20' : 'ml-64'
        } min-h-screen bg-black`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
