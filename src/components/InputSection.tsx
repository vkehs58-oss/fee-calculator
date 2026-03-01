import { UserInput, RegionId } from '../types';
import { regions } from '../data/platforms';

interface Props {
  input: UserInput;
  onChange: (input: UserInput) => void;
}

const TIER_OPTIONS = [
  { value: 90, label: '1구간', desc: '상위 35% 이내' },
  { value: 55, label: '2구간', desc: '35%~50%' },
  { value: 40, label: '3구간', desc: '50%~80%' },
  { value: 10, label: '4구간', desc: '하위 20%' },
];

const InputSection = ({ input, onChange }: Props) => {
  // 월매출 변경 → 배달건수 자동 계산 (평균주문금액 유지)
  const handleSalesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const monthlySales = Number(raw) || 0;
    const avgDeliveryCount = input.avgOrderPrice > 0
      ? Math.round(monthlySales / input.avgOrderPrice)
      : input.avgDeliveryCount;
    onChange({ ...input, monthlySales, avgDeliveryCount });
  };

  // 평균주문금액 변경 → 배달건수 자동 계산 (월매출 유지)
  const handleOrderPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const avgOrderPrice = Number(raw) || 0;
    const avgDeliveryCount = avgOrderPrice > 0
      ? Math.round(input.monthlySales / avgOrderPrice)
      : input.avgDeliveryCount;
    onChange({ ...input, avgOrderPrice, avgDeliveryCount });
  };

  // 배달건수 직접 슬라이더 조작 → 평균주문금액 자동 계산 (월매출 유지)
  const handleDeliveryCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avgDeliveryCount = Number(e.target.value) || 0;
    const avgOrderPrice = avgDeliveryCount > 0
      ? Math.round(input.monthlySales / avgDeliveryCount)
      : input.avgOrderPrice;
    onChange({ ...input, avgDeliveryCount, avgOrderPrice });
  };

  const handleDdanggyoFeeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange({ ...input, ddanggyoDeliveryFee: Number(raw) || 0 });
  };

  const update = (key: keyof UserInput, value: number | string) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl mx-4 mt-4 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-toss-gray-100">
        <h2 className="text-[17px] font-bold text-toss-gray-900">매장 정보 입력</h2>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* 월 매출 */}
        <div>
          <label className="block text-[13px] font-medium text-toss-gray-600 mb-2">
            월 매출
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={input.monthlySales ? input.monthlySales.toLocaleString() : ''}
              onChange={handleSalesInput}
              placeholder="0"
              className="w-full h-12 px-4 pr-10 text-[17px] font-medium text-toss-gray-900 bg-toss-gray-50 rounded-xl border border-toss-gray-200 focus:border-toss-blue focus:ring-1 focus:ring-toss-blue outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-toss-gray-400">원</span>
          </div>
          {input.monthlySales > 0 && (
            <p className="text-[12px] text-toss-gray-400 mt-1 ml-1">
              약 {Math.round(input.monthlySales / 10000).toLocaleString()}만원
            </p>
          )}
        </div>

        {/* 평균 주문 금액 */}
        <div>
          <label className="block text-[13px] font-medium text-toss-gray-600 mb-2">
            평균 주문 금액
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={input.avgOrderPrice ? input.avgOrderPrice.toLocaleString() : ''}
              onChange={handleOrderPriceInput}
              placeholder="18,000"
              className="w-full h-12 px-4 pr-10 text-[17px] font-medium text-toss-gray-900 bg-toss-gray-50 rounded-xl border border-toss-gray-200 focus:border-toss-blue focus:ring-1 focus:ring-toss-blue outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-toss-gray-400">원</span>
          </div>
        </div>

        {/* 월 배달 건수 (자동 계산) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[13px] font-medium text-toss-gray-600">
              월 배달 건수
            </label>
            {input.monthlySales > 0 && input.avgOrderPrice > 0 && (
              <span className="text-[11px] text-toss-blue font-medium">
                자동 계산됨
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={10}
              max={5000}
              step={1}
              value={input.avgDeliveryCount}
              onChange={handleDeliveryCountChange}
              className="flex-1 h-1.5 rounded-full appearance-none bg-toss-gray-200 accent-toss-blue"
            />
            <span className="text-[15px] font-semibold text-toss-gray-800 min-w-[70px] text-right">
              {input.avgDeliveryCount.toLocaleString()}건
            </span>
          </div>
          {input.monthlySales > 0 && input.avgOrderPrice > 0 && input.avgDeliveryCount > 0 && (
            <p className="text-[11px] text-toss-gray-400 mt-1 ml-1">
              월매출 {Math.round(input.monthlySales / 10000).toLocaleString()}만원 ÷ 건당 {input.avgOrderPrice.toLocaleString()}원 = {input.avgDeliveryCount.toLocaleString()}건
            </p>
          )}
        </div>

        {/* 지역 선택 */}
        <div>
          <label className="block text-[13px] font-medium text-toss-gray-600 mb-2">
            매장 지역
          </label>
          <div className="grid grid-cols-4 gap-2">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => update('region', r.id)}
                className={`py-2.5 px-2 rounded-xl text-center transition-all border ${
                  input.region === r.id
                    ? 'border-toss-blue bg-toss-blue-light'
                    : 'border-toss-gray-200 bg-toss-gray-50 hover:bg-toss-gray-100'
                }`}
              >
                <span className={`block text-[13px] font-semibold ${
                  input.region === r.id ? 'text-toss-blue' : 'text-toss-gray-800'
                }`}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 매출 구간 */}
        <div>
          <label className="block text-[13px] font-medium text-toss-gray-600 mb-2">
            매출 구간
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('salesTierPct', opt.value)}
                className={`py-3 px-3 rounded-xl text-left transition-all border ${
                  input.salesTierPct === opt.value
                    ? 'border-toss-blue bg-toss-blue-light'
                    : 'border-toss-gray-200 bg-toss-gray-50 hover:bg-toss-gray-100'
                }`}
              >
                <span className={`block text-[14px] font-semibold ${
                  input.salesTierPct === opt.value ? 'text-toss-blue' : 'text-toss-gray-800'
                }`}>
                  {opt.label}
                </span>
                <span className="block text-[11px] text-toss-gray-400 mt-0.5">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 땡겨요 배달비 직접 입력 */}
        <div className="bg-toss-gray-50 rounded-xl p-4 border border-toss-gray-200">
          <label className="block text-[13px] font-medium text-toss-gray-600 mb-1">
            땡겨요 배달비 (건당 점주부담)
          </label>
          <p className="text-[11px] text-toss-gray-400 mb-2">
            땡겨요는 점주가 직접 배달비를 설정합니다
          </p>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={input.ddanggyoDeliveryFee ? input.ddanggyoDeliveryFee.toLocaleString() : ''}
              onChange={handleDdanggyoFeeInput}
              placeholder="2,500"
              className="w-full h-11 px-4 pr-10 text-[15px] font-medium text-toss-gray-900 bg-white rounded-xl border border-toss-gray-200 focus:border-toss-blue focus:ring-1 focus:ring-toss-blue outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-toss-gray-400">원/건</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
