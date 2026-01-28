import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Map paths to titles
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Ringkasan';
    if (path.startsWith('/users')) return 'Manajemen User';
    if (path.startsWith('/motors')) return 'Inventaris Motor';
    return 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : '80px',
        transition: 'var(--transition)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Topbar title={getTitle()} />
        
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ padding: '2rem', flex: 1 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
