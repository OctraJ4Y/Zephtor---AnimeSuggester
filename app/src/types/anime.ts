export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  synopsis: string | null;
  episodes: number | null;
  duration: string | null;
  status: string;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  genres: Genre[];
  studios: Studio[];
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
  season: string | null;
  year: number | null;
  type: string | null;
  source: string | null;
  members: number;
  favorites: number;
}

export interface Genre {
  mal_id: number;
  name: string;
  type: string;
  url: string;
}

export interface Studio {
  mal_id: number;
  name: string;
  type: string;
  url: string;
}

export interface Episode {
  mal_id: number;
  title: string;
  episode: number;
  url: string;
  aired: string | null;
  score: number | null;
  filler: boolean;
  recap: boolean;
  forum_url: string | null;
}

export interface AnimeSearchResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeDetailResponse {
  data: Anime;
}

export interface EpisodesResponse {
  data: Episode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface TopAnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface SeasonalAnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

export interface RandomAnimeResponse {
  data: Anime;
}

export interface WatchlistItem {
  anime: Anime;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';
  progress: number;
  rating: number | null;
  addedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  watchlist: WatchlistItem[];
  favorites: number[];
  createdAt: string;
}
