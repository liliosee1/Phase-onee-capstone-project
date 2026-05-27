const BASE_URL = 'https://openlibrary.org/search.json';
const DEFAULT_LIMIT = 32;


async function fetchFromAPI(query, limit = DEFAULT_LIMIT) {
  const params = new URLSearchParams({
    q: query,
    limit: limit,
    fields: 'key,title,author_name,first_publish_year,cover_i,subject',
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.docs || [];
}
//
export async function fetchBooks(defaultQuery = 'classic literature') {
  const books = await fetchFromAPI(defaultQuery, DEFAULT_LIMIT);
  // Filter out books without a title
  return books.filter(b => b.title);
}

//
export async function searchBooks(query) {
  if (!query || !query.trim()) {
    throw new Error('Please enter a search term.');
  }
  const books = await fetchFromAPI(query.trim(), DEFAULT_LIMIT);
  return books.filter(b => b.title);
}

//
export function getCoverUrl(coverId, size = 'M') {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}