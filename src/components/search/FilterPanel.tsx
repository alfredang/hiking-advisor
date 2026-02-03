'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button, Checkbox, Slider } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { formatDistance, formatElevation } from '@/lib/utils';
import { DIFFICULTY_CONFIG, TRAIL_TYPE_LABELS, FACILITY_CONFIG } from '@/lib/constants';
import type { Difficulty, TrailType, TrailFacilities } from '@/types';

const difficulties: Difficulty[] = ['easy', 'moderate', 'hard'];
const trailTypes: TrailType[] = ['loop', 'out-and-back', 'point-to-point'];
const facilities: (keyof TrailFacilities)[] = ['parking', 'toilets', 'waterPoints', 'campsites'];

export function FilterPanel() {
  const { filters, setFilters, resetFilters, useImperialUnits, isFilterPanelOpen, toggleFilterPanel } = useStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['difficulty']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleDifficultyChange = (difficulty: Difficulty, checked: boolean) => {
    const newDifficulties = checked
      ? [...filters.difficulty, difficulty]
      : filters.difficulty.filter((d) => d !== difficulty);
    setFilters({ difficulty: newDifficulties });
  };

  const handleTrailTypeChange = (type: TrailType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.trailType, type]
      : filters.trailType.filter((t) => t !== type);
    setFilters({ trailType: newTypes });
  };

  const handleFacilityChange = (facility: keyof TrailFacilities, checked: boolean) => {
    const newFacilities = checked
      ? [...filters.facilities, facility]
      : filters.facilities.filter((f) => f !== facility);
    setFilters({ facilities: newFacilities });
  };

  const hasActiveFilters =
    filters.difficulty.length > 0 ||
    filters.trailType.length > 0 ||
    filters.facilities.length > 0 ||
    filters.distanceRange[0] > 0 ||
    filters.distanceRange[1] < 50 ||
    filters.elevationRange[0] > 0 ||
    filters.elevationRange[1] < 2000;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFilterPanel}
          className="gap-2 px-0 hover:bg-transparent"
        >
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="h-5 w-5 rounded-full bg-forest-600 text-white text-xs flex items-center justify-center">
              {filters.difficulty.length + filters.trailType.length + filters.facilities.length}
            </span>
          )}
          {isFilterPanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-gray-500">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {isFilterPanelOpen && (
        <div className="space-y-4 pt-2">
          {/* Difficulty */}
          <FilterSection
            title="Difficulty"
            isExpanded={expandedSections.includes('difficulty')}
            onToggle={() => toggleSection('difficulty')}
          >
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <Checkbox
                  key={difficulty}
                  label={
                    <span className="flex items-center gap-2">
                      <span
                        className={cn('h-2 w-2 rounded-full', DIFFICULTY_CONFIG[difficulty].color)}
                      />
                      {DIFFICULTY_CONFIG[difficulty].label}
                    </span>
                  }
                  checked={filters.difficulty.includes(difficulty)}
                  onChange={(checked) => handleDifficultyChange(difficulty, checked)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Distance */}
          <FilterSection
            title="Distance"
            isExpanded={expandedSections.includes('distance')}
            onToggle={() => toggleSection('distance')}
          >
            <Slider
              min={0}
              max={50}
              step={1}
              value={filters.distanceRange}
              onChange={(value) => setFilters({ distanceRange: value })}
              formatValue={(v) => formatDistance(v, useImperialUnits)}
            />
          </FilterSection>

          {/* Elevation */}
          <FilterSection
            title="Elevation Gain"
            isExpanded={expandedSections.includes('elevation')}
            onToggle={() => toggleSection('elevation')}
          >
            <Slider
              min={0}
              max={2000}
              step={50}
              value={filters.elevationRange}
              onChange={(value) => setFilters({ elevationRange: value })}
              formatValue={(v) => formatElevation(v, useImperialUnits)}
            />
          </FilterSection>

          {/* Trail Type */}
          <FilterSection
            title="Trail Type"
            isExpanded={expandedSections.includes('trailType')}
            onToggle={() => toggleSection('trailType')}
          >
            <div className="space-y-2">
              {trailTypes.map((type) => (
                <Checkbox
                  key={type}
                  label={TRAIL_TYPE_LABELS[type]}
                  checked={filters.trailType.includes(type)}
                  onChange={(checked) => handleTrailTypeChange(type, checked)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Facilities */}
          <FilterSection
            title="Facilities"
            isExpanded={expandedSections.includes('facilities')}
            onToggle={() => toggleSection('facilities')}
          >
            <div className="space-y-2">
              {facilities.map((facility) => (
                <Checkbox
                  key={facility}
                  label={FACILITY_CONFIG[facility].label}
                  checked={filters.facilities.includes(facility)}
                  onChange={(checked) => handleFacilityChange(facility, checked)}
                />
              ))}
            </div>
          </FilterSection>
        </div>
      )}
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
      </button>
      {isExpanded && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
}
