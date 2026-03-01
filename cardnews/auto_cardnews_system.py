#!/usr/bin/env python3
"""
배민/쿠팡 카드뉴스 자동 생산 시스템

1. 배민/쿠팡 관련 뉴스 크롤링
2. 사장님 관점 분석
3. 카드뉴스 대본 자동 생성
4. 텔레그램 알림
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os

# Config
TELEGRAM_TOKEN = "8545065026:AAG97qyC4hdQz4B7q_VVqjmZlk-BakYSmDE"
TELEGRAM_CHAT_ID = "-5276140077"
OUTPUT_DIR = "/Users/junb/Desktop/boss/fee-calculator/cardnews/drafts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 키워드
KEYWORDS = [
    "배달의민족", "배민", "우아한형제들",
    "쿠팡이츠", "쿠팡 배달",
    "요기요", "배달앱",
    "배달 수수료", "배달비",
    "배달 플랫폼", "배달대행"
]

def crawl_baemin_coupang_news():
    """배민/쿠팡 관련 뉴스 크롤링 (간단 버전)"""
    news_list = []
    
    # 임시: 수동 뉴스 데이터 (실제로는 RSS 또는 API 사용)
    # TODO: 네이버 뉴스 API 또는 RSS 피드 사용
    
    manual_news = [
        {
            "keyword": "배달의민족",
            "title": "배민 '배민페스타' 3월 한 달간 진행...최대 15% 할인",
            "description": "배달의민족이 3월 2일부터 29일까지 배민페스타를 진행한다. 점주들은 3000원 또는 15% 이상 즉시할인을 설정해야 노출이 강화된다.",
            "link": "https://example.com",
            "date": datetime.now().strftime("%Y-%m-%d")
        },
        {
            "keyword": "쿠팡이츠",
            "title": "쿠팡이츠, 포장 주문 수수료 6.8% 논란",
            "description": "쿠팡이츠가 포장 주문에도 6.8% 수수료를 부과해 점주들의 반발이 커지고 있다.",
            "link": "https://example.com",
            "date": datetime.now().strftime("%Y-%m-%d")
        },
        {
            "keyword": "배달의민족",
            "title": "배민, 1km 거리 제한 일부 지역 시행",
            "description": "배달의민족이 일부 지역에서 1km 거리 제한을 시행하면서 점주들의 매출 감소 우려가 커지고 있다.",
            "link": "https://example.com",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
    ]
    
    # 실제 크롤링 (선택자 업데이트 필요)
    for keyword in KEYWORDS[:3]:
        url = f"https://search.naver.com/search.naver?where=news&query={keyword}&sort=1"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 다양한 선택자 시도
            selectors = [
                '.news_area',
                '.news_wrap',
                'div.news',
                '.list_news'
            ]
            
            for selector in selectors:
                articles = soup.select(selector)[:3]
                if articles:
                    print(f"  ✓ {keyword}: {len(articles)}개 발견 ({selector})")
                    break
            
        except Exception as e:
            print(f"  ✗ 크롤링 오류 ({keyword}): {e}")
    
    # 임시로 수동 뉴스 반환
    print(f"  → 수동 뉴스 {len(manual_news)}개 사용 (크롤링 개선 필요)")
    return manual_news


def analyze_news_angle(news):
    """뉴스의 사장님 관점 분석"""
    title = news['title'].lower()
    desc = news['description'].lower()
    
    # 패턴 분석
    angles = []
    
    if any(x in title + desc for x in ['수수료', '수익', '마진', '비용']):
        angles.append("수수료_이슈")
    
    if any(x in title + desc for x in ['할인', '이벤트', '페스타', '프로모션']):
        angles.append("할인_강요")
    
    if any(x in title + desc for x in ['배달비', '배달료']):
        angles.append("배달비_문제")
    
    if any(x in title + desc for x in ['점주', '사장', '자영업', '소상공인']):
        angles.append("점주_피해")
    
    if any(x in title + desc for x in ['갑질', '횡포', '불공정', '독점']):
        angles.append("갑질_이슈")
    
    return angles


def generate_cardnews_script(news, angle):
    """카드뉴스 대본 자동 생성"""
    
    title = news['title']
    keyword = news['keyword']
    
    # 기본 템플릿
    script = {
        "title": title,
        "keyword": keyword,
        "angle": angle,
        "slides": []
    }
    
    # 컷 1: 커버
    script['slides'].append({
        "slide_num": 1,
        "type": "cover",
        "main_copy": f"{keyword} 뉴스",
        "sub_copy": title[:40] + "...",
        "color": "red/black"
    })
    
    # 앵글별 구성
    if angle == "수수료_이슈":
        script['slides'].extend([
            {
                "slide_num": 2,
                "type": "problem",
                "main_copy": "또 수수료 올리나요?",
                "sub_copy": "사장님 마진은 더 줄어듭니다",
                "color": "yellow"
            },
            {
                "slide_num": 3,
                "type": "calculation",
                "main_copy": "주문 2만원 기준\n현실 계산",
                "sub_copy": "플랫폼 수수료 6.8%~9.8%\n실수령 90% 미만",
                "color": "red"
            }
        ])
    
    elif angle == "할인_강요":
        script['slides'].extend([
            {
                "slide_num": 2,
                "type": "problem",
                "main_copy": "할인 이벤트라는데",
                "sub_copy": "누가 손해 보는 거죠?",
                "color": "yellow"
            },
            {
                "slide_num": 3,
                "type": "reality",
                "main_copy": "할인 100% 사장님 부담",
                "sub_copy": "플랫폼 수수료는 1원도 안 깎음",
                "color": "red"
            }
        ])
    
    elif angle == "점주_피해":
        script['slides'].extend([
            {
                "slide_num": 2,
                "type": "problem",
                "main_copy": "점주들이 왜 힘들까요?",
                "sub_copy": "플랫폼 종속이 답입니다",
                "color": "yellow"
            }
        ])
    
    # 마지막 컷: CTA (항상 동일)
    script['slides'].append({
        "slide_num": 8,
        "type": "cta",
        "main_copy": "배달수수료 계산기",
        "sub_copy": "내 마진 얼마나 깎이는지\n지금 바로 계산하세요",
        "color": "blue",
        "logo": "toss"
    })
    
    return script


def save_draft(script):
    """대본을 파일로 저장"""
    date = datetime.now().strftime("%Y%m%d_%H%M")
    keyword = script['keyword'].replace(' ', '_')
    filename = f"{OUTPUT_DIR}/{date}_{keyword}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(script, f, ensure_ascii=False, indent=2)
    
    return filename


def send_telegram(message):
    """텔레그램 알림"""
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    data = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    requests.post(url, json=data)


def main():
    """메인 실행"""
    print("🔍 배민/쿠팡 뉴스 크롤링 시작...")
    
    news_list = crawl_baemin_coupang_news()
    print(f"✅ 뉴스 {len(news_list)}개 수집 완료")
    
    candidates = []
    
    for news in news_list:
        angles = analyze_news_angle(news)
        
        if angles:
            candidates.append({
                "news": news,
                "angles": angles
            })
    
    print(f"📋 카드뉴스 후보 {len(candidates)}개 발견")
    
    if not candidates:
        print("⚠️ 적합한 뉴스 없음")
        return
    
    # 상위 3개만 대본 생성
    for i, candidate in enumerate(candidates[:3], 1):
        news = candidate['news']
        angle = candidate['angles'][0]  # 첫 번째 앵글 사용
        
        print(f"\n{i}. {news['title'][:50]}...")
        print(f"   앵글: {angle}")
        
        # 대본 생성
        script = generate_cardnews_script(news, angle)
        filename = save_draft(script)
        
        print(f"   저장: {filename}")
    
    # 텔레그램 알림
    message = f"""
🎨 **카드뉴스 대본 {len(candidates[:3])}개 생성 완료!**

{chr(10).join([f"{i}. {c['news']['title'][:40]}... ({c['angles'][0]})" for i, c in enumerate(candidates[:3], 1)])}

📁 위치: `{OUTPUT_DIR}/`

다음 단계:
1. 대본 검토
2. 제미나이에게 이미지 요청
3. CapCut 합성
4. 인스타 발행
"""
    
    send_telegram(message)
    print("\n✅ 완료! 텔레그램 알림 전송됨")


if __name__ == "__main__":
    main()
