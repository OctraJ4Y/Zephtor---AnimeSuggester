import { useState, useEffect } from 'react';
import { 
  X,
  Star, 
  Calendar, 
  Clock, 
  Play, 
  Heart, 
  Plus, 
  Check,
  Users,
  TrendingUp,
  Film,
  Tv,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { jikanApi, calculateTotalDuration, formatNumber } from '@/services/jikanApi';
import { useUserStore } from '@/store/userStore';
import type { Anime, Episode } from '@/types/anime';

interface AnimeDetailModalProps {
  anime: Anime;
  isOpen: boolean;
  onClose: () => void;
}

export function AnimeDetailModal({ anime, isOpen, onClose }: AnimeDetailModalProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    isAuthenticated, 
    favorites, 
    addToFavorites, 
    removeFromFavorites,
    addToWatchlist,
    getWatchlistItem,
    updateWatchlistProgress,
  } = useUserStore();
  
  const watchlistItem = getWatchlistItem(anime.mal_id);
  const isFavorite = favorites.includes(anime.mal_id);
  
  const totalDuration = calculateTotalDuration(anime.episodes, anime.duration);
  
  useEffect(() => {
    if (isOpen && anime.mal_id) {
      fetchEpisodes();
    }
  }, [isOpen, anime.mal_id]);
  
  const fetchEpisodes = async () => {
    setIsLoadingEpisodes(true);
    try {
      const response = await jikanApi.getAnimeEpisodes(anime.mal_id);
      setEpisodes(response.data);
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
    } finally {
      setIsLoadingEpisodes(false);
    }
  };
  
  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(anime.mal_id);
    } else {
      addToFavorites(anime.mal_id);
    }
  };
  
  const handleAddToWatchlist = (status: 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped') => {
    addToWatchlist(anime, status);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-[#2a2a2a] text-white p-0">
        {/* Hero Image */}
        <div className="relative h-64 sm:h-80">
          <img
            src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start gap-4">
              {/* Poster Thumbnail */}
              <img
                src={anime.images.webp.small_image_url || anime.images.jpg.small_image_url}
                alt={anime.title}
                className="w-24 h-36 object-cover rounded-lg shadow-lg hidden sm:block"
              />
              
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {anime.title_english || anime.title}
                </h1>
                {anime.title_japanese && anime.title_japanese !== anime.title && (
                  <p className="text-gray-400 text-sm mb-3">{anime.title_japanese}</p>
                )}
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  {anime.score && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <span className="font-semibold">{anime.score}</span>
                      <span className="text-xs text-yellow-400/70">({formatNumber(anime.scored_by)})</span>
                    </div>
                  )}
                  
                  {anime.rating && (
                    <Badge variant="outline" className="border-[#2a2a2a] text-gray-400">
                      {anime.rating}
                    </Badge>
                  )}
                  
                  {anime.type && (
                    <Badge variant="outline" className="border-[#2a2a2a] text-gray-400">
                      {anime.type}
                    </Badge>
                  )}
                  
                  {anime.status && (
                    <Badge 
                      className={`${
                        anime.status === 'Currently Airing' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : anime.status === 'Finished Airing'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {anime.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {isAuthenticated ? (
              <>
                <Select
                  value={watchlistItem?.status || ''}
                  onValueChange={(value) => handleAddToWatchlist(value as any)}
                >
                  <SelectTrigger className="w-[180px] bg-[#0f0f0f] border-[#2a2a2a] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Add to List" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                    <SelectItem value="watching">Watching</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`border-[#2a2a2a] ${
                    isFavorite 
                      ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favorited' : 'Favorite'}
                </Button>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Sign in to add to your list and favorites
              </p>
            )}
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#0f0f0f] border border-[#2a2a2a]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="episodes" className="data-[state=active]:bg-purple-600">
                Episodes
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              {/* Synopsis */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                <p className="text-gray-400 leading-relaxed">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {/* Episodes */}
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Episodes</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {anime.episodes || '?'}
                  </p>
                </div>
                
                {/* Duration */}
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {anime.duration?.replace(' per ep', '') || '?'}
                  </p>
                </div>
                
                {/* Total Duration - Highlighted */}
                <div className="p-4 bg-purple-600/10 rounded-xl border border-purple-600/30 col-span-2">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Total Watch Time</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    {totalDuration.formatted}
                  </p>
                  <p className="text-xs text-purple-400/70 mt-1">
                    {anime.episodes || '?'} episodes × {anime.duration?.replace(' per ep', '') || '?'} each
                  </p>
                </div>
                
                {/* Aired Date */}
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Aired</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {anime.aired?.string || '?'}
                  </p>
                </div>
                
                {/* Season */}
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Tv className="w-4 h-4" />
                    <span className="text-sm">Season</span>
                  </div>
                  <p className="text-lg font-bold text-white capitalize">
                    {anime.season && anime.year 
                      ? `${anime.season} ${anime.year}`
                      : anime.year?.toString() || '?'}
                  </p>
                </div>
                
                {/* Source */}
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">Source</span>
                  </div>
                  <p className="text-lg font-bold text-white capitalize">
                    {anime.source || '?'}
                  </p>
                </div>
                
                {/* Studios */}
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Film className="w-4 h-4" />
                    <span className="text-sm">Studios</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {anime.studios?.map(s => s.name).join(', ') || '?'}
                  </p>
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Members</span>
                  </div>
                  <p className="text-xl font-bold text-white">{formatNumber(anime.members)}</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Favorites</span>
                  </div>
                  <p className="text-xl font-bold text-white">{formatNumber(anime.favorites)}</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Popularity</span>
                  </div>
                  <p className="text-xl font-bold text-white">#{formatNumber(anime.popularity)}</p>
                </div>
              </div>
              
              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <Badge
                        key={genre.mal_id}
                        variant="outline"
                        className="px-3 py-1 border-purple-600/30 text-purple-400 hover:bg-purple-600/10"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Episodes Tab */}
            <TabsContent value="episodes" className="mt-6">
              {isLoadingEpisodes ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              ) : episodes.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Episodes ({episodes.length})
                    </h3>
                    {isAuthenticated && watchlistItem && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Progress:</span>
                        <input
                          type="number"
                          min={0}
                          max={anime.episodes || episodes.length}
                          value={watchlistItem.progress}
                          onChange={(e) => updateWatchlistProgress(anime.mal_id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-white text-center"
                        />
                        <span className="text-gray-400">/ {anime.episodes || episodes.length}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {episodes.map((episode, index) => (
                      <div
                        key={episode.mal_id}
                        className={`p-4 bg-[#0f0f0f] rounded-lg border border-[#2a2a2a] flex items-center justify-between ${
                          isAuthenticated && watchlistItem && index < watchlistItem.progress
                            ? 'border-green-500/30 bg-green-500/5'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-center text-gray-500 font-mono">
                            {episode.episode}
                          </span>
                          <div>
                            <p className="text-white font-medium">
                              {episode.title || `Episode ${episode.episode}`}
                            </p>
                            {episode.aired && (
                              <p className="text-sm text-gray-500">
                                Aired: {new Date(episode.aired).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {isAuthenticated && watchlistItem && index < watchlistItem.progress && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No episode information available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
