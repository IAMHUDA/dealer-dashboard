import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  Settings, 
  LogOut,
  ChevronLeft,
  Film,
  UserCircle // Icon untuk Profile
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', exact: true },
    { name: 'Motor', icon: Bike, path: '/motors' },
    { name: 'Iklan Saya', icon: Film, path: '/ads' },
    { name: 'Profile', icon: UserCircle, path: '/profile' }, // Menu Profile untuk semua user
  ];

  if (isAdmin) {
    menuItems.push({ name: 'User', icon: Users, path: '/users' });
  }

  return (
    <motion.div
      animate={{ width: isOpen ? 'var(--sidebar-width)' : '80px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'space-between' : 'center',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        {isOpen && (
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            DEALER PRO
          </h1>
        )}
        <button 
          onClick={toggleSidebar}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '4px',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'var(--transition)'
          }}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Profile Mini */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          fontSize: '0.875rem',
          flexShrink: 0
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        {isOpen && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '500', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{user?.role}</p>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'white' : 'var(--text-muted)',
              backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'var(--transition)',
              position: 'relative',
              overflow: 'hidden'
            })}
            className={({ isActive }) => (isActive ? 'active-nav' : '')}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
                {isOpen && <span>{item.name}</span>}
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      bottom: '15%',
                      width: '3px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            width: '100%',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          {isOpen && <span>Keluar</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
