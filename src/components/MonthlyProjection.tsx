import { ComparisonResult } from '../types';
import { formatWon } from '../utils/calculator';

interface Props {
  comparison: ComparisonResult;
  monthlySales: number;
}

const SummaryBox = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="bg-toss-gray-50 rounded-xl p-3 text-center">
    <p className="text-[10px] text-toss-gray-400">{label}</p>
    <p className={`text-[13px] font-bold mt-0.5 ${color}`}>{value}</p>
  </div>
);

const MonthlyProjection = ({ comparison, monthlySales }: Props) => {
  const { cheapest, savingsVsMax } = comparison;

  if (monthlySales <= 0) return null;

  const yearlySavings = savingsVsMax * 12;
  const yearlyFee = cheapest.totalFee * 12;
  const yearlyNet = cheapest.netRevenue * 12;

  return (
    <div className="bg-white rounded-2xl mx-4 mt-4 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-toss-gray-100">
        <h2 className="text-[17px] font-bold text-toss-gray-900">연간 수익 예측</h2>
      </div>

      <div className="px-5 py-4">
        {/* 핵심 수치 카드 */}
        <div className="bg-gradient-to-br from-toss-blue to-toss-blue-dark rounded-2xl p-5 text-white mb-4">
          <p className="text-[13px] opacity-80">
            {cheapest.platformName} 기준 연간 예상 순수익
          </p>
          <p className="text-[28px] font-bold mt-1">
            {formatWon(yearlyNet)}
          </p>
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/20">
            <div>
              <p className="text-[11px] opacity-60">연간 매출</p>
              <p className="text-[14px] font-semibold">{formatWon(monthlySales * 12)}</p>
            </div>
            <div>
              <p className="text-[11px] opacity-60">연간 수수료</p>
              <p className="text-[14px] font-semibold">{formatWon(yearlyFee)}</p>
            </div>
          </div>
        </div>

        {/* 절감 효과 */}
        {yearlySavings > 0 && (
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold text-toss-green">💰 가장 비싼 플랫폼 대비 절감 효과</span>
            </div>
            <div className="text-[24px] font-extrabold text-toss-green tracking-[-0.5px]">
              연 {formatWon(yearlySavings)}
            </div>
            <p className="text-[13px] text-toss-gray-600 mt-1.5">
              매달 <strong className="text-toss-green">{formatWon(savingsVsMax)}</strong>씩 아낄 수 있어요
            </p>
          </div>
        )}

        {/* 월별 요약 */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <SummaryBox label="월 매출" value={formatWon(monthlySales)} color="text-toss-gray-800" />
          <SummaryBox label="월 수수료" value={formatWon(cheapest.totalFee)} color="text-toss-red" />
          <SummaryBox label="월 순수익" value={formatWon(cheapest.netRevenue)} color="text-toss-blue" />
        </div>
      </div>
    </div>
  );
};

export default MonthlyProjection;
