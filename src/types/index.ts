// 플랫폼 타입
export type PlatformId = 'baemin' | 'coupang' | 'yogiyo' | 'ddanggyo';

// 지역 타입 (4개: 서울/경기, 인천, 광역시/세종, 그 외)
export type RegionId = 'seoul' | 'incheon' | 'metro' | 'local';

// 매출 구간
export interface SalesTier {
  label: string;
  minPct: number;
  maxPct: number;
  commissionRate: number;
  deliveryFeeByRegion: Record<RegionId, [number, number]>; // [min, max]
  takeoutRate: number;
}

// 플랫폼 정보
export interface Platform {
  id: PlatformId;
  name: string;
  color: string;
  vatRate: number;
  pgFeeRate: number;
  tiers: SalesTier[];
  billingCycle: string;
  notes: string[];
  customDeliveryFee?: boolean; // 땡겨요처럼 직접 입력
}

// 사용자 입력
export interface UserInput {
  monthlySales: number;
  salesTierPct: number;
  avgDeliveryCount: number;
  avgOrderPrice: number;
  region: RegionId;
  ddanggyoDeliveryFee: number; // 땡겨요 배달비 본인부담 (건당)
}

// 계산 결과
export interface FeeResult {
  platformId: PlatformId;
  platformName: string;
  platformColor: string;
  tierLabel: string;
  commissionRate: number;
  commissionAmount: number;
  deliveryFeePerOrder: number;    // 건당 배달비
  deliveryFeeTotal: number;
  takeoutRate: number;
  takeoutFeeAmount: number;
  pgFeeRate: number;
  pgFeeAmount: number;
  vatAmount: number;
  totalFee: number;
  netRevenue: number;
  feeRate: number;
}

// 비교 결과
export interface ComparisonResult {
  results: FeeResult[];
  cheapest: FeeResult;
  mostExpensive: FeeResult;
  savingsVsMax: number;
}

// 지역 정보
export interface RegionInfo {
  id: RegionId;
  label: string;
  desc: string;
}
