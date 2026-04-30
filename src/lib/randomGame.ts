import { Frame, ScoringMode, RollValue } from '../types/bowling';

export function generateRandomGame(scoringMode: ScoringMode): Frame[] {
  const frames: Frame[] = [];
  
  const getRandomRoll = (max: number): RollValue => {
    if (Math.random() < 0.05) return 'F'; // 5% 확률로 파울
    return Math.floor(Math.random() * (max + 1));
  };

  for (let i = 0; i < 9; i++) {
    const first = getRandomRoll(10);
    if (first === 10) {
      frames.push({ first: 10, second: null });
    } else {
      const firstNum = first === 'F' ? 0 : first;
      const second = getRandomRoll(10 - firstNum);
      frames.push({ first, second });
    }
  }

  // 10프레임
  const first10 = getRandomRoll(10);
  const first10Num = first10 === 'F' ? 0 : first10;
  let second10: RollValue | null = null;
  let third10: RollValue | null = null;

  if (scoringMode === 'asian-games') {
    if (first10 === 10) {
      // 아시안게임 방식은 보너스 투구 없음
      frames.push({ first: 10, second: null });
    } else {
      second10 = getRandomRoll(10 - first10Num);
      frames.push({ first: first10, second: second10 });
    }
  } else {
    // 기존 (traditional)
    if (first10 === 10) {
      second10 = getRandomRoll(10);
      const second10Num = second10 === 'F' ? 0 : second10;
      if (second10 === 10) {
        third10 = getRandomRoll(10);
      } else {
        third10 = getRandomRoll(10 - second10Num);
      }
    } else {
      second10 = getRandomRoll(10 - first10Num);
      const second10Num = second10 === 'F' ? 0 : second10;
      if (first10Num + second10Num === 10) {
        third10 = getRandomRoll(10);
      }
    }
    frames.push({ first: first10, second: second10, third: third10 });
  }
  
  return frames;
}
