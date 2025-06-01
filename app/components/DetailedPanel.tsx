'use client'

import { useState } from "react"
import ShipSystemsPanel from "./ship/ShipSystemsPanel";
import { Shapes, X } from "lucide-react";

export default function DetailedPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  if (!isOpen)
    return (
      <div className="absolute bottom-2 right-2 z-10">
        <button
          onClick={togglePanel}
          className="w-12 h-12 bg-black/90 border border-gray-600 relative overflow-hidden rounded-xl
           flex items-center justify-center"
        >
          <Shapes className="w-6 h-6 text-gray-300 hover:text-gray-400 transition-colors duration-300 cursor-pointer" />
        </button>
      </div>
    );

  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
    z-50 bg-black/90 border border-gray-600 w-[90%] h-[90%]">
        <div className="absolute top-0 right-0 p-2 z-10">
            <X className="w-4 h-4 text-gray-300 cursor-pointer" onClick={togglePanel} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
        <div className="absolute -inset-1 border border-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
        <div className="absolute top-0 left-0 w-full h-full">
            <ShipSystemsPanel />
        </div>
    </div>
  );
}