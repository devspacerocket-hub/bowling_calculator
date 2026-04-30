import React from 'react';
import { ScoringMode, AppMode } from '../types/bowling';

interface ModeSelectorProps {
  scoringMode: ScoringMode;
  onScoringModeChange: (mode: ScoringMode) => void;
  appMode: AppMode;
  onAppModeChange: (mode: AppMode) => void;
}

export default function ModeSelector({
  scoringMode,
  onScoringModeChange,
  appMode,
  onAppModeChange,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 text-center md:text-left">점수 방식 선택</label>
        <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <button
            onClick={() => onScoringModeChange('traditional')}
            className={`flex-1 py-2 px-2 text-sm font-bold transition-colors ${
              scoringMode === 'traditional' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            일반 방식
          </button>
          <div className="w-px bg-gray-300" />
          <button
            onClick={() => onScoringModeChange('asian-games')}
            className={`flex-1 py-2 px-2 text-sm font-bold transition-colors ${
              scoringMode === 'asian-games' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            아시안게임 방식
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 text-center md:text-left">앱 모드 선택</label>
        <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <button
            onClick={() => onAppModeChange('input')}
            className={`flex-1 py-2 px-2 text-sm font-bold transition-colors ${
              appMode === 'input' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            입력 모드
          </button>
          <div className="w-px bg-gray-300" />
          <button
            onClick={() => onAppModeChange('quiz')}
            className={`flex-1 py-2 px-2 text-sm font-bold transition-colors ${
              appMode === 'quiz' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            랜덤 퀴즈 모드
          </button>
        </div>
      </div>
    </div>
  );
}
