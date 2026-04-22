import React from 'react';
import { Film, Type, Star, Clock, FileText, Save, Calendar } from 'lucide-react';

const MovieForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = React.useState({
    movieName: '',
    genre: 'ACTION',
    rating: 0,
    description: '',
    duration: 120,
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'rating' || name === 'duration' ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Type size={14} /> Official Movie Title
          </label>
          <input 
            type="text" 
            name="movieName" 
            value={formData.movieName} 
            onChange={handleChange} 
            className="form-input"
            required 
            placeholder="e.g. Inception"
          />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Film size={14} /> Genre / Category
          </label>
          <select 
            name="genre" 
            value={formData.genre} 
            onChange={handleChange}
            className="form-input"
          >
            <option value="ACTION">Action</option>
            <option value="COMEDY">Comedy</option>
            <option value="DRAMA">Drama</option>
            <option value="THRILLER">Thriller</option>
            <option value="HORROR">Horror</option>
            <option value="SCI_FI">Sci-Fi</option>
            <option value="ROMANCE">Romance</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Star size={14} /> Critic Rating (0-10)
          </label>
          <div className="form-input-icon">
            <Star size={16} className="input-icon" />
            <input 
              type="number" 
              name="rating" 
              step="0.1" 
              min="0" 
              max="10"
              value={formData.rating} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Clock size={14} /> Total Duration (min)
          </label>
          <div className="form-input-icon">
            <Clock size={16} className="input-icon" />
            <input 
              type="number" 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Calendar size={14} /> Release Year / Date
          </label>
          <div className="form-input-icon">
            <Calendar size={16} className="input-icon" />
            <input 
              type="text" 
              name="releaseDate" 
              value={formData.releaseDate || ''} 
              onChange={handleChange} 
              className="form-input"
              placeholder="e.g. 2024-05-15"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Film size={14} /> Poster URL (Image)
          </label>
          <div className="form-input-icon">
            <Film size={16} className="input-icon" />
            <input 
              type="text" 
              name="imgUrl" 
              value={formData.imgUrl || ''} 
              onChange={handleChange} 
              className="form-input"
              placeholder="https://image-posters.com/poster.jpg"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <FileText size={14} /> Plot Synopsis & Description
        </label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          rows="4"
          className="form-input"
          style={{ resize: 'none' }}
          required 
          placeholder="Enter a brief plot overview for the movie catalog..."
        />
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full shadow-lg">
          {loading ? <span className="spinner spinner-sm" /> : <><Save size={18} /> Save Title Data</>}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
