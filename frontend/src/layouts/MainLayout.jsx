import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X, Film } from 'lucide-react';

const MainLayout = ({ children, onSearchClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="sidebar-logo-icon" style={{ width: 32, height: 32 }}>
            <Film size={16} color="white" />
          </div>
          <span className="sidebar-logo-text" style={{ fontSize: '15px' }}>CineBook</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-ghost btn-icon"
          style={{ borderRadius: '12px' }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar 
        onSearchClick={onSearchClick} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;

