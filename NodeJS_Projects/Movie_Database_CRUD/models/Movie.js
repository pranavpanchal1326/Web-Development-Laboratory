import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: 200
  },
  director: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true,
    maxlength: 100
  },
  genre: [{
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
      'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
    ]
  }],
  releaseYear: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear() + 5
  },
  duration: { type: Number, required: true, min: 1 },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  plot: { type: String, trim: true, maxlength: 1000 },
  language: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  posterUrl: { type: String, default: '/images/default-poster.jpg' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseYear: -1 });
movieSchema.index({ rating: -1 });

export default mongoose.model('Movie', movieSchema);
