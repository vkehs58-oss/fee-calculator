import { useState, useEffect } from 'react';
import { RegionId } from '../types';
import { platforms } from '../data/platforms';
import { formatWon } from '../utils/calculator';

interface PlatformInput {
  orderAmount: string;
  orderCount: string;
  discountAmount: string; // 고객할인비용
  adCost: string; // 광고비
}

interface PlatformResult {
  platformId: string;
  platformName: string;
  platformColor: string;
  orderAmount: number;
  orderCount: number;
  avgOrderPrice: number;
  discountAmount: number;
  adCost: number;
  commissionBase: number; // 수수료 산정 기준 금액
  commissionRate: number;
  commissionFee: number;
  deliveryFee: number;
  pgFee: number;
  vat: number;
  totalFee: number;
  expectedDeposit: number;
}

const STORAGE_KEY = 'fee-calc-settlement';
const DEFAULT_INPUTS: Record<string, PlatformInput> = {
  baemin: { orderAmount: '', orderCount: '', discountAmount: '', adCost: '' },
  coupang: { orderAmount: '', orderCount: '', discountAmount: '', adCost: '' },
  yogiyo: { orderAmount: '', orderCount: '', discountAmount: '', adCost: '' },
  ddanggyo: { orderAmount: '', orderCount: '', discountAmount: '', adCost: '' },
};

const REGION_OPTIONS: { id: RegionId; label: string }[] = [
  { id: 'seoul', label: '서울' },
  { id: 'incheon', label: '인천' },
  { id: 'metro', label: '경기/수도권' },
  { id: 'local', label: '지방' },
];

function loadSavedData(): { inputs: Record<string, PlatformInput>; region: RegionId } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        inputs: parsed.inputs || DEFAULT_INPUTS,
        region: parsed.region || 'seoul',
      };
    }
  } catch { /* ignore */ }
  return { inputs: DEFAULT_INPUTS, region: 'seoul' };
}

const MonthlySettlement = () => {
  const [expanded, setExpanded] = useState(false);
  const savedData = loadSavedData();
  const [region, setRegion] = useState<RegionId>(savedData.region);
  const [inputs, setInputs] = useState<Record<string, PlatformInput>>(savedData.inputs);

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, region }));
  }, [inputs, region]);

  const parseNumber = (value: string): number => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const formatNumber = (value: string): string => {
    const num = value.replace(/[^0-9]/g, '');
    if (num === '') return '';
    return parseInt(num).toLocaleString();
  };

  const handleInputChange = (platformId: string, field: keyof PlatformInput, value: string) => {
    const formatted = formatNumber(value);
    setInputs((prev) => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        [field]: formatted,
      },
    }));
  };

  const calculatePlatformFee = (platformId: string): PlatformResult | null => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform) return null;

    const input = inputs[platformId];
    const orderAmount = parseNumber(input.orderAmount);
    const orderCount = parseNumber(input.orderCount);
    const discountAmount = parseNumber(input.discountAmount);
    const adCost = parseNumber(input.adCost);

    if (orderAmount === 0 && orderCount === 0) return null;

    // 평균객단가
    const avgOrderPrice = orderCount > 0 ? Math.round(orderAmount / orderCount) : 0;

    // 중개수수료 산정 기준 금액
    // 배달의민족: 할인 후 금액 기준 (고객할인비용 차감)
    // 쿠팡이츠: 할인 전 금액 기준 (원래 주문금액)
    let commissionBase = orderAmount;
    if (platformId === 'baemin') {
      commissionBase = Math.max(0, orderAmount - discountAmount);
    }
    // 쿠팡이츠, 요기요, 땡겨요는 할인 전 금액(원래 주문금액) 기준

    const tier = platform.tiers[0];
    const commissionRate = tier.commissionRate;
    const commissionFee = Math.round(commissionBase * (commissionRate / 100));

    // 배달비
    let deliveryFeePerOrder = 0;
    if (platform.customDeliveryFee) {
      deliveryFeePerOrder = 2500;
    } else {
      const [min, max] = tier.deliveryFeeByRegion[region];
      deliveryFeePerOrder = Math.round((min + max) / 2);
    }
    const deliveryFee = deliveryFeePerOrder * orderCount;

    // 배달앱 결제수수료
    const pgFee = Math.round(orderAmount * (platform.pgFeeRate / 100));

    // 부가세 (중개수수료 + 배달비 + 결제수수료) × 10%
    const vatBase = commissionFee + deliveryFee + pgFee;
    const vat = Math.round(vatBase * (platform.vatRate / 100));

    const totalFee = commissionFee + deliveryFee + pgFee + vat + adCost;
    const expectedDeposit = orderAmount - totalFee;

    return {
      platformId,
      platformName: platform.name,
      platformColor: platform.color,
      orderAmount,
      orderCount,
      avgOrderPrice,
      discountAmount,
      adCost,
      commissionBase,
      commissionRate,
      commissionFee,
      deliveryFee,
      pgFee,
      vat,
      totalFee,
      expectedDeposit,
    };
  };

  const results = [
    { id: 'baemin', result: calculatePlatformFee('baemin') },
    { id: 'coupang', result: calculatePlatformFee('coupang') },
    { id: 'yogiyo', result: calculatePlatformFee('yogiyo') },
    { id: 'ddanggyo', result: calculatePlatformFee('ddanggyo') },
  ].filter((item) => item.result !== null);

  const totalSales = results.reduce((sum, item) => sum + (item.result?.orderAmount || 0), 0);
  const totalFees = results.reduce((sum, item) => sum + (item.result?.totalFee || 0), 0);
  const totalProfit = totalSales - totalFees;
  const actualFeeRate = totalSales > 0 ? (totalFees / totalSales) * 100 : 0;

  const hasAnyInput = Object.values(inputs).some(
    (input) => input.orderAmount !== '' || input.orderCount !== ''
  );

  return (
    <div className="bg-white rounded-2xl mx-4 mt-6 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-toss-gray-100">
        <h3 className="text-[17px] font-bold text-toss-gray-900 flex items-center gap-2">
          <span>📊</span>
          <span>월말 정산</span>
        </h3>
        <p className="text-[12px] text-toss-gray-400 mt-1">
          이번 달 실제 주문 데이터를 입력하면 플랫폼별 수수료를 계산해드려요
        </p>
      </div>

      {/* 지역 선택 */}
      <div className="px-5 py-3 border-b border-toss-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-toss-gray-600 shrink-0">지역</span>
          <div className="flex gap-1.5 flex-1">
            {REGION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRegion(opt.id)}
                className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  region === opt.id
                    ? 'bg-toss-blue text-white'
                    : 'bg-toss-gray-100 text-toss-gray-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {platforms.map((platform) => {
          const input = inputs[platform.id];
          const orderAmount = parseNumber(input.orderAmount);
          const orderCount = parseNumber(input.orderCount);
          const avgPrice = orderCount > 0 ? Math.round(orderAmount / orderCount) : 0;
          const hasInput = input.orderAmount !== '' || input.orderCount !== '';

          return (
            <div key={platform.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.name[0]}
                </div>
                <span className="text-[14px] font-bold text-toss-gray-900">{platform.name}</span>
                {platform.id === 'baemin' && (
                  <span className="text-[10px] text-toss-gray-400 bg-toss-gray-100 px-1.5 py-0.5 rounded">할인후 기준</span>
                )}
                {platform.id === 'coupang' && (
                  <span className="text-[10px] text-toss-gray-400 bg-toss-gray-100 px-1.5 py-0.5 rounded">할인전 기준</span>
                )}
              </div>

              {/* 주문 금액 & 건수 */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="주문 금액 (원)"
                  value={input.orderAmount}
                  onChange={(e) => handleInputChange(platform.id, 'orderAmount', e.target.value)}
                  className="px-3 py-2.5 text-[14px] border border-toss-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="주문 건수"
                  value={input.orderCount}
                  onChange={(e) => handleInputChange(platform.id, 'orderCount', e.target.value)}
                  className="px-3 py-2.5 text-[14px] border border-toss-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50"
                />
              </div>

              {/* 평균 객단가 표시 */}
              {hasInput && avgPrice > 0 && (
                <p className="text-[11px] text-toss-blue ml-1">
                  평균 객단가 {avgPrice.toLocaleString()}원
                </p>
              )}

              {/* 고객할인비용 & 광고비 */}
              {hasInput && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="고객할인비용 (원)"
                    value={input.discountAmount}
                    onChange={(e) => handleInputChange(platform.id, 'discountAmount', e.target.value)}
                    className="px-3 py-2 text-[13px] border border-toss-gray-150 rounded-xl bg-toss-gray-50 focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="광고비 (원)"
                    value={input.adCost}
                    onChange={(e) => handleInputChange(platform.id, 'adCost', e.target.value)}
                    className="px-3 py-2 text-[13px] border border-toss-gray-150 rounded-xl bg-toss-gray-50 focus:outline-none focus:ring-2 focus:ring-toss-blue focus:ring-opacity-50"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasAnyInput && results.length > 0 && (
        <>
          <div className="border-t border-toss-gray-100">
            <button
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-toss-gray-50 transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="text-[14px] font-medium text-toss-gray-700">
                {expanded ? '상세 내역 접기' : '상세 내역 보기'}
              </span>
              <svg
                className={`w-5 h-5 text-toss-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {expanded && (
            <div className="px-5 pb-4 space-y-4 border-t border-toss-gray-100">
              {results.map(({ id, result }) => {
                if (!result) return null;
                return (
                  <div key={id} className="pt-4 first:pt-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
                        style={{ backgroundColor: result.platformColor }}
                      >
                        {result.platformName[0]}
                      </div>
                      <span className="text-[15px] font-bold text-toss-gray-900">{result.platformName}</span>
                      {result.avgOrderPrice > 0 && (
                        <span className="text-[11px] text-toss-gray-400">
                          객단가 {result.avgOrderPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-toss-gray-600">
                          중개수수료 ({result.commissionRate}%)
                        </span>
                        <span className="font-medium text-toss-gray-800">{formatWon(result.commissionFee)}</span>
                      </div>
                      {result.platformId === 'baemin' && result.discountAmount > 0 && (
                        <p className="text-[11px] text-toss-gray-400 ml-2">
                          할인후 {result.commissionBase.toLocaleString()}원 기준
                        </p>
                      )}
                      <div className="flex justify-between">
                        <span className="text-toss-gray-600">배달비</span>
                        <span className="font-medium text-toss-gray-800">{formatWon(result.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-toss-gray-600">배달앱 결제수수료</span>
                        <span className="font-medium text-toss-gray-800">{formatWon(result.pgFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-toss-gray-600">부가세 (10%)</span>
                        <span className="font-medium text-toss-gray-800">{formatWon(result.vat)}</span>
                      </div>
                      {result.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-toss-gray-600">고객할인비용</span>
                          <span className="font-medium text-toss-orange">{formatWon(result.discountAmount)}</span>
                        </div>
                      )}
                      {result.adCost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-toss-gray-600">광고비</span>
                          <span className="font-medium text-toss-orange">{formatWon(result.adCost)}</span>
                        </div>
                      )}
                      <div className="border-t border-toss-gray-200 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-toss-gray-900">총 수수료</span>
                        <span className="font-bold text-toss-gray-900">{formatWon(result.totalFee)}</span>
                      </div>
                      <div className="bg-toss-gray-50 rounded-lg p-2.5 flex justify-between items-center">
                        <span className="text-toss-gray-600">예상 입금액</span>
                        <span className="font-bold text-toss-blue text-[15px]">
                          {formatWon(result.expectedDeposit)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-gradient-to-br from-toss-blue/10 to-toss-blue/5 px-5 py-5 border-t border-toss-gray-100">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-toss-gray-700">총 매출</span>
                <span className="text-[16px] font-bold text-toss-gray-900">{formatWon(totalSales)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-toss-gray-700">총 수수료</span>
                <span className="text-[16px] font-bold text-toss-red">{formatWon(totalFees)}</span>
              </div>
              <div className="border-t border-toss-blue/20 pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[15px] font-bold text-toss-gray-900">총 순수익</div>
                    <div className="text-[11px] text-toss-gray-500 mt-0.5">
                      실질 수수료율 {actualFeeRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-bold text-toss-blue">{formatWon(totalProfit)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 초기화 버튼 */}
          <div className="px-5 py-3 border-t border-toss-gray-100">
            <button
              onClick={() => {
                setInputs(DEFAULT_INPUTS);
                setExpanded(false);
              }}
              className="w-full py-2.5 rounded-xl text-[13px] font-medium text-toss-gray-500 bg-toss-gray-50 hover:bg-toss-gray-100 active:bg-toss-gray-200 transition-colors"
            >
              입력값 초기화
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlySettlement;
