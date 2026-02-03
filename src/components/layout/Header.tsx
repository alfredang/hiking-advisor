'use client';

import { Menu, Mountain, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';

export function Header() {
  const { toggleSidebar, isSidebarOpen, darkMode, toggleDarkMode, useImperialUnits, toggleUnits } = useStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-20">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-forest-600 flex items-center justify-center">
            <Mountain className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900">Trail Finder</h1>
            <p className="text-xs text-gray-500">Discover your next adventure</p>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Unit toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleUnits}
          className="text-xs font-medium"
        >
          {useImperialUnits ? 'mi/ft' : 'km/m'}
        </Button>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
