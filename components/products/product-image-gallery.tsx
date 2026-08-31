'use client';

import { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface GalleryImage {
  url: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productColor: string;
  fallbackLabel?: string | null;
}

export default function ProductImageGallery({ images, productColor, fallbackLabel }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const activeImage = images[selected];

  return (
    <div className="flex gap-4">
      {images.length > 1 && (
        <div className="flex flex-col gap-3 order-2">
          {images.map((img, index) => (
            <button
              key={`${img.url}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-colors ${
                index === selected ? 'border-blue-600' : 'border-gray-200 hover:border-blue-300'
              }`}
              style={{ backgroundColor: productColor }}
              aria-label={img.alt}
              aria-pressed={index === selected}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      <div
        className="relative border border-emerald-100 rounded-3xl p-10 aspect-square flex-1 flex items-center justify-center overflow-hidden order-1"
        style={{ backgroundColor: productColor }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border-8 border-white/40" />
          <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-4 border-white/40" />
        </div>

        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="relative z-10 w-full h-full object-contain drop-shadow-lg rounded-2xl"
          />
        ) : (
          <div className="relative z-10 w-48 h-64 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
            <div className="flex-1 flex items-center justify-center bg-emerald-50/60">
              <Stethoscope className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="py-3 text-center">
              <div className="text-xs font-bold tracking-wide text-emerald-700">OMAR</div>
              {fallbackLabel && <div className="text-[11px] text-gray-500">{fallbackLabel}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
