import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { FiSearch, FiMessageSquare, FiFolder, FiClock } from 'react-icons/fi';
import { SearchResult } from '../../lib/utils/search';
import { formatRelativeTime } from '../../lib/utils/common';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchResults?: SearchResult[];
  onSearch?: (query: string) => void;
  onSelectResult?: (result: SearchResult) => void;
  isLoading?: boolean;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  searchResults = [],
  onSearch,
  onSelectResult,
  isLoading = false,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() && onSearch) {
        onSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups = {
      messages: [] as SearchResult[],
      projects: [] as SearchResult[],
      sessions: [] as SearchResult[],
    };

    searchResults.forEach(result => {
      if (result.type === 'message') {
        groups.messages.push(result);
      } else if (result.type === 'project') {
        groups.projects.push(result);
      } else if (result.type === 'session') {
        groups.sessions.push(result);
      }
    });

    return groups;
  }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult?.(result);
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'message':
        return FiMessageSquare;
      case 'project':
        return FiFolder;
      case 'session':
        return FiClock;
      default:
        return FiSearch;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <FiSearch className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Search</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Search through your conversations, projects, and chat history
          </p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search conversations, projects, and messages..."
              value={query}
              onValueChange={setQuery}
              startContent={<FiSearch className="h-4 w-4 text-muted-foreground" />}
              variant="bordered"
              size="lg"
              onKeyDown={handleKeyDown}
              autoFocus
              classNames={{
                inputWrapper: "!border-2 !rounded-lg !min-h-[48px]"
              }}
              style={{
                borderColor: 'hsl(var(--foreground))'
              } as React.CSSProperties}
            />

            {/* Search Results */}
            {query.trim() && (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <FiSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Messages */}
                    {groupedResults.messages.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Messages ({groupedResults.messages.length})
                        </h3>
                        <div className="space-y-2">
                          {groupedResults.messages.map((result, index) => {
                            const IconComponent = getResultIcon(result.type);
                            const isSelected = searchResults.indexOf(result) === selectedIndex;
                            
                            return (
                              <Card
                                key={result.id}
                                isPressable
                                className={`transition-colors ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}
                                onClick={() => handleSelectResult(result)}
                              >
                                <CardBody className="p-3">
                                  <div className="flex items-start space-x-3">
                                    <IconComponent className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {highlightText(result.title, query)}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {highlightText(result.content, query)}
                                      </p>
                                      {result.metadata?.timestamp && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {formatRelativeTime(result.metadata.timestamp)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {groupedResults.projects.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Projects ({groupedResults.projects.length})
                        </h3>
                        <div className="space-y-2">
                          {groupedResults.projects.map((result, index) => {
                            const IconComponent = getResultIcon(result.type);
                            const isSelected = searchResults.indexOf(result) === selectedIndex;
                            
                            return (
                              <Card
                                key={result.id}
                                isPressable
                                className={`transition-colors ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}
                                onClick={() => handleSelectResult(result)}
                              >
                                <CardBody className="p-3">
                                  <div className="flex items-start space-x-3">
                                    <IconComponent className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {highlightText(result.title, query)}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {highlightText(result.content, query)}
                                      </p>
                                      {result.metadata?.timestamp && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {formatRelativeTime(result.metadata.timestamp)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sessions */}
                    {groupedResults.sessions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Chat Sessions ({groupedResults.sessions.length})
                        </h3>
                        <div className="space-y-2">
                          {groupedResults.sessions.map((result, index) => {
                            const IconComponent = getResultIcon(result.type);
                            const isSelected = searchResults.indexOf(result) === selectedIndex;
                            
                            return (
                              <Card
                                key={result.id}
                                isPressable
                                className={`transition-colors ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}
                                onClick={() => handleSelectResult(result)}
                              >
                                <CardBody className="p-3">
                                  <div className="flex items-start space-x-3">
                                    <IconComponent className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {highlightText(result.title, query)}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {highlightText(result.content, query)}
                                      </p>
                                      {result.metadata?.timestamp && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {formatRelativeTime(result.metadata.timestamp)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Keyboard Shortcuts Help */}
            {!query.trim() && (
              <div className="text-center py-8">
                <FiSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Search everything</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Use <kbd className="px-1 py-0.5 bg-muted rounded">↑↓</kbd> to navigate results</p>
                  <p>• Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to select</p>
                  <p>• Press <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to close</p>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
