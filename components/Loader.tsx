import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#0F9D58]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#0F9D58] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-[#0B1E3F] font-medium animate-pulse">Processing your request...</p>
    </div>
  );
}
