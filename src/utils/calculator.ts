import { Platform, UserInput, FeeResult, ComparisonResult, SalesTier, RegionId } from '../types';
import { platforms } from '../data/platforms';

function findTier(platform: Platform, salesTierPct: number): SalesTier {
  for (const tier of platform.tiers) {
    if (salesTierPct >= tier.minPct && salesTierPct < tier.maxPct) {
      return tier;
    }
  }
  return platform.tiers[0];
}

function getDeliveryFeePerOrder(
  platform: Platform,
  tier: SalesTier,
  region: RegionId,
  ddanggyoFee: number
): number {
  // 땡겨요는 사용자 직접 입력
  if (platform.customDeliveryFee) {
    return ddanggyoFee;
  }
  const [min, max] = tier.deliveryFeeByRegion[region];
  return Math.round((min + max) / 2);
}

export function calculateFee(platform: Platform, input: UserInput): FeeResult {
  const tier = findTier(platform, input.salesTierPct);

  // 1) 중개수수료 (전체 매출 기준)
  const commissionAmount = Math.round(input.monthlySales * (tier.commissionRate / 100));

  // 2) 배달비 (건당)
  const deliveryFeePerOrder = getDeliveryFeePerOrder(platform, tier, input.region, input.ddanggyoDeliveryFee);
  const deliveryFeeTotal = deliveryFeePerOrder * input.avgDeliveryCount;

  // 3) 배달앱 결제수수료
  const pgFeeAmount = Math.round(input.monthlySales * (platform.pgFeeRate / 100));

  // 4) 부가세 = (중개수수료 + 배달비 + 결제수수료) × 10%
  const vatBase = commissionAmount + deliveryFeeTotal + pgFeeAmount;
  const vatAmount = Math.round(vatBase * (platform.vatRate / 100));

  const totalFee = commissionAmount + deliveryFeeTotal + pgFeeAmount + vatAmount;
  const netRevenue = input.monthlySales - totalFee;
  const feeRate = input.monthlySales > 0 ? (totalFee / input.monthlySales) * 100 : 0;

  return {
    platformId: platform.id,
    platformName: platform.name,
    platformColor: platform.color,
    tierLabel: tier.label,
    commissionRate: tier.commissionRate,
    commissionAmount,
    deliveryFeePerOrder,
    deliveryFeeTotal,
    takeoutRate: 0,
    takeoutFeeAmount: 0,
    pgFeeRate: platform.pgFeeRate,
    pgFeeAmount,
    vatAmount,
    totalFee,
    netRevenue,
    feeRate: Math.round(feeRate * 10) / 10,
  };
}

export function compareAllPlatforms(input: UserInput): ComparisonResult {
  const results = platforms.map((p) => calculateFee(p, input));
  const sorted = [...results].sort((a, b) => a.totalFee - b.totalFee);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];
  const savingsVsMax = mostExpensive.totalFee - cheapest.totalFee;

  return { results, cheapest, mostExpensive, savingsVsMax };
}

export function formatWon(amount: number): string {
  return `${amount.toLocaleString()}원`;
}
