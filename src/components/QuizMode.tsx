import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Eye, RotateCcw } from 'lucide-react';

interface QuizModeProps {
  quizStatus: 'playing' | 'submitted' | 'revealed';
  quizScore: number | null;
  onSubmit: () => void;
  onReveal: () => void;
  onNewQuiz: () => void;
}

export default function QuizMode({ quizStatus, quizScore, onSubmit, onReveal, onNewQuiz }: QuizModeProps) {
  return (
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
              onClick={onSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-lg transition-colors shadow-md mt-2"
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
            <div className="flex gap-4 mt-2">
              <button
                onClick={onReveal}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold transition-colors shadow-md"
              >
                <Eye size={20} />
                정답 및 해설 보기
              </button>
              <button
                onClick={onNewQuiz}
                className="flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-bold transition-colors border border-purple-300"
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
              onClick={onNewQuiz}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-lg transition-colors shadow-md mt-2"
            >
              <RotateCcw size={24} />
              새로운 문제 풀기
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
