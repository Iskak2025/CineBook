import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getTopRatedMovies, getNowPlayingMovies } from '../services/api';
import { Play, Info, Star, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MovieCard = ({ movie, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
  >
    <Link to={`/movies/${movie.id}`} className="movie-card block group">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-white/5">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
             <p className="text-white font-bold text-sm truncate">{movie.title}</p>
             <p className="text-white/60 text-xs">{new Date(movie.release_date).getFullYear()}</p>
          </div>
        </div>
        <div className="movie-card-rating">
          <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
        </div>
      </div>
    </Link>
  </motion.div>
);

const Section = ({ title, movies, loading }) => (
  <section className="section py-12">
    <div className="section-header mb-8">
      <h2 className="section-title text-2xl font-extrabold flex items-center gap-3">
        {title} <ChevronRight className="text-primary" size={20} />
      </h2>
      <Link to="/" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors">See Recommended</Link>
    </div>
    {loading ? (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] w-48 bg-elevated rounded-2xl animate-pulse" />
        ))}
      </div>
    ) : (
      <div className="movie-grid">
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>
    )}
  </section>
);

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, tr, np] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies()
        ]);
        setTrending(t.data.results?.slice(0, 12) || []);
        setTopRated(tr.data.results?.slice(0, 12) || []);
        setNowPlaying(np.data.results?.slice(0, 12) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!trending.length) return;
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % Math.min(5, trending.length)), 8000);
    return () => clearInterval(timer);
  }, [trending]);

  if (loading && trending.length === 0) return (
    <div className="loading-page">
      <div className="spinner" />
      <p className="text-secondary text-sm">Crafting your cinema experience...</p>
    </div>
  );

  const hero = trending[heroIdx];

  return (
    <div className="space-y-4">
      <section className="hero" style={{ height: '75vh' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-bg"
          >
            <img
              src={`https://image.tmdb.org/t/p/original${hero?.backdrop_path}`}
              alt="Hero Backdrop"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="hero-content pb-20">
          <motion.div
            key={`content-${heroIdx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="hero-badge bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 inline-block">
              Highly Expected
            </div>
            <h1 className="hero-title text-6xl font-black mb-6 leading-tight drop-shadow-2xl">
              {hero?.title}
            </h1>
            <div className="hero-meta flex items-center gap-6 mb-8">
              <div className="hero-rating flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-gold border border-gold/20">
                <Star size={16} fill="currentColor" />
                <span className="font-black">{hero?.vote_average?.toFixed(1)}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-bold">
                {new Date(hero?.release_date).getFullYear()}
              </div>
            </div>
            <p className="hero-desc text-lg line-clamp-3 mb-10 text-white/80 max-w-2xl leading-relaxed">
              {hero?.overview}
            </p>
            <div className="hero-actions flex gap-4">
              <Link to={`/movies/${hero?.id}`} className="btn btn-primary btn-lg px-10 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                <Play size={20} fill="currentColor" /> Book Experience
              </Link>
              <Link to={`/movies/${hero?.id}`} className="btn btn-secondary btn-lg px-10 rounded-2xl backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all">
                <Info size={20} /> Details
              </Link>
            </div>
          </motion.div>

          <div className="hero-dots mt-12">
            {trending.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`hero-dot ${i === heroIdx ? 'active' : ''} transition-all duration-300`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="container px-8">
        <Section title="Trending Movies" movies={trending} loading={loading} />
        <Section title="Highest Rated" movies={topRated} loading={loading} />
        <Section title="Now In Theaters" movies={nowPlaying} loading={loading} />
      </div>
    </div>
  );
}
