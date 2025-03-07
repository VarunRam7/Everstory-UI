import { Outlet } from 'react-router-dom';
import Sidebar from './side-bar';
import { useState } from 'react';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
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
