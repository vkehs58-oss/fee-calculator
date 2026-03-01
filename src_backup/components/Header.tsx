const Header = () => (
  <>
    {/* 내비게이션 바 — 브랜드 로고 포함 */}
    <nav className="bg-white px-4 py-3 border-b border-toss-gray-200 sticky top-0 z-50">
      <div className="max-w-lg mx-auto flex items-center gap-2.5">
        <img
          src="/logo_final.png"
          alt="배달 수수료 계산기"
          className="w-7 h-7 rounded-lg"
        />
        <span className="text-[16px] font-bold text-toss-gray-900">
          배달 수수료 계산기
        </span>
      </div>
    </nav>

    {/* 타이틀 영역 */}
    <header className="bg-white px-5 pt-4 pb-5">
      <div className="max-w-lg mx-auto">
        <h1 className="text-[22px] font-bold text-toss-gray-900 leading-tight">
          내 매장 수수료, 어디가 유리할까?
        </h1>
        <p className="text-[14px] text-toss-gray-500 mt-1">
          배달앱 수수료를 비교하고 최적의 플랫폼을 찾아보세요
        </p>
      </div>
    </header>
  </>
);

export default Header;
