'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MascotProps {
  name: string;
  imageSrc: string;
  position?: string;
  ctaText: string;
}

const Mascot: React.FC<MascotProps> = ({
  name,
  imageSrc,
  position = 'bottom-4 right-4',
  ctaText,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Mascot */}
      <div
        className={`fixed ${position} z-50 cursor-pointer transition-transform duration-300 hover:scale-105 animate-pulse`}
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openModal()}
        aria-label={`Open ${name} mascot information`}
      >
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <Image
            src={imageSrc}
            alt={`${name} mascot`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 80px, 96px"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mascot-modal-title"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="float-right text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={imageSrc}
                alt={`${name} mascot`}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <h2 id="mascot-modal-title" className="text-xl font-bold text-center mb-2">
              {name}
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Hi! I'm {name}, your guide to Hello Gorgeous Med Spa. I'm here to help with any questions about our services.
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