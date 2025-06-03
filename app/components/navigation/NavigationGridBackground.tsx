"use client";

interface NavigationGridBackgroundProps {
  children: React.ReactNode;
}

export default function NavigationGridBackground({ children }: NavigationGridBackgroundProps) {
  return (
    <div className="h-full w-full relative">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 