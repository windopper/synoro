"use client";

import { memo, useState } from "react";
import { useAppSelector } from "../lib/hooks";
import ShipStatusOverview from "./ship/ShipStatusOverview";
import NavigationPanel from "./navigation/NavigationPanel";
import SystemDiagnosticsPanel from "./systems/SystemDiagnosticsPanel";
import TabButton from "./ui/TabButton";
import { Navigation, Ship, Cpu, Settings } from "lucide-react";

function CommandPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [view, setView] = useState<"nav" | "ship" | "systems" | "settings">(
    "nav"
  );

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  const renderContent = () => {
    switch (view) {
      case "nav":
        return <NavigationPanel />;
      case "ship":
        return <ShipStatusOverview />;
      case "systems":
        return <SystemDiagnosticsPanel />;
      case "settings":
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Settings className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-gray-100 font-mono text-sm font-medium">
                Configuration Panel
              </div>
              <div className="text-gray-400 font-mono text-xs mt-2">
                Interface Settings | Audio | Display
              </div>
            </div>
          </div>
        );
      default:
        return <NavigationPanel />;
    }
  };

  return (
    <div className="fixed bottom-4 left-[50%] -translate-x-[50%] flex flex-col items-center z-50">
      {/* Toggle Button */}
      <button onClick={togglePanel} className="mb-2 relative group">
        <div className="w-12 h-6 bg-gray-950 border border-gray-700 relative overflow-hidden rounded">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-green-400" />
        </div>
        <div className="absolute -inset-1 border border-green-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
      </button>

      {/* Main Panel */}
      {isOpen && (
        <div className="relative">
          {/* Main Container */}
          <div className="bg-gray-950 border border-gray-800 overflow-hidden rounded-lg shadow-2xl">
            <div className="flex flex-row h-52">
              {/* Enhanced View Tabs */}
              <div className="flex flex-col bg-black p-2 gap-2 border-r border-gray-800">
                <TabButton
                  icon={<Navigation className="w-4 h-4" />}
                  label="Nav"
                  isActive={view === "nav"}
                  onClick={() => setView("nav")}
                />
                <TabButton
                  icon={<Ship className="w-4 h-4" />}
                  label="Ship"
                  isActive={view === "ship"}
                  onClick={() => setView("ship")}
                />
                <TabButton
                  icon={<Cpu className="w-4 h-4" />}
                  label="Sys"
                  isActive={view === "systems"}
                  onClick={() => setView("systems")}
                />
                <TabButton
                  icon={<Settings className="w-4 h-4" />}
                  label="Cfg"
                  isActive={view === "settings"}
                  onClick={() => setView("settings")}
                />
              </div>

              {/* Content Section */}
              <div className="p-4 w-4xl relative bg-zinc-900">
                {renderContent()}
              </div>
            </div>

            {/* Enhanced Footer Section */}
            <div className="border-t border-gray-800 p-3 relative bg-black">
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-green-400 rounded-full"
                      style={{
                        animationDelay: `${i * 0.3}s`,
                        animation: "pulse 2s infinite",
                      }}
                    />
                  ))}
                </div>
                <div className="text-gray-400 font-mono text-xs uppercase tracking-wider font-medium">
                  Command Interface
                </div>
                <div className="text-green-400 font-mono text-xs font-bold bg-gray-900 px-2 py-1 rounded border border-gray-700">
                  READY
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// memo
export default memo(CommandPanel);
