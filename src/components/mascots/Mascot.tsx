
'use client';

import React, { useState } from 'react';

interface MascotProps {
  name: string;
  videoSrc: string;
  position?: string;
  ctaText: string;
}

const Mascot: React.FC<MascotProps> = ({
  name,
  videoSrc,
  position = 'bottom-4 right-4',
  ctaText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed ${position} z-50 flex flex-col items-end`}>
      {/* Mascot Video Avatar (always visible, always playing) */}
      <div
        className={
          'bg-white shadow-lg rounded-full p-1 flex items-center justify-center border-2 border-pink-500 animate-pulse cursor-pointer hover:scale-105 transition-transform' +
          (isOpen ? ' mb-2' : '')
        }
        style={{ width: 96, height: 96 }}
        tabIndex={0}
        role="button"
        aria-label={`Expand chat with ${name}`}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen((v) => !v)}
      >
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-24 h-24 object-cover rounded-full"
          onError={(e) => {
            console.error('Video failed to load:', e);
          }}
        />
      </div>

      {/* Expandable Chat Panel */}
      {isOpen && (
        <div className="w-80 bg-white rounded-xl shadow-2xl p-6 mb-2 flex flex-col items-center border border-zinc-200 animate-fade-in">
          <h2 className="text-xl font-bold mb-2">Chat with {name}</h2>
          <p className="text-gray-600 mb-4 text-center">
            Hi! I'm {name}, your guide to Hello Gorgeous Med Spa. How can I help you today?
          </p>
          <button
            className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat panel"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Mascot;