import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Film, Home, List, Bookmark, User, LogOut, Settings, Shield, Search, Moon, Sun, ChevronRight, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, icon: Icon, label, badge }) => (
  <NavLink to={to} end={to === '/'}>
    {({ isActive }) => (
      <span className={`nav-item${isActive ? ' active' : ''}`}>
        <Icon size={17} className="nav-icon" />
        <span>{label}</span>
        {badge && <span className="badge badge-red" style={{ marginLeft: 'auto', fontSize: '10px' }}>{badge}</span>}
      </span>
    )}
  </NavLink>
);

const Sidebar = ({ onSearchClick, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="sidebar-logo-icon">
            <Film size={18} color="white" />
          </div>
          <div>
            <p className="sidebar-logo-text">CineBook</p>
            <p className="sidebar-logo-sub">Movie Booking</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Browse</p>
        <NavItem to="/" icon={Home} label="Home" />
        <button className="nav-item" style={{ width: '100%' }} onClick={onSearchClick}>
          <Search size={17} className="nav-icon" />
          <span>Search Movie</span>
        </button>
        <NavItem to="/watchlist" icon={Bookmark} label="My Watchlist" />

        {user && (
          <>
            <p className="sidebar-section-label">Account</p>
            <NavItem to="/my-bookings" icon={Ticket} label="My Bookings" />
            <NavItem to="/profile" icon={Settings} label="Profile" />
            {user.role?.toUpperCase() === 'ADMIN' && (
              <NavItem to="/admin" icon={Shield} label="Admin Panel" />
            )}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button className="nav-item" style={{ width: '100%' }} onClick={onSearchClick}>
          <Search size={17} className="nav-icon" />
          <span>Search Movies</span>
          <kbd className="kbd">Ctrl+K</kbd>
        </button>

        <button className="nav-item" style={{ width: '100%' }} onClick={toggleTheme}>
          {theme === 'dark'
            ? <Sun size={17} className="nav-icon" />
            : <Moon size={17} className="nav-icon" />
          }
          <span>Switch Theme</span>
        </button>

        <div className="divider" style={{ margin: '8px 0' }} />

        {user ? (
          <>
            <div className="sidebar-user">
              <p className="sidebar-user-name">{user.username}</p>
              <p className="sidebar-user-role">{user.role?.toLowerCase() || 'user'}</p>
            </div>
            <button className="nav-item nav-item-danger" style={{ width: '100%' }} onClick={logout}>
              <LogOut size={17} />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <NavLink to="/login">
            {({ isActive }) => (
              <span className={`nav-item${isActive ? ' active' : ''}`}>
                <User size={17} className="nav-icon" />
                <span>Log In</span>
              </span>
            )}
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
