import Movie from '../models/Movie.js';

// GET /api/movies
export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = { isActive: true };

    if (genre && genre !== 'all') query.genre = { $in: [genre] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {}; sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [movies, total] = await Promise.all([
      Movie.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Movie.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalMovies: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching movies', error: e.message });
  }
};

// GET /api/movies/:id
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.isActive) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.status(200).json({ success: true, data: movie });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching movie', error: e.message });
  }
};

// POST /api/movies
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const saved = await movie.save();
    res.status(201).json({ success: true, message: 'Movie created', data: saved });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Error creating movie', error: e.message });
  }
};

// PUT /api/movies/:id
export const updateMovie = async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.status(200).json({ success: true, message: 'Movie updated', data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Error updating movie', error: e.message });
  }
};

// DELETE (soft) /api/movies/:id
export const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!deleted) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.status(200).json({ success: true, message: 'Movie deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error deleting movie', error: e.message });
  }
};
