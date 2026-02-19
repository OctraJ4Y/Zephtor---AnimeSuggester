import { useState, useEffect } from 'react';
import { 
  Search, 
  LogOut, 
  Menu, 
  X, 
  List,
  Sparkles,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';

interface HeaderProps {
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onOpenAuth, onNavigate, currentPage }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUserStore();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'suggestions', label: 'Suggestions', icon: Sparkles },
    ...(isAuthenticated ? [{ id: 'dashboard', label: 'My List', icon: List }] : []),
  ];
  
  const handleLogout = () => {
    logout();
    onNavigate('home');
  };
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0f0f0f]/90 backdrop-blur-lg border-b border-[#2a2a2a]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
              AnimeHub
            </span>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.id
                    ? 'text-white bg-purple-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{user?.username}</span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={onOpenAuth}
                  className="text-gray-300 hover:text-white hover:bg-white/5"
                >
                  Log In
                </Button>
                <Button
                  onClick={onOpenAuth}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2a2a2a]">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentPage === link.id
                      ? 'text-white bg-purple-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-medium">{user?.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onOpenAuth();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border-[#2a2a2a] text-white hover:bg-white/5"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => {
                      onOpenAuth();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
