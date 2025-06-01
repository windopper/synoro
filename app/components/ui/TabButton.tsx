"use client";

import { ReactNode } from "react";

interface TabButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group p-2 w-20 gap-2 flex flex-row items-center justify-center
        transition-all duration-300 rounded-lg
        ${isActive 
          ? 'bg-gray-700/80 text-gray-100 border border-gray-600/60' 
          : 'bg-gray-900/60 text-gray-500 border border-gray-800/60 hover:bg-gray-800/60 hover:text-gray-300'
        }
      `}
    >
      {/* Background glow effect for active tab */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-50" />
      )}
      
      {/* Icon */}
      <div className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      
      {/* Label */}
      <span className="relative z-10 text-xs font-mono uppercase tracking-wider mt-1">
        {label}
      </span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
      )}
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    </button>
  );
} 