import { Frame, FrameExplanation, RollValue } from '../types/bowling';

export function normalizeRoll(value: RollValue | null | undefined): number {
  if (value === 'F' || value === null || value === undefined) return 0;
  return value;
}

export function generateRandomGame(): Frame[] {
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
  return frames;
}

function getNextRolls(frames: Frame[], frameIndex: number, count: number): RollValue[] {
  const rolls: RollValue[] = [];
  for (let i = frameIndex + 1; i < 10; i++) {
    const f = frames[i];
    if (f.first !== null) {
      rolls.push(f.first);
      if (rolls.length === count) return rolls;
    }
    
    // 스트라이크가 아니거나 10프레임인 경우 두 번째 투구 확인
    if (f.first !== 10 || i === 9) {
      if (f.second !== null) {
        rolls.push(f.second);
        if (rolls.length === count) return rolls;
      }
    }
    
    // 10프레임의 세 번째 투구 확인
    if (i === 9 && f.third !== null && f.third !== undefined) {
      rolls.push(f.third);
      if (rolls.length === count) return rolls;
    }
  }
  return rolls;
}

export function calculateScores(frames: Frame[]): FrameExplanation[] {
  const explanations: FrameExplanation[] = [];
  let cumulative = 0;

  for (let i = 0; i < 10; i++) {
    const frame = frames[i];
    const is10th = i === 9;
    const firstNum = normalizeRoll(frame.first);
    const secondNum = normalizeRoll(frame.second);
    const thirdNum = normalizeRoll(frame.third);

    let type: FrameExplanation['type'] = 'pending';
    let shortText = '계산 대기';
    let formula = '입력 대기 중';
    let frameScore: number | null = null;

    if (frame.first === null) {
      // 아무것도 입력되지 않은 상태
      explanations.push({
        frameIndex: i,
        type,
        shortText,
        formula,
        frameScore,
        cumulativeScore: null,
      });
      continue;
    }

    if (is10th) {
      if (firstNum === 10) {
        type = 'strike';
        if (frame.second !== null && frame.third !== null) {
          frameScore = firstNum + secondNum + thirdNum;
          formula = `${frame.first} + ${frame.second} + ${frame.third} = ${frameScore}`;
          shortText = `10 + ${secondNum + thirdNum}보너스`;
        } else {
          shortText = '보너스 계산 대기';
          formula = '10 + 남은 투구 대기';
        }
      } else if (frame.second !== null) {
        if (firstNum + secondNum === 10) {
          type = 'spare';
          if (frame.third !== null) {
            frameScore = 10 + thirdNum;
            formula = `${frame.first} + ${frame.second} + ${frame.third} = ${frameScore}`;
            shortText = `10 + ${thirdNum}보너스`;
          } else {
            shortText = '보너스 계산 대기';
            formula = '10 + 다음 1투구 대기';
          }
        } else {
          type = 'open';
          frameScore = firstNum + secondNum;
          formula = `${frame.first} + ${frame.second} = ${frameScore}`;
          shortText = `${frame.first} + ${frame.second}`;
        }
      } else {
        shortText = '계산 대기';
        formula = `${frame.first} + 다음 투구 대기`;
      }
    } else {
      if (firstNum === 10) {
        type = 'strike';
        const nextRolls = getNextRolls(frames, i, 2);
        if (nextRolls.length === 2) {
          const bonus1 = normalizeRoll(nextRolls[0]);
          const bonus2 = normalizeRoll(nextRolls[1]);
          frameScore = 10 + bonus1 + bonus2;
          formula = `10 + 다음 2투구(${nextRolls[0]}, ${nextRolls[1]}) = ${frameScore}`;
          shortText = `10 + ${bonus1 + bonus2}보너스`;
        } else {
          shortText = '보너스 계산 대기';
          formula = `10 + 다음 2투구 대기 (현재 ${nextRolls.length}개)`;
        }
      } else if (frame.second !== null) {
        if (firstNum + secondNum === 10) {
          type = 'spare';
          const nextRolls = getNextRolls(frames, i, 1);
          if (nextRolls.length === 1) {
            const bonus1 = normalizeRoll(nextRolls[0]);
            frameScore = 10 + bonus1;
            formula = `10 + 다음 1투구(${nextRolls[0]}) = ${frameScore}`;
            shortText = `10 + ${bonus1}보너스`;
          } else {
            shortText = '보너스 계산 대기';
            formula = '10 + 다음 1투구 대기';
          }
        } else {
          type = 'open';
          frameScore = firstNum + secondNum;
          formula = `${frame.first} + ${frame.second} = ${frameScore}`;
          shortText = `${frame.first} + ${frame.second}`;
        }
      } else {
        shortText = '계산 대기';
        formula = `${frame.first} + 다음 투구 대기`;
      }
    }

    if (frameScore !== null) {
      cumulative += frameScore;
    }

    explanations.push({
      frameIndex: i,
      type,
      shortText,
      formula,
      frameScore,
      cumulativeScore: frameScore !== null ? cumulative : null,
    });
  }

  return explanations;
}
