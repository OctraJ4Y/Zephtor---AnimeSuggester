import { Sparkles, Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f0f0f] border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AnimeHub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover, track, and explore your favorite anime. With detailed stats 
              including episodes, seasons, and total watch time calculations.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Search
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Suggestions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  My List
                </a>
              </li>
            </ul>
          </div>
          
          {/* API Attribution */}
          <div>
            <h3 className="text-white font-semibold mb-4">Data Source</h3>
            <p className="text-gray-400 text-sm mb-2">
              Powered by
            </p>
            <a 
              href="https://jikan.moe/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Jikan API
            </a>
            <p className="text-gray-500 text-xs mt-2">
              Unofficial MyAnimeList API
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 AnimeHub. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for anime fans
          </p>
        </div>
      </div>
    </footer>
  );
}
