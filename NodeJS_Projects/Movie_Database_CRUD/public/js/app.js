class MovieApp {
  constructor() {
    this.currentPage = 1;
    this.currentGenre = 'all';
    this.searchQuery = '';
    this.editingMovieId = null;

    // Themes: light → dark → retro
    this.themes = ['light', 'dark', 'retro'];

    this.initializeElements();
    this.bindEvents();
    this.applySavedTheme();
    this.loadMovies();
  }

  initializeElements() {
    // Modal elements
    this.modal = document.getElementById('movieModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.movieForm = document.getElementById('movieForm');
    this.addMovieBtn = document.getElementById('addMovieBtn');
    this.modalClose = document.getElementById('modalClose');
    this.cancelBtn = document.getElementById('cancelBtn');

    // Search and filter
    this.searchInput = document.getElementById('searchInput');
    this.genreFilter = document.getElementById('genreFilter');

    // Display elements
    this.moviesGrid = document.getElementById('moviesGrid');
    this.loading = document.getElementById('loading');
    this.pagination = document.getElementById('pagination');
    this.notification = document.getElementById('notification');
    this.notificationText = document.getElementById('notificationText');
    this.emptyState = document.getElementById('emptyState');

    // Theme controls (exist only in upgraded HTML)
    this.themeToggle = document.getElementById('themeToggle');
    this.themePrev = document.getElementById('themePrev');
    this.themeNext = document.getElementById('themeNext');
  }

  bindEvents() {
    // Modal events
    this.addMovieBtn.addEventListener('click', () => this.openModal());
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.cancelBtn.addEventListener('click', () => this.closeModal());
    this.movieForm.addEventListener('submit', (e) => this.handleSubmit(e));

    // Search and filter events
    this.searchInput.addEventListener('input', this.debounce(() => this.handleSearch(), 300));
    this.genreFilter.addEventListener('change', () => this.handleFilter());

    // Close modal on outside click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) this.closeModal();
    });

    // Theme controls (guard if not present)
    if (this.themeToggle) this.themeToggle.addEventListener('click', () => this.cycleTheme(1));
    if (this.themePrev) this.themePrev.addEventListener('click', () => this.cycleTheme(-1));
    if (this.themeNext) this.themeNext.addEventListener('click', () => this.cycleTheme(1));
  }

  // =====================
  // Theme handling
  // =====================
  applySavedTheme() {
    const saved = localStorage.getItem('mv-theme');
    let theme = saved;
    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    if (!this.themes.includes(theme)) theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeIcon(theme);
  }

  cycleTheme(step = 1) {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const idx = this.themes.indexOf(current);
    const next = this.themes[(idx + step + this.themes.length) % this.themes.length];
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mv-theme', next);
    this.updateThemeIcon(next);
  }

  updateThemeIcon(theme) {
    if (!this.themeToggle) return;
    const icon = this.themeToggle.querySelector('i');
    if (!icon) return;
    icon.className = theme === 'light' ? 'fas fa-moon' : theme === 'dark' ? 'fas fa-sun' : 'fas fa-bolt';
  }

  // =====================
  // Utilities
  // =====================
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  escapeHtml(text = '') {
    return text.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }

  // =====================
  // Data loading/render
  // =====================
  async loadMovies() {
    try {
      this.showLoading();

      const params = new URLSearchParams({
        page: this.currentPage,
        limit: 12,
        ...(this.currentGenre !== 'all' && { genre: this.currentGenre }),
        ...(this.searchQuery && { search: this.searchQuery })
      });

      const response = await fetch(`/api/movies?${params}`);
      const data = await response.json();

      if (data.success) {
        this.renderMovies(data.data || []);
        this.renderPagination(data.pagination);
        if (this.emptyState) this.emptyState.hidden = (data.data || []).length !== 0;
      } else {
        this.renderMovies([]);
        this.showNotification('Error loading movies', 'error');
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      this.renderMovies([]);
      this.showNotification('Failed to load movies', 'error');
    } finally {
      this.hideLoading();
    }
  }

  renderMovies(movies) {
    if (!Array.isArray(movies) || movies.length === 0) {
      this.moviesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-film"></i>
          <h3>No movies found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }

    this.moviesGrid.innerHTML = movies.map((movie, i) => `
      <div class="movie-card" data-id="${movie._id}" style="animation:cardIn .38s cubic-bezier(.16,1,.3,1) both; animation-delay:${i * 60}ms;">
        <div class="movie-header">
          <div>
            <h3 class="movie-title">${this.escapeHtml(movie.title)}</h3>
            <p class="movie-director">Directed by ${this.escapeHtml(movie.director)}</p>
          </div>
          <div class="movie-actions">
            <button class="btn-icon btn-edit" onclick="app.editMovie('${movie._id}')" title="Edit Movie">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="app.deleteMovie('${movie._id}')" title="Delete Movie">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="movie-genre">${(movie.genre || []).join(', ')}</div>

        <div class="movie-meta">
          <div class="movie-meta-item">
            <i class="fas fa-calendar"></i>
            <span>${movie.releaseYear}</span>
          </div>
          <div class="movie-meta-item">
            <i class="fas fa-clock"></i>
            <span>${movie.duration} min</span>
          </div>
          ${movie.rating > 0 ? `
            <div class="movie-meta-item movie-rating">
              <i class="fas fa-star"></i>
              <span>${movie.rating}/10</span>
            </div>
          ` : ''}
        </div>

        ${movie.plot ? `<p class="movie-plot">${this.escapeHtml(movie.plot)}</p>` : ''}
      </div>
    `).join('');
  }

  renderPagination(paginationData) {
    if (!paginationData) { this.pagination.innerHTML = ''; return; }

    const { currentPage = 1, totalPages = 1, hasPrevPage = false, hasNextPage = false } = paginationData;

    let paginationHTML = `
      <button ${!hasPrevPage ? 'disabled' : ''} onclick="app.goToPage(${currentPage - 1})" aria-label="Previous page">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="${i === currentPage ? 'active' : ''}" onclick="app.goToPage(${i})" aria-label="Page ${i}">
          ${i}
        </button>
      `;
    }

    paginationHTML += `
      <button ${!hasNextPage ? 'disabled' : ''} onclick="app.goToPage(${currentPage + 1})" aria-label="Next page">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    this.pagination.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.loadMovies();
  }

  handleSearch() {
    this.searchQuery = this.searchInput.value.trim();
    this.currentPage = 1;
    this.loadMovies();
  }

  handleFilter() {
    this.currentGenre = this.genreFilter.value;
    this.currentPage = 1;
    this.loadMovies();
  }

  openModal(movie = null) {
    this.editingMovieId = movie ? movie._id : null;
    this.modalTitle.textContent = movie ? 'Edit Movie' : 'Add Movie';

    if (movie) this.populateForm(movie);
    else this.movieForm.reset();

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // focus title for fast entry
    setTimeout(() => {
      const titleField = document.getElementById('title');
      if (titleField) titleField.focus();
    }, 10);
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.movieForm.reset();
    this.editingMovieId = null;
  }

  populateForm(movie) {
    const form = this.movieForm;
    form.title.value = movie.title || '';
    form.director.value = movie.director || '';
    form.genre.value = (movie.genre && movie.genre[0]) || '';
    form.releaseYear.value = movie.releaseYear || '';
    form.duration.value = movie.duration || '';
    form.rating.value = movie.rating || '';
    form.language.value = movie.language || '';
    form.country.value = movie.country || '';
    form.plot.value = movie.plot || '';
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.movieForm);
    const movieData = {
      title: formData.get('title'),
      director: formData.get('director'),
      genre: [formData.get('genre')],
      releaseYear: parseInt(formData.get('releaseYear')),
      duration: parseInt(formData.get('duration')),
      rating: parseFloat(formData.get('rating')) || 0,
      language: formData.get('language'),
      country: formData.get('country'),
      plot: formData.get('plot')
    };

    try {
      const url = this.editingMovieId ? `/api/movies/${this.editingMovieId}` : '/api/movies';
      const method = this.editingMovieId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();

      if (data.success) {
        this.showNotification(`Movie ${this.editingMovieId ? 'updated' : 'created'} successfully!`);
        this.closeModal();
        this.loadMovies();
      } else {
        this.showNotification(data.message || 'Error saving movie', 'error');
      }
    } catch (error) {
      console.error('Error saving movie:', error);
      this.showNotification('Failed to save movie', 'error');
    }
  }

  async editMovie(id) {
    try {
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();

      if (data.success) this.openModal(data.data);
      else this.showNotification('Error loading movie data', 'error');
    } catch (error) {
      console.error('Error loading movie:', error);
      this.showNotification('Failed to load movie data', 'error');
    }
  }

  async deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      const response = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        this.showNotification('Movie deleted successfully!');
        this.loadMovies();
      } else {
        this.showNotification(data.message || 'Error deleting movie', 'error');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      this.showNotification('Failed to delete movie', 'error');
    }
  }

  showNotification(message, type = 'success') {
    this.notificationText.textContent = message;
    this.notification.className = `notification ${type}`;
    this.notification.classList.add('show');

    setTimeout(() => this.notification.classList.remove('show'), 3000);
  }

  showLoading() {
    this.loading.style.display = 'block';
    this.moviesGrid.style.display = 'none';
  }

  hideLoading() {
    this.loading.style.display = 'none';
    this.moviesGrid.style.display = 'grid';
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Ensure global reference for inline onclick handlers
  window.app = new MovieApp();

  // Inject animation keyframes if not in CSS
  const styleAnim = document.createElement('style');
  styleAnim.textContent = `
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(12px) scale(.98); }
      to   { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(styleAnim);
});
