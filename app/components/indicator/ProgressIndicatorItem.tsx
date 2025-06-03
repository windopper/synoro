import React, { memo } from 'react';

interface ProgressIndicatorItemProps {
  name: string;
  value: number; // 1-100 사이의 값
}

const ProgressIndicatorItem: React.FC<ProgressIndicatorItemProps> = ({ name, value }) => {
  // 값을 1-100 범위로 제한
  const clampedValue = Math.max(1, Math.min(100, value));
  
  return (
    <div className="flex flex-col">
      {/* 인디케이터 이름 */}
      <div className="text-xs text-gray-300 font-mono uppercase tracking-wider">{name}</div>

      {/* 프로그레스 바 컨테이너 */}
      <div className="flex h-1 bg-gray-900/80 rounded-none">
        <div
          className="h-1 bg-cyan-500"
          style={{ width: `${clampedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

const MemoizedProgressIndicatorItem = memo(ProgressIndicatorItem);

export default MemoizedProgressIndicatorItem;
