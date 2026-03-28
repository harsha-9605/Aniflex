import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, LogOut, Tv, Film, Disc } from 'lucide-react';

// Static array of Anime genres with representative image URLs for the sidebar
const GENRES = [
  { id: 1, name: 'Action', image: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg' },
  { id: 2, name: 'Adventure', image: 'https://cdn.myanimelist.net/images/anime/1244/138851l.jpg' },
  { id: 3, name: 'Shonen', image: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' },
  { id: 4, name: 'Seinen', image: 'https://cdn.myanimelist.net/images/anime/1000/110531l.jpg' },
  { id: 5, name: 'Romance', image: 'https://cdn.myanimelist.net/images/anime/1122/96435l.jpg' },
  { id: 6, name: 'Comedy', image: 'https://cdn.myanimelist.net/images/anime/1375/121599l.jpg' },
  { id: 7, name: 'Slice of Life', image: 'https://cdn.myanimelist.net/images/anime/3/88286l.jpg' },
  { id: 8, name: 'Isekai', image: 'https://cdn.myanimelist.net/images/anime/11/39717l.jpg' },
  { id: 9, name: 'Fantasy', image: 'https://cdn.myanimelist.net/images/anime/1208/94745l.jpg' },
  { id: 10, name: 'Sci-Fi', image: 'https://cdn.myanimelist.net/images/anime/1935/127974l.jpg' },
  { id: 11, name: 'Horror', image: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg' },
  { id: 12, name: 'Mecha', image: 'https://cdn.myanimelist.net/images/anime/5/73199l.jpg' },
];

const CATEGORIES = ['All', 'Watched', 'Watching', 'Plan to Watch', 'Dropped'];

export default function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchTopAnime();
  }, []);

  const fetchTopAnime = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity');
      const data = await response.json();
      setAnimeList(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchAnime = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchTopAnime();
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&sfw`);
      const data = await response.json();
      setAnimeList(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine score color
  const getScoreColor = (score) => {
    if (!score) return '';
    const num = score * 10;
    if (num >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (num >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  // Helper to render platform icons based on anime type
  const renderPlatformIcons = (type) => {
    const t = type?.toLowerCase() || '';
    return (
      <div className="flex items-center gap-2 text-gray-400">
        {(t === 'tv' || !t) && <Tv className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />}
        {(t === 'movie') && <Film className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />}
        {(t === 'ova' || t === 'ona') && <Disc className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      
      {/* 
        ========================================
        TOP NAVIGATION
        ========================================
      */}
      <header className="flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-[#121212] h-[80px]">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={fetchTopAnime}>
           <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
             <div className="w-6 h-6 rounded-full bg-indigo-600 relative flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-white"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-purple-400 absolute -top-1 -right-1"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-pink-400 absolute -bottom-1 -left-1"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute -bottom-1 -right-1"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-orange-400 absolute -top-1 -left-1"></div>
             </div>
           </div>
           <span className="text-2xl font-black italic tracking-tighter hidden sm:block">Animeflex</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-4xl px-8">
          <form onSubmit={searchAnime} className="relative w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..." 
              className="w-full bg-[#262626] hover:bg-[#303030] focus:bg-white focus:text-black transition-colors rounded-full py-2.5 pl-12 pr-4 text-[15px] placeholder-gray-400 focus:outline-none"
            />
          </form>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-gray-300 transition-all"
          >
            <img 
              src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&bold=true" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-[#1a1a1a] rounded-xl shadow-2xl py-2 border border-white/10 z-50">
              <div className="px-4 py-2 border-b border-white/5 mb-1">
                <p className="text-sm font-semibold truncate">ahars@example.com</p>
              </div>
              <button 
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-white/5 font-medium text-sm flex items-center gap-2 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 
        ========================================
        MAIN LAYOUT
        ========================================
      */}
      <div className="flex pt-[80px]">
        
        {/* SIDEBAR */}
        <aside className="w-64 fixed left-0 bottom-0 top-[80px] overflow-y-auto px-6 py-6 hidden md:block hide-scrollbar">
          <h2 className="text-2xl font-bold mb-6">Genres</h2>
          <nav className="flex flex-col gap-2">
            {GENRES.map((genre) => (
              <button 
                key={genre.id}
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5 group transition-colors text-left"
              >
                <img 
                  src={genre.image} 
                  alt={genre.name} 
                  className="w-8 h-8 rounded-full object-cover bg-gray-800"
                />
                <span className="text-[17px] text-gray-200 group-hover:font-semibold transition-all">
                  {genre.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 p-6 sm:p-10 mb-20 max-w-[1600px]">
          
          <h1 className="text-6xl font-extrabold tracking-tight mb-8">Anime</h1>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Platforms Dropdown mock */}
            <button className="bg-[#262626] hover:bg-[#303030] transition-colors rounded-lg px-4 py-2 flex items-center gap-2 text-[15px] font-medium">
              Platforms
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            
            {/* Custom Category Dropdown */}
            <div className="relative group">
              <button className="bg-[#262626] hover:bg-[#303030] transition-colors rounded-lg px-4 py-2 flex items-center gap-2 text-[15px] font-medium">
                Category: {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {/* Invisible hover area for pseudo dropdown */}
              <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl py-1">
                  {CATEGORIES.map(cat => (
                    <div 
                      key={cat}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/5 ${selectedCategory === cat ? 'font-bold text-white' : 'text-gray-300'}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-[#202020] rounded-2xl h-[300px] animate-pulse"></div>
                ))}
             </div>
          ) : animeList.length === 0 ? (
            <div className="text-gray-400 text-xl font-medium pt-10">No anime found matching your criteria.</div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 gap-y-8">
              {animeList.map((anime) => {
                const title = anime.title_english || anime.title;
                const scoreNum = anime.score ? Math.round(anime.score * 10) : null;
                const scoreColor = getScoreColor(anime.score);
                const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

                return (
                  <div 
                    key={anime.mal_id} 
                    className="bg-[#202020] rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-200 ease-out cursor-pointer flex flex-col"
                  >
                    {/* Image Area - taking majority of height, adapting game hub landscape style */}
                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#1a1a1a]">
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt={title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    
                    {/* Card Content underneath */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Icons & Score Row */}
                      <div className="flex items-center justify-between mb-3">
                        {renderPlatformIcons(anime.type)}
                        
                        {scoreNum !== null && (
                          <div className={`px-2 py-0.5 rounded ${scoreColor} border font-bold text-sm tracking-wide`}>
                            {scoreNum}
                          </div>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-bold leading-tight line-clamp-2" title={title}>
                        {title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* Global CSS for scrollbar override */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}} />
    </div>
  );
}
