export type RollValue = number | 'F';

export type Frame = {
  first: RollValue | null;
  second: RollValue | null;
  third?: RollValue | null; // 10프레임 전용
};

export type FrameExplanation = {
  frameIndex: number;
  type: 'open' | 'spare' | 'strike' | 'pending';
  shortText: string;
  formula: string;
  frameScore: number | null;
  cumulativeScore: number | null;
};
