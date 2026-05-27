
const STORAGE_KEY = 'bookexplorer_favorites';
//
export function getFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read favorites from localStorage:', err);
    return [];
  }
  
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Failed to save favorites to localStorage:', err);
  }
}


export function addFavorite(book) {
  const favorites = getFavorites();
  const alreadyExists = favorites.some(b => b.key === book.key);
  if (!alreadyExists) {
    favorites.push(book);
    saveFavorites(favorites);
  }
}

//
export function removeFavorite(key) {
  const favorites = getFavorites();
  const updated = favorites.filter(b => b.key !== key);
  saveFavorites(updated);
}

export function isFavorite(key) {
  const favorites = getFavorites();
  return favorites.some(b => b.key === key);
}


export function clearFavorites() {
  saveFavorites([]);
}
