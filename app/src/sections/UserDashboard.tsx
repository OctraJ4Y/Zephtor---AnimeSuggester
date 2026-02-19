import { useState } from 'react';
import { 
  Clock, 
  Play, 
  CheckCircle, 
  Calendar, 
  PauseCircle, 
  XCircle,
  Heart,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimeCard } from '@/components/AnimeCard';
import { AnimeDetailModal } from '@/sections/AnimeDetailModal';
import { useUserStore } from '@/store/userStore';
import type { Anime } from '@/types/anime';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('watching');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  
  const { 
    user, 
    logout, 
    getWatchlistByStatus, 
    favorites,
    addToFavorites,
    removeFromFavorites,
    getTotalWatchTime,
    getTotalEpisodesWatched,
    updateWatchlistProgress,
  } = useUserStore();
  
  const watching = getWatchlistByStatus('watching');
  const completed = getWatchlistByStatus('completed');
  const planToWatch = getWatchlistByStatus('plan_to_watch');
  const onHold = getWatchlistByStatus('on_hold');
  const dropped = getWatchlistByStatus('dropped');
  
  const totalWatchTime = getTotalWatchTime();
  const totalEpisodes = getTotalEpisodesWatched();
  
  // Format watch time
  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };
  
  const handleToggleFavorite = (e: React.MouseEvent, anime: Anime) => {
    e.stopPropagation();
    if (favorites.includes(anime.mal_id)) {
      removeFromFavorites(anime.mal_id);
    } else {
      addToFavorites(anime.mal_id);
    }
  };
  
  const renderWatchlistGrid = (items: typeof watching) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <Calendar className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No anime in this list
          </h3>
          <p className="text-gray-400">
            Start adding anime to track your progress
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.anime.mal_id} className="relative">
            <AnimeCard
              anime={item.anime}
              onClick={() => setSelectedAnime(item.anime)}
              isFavorite={favorites.includes(item.anime.mal_id)}
              onToggleFavorite={(e) => handleToggleFavorite(e, item.anime)}
            />
            
            {/* Progress Bar */}
            {item.status === 'watching' && (
              <div className="mt-2 px-4 pb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{item.progress} / {item.anime.episodes || '?'}</span>
                </div>
                <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(
                        (item.progress / (item.anime.episodes || 1)) * 100, 
                        100
                      )}%` 
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateWatchlistProgress(item.anime.mal_id, Math.max(0, item.progress - 1));
                    }}
                    className="flex-1 border-[#2a2a2a] text-xs"
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateWatchlistProgress(item.anime.mal_id, item.progress + 1);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    +1
                  </Button>
                </div>
              </div>
            )}
            
            {/* Rating */}
            {item.rating && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-semibold">
                ★ {item.rating}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {user?.username}
              </h1>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400">Joined {new Date(user?.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={logout}
                className="border-[#2a2a2a] text-white hover:bg-white/5"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#2a2a2a]">
            <div className="text-center p-4 bg-[#0f0f0f] rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{formatWatchTime(totalWatchTime)}</p>
              <p className="text-sm text-gray-500">Total Watch Time</p>
            </div>
            
            <div className="text-center p-4 bg-[#0f0f0f] rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-600/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">{totalEpisodes}</p>
              <p className="text-sm text-gray-500">Episodes Watched</p>
            </div>
            
            <div className="text-center p-4 bg-[#0f0f0f] rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{completed.length}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            
            <div className="text-center p-4 bg-[#0f0f0f] rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-red-600/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-2xl font-bold text-white">{favorites.length}</p>
              <p className="text-sm text-gray-500">Favorites</p>
            </div>
          </div>
        </div>
        
        {/* Watchlist Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a] mb-6 flex flex-wrap h-auto">
            <TabsTrigger 
              value="watching" 
              className="data-[state=active]:bg-purple-600 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watching
              {watching.length > 0 && (
                <Badge className="ml-1 bg-purple-600/50">{watching.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-purple-600 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Completed
              {completed.length > 0 && (
                <Badge className="ml-1 bg-purple-600/50">{completed.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="plan_to_watch" 
              className="data-[state=active]:bg-purple-600 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Plan to Watch
              {planToWatch.length > 0 && (
                <Badge className="ml-1 bg-purple-600/50">{planToWatch.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="on_hold" 
              className="data-[state=active]:bg-purple-600 flex items-center gap-2"
            >
              <PauseCircle className="w-4 h-4" />
              On Hold
              {onHold.length > 0 && (
                <Badge className="ml-1 bg-purple-600/50">{onHold.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="dropped" 
              className="data-[state=active]:bg-purple-600 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Dropped
              {dropped.length > 0 && (
                <Badge className="ml-1 bg-purple-600/50">{dropped.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="watching">
            {renderWatchlistGrid(watching)}
          </TabsContent>
          
          <TabsContent value="completed">
            {renderWatchlistGrid(completed)}
          </TabsContent>
          
          <TabsContent value="plan_to_watch">
            {renderWatchlistGrid(planToWatch)}
          </TabsContent>
          
          <TabsContent value="on_hold">
            {renderWatchlistGrid(onHold)}
          </TabsContent>
          
          <TabsContent value="dropped">
            {renderWatchlistGrid(dropped)}
          </TabsContent>
        </Tabs>
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
