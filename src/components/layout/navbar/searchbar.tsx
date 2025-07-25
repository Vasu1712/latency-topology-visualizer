'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { CLOUD_PROVIDERS } from '@/lib/constants';

const SearchBar: React.FC = () => {
  const {
    theme,
    exchanges,
    filterState,
    setSearchQuery,
    addSelectedExchange,
    removeSelectedExchange,
    clearSelectedExchanges
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof exchanges>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Theme-based styles
  const themeStyles = {
    dark: {
      container: 'bg-white/10 border-white/20',
      input: 'text-white placeholder-white/60',
      tag: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      dropdown: 'bg-gray-900/95 border-white/10',
      suggestion: 'hover:bg-white/10 text-white',
      icon: 'text-white/60',
    },
    light: {
      container: 'bg-gray-100/70 border-gray-300/40',
      input: 'text-black placeholder-black',
      tag: 'bg-blue-100 text-blue-800 border-blue-200',
      dropdown: 'bg-white/95 border-gray-200/50',
      suggestion: 'hover:bg-gray-100/70 text-gray-900',
      icon: 'text-gray-500',
    }
  };

  const currentStyles = themeStyles[theme];

  // Generate suggestions based on search query
  useEffect(() => {
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase();
      const selectedIds = filterState.selectedExchanges.map(e => e.id);
      
      const filtered = exchanges.filter(exchange =>
        !selectedIds.includes(exchange.id) && (
          exchange.name.toLowerCase().includes(query) ||
          exchange.region.toLowerCase().includes(query) ||
          exchange.cloudProvider.toLowerCase().includes(query)
        )
      ).slice(0, 5);

      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [filterState.searchQuery, exchanges, filterState.selectedExchanges]);

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
    if (filterState.selectedExchanges.length < 2) {
      addSelectedExchange(exchange);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
  };

  const canAddMore = filterState.selectedExchanges.length < 2;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Selected Exchange Tags */}
      {filterState.selectedExchanges.length > 0 && (
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {filterState.selectedExchanges.map((exchange) => (
            <motion.div
              key={exchange.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${currentStyles.tag} text-sm`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CLOUD_PROVIDERS[exchange.cloudProvider]?.color }}
              />
              <span className="font-medium">{exchange.name}</span>
              <button
                onClick={() => removeSelectedExchange(exchange.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
          {filterState.selectedExchanges.length > 0 && (
            <button
              onClick={clearSelectedExchanges}
              className={`text-xs px-2 py-1 rounded ${
                theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className={`relative rounded-full border ${currentStyles.container} transition-all duration-300`}>
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${currentStyles.icon}`} />
        <Input
          type="text"
          placeholder={
            canAddMore 
              ? `Search exchanges... (${filterState.selectedExchanges.length}/2 selected)`
              : "Maximum 2 exchanges selected"
          }
          value={filterState.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => filterState.searchQuery && setIsOpen(suggestions.length > 0)}
          disabled={!canAddMore}
          className={`pl-10 pr-10 rounded-full border-0 bg-transparent ${currentStyles.input} focus:ring-0 focus:outline-none`}
        />
        {filterState.searchQuery && (
          <button
            onClick={clearSearch}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${currentStyles.icon} hover:opacity-80`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && canAddMore && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full left-0 right-0 mt-2 ${currentStyles.dropdown} backdrop-blur-xl rounded-lg shadow-2xl z-50 overflow-hidden`}
          >
            <div className="p-2">
              <div className={`text-xs font-medium mb-2 px-2 ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
              }`}>
                Add Exchange ({filterState.selectedExchanges.length}/2)
              </div>
              {suggestions.map((exchange, index) => (
                <motion.div
                  key={exchange.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(exchange)}
                  className={`flex items-center p-3 ${currentStyles.suggestion} cursor-pointer rounded-lg transition-colors`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CLOUD_PROVIDERS[exchange.cloudProvider]?.color || '#6B7280' }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{exchange.name}</div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-white/60' : 'text-gray-500'
                      }`}>
                        {exchange.region} • {exchange.cloudProvider.toUpperCase()}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 opacity-60" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
