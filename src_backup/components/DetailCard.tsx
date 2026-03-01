import { useState } from 'react';
import { FeeResult } from '../types';
import { formatWon } from '../utils/calculator';

interface Props {
  result: FeeResult;
  isCheapest: boolean;
}

const FeeRow = ({ label, amount, sub, bold }: { label: string; amount: number; sub?: string; bold?: boolean }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-1.5">
      <span className={`text-[13px] ${bold ? 'font-bold text-toss-gray-900' : 'text-toss-gray-600'}`}>
        {label}
      </span>
      {sub && <span className="text-[11px] text-toss-gray-400">({sub})</span>}
    </div>
    <span className={`text-[14px] ${bold ? 'font-bold text-toss-gray-900' : 'font-medium text-toss-gray-800'}`}>
      {formatWon(amount)}
    </span>
  </div>
);

const DetailCard = ({ result: r, isCheapest }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl mx-4 mt-3 overflow-hidden shadow-sm transition-all ${
        isCheapest ? 'ring-2 ring-toss-blue/30' : ''
      }`}
    >
      <button
        className="w-full px-5 py-4 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shrink-0"
            style={{ backgroundColor: r.platformColor }}
          >
            {r.platformName[0]}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-toss-gray-900">{r.platformName}</span>
              {isCheapest && (
                <span className="text-[10px] bg-toss-blue text-white px-1.5 py-0.5 rounded-full font-medium">
                  추천
                </span>
              )}
            </div>
            <span className="text-[12px] text-toss-gray-500">
              {r.tierLabel} · 수수료율 {r.commissionRate}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[16px] font-bold text-toss-gray-900">{formatWon(r.totalFee)}</p>
          <p className="text-[11px] text-toss-gray-400">월 총 수수료</p>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-toss-gray-100">
          <div className="space-y-2 pt-3">
            <FeeRow
              label="중개수수료"
              amount={r.commissionAmount}
              sub={`${r.commissionRate}%`}
            />
            <FeeRow
              label="배달비 (점주부담)"
              amount={r.deliveryFeeTotal}
              sub={`건당 ${r.deliveryFeePerOrder.toLocaleString()}원`}
            />
            <FeeRow
              label="배달앱 결제수수료"
              amount={r.pgFeeAmount}
              sub={`${r.pgFeeRate}%`}
            />
            <FeeRow label="부가세 (10%)" amount={r.vatAmount} />
            <div className="border-t border-toss-gray-200 pt-2 mt-2">
              <FeeRow label="총 수수료" amount={r.totalFee} bold />
            </div>
            <div className="bg-toss-gray-50 rounded-xl p-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-toss-gray-600">예상 순수익</span>
                <span className={`text-[17px] font-bold ${r.netRevenue >= 0 ? 'text-toss-blue' : 'text-toss-red'}`}>
                  {formatWon(r.netRevenue)}
                </span>
              </div>
              <p className="text-[11px] text-toss-gray-400 mt-1">
                실질 수수료율 {r.feeRate}% · 매출 대비 순수익률 {r.netRevenue > 0 ? Math.round((r.netRevenue / (r.netRevenue + r.totalFee)) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCard;
