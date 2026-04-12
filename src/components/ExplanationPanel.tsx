import React from 'react';
import { FrameExplanation } from '../types/bowling';

interface ExplanationPanelProps {
  explanation: FrameExplanation | null;
}

const typeTextMap = {
  strike: '스트라이크',
  spare: '스페어',
  open: '오픈',
  pending: '진행 중 (미확정)',
};

export default function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  if (!explanation) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 h-40 flex items-center justify-center">
        프레임을 선택하면 계산 과정이 표시됩니다
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-sm h-40 flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
          {explanation.frameIndex + 1}프레임
        </span>
        <h3 className="text-lg font-bold text-gray-800">
          {explanation.frameIndex + 1}프레임은 <span className="text-blue-600">{typeTextMap[explanation.type]}</span>입니다.
        </h3>
      </div>
      
      <div className="space-y-2 text-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold w-20">계산식:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm text-pink-600 font-mono">
            {explanation.formula}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold w-20">누적 점수:</span>
          <span className="text-lg font-bold text-gray-900">
            {explanation.cumulativeScore !== null ? explanation.cumulativeScore : '대기 중'}
          </span>
        </div>
      </div>
    </div>
  );
}
