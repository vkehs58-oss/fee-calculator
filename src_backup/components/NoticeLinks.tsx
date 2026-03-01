interface NoticeLinkItem {
  platform: string;
  url: string;
  color: string;
}

const noticeLinks: NoticeLinkItem[] = [
  {
    platform: '배달의민족 사장님 공지',
    url: 'https://ceo.baemin.com/notice',
    color: 'bg-[#2AC1BC]',
  },
  {
    platform: '쿠팡이츠 사장님 공지',
    url: 'https://store.coupangeats.com/merchant/management/notice',
    color: 'bg-[#FF6B00]',
  },
  {
    platform: '요기요 사장님 공지',
    url: 'https://ceo.yogiyo.co.kr/notice',
    color: 'bg-[#FF0066]',
  },
  {
    platform: '땡겨요 공지',
    url: 'https://boss.ddangyo.com/#SH0602',
    color: 'bg-[#FF6B35]',
  },
];

export default function NoticeLinks() {
  return (
    <div className="px-4 mt-8">
      <h3 className="text-[15px] font-bold text-toss-gray-800 mb-3">
        🔔 배달앱 공지사항
      </h3>
      
      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
        {noticeLinks.map((link, index) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center justify-between px-4 py-4
              hover:bg-toss-gray-50 active:bg-toss-gray-100
              transition-colors duration-150
              ${index < noticeLinks.length - 1 ? 'border-b border-toss-gray-100' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-[6px] h-[6px] rounded-full ${link.color}`} />
              <span className="text-[14px] font-medium text-toss-gray-800">
                {link.platform}
              </span>
            </div>
            
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="text-toss-gray-400"
            >
              <path 
                d="M7.5 5L12.5 10L7.5 15" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ))}
      </div>
      
      <p className="text-[11px] text-toss-gray-400 mt-2 px-1">
        각 배달 플랫폼의 최신 정책 및 공지사항을 확인하세요
      </p>
    </div>
  );
}
