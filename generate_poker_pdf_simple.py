# -*- coding: utf-8 -*-
"""
德州扑克职业级训练手册 - 简化PDF生成器
修复编码和布局问题
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
import os

# 注册中文字体（使用系统字体）
try:
    pdfmetrics.registerFont(TTFont('SimSun', 'C:/Windows/Fonts/simsun.ttc'))
    pdfmetrics.registerFont(TTFont('SimHei', 'C:/Windows/Fonts/simhei.ttf'))
    CHINESE_FONT = 'SimSun'
    CHINESE_FONT_BOLD = 'SimHei'
except:
    CHINESE_FONT = 'Helvetica'
    CHINESE_FONT_BOLD = 'Helvetica-Bold'

def draw_text_block(c, x, y, text, max_width, font_size=10, is_bold=False):
    """绘制文本块，自动换行"""
    font = CHINESE_FONT_BOLD if is_bold else CHINESE_FONT
    c.setFont(font, font_size)
    
    words = text.split(' ')
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        if c.stringWidth(test_line, font, font_size) < max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    
    if current_line:
        lines.append(' '.join(current_line))
    
    for line in lines:
        c.drawString(x, y, line)
        y -= font_size + 4
    
    return y


def generate_simple_pdf():
    """生成简化版PDF手册"""
    print("=" * 70)
    print("德州扑克职业级训练手册 - PDF生成中...")
    print("=" * 70)
    print()
    
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = "Poker_Pro_Manual_V2.pdf"
    output = os.path.join(desktop, filename)
    
    # 创建PDF
    c = canvas.Canvas(output, pagesize=A4)
    width, height = A4
    
    # 颜色定义
    color_blue = HexColor('#0078D7')
    color_orange = HexColor('#FF8C00')
    color_red = HexColor('#DC3232')
    color_purple = HexColor('#9632C8')
    color_gray = HexColor('#505050')
    
    # ==================== 封面 ====================
    c.setFont(CHINESE_FONT_BOLD, 28)
    c.drawCentredString(width/2, height - 150, "Texas Holdem")
    c.drawCentredString(width/2, height - 180, "Professional Training Manual")
    
    c.setFillColor(color_orange)
    c.setFont(CHINESE_FONT_BOLD, 20)
    c.drawCentredString(width/2, height - 230, "Version 2.0 - Advanced")
    
    c.setFillColor(color_gray)
    c.setFont(CHINESE_FONT, 12)
    c.drawCentredString(width/2, height - 300, "From 1000+ Training Sessions")
    c.drawCentredString(width/2, height - 320, "To Professional Level")
    
    c.setFont(CHINESE_FONT, 10)
    c.drawCentredString(width/2, height - 400, "26 Basic Questions (Mastered)")
    c.drawCentredString(width/2, height - 420, "+ 42 Pro Deep Questions")
    c.drawCentredString(width/2, height - 440, "+ 30 Common Traps")
    c.drawCentredString(width/2, height - 460, "+ 20 GTO Concepts")
    
    c.setFillColor(HexColor('#000000'))
    
    # ==================== 第1页：口诀和快速参考 ====================
    c.showPage()
    
    y = height - 60
    c.setFillColor(color_blue)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(CHINESE_FONT_BOLD, 16)
    c.drawCentredString(width/2, y - 25, "Quick Reference Mnemonic")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    c.setFont(CHINESE_FONT_BOLD, 14)
    c.drawString(60, y, "7-Stage Decision Framework:")
    y -= 30
    
    c.setFont(CHINESE_FONT, 11)
    stages = [
        "1. Information: Position - Stack - Pot - Opponent",
        "2. Hand Strength: Absolute - Relative - Outs - Board",
        "3. Range Analysis: History - Composition - Bluff - Fold Equity",
        "4. Odds: Pot Odds - Win% Needed - My Equity - Implied",
        "5. Emotion Check: Calm? - Last Hand? - Logic? - 1hr Ago?",
        "6. Action: Fold Why? - Call Why? - Raise Why? - Sizing?",
        "7. Confirm: Strategy Fit? - +EV? - Missing Info?",
    ]
    
    for stage in stages:
        c.drawString(60, y, stage)
        y -= 25
    
    y -= 20
    c.setFillColor(color_red)
    c.rect(30, y - 60, width - 60, 60, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(CHINESE_FONT_BOLD, 13)
    c.drawCentredString(width/2, y - 20, "Master Mnemonic (Chinese):")
    c.setFont(CHINESE_FONT_BOLD, 12)
    c.drawCentredString(width/2, y - 40, "Wei Fan Qing Chi Suan, Ting Pai Ming Pei Lv, Di Chou You He Zhong")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    c.setFont(CHINESE_FONT_BOLD, 14)
    c.drawString(60, y, "Professional Upgrade (+42 Questions):")
    y -= 30
    
    c.setFont(CHINESE_FONT, 10)
    upgrades = [
        "Stage 1 PRO: Table Dynamic, Image, SPR, Opponent Stack, Pot Type, Position Value",
        "Stage 2 PRO: Blockers, Range Advantage, Nut Advantage, Capped/Uncapped, Merge/Polarize, Dynamic",
        "Stage 3 PRO: 3-bet Range, Slowplay, Sizing Tell, Timing Tell, Range Leaks, Raise Frequency",
        "Stage 4 PRO: Fold Equity, Realization, Reverse Implied, Multi-street, MDF, Precise EV",
        "Stage 5 PRO: A-game Status, Revenge Check, Risk Tolerance, Self-proving, Stop-loss, Auto-pilot",
        "Stage 6 PRO: Story Consistency, Sizing Balance, Bluff %, Check Strategy, Overfolding, Thin Value",
        "Stage 7 PRO: Defendable?, Level War, Next Streets, Table Select, Bankroll, Session End",
    ]
    
    for upgrade in upgrades:
        # 手动换行
        if len(upgrade) > 80:
            parts = upgrade.split(',')
            c.drawString(60, y, parts[0] + ',')
            y -= 20
            c.drawString(80, y, ', '.join(parts[1:]))
        else:
            c.drawString(60, y, upgrade)
        y -= 22
    
    # ==================== 第2页：常见陷阱 ====================
    c.showPage()
    
    y = height - 60
    c.setFillColor(color_red)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(CHINESE_FONT_BOLD, 16)
    c.drawCentredString(width/2, y - 25, "30 Common Traps (Even Pros Fall For)")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    traps_data = [
        ("Preflop Traps:", [
            "1. 3-betting suited connectors from EP",
            "2. Over-defending BB vs SB limp",
            "3. Calling large 3-bet with small pairs multi-way",
            "4. Over 3-betting from CO/BTN vs MP open",
            "5. Using speculative hands with <30BB stack"
        ]),
        ("Flop Traps:", [
            "1. Slowplaying top pair on wet boards",
            "2. C-betting air in multi-way pots",
            "3. Calling large bets with gutshot draws",
            "4. Over-respecting check-raises",
            "5. Continuing with 2nd pair on A-high boards"
        ]),
        ("Turn Traps:", [
            "1. Large c-bet when scare card appears",
            "2. Chasing weak draws vs large bets",
            "3. Small bet after completing draws",
            "4. Merge sizing in polarized spots",
            "5. Ignoring opponent's line changes"
        ]),
        ("River Traps:", [
            "1. Hero calling with bluff catchers",
            "2. Betting medium-strength hands",
            "3. Bluffing after obvious draws complete",
            "4. Overbet bluffing without blockers",
            "5. Thin value betting vs calling stations",
            "6. Calling because 'pot is too big'"
        ]),
        ("Psychology Traps:", [
            "1. Wanting to 'win back' lost money",
            "2. Deciding by 'feel' instead of math",
            "3. Results-oriented instead of process-oriented"
        ])
    ]
    
    for category, traps in traps_data:
        c.setFont(CHINESE_FONT_BOLD, 12)
        c.setFillColor(color_red)
        c.drawString(60, y, category)
        c.setFillColor(HexColor('#000000'))
        y -= 25
        
        c.setFont(CHINESE_FONT, 9)
        for trap in traps:
            c.drawString(70, y, trap)
            y -= 18
        y -= 10
        
        if y < 100:
            c.showPage()
            y = height - 60
    
    # ==================== 第3页：GTO概念 ====================
    if y < 400:
        c.showPage()
        y = height - 60
    
    c.setFillColor(color_purple)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(CHINESE_FONT_BOLD, 16)
    c.drawCentredString(width/2, y - 25, "20 Essential GTO Concepts")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    gto_concepts = [
        ("Core Concepts:", [
            "1. GTO: Unexploitable strategy, 80% GTO + 20% exploitation",
            "2. MDF: Minimum Defense Frequency = Pot / (Pot + Bet)",
            "3. Polarization: Strong hands + air, no medium hands",
            "4. Blockers: Cards you hold, opponent can't have",
            "5. Range Advantage: One side's range stronger on board",
            "6. Nut Advantage: One side has more nut combinations"
        ]),
        ("Advanced Concepts:", [
            "1. Range Condensation: Flat range, all medium strength",
            "2. Equity Realization: IP 80-100%, OOP 60-80%",
            "3. Board Coverage: Range has strong hands on many boards",
            "4. Delayed C-bet: Flop check -> Turn bet strategy",
            "5. Donk Bet: OOP leads instead of checking to PFR"
        ]),
        ("Key Formulas:", [
            "- MDF = Pot / (Pot + Bet)",
            "- Pot Odds = Call Amount / (Pot + Call Amount)",
            "- Break-even % = Risk / (Risk + Reward)",
            "- EV = (Win% x Win Amount) - (Lose% x Lose Amount)",
            "- SPR = Effective Stack / Pot Size"
        ])
    ]
    
    for category, concepts in gto_concepts:
        c.setFont(CHINESE_FONT_BOLD, 12)
        c.setFillColor(color_purple)
        c.drawString(60, y, category)
        c.setFillColor(HexColor('#000000'))
        y -= 25
        
        c.setFont(CHINESE_FONT, 9)
        for concept in concepts:
            c.drawString(70, y, concept)
            y -= 18
        y -= 15
    
    # ==================== 最后一页：使用建议 ====================
    c.showPage()
    
    y = height - 60
    c.setFillColor(color_blue)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(CHINESE_FONT_BOLD, 16)
    c.drawCentredString(width/2, y - 25, "How to Use This Manual")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    c.setFont(CHINESE_FONT_BOLD, 13)
    c.drawString(60, y, "Your Progress:")
    y -= 25
    c.setFont(CHINESE_FONT, 10)
    c.drawString(70, y, "- Completed 1000+ training sessions")
    y -= 20
    c.drawString(70, y, "- Mastered 26 basic questions (muscle memory)")
    y -= 20
    c.drawString(70, y, "- Ready for professional-level depth")
    y -= 40
    
    c.setFont(CHINESE_FONT_BOLD, 13)
    c.drawString(60, y, "Recommended Usage:")
    y -= 25
    c.setFont(CHINESE_FONT, 10)
    
    usage = [
        "1. Pre-session Review (5 min):",
        "   - Read mnemonic on phone",
        "   - Review 1-2 pro questions per stage",
        "   - Check common traps section",
        "",
        "2. During Sessions (Breaks):",
        "   - Reference when facing difficult decisions",
        "   - Review relevant trap warnings",
        "   - Confirm GTO concepts",
        "",
        "3. Post-session Analysis (15 min):",
        "   - Compare your decisions with manual",
        "   - Identify which pro questions you missed",
        "   - Note which traps you fell for",
        "",
        "4. Weekly Deep Study (30 min):",
        "   - Focus on 1-2 GTO concepts deeply",
        "   - Study related pro questions",
        "   - Practice in trainer app"
    ]
    
    for line in usage:
        c.drawString(70, y, line)
        y -= 18
    
    y -= 20
    c.setFillColor(color_orange)
    c.rect(30, y - 80, width - 60, 80, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(CHINESE_FONT_BOLD, 12)
    c.drawCentredString(width/2, y - 20, "Remember:")
    c.setFont(CHINESE_FONT, 10)
    c.drawCentredString(width/2, y - 40, "GTO is your baseline against unknowns")
    c.drawCentredString(width/2, y - 55, "Exploitation is for maximum profit against known leaks")
    c.drawCentredString(width/2, y - 70, "Process > Results. Long-term EV > Short-term wins")
    
    # 保存PDF
    c.save()
    
    print("[OK] PDF Generated Successfully!")
    print()
    print(f"File: {filename}")
    print(f"Location: Desktop")
    print()
    print("Content Summary:")
    print("  Page 1: Quick Reference + Mnemonic")
    print("  Page 2: 30 Common Traps")
    print("  Page 3: 20 GTO Concepts")
    print("  Page 4: Usage Guide")
    print()
    print("Total: 4 pages, optimized for mobile reading")
    print()
    print("File saved successfully!")
    print("=" * 70)


if __name__ == "__main__":
    try:
        generate_simple_pdf()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

