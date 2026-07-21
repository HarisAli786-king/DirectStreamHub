import type { Movie, MovieDetails, Genre } from '../types';

const TMDB_BASE = 'https://image.tmdb.org/t/p';
export const POSTER_URL = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500') =>
  path ? `${TMDB_BASE}/${size}${path}` : '';
export const BACKDROP_URL = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
  path ? `${TMDB_BASE}/${size}${path}` : '';
export const PROFILE_URL = (path: string | null, size: 'w185' | 'w300' = 'w185') =>
  path ? `${TMDB_BASE}/${size}${path}` : '';

const NETFLIX_PROVIDER_ID = 8;

function getApiKey(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('tmdb_api_key') || '';
  }
  return '';
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

// ---------- Live TMDB endpoints ----------

export async function fetchTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/trending/all/week', { language: 'en-US' });
  return data.results.filter((m) => m.media_type === 'movie' || m.media_type === 'tv');
}

export async function fetchNetflixOriginals(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/tv', {
    with_networks: '213',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchByGenre(genreId: number, type: 'movie' | 'tv' = 'movie'): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(`/discover/${type}`, {
    with_genres: String(genreId),
    with_watch_providers: String(NETFLIX_PROVIDER_ID),
    'watch_region': 'US',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
  return data.results.map((m) => ({ ...m, media_type: type }));
}

export async function fetchTopRated(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_watch_providers: String(NETFLIX_PROVIDER_ID),
    watch_region: 'US',
    language: 'en-US',
    sort_by: 'vote_average.desc',
    'vote_count.gte': '500',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchMovieDetails(id: number, type: 'movie' | 'tv'): Promise<MovieDetails> {
  const data = await tmdbFetch<MovieDetails & { credits?: { cast: MovieDetails['cast'] } }>(`/${type}/${id}`, {
    append_to_response: 'videos,credits,watch/providers',
    language: 'en-US',
  });
  const cast = data.credits?.cast?.slice(0, 12) || [];
  const { credits, ...rest } = data;
  return { ...rest, cast, media_type: type };
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: Movie[] }>('/search/multi', { query, language: 'en-US', page: '1' });
  return data.results.filter((m) => (m.media_type === 'movie' || m.media_type === 'tv') && (m.poster_path || m.backdrop_path));
}

export async function fetchGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list', { language: 'en-US' });
  return data.genres;
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

// ---------- New category endpoints ----------

export async function fetchMarvel(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_companies: '420',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchHollywoodBlockbusters(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_original_language: 'en',
    region: 'US',
    language: 'en-US',
    sort_by: 'vote_average.desc',
    'vote_count.gte': '1000',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchPakistaniCinema(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_original_language: 'ur',
    language: 'en-US',
    sort_by: 'popularity.desc',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchBollywood(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_original_language: 'hi',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '20',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchAnimated(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '16',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchBySearch(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: Movie[] }>('/search/multi', {
    query,
    language: 'en-US',
    page: '1',
  });
  return data.results.filter(
    (m) => (m.media_type === 'movie' || m.media_type === 'tv') && (m.poster_path || m.backdrop_path)
  );
}

export async function fetchActionThrillers(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '28,53',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '200',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchEpicAdventures(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '12',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchHorror(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '27',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchRomance(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '10749',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchSciFi(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '878',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchDrama(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '18',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '200',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchCrime(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '80',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchMystery(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '9648',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchFantasy(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '14',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchWar(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '10752',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchWestern(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '37',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '20',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchDocumentary(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '99',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '20',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchFamily(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '10751',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchHistory(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '36',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchMusic(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '10402',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '20',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchKoreanDrama(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/tv', {
    with_original_language: 'ko',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '20',
  });
  return data.results.map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchJapaneseAnime(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/discover/movie', {
    with_genres: '16',
    with_original_language: 'ja',
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_count.gte': '20',
  });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

export async function fetchTrendingWeek(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/trending/movie/week', { language: 'en-US' });
  return data.results.filter((m) => m.media_type === 'movie' || m.media_type === 'tv');
}

export async function fetchAiringToday(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/tv/airing_today', { language: 'en-US' });
  return data.results.map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchOnTheAir(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/tv/on_the_air', { language: 'en-US' });
  return data.results.map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchPopularPeople(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>('/person/popular', { language: 'en-US' });
  return data.results.map((m) => ({ ...m, media_type: 'movie' as const }));
}

// ---------- Mock data fallback ----------

const MOCK_POSTERS = [
  '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  '/aD5T2ZjA7gZ2Q8R8m1m9pWZ9b2Y7.jpg',
  '/qNBPMBI7viP8BZWjUkC2m4Xs3mK.jpg',
  '/8b8R8lA7gZ2Q8R8m1m9pWZ9b2Y7.jpg',
  '/kNBPMBI7viP8BZWjUkC2m4Xs3mK.jpg',
  '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
];

const MOCK_BACKDROPS = [
  '/9faGSFi5jQ7kQ6mWsXY9WY7pK2T.jpg',
  '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  '/aD5T2ZjA7gZ2Q8R8m1m9pWZ9b2Y7.jpg',
  '/9faGSFi5jQ7kQ6mWsXY9WY7pK2T.jpg',
];

const TITLES = [
  'Shadow Protocol', 'Crimson Tide Rising', 'The Last Frontier', 'Neon Nights',
  'Dark Horizon', 'Echoes of Tomorrow', 'Silent Storm', 'Final Reckoning',
  'Midnight Protocol', 'The Crimson Crown', 'Edge of Fate', 'Velocity Storm',
  'Phantom Pursuit', 'Iron Resolve', 'The Grand Heist', 'Lost Horizon',
  'Crown of Thorns', 'Aftermath', 'The Void Within', 'Skyfall Reborn',
  'Operation Blackout', 'The Silent Witness', 'Razor Edge', 'Broken Compass',
  'Inferno Rising', 'The Negotiator', 'Last Stand', 'Code Red',
  'The Underground', 'Vortex', 'After the Fall', 'The Lazarus Project',
  'Black Mirror Bay', 'Winters End', 'The Diamond Syndicate', 'Renegade',
  'Apex Predator', 'The Glass House', 'Midnight Caller', 'Stormbreaker',
];

const MARVEL_TITLES = [
  'Iron Sentinel', 'Thunder God', 'Crimson Avenger', 'Guardians Rise',
  'Quantum Realm', 'The Winter Legacy', 'Ultron Protocol', 'Infinity Vendetta',
  'Endgame Reborn', 'Dark Phoenix', 'Spider Protocol', 'Wakanda Forever',
  'Captain Marvel Rising', 'Ant-Man Quantum', 'Doctor Strange Multiverse',
  'Black Widow Vendetta', 'Eternals Genesis', 'Shang-Chi Legend',
  'Thor Love and Thunder', 'Moon Knight Saga',
];

const HOLLYWOOD_TITLES = [
  'The Last Stand', 'Apex Predator', 'Crown of Thorns', 'Skyfall Reborn',
  'Operation Blackout', 'Final Reckoning', 'Dark Horizon', 'Velocity Storm',
  'The Grand Heist', 'Razor Edge', 'Broken Compass', 'Inferno Rising',
  'The Negotiator', 'Code Red', 'The Underground', 'Vortex',
  'After the Fall', 'The Lazarus Project', 'Black Mirror Bay', 'Winters End',
];

const PAKISTANI_TITLES = [
  'The Lahore Files', 'Karachi Nights', 'Punjab Rising', 'Maula Jatt Returns',
  'Ho Mann Jahaan', 'Bin Roye', 'Parwaaz Hai Junoon', 'Parey Hut Love',
  'Wrong No', 'Actor in Law', 'Jawani Phir Nahi Ani', 'Punjab Nahi Jaungi',
  'Teefa in Trouble', 'Verna', 'Zindagi Kitni Haseen Hai', 'Saat Din Mohabbat In',
  'Laal Kabootar', 'Cake', 'Baaji', 'Ghabrana Nahi Hai',
];

const BOLLYWOOD_TITLES = [
  'Dangal Rising', 'Bahubali Crown', 'Three Idiots Reborn', 'PK Awakening',
  'Sanju Story', 'Padmaavat', 'Bajirao Mastani', 'Kabir Singh',
  'Uri Surgical Strike', 'War', 'Tanhaji', 'Chhichhore',
  'Good Newwz', 'Housefull', 'Dilwale', 'Sultan',
  'Tiger Zinda Hai', 'Raees', 'Fan', 'Dhoom',
];

const ANIMATED_TITLES = [
  'Toy Kingdom', 'Frozen Kingdom', 'The Incredibles Next', 'Finding Nemo Deep',
  'Shrek Returns', 'Kung Fu Panda Legacy', 'How to Train Dragon', 'Big Hero Six',
  'Moana Ocean', 'Raya Dragon', 'Luca Sea', 'Encanto Magic',
  'Turning Red', 'Lightyear', 'Elemental', 'Wish',
  'Migration', 'Robot Dreams', 'Nimona', 'Wild Robot',
];

const SONIC_TITLES = [
  'Sonic the Hedgehog', 'Sonic 2', 'Sonic 3', 'Sonic CD',
  'Sonic Adventure', 'Sonic Heroes', 'Sonic Unleashed', 'Sonic Colors',
  'Sonic Generations', 'Sonic Mania', 'Sonic Frontiers', 'Sonic Origins',
  'Sonic X', 'Sonic Boom', 'Sonic Prime',
];

const BOBOIBOY_TITLES = [
  'BoBoiBoy Movie', 'BoBoiBoy Galaxy', 'BoBoiBoy The Movie 2', 'BoBoiBoy Power Sphera',
  'BoBoiBoy Elemental', 'BoBoiBoy Thunderstorm', 'BoBoiBoy Cyclone', 'BoBoiBoy Quake',
  'BoBoiBoy Solar', 'BoBoiBoy Thorn',
];

const BEN10_TITLES = [
  'Ben 10 Original', 'Ben 10 Alien Force', 'Ben 10 Ultimate Alien', 'Ben 10 Omniverse',
  'Ben 10 Destroy All Aliens', 'Ben 10 Secret of the Omnitrix', 'Ben 10 Race Against Time',
  'Ben 10 Alien Swarm', 'Ben 10 Generator Rex', 'Ben 10 Reboot',
];

const ACTION_THRILLER_TITLES = [
  'Mission Impossible', 'John Wick Vendetta', 'The Bourne Identity', 'Jack Reacher',
  'Atomic Blonde', 'Extraction', 'The Equalizer', 'Nobody',
  'Tenet', 'Inception', 'The Dark Knight', 'Dunkirk',
  'Interstellar', 'Memento', 'Preparation', 'The Accountant',
  'Sicario', 'Wind River', 'Nightcrawler', 'Prisoners',
];

const EPIC_ADVENTURE_TITLES = [
  'Lord of the Rings', 'The Hobbit Journey', 'Pirates of the Caribbean', 'Indiana Jones',
  'The Mummy', 'Jumanji Wild', 'Uncharted', 'National Treasure',
  'Tomb Raider', 'The Lost City', 'Jungle Cruise', 'Percy Jackson',
  'Chronicles of Narnia', 'Avatar', 'Dune', 'Gladiator',
  'Kingdom of Heaven', 'Troy', 'Apocalypto', 'The Revenant',
];

const OVERVIEWS = [
  'A retired intelligence operative is pulled back into the field when a global conspiracy threatens to unravel everything she once protected.',
  'In a city where loyalty is currency, a detective must navigate the dangerous underworld to solve a crime that could ignite a war.',
  'Stranded explorers in the frozen north discover an ancient secret buried beneath the ice — one that was never meant to be found.',
  'A street racer turned federal agent infiltrates a syndicate of elite drivers who use their skills for the most daring heists ever attempted.',
  'When the power grid fails across the continent, one family must survive the chaos and uncover who — or what — caused the collapse.',
  'A brilliant scientist races against time to perfect a technology that could save humanity, but powerful forces will kill to control it.',
  'An elite military unit is betrayed behind enemy lines and must fight their way home through hostile territory with no support.',
  'Two strangers wake up in a sealed facility with no memory of how they got there — and only one of them will make it out alive.',
];

const GENRE_IDS = [28, 12, 35, 18, 27, 53, 10749, 878];

function mockMoviesFromTitles(titles: string[], seed = 0): Movie[] {
  return titles.map((title, i) => {
    const id = seed * 1000 + i + 1;
    return {
      id,
      title,
      overview: OVERVIEWS[(seed + i) % OVERVIEWS.length],
      poster_path: MOCK_POSTERS[i % MOCK_POSTERS.length],
      backdrop_path: MOCK_BACKDROPS[i % MOCK_BACKDROPS.length],
      vote_average: Math.round((6 + ((seed + i) % 40) / 10) * 10) / 10,
      vote_count: 500 + ((seed + i) % 5000),
      release_date: `202${(seed + i) % 5}`,
      genre_ids: [GENRE_IDS[(seed + i) % GENRE_IDS.length], GENRE_IDS[(seed + i + 2) % GENRE_IDS.length]],
      media_type: 'movie' as const,
      original_language: 'en',
      popularity: 100 - i,
    };
  });
}

function mockMovies(count: number, seed = 0): Movie[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (seed + i) % TITLES.length;
    const id = seed * 100 + i + 1;
    return {
      id,
      title: TITLES[idx],
      overview: OVERVIEWS[(seed + i) % OVERVIEWS.length],
      poster_path: MOCK_POSTERS[i % MOCK_POSTERS.length],
      backdrop_path: MOCK_BACKDROPS[i % MOCK_BACKDROPS.length],
      vote_average: Math.round((6 + ((seed + i) % 40) / 10) * 10) / 10,
      vote_count: 500 + ((seed + i) % 5000),
      release_date: `202${(seed + i) % 5}`,
      genre_ids: [GENRE_IDS[(seed + i) % GENRE_IDS.length], GENRE_IDS[(seed + i + 2) % GENRE_IDS.length]],
      media_type: 'movie' as const,
      original_language: 'en',
      popularity: 100 - i,
    };
  });
}

const MOCK_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export async function fetchTrendingMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 0);
}

export async function fetchNetflixOriginalsMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 1).map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchByGenreMock(genreId: number): Promise<Movie[]> {
  await delay();
  return mockMovies(20, genreId % 10);
}

export async function fetchTopRatedMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 5).map((m) => ({ ...m, vote_average: Math.min(9.5, m.vote_average + 1.5) }));
}

export async function fetchGenresMock(): Promise<Genre[]> {
  await delay();
  return MOCK_GENRES;
}

export async function searchMoviesMock(query: string): Promise<Movie[]> {
  await delay(300);
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return mockMovies(40, 0).filter((m) => m.title.toLowerCase().includes(q));
}

export async function fetchMovieDetailsMock(id: number): Promise<MovieDetails> {
  await delay(400);
  const base = mockMovies(1, Math.floor(id / 100))[0] || mockMovies(1, 0)[0];
  const trailerKeys = ['eRsLP5qRqMI', 'TcMBFSGVi1c', 'x7KruLpAGHA', 'Df2r9D9oo5Q', '8gambI5R0b4'];
  return {
    ...base,
    id,
    genres: [
      { id: 28, name: 'Action' },
      { id: 53, name: 'Thriller' },
      { id: 18, name: 'Drama' },
    ],
    runtime: 128,
    tagline: 'The truth was never an option.',
    status: 'Released',
    cast: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: ['Sarah Connor', 'Michael Kane', 'Elena Rodriguez', 'James Whitfield', 'Aisha Patel', 'David Chen', 'Maria Santos', 'Robert Hayes'][i],
      character: ['Lead Agent', 'The Handler', 'Dr. Vance', 'Commander', 'Analyst', 'Operative', 'The Informant', 'Director'][i],
      profile_path: null,
      order: i,
    })),
    videos: { results: [{ id: '1', key: trailerKeys[id % trailerKeys.length], name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }] },
  };
}

export async function fetchMarvelMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(MARVEL_TITLES, 10);
}

export async function fetchHollywoodBlockbustersMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(HOLLYWOOD_TITLES, 11).map((m) => ({
    ...m,
    vote_average: Math.min(9.8, m.vote_average + 1.8),
  }));
}

export async function fetchPakistaniCinemaMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(PAKISTANI_TITLES, 12).map((m) => ({
    ...m,
    original_language: 'ur',
  }));
}

export async function fetchBollywoodMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(BOLLYWOOD_TITLES, 13).map((m) => ({
    ...m,
    original_language: 'hi',
  }));
}

export async function fetchAnimatedMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(ANIMATED_TITLES, 14);
}

export async function fetchBySearchMock(query: string): Promise<Movie[]> {
  await delay(300);
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  if (q.includes('sonic')) return mockMoviesFromTitles(SONIC_TITLES, 15);
  if (q.includes('boboiboy')) return mockMoviesFromTitles(BOBOIBOY_TITLES, 16);
  if (q.includes('ben 10') || q.includes('ben10')) return mockMoviesFromTitles(BEN10_TITLES, 17);
  return mockMovies(40, 0).filter((m) => m.title.toLowerCase().includes(q));
}

export async function fetchActionThrillersMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(ACTION_THRILLER_TITLES, 18);
}

export async function fetchEpicAdventuresMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(EPIC_ADVENTURE_TITLES, 19);
}

export async function fetchHorrorMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 20).map((m) => ({ ...m, title: `${m.title} Nightmares` }));
}

export async function fetchRomanceMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 21);
}

export async function fetchSciFiMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 22);
}

export async function fetchDramaMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 23);
}

export async function fetchCrimeMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 24);
}

export async function fetchMysteryMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 25);
}

export async function fetchFantasyMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 26);
}

export async function fetchWarMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 27);
}

export async function fetchWesternMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 28);
}

export async function fetchDocumentaryMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 29);
}

export async function fetchFamilyMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 30);
}

export async function fetchHistoryMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 31);
}

export async function fetchMusicMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 32);
}

export async function fetchKoreanDramaMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 33).map((m) => ({ ...m, media_type: 'tv' as const, original_language: 'ko' }));
}

export async function fetchJapaneseAnimeMock(): Promise<Movie[]> {
  await delay();
  return mockMoviesFromTitles(ANIMATED_TITLES, 34).map((m) => ({ ...m, original_language: 'ja' }));
}

export async function fetchTrendingWeekMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 35);
}

export async function fetchAiringTodayMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 36).map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchOnTheAirMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 37).map((m) => ({ ...m, media_type: 'tv' as const }));
}

export async function fetchPopularPeopleMock(): Promise<Movie[]> {
  await delay();
  return mockMovies(20, 38);
}

function delay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
