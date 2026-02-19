import { useState, useEffect, useCallback } from 'react';
import { Sparkles, TrendingUp, Star, Calendar, Shuffle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimeCard } from '@/components/AnimeCard';
import { AnimeDetailModal } from '@/sections/AnimeDetailModal';
import { jikanApi } from '@/services/jikanApi';
import type { Anime } from '@/types/anime';
import { useUserStore } from '@/store/userStore';

type SuggestionType = 'trending' | 'top' | 'seasonal' | 'random';

interface SuggestionCategory {
  id: SuggestionType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const categories: SuggestionCategory[] = [
  { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'Most popular anime right now' },
  { id: 'top', label: 'Top Rated', icon: Star, description: 'Highest rated anime of all time' },
  { id: 'seasonal', label: 'This Season', icon: Calendar, description: 'Current season anime' },
  { id: 'random', label: 'Surprise Me', icon: Shuffle, description: 'Random anime discovery' },
];

export function SuggestionsSection() {
  const [activeCategory, setActiveCategory] = useState<SuggestionType>('trending');
  const [anime, setAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [page, setPage] = useState(1);
  
  const { favorites, addToFavorites, removeFromFavorites, isAuthenticated } = useUserStore();
  
  const fetchSuggestions = useCallback(async (category: SuggestionType, isNewCategory = false) => {
    setIsLoading(true);
    setError('');
    
    try {
      let response;
      const currentPage = isNewCategory ? 1 : page;
      
      switch (category) {
        case 'trending':
          response = await jikanApi.getTopAnime(currentPage, 12, undefined, 'bypopularity');
          break;
        case 'top':
          response = await jikanApi.getTopAnime(currentPage, 12, undefined, 'score');
          break;
        case 'seasonal':
          response = await jikanApi.getSeasonalAnime(undefined, undefined, currentPage);
          break;
        case 'random':
          // Fetch multiple random anime
          const randomPromises = Array(6).fill(null).map(() => jikanApi.getRandomAnime());
          const randomResults = await Promise.all(randomPromises);
          setAnime(randomResults.map(r => r.data));
          setIsLoading(false);
          return;
        default:
          response = await jikanApi.getTopAnime(currentPage, 12);
      }
      
      if (isNewCategory) {
        setAnime(response.data);
        setPage(1);
      } else {
        setAnime(prev => [...prev, ...response.data]);
      }
    } catch (err) {
      setError('Failed to load suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);
  
  useEffect(() => {
    fetchSuggestions('trending', true);
  }, []);
  
  const handleCategoryChange = (category: SuggestionType) => {
    setActiveCategory(category);
    fetchSuggestions(category, true);
  };
  
  const handleRefreshRandom = () => {
    if (activeCategory === 'random') {
      fetchSuggestions('random', true);
    }
  };
  
  const handleToggleFavorite = (e: React.MouseEvent, animeItem: Anime) => {
    e.stopPropagation();
    if (favorites.includes(animeItem.mal_id)) {
      removeFromFavorites(animeItem.mal_id);
    } else {
      addToFavorites(animeItem.mal_id);
    }
  };
  
  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchSuggestions(activeCategory, false);
  };
  
  const activeCategoryData = categories.find(c => c.id === activeCategory);
  
  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-600/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Discover New Anime</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Anime Suggestions
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Let us help you find your next favorite anime. Choose a category below to get started.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeCategory === category.id
                  ? 'bg-purple-600/20 border-purple-600/50'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-purple-600/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#0f0f0f] text-gray-400'
              }`}>
                <category.icon className="w-5 h-5" />
              </div>
              <h3 className={`font-semibold mb-1 ${
                activeCategory === category.id ? 'text-white' : 'text-gray-300'
              }`}>
                {category.label}
              </h3>
              <p className="text-xs text-gray-500">{category.description}</p>
            </button>
          ))}
        </div>
        
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeCategoryData?.label}
            </h2>
            <p className="text-gray-400">{activeCategoryData?.description}</p>
          </div>
          
          {activeCategory === 'random' && (
            <Button
              onClick={handleRefreshRandom}
              disabled={isLoading}
              variant="outline"
              className="border-[#2a2a2a] text-white hover:bg-white/5"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
        
        {/* Results Grid */}
        {isLoading && anime.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
            <Button
              onClick={() => fetchSuggestions(activeCategory, true)}
              variant="outline"
              className="mt-4 border-[#2a2a2a] text-white"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {anime.map((item) => (
                <AnimeCard
                  key={item.mal_id}
                  anime={item}
                  onClick={() => setSelectedAnime(item)}
                  isFavorite={favorites.includes(item.mal_id)}
                  onToggleFavorite={isAuthenticated ? (e) => handleToggleFavorite(e, item) : undefined}
                />
              ))}
            </div>
            
            {/* Load More */}
            {activeCategory !== 'random' && (
              <div className="mt-12 text-center">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:bg-white/5 px-8"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Anime Detail Modal */}
      {selectedAnime && (
        <AnimeDetailModal
          anime={selectedAnime}
          isOpen={!!selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </section>
  );
}
