import { useThree } from "@react-three/fiber";
import { useAppSelector } from "../lib/hooks";
import { Html } from "@react-three/drei";

export default function BackToCurrentPositionFloatingButton() {
  const { controls } = useThree();
  const shipPosition = useAppSelector((state) => state.shipSystems.position);

  const handleBackToPosition = () => {
    if (controls && 'target' in controls) {
      (controls as any).target.set(shipPosition.x, shipPosition.y, shipPosition.z);
    }
  };

  return (
    <Html position={[shipPosition.x, shipPosition.y, shipPosition.z]} className="pointer-events-auto" zIndexRange={[40, 0]}>
      <div className="relative select-none">
        {/* 레이더 스타일 배경 */}
        <div className="absolute inset-0 bg-black/80 border border-cyan-400/60 rounded backdrop-blur-sm shadow-lg z-0">
          <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>

        {/* 컨텐츠 */}
        <div className="relative z-20 p-1 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded border border-cyan-400/40">
          <button
            onClick={handleBackToPosition}
            className="flex items-center justify-center w-6 h-6 rounded bg-gray-900/90 border border-cyan-400/60 backdrop-blur-sm 
                       hover:bg-gray-800/90 hover:border-cyan-300 transition-all duration-200 hover:scale-110
                       shadow-md hover:shadow-cyan-500/20 group relative overflow-hidden"
          >
            {/* 홀로그램 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* 홈 이모지 */}
            <span className="text-xs relative z-10 group-hover:text-cyan-200 transition-colors duration-200">🏠</span>
            
            {/* 상태 표시기 */}
            <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60" />
            <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
          </button>
        </div>

        {/* 스캔라인 효과 */}
        <div className="absolute inset-0 overflow-hidden rounded pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* 코너 액센트 */}
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/60"></div>
        <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-cyan-400/60"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-cyan-400/60"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-cyan-400/60"></div>
      </div>
    </Html>
  );
}
