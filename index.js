
import { addFavorite, removeFavorite, isFavorite, getFavorites } from './js/storage.js';
  import { fetchBooks, searchBooks } from './js/fetchBooks.js';

  let currentBooks = [];

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 2800);
  }
  function showLoading() {
    const grid = document.getElementById('booksGrid');
    const state = document.getElementById('stateBox');

    state.classList.add('hidden');
    grid.classList.remove('hidden');

    grid.innerHTML = Array(8).fill('').map(() => `
      <div class="bg-white border rounded-xl overflow-hidden animate-pulse">
        <div class="w-full aspect-[2/3] bg-gray-200"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </div>
    `).join('');
  }

  function showEmpty(msg, sub) {
    document.getElementById('booksGrid').classList.add('hidden');
    const s = document.getElementById('stateBox');
    s.classList.remove('hidden');
    s.innerHTML = `
      <div class="text-4xl mb-2"></div>
      <div class="text-xl font-semibold">${msg}</div>
      <p class="text-gray-500">${sub}</p>
    `;
  }

  function showError(msg) {
    document.getElementById('booksGrid').classList.add('hidden');
    const s = document.getElementById('stateBox');
    s.classList.remove('hidden');
    s.innerHTML = `
      <div class="text-4xl mb-2"></div>
      <div class="text-xl font-semibold">Something went wrong</div>
      <p class="text-gray-500">${msg}</p>
    `;
  }

  function renderBooks(books) {
    const grid = document.getElementById('booksGrid');
    const count = document.getElementById('resultCount');

    grid.classList.remove('hidden');
    document.getElementById('stateBox').classList.add('hidden');

    count.textContent = books.length ? `${books.length} books found` : '';

    if (!books.length) {
      showEmpty('No results found', 'Try a different keyword.');
      return;
    }

    grid.innerHTML = books.map((book, i) => {
      const fav = isFavorite(book.key);
      const cover = book.cover_i
        ? `<img class="w-full h-64 object-cover" src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" />`
        : `<div class="h-64 flex items-center justify-center bg-gray-100 text-4xl"></div>`;

      const author = book.author_name ? book.author_name[0] : 'Unknown author';

      return `
        <div class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

          ${cover}

          <div class="p-4">
            <h3 class="font-bold text-lg">${book.title}</h3>
            <p class="text-sm text-gray-500">${author}</p>

            <button
              class="mt-3 px-3 py-1 rounded text-sm border ${fav ? 'bg-red-500 text-white' : 'bg-gray-100'}"
              onclick="window._toggleFav('${book.key}', ${i})"
              data-key="${book.key}">
              ${fav ? ' Added to favorites' : 'Add to favorites'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window._toggleFav = function(key) {
    const book = currentBooks.find(b => b.key === key);
    if (!book) return;

    if (isFavorite(key)) {
      removeFavorite(key);
      showToast(`Removed from favorites`);
    } else {
      addFavorite(book);
      showToast(`Saved to favorites `);
    }

    renderBooks(currentBooks);
  };

  window.handleSearch = async function() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;

    document.getElementById('sectionTitle').textContent = `Results for "${q}"`;
    showLoading();

    try {
      const books = await searchBooks(q);
      currentBooks = books;
      renderBooks(books);
    } catch (e) {
      showError(e.message);
    }
  };

  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });

  async function init() {
    showLoading();
    try {
      const books = await fetchBooks('the great');
      currentBooks = books;
      renderBooks(books);
    } catch (e) {
      showError(e.message);
    }
  }

  init();

  window.toggleMenu = function () {
    document.getElementById('mobileMenu').classList.toggle('hidden');
  };