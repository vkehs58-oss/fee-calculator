import { ComparisonResult } from '../types';
import { formatWon } from '../utils/calculator';

interface Props {
  comparison: ComparisonResult;
}

const ComparisonCard = ({ comparison }: Props) => {
  const { results, cheapest, savingsVsMax } = comparison;
  const sorted = [...results].sort((a, b) => a.totalFee - b.totalFee);

  return (
    <div className="bg-white rounded-2xl mx-4 mt-4 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-toss-gray-100">
        <h2 className="text-[17px] font-bold text-toss-gray-900">플랫폼 비교</h2>
        {savingsVsMax > 0 && (
          <p className="text-[13px] text-toss-green mt-1">
            {cheapest.platformName} 선택 시 최대 <strong>{formatWon(savingsVsMax)}</strong> 절약
          </p>
        )}
      </div>

      <div className="px-5 py-3">
        {/* 막대 그래프 */}
        <div className="space-y-3 mb-4">
          {sorted.map((r, i) => {
            const maxFee = sorted[sorted.length - 1].totalFee;
            const barWidth = maxFee > 0 ? (r.totalFee / maxFee) * 100 : 0;
            const isCheapest = r.platformId === cheapest.platformId;

            return (
              <div key={r.platformId}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: r.platformColor }}
                    />
                    <span className={`text-[14px] ${isCheapest ? 'font-bold text-toss-gray-900' : 'text-toss-gray-700'}`}>
                      {r.platformName}
                    </span>
                    {isCheapest && i === 0 && (
                      <span className="text-[10px] bg-toss-green text-white px-1.5 py-0.5 rounded-full font-medium">
                        최저
                      </span>
                    )}
                  </div>
                  <span className={`text-[14px] font-semibold ${isCheapest ? 'text-toss-blue' : 'text-toss-gray-800'}`}>
                    {formatWon(r.totalFee)}
                  </span>
                </div>
                <div className="h-2 bg-toss-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: r.platformColor,
                      opacity: isCheapest ? 1 : 0.6,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 실질 수수료율 */}
        <div className="border-t border-toss-gray-100 pt-3 pb-2">
          <p className="text-[11px] text-toss-gray-400 text-center mb-2">월 매출 대비 실질 수수료율</p>
          <div className="grid grid-cols-4 gap-1 text-center">
            {sorted.map((r) => (
              <div key={r.platformId} className="py-1">
                <p className="text-[11px] text-toss-gray-400">{r.platformName}</p>
                <p className="text-[16px] font-bold" style={{ color: r.platformColor }}>
                  {r.feeRate}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
