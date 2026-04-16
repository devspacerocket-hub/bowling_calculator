import React from 'react';
import { Frame, FrameExplanation, RollValue } from '../types/bowling';
import FrameCell from './FrameCell';

interface ScoreBoardProps {
  frames: Frame[];
  explanations: FrameExplanation[];
  selectedFrameIndex: number | null;
  onSelectFrame: (index: number) => void;
  onChangeRoll: (frameIndex: number, rollIndex: 'first' | 'second' | 'third', value: RollValue | null) => void;
  isQuizMode?: boolean;
  userAnswers?: string[];
  onChangeUserAnswer?: (frameIndex: number, val: string) => void;
  quizStatus?: 'playing' | 'submitted' | 'revealed';
}

export default function ScoreBoard({
  frames,
  explanations,
  selectedFrameIndex,
  onSelectFrame,
  onChangeRoll,
  isQuizMode = false,
  userAnswers = [],
  onChangeUserAnswer,
  quizStatus = 'playing',
}: ScoreBoardProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[800px] grid grid-cols-10 gap-1">
        {frames.map((frame, index) => (
          <FrameCell
            key={index}
            frameIndex={index}
            frame={frame}
            explanation={explanations[index]}
            isSelected={selectedFrameIndex === index}
            onSelect={() => onSelectFrame(index)}
            onChangeRoll={(rollIndex, value) => onChangeRoll(index, rollIndex, value)}
            isQuizMode={isQuizMode}
            userAnswer={userAnswers[index]}
            onChangeUserAnswer={(val) => onChangeUserAnswer?.(index, val)}
            quizStatus={quizStatus}
          />
        ))}
      </div>
    </div>
  );
}
