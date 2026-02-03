'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useStore } from '@/store/useStore';
import { generateId } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types';

const SUGGESTED_QUESTIONS = [
  "Is this trail suitable for beginners?",
  "What should I bring today?",
  "Is it safe to hike now?",
  "Recommend similar trails nearby",
];

export function ChatWidget() {
  const {
    isChatOpen,
    toggleChat,
    chatMessages,
    addChatMessage,
    clearChatMessages,
    isChatLoading,
    setIsChatLoading,
    selectedTrail,
    trailWeather,
    trailSuitability,
  } = useStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);

    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          trailContext: selectedTrail,
          weatherContext: trailWeather,
          suitabilityContext: trailSuitability,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      addChatMessage(assistantMessage);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isChatOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-20 right-4 lg:bottom-6 h-14 w-14 rounded-full shadow-lg gap-0"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'fixed z-50 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all',
        'bottom-20 right-4 left-4 lg:bottom-6 lg:left-auto lg:right-6',
        'lg:w-96',
        isMinimized ? 'h-14' : 'h-[500px] max-h-[70vh]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-forest-600 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Trail Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {chatMessages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">
                    Hi! I&apos;m your hiking assistant. Ask me anything about trails, weather, or gear!
                  </p>
                  {selectedTrail && (
                    <p className="text-xs mt-2 text-forest-600">
                      Currently viewing: {selectedTrail.name}
                    </p>
                  )}
                </div>

                {/* Suggested questions */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 text-center">Try asking:</p>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="w-full text-left text-sm p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chatMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isChatLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isChatLoading} />

          {/* Clear chat button */}
          {chatMessages.length > 0 && (
            <button
              onClick={clearChatMessages}
              className="text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
            >
              Clear conversation
            </button>
          )}
        </>
      )}
    </div>
  );
}
