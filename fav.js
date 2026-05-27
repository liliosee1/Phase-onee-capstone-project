import { getFavorites, removeFavorite } from './js/storage.js';

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 2500);
  }

  function render() {
    const favorites = getFavorites();
    const grid = document.getElementById('favGrid');
    const empty = document.getElementById('emptyState');
    const statsRow = document.getElementById('statsRow');
    const clearBtn = document.getElementById('clearBtn');
    const listTitle = document.getElementById('listTitle');

    listTitle.textContent = `Saved Books (${favorites.length})`;

    if (!favorites.length) {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      empty.classList.remove('hidden');
      statsRow.classList.add('hidden');
      clearBtn.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    statsRow.classList.remove('hidden');

    const years = favorites.filter(b => b.first_publish_year).map(b => b.first_publish_year);
    const oldest = years.length ? Math.min(...years) : '—';

    statsRow.innerHTML = `
      <div class="bg-white p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-indigo-600">${favorites.length}</div>
        <div class="text-sm text-gray-500">Books saved</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-indigo-600">
          ${new Set(favorites.flatMap(b => b.author_name || [])).size}
        </div>
        <div class="text-sm text-gray-500">Authors</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-indigo-600">${oldest}</div>
        <div class="text-sm text-gray-500">Oldest book</div>
      </div>
    `;

    grid.innerHTML = favorites.map((book, i) => {
      const cover = book.cover_i
        ? `<img class="w-full h-64 object-cover" src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" />`
        : `<div class="h-64 flex items-center justify-center bg-gray-100 text-4xl"></div>`;

      const author = book.author_name ? book.author_name[0] : 'Unknown author';
      const year = book.first_publish_year ? `<span class="inline-block mt-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">${book.first_publish_year}</span>` : '';

      return `
        <div class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

          ${cover}

          <div class="p-4">
            <h3 class="font-bold text-lg">${book.title}</h3>
            <p class="text-sm text-gray-500">${author}</p>

            ${year}

            <button
              onclick="window._remove('${book.key}')"
              class="mt-3 w-full bg-pink-500 text-black py-2 rounded-lg hover:bg-red-500 hover:text-white transition">
               Remove
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window._remove = function(key) {
    const favs = getFavorites();
    const book = favs.find(b => b.key === key);
    removeFavorite(key);
    showToast(book ? `"${book.title}" removed` : 'Book removed');
    render();
  };

  window.clearAll = function() {
    if (!confirm('Remove all favorites?')) return;
    getFavorites().forEach(b => removeFavorite(b.key));
    showToast('All favorites cleared');
    render();
  };

  window.toggleMenu = function() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
  };

  render();