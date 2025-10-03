'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { FiMessageCircle, FiClock } from 'react-icons/fi';
import { Conversation } from '@/lib/types/conversation';
import { formatRelativeTime, truncateText } from '@/lib/utils/common';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onConversationSelect: (conversation: Conversation) => void;
}

export function ConversationList({ 
  conversations, 
  isLoading, 
  onConversationSelect 
}: ConversationListProps) {
  const [displayedConversations, setDisplayedConversations] = useState<Conversation[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 10;

  // Initialize displayed conversations
  useEffect(() => {
    if (conversations.length > 0) {
      setDisplayedConversations(conversations.slice(0, ITEMS_PER_PAGE));
      setHasMore(conversations.length > ITEMS_PER_PAGE);
    }
  }, [conversations]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedConversations.length;
      const nextItems = conversations.slice(currentLength, currentLength + ITEMS_PER_PAGE);
      
      setDisplayedConversations(prev => [...prev, ...nextItems]);
      setHasMore(currentLength + nextItems.length < conversations.length);
      setLoadingMore(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner size="md" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <FiMessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first conversation to get started
        </p>
      </div>
    );
  }

  return (
    <div className=" overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
      {displayedConversations.map((conversation) => (
        <Card
          key={conversation.id}
          isPressable
          className="cursor-pointer transition-all duration-200 hover:bg-accent/50 "
          onClick={() => onConversationSelect(conversation)}
        >
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {conversation.title}
                </h3>
                {conversation.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {truncateText(conversation.description, 100)}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <FiClock className="h-3 w-3" />
                  <span>{formatRelativeTime(conversation.updated_at)}</span>
                </div>
              </div>
              <FiMessageCircle className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}

      {/* Intersection observer target */}
      {/* {hasMore && <div ref={observerRef} className="h-1" />} */}

      
    </div>
  );
}