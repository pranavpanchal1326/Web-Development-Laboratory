/* =========================
   Hollywood Movies Frontend
   Error-free version
   ========================= */

/* API Configuration */
const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  movies: API_BASE_URL + '/movies',
  movie: id => API_BASE_URL + '/movies/' + id
};

/* Global State */
let movies = [];
let currentEditingId = null;
let movieToDelete = null;

/* DOM Elements (guarded) */
const $ = id => document.getElementById(id);
const elements = {
  moviesGrid: $('moviesGrid'),
  movieCount: $('movieCount'),
  loadingState: $('loadingState'),
  emptyState: $('emptyState'),
  searchInput: $('searchInput'),
  genreFilter: $('genreFilter'),
  movieModal: $('movieModal'),
  deleteModal: $('deleteModal'),
  movieForm: $('movieForm'),
  toast: $('toast')
};

/* Init */
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
  setupEventListeners();
});

/* App Initialization */
async function initializeApp() {
  showLoading();
  await loadMovies();
  hideLoading();
}

/* Event Listeners */
function setupEventListeners() {
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
  if (elements.genreFilter) {
    elements.genreFilter.addEventListener('change', handleFilter);
  }
  if (elements.movieForm) {
    elements.movieForm.addEventListener('submit', handleSubmit);
  }
  if (elements.movieModal) {
    elements.movieModal.addEventListener('click', function (e) {
      if (e.target === elements.movieModal) closeModal();
    });
  }
  if (elements.deleteModal) {
    elements.deleteModal.addEventListener('click', function (e) {
      if (e.target === elements.deleteModal) closeDeleteModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeDeleteModal();
    }
  });
}

/* API Helper */
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    // Attempt to parse JSON safely
    let data = null;
    try {
      data = await response.json();
    } catch {
      // Non-JSON response
      data = null;
    }

    if (!response.ok) {
      const msg = data && data.message ? data.message : 'HTTP ' + response.status;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    showToast(error.message || 'Network error occurred', 'error');
    throw error;
  }
}

/* Load Movies */
async function loadMovies() {
  try {
    const response = await apiCall(API_ENDPOINTS.movies);
    movies = (response && response.data) || [];
    renderMovies();
    updateMovieCount();
  } catch (error) {
    showEmptyState();
  }
}

/* CRUD */
async function createMovie(movieData) {
  return apiCall(API_ENDPOINTS.movies, {
    method: 'POST',
    body: JSON.stringify(movieData)
  });
}

async function updateMovie(id, movieData) {
  return apiCall(API_ENDPOINTS.movie(id), {
    method: 'PUT',
    body: JSON.stringify(movieData)
  });
}

async function deleteMovieApi(id) {
  return apiCall(API_ENDPOINTS.movie(id), {
    method: 'DELETE'
  });
}

/* Render */
function renderMovies(moviesToRender = movies) {
  const container = elements.moviesGrid;
  if (!container) return;

  if (!moviesToRender || moviesToRender.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  container.innerHTML = moviesToRender.map(createMovieCard).join('');

  // Attach actions
  container.querySelectorAll('.btn-edit').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const idAttr = (e.target.closest('.btn-edit') || btn).getAttribute('data-id');
      const movieId = parseInt(idAttr, 10);
      editMovie(movieId);
    });
  });

  container.querySelectorAll('.btn-delete').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const el = e.target.closest('.btn-delete') || btn;
      const movieId = parseInt(el.getAttribute('data-id'), 10);
      const movieTitle = el.getAttribute('data-title') || '';
      showDeleteModal(movieId, movieTitle);
    });
  });
}

/* Card Template (matches mesmerizing CSS) */
function createMovieCard(movie) {
  const rating =
    movie && typeof movie.rating === 'number'
      ? Number(movie.rating).toFixed(1)
      : 'N/A';

  return (
    '<div class="card" data-id="' + movie.id + '">' +
    '  <div class="card-head">' +
    '    <div>' +
    '      <h3>' + escapeHtml(movie.title) + '</h3>' +
    '      <div class="year">' + escapeHtml(String(movie.year)) + '</div>' +
    '    </div>' +
    '    <div class="actions">' +
    '      <button class="ico edit btn-edit" data-id="' + movie.id + '" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>' +
    '      <button class="ico del btn-delete" data-id="' + movie.id + '" data-title="' + escapeHtml(movie.title) + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
    '    </div>' +
    '  </div>' +
    '  <div class="info">' +
    '    <div class="tag"><small>Director</small><strong>' + escapeHtml(movie.director) + '</strong></div>' +
    '    <div class="tag"><small>Genre</small><strong>' + escapeHtml(movie.genre) + '</strong></div>' +
    '  </div>' +
    '  <div class="rate"><i class="fa-solid fa-star"></i>' + rating + '/10</div>' +
    '</div>'
  );
}

/* Modal Controls */
function openAddModal() {
  currentEditingId = null;
  const titleEl = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitBtn');
  if (titleEl) titleEl.textContent = 'Add New Movie';
  if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Movie';
  clearForm();
  showModal();
}

function editMovie(id) {
  const movie = movies.find(m => m.id === id);
  if (!movie) return;

  currentEditingId = id;
  const titleEl = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitBtn');
  if (titleEl) titleEl.textContent = 'Edit Movie';
  if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Movie';

  setValue('movieTitle', movie.title);
  setValue('movieYear', movie.year);
  setValue('movieDirector', movie.director);
  setValue('movieGenre', movie.genre);
  setValue('movieRating', movie.rating != null ? movie.rating : '');

  showModal();
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function showModal() {
  if (!elements.movieModal) return;
  elements.movieModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(function () {
    const first = document.getElementById('movieTitle');
    if (first) first.focus();
  }, 250);
}

function closeModal() {
  if (!elements.movieModal) return;
  elements.movieModal.classList.remove('show');
  document.body.style.overflow = '';
  currentEditingId = null;
  clearForm();
}

function showDeleteModal(id, title) {
  movieToDelete = id;
  const span = document.getElementById('deleteMovieTitle');
  if (span) span.textContent = title || '';
  if (elements.deleteModal) {
    elements.deleteModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeDeleteModal() {
  if (!elements.deleteModal) return;
  elements.deleteModal.classList.remove('show');
  document.body.style.overflow = '';
  movieToDelete = null;
}

/* Form Handling */
async function handleSubmit(e) {
  e.preventDefault();

  const formData = getFormData();
  if (!validateForm(formData)) return;

  const submitBtn = document.getElementById('submitBtn');
  const original = submitBtn ? submitBtn.innerHTML : null;

  try {
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      submitBtn.disabled = true;
    }

    if (currentEditingId) {
      await updateMovie(currentEditingId, formData);
      showToast('Movie updated successfully!', 'success');
    } else {
      await createMovie(formData);
      showToast('Movie added successfully!', 'success');
    }

    closeModal();
    await loadMovies();
  } catch {
    // handled in apiCall
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = original || 'Save';
      submitBtn.disabled = false;
    }
  }
}

function getFormData() {
  return {
    title: (getValue('movieTitle') || '').trim(),
    year: parseInt(getValue('movieYear') || '0', 10),
    director: (getValue('movieDirector') || '').trim(),
    genre: getValue('movieGenre') || '',
    rating: (function () {
      const val = getValue('movieRating');
      if (val === '' || val == null) return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    })()
  };
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function validateForm(data) {
  const errors = [];
  if (!data.title) errors.push('Title is required');
  if (!data.year || data.year < 1900 || data.year > 2035) errors.push('Valid year is required');
  if (!data.director) errors.push('Director is required');
  if (!data.genre) errors.push('Genre is required');
  if (data.rating !== null && (data.rating < 0 || data.rating > 10)) {
    errors.push('Rating must be between 0 and 10');
  }
  if (errors.length) {
    showToast(errors.join(', '), 'error');
    return false;
  }
  return true;
}

function clearForm() {
  if (elements.movieForm) elements.movieForm.reset();
}

/* Delete */
async function confirmDelete() {
  if (!movieToDelete) return;

  // Match the new delete button class "btn danger"
  const deleteBtn = document.querySelector('#deleteModal .btn.danger');
  const original = deleteBtn ? deleteBtn.innerHTML : null;

  try {
    if (deleteBtn) {
      deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
      deleteBtn.disabled = true;
    }
    await deleteMovieApi(movieToDelete);
    showToast('Movie deleted successfully!', 'success');
    closeDeleteModal();
    await loadMovies();
  } catch {
    // handled in apiCall
  } finally {
    if (deleteBtn) {
      deleteBtn.innerHTML = original || 'Delete';
      deleteBtn.disabled = false;
    }
  }
}

/* Search & Filter */
function handleSearch() {
  const term = (elements.searchInput ? elements.searchInput.value : '').toLowerCase().trim();
  const genre = elements.genreFilter ? elements.genreFilter.value : '';
  filterMovies(term, genre);
}

function handleFilter() {
  const term = (elements.searchInput ? elements.searchInput.value : '').toLowerCase().trim();
  const genre = elements.genreFilter ? elements.genreFilter.value : '';
  filterMovies(term, genre);
}

function filterMovies(searchTerm, genre) {
  let list = movies.slice();

  if (searchTerm) {
    list = list.filter(function (m) {
      return (
        String(m.title).toLowerCase().includes(searchTerm) ||
        String(m.director).toLowerCase().includes(searchTerm) ||
        String(m.genre).toLowerCase().includes(searchTerm)
      );
    });
  }

  if (genre) {
    list = list.filter(function (m) {
      return String(m.genre).toLowerCase() === String(genre).toLowerCase();
    });
  }

  renderMovies(list);
  updateMovieCount(list.length);
}

/* UI State */
function showLoading() {
  if (elements.loadingState) elements.loadingState.style.display = 'block';
  if (elements.moviesGrid) elements.moviesGrid.style.display = 'none';
  if (elements.emptyState) elements.emptyState.style.display = 'none';
}

function hideLoading() {
  if (elements.loadingState) elements.loadingState.style.display = 'none';
  if (elements.moviesGrid) elements.moviesGrid.style.display = 'grid';
}

function showEmptyState() {
  if (elements.emptyState) elements.emptyState.style.display = 'block';
  if (elements.moviesGrid) elements.moviesGrid.style.display = 'none';
  if (elements.loadingState) elements.loadingState.style.display = 'none';
  updateMovieCount(0);
}

function hideEmptyState() {
  if (elements.emptyState) elements.emptyState.style.display = 'none';
  if (elements.moviesGrid) elements.moviesGrid.style.display = 'grid';
}

function updateMovieCount(count) {
  const c = typeof count === 'number' ? count : movies.length;
  if (elements.movieCount) {
    elements.movieCount.textContent = c + ' movie' + (c !== 1 ? 's' : '');
  }
}

/* Toasts */
function showToast(message, type) {
  const toast = elements.toast;
  if (!toast) return;

  const icon = toast.querySelector('.toast-icon');
  const msg = toast.querySelector('.toast-msg'); // matches mesmerizing HTML
  if (msg) msg.textContent = message;

  // reset base class then add type
  toast.className = 'toast' + (type ? ' ' + type : ' success');

  if (icon) {
    if (type === 'error') icon.className = 'toast-icon fa-solid fa-circle-exclamation';
    else icon.className = 'toast-icon fa-solid fa-circle-check';
  }

  // progress bar restart
  const bar = toast.querySelector('.t-progress');
  if (bar) {
    bar.style.animation = 'none';
    // force reflow
    void bar.offsetWidth;
    bar.style.animation = '';
    bar.style.animation = 'prog 4s linear forwards';
  }

  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 4000);
}

/* Utils */
function debounce(fn, wait) {
  let t;
  return function () {
    clearTimeout(t);
    const args = arguments;
    t = setTimeout(function () {
      fn.apply(null, args);
    }, wait);
  };
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/* Global exposure for inline handlers */
window.openAddModal = openAddModal;
window.closeModal = closeModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;

/* Network handlers */
window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('An unexpected error occurred. Please try again.', 'error');
  event.preventDefault();
});

window.addEventListener('online', function () {
  showToast('Connection restored!', 'success');
});

window.addEventListener('offline', function () {
  showToast('No internet connection', 'error');
});

/* Dev helpers (optional) */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  window.moviesApp = { movies, elements, loadMovies, renderMovies, showToast };
}
