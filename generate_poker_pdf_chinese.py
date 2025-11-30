# -*- coding: utf-8 -*-
"""
德州扑克职业级训练手册 - 纯中文PDF版
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
import os

# 注册中文字体
try:
    pdfmetrics.registerFont(TTFont('SimSun', 'C:/Windows/Fonts/simsun.ttc'))
    pdfmetrics.registerFont(TTFont('SimHei', 'C:/Windows/Fonts/simhei.ttf'))
    FONT = 'SimSun'
    FONT_BOLD = 'SimHei'
except:
    FONT = 'Helvetica'
    FONT_BOLD = 'Helvetica-Bold'

def generate_chinese_pdf():
    """生成纯中文PDF手册"""
    print("=" * 70)
    print("德州扑克职业级训练手册 - 纯中文版PDF生成中...")
    print("=" * 70)
    print()
    
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = "德州扑克职业训练手册V2_中文版.pdf"
    output = os.path.join(desktop, filename)
    
    c = canvas.Canvas(output, pagesize=A4)
    width, height = A4
    
    # 颜色定义
    color_blue = HexColor('#0078D7')
    color_orange = HexColor('#FF8C00')
    color_red = HexColor('#DC3232')
    color_purple = HexColor('#9632C8')
    color_gray = HexColor('#505050')
    
    # ==================== 封面 ====================
    c.setFont(FONT_BOLD, 32)
    c.drawCentredString(width/2, height - 150, "德州扑克")
    c.drawCentredString(width/2, height - 190, "职业级训练手册")
    
    c.setFillColor(color_orange)
    c.setFont(FONT_BOLD, 22)
    c.drawCentredString(width/2, height - 240, "V2.0 进阶版")
    
    c.setFillColor(color_gray)
    c.setFont(FONT, 14)
    c.drawCentredString(width/2, height - 300, "从1000+次基础训练")
    c.drawCentredString(width/2, height - 325, "到职业级决策深度")
    
    c.setFont(FONT, 11)
    c.drawCentredString(width/2, height - 400, "基础26问（已掌握）")
    c.drawCentredString(width/2, height - 425, "+ 职业级42个深度问题")
    c.drawCentredString(width/2, height - 450, "+ 30个实战陷阱识别")
    c.drawCentredString(width/2, height - 475, "+ 20个GTO核心概念")
    
    c.setFillColor(HexColor('#000000'))
    
    # ==================== 第1页：口诀快速参考 ====================
    c.showPage()
    
    y = height - 60
    c.setFillColor(color_blue)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(width/2, y - 25, "快速参考口诀")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    c.setFont(FONT_BOLD, 15)
    c.drawString(60, y, "7阶段标准决策流程：")
    y -= 35
    
    c.setFont(FONT, 12)
    stages = [
        "1. 信息收集：位置 - 筹码 - 底池 - 对手",
        "2. 牌力评估：绝对牌力 - 相对牌力 - 改进潜力 - 牌面结构",
        "3. 范围分析：历史行动 - 范围组成 - 诈唬频率 - 弃牌权益",
        "4. 赔率计算：底池赔率 - 所需胜率 - 实际胜率 - 隐含赔率",
        "5. 情绪自检：冷静？ - 受影响？ - 基于逻辑？ - 1小时前？",
        "6. 行动决策：弃牌理由 - 跟注理由 - 加注理由 - 下注大小",
        "7. 二次确认：符合策略？ - 长期+EV？ - 遗漏信息？",
    ]
    
    for stage in stages:
        c.drawString(60, y, stage)
        y -= 28
    
    y -= 20
    c.setFillColor(color_red)
    c.rect(30, y - 75, width - 60, 75, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(FONT_BOLD, 16)
    c.drawCentredString(width/2, y - 20, "超级记忆口诀：")
    c.setFont(FONT_BOLD, 15)
    c.drawCentredString(width/2, y - 45, "位范情池算，听牌明赔率，底筹优河终")
    c.setFont(FONT, 10)
    c.drawCentredString(width/2, y - 65, "位置·范围·情绪·底池·算概率 | 听牌·牌面·sizing·赔率·胜率 | 管理·深度·EV·精细·故事")
    
    c.setFillColor(HexColor('#000000'))
    y -= 100
    
    c.setFont(FONT_BOLD, 15)
    c.drawString(60, y, "职业级深度升级（42个新问题）：")
    y -= 32
    
    c.setFont(FONT, 10)
    upgrades = [
        ("阶段1 PRO：", "桌面动态、形象管理、SPR影响、对手筹码、底池类型、位置价值"),
        ("阶段2 PRO：", "Blocker效应、范围优势、坚果优势、封顶判断、极化/融合、动态评估"),
        ("阶段3 PRO：", "3-bet范围、慢打识别、sizing暗示、时间tell、范围漏洞、加注频率"),
        ("阶段4 PRO：", "弃牌权益、实现率、反向赔率、多街价值、MDF计算、精确EV"),
        ("阶段5 PRO：", "A-game状态、复仇心理、风险承受、自证陷阱、止损纪律、自动驾驶"),
        ("阶段6 PRO：", "故事一致性、sizing平衡、诈唬频率、过牌策略、过度弃牌、薄价值"),
        ("阶段7 PRO：", "可辩护性、Level战、后续可控、桌子选择、资金管理、结束信号"),
    ]
    
    for title, content in upgrades:
        c.setFont(FONT_BOLD, 11)
        c.setFillColor(color_orange)
        c.drawString(60, y, title)
        c.setFillColor(HexColor('#000000'))
        c.setFont(FONT, 10)
        c.drawString(140, y, content)
        y -= 24
    
    # ==================== 第2页：常见陷阱 ====================
    c.showPage()
    
    y = height - 60
    c.setFillColor(color_red)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(width/2, y - 25, "30个常见陷阱（职业玩家也会犯）")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    traps_data = [
        ("【翻前陷阱】", [
            "1. 在EP用同花连牌3-bet",
            "2. BB对SB limp过度防守",
            "3. 多人底池用小对子跟大额3-bet",
            "4. CO/BTN对MP开池过度3-bet",
            "5. 短筹码(<30BB)用投机牌"
        ]),
        ("【翻牌圈陷阱】", [
            "1. 湿润牌面用顶对慢打",
            "2. 多人底池持续c-bet空气",
            "3. 用卡顺听牌跟大注",
            "4. 过度尊重check-raise",
            "5. A高牌面用第二对继续投入"
        ]),
        ("【转牌圈陷阱】", [
            "1. 转牌出scare card仍大额c-bet",
            "2. 用弱听牌面对大额bet仍追",
            "3. 转牌完成听牌后下小注",
            "4. 极化spot下融合sizing",
            "5. 忽视对手line突然改变"
        ]),
        ("【河牌圈陷阱】", [
            "1. 用bluff catcher做hero call",
            "2. 河牌用中等牌下注",
            "3. obvious draw完成后仍bluff",
            "4. 无blocker超池bluff",
            "5. 对calling station薄价值下注",
            "6. 因为底池大就「不得不call」"
        ]),
        ("【心理陷阱】", [
            "1. 想要「赢回」刚输掉的钱",
            "2. 用「感觉」而非数学做决策",
            "3. 打「结果导向」而非「过程导向」"
        ])
    ]
    
    for category, traps in traps_data:
        c.setFont(FONT_BOLD, 13)
        c.setFillColor(color_red)
        c.drawString(60, y, category)
        c.setFillColor(HexColor('#000000'))
        y -= 28
        
        c.setFont(FONT, 10)
        for trap in traps:
            c.drawString(70, y, trap)
            y -= 20
        y -= 12
        
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
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(width/2, y - 25, "20个GTO核心概念")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    gto_concepts = [
        ("【核心概念】", [
            "1. GTO：无法被剥削的策略，80% GTO + 20% 剥削",
            "2. MDF：最小防守频率 = 底池 / (底池 + 下注)",
            "3. 极化：只有强牌+空气，没有中等牌",
            "4. Blocker：你持有的牌，对手就不可能有",
            "5. 范围优势：一方范围在该牌面更强",
            "6. 坚果优势：一方有更多坚果组合"
        ]),
        ("【进阶概念】", [
            "1. 范围压缩：范围变扁平，都是中等牌",
            "2. 权益实现率：IP 80-100%，OOP 60-80%",
            "3. 牌面覆盖：范围在多种牌面都有强牌",
            "4. 延迟持续下注：翻牌check → 转牌bet",
            "5. Donk Bet：OOP主动下注而非check"
        ]),
        ("【关键公式】", [
            "MDF = 底池 / (底池 + 对手下注)",
            "底池赔率 = 跟注金额 / (底池 + 跟注金额)",
            "盈亏平衡点 = 风险 / (风险 + 回报)",
            "EV = (赢概率 × 赢金额) - (输概率 × 输金额)",
            "SPR = 有效筹码 / 底池大小"
        ]),
        ("【sizing与频率】", [
            "下注1/3 pot → 需要25%成功率",
            "下注1/2 pot → 需要33%成功率",
            "下注pot → 需要50%成功率",
            "MDF例子：底池100，对手下50，你要defend 67%",
            "价值:诈唬比例通常为 2:1 或 3:1"
        ])
    ]
    
    for category, concepts in gto_concepts:
        c.setFont(FONT_BOLD, 13)
        c.setFillColor(color_purple)
        c.drawString(60, y, category)
        c.setFillColor(HexColor('#000000'))
        y -= 28
        
        c.setFont(FONT, 10)
        for concept in concepts:
            c.drawString(70, y, concept)
            y -= 20
        y -= 15
        
        if y < 120:
            c.showPage()
            y = height - 60
    
    # ==================== 第4页：使用建议 ====================
    c.showPage()
    
    y = height - 60
    c.setFillColor(color_blue)
    c.rect(30, y - 40, width - 60, 40, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(FONT_BOLD, 18)
    c.drawCentredString(width/2, y - 25, "如何使用本手册")
    
    c.setFillColor(HexColor('#000000'))
    y -= 80
    
    c.setFont(FONT_BOLD, 14)
    c.drawString(60, y, "你的当前进度：")
    y -= 28
    c.setFont(FONT, 11)
    c.drawString(70, y, "已完成1000+次基础训练")
    y -= 22
    c.drawString(70, y, "已掌握26个基础问题（肌肉记忆）")
    y -= 22
    c.drawString(70, y, "已准备好进入职业级深度")
    y -= 40
    
    c.setFont(FONT_BOLD, 14)
    c.drawString(60, y, "推荐使用方法：")
    y -= 28
    
    c.setFont(FONT_BOLD, 12)
    c.drawString(70, y, "1. 赛前复习（5分钟）：")
    y -= 22
    c.setFont(FONT, 10)
    c.drawString(85, y, "手机打开PDF → 看口诀")
    y -= 18
    c.drawString(85, y, "每个阶段复习1-2个PRO问题")
    y -= 18
    c.drawString(85, y, "检查常见陷阱部分")
    y -= 28
    
    c.setFont(FONT_BOLD, 12)
    c.drawString(70, y, "2. 打牌期间（休息时）：")
    y -= 22
    c.setFont(FONT, 10)
    c.drawString(85, y, "遇到困难决策时参考")
    y -= 18
    c.drawString(85, y, "回顾相关陷阱警告")
    y -= 18
    c.drawString(85, y, "确认GTO概念")
    y -= 28
    
    c.setFont(FONT_BOLD, 12)
    c.drawString(70, y, "3. 赛后分析（15分钟）：")
    y -= 22
    c.setFont(FONT, 10)
    c.drawString(85, y, "用手册对照你的决策")
    y -= 18
    c.drawString(85, y, "识别哪些PRO问题你遗漏了")
    y -= 18
    c.drawString(85, y, "记录你掉进了哪些陷阱")
    y -= 28
    
    c.setFont(FONT_BOLD, 12)
    c.drawString(70, y, "4. 每周深度学习（30分钟）：")
    y -= 22
    c.setFont(FONT, 10)
    c.drawString(85, y, "深入研究1-2个GTO概念")
    y -= 18
    c.drawString(85, y, "学习相关的PRO问题")
    y -= 18
    c.drawString(85, y, "在训练App中练习")
    y -= 35
    
    c.setFillColor(color_orange)
    c.rect(30, y - 95, width - 60, 95, fill=True, stroke=False)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont(FONT_BOLD, 14)
    c.drawCentredString(width/2, y - 22, "核心原则：")
    c.setFont(FONT, 12)
    c.drawCentredString(width/2, y - 44, "GTO是你对抗未知对手的基准策略")
    c.drawCentredString(width/2, y - 64, "剥削是你对抗已知漏洞的盈利策略")
    c.drawCentredString(width/2, y - 84, "过程 > 结果，长期EV > 短期输赢")
    
    # 保存PDF
    c.save()
    
    print("[OK] 中文版PDF生成成功!")
    print()
    print(f"文件名: {filename}")
    print(f"位置: 桌面")
    print()
    print("内容结构:")
    print("  第1页: 快速参考 + 口诀 + 职业级概览")
    print("  第2页: 30个常见陷阱")
    print("  第3页: 20个GTO核心概念")
    print("  第4页: 使用指南")
    print()
    print("总共4页，已优化手机阅读")
    print()
    print("文件已保存到桌面！")
    print("=" * 70)


if __name__ == "__main__":
    try:
        generate_chinese_pdf()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


