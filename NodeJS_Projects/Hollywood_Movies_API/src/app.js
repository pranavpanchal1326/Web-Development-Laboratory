import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// ES6 module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎬 In-memory database - Array to store movies
let movies = [
  {
    id: 1,
    title: 'The Dark Knight',
    year: 2008,
    director: 'Christopher Nolan',
    genre: 'Action',
    rating: 9.0,
  },
  {
    id: 2,
    title: 'Pulp Fiction',
    year: 1994,
    director: 'Quentin Tarantino',
    genre: 'Crime',
    rating: 8.9,
  },
  {
    id: 3,
    title: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
    genre: 'Drama',
    rating: 9.3,
  },
];

let nextId = 4;

// 🎨 Beautiful middleware setup
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🎨 Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// 📚 Input validation middleware
const validateMovieInput = (req, res, next) => {
  const { title, year, director, genre, rating } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (
    !year ||
    typeof year !== 'number' ||
    year < 1900 ||
    year > new Date().getFullYear() + 5
  ) {
    errors.push(
      'Year is required and must be a valid number between 1900 and ' +
        (new Date().getFullYear() + 5)
    );
  }

  if (
    !director ||
    typeof director !== 'string' ||
    director.trim().length === 0
  ) {
    errors.push('Director is required and must be a non-empty string');
  }

  if (!genre || typeof genre !== 'string' || genre.trim().length === 0) {
    errors.push('Genre is required and must be a non-empty string');
  }

  if (
    rating !== undefined &&
    (typeof rating !== 'number' || rating < 0 || rating > 10)
  ) {
    errors.push('Rating must be a number between 0 and 10');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors,
    });
  }

  next();
};

// 🔍 Helper function to find movie by ID
const findMovieById = id => {
  return movies.find(movie => movie.id === parseInt(id));
};

// 🎬 Frontend Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 🎬 API Routes

// GET /movies - Fetch all movies
app.get('/movies', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// GET /movies/:id - Fetch a specific movie by ID
app.get('/movies/:id', (req, res) => {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID format',
      });
    }

    const movie = findMovieById(movieId);

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: `Movie with ID ${movieId} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// POST /movies - Add a new movie
app.post('/movies', validateMovieInput, (req, res) => {
  try {
    const { title, year, director, genre, rating } = req.body;

    // Check for duplicate titles
    const existingMovie = movies.find(
      movie =>
        movie.title.toLowerCase() === title.toLowerCase() && movie.year === year
    );

    if (existingMovie) {
      return res.status(409).json({
        status: 'error',
        message: `Movie "${title}" (${year}) already exists`,
      });
    }

    const newMovie = {
      id: nextId++,
      title: title.trim(),
      year,
      director: director.trim(),
      genre: genre.trim(),
      rating: rating || null,
    };

    movies.push(newMovie);

    res.status(201).json({
      status: 'success',
      message: 'Movie created successfully',
      data: newMovie,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// PUT /movies/:id - Update/replace an existing movie
app.put('/movies/:id', validateMovieInput, (req, res) => {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID format',
      });
    }

    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: `Movie with ID ${movieId} not found`,
      });
    }

    const { title, year, director, genre, rating } = req.body;

    const updatedMovie = {
      id: movieId,
      title: title.trim(),
      year,
      director: director.trim(),
      genre: genre.trim(),
      rating: rating || null,
    };

    movies[movieIndex] = updatedMovie;

    res.status(200).json({
      status: 'success',
      message: 'Movie updated successfully',
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// PATCH /movies/:id - Partially update movie details
app.patch('/movies/:id', (req, res) => {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID format',
      });
    }

    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: `Movie with ID ${movieId} not found`,
      });
    }

    const { title, year, director, genre, rating } = req.body;
    const currentMovie = movies[movieIndex];

    // Update only provided fields
    const updatedMovie = {
      ...currentMovie,
      ...(title !== undefined && { title: title.trim() }),
      ...(year !== undefined && { year }),
      ...(director !== undefined && { director: director.trim() }),
      ...(genre !== undefined && { genre: genre.trim() }),
      ...(rating !== undefined && { rating }),
    };

    movies[movieIndex] = updatedMovie;

    res.status(200).json({
      status: 'success',
      message: 'Movie updated successfully',
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// DELETE /movies/:id - Delete a movie by ID
app.delete('/movies/:id', (req, res) => {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID format',
      });
    }

    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: `Movie with ID ${movieId} not found`,
      });
    }

    const deletedMovie = movies.splice(movieIndex, 1)[0];

    res.status(200).json({
      status: 'success',
      message: 'Movie deleted successfully',
      data: deletedMovie,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// 💚 Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 🚫 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

// 🚀 Start server with beautiful logging
app.listen(PORT, () => {
  console.log(`
  🎬 Hollywood Movies API & Frontend
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Frontend: http://localhost:${PORT}
  📚 API: http://localhost:${PORT}/movies
  💚 Health: http://localhost:${PORT}/health
  🔧 Environment: ${process.env.NODE_ENV || 'development'}
  ⏰ Started: ${new Date().toLocaleString()}
  
  🎯 Available Features:
     ✨ Beautiful Movie Management UI
     📱 Responsive Design
     🔍 Search & Filter Movies
     ➕ Add New Movies
     ✏️  Edit Existing Movies
     🗑️  Delete Movies
     🎨 Modern Dark Theme
  `);
});

export default app;
