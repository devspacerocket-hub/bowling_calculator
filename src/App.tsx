import React, { useState, useMemo } from 'react';
import { Frame, RollValue } from './types/bowling';
import { calculateScores } from './lib/bowling';
import ScoreBoard from './components/ScoreBoard';
import ExplanationPanel from './components/ExplanationPanel';
import { RotateCcw, PlayCircle } from 'lucide-react';

const INITIAL_FRAMES: Frame[] = Array(10).fill(null).map(() => ({
  first: null,
  second: null,
}));

const EXAMPLE_GAME: Frame[] = [
  { first: 10, second: null }, // 1: Strike
  { first: 7, second: 'F' },   // 2: 7, Foul
  { first: 8, second: 2 },     // 3: Spare
  { first: 'F', second: 9 },   // 4: Foul, 9
  { first: 10, second: null }, // 5: Strike
  { first: 10, second: null }, // 6: Strike
  { first: 9, second: 0 },     // 7: 9, 0
  { first: 'F', second: 'F' }, // 8: Foul, Foul
  { first: 10, second: null }, // 9: Strike
  { first: 10, second: 8, third: 2 } // 10: Strike, Spare
];

export default function App() {
  const [frames, setFrames] = useState<Frame[]>(INITIAL_FRAMES);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);

  const explanations = useMemo(() => calculateScores(frames), [frames]);

  const totalScore = useMemo(() => {
    // 마지막으로 계산이 완료된 누적 점수를 찾습니다.
    const validScores = explanations.map(e => e.cumulativeScore).filter(s => s !== null);
    return validScores.length > 0 ? validScores[validScores.length - 1] : 0;
  }, [explanations]);

  const handleRollChange = (frameIndex: number, rollIndex: 'first' | 'second' | 'third', value: RollValue | null) => {
    setFrames(prev => {
      const newFrames = [...prev];
      const frame = { ...newFrames[frameIndex] };
      
      frame[rollIndex] = value;

      // 첫 번째 투구가 변경되었을 때, 두 번째 투구 값 검증 및 초기화
      if (rollIndex === 'first') {
        if (frameIndex !== 9 && value === 10) {
          frame.second = null; // 1~9프레임 스트라이크면 두번째 투구 삭제
        } else if (value !== null && frame.second !== null && value !== 'F' && frame.second !== 'F') {
           if (frameIndex !== 9 && (value as number) + (frame.second as number) > 10) {
             frame.second = null; // 합이 10을 넘으면 초기화
           }
        }
      }

      newFrames[frameIndex] = frame;
      return newFrames;
    });
    setSelectedFrameIndex(frameIndex);
  };

  const handleReset = () => {
    setFrames(INITIAL_FRAMES);
    setSelectedFrameIndex(null);
  };

  const handleExample = () => {
    setFrames(EXAMPLE_GAME);
    setSelectedFrameIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 헤더 영역 */}
        <header className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              🎳 볼링 점수 계산 연습기
            </h1>
            <p className="text-gray-500 mt-2">
              프레임을 입력하면 볼링 점수 계산 과정을 시각적으로 확인할 수 있습니다.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleExample}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-semibold transition-colors"
            >
              <PlayCircle size={20} />
              예제 게임
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw size={20} />
              초기화
            </button>
          </div>
        </header>

        {/* 메인 점수판 영역 */}
        <main className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-gray-800">점수판</h2>
            <div className="text-right">
              <span className="text-sm text-gray-500 font-semibold mr-2">총점</span>
              <span className="text-4xl font-black text-blue-600">{totalScore}</span>
            </div>
          </div>

          <ScoreBoard
            frames={frames}
            explanations={explanations}
            selectedFrameIndex={selectedFrameIndex}
            onSelectFrame={setSelectedFrameIndex}
            onChangeRoll={handleRollChange}
          />

          <ExplanationPanel
            explanation={selectedFrameIndex !== null ? explanations[selectedFrameIndex] : null}
          />
        </main>
      </div>
    </div>
  );
}
