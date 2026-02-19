import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AnimeCard } from '@/components/AnimeCard';
import { AnimeDetailModal } from '@/sections/AnimeDetailModal';
import { jikanApi } from '@/services/jikanApi';
import type { Anime } from '@/types/anime';
import { useUserStore } from '@/store/userStore';

interface SearchSectionProps {
  initialQuery?: string;
}

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 30, name: 'Sports' },
  { id: 36, name: 'Slice of Life' },
];

const animeTypes = [
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
];

const animeStatuses = [
  { value: 'airing', label: 'Airing' },
  { value: 'complete', label: 'Complete' },
  { value: 'upcoming', label: 'Upcoming' },
];

const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'score', label: 'Score' },
  { value: 'members', label: 'Members' },
  { value: 'favorites', label: 'Favorites' },
];

export function SearchSection({ initialQuery = '' }: SearchSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  
  const { favorites, addToFavorites, removeFromFavorites, isAuthenticated } = useUserStore();
  
  const searchAnime = useCallback(async (isNewSearch = false) => {
    if (!searchQuery.trim() && selectedGenres.length === 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const currentPage = isNewSearch ? 1 : page;
      
      const response = await jikanApi.searchAnime(
        searchQuery,
        currentPage,
        24,
        {
          type: selectedType || undefined,
          status: selectedStatus || undefined,
          genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
          order_by: sortBy,
          sort: 'desc',
        }
      );
      
      if (isNewSearch) {
        setResults(response.data);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.pagination.has_next_page);
    } catch (err) {
      setError('Failed to search anime. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGenres, selectedType, selectedStatus, sortBy, page]);
  
  // Initial search
  useEffect(() => {
    if (initialQuery) {
      searchAnime(true);
    }
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    searchAnime(true);
  };
  
  const loadMore = () => {
    setPage(prev => prev + 1);
    searchAnime(false);
  };
  
  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };
  
  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedType('');
    setSelectedStatus('');
    setSortBy('popularity');
  };
  
  const handleToggleFavorite = (e: React.MouseEvent, anime: Anime) => {
    e.stopPropagation();
    if (favorites.includes(anime.mal_id)) {
      removeFromFavorites(anime.mal_id);
    } else {
      addToFavorites(anime.mal_id);
    }
  };
  
  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Search Anime
          </h1>
          <p className="text-gray-400">
            Discover your next favorite anime from our database of 50,000+ titles
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 bg-[#1a1a1a] border-[#2a2a2a] rounded-xl text-white placeholder:text-gray-500 focus:border-purple-600"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-[#2a2a2a] text-white hover:bg-white/5 px-6 py-6 ${
                showFilters ? 'bg-purple-600/20 border-purple-600/50' : ''
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {(selectedGenres.length > 0 || selectedType || selectedStatus) && (
                <Badge className="ml-2 bg-purple-600">
                  {selectedGenres.length + (selectedType ? 1 : 0) + (selectedStatus ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </form>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Clear all
              </button>
            </div>
            
            {/* Genres */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#0f0f0f] text-gray-400 hover:text-white border border-[#2a2a2a]'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Type</h4>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-purple-600 outline-none"
                >
                  <option value="">All Types</option>
                  {animeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Status</h4>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-purple-600 outline-none"
                >
                  <option value="">All Statuses</option>
                  {animeStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:border-purple-600 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        {results.length > 0 && (
          <div className="mb-6 text-gray-400">
            Found <span className="text-white font-semibold">{results.length}</span> results
          </div>
        )}
        
        {/* Results Grid */}
        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  onClick={() => setSelectedAnime(anime)}
                  isFavorite={favorites.includes(anime.mal_id)}
                  onToggleFavorite={isAuthenticated ? (e) => handleToggleFavorite(e, anime) : undefined}
                />
              ))}
            </div>
            
            {/* Load More */}
            {hasMore && (
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
        ) : (
          !isLoading && searchQuery && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )
        )}
        
        {/* Loading State */}
        {isLoading && results.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-400">{error}</p>
          </div>
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
