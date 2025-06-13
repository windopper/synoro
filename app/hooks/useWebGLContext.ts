import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWebGLContextReturn {
  contextLost: boolean;
  isReady: boolean;
  retryCount: number;
  handleCanvasRef: (canvas: HTMLCanvasElement | null) => void;
}

// AIDEV-NOTE: WebGL 컨텍스트 손실/복구를 처리하는 커스텀 훅
export const useWebGLContext = (): UseWebGLContextReturn => {
  const [contextLost, setContextLost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maxRetries = 3;

  const handleContextLost = useCallback((event: Event) => {
    console.warn('WebGL context lost, preventing default behavior');
    event.preventDefault();
    setContextLost(true);
    setIsReady(false);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored, resetting state');
    setContextLost(false);
    setIsReady(true);
    setRetryCount(0);
  }, []);

  const handleCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    // 이전 캔버스의 이벤트 리스너 제거
    if (canvasRef.current) {
      canvasRef.current.removeEventListener('webglcontextlost', handleContextLost);
      canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored);
    }

    canvasRef.current = canvas;

    if (canvas) {
      // 새 캔버스에 이벤트 리스너 추가
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
      setIsReady(true);
    }
  }, [handleContextLost, handleContextRestored]);

  // 컨텍스트 손실 시 자동 복구 시도
  useEffect(() => {
    if (contextLost && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`WebGL context recovery attempt ${retryCount + 1}/${maxRetries}`);
        setRetryCount(prev => prev + 1);
        
        // 강제로 페이지 새로고침하여 컨텍스트 복구 시도
        if (retryCount === maxRetries - 1) {
          console.warn('Maximum retry attempts reached, reloading page');
          window.location.reload();
        }
      }, 2000 * (retryCount + 1)); // 지수적 백오프

      return () => clearTimeout(timer);
    }
  }, [contextLost, retryCount, maxRetries]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('webglcontextlost', handleContextLost);
        canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, [handleContextLost, handleContextRestored]);

  return {
    contextLost,
    isReady,
    retryCount,
    handleCanvasRef,
  };
}; 