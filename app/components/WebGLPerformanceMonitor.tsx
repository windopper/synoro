"use client";

import React, { useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface PerformanceStats {
  fps: number;
  memory: {
    geometries: number;
    textures: number;
    programs: number;
  };
  render: {
    calls: number;
    triangles: number;
    points: number;
    lines: number;
  };
}

// AIDEV-NOTE: WebGL 성능 모니터링 컴포넌트
export const WebGLPerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memory: { geometries: 0, textures: 0, programs: 0 },
    render: { calls: 0, triangles: 0, points: 0, lines: 0 }
  });
  const [isVisible, setIsVisible] = useState(false);
  
  const { gl } = useThree();
  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    // FPS 계산 (1초마다 업데이트)
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      
      setStats({
        fps,
        memory: {
          geometries: gl.info.memory.geometries,
          textures: gl.info.memory.textures,
          programs: gl.info.programs?.length || 0
        },
        render: {
          calls: gl.info.render.calls,
          triangles: gl.info.render.triangles,
          points: gl.info.render.points,
          lines: gl.info.render.lines
        }
      });
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  // Ctrl+Shift+P로 성능 모니터 토글
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-gray-700 z-50 text-sm font-mono">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-green-400 font-semibold">WebGL Performance</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={stats.fps > 50 ? 'text-green-400' : stats.fps > 30 ? 'text-yellow-400' : 'text-red-400'}>
            {stats.fps}
          </span>
        </div>
        
        <div className="border-t border-gray-600 pt-1 mt-2">
          <div className="text-gray-300 text-xs mb-1">Memory</div>
          <div className="flex justify-between">
            <span>Geometries:</span>
            <span>{stats.memory.geometries}</span>
          </div>
          <div className="flex justify-between">
            <span>Textures:</span>
            <span>{stats.memory.textures}</span>
          </div>
          <div className="flex justify-between">
            <span>Programs:</span>
            <span>{stats.memory.programs}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-1 mt-2">
          <div className="text-gray-300 text-xs mb-1">Render Calls</div>
          <div className="flex justify-between">
            <span>Calls:</span>
            <span>{stats.render.calls}</span>
          </div>
          <div className="flex justify-between">
            <span>Triangles:</span>
            <span>{stats.render.triangles.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}; 