import React from 'react';
import { AppMode, Frame, FrameExplanation, RollValue, ScoringMode } from '../types/bowling';
import FrameCell from './FrameCell';

interface ScoreBoardProps {
  frames: Frame[];
  explanations: FrameExplanation[];
  selectedFrameIndex: number | null;
  onSelectFrame: (index: number) => void;
  onChangeRoll: (frameIndex: number, rollIndex: 'first' | 'second' | 'third', value: RollValue | null) => void;
  scoringMode: ScoringMode;
  appMode: AppMode;
  userAnswers?: string[];
  onChangeUserAnswer?: (frameIndex: number, val: string) => void;
  quizStatus?: 'playing' | 'submitted' | 'revealed';
  quizGrades?: boolean[];
}

export default function ScoreBoard({
  frames,
  explanations,
  selectedFrameIndex,
  onSelectFrame,
  onChangeRoll,
  scoringMode,
  appMode,
  userAnswers = [],
  onChangeUserAnswer,
  quizStatus = 'playing',
  quizGrades = [],
}: ScoreBoardProps) {
  const isQuizMode = appMode === 'quiz';
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
            scoringMode={scoringMode}
            appMode={appMode}
            userAnswer={userAnswers[index]}
            onChangeUserAnswer={(val) => onChangeUserAnswer?.(index, val)}
            quizStatus={quizStatus}
            isGradeCorrect={quizGrades[index]}
          />
        ))}
      </div>
    </div>
  );
}
