import { Platform, RegionInfo } from '../types';

// 지역 목록 (4개)
export const regions: RegionInfo[] = [
  { id: 'seoul', label: '서울/경기', desc: '서울특별시, 경기도' },
  { id: 'incheon', label: '인천', desc: '인천광역시' },
  { id: 'metro', label: '광역시/세종', desc: '부산, 대구, 대전, 광주, 울산, 세종' },
  { id: 'local', label: '그 외', desc: '그 외 시/군 지역' },
];

/*
 * 배달비 데이터 기준:
 * - 배민/쿠팡이츠: 상생요금제 기준, 구간별 고정 금액
 * - 요기요: 동일 구간 체계 적용
 * - 땡겨요: 점주 직접 설정
 */

export const platforms: Platform[] = [
  {
    id: 'baemin',
    name: '배달의민족',
    color: '#2ac1bc',
    vatRate: 10,
    pgFeeRate: 3.0,
    billingCycle: '3개월',
    tiers: [
      {
        label: '1구간 (상위 35%)',
        minPct: 65,
        maxPct: 100,
        commissionRate: 7.8,
        deliveryFeeByRegion: {
          seoul:    [3400, 3400],
          incheon:  [3300, 3300],
          metro:    [3100, 3100],
          local:    [3000, 3000],
        },
        takeoutRate: 6.8,
      },
      {
        label: '2구간 (35~50%)',
        minPct: 50,
        maxPct: 65,
        commissionRate: 6.8,
        deliveryFeeByRegion: {
          seoul:    [3100, 3100],
          incheon:  [3000, 3000],
          metro:    [2800, 2800],
          local:    [2700, 2700],
        },
        takeoutRate: 6.8,
      },
      {
        label: '3구간 (50~80%)',
        minPct: 20,
        maxPct: 50,
        commissionRate: 6.8,
        deliveryFeeByRegion: {
          seoul:    [2900, 2900],
          incheon:  [2800, 2800],
          metro:    [2600, 2600],
          local:    [2500, 2500],
        },
        takeoutRate: 6.8,
      },
      {
        label: '4구간 (하위 20%)',
        minPct: 0,
        maxPct: 20,
        commissionRate: 2.0,
        deliveryFeeByRegion: {
          seoul:    [2900, 2900],
          incheon:  [2800, 2800],
          metro:    [2600, 2600],
          local:    [2500, 2500],
        },
        takeoutRate: 6.8,
      },
    ],
    notes: [
      '부가세 10% 별도',
      '배달앱 결제수수료 3%',
      '매출 산정 주기: 3개월',
      '배민1플러스 기준',
    ],
  },
  {
    id: 'coupang',
    name: '쿠팡이츠',
    color: '#e6282e',
    vatRate: 10,
    pgFeeRate: 3.0,
    billingCycle: '1개월',
    tiers: [
      {
        label: '1구간 (상위 35%)',
        minPct: 65,
        maxPct: 100,
        commissionRate: 7.8,
        deliveryFeeByRegion: {
          seoul:    [3400, 3400],
          incheon:  [3300, 3300],
          metro:    [3100, 3100],
          local:    [3000, 3000],
        },
        takeoutRate: 0,
      },
      {
        label: '2구간 (35~50%)',
        minPct: 50,
        maxPct: 65,
        commissionRate: 6.8,
        deliveryFeeByRegion: {
          seoul:    [3100, 3100],
          incheon:  [3000, 3000],
          metro:    [2800, 2800],
          local:    [2700, 2700],
        },
        takeoutRate: 0,
      },
      {
        label: '3구간 (50~80%)',
        minPct: 20,
        maxPct: 50,
        commissionRate: 6.8,
        deliveryFeeByRegion: {
          seoul:    [2900, 2900],
          incheon:  [2800, 2800],
          metro:    [2600, 2600],
          local:    [2500, 2500],
        },
        takeoutRate: 0,
      },
      {
        label: '4구간 (하위 20%)',
        minPct: 0,
        maxPct: 20,
        commissionRate: 2.0,
        deliveryFeeByRegion: {
          seoul:    [2900, 2900],
          incheon:  [2800, 2800],
          metro:    [2600, 2600],
          local:    [2500, 2500],
        },
        takeoutRate: 0,
      },
    ],
    notes: [
      '부가세 10% 별도',
      '배달앱 결제수수료 3%',
      '매출 산정 주기: 1개월 (배민보다 짧음)',
      '포장 수수료 무료',
    ],
  },
  {
    id: 'yogiyo',
    name: '요기요',
    color: '#fa0050',
    vatRate: 10,
    pgFeeRate: 3.0,
    billingCycle: '미공개',
    tiers: [
      {
        label: '단일 요금',
        minPct: 0,
        maxPct: 100,
        commissionRate: 9.7,
        deliveryFeeByRegion: {
          seoul:    [2900, 2900],
          incheon:  [2900, 2900],
          metro:    [2900, 2900],
          local:    [2900, 2900],
        },
        takeoutRate: 7.7,
      },
    ],
    notes: [
      '중개수수료 9.7% 단일 요금',
      '배달료 전 지역 2,900원',
      '부가세 10% 별도',
    ],
  },
  {
    id: 'ddanggyo',
    name: '땡겨요',
    color: '#4a90d9',
    vatRate: 10,
    pgFeeRate: 0.5,
    billingCycle: '없음',
    customDeliveryFee: true,
    tiers: [
      {
        label: '단일 요금',
        minPct: 0,
        maxPct: 100,
        commissionRate: 2.0,
        deliveryFeeByRegion: {
          seoul:    [0, 0],
          incheon:  [0, 0],
          metro:    [0, 0],
          local:    [0, 0],
        },
        takeoutRate: 0,
      },
    ],
    notes: [
      '공공배달앱 (신한은행 운영)',
      '광고비 없음',
      '배달비 점주 직접 설정',
      '서울사랑상품권 결제 시 수수료 0~0.5%',
      '배달앱 결제수수료 0.5%',
    ],
  },
];

export const getPlatformById = (id: string): Platform | undefined =>
  platforms.find((p) => p.id === id);
