import { useState } from 'react';
import { Search, TrendingUp, Users, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroProps {
  onSearch: (query: string) => void;
  onNavigate: (page: string) => void;
}

export function Hero({ onSearch, onNavigate }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };
  
  const stats = [
    { icon: Database, value: '50,000+', label: 'Anime' },
    { icon: Users, value: '1M+', label: 'Users' },
    { icon: TrendingUp, value: 'Real-time', label: 'Data' },
  ];
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0f0f0f]">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-600/20 mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Discover Your Next Favorite Anime</span>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Find Your Next{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Anime Obsession
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Search, explore, and track your favorite anime series with detailed stats including 
          episodes, seasons, and total watch time.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-6 bg-[#1a1a1a] border-[#2a2a2a] rounded-xl text-white placeholder:text-gray-500 focus:border-purple-600 focus:ring-purple-600/20"
            />
            <Button
              type="submit"
              className="absolute right-2 bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              Search
            </Button>
          </div>
        </form>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant="outline"
            onClick={() => onNavigate('suggestions')}
            className="border-[#2a2a2a] text-white hover:bg-white/5"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Suggestions
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('search')}
            className="border-[#2a2a2a] text-white hover:bg-white/5"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Now
          </Button>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
    </section>
  );
}
