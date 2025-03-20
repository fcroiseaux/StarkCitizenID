'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FranceConnectButtonProps {
  onClick: () => void;
  loading?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

export function FranceConnectButton({ 
  onClick, 
  loading = false,
  size = 'default'
}: FranceConnectButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Set the width based on the size
  const widthMap = {
    sm: 180,
    default: 220,
    lg: 260
  };
  
  const width = widthMap[size];
  const height = Math.round(width * 0.25); // Maintain aspect ratio of button image
  
  if (loading) {
    return (
      <div 
        className="w-full flex justify-center items-center bg-blue-800 text-white rounded"
        style={{ height: `${height}px` }}
      >
        <span className="animate-pulse">Connexion en cours...</span>
      </div>
    );
  }
  
  return (
    <div 
      className="inline-block cursor-pointer transition-transform transform hover:scale-105 active:scale-95"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
        transformOrigin: 'center',
        cursor: 'pointer', // Explicitly set the cursor to pointer
      }}
    >
      <Image 
        src="/FCboutons-10.svg" 
        alt="S'identifier avec FranceConnect"
        width={width}
        height={height}
        className="rounded"
        priority
        style={{ cursor: 'pointer' }} // Also set cursor on the image itself
      />
    </div>
  );
}