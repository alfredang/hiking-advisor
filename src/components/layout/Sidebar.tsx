'use client';

import { X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { SearchResults } from '@/components/search/SearchResults';
import { TrailDetails } from '@/components/trail/TrailDetails';

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar, activeView, selectedTrail, selectTrail, setActiveView } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-40 w-full sm:w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold">
            {activeView === 'list' ? 'Find Trails' : selectedTrail?.name || 'Trail Details'}
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeView === 'list' ? (
            <>
              {/* Search section */}
              <div className="p-4 space-y-4 border-b border-gray-200">
                <SearchBar />
                <FilterPanel />
              </div>

              {/* Results section */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <SearchResults />
              </div>
            </>
          ) : (
            <>
              {/* Back button */}
              <div className="p-4 border-b border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectTrail(null);
                    setActiveView('list');
                  }}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to results
                </Button>
              </div>

              {/* Trail details */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {selectedTrail && <TrailDetails trail={selectedTrail} />}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
