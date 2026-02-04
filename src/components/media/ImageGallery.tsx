'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LightboxModal } from './LightboxModal';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  trailName: string;
}

export function ImageGallery({ images, trailName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  // Show max 4 images in grid
  const displayImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <>
      <div
        className={cn(
          'grid gap-2',
          displayImages.length === 1 && 'grid-cols-1',
          displayImages.length === 2 && 'grid-cols-2',
          displayImages.length >= 3 && 'grid-cols-2'
        )}
      >
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'relative overflow-hidden rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500',
              index === 0 && displayImages.length >= 3 && 'col-span-2 aspect-[2/1]',
              (index > 0 || displayImages.length < 3) && 'aspect-square'
            )}
          >
            <Image
              src={image}
              alt={`${trailName} - Photo ${index + 1}`}
              fill
              className="object-cover gallery-image"
              sizes="(max-width: 768px) 50vw, 200px"
              unoptimized
            />
            {index === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">+{remainingCount}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <LightboxModal
          images={images}
          initialIndex={selectedIndex}
          trailName={trailName}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
