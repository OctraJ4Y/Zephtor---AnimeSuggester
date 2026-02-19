import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, WatchlistItem, Anime } from '@/types/anime';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  favorites: number[];
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Watchlist actions
  addToWatchlist: (anime: Anime, status: WatchlistItem['status']) => void;
  removeFromWatchlist: (animeId: number) => void;
  updateWatchlistStatus: (animeId: number, status: WatchlistItem['status']) => void;
  updateWatchlistProgress: (animeId: number, progress: number) => void;
  rateAnime: (animeId: number, rating: number) => void;
  
  // Favorites actions
  addToFavorites: (animeId: number) => void;
  removeFromFavorites: (animeId: number) => void;
  isFavorite: (animeId: number) => boolean;
  
  // Getters
  getWatchlistByStatus: (status: WatchlistItem['status']) => WatchlistItem[];
  getWatchlistItem: (animeId: number) => WatchlistItem | undefined;
  getTotalWatchTime: () => number;
  getTotalEpisodesWatched: () => number;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Hash password (simple hash for demo purposes)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      favorites: [],
      
      login: async (email: string, password: string): Promise<boolean> => {
        // Get stored users
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const hashedPassword = hashPassword(password);
        
        const foundUser = users.find(
          (u: any) => u.email === email && u.password === hashedPassword
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          return true;
        }
        
        return false;
      },
      
      signup: async (username: string, email: string, password: string): Promise<boolean> => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        
        // Check if email already exists
        if (users.some((u: any) => u.email === email)) {
          return false;
        }
        
        // Check if username already exists
        if (users.some((u: any) => u.username === username)) {
          return false;
        }
        
        const newUser = {
          id: generateId(),
          username,
          email,
          password: hashPassword(password),
          avatar: null,
          watchlist: [],
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        localStorage.setItem('animehub_users', JSON.stringify(users));
        
        const { password: _, ...userWithoutPassword } = newUser;
        set({ 
          user: userWithoutPassword, 
          isAuthenticated: true 
        });
        
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = { ...user, ...updates };
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...updates };
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      addToWatchlist: (anime: Anime, status: WatchlistItem['status']) => {
        const { user } = get();
        if (!user) return;
        
        const exists = user.watchlist.find(item => item.anime.mal_id === anime.mal_id);
        if (exists) {
          // Update status if already in watchlist
          get().updateWatchlistStatus(anime.mal_id, status);
          return;
        }
        
        const newItem: WatchlistItem = {
          anime,
          status,
          progress: 0,
          rating: null,
          addedAt: new Date().toISOString(),
        };
        
        const updatedUser = {
          ...user,
          watchlist: [...user.watchlist, newItem],
        };
        
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].watchlist = updatedUser.watchlist;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      removeFromWatchlist: (animeId: number) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = {
          ...user,
          watchlist: user.watchlist.filter(item => item.anime.mal_id !== animeId),
        };
        
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].watchlist = updatedUser.watchlist;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      updateWatchlistStatus: (animeId: number, status: WatchlistItem['status']) => {
        const { user } = get();
        if (!user) return;
        
        const updatedWatchlist = user.watchlist.map(item =>
          item.anime.mal_id === animeId ? { ...item, status } : item
        );
        
        const updatedUser = { ...user, watchlist: updatedWatchlist };
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].watchlist = updatedWatchlist;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      updateWatchlistProgress: (animeId: number, progress: number) => {
        const { user } = get();
        if (!user) return;
        
        const updatedWatchlist = user.watchlist.map(item =>
          item.anime.mal_id === animeId ? { ...item, progress } : item
        );
        
        const updatedUser = { ...user, watchlist: updatedWatchlist };
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].watchlist = updatedWatchlist;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      rateAnime: (animeId: number, rating: number) => {
        const { user } = get();
        if (!user) return;
        
        const updatedWatchlist = user.watchlist.map(item =>
          item.anime.mal_id === animeId ? { ...item, rating } : item
        );
        
        const updatedUser = { ...user, watchlist: updatedWatchlist };
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].watchlist = updatedWatchlist;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      addToFavorites: (animeId: number) => {
        const { user } = get();
        if (!user) return;
        
        if (user.favorites.includes(animeId)) return;
        
        const updatedUser = {
          ...user,
          favorites: [...user.favorites, animeId],
        };
        
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].favorites = updatedUser.favorites;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      removeFromFavorites: (animeId: number) => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = {
          ...user,
          favorites: user.favorites.filter(id => id !== animeId),
        };
        
        set({ user: updatedUser });
        
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('animehub_users') || '[]');
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index].favorites = updatedUser.favorites;
          localStorage.setItem('animehub_users', JSON.stringify(users));
        }
      },
      
      isFavorite: (animeId: number) => {
        const { user } = get();
        if (!user) return false;
        return user.favorites.includes(animeId);
      },
      
      getWatchlistByStatus: (status: WatchlistItem['status']) => {
        const { user } = get();
        if (!user) return [];
        return user.watchlist.filter(item => item.status === status);
      },
      
      getWatchlistItem: (animeId: number) => {
        const { user } = get();
        if (!user) return undefined;
        return user.watchlist.find(item => item.anime.mal_id === animeId);
      },
      
      getTotalWatchTime: () => {
        const { user } = get();
        if (!user) return 0;
        
        return user.watchlist.reduce((total, item) => {
          if (item.status === 'completed' && item.anime.episodes) {
            // Parse duration
            const duration = item.anime.duration || '';
            let minutesPerEpisode = 24; // default
            
            const hourMatch = duration.match(/(\d+)\s*hr/);
            const minMatch = duration.match(/(\d+)\s*min/);
            
            if (hourMatch) {
              minutesPerEpisode = parseInt(hourMatch[1]) * 60;
              if (minMatch) minutesPerEpisode += parseInt(minMatch[1]);
            } else if (minMatch) {
              minutesPerEpisode = parseInt(minMatch[1]);
            }
            
            return total + (item.anime.episodes * minutesPerEpisode);
          } else if (item.status === 'watching') {
            const duration = item.anime.duration || '';
            let minutesPerEpisode = 24;
            
            const hourMatch = duration.match(/(\d+)\s*hr/);
            const minMatch = duration.match(/(\d+)\s*min/);
            
            if (hourMatch) {
              minutesPerEpisode = parseInt(hourMatch[1]) * 60;
              if (minMatch) minutesPerEpisode += parseInt(minMatch[1]);
            } else if (minMatch) {
              minutesPerEpisode = parseInt(minMatch[1]);
            }
            
            return total + (item.progress * minutesPerEpisode);
          }
          return total;
        }, 0);
      },
      
      getTotalEpisodesWatched: () => {
        const { user } = get();
        if (!user) return 0;
        
        return user.watchlist.reduce((total, item) => {
          if (item.status === 'completed') {
            return total + (item.anime.episodes || 0);
          } else if (item.status === 'watching') {
            return total + item.progress;
          }
          return total;
        }, 0);
      },
    }),
    {
      name: 'animehub-user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
