'use client';

import { Map, List, MessageCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

export function MobileNav() {
  const { isSidebarOpen, toggleSidebar, isChatOpen, toggleChat, activeView, setActiveView, favoriteTrailIds } =
    useStore();

  const navItems = [
    {
      icon: Map,
      label: 'Map',
      active: !isSidebarOpen && !isChatOpen,
      onClick: () => {
        if (isSidebarOpen) toggleSidebar();
        if (isChatOpen) toggleChat();
      },
    },
    {
      icon: List,
      label: 'Trails',
      active: isSidebarOpen && activeView === 'list',
      onClick: () => {
        setActiveView('list');
        if (!isSidebarOpen) toggleSidebar();
        if (isChatOpen) toggleChat();
      },
    },
    {
      icon: Heart,
      label: 'Saved',
      badge: favoriteTrailIds.length > 0 ? favoriteTrailIds.length : undefined,
      active: false,
      onClick: () => {
        // Show saved trails - could be extended
        setActiveView('list');
        if (!isSidebarOpen) toggleSidebar();
      },
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      active: isChatOpen,
      onClick: () => {
        toggleChat();
        if (isSidebarOpen) toggleSidebar();
      },
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative',
              item.active ? 'text-forest-600' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-forest-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
            {item.active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-forest-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
