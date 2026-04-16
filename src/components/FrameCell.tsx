import React from 'react';
import { motion } from 'motion/react';
import { Frame, FrameExplanation, RollValue } from '../types/bowling';
import { normalizeRoll } from '../lib/bowling';

interface FrameCellProps {
  key?: React.Key;
  frameIndex: number;
  frame: Frame;
  explanation: FrameExplanation;
  isSelected: boolean;
  onSelect: () => void;
  onChangeRoll: (rollIndex: 'first' | 'second' | 'third', value: RollValue | null) => void;
  isQuizMode?: boolean;
  userAnswer?: string;
  onChangeUserAnswer?: (val: string) => void;
  quizStatus?: 'playing' | 'submitted' | 'revealed';
}

export default function FrameCell({
  frameIndex,
  frame,
  explanation,
  isSelected,
  onSelect,
  onChangeRoll,
  isQuizMode = false,
  userAnswer = '',
  onChangeUserAnswer,
  quizStatus = 'playing',
}: FrameCellProps) {
  const is10th = frameIndex === 9;

  // 입력 가능한 옵션 생성 로직
  const getOptions = (max: number) => {
    const opts: (RollValue | '')[] = [''];
    opts.push('F');
    for (let i = 0; i <= max; i++) {
      opts.push(i);
    }
    return opts;
  };

  const firstNum = normalizeRoll(frame.first);
  const secondNum = normalizeRoll(frame.second);

  // 첫 번째 투구 옵션
  const firstOptions = getOptions(10);

  // 두 번째 투구 옵션
  let secondOptions: (RollValue | '')[] = [];
  let secondDisabled = false;

  if (!is10th) {
    if (frame.first === 10) {
      secondDisabled = true;
    } else if (frame.first !== null) {
      secondOptions = getOptions(10 - firstNum);
    } else {
      secondDisabled = true;
    }
  } else {
    // 10프레임 두 번째 투구
    if (frame.first !== null) {
      if (frame.first === 10) {
        secondOptions = getOptions(10);
      } else {
        secondOptions = getOptions(10 - firstNum);
      }
    } else {
      secondDisabled = true;
    }
  }

  // 세 번째 투구 옵션 (10프레임 전용)
  let thirdOptions: (RollValue | '')[] = [];
  let thirdDisabled = true;

  if (is10th && frame.first !== null && frame.second !== null) {
    if (firstNum + secondNum >= 10) {
      thirdDisabled = false;
      if (frame.second === 10 || firstNum + secondNum === 10) {
        thirdOptions = getOptions(10);
      } else {
        thirdOptions = getOptions(10 - secondNum);
      }
    }
  }

  const handleSelectChange = (
    rollIndex: 'first' | 'second' | 'third',
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = e.target.value;
    if (val === '') {
      onChangeRoll(rollIndex, null);
    } else if (val === 'F') {
      onChangeRoll(rollIndex, 'F');
    } else {
      onChangeRoll(rollIndex, parseInt(val, 10));
    }
  };

  return (
    <div
      onClick={isQuizMode && quizStatus !== 'revealed' ? undefined : onSelect}
      className={`flex flex-col border-2 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'
      } ${isQuizMode && quizStatus !== 'revealed' ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* 프레임 헤더 */}
      <div className="bg-gray-100 text-center text-sm font-semibold py-1 border-b border-gray-300">
        {frameIndex + 1}
      </div>

      {/* 투구 입력칸 */}
      <div className="flex border-b border-gray-300 h-10">
        <select
          value={frame.first === null ? '' : frame.first}
          onChange={(e) => handleSelectChange('first', e)}
          disabled={isQuizMode}
          className={`w-full text-center appearance-none bg-transparent outline-none ${isQuizMode ? '' : 'cursor-pointer hover:bg-gray-200'}`}
        >
          {firstOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {opt === 10 ? 'X' : opt === 0 ? '_' : opt}
            </option>
          ))}
        </select>
        <div className="w-px bg-gray-300" />
        <select
          value={frame.second === null ? '' : frame.second}
          onChange={(e) => handleSelectChange('second', e)}
          disabled={isQuizMode || secondDisabled}
          className={`w-full text-center appearance-none bg-transparent outline-none ${
            isQuizMode || secondDisabled ? 'bg-gray-100 text-gray-400' : 'cursor-pointer hover:bg-gray-200'
          }`}
        >
          {secondOptions.map((opt, i) => {
            const isSpare = !is10th && opt !== '' && opt !== 'F' && firstNum + (opt as number) === 10;
            const is10thSpare = is10th && frame.first !== 10 && opt !== '' && opt !== 'F' && firstNum + (opt as number) === 10;
            return (
              <option key={i} value={opt}>
                {isSpare || is10thSpare ? '/' : opt === 10 ? 'X' : opt === 0 ? '_' : opt}
              </option>
            );
          })}
        </select>
        {is10th && (
          <>
            <div className="w-px bg-gray-300" />
            <select
              value={frame.third === null || frame.third === undefined ? '' : frame.third}
              onChange={(e) => handleSelectChange('third', e)}
              disabled={isQuizMode || thirdDisabled}
              className={`w-full text-center appearance-none bg-transparent outline-none ${
                isQuizMode || thirdDisabled ? 'bg-gray-100 text-gray-400' : 'cursor-pointer hover:bg-gray-200'
              }`}
            >
              {thirdOptions.map((opt, i) => {
                const isThirdSpare = frame.first === 10 && frame.second !== 10 && opt !== '' && opt !== 'F' && secondNum + (opt as number) === 10;
                return (
                  <option key={i} value={opt}>
                    {isThirdSpare ? '/' : opt === 10 ? 'X' : opt === 0 ? '_' : opt}
                  </option>
                );
              })}
            </select>
          </>
        )}
      </div>

      {/* 점수 표시 영역 */}
      <div className={`flex-1 flex flex-col items-center justify-center p-2 min-h-[4rem] overflow-hidden ${isQuizMode ? 'bg-purple-50/50' : ''}`}>
        {isQuizMode ? (
          <div className="w-full flex flex-col items-center">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => onChangeUserAnswer?.(e.target.value)}
              disabled={quizStatus !== 'playing'}
              placeholder="?"
              className={`w-full text-center font-bold text-lg border-2 rounded py-1 outline-none transition-colors ${
                quizStatus === 'playing' 
                  ? 'bg-white border-purple-300 focus:border-purple-500 text-purple-700' 
                  : (quizStatus === 'submitted' || quizStatus === 'revealed')
                    ? (parseInt(userAnswer, 10) === explanation.cumulativeScore
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-red-100 border-red-500 text-red-700')
                    : ''
              }`}
            />
            {quizStatus === 'revealed' && parseInt(userAnswer, 10) !== explanation.cumulativeScore && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-green-600 mt-1"
              >
                정답: {explanation.cumulativeScore}
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <motion.div
              key={explanation.cumulativeScore !== null ? explanation.cumulativeScore : 'empty'}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-gray-800"
            >
              {explanation.cumulativeScore !== null ? explanation.cumulativeScore : '-'}
            </motion.div>
            <motion.div
              key={explanation.shortText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-500 mt-1 text-center"
            >
              {explanation.shortText}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
