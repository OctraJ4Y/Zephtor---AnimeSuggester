import { useState } from 'react';
import { Star, Play, Heart, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Anime } from '@/types/anime';
import { calculateTotalDuration, formatNumber } from '@/services/jikanApi';

interface AnimeCardProps {
  anime: Anime;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function AnimeCard({ anime, onClick, isFavorite, onToggleFavorite }: AnimeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const totalDuration = calculateTotalDuration(anime.episodes, anime.duration);
  
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-600/10"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#2a2a2a] animate-pulse" />
        )}
        
        {/* Anime Image */}
        <img
          src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
          alt={anime.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-60" />
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-black/50 text-white/70 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
        
        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{anime.score}</span>
          </div>
        )}
        
        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-purple-600/90 flex items-center justify-center backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
        
        {/* Status Badge */}
        {anime.status && (
          <div className="absolute bottom-2 left-2">
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                anime.status === 'Currently Airing' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : anime.status === 'Finished Airing'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}
            >
              {anime.status}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors">
          {anime.title_english || anime.title}
        </h3>
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
          {anime.episodes && (
            <div className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              <span>{anime.episodes} eps</span>
            </div>
          )}
          
          {totalDuration.totalMinutes > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{totalDuration.formatted}</span>
            </div>
          )}
          
          {anime.year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{anime.year}</span>
            </div>
          )}
        </div>
        
        {/* Genres */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {anime.genres.slice(0, 3).map((genre) => (
              <Badge
                key={genre.mal_id}
                variant="outline"
                className="text-[10px] border-[#2a2a2a] text-gray-500"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Popularity */}
        {anime.members && (
          <div className="mt-3 pt-3 border-t border-[#2a2a2a] text-xs text-gray-500">
            {formatNumber(anime.members)} members
          </div>
        )}
      </div>
    </div>
  );
}
