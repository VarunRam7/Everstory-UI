import { Outlet } from 'react-router-dom';
import Sidebar from './side-bar';

const Layout = () => {
  return (
    <div className='flex'>
      <Sidebar />

      <div className='flex-1 bg-black'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
