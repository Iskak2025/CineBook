import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-accent">
          <Film size={32} />
          <span>CineBook</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          
          <button onClick={toggleTheme} className="p-2 hover:bg-glass-border rounded-full transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-1 hover:text-accent">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-1 hover:text-accent">
                <User size={18} />
                <span>{user?.username}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-error hover:opacity-80 transition-opacity"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-accent">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
