import { useState, useEffect } from 'react';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { AuthModal } from '@/sections/AuthModal';
import { SearchSection } from '@/sections/SearchSection';
import { SuggestionsSection } from '@/sections/SuggestionsSection';
import { UserDashboard } from '@/sections/UserDashboard';
import { Footer } from '@/sections/Footer';
import './App.css';

type Page = 'home' | 'search' | 'suggestions' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
  };
  
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onSearch={handleSearch} onNavigate={handleNavigate} />
            <div className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Featured Anime
                  </h2>
                  <p className="text-gray-400">
                    Discover popular titles from our database
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Featured anime cards will be loaded here */}
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">
                      Use the search or suggestions page to explore anime
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        onClick={() => setCurrentPage('search')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
                        Search Anime
                      </button>
                      <button
                        onClick={() => setCurrentPage('suggestions')}
                        className="px-6 py-3 border border-[#2a2a2a] text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        Get Suggestions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'search':
        return <SearchSection initialQuery={searchQuery} />;
      case 'suggestions':
        return <SuggestionsSection />;
      case 'dashboard':
        return <UserDashboard />;
      default:
        return <Hero onSearch={handleSearch} onNavigate={handleNavigate} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main>
        {renderPage()}
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

export default App;
