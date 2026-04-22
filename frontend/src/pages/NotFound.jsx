import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in duration-1000">
            <h1 className="text-[120px] font-black text-accent opacity-20">404</h1>
            <div className="space-y-4">
                <h2 className="text-4xl font-bold">Lost in Space?</h2>
                <p className="text-secondary text-xl">The page you're looking for doesn't exist or has been moved.</p>
            </div>
            <div className="flex gap-4">
                <Link to="/" className="btn-primary flex items-center gap-2 px-8 py-3">
                    <Home size={18} /> Back to Home
                </Link>
                <Link to="/movies" className="glass flex items-center gap-2 px-8 py-3 hover:bg-glass-border">
                    <Search size={18} /> Explore Movies
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
