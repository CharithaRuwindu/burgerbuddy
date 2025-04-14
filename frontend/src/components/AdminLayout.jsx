import React from 'react';
import { Outlet } from 'react-router-dom';
import AdmSidebar from './AdmSidebar';

const AdminLayout = () => {
  const drawerWidth = 240;
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdmSidebar />
      
      <div 
        className="flex-1 overflow-auto p-6"
        style={{ marginLeft: `${drawerWidth}px` }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;