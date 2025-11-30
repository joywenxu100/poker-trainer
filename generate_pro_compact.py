# -*- coding: utf-8 -*-
"""
德州扑克职业级4街道全览 - 紧凑大字版
去掉所有空白，最大化字体，方便一眼查看
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 4200
HEIGHT = 2970
MARGIN = 40  # 减小边距

BG_COLOR = (255, 255, 255)
COLOR_BLACK = (20, 20, 20)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (120, 120, 120)

# 职业级完整数据（紧凑版）
PRO_STREETS_COMPACT = {
    "preflop": {
        "title": "翻前",
        "en": "PRE-FLOP",
        "color": COLOR_BLUE,
        "icon": "🎴",
        "core": ["①牌力·位置", "②对手松紧", "③底池·SPR", "④隐含赔率"],
        "emotion": "冷静·无聊·连败焦虑",
        "actions": [
            "Fold 弃牌", "Limp 平跟", "Call 跟注", "Raise 2.5-3BB",
            "3-Bet 9-12BB", "4-Bet 22-25BB", "5-Bet/All-in", "Cold Call"
        ]
    },
    "flop": {
        "title": "翻牌圈",
        "en": "FLOP",
        "color": COLOR_GREEN,
        "icon": "🎲",
        "core": ["①牌面干湿", "②我的牌力", "③对手范围", "④位置优势"],
        "emotion": "击中兴奋·未中诈唬",
        "actions": [
            "Check 过牌", "C-bet 1/3 小额", "C-bet 1/2 标准", "C-bet 2/3 大额",
            "Pot Bet 满池", "Overbet 超池", "Donk Bet 主动", "Check-Raise",
            "Float 跟注计划", "Probe Bet 试探"
        ]
    },
    "turn": {
        "title": "转牌圈",
        "en": "TURN",
        "color": COLOR_ORANGE,
        "icon": "⚡",
        "core": ["①转牌性质", "②牌力重估", "③SPR筹码", "④故事一致"],
        "emotion": "底池大失智·不甘",
        "actions": [
            "Check 过牌", "Bet 1/3 控池", "Bet 1/2 标准", "Bet 2/3 大额",
            "Pot Bet 满池", "Overbet 超池", "Check-Raise", "Probe Bet 试探",
            "Block Bet 阻断", "All-in 全下"
        ]
    },
    "river": {
        "title": "河牌圈",
        "en": "RIVER",
        "color": COLOR_PURPLE,
        "icon": "🎯",
        "core": ["①河牌影响", "②最终牌力", "③范围分析", "④EV优化"],
        "emotion": "Hero call·赌气",
        "actions": [
            "Thin Value 1/3", "Value 1/2", "Value 2/3", "Overbet Value",
            "Block Bet 1/4", "Small Bluff 1/3", "Bluff 1/2", "Overbet Bluff",
            "Check 过牌", "Check-Raise", "Hero Call", "Crying Call"
        ]
    }
}


def get_font(size, bold=False):
    try:
        path = "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    except:
        pass
    return ImageFont.load_default()


def draw_compact_street_max(draw, x, y, width, height, key, data):
    """绘制超紧凑大字版街道块"""
    color = data['color']
    
    # 浅色背景
    bg_color = (
        (240, 245, 255) if key == "preflop" else
        (240, 255, 240) if key == "flop" else
        (255, 248, 235) if key == "turn" else
        (248, 240, 255)
    )
    draw.rectangle([x, y, x + width, y + height], fill=bg_color, outline=color, width=5)
    
    cy = y + 12
    
    # 图标和标题（加大）
    icon_font = get_font(80)
    draw.text((x + width // 2 - 45, cy), data['icon'], font=icon_font)
    cy += 90
    
    title_font = get_font(75, bold=True)
    bbox = draw.textbbox((0, 0), data['title'], font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text((x + (width - tw) // 2, cy), data['title'], fill=color, font=title_font)
    cy += 85
    
    en_font = get_font(38, bold=True)
    bbox = draw.textbbox((0, 0), data['en'], font=en_font)
    ew = bbox[2] - bbox[0]
    draw.text((x + (width - ew) // 2, cy), data['en'], fill=COLOR_GRAY, font=en_font)
    cy += 50
    
    # 分隔线
    draw.rectangle([x + 25, cy, x + width - 25, cy + 3], fill=color)
    cy += 18
    
    # 核心分析（加大字体）
    section_font = get_font(52, bold=True)
    bbox = draw.textbbox((0, 0), "核心分析", font=section_font)
    sw = bbox[2] - bbox[0]
    draw.text((x + (width - sw) // 2, cy), "核心分析", fill=color, font=section_font)
    cy += 62
    
    core_font = get_font(36, bold=True)  # 加大
    for item in data['core']:
        bbox = draw.textbbox((0, 0), item, font=core_font)
        iw = bbox[2] - bbox[0]
        draw.text((x + (width - iw) // 2, cy), item, fill=COLOR_BLACK, font=core_font)
        cy += 45  # 加大行距
    
    cy += 12
    
    # 情绪自检（加大）
    emo_h = 125
    draw.rectangle([x + 20, cy, x + width - 20, cy + emo_h],
                   fill=(255, 240, 240), outline=COLOR_RED, width=5)
    
    emo_title_font = get_font(48, bold=True)  # 加大
    draw.text((x + 30, cy + 15), "⚠️ 情绪自检", fill=COLOR_RED, font=emo_title_font)
    
    emo_font = get_font(32, bold=True)  # 加大
    emo_lines = data['emotion'].split('·')
    emo_y = cy + 65
    for line in emo_lines:
        bbox = draw.textbbox((0, 0), line, font=emo_font)
        lw = bbox[2] - bbox[0]
        draw.text((x + (width - lw) // 2, emo_y), line, fill=COLOR_RED, font=emo_font)
        emo_y += 35  # 加大行距
    
    cy += emo_h + 18
    
    # 行动决策（加大）
    bbox = draw.textbbox((0, 0), "行动决策", font=section_font)
    sw = bbox[2] - bbox[0]
    draw.text((x + (width - sw) // 2, cy), "行动决策", fill=color, font=section_font)
    cy += 62
    
    # 行动选项（大字体）
    action_font = get_font(34, bold=True)  # 加大
    for action in data['actions']:
        bbox = draw.textbbox((0, 0), f"• {action}", font=action_font)
        aw = bbox[2] - bbox[0]
        draw.text((x + (width - aw) // 2, cy), f"• {action}", fill=COLOR_BLACK, font=action_font)
        cy += 42  # 加大行距


def generate_pro_compact():
    """生成紧凑大字版"""
    print("=" * 70)
    print("职业级完整版 - 紧凑大字版（去空白）")
    print("=" * 70)
    print()
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    y = MARGIN
    
    # 标题（加大）
    title_font = get_font(110, bold=True)
    title = "德州扑克职业级决策流程全览"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_w) // 2, y), title, fill=COLOR_BLACK, font=title_font)
    y += 125
    
    subtitle_font = get_font(48, bold=True)
    subtitle = "Pre-Flop → Flop → Turn → River | 完整行动选项体系"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - sub_w) // 2, y), subtitle, fill=COLOR_GRAY, font=subtitle_font)
    y += 70
    
    # 2x2 布局（减小间距）
    gap = 25  # 减小
    box_width = (WIDTH - MARGIN * 2 - gap) // 2
    box_height = 1090  # 加大
    
    # 上排：翻前 + 翻牌圈
    top_y = y
    draw_compact_street_max(draw, MARGIN, top_y, box_width, box_height, 
                            "preflop", PRO_STREETS_COMPACT["preflop"])
    draw_compact_street_max(draw, MARGIN + box_width + gap, top_y, box_width, box_height, 
                            "flop", PRO_STREETS_COMPACT["flop"])
    
    # 下排：转牌圈 + 河牌圈
    bottom_y = top_y + box_height + gap
    draw_compact_street_max(draw, MARGIN, bottom_y, box_width, box_height, 
                            "turn", PRO_STREETS_COMPACT["turn"])
    draw_compact_street_max(draw, MARGIN + box_width + gap, bottom_y, box_width, box_height, 
                            "river", PRO_STREETS_COMPACT["river"])
    
    # 底部口诀区域（减小上边距）
    mantra_y = bottom_y + box_height + 20  # 减小
    mantra_height = HEIGHT - mantra_y - MARGIN
    
    # 口诀背景
    draw.rectangle([MARGIN, mantra_y, WIDTH - MARGIN, HEIGHT - MARGIN],
                   fill=(255, 255, 240), outline=COLOR_BLACK, width=5)
    
    # 口诀标题（加大）
    mantra_title_font = get_font(65, bold=True)
    draw.text((MARGIN + 35, mantra_y + 15), "🎯 决策口诀", fill=COLOR_RED, font=mantra_title_font)
    
    # 主干口诀（加大）
    main_mantra_font = get_font(80, bold=True)  # 加大
    main_mantra = "位范情池算，听牌明赔率，底筹优河终"
    bbox = draw.textbbox((0, 0), main_mantra, font=main_mantra_font)
    mm_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - mm_w) // 2, mantra_y + 95), main_mantra, fill=COLOR_RED, font=main_mantra_font)
    
    # 详细解释（加大）
    detail_font = get_font(42, bold=True)  # 加大
    detail_y = mantra_y + 190
    
    detail = "位(位置)·范(范围)·情(情绪)·池(底池)·算(概率) | 听(听牌)·牌(牌面)·明(sizing)·赔(隐含)·率(胜率) | 底(管理)·筹(深度)·优(EV)·河(精细)·终(故事)"
    bbox = draw.textbbox((0, 0), detail, font=detail_font)
    lw = bbox[2] - bbox[0]
    draw.text(((WIDTH - lw) // 2, detail_y), detail, fill=COLOR_BLACK, font=detail_font)
    
    # 底部特点说明（加大）
    bottom_font = get_font(36, bold=True)  # 加大
    bottom_text = "职业级特点：8-12个完整动作选项 | 包含sizing策略 | 覆盖所有实战场景 | 每个决策点走完流程·保持纪律"
    bbox = draw.textbbox((0, 0), bottom_text, font=bottom_font)
    bt_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - bt_w) // 2, HEIGHT - MARGIN - 42), bottom_text, fill=COLOR_GRAY, font=bottom_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = "poker_pro_compact.jpg"
    output = os.path.join(desktop, filename)
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print("✓ 生成完成")
    print()
    print(f"文件：{filename}")
    print("尺寸：A4横向 (297mm x 210mm)")
    print("布局：2x2紧凑大字版")
    print()
    print("改进：")
    print("  ✓ 减少所有空白")
    print("  ✓ 所有字体放大20-30%")
    print("  ✓ 行距优化")
    print("  ✓ 信息密度最大化")
    print("  ✓ 方便一眼查看")
    print()
    print("字体大小：")
    print("  • 标题：110px（原95px）")
    print("  • 街道图标：80px（原65px）")
    print("  • 街道标题：75px（原58px）")
    print("  • 核心分析：36px（原26px）")
    print("  • 情绪自检：48px标题+32px内容")
    print("  • 行动选项：34px（原25px）")
    print("  • 口诀主干：80px（原65px）")
    print()
    print("文件已保存到桌面！")
    print("=" * 70)


if __name__ == "__main__":
    try:
        generate_pro_compact()
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



