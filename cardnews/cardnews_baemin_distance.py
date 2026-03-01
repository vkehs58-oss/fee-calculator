#!/usr/bin/env python3
"""
카드뉴스: 배민 1km 거리제한 이슈 (10컷)
스타일: 다크 + 그래픽 + 감정 카피
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cardnews_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

W = 1080
H = 1350
FONT_TTC = "/System/Library/Fonts/AppleSDGothicNeo.ttc"

# 색상
BG1 = "#0B1120"
BG2 = "#0F1A2E"
BG3 = "#1A0A10"
RED = "#FF3B3B"
BRED = "#FF5252"
YELLOW = "#FFD600"
BLUE = "#3B9AFF"
WHITE = "#FFFFFF"
LIGHT = "#D8DEE8"
GRAY = "#7A8899"
DGRAY = "#3A4555"
CARD_BG = "#141E30"
CARD_BG2 = "#1C1020"
GREEN = "#4ADE80"
ORANGE = "#FF9F43"


def f(size, bold=False):
    try:
        return ImageFont.truetype(FONT_TTC, size, index=8 if bold else 4)
    except:
        return ImageFont.load_default()


def tw(d, t, ft):
    bb = d.textbbox((0, 0), t, font=ft)
    return bb[2] - bb[0]


def cx(d, t, ft, x1=0, x2=W):
    return x1 + (x2 - x1 - tw(d, t, ft)) // 2


def grad(d, y1, y2, c1, c2):
    r1, g1, b1 = int(c1[1:3],16), int(c1[3:5],16), int(c1[5:7],16)
    r2, g2, b2 = int(c2[1:3],16), int(c2[3:5],16), int(c2[5:7],16)
    for y in range(y1, y2):
        ratio = (y-y1)/max(y2-y1,1)
        d.line([(0,y),(W,y)], fill=(int(r1+(r2-r1)*ratio), int(g1+(g2-g1)*ratio), int(b1+(b2-b1)*ratio)))


def brand(d):
    bf = f(22, True)
    bt = "배달사장님 수수료 연구소"
    d.text((cx(d, bt, bf), H-65), bt, font=bf, fill="#FFFFFF28")


def save(img, name):
    p = os.path.join(OUTPUT_DIR, name)
    img.save(p, "PNG", quality=95)
    print(f"  ✅ {name}")
    return p


def draw_x_mark(d, x, y, size, color=RED):
    s = size
    d.line([(x-s, y-s), (x+s, y+s)], fill=color, width=5)
    d.line([(x-s, y+s), (x+s, y-s)], fill=color, width=5)


def draw_circle_icon(d, x, y, r, bg, text, text_color, text_size=40):
    d.ellipse((x-r, y-r, x+r, y+r), fill=bg)
    ft = f(text_size, True)
    d.text((cx(d, text, ft, x-r, x+r), y - text_size//2 - 3), text, font=ft, fill=text_color)


def draw_arrow_down(d, cx_pos, cy, size, color):
    s = size
    d.rectangle((cx_pos-s//6, cy-s, cx_pos+s//6, cy+s//4), fill=color)
    pts = [(cx_pos, cy+s), (cx_pos-s//2, cy+s//4), (cx_pos+s//2, cy+s//4)]
    d.polygon(pts, fill=color)


# ═══════════════════════════════════════════════
# 1컷: 커버
# ═══════════════════════════════════════════════
def slide_01():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, "#0B1120", "#150A18")

    # 상하단 경고 바
    d.rectangle((0, 0, W, 5), fill=RED)
    d.rectangle((0, H-5, W, H), fill=RED)

    # 경고 삼각형
    tri_y = 200
    tri_s = 60
    cx_pos = W // 2
    pts = [(cx_pos, tri_y - tri_s), (cx_pos - tri_s, tri_y + tri_s//2), (cx_pos + tri_s, tri_y + tri_s//2)]
    d.polygon(pts, fill=RED, outline=YELLOW, width=3)
    ef = f(50, True)
    d.text((cx(d, "!", ef, cx_pos-tri_s, cx_pos+tri_s), tri_y - 25), "!", font=ef, fill=WHITE)

    # 메인
    f1 = f(56, True)
    t1 = "배민이 내 가게"
    d.text((cx(d, t1, f1), 340), t1, font=f1, fill=WHITE)

    f2 = f(60, True)
    t2a, t2b = "문 닫아", "버렸습니다"
    t2a_w = tw(d, t2a, f2)
    total = t2a_w + tw(d, t2b, f2)
    sx = (W - total) // 2
    d.text((sx, 420), t2a, font=f2, fill=RED)
    d.text((sx + t2a_w, 420), t2b, font=f2, fill=WHITE)

    # 서브
    f3 = f(30, False)
    t3 = "1km 거리 주문도 차단당한 사장님 이야기"
    d.text((cx(d, t3, f3), 530), t3, font=f3, fill=GRAY)

    # 가게 아이콘 (사각형 + X)
    icon_y = 720
    d.rounded_rectangle((W//2-70, icon_y-70, W//2+70, icon_y+70), radius=18, fill=CARD_BG, outline=DGRAY, width=2)
    sf = f(50, True)
    d.text((cx(d, "🏪", sf, W//2-70, W//2+70), icon_y-50), "🏪", font=sf, fill=WHITE)
    # 못 쓰면 텍스트로
    draw_x_mark(d, W//2, icon_y, 50, "#FF3B3B50")

    # "준비중" 태그
    tag_f = f(28, True)
    tag_t = "준비중"
    tag_w = tw(d, tag_t, tag_f)
    d.rounded_rectangle((W//2 - tag_w//2 - 20, icon_y + 85, W//2 + tag_w//2 + 20, icon_y + 125), radius=15, fill=RED)
    d.text((cx(d, tag_t, tag_f), icon_y + 88), tag_t, font=tag_f, fill=WHITE)

    # 스와이프
    swf = f(24, False)
    d.text((cx(d, "밀어서 확인 >>>", swf), 1050), "밀어서 확인 >>>", font=swf, fill="#FFFFFF40")

    brand(d)
    return save(img, "dist_01_cover.png")


# ═══════════════════════════════════════════════
# 2컷: 문제 제기
# ═══════════════════════════════════════════════
def slide_02():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, BG2)

    pad = 80

    # 인용부호
    qf = f(80, True)
    d.text((pad, 60), "\"", font=qf, fill=DGRAY)

    # 메인 인용
    f1 = f(44, True)
    d.text((pad, 180), "고객이 전화해서", font=f1, fill=WHITE)
    d.text((pad, 245), "알았습니다", font=f1, fill=YELLOW)

    # 설명
    f2 = f(30, False)
    d.text((pad, 370), "가게에서 800~900m 거리 고객이", font=f2, fill=LIGHT)
    d.text((pad, 415), "주문을 할 수 없었습니다.", font=f2, fill=LIGHT)

    # 강조 박스
    box_y = 510
    d.rounded_rectangle((pad, box_y, W-pad, box_y+90), radius=16, fill="#FF3B3B15", outline="#FF3B3B40", width=1)
    f3 = f(30, True)
    d.text((pad+25, box_y+10), "별도 안내도, 알림도 없이", font=f3, fill=RED)
    f3b = f(26, False)
    d.text((pad+25, box_y+52), "어느 날 갑자기 내 가게가 사라졌습니다", font=f3b, fill=LIGHT)

    # 거리 시각화
    line_y = 720
    d.line([(150, line_y), (930, line_y)], fill=DGRAY, width=3)
    # 가게 점
    draw_circle_icon(d, 250, line_y, 30, BLUE, "가게", WHITE, 18)
    # 고객 점
    draw_circle_icon(d, 750, line_y, 30, GREEN, "고객", WHITE, 18)
    # 거리 표시
    df = f(26, True)
    d.text((cx(d, "800~900m", df, 250, 750), line_y - 55), "800~900m", font=df, fill=YELLOW)
    # X 표시 (차단)
    draw_x_mark(d, 500, line_y, 20, RED)
    xf = f(22, True)
    d.text((cx(d, "주문 차단", xf, 430, 570), line_y + 40), "주문 차단", font=xf, fill=RED)

    # 출처
    sf = f(22, False)
    d.text((pad, 900), "— 점주 A씨 (공정거래조정원 분쟁조정 신청)", font=sf, fill=DGRAY)

    brand(d)
    return save(img, "dist_02_problem.png")


# ═══════════════════════════════════════════════
# 3컷: 현실 설명
# ═══════════════════════════════════════════════
def slide_03():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, BG2)

    pad = 80

    f1 = f(44, True)
    d.text((pad, 80), "배민의 '거리 제한' 정책", font=f1, fill=WHITE)

    # 구분선
    d.line([(pad, 150), (W-pad, 150)], fill="#FFFFFF15", width=2)

    # 플로우차트 스타일
    steps = [
        ("AI가 자동으로", "배달 가능 지역 축소", BLUE),
        ("내 가게가", "\"준비중\"으로 표시", ORANGE),
        ("고객 눈에", "가게가 안 보임", RED),
    ]

    sy = 210
    for i, (line1, line2, color) in enumerate(steps):
        # 카드
        card_y = sy + i * 240
        d.rounded_rectangle((pad, card_y, W-pad, card_y + 150), radius=18, fill=CARD_BG, outline=color+"30", width=2)

        # 번호 원
        draw_circle_icon(d, pad+50, card_y+75, 28, color, str(i+1), WHITE, 28)

        # 텍스트
        f2 = f(32, True)
        f3 = f(28, False)
        d.text((pad+100, card_y+30), line1, font=f2, fill=WHITE)
        d.text((pad+100, card_y+80), line2, font=f3, fill=color)

        # 화살표 (마지막 제외)
        if i < len(steps) - 1:
            arrow_y = card_y + 170
            draw_arrow_down(d, W//2, arrow_y, 18, DGRAY)

    # 결과 강조
    ry = 960
    d.rounded_rectangle((pad, ry, W-pad, ry+100), radius=18, fill="#FF3B3B18", outline=RED, width=2)
    rf = f(34, True)
    rt = "= 사장님 매출 직격탄"
    d.text((cx(d, rt, rf, pad, W-pad), ry+28), rt, font=rf, fill=RED)

    brand(d)
    return save(img, "dist_03_explain.png")


# ═══════════════════════════════════════════════
# 4컷: 피해 규모 (숫자 강조)
# ═══════════════════════════════════════════════
def slide_04():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, "#120A18")

    pad = 80

    f1 = f(38, True)
    d.text((pad, 80), "점심 피크타임 배달 건수", font=f1, fill=WHITE)
    f1b = f(26, False)
    d.text((pad, 130), "실제 점주 A씨 증언 기준", font=f1b, fill=GRAY)

    # Before / After 대형 비교
    # Before
    box_y = 230
    box_h = 280
    mid = W // 2

    # 기존 (왼쪽)
    d.rounded_rectangle((pad, box_y, mid-20, box_y+box_h), radius=20, fill=CARD_BG, outline="#FFFFFF15", width=1)
    lf = f(24, False)
    d.text((cx(d, "기존", lf, pad, mid-20), box_y+20), "기존", font=lf, fill=GRAY)
    nf = f(100, True)
    d.text((cx(d, "6건", nf, pad, mid-20), box_y+70), "6건", font=nf, fill=GREEN)
    uf = f(24, False)
    d.text((cx(d, "점심 1타임", uf, pad, mid-20), box_y+200), "점심 1타임", font=uf, fill=GRAY)

    # 현재 (오른쪽)
    d.rounded_rectangle((mid+20, box_y, W-pad, box_y+box_h), radius=20, fill=CARD_BG2, outline=RED+"50", width=2)
    d.text((cx(d, "현재", lf, mid+20, W-pad), box_y+20), "현재", font=lf, fill=BRED)
    d.text((cx(d, "0~1건", nf, mid+20, W-pad), box_y+70), "0~1건", font=nf, fill=RED)
    d.text((cx(d, "하루 전체", uf, mid+20, W-pad), box_y+200), "하루 전체", font=uf, fill=GRAY)

    # 화살표
    af = f(50, True)
    d.text((cx(d, "→", af), box_y + 110), "→", font=af, fill=YELLOW)

    # 하락 퍼센트
    drop_y = 570
    df = f(80, True)
    dt = "-83%"
    d.text((cx(d, dt, df), drop_y), dt, font=df, fill=RED)
    d.line([(cx(d, dt, df), drop_y+90), (cx(d, dt, df)+tw(d, dt, df), drop_y+90)], fill=RED, width=4)

    # 인용
    qy = 730
    d.rounded_rectangle((pad, qy, W-pad, qy+200), radius=18, fill="#FFFFFF08", outline="#FFFFFF15", width=1)

    qf2 = f(50, True)
    d.text((pad+20, qy+5), "\"", font=qf2, fill=DGRAY)

    qf = f(28, False)
    d.text((pad+30, qy+40), "그 동네에서 우리 식당은", font=qf, fill=LIGHT)
    qf_b = f(32, True)
    q_parts = [("문 닫은 곳", RED), ("으로 인식되고 있습니다", WHITE)]
    qx = pad + 30
    for t, c in q_parts:
        d.text((qx, qy+90), t, font=qf_b, fill=c)
        qx += tw(d, t, qf_b)

    sf = f(22, False)
    d.text((pad+30, qy+150), "— 점주 A씨", font=sf, fill=DGRAY)

    brand(d)
    return save(img, "dist_04_damage.png")


# ═══════════════════════════════════════════════
# 5컷: 언제 제한되나
# ═══════════════════════════════════════════════
def slide_05():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, BG2)

    pad = 80

    f1 = f(44, True)
    t1a, t1b = "피크타임만?  ", "아닙니다."
    sx = pad
    d.text((sx, 80), t1a, font=f1, fill=WHITE)
    d.text((sx + tw(d, t1a, f1), 80), t1b, font=f1, fill=RED)

    d.line([(pad, 155), (W-pad, 155)], fill="#FFFFFF15", width=2)

    # X 리스트
    items = [
        ("비 안 오는 멀쩡한 날에도", "날씨 맑음, 그래도 차단"),
        ("오후 2시 한가한 시간에도", "브레이크타임 직전까지"),
        ("저녁 8시 넘어서까지도", "1월 초부터 매일 반복"),
        ("사전 공지 없이", "알림 없음, 안내 없음"),
    ]

    iy = 200
    for label, sub in items:
        # X 아이콘
        draw_x_mark(d, pad+25, iy+22, 14, RED)
        # 텍스트
        f2 = f(32, True)
        d.text((pad+60, iy), label, font=f2, fill=WHITE)
        f3 = f(24, False)
        d.text((pad+60, iy+45), sub, font=f3, fill=GRAY)
        iy += 120

    # 결론 강조
    ry = 720
    d.rounded_rectangle((pad, ry, W-pad, ry+120), radius=20, fill="#FF3B3B12", outline=RED, width=2)
    rf = f(42, True)
    rt = "매일 상시 제한 중"
    d.text((cx(d, rt, rf, pad, W-pad), ry+10), rt, font=rf, fill=RED)
    rf2 = f(28, False)
    rt2 = "사장님 동의 없이, 알림 없이"
    d.text((cx(d, rt2, rf2, pad, W-pad), ry+70), rt2, font=rf2, fill=LIGHT)

    brand(d)
    return save(img, "dist_05_when.png")


# ═══════════════════════════════════════════════
# 6컷: 진짜 이유
# ═══════════════════════════════════════════════
def slide_06():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, "#18100A")

    pad = 80

    f1 = f(44, True)
    d.text((pad, 80), "왜 이러는 걸까?", font=f1, fill=WHITE)
    d.line([(pad, 150), (W-pad, 150)], fill="#FFFFFF15", width=2)

    # 수익 구조 카드
    items = [
        ("점주에게 받는 배달비", "3,400원", BLUE, "수입"),
        ("1km 이내 라이더 지급", "1,000~2,000원", ORANGE, "지출"),
    ]

    cy = 200
    for label, amount, color, tag in items:
        d.rounded_rectangle((pad, cy, W-pad, cy+130), radius=18, fill=CARD_BG, outline=color+"30", width=1)
        
        # 태그
        tf = f(20, True)
        tw_t = tw(d, tag, tf)
        d.rounded_rectangle((pad+20, cy+15, pad+20+tw_t+20, cy+42), radius=10, fill=color+"30")
        d.text((pad+30, cy+17), tag, font=tf, fill=color)
        
        lf = f(28, False)
        d.text((pad+25, cy+55), label, font=lf, fill=LIGHT)
        
        af = f(40, True)
        aw = tw(d, amount, af)
        d.text((W-pad-25-aw, cy+50), amount, font=af, fill=color)
        
        cy += 160

    # = 차익
    eq_y = cy + 10
    d.line([(pad+30, eq_y), (W-pad-30, eq_y)], fill=YELLOW, width=3)

    prof_y = eq_y + 30
    d.rounded_rectangle((pad, prof_y, W-pad, prof_y+140), radius=20, fill="#FFD60010", outline=YELLOW+"60", width=2)

    pf1 = f(30, False)
    d.text((cx(d, "배민의 건당 차익", pf1, pad, W-pad), prof_y+15), "배민의 건당 차익", font=pf1, fill=GRAY)
    pf2 = f(70, True)
    pt = "약 2,000원"
    d.text((cx(d, pt, pf2, pad, W-pad), prof_y+50), pt, font=pf2, fill=YELLOW)

    # 결론
    ry = prof_y + 180
    rf = f(34, True)
    r_parts = [("거리 제한할수록 ", LIGHT), ("배민은 이득", YELLOW)]
    rx = pad
    for t, c in r_parts:
        d.text((rx, ry), t, font=rf, fill=c)
        rx += tw(d, t, rf)

    rf2 = f(28, False)
    d.text((pad, ry+55), "— 김준형 공정한플랫폼을위한사장협회 의장", font=rf2, fill=DGRAY)

    # 꼬리말
    ff = f(30, True)
    ft = "\"플랫폼의 차익 장사\"", 
    d.text((cx(d, ft[0], ff), ry+140), ft[0], font=ff, fill=RED)

    brand(d)
    return save(img, "dist_06_reason.png")


# ═══════════════════════════════════════════════
# 7컷: 악순환
# ═══════════════════════════════════════════════
def slide_07():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, BG2)

    pad = 80

    f1 = f(44, True)
    d.text((pad, 80), "악순환이 시작됩니다", font=f1, fill=WHITE)
    d.line([(pad, 155), (W-pad, 155)], fill="#FFFFFF15", width=2)

    # 순환 구조 (세로 플로우)
    steps = [
        ("거리 제한 강화", "배민이 배달 가능 지역 축소", RED),
        ("라이더 배달비 하락", "1,000~2,000원만 지급", ORANGE),
        ("라이더 타 플랫폼 이탈", "쿠팡이츠 등으로 유출", YELLOW),
        ("라이더 부족 심화", "주문 대비 라이더 부족", BLUE),
        ("거리 제한 더 강화", "다시 처음으로...", RED),
    ]

    sy = 200
    for i, (title, sub, color) in enumerate(steps):
        cy = sy + i * 160
        
        # 카드
        d.rounded_rectangle((pad+50, cy, W-pad, cy+100), radius=16, fill=CARD_BG, outline=color+"40", width=1)
        
        # 번호
        draw_circle_icon(d, pad+50, cy+50, 24, color, str(i+1), WHITE, 22)
        
        tf = f(30, True)
        d.text((pad+90, cy+12), title, font=tf, fill=WHITE)
        sf = f(24, False)
        d.text((pad+90, cy+55), sub, font=sf, fill=GRAY)
        
        # 화살표
        if i < len(steps) - 1:
            draw_arrow_down(d, W//2, cy+115, 14, DGRAY)

    # 마지막에 순환 표시
    loop_y = sy + 5 * 160 - 30
    lf = f(34, True)
    lt = "결국 피해는 전부 사장님 몫"
    d.text((cx(d, lt, lf), loop_y), lt, font=lf, fill=RED)

    brand(d)
    return save(img, "dist_07_cycle.png")


# ═══════════════════════════════════════════════
# 8컷: 점주 반응
# ═══════════════════════════════════════════════
def slide_08():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, BG2)

    pad = 80

    f1 = f(44, True)
    d.text((pad, 80), "사장님들의 목소리", font=f1, fill=WHITE)
    d.line([(pad, 155), (W-pad, 155)], fill="#FFFFFF15", width=2)

    # 인용 1
    q1_y = 210
    d.rounded_rectangle((pad, q1_y, W-pad, q1_y+250), radius=18, fill="#FFFFFF08", outline="#FFFFFF15", width=1)
    
    qf = f(60, True)
    d.text((pad+20, q1_y+5), "\"", font=qf, fill=DGRAY)
    
    q1f = f(30, False)
    d.text((pad+30, q1_y+50), "내 돈 주고 영업하는데", font=q1f, fill=LIGHT)
    q1fb = f(34, True)
    d.text((pad+30, q1_y+95), "배달을 못 하는 상황", font=q1fb, fill=RED)
    q1f2 = f(30, False)
    d.text((pad+30, q1_y+145), "입점 사업자에 제한을 거는 건", font=q1f2, fill=LIGHT)
    d.text((pad+30, q1_y+185), "위반이라 생각합니다", font=q1f2, fill=LIGHT)
    
    sf = f(22, False)
    d.text((W-pad-200, q1_y+210), "— 점주 B씨", font=sf, fill=DGRAY)

    # 인용 2
    q2_y = 520
    d.rounded_rectangle((pad, q2_y, W-pad, q2_y+250), radius=18, fill="#FFFFFF08", outline=YELLOW+"20", width=1)
    
    d.text((pad+20, q2_y+5), "\"", font=qf, fill=DGRAY)
    
    d.text((pad+30, q2_y+50), "사실상 점주에게 3,400원 배달비를", font=q1f, fill=LIGHT)
    d.text((pad+30, q2_y+90), "전가하고 라이더에겐 소액만 제공,", font=q1f, fill=LIGHT)
    q2fb = f(32, True)
    d.text((pad+30, q2_y+140), "그러면서 거리 제한까지 합니다", font=q2fb, fill=YELLOW)
    
    d.text((W-pad-200, q2_y+210), "— 점주 B씨", font=sf, fill=DGRAY)

    # 하단 한 줄
    bf = f(30, True)
    bt = "광고비, 수수료 다 내면서 이게 맞습니까?"
    d.text((cx(d, bt, bf), 850), bt, font=bf, fill=WHITE)

    brand(d)
    return save(img, "dist_08_voices.png")


# ═══════════════════════════════════════════════
# 9컷: 대응 움직임
# ═══════════════════════════════════════════════
def slide_09():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, BG2)

    pad = 80

    f1 = f(42, True)
    d.text((pad, 80), "점주들이 움직이기 시작했습니다", font=f1, fill=WHITE)
    d.line([(pad, 150), (W-pad, 150)], fill="#FFFFFF15", width=2)

    # 타임라인
    events = [
        ("2025년 10월", "공정위, 거리 제한을\n'불공정 조항'으로 지적", BLUE),
        ("2025년 10월", "배민, 자진 시정 약속\n\"1km 축소 시 즉시 안내하겠다\"", ORANGE),
        ("2026년 2월", "4개월 지난 현재\n변한 게 없다", RED),
        ("2026년 2월 11일", "점주 A씨\n공정거래조정원 분쟁조정 신청", YELLOW),
    ]

    ey = 200
    for i, (date, desc, color) in enumerate(events):
        # 시간선
        if i < len(events) - 1:
            d.line([(pad+25, ey+50), (pad+25, ey+180)], fill=DGRAY, width=2)
        
        # 점
        d.ellipse((pad+13, ey+8, pad+37, ey+32), fill=color)
        
        # 날짜
        df = f(24, True)
        d.text((pad+55, ey+5), date, font=df, fill=color)
        
        # 설명
        desc_f = f(26, False)
        dy = ey + 40
        for line in desc.split("\n"):
            d.text((pad+55, dy), line, font=desc_f, fill=LIGHT)
            dy += 35
        
        ey += 180

    # 배민 답변
    ay = ey + 30
    d.rounded_rectangle((pad, ay, W-pad, ay+120), radius=16, fill=CARD_BG, outline=DGRAY, width=1)
    af1 = f(26, True)
    d.text((pad+25, ay+15), "배달의민족 답변:", font=af1, fill=GRAY)
    af2 = f(28, False)
    d.text((pad+25, ay+55), "\"법규와 약관을 준수해 운영하고 있다\"", font=af2, fill="#FFFFFF60")
    af3 = f(24, False)
    d.text((pad+25, ay+90), "추가 설명 없음", font=af3, fill=RED)

    brand(d)
    return save(img, "dist_09_action.png")


# ═══════════════════════════════════════════════
# 10컷: CTA
# ═══════════════════════════════════════════════
def slide_10():
    img = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(img)
    grad(d, 0, H, BG1, "#0A1628")

    # 토스 로고 (상단 중앙)
    # TODO: 토스 로고 이미지 추가 필요 (PNG, 흰색 버전)
    # logo = Image.open("toss_logo_white.png").resize((100, 30))
    # img.paste(logo, (W//2 - 50, 80), logo)
    
    # 상단
    f1 = f(40, True)
    t1 = "내 가게도 피해받고 있다면?"
    d.text((cx(d, t1, f1), 180), t1, font=f1, fill=WHITE)

    f2 = f(30, False)
    t2 = "수수료 + 배달비, 정확히 알고 대응하세요"
    d.text((cx(d, t2, f2), 240), t2, font=f2, fill=GRAY)

    # 계산기 아이콘
    ic = W // 2
    icy = 440
    d.rounded_rectangle((ic-75, icy-75, ic+75, icy+75), radius=22, fill=BLUE, outline=WHITE, width=3)
    # 디스플레이
    d.rounded_rectangle((ic-52, icy-55, ic+52, icy-15), radius=8, fill="#FFFFFF30")
    cf = f(28, True)
    d.text((ic-18, icy-53), "₩", font=cf, fill=WHITE)
    # 버튼
    for row in range(3):
        for col in range(3):
            bx = ic - 45 + col * 33
            by = icy - 2 + row * 26
            d.rounded_rectangle((bx, by, bx+24, by+18), radius=4, fill="#FFFFFF20")

    # 앱 이름
    f3 = f(34, True)
    d.text((cx(d, "배달 수수료 계산기", f3), 560), "배달 수수료 계산기", font=f3, fill=WHITE)

    # 기능
    features = [
        "배민 / 쿠팡이츠 / 요기요 수수료 비교",
        "내 매출 기준 실제 순수익 계산",
        "플랫폼별 최적 선택 추천",
    ]
    ff = f(26, False)
    fy = 640
    for feat in features:
        cf2 = f(26, True)
        d.text((200, fy), "✓", font=cf2, fill=GREEN)
        d.text((235, fy), feat, font=ff, fill=LIGHT)
        fy += 48

    # CTA 버튼
    btn_y = 820
    d.rounded_rectangle((130, btn_y, W-130, btn_y+75), radius=38, fill=YELLOW)
    bf = f(30, True)
    bt = "프로필 링크에서 무료로 계산하기"
    d.text((cx(d, bt, bf, 130, W-130), btn_y+20), bt, font=bf, fill="#0B1120")

    tf = f(24, False)
    d.text((cx(d, "10초면 확인 완료!", tf), btn_y+90), "10초면 확인 완료!", font=tf, fill="#FFFFFF50")

    # 팔로우
    ff2 = f(28, True)
    d.text((cx(d, "팔로우하면 배달앱 정책 변경 알림!", ff2), 1020), "팔로우하면 배달앱 정책 변경 알림!", font=ff2, fill=BLUE)

    # 댓글 유도
    cf3 = f(24, False)
    ct = "거리 제한 피해 겪고 계신가요? 댓글로 알려주세요!"
    d.text((cx(d, ct, cf3), 1080), ct, font=cf3, fill=GRAY)

    # 브랜딩
    bf2 = f(24, True)
    d.text((cx(d, "배달사장님 수수료 연구소", bf2), H-95), "배달사장님 수수료 연구소", font=bf2, fill="#FFFFFF40")
    hf = f(20, False)
    d.text((cx(d, "@delivery_fee_lab", hf), H-62), "@delivery_fee_lab", font=hf, fill="#FFFFFF25")

    return save(img, "dist_10_cta.png")


if __name__ == "__main__":
    print("📸 카드뉴스 생성 중...\n")
    slides = [
        slide_01, slide_02, slide_03, slide_04, slide_05,
        slide_06, slide_07, slide_08, slide_09, slide_10,
    ]
    for s in slides:
        s()
    print(f"\n✅ 카드뉴스 10장 완성! → {OUTPUT_DIR}/")
