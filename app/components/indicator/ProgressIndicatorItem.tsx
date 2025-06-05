import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressIndicatorItemProps {
  name: string;
  description?: string;
  value: number; // 1-100 사이의 값
}

const ProgressIndicatorItem: React.FC<ProgressIndicatorItemProps> = ({ name, description, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  // 값을 0-100 범위로 제한
  const clampedValue = Math.max(0, Math.min(100, value));
  
  // 원형 프로그레스를 위한 계산
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;
  
  return (
    <motion.div
      className="flex items-center justify-between gap-2 p-2 py-1 w-64 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-lg hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* 인디케이터 이름 - 좌측 */}
      <motion.div className="flex flex-col gap-0.5" layout>
        <div className="text-[10px] font-light text-gray-200 font-mono tracking-wider">
          {name}
        </div>
        <AnimatePresence>
          {isOpen && description && (
            <motion.div
              className="text-[9px] font-light text-gray-400 font-mono tracking-wider"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              {description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 원형 프로그레스 바 - 우측 */}
      <div className="relative flex items-center justify-center">
        <motion.svg
          className="transform -rotate-90"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          animate={{ 
            width: isOpen ? 40 : 24,
            height: isOpen ? 40 : 24
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          {/* 배경 원 */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="rgb(31, 41, 55)"
            strokeWidth="2"
            fill="transparent"
            className="drop-shadow-sm"
          />
          {/* 프로그레스 원 */}
          <motion.circle
            cx="20"
            cy="20"
            r={radius}
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 6px rgba(34, 197, 94, 0.6))",
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </motion.svg>

        {/* 중앙 퍼센트 표시 - isOpen일 때만 표시 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <span className="text-[8px] font-bold text-green-400 font-mono">
                {Math.round(clampedValue)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 중앙 글로우 효과 */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(34, 197, 94, ${
              clampedValue / 400
            }) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: isOpen ? 1 : 0.6
          }}
          transition={{
            opacity: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            scale: {
              duration: 0.3,
              ease: "easeInOut"
            }
          }}
        />
      </div>
    </motion.div>
  );
};

const MemoizedProgressIndicatorItem = memo(ProgressIndicatorItem);

export default MemoizedProgressIndicatorItem;
