import type {
  AnimeSearchResponse,
  AnimeDetailResponse,
  EpisodesResponse,
  TopAnimeResponse,
  SeasonalAnimeResponse,
  RandomAnimeResponse,
} from '@/types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper - Jikan allows 3 requests per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // ms

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
}

async function fetchWithRateLimit<T>(url: string): Promise<T> {
  await rateLimit();
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 404) {
      throw new Error('Anime not found.');
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export const jikanApi = {
  // Search anime with query and optional filters
  searchAnime: async (
    query: string,
    page: number = 1,
    limit: number = 24,
    filters?: {
      type?: string;
      status?: string;
      rating?: string;
      genres?: string;
      order_by?: string;
      sort?: 'asc' | 'desc';
    }
  ): Promise<AnimeSearchResponse> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.rating) params.append('rating', filters.rating);
    if (filters?.genres) params.append('genres', filters.genres);
    if (filters?.order_by) params.append('order_by', filters.order_by);
    if (filters?.sort) params.append('sort', filters.sort);
    
    return fetchWithRateLimit<AnimeSearchResponse>(
      `${BASE_URL}/anime?${params.toString()}`
    );
  },
  
  // Get anime details by ID
  getAnimeDetails: async (id: number): Promise<AnimeDetailResponse> => {
    return fetchWithRateLimit<AnimeDetailResponse>(
      `${BASE_URL}/anime/${id}`
    );
  },
  
  // Get anime episodes
  getAnimeEpisodes: async (
    id: number,
    page: number = 1
  ): Promise<EpisodesResponse> => {
    return fetchWithRateLimit<EpisodesResponse>(
      `${BASE_URL}/anime/${id}/episodes?page=${page}`
    );
  },
  
  // Get top anime
  getTopAnime: async (
    page: number = 1,
    limit: number = 24,
    type?: string,
    filter?: string
  ): Promise<TopAnimeResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (type) params.append('type', type);
    if (filter) params.append('filter', filter);
    
    return fetchWithRateLimit<TopAnimeResponse>(
      `${BASE_URL}/top/anime?${params.toString()}`
    );
  },
  
  // Get current season anime
  getSeasonalAnime: async (
    year?: number,
    season?: 'winter' | 'spring' | 'summer' | 'fall',
    page: number = 1
  ): Promise<SeasonalAnimeResponse> => {
    let url: string;
    
    if (year && season) {
      url = `${BASE_URL}/seasons/${year}/${season}?page=${page}`;
    } else {
      url = `${BASE_URL}/seasons/now?page=${page}`;
    }
    
    return fetchWithRateLimit<SeasonalAnimeResponse>(url);
  },
  
  // Get random anime
  getRandomAnime: async (): Promise<RandomAnimeResponse> => {
    return fetchWithRateLimit<RandomAnimeResponse>(
      `${BASE_URL}/random/anime`
    );
  },
  
  // Get anime by genre
  getAnimeByGenre: async (
    genreId: number,
    page: number = 1,
    limit: number = 24
  ): Promise<AnimeSearchResponse> => {
    return fetchWithRateLimit<AnimeSearchResponse>(
      `${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}`
    );
  },
};

// Helper function to parse duration string and calculate total duration
export function calculateTotalDuration(
  episodes: number | null,
  duration: string | null
): { hours: number; minutes: number; totalMinutes: number; formatted: string } {
  if (!episodes || !duration) {
    return { hours: 0, minutes: 0, totalMinutes: 0, formatted: 'Unknown' };
  }
  
  // Parse duration string (e.g., "24 min per ep", "1 hr 30 min per ep", "23 min")
  let minutesPerEpisode = 0;
  
  const hourMatch = duration.match(/(\d+)\s*hr/);
  const minMatch = duration.match(/(\d+)\s*min/);
  
  if (hourMatch) {
    minutesPerEpisode += parseInt(hourMatch[1]) * 60;
  }
  
  if (minMatch) {
    minutesPerEpisode += parseInt(minMatch[1]);
  }
  
  // If no match found, try to extract any number
  if (!hourMatch && !minMatch) {
    const numMatch = duration.match(/(\d+)/);
    if (numMatch) {
      minutesPerEpisode = parseInt(numMatch[1]);
    }
  }
  
  const totalMinutes = episodes * minutesPerEpisode;
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${remainingMinutes}m`;
  } else if (remainingMinutes > 0) {
    formatted = `${remainingMinutes}m`;
  } else {
    formatted = 'Unknown';
  }
  
  // Add total days if significant
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    formatted = `${days}d ${remainingHours}h ${remainingMinutes}m`;
  }
  
  return {
    hours,
    minutes: remainingMinutes,
    totalMinutes,
    formatted,
  };
}

// Helper to format large numbers
export function formatNumber(num: number | null): string {
  if (num === null) return 'N/A';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Helper to get season based on month
export function getCurrentSeason(): 'winter' | 'spring' | 'summer' | 'fall' {
  const month = new Date().getMonth() + 1;
  
  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'fall';
}
