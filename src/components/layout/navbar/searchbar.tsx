'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { CLOUD_PROVIDERS } from '@/lib/constants';

const SearchBar: React.FC = () => {
  const {
    exchanges,
    filterState,
    setSearchQuery,
    setSelectedExchange
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof exchanges>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on search query
  useEffect(() => {
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase();
      const filtered = exchanges.filter(exchange =>
        exchange.name.toLowerCase().includes(query) ||
        exchange.region.toLowerCase().includes(query) ||
        exchange.cloudProvider.toLowerCase().includes(query)
      ).slice(0, 5); // Limit to 5 suggestions

      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [filterState.searchQuery, exchanges]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (exchange: typeof exchanges[0]) => {
    setSelectedExchange(exchange);
    setSearchQuery(exchange.name);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedExchange(null);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          type="text"
          placeholder="Search exchange servers or regions here..."
          value={filterState.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => filterState.searchQuery && setIsOpen(suggestions.length > 0)}
          className="pl-10 pr-10 bg-white/10 border-white/20 rounded-full text-white placeholder-white/60"
        />
        {filterState.searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            {suggestions.map((exchange, index) => (
              <motion.div
                key={exchange.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(exchange)}
                className="flex items-center p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CLOUD_PROVIDERS[exchange.cloudProvider]?.color || '#6B7280' }}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{exchange.name}</div>
                    <div className="text-white/60 text-xs">
                      {exchange.region} • {exchange.cloudProvider.toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
