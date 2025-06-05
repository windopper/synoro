"use client";

import { ReactNode } from "react";

interface TabButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TabButton({
  icon,
  label,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group p-2 w-20 gap-2 flex flex-row items-center justify-center
        transition-all duration-300 rounded-lg
        ${
          isActive
            ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
            : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`relative z-10 transition-all duration-200 ${
          isActive
            ? "scale-110 text-green-400"
            : "group-hover:scale-105 group-hover:text-green-400"
        }`}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className={`relative z-10 text-xs font-mono uppercase tracking-wider mt-1 font-medium ${
          isActive ? "text-gray-200" : "group-hover:text-gray-300"
        }`}
      >
        {label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-400 rounded-full" />
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    </button>
  );
}
