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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Mascot Trigger */}
      <button
        className={`fixed ${position} z-50 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition-colors animate-pulse`}
        onClick={openModal}
        aria-label={`Open chat with ${name}`}
      >
        💬 {name}
      </button>

      {/* Mascot Chat UI */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mascot-chat-title"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="float-right text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close chat"
            >
              ×
            </button>
            <div className="mb-4">
              <video
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  console.error('Video failed to load:', e);
                  // Fallback: could show a message or static image
                }}
              />
            </div>
            <h2 id="mascot-chat-title" className="text-xl font-bold mb-2">
              Chat with {name}
            </h2>
            <p className="text-gray-600 mb-4">
              Hi! I'm {name}, your guide to Hello Gorgeous Med Spa. How can I help you today?
            </p>
            <button className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
              {ctaText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Mascot;