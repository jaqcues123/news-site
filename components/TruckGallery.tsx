"use client";

import { useState } from "react";
import Image from "next/image";

interface TruckGalleryProps {
  images: string[];
  title: string;
}

export default function TruckGallery({ images, title }: TruckGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imgs = images.length > 0 ? images : ["/images/placeholder-truck.jpg"];

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={imgs[active]}
            alt={`${title} — photo ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
            unoptimized={imgs[active].startsWith("/")}
          />
          {imgs.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {active + 1} / {imgs.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {imgs.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                  i === active
                    ? "border-[#FFC700] ring-1 ring-[#FFC700]"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={src.startsWith("/")}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imgs[active]}
              alt={`${title} — full size`}
              fill
              className="object-contain"
              unoptimized={imgs[active].startsWith("/")}
            />
          </div>

          {/* Prev / Next */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a - 1 + imgs.length) % imgs.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg transition"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a + 1) % imgs.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg transition"
              >
                ›
              </button>
            </>
          )}

          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-sm transition"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
