'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/glasscard';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { exchanges, cloudRegions, setSelectedPair } = useStore();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const exchangeResults = exchanges
      .filter(exchange => 
        exchange.name.toLowerCase().includes(query.toLowerCase()) ||
        exchange.region.toLowerCase().includes(query.toLowerCase())
      )
      .map(exchange => ({
        id: exchange.id,
        name: exchange.name,
        type: 'exchange' as const,
        subtitle: `${exchange.region} (${exchange.cloudProvider.toUpperCase()})`,
      }));

    const regionResults = cloudRegions
      .filter(region => 
        region.name.toLowerCase().includes(query.toLowerCase()) ||
        region.code.toLowerCase().includes(query.toLowerCase())
      )
      .map(region => ({
        id: region.id,
        name: region.name,
        type: 'region' as const,
        subtitle: `${region.code} - ${region.provider.toUpperCase()}`,
      }));

    return [...exchangeResults, ...regionResults].slice(0, 8);
  }, [query, exchanges, cloudRegions]);

  const handleResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'exchange') {
      setSelectedPair(result.id);
    }
    setQuery('');
    setIsExpanded(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search exchanges or regions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && query && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                         border-b border-gray-200 dark:border-gray-600 last:border-b-0"
              >
                <div className="font-medium text-sm">{result.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {result.type === 'exchange' ? '🏢' : '☁️'} {result.subtitle}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No results */}
      {isExpanded && query && searchResults.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-4 text-center text-gray-500 dark:text-gray-400">
            No results found for &quot;{query}&quot;
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
