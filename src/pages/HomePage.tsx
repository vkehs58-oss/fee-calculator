import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInput } from '../types';
import { compareAllPlatforms } from '../utils/calculator';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import ComparisonCard from '../components/ComparisonCard';
import DetailCard from '../components/DetailCard';
import MonthlyProjection from '../components/MonthlyProjection';
import MonthlySettlement from '../components/MonthlySettlement';
import SettlementInfo from '../components/SettlementInfo';
import NoticeLinks from '../components/NoticeLinks';

const DEFAULT_INPUT: UserInput = {
  monthlySales: 10000000,
  salesTierPct: 40,
  avgDeliveryCount: 556,
  avgOrderPrice: 18000,
  region: 'seoul',
  ddanggyoDeliveryFee: 2500,
};

type Tab = 'compare' | 'settlement';

interface HomePageProps {
  initialTab?: Tab;
}

export default function HomePage({ initialTab = 'compare' }: HomePageProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState<UserInput>(DEFAULT_INPUT);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const comparison = useMemo(() => compareAllPlatforms(input), [input]);
  const sortedResults = useMemo(
    () => [...comparison.results].sort((a, b) => a.totalFee - b.totalFee),
    [comparison]
  );

  return (
    <div className="min-h-screen bg-toss-gray-100 pb-10">
      <Header />

      <div className="max-w-lg mx-auto">
        {/* 탭 네비게이션 */}
        <div className="px-4 pt-4 pb-1">
          <div className="flex bg-toss-gray-200 rounded-xl p-1">
            <button
              onClick={() => { setActiveTab('compare'); navigate('/compare', { replace: true }); }}
              className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${
                activeTab === 'compare'
                  ? 'bg-white text-toss-blue shadow-sm'
                  : 'text-toss-gray-500'
              }`}
            >
              수수료 비교
            </button>
            <button
              onClick={() => { setActiveTab('settlement'); navigate('/settlement', { replace: true }); }}
              className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${
                activeTab === 'settlement'
                  ? 'bg-white text-toss-blue shadow-sm'
                  : 'text-toss-gray-500'
              }`}
            >
              월말정산
            </button>
          </div>
        </div>

        {activeTab === 'compare' ? (
          <>
            <InputSection input={input} onChange={setInput} />

            {input.monthlySales > 0 && (
              <>
                <ComparisonCard comparison={comparison} />

                <div className="px-4 mt-5 mb-2">
                  <h3 className="text-[15px] font-bold text-toss-gray-800">상세 내역</h3>
                  <p className="text-[12px] text-toss-gray-400">터치하면 수수료 항목별 상세를 볼 수 있어요</p>
                </div>

                {sortedResults.map((r) => (
                  <DetailCard
                    key={r.platformId}
                    result={r}
                    isCheapest={r.platformId === comparison.cheapest.platformId}
                  />
                ))}

                <MonthlyProjection comparison={comparison} monthlySales={input.monthlySales} />
              </>
            )}
          </>
        ) : (
          <MonthlySettlement />
        )}

        <SettlementInfo />
        <NoticeLinks />

        <div className="text-center mt-8 px-4">
          <p className="text-[11px] text-toss-gray-400 leading-relaxed">
            * 실제 수수료는 매장 상황에 따라 달라질 수 있습니다.
            <br />
            * 2026년 2월 기준 공개된 수수료율 기반으로 계산합니다.
            <br />
            * 광고비, 프로모션 비용은 포함되어 있지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
