"use client";

import { useCallback, useRef } from "react";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export function UploadArea({ onFileSelect, disabled, isProcessing }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled || isProcessing) return;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) onFileSelect(file);
    },
    [onFileSelect, disabled, isProcessing]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) onFileSelect(file);
      e.target.value = "";
    },
    [onFileSelect]
  );

  const handleClick = () => {
    if (!disabled && !isProcessing) inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer
        transition-all duration-200
        ${disabled || isProcessing ? "cursor-not-allowed opacity-60" : "hover:border-[#E6007E]/50 hover:bg-[#FDF7FA]/50"}
        ${"border-[#E6007E]/30 bg-[#FDF7FA]/30"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled || isProcessing}
      />
      {isProcessing ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#E6007E]/40 border-t-[#E6007E] rounded-full animate-spin" />
          <p className="text-[#5E5E66] text-sm">Analyzing face...</p>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-3">📸</div>
          <p className="text-[#111111] font-semibold mb-1">Upload your photo</p>
          <p className="text-[#5E5E66] text-sm">
            Drag and drop or click to select. JPEG, PNG, or WebP.
          </p>
        </>
      )}
    </div>
  );
}
