import { useState } from 'react';

// 공휴일 데이터 (2025~2026)
const HOLIDAYS: Record<string, string> = {
  // 2025
  '2025-01-01': '신정',
  '2025-01-27': '임시공휴일',
  '2025-01-28': '설날 연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날 연휴',
  '2025-03-01': '삼일절',
  '2025-03-03': '대체공휴일',
  '2025-05-05': '어린이날',
  '2025-05-06': '대체공휴일',
  '2025-06-03': '대통령선거일',
  '2025-06-06': '현충일',
  '2025-08-15': '광복절',
  '2025-10-03': '개천절',
  '2025-10-05': '추석 연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석 연휴',
  '2025-10-08': '대체공휴일',
  '2025-10-09': '한글날',
  '2025-12-25': '크리스마스',
  // 2026
  '2026-01-01': '신정',
  '2026-02-16': '설날 연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날 연휴',
  '2026-03-01': '삼일절',
  '2026-03-02': '대체공휴일',
  '2026-05-05': '어린이날',
  '2026-05-24': '부처님오신날',
  '2026-05-25': '대체공휴일',
  '2026-06-06': '현충일',
  '2026-08-15': '광복절',
  '2026-08-17': '대체공휴일',
  '2026-09-24': '추석 연휴',
  '2026-09-25': '추석',
  '2026-09-26': '추석 연휴',
  '2026-10-03': '개천절',
  '2026-10-05': '대체공휴일',
  '2026-10-09': '한글날',
  '2026-12-25': '크리스마스',
};

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getHolidayName(date: Date): string | null {
  return HOLIDAYS[toDateKey(date)] || null;
}

function isHoliday(date: Date): boolean {
  return toDateKey(date) in HOLIDAYS;
}

function isBusinessDay(date: Date): boolean {
  const dow = date.getDay();
  return dow !== 0 && dow !== 6 && !isHoliday(date);
}

function getNextBusinessDay(date: Date): Date {
  const result = new Date(date);
  do {
    result.setDate(result.getDate() + 1);
  } while (!isBusinessDay(result));
  return result;
}

// 영업일 -N일 역산 (정산일 → 매출일)
function subtractBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let subtracted = 0;
  while (subtracted < days) {
    result.setDate(result.getDate() - 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6 && !isHoliday(result)) {
      subtracted++;
    }
  }
  return result;
}

// 영업일 +N일 순산
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6 && !isHoliday(result)) {
      added++;
    }
  }
  return result;
}

// 달력일 -1일 (땡겨요 익일 정산 역산)
function subtractCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

// 특정 정산일에 입금되는 매출일 범위 계산 (영업일 기준 플랫폼)
// 공휴일/주말에 밀린 매출이 다음 영업일에 몰아서 입금됨
function getSalesDateRange(depositDate: Date, businessDays: number): { start: Date; end: Date; count: number } {
  const start = subtractBusinessDays(depositDate, businessDays);
  let end = new Date(start);

  // start 다음날부터 체크: 해당 매출이 같은 정산일에 입금되는지
  while (true) {
    const nextDay = new Date(end);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDeposit = addBusinessDays(nextDay, businessDays);
    if (nextDeposit.getTime() === depositDate.getTime()) {
      end = nextDay;
    } else {
      break;
    }
  }

  const count = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return { start, end, count };
}

interface PlatformSettlement {
  name: string;
  short: string;
  color: string;
  type: 'business' | 'calendar';
  days: number;
  rule: string;
}

const platformSettlements: PlatformSettlement[] = [
  { name: '배달의민족', short: '배', color: '#2AC1BC', type: 'business', days: 3, rule: '영업일 +3' },
  { name: '쿠팡이츠', short: '쿠', color: '#e6282e', type: 'business', days: 4, rule: '영업일 +4' },
  { name: '요기요', short: '요', color: '#fa0050', type: 'business', days: 5, rule: '영업일 +5' },
  { name: '땡겨요', short: '땡', color: '#4a90d9', type: 'business', days: 3, rule: '영업일 +3' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateShort(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}(${WEEKDAYS[date.getDay()]})`;
}

function formatDateFull(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일(${WEEKDAYS[date.getDay()]})`;
}

export default function SettlementInfo() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const selectedDate = new Date(year, month, selectedDay);
  const selectedIsBusinessDay = isBusinessDay(selectedDate);
  const isToday = (day: number) =>
    year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

  // 선택된 날(정산일)에 입금되는 매출일 계산
  const salesInfo = platformSettlements.map((p) => {
    if (p.type === 'calendar') {
      const salesDate = subtractCalendarDays(selectedDate, p.days);
      return {
        ...p,
        salesStart: salesDate,
        salesEnd: salesDate,
        count: 1,
        hasDeposit: true, // 땡겨요는 매일 정산
      };
    }

    // 영업일 기준 플랫폼 - 비영업일에는 입금 없음
    if (!selectedIsBusinessDay) {
      return { ...p, salesStart: null, salesEnd: null, count: 0, hasDeposit: false };
    }

    const range = getSalesDateRange(selectedDate, p.days);
    return {
      ...p,
      salesStart: range.start,
      salesEnd: range.end,
      count: range.count,
      hasDeposit: true,
    };
  });

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
    setSelectedDay(1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
    setSelectedDay(1);
  };

  // 달력 마커
  const getSettlementMarkers = (day: number) => {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    if (dow === 0 || dow === 6 || isHoliday(date)) {
      return [];
    }
    return platformSettlements;
  };

  // 비영업일일 때 다음 영업일
  const nextBizDay = !selectedIsBusinessDay ? getNextBusinessDay(selectedDate) : null;

  return (
    <div className="px-4 mt-8">
      <h3 className="text-[15px] font-bold text-toss-gray-800 mb-3">
        💰 플랫폼별 정산일
      </h3>

      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
        {/* 범례 (캘린더 상단) */}
        <div className="px-4 py-2.5 border-b border-toss-gray-100">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {platformSettlements.map((p) => (
              <div key={p.short} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[10px] text-toss-gray-500 font-medium">{p.name} {p.rule}</span>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-toss-red" />
              <span className="text-[10px] text-toss-gray-500 font-medium">공휴일</span>
            </div>
          </div>
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-toss-gray-100">
          <button onClick={prevMonth} className="p-1.5 hover:bg-toss-gray-50 rounded-lg active:scale-95 transition-all">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-[15px] font-bold text-toss-gray-900">
            {year}년 {month + 1}월
          </span>
          <button onClick={nextMonth} className="p-1.5 hover:bg-toss-gray-50 rounded-lg active:scale-95 transition-all">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-2 pt-2">
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={`text-center text-[11px] font-medium py-1 ${
                i === 0 ? 'text-toss-red' : i === 6 ? 'text-toss-blue' : 'text-toss-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 px-2 pb-2">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const holiday = getHolidayName(date);
            const markers = getSettlementMarkers(day);
            const isSelected = day === selectedDay;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative flex flex-col items-center py-1.5 rounded-lg transition-all ${
                  isSelected ? 'bg-toss-blue-light' : 'hover:bg-toss-gray-50'
                }`}
              >
                <span
                  className={`text-[13px] ${
                    isSelected
                      ? 'font-bold text-toss-blue'
                      : isToday(day)
                      ? 'font-bold text-toss-gray-900'
                      : holiday
                      ? 'text-toss-red font-medium'
                      : dayOfWeek === 0
                      ? 'text-toss-red'
                      : dayOfWeek === 6
                      ? 'text-toss-blue'
                      : 'text-toss-gray-700'
                  }`}
                >
                  {day}
                </span>
                {holiday && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-toss-red mt-0.5" />
                )}
                {isToday(day) && !isSelected && !holiday && (
                  <div className="w-1 h-1 rounded-full bg-toss-blue mt-0.5" />
                )}
                {markers.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {markers.map((m) => (
                      <div key={m.short} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 선택된 날짜 정산 정보 */}
        <div className="border-t border-toss-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <p className="text-[12px] text-toss-gray-500">
              📅 {month + 1}월 {selectedDay}일 ({WEEKDAYS[selectedDate.getDay()]})
              {selectedIsBusinessDay ? ' 입금 내역' : ''}
            </p>
            {getHolidayName(selectedDate) && (
              <span className="text-[10px] text-toss-red bg-red-50 px-1.5 py-0.5 rounded font-medium">
                {getHolidayName(selectedDate)}
              </span>
            )}
          </div>

          {!selectedIsBusinessDay && (
            <div className="bg-toss-gray-50 rounded-xl p-3 mb-3">
              <p className="text-[13px] text-toss-gray-600">
                {getHolidayName(selectedDate) ? '공휴일' : '주말'}로 배민·쿠팡·요기요·땡겨요 입금 없음
              </p>
            </div>
          )}

          <div className="space-y-2">
            {salesInfo.map((p) => {
              if (!p.hasDeposit) return null;

              // 매출일 범위 표시
              let salesLabel: string;
              if (!p.salesStart || !p.salesEnd) return null;

              if (p.count === 1) {
                salesLabel = `${formatDateFull(p.salesStart)} 매출`;
              } else {
                salesLabel = `${formatDateShort(p.salesStart)}~${formatDateShort(p.salesEnd)} 매출 (${p.count}일치)`;
              }

              return (
                <div key={p.short} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.short}
                    </div>
                    <span className="text-[13px] text-toss-gray-700">{p.name}</span>
                  </div>
                  <span className={`text-[12px] font-semibold ${p.count > 1 ? 'text-toss-blue' : 'text-toss-gray-900'}`}>
                    {salesLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 범례는 상단으로 이동됨 */}
      </div>

      <p className="text-[11px] text-toss-gray-400 mt-2 px-1">
        영업일 기준이며, 공휴일은 제외됩니다 (2025~2026년 공휴일 반영)
      </p>
    </div>
  );
}
