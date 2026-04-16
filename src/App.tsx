import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Frame, RollValue } from './types/bowling';
import { calculateScores, generateRandomGame } from './lib/bowling';
import ScoreBoard from './components/ScoreBoard';
import ExplanationPanel from './components/ExplanationPanel';
import { RotateCcw, PlayCircle, BrainCircuit, CheckCircle2, Eye, LogOut } from 'lucide-react';

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

  // 퀴즈 모드 상태
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(10).fill(''));
  const [quizStatus, setQuizStatus] = useState<'playing' | 'submitted' | 'revealed'>('playing');

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
    setIsQuizMode(false);
  };

  const handleExample = () => {
    setFrames(EXAMPLE_GAME);
    setSelectedFrameIndex(0);
    setIsQuizMode(false);
  };

  // 퀴즈 모드 핸들러
  const startQuiz = () => {
    setFrames(generateRandomGame());
    setUserAnswers(Array(10).fill(''));
    setQuizStatus('playing');
    setIsQuizMode(true);
    setSelectedFrameIndex(null);
  };

  const submitQuiz = () => {
    setQuizStatus('submitted');
  };

  const revealQuiz = () => {
    setQuizStatus('revealed');
  };

  const exitQuiz = () => {
    setIsQuizMode(false);
    setFrames(INITIAL_FRAMES);
    setSelectedFrameIndex(null);
  };

  const handleUserAnswerChange = (index: number, val: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = val;
      return newAnswers;
    });
  };

  // 퀴즈 결과 계산
  const quizScore = useMemo(() => {
    if (quizStatus === 'playing') return null;
    let correct = 0;
    explanations.forEach((exp, i) => {
      if (exp.cumulativeScore !== null && parseInt(userAnswers[i], 10) === exp.cumulativeScore) {
        correct++;
      }
    });
    return correct;
  }, [quizStatus, userAnswers, explanations]);

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
            {!isQuizMode ? (
              <>
                <button
                  onClick={startQuiz}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-semibold transition-colors"
                >
                  <BrainCircuit size={20} />
                  랜덤 퀴즈 모드
                </button>
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
              </>
            ) : (
              <button
                onClick={exitQuiz}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-colors"
              >
                <LogOut size={20} />
                퀴즈 모드 종료
              </button>
            )}
          </div>
        </header>

        {/* 메인 점수판 영역 */}
        <main className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-gray-800">점수판</h2>
            <div className="text-right">
              <span className="text-sm text-gray-500 font-semibold mr-2">총점</span>
              <motion.span
                key={isQuizMode && quizStatus !== 'revealed' ? 'hidden' : totalScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-4xl font-black text-blue-600 inline-block"
              >
                {isQuizMode && quizStatus !== 'revealed' ? '?' : totalScore}
              </motion.span>
            </div>
          </div>

          <ScoreBoard
            frames={frames}
            explanations={explanations}
            selectedFrameIndex={selectedFrameIndex}
            onSelectFrame={setSelectedFrameIndex}
            onChangeRoll={handleRollChange}
            isQuizMode={isQuizMode}
            userAnswers={userAnswers}
            onChangeUserAnswer={handleUserAnswerChange}
            quizStatus={quizStatus}
          />

          {isQuizMode && (
            <AnimatePresence mode="wait">
              <motion.div
                key={quizStatus}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm"
              >
                {quizStatus === 'playing' && (
                  <>
                    <h3 className="text-xl font-bold text-purple-800">🤔 각 프레임의 누적 점수를 계산해 보세요!</h3>
                    <p className="text-purple-600">모든 빈칸을 채운 후 제출하기 버튼을 눌러주세요.</p>
                    <button
                      onClick={submitQuiz}
                      className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-lg transition-colors shadow-md"
                    >
                      <CheckCircle2 size={24} />
                      제출하기
                    </button>
                  </>
                )}
                
                {quizStatus === 'submitted' && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800">
                      결과: <span className="text-purple-600">{quizScore}</span> / 10 정답
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={revealQuiz}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold transition-colors shadow-md"
                      >
                        <Eye size={20} />
                        정답 및 해설 보기
                      </button>
                      <button
                        onClick={startQuiz}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-bold transition-colors"
                      >
                        <RotateCcw size={20} />
                        새로운 문제
                      </button>
                    </div>
                  </>
                )}

                {quizStatus === 'revealed' && (
                  <>
                    <h3 className="text-xl font-bold text-gray-800">
                      프레임을 클릭하면 상세 해설을 볼 수 있습니다.
                    </h3>
                    <button
                      onClick={startQuiz}
                      className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-lg transition-colors shadow-md"
                    >
                      <RotateCcw size={24} />
                      새로운 문제 풀기
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {(!isQuizMode || quizStatus === 'revealed') && (
            <ExplanationPanel
              explanation={selectedFrameIndex !== null ? explanations[selectedFrameIndex] : null}
            />
          )}
        </main>
      </div>
    </div>
  );
}
