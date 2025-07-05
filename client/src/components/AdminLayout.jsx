import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="d-flex admin-layout">
      <AdminSidebar show={showSidebar} toggleSidebar={toggleSidebar} />
      <main className="admin-main-content flex-grow-1 p-4">
        <button
          className="btn btn-outline-dark d-md-none mb-3"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i> Menu
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
