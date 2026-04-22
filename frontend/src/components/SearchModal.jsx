import React, { useState, useEffect } from 'react';
import { Search, X, Star, Bookmark, Play, ChevronRight, History, TrendingUp, Compass, Film, Clapperboard, MousePointer2 } from 'lucide-react';
import { searchTmdbMovies } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await searchTmdbMovies(query);
                setResults(response.data.results?.slice(0, 8) || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="search-box" 
                onClick={e => e.stopPropagation()}
            >
                <div className="search-input-row" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <Search size={22} className="text-muted" />
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Search for movies, genres, or directors..." 
                        className="search-input font-bold"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        {query && (
                             <button onClick={() => setQuery('')} className="btn-icon btn-ghost" style={{ borderRadius: '50%' }}>
                                <X size={16} />
                             </button>
                        )}
                        <kbd className="kbd">ESC</kbd>
                    </div>
                </div>

                <div className="search-results thin-scrollbar">
                    <AnimatePresence mode="wait">
                        {!query && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="search-empty"
                            >
                                <Compass size={48} className="mx-auto opacity-10 mb-4" />
                                <h3 className="section-title text-muted" style={{ fontWeight: 800 }}>Universal Discovery</h3>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Search the complete CineBook repository</p>
                                <div className="flex justify-center gap-3 mt-8">
                                    <span className="badge badge-gray flex items-center gap-1"><History size={12} /> Recent</span>
                                    <span className="badge badge-gray flex items-center gap-1"><TrendingUp size={12} /> Popular</span>
                                    <span className="badge badge-gray flex items-center gap-1"><Film size={12} /> Classic</span>
                                </div>
                            </motion.div>
                        )}

                        {loading ? (
                             <div className="search-empty animate-pulse">
                                <div className="spinner spinner-sm mx-auto mb-4" />
                                <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Synchronizing signals...</p>
                             </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] px-4 py-3 border-b border-[var(--border)]">System Results ({results.length})</p>
                                {results.map((movie, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={movie.id}
                                    >
                                        <Link 
                                            to={`/movies/${movie.id}`} 
                                            onClick={onClose}
                                            className="search-result-item group"
                                        >
                                            <div className="search-result-poster shadow-lg">
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                                    className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-300"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="search-result-title group-hover:text-primary-color transition-colors">{movie.title}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="badge badge-gray font-bold italic">{new Date(movie.release_date).getFullYear() || 'N/A'}</span>
                                                    <div className="flex items-center gap-1 text-gold text-xs font-black">
                                                        <Star size={12} fill="currentColor" /> {movie.vote_average.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : query && (
                             <div className="search-empty">
                                <h3 className="section-title text-muted">No Frequencies Matched</h3>
                                <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">The collection does not contain your query.</p>
                             </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default SearchModal;
