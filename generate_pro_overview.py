# -*- coding: utf-8 -*-
"""
德州扑克职业级4街道全览 - 完整版
包含所有行动选项
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 4200
HEIGHT = 2970
MARGIN = 60

BG_COLOR = (255, 255, 255)
COLOR_BLACK = (20, 20, 20)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (120, 120, 120)

# 职业级完整数据（精简版，用于全览）
PRO_STREETS_COMPACT = {
    "preflop": {
        "title": "翻前",
        "en": "PRE-FLOP",
        "color": COLOR_BLUE,
        "icon": "🎴",
        "core": ["①牌力·位置", "②对手松紧", "③底池·SPR", "④隐含赔率"],
        "emotion": "冷静·无聊·连败焦虑",
        "actions": [
            "Fold 弃牌",
            "Limp 平跟",
            "Call 跟注",
            "Raise 2.5-3BB",
            "3-Bet 9-12BB",
            "4-Bet 22-25BB",
            "5-Bet/All-in",
            "Cold Call"
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
            "Check 过牌",
            "C-bet 1/3 小额",
            "C-bet 1/2 标准",
            "C-bet 2/3 大额",
            "Pot Bet 满池",
            "Overbet 超池",
            "Donk Bet 主动",
            "Check-Raise",
            "Float 跟注计划",
            "Probe Bet 试探"
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
            "Check 过牌",
            "Bet 1/3 控池",
            "Bet 1/2 标准",
            "Bet 2/3 大额",
            "Pot Bet 满池",
            "Overbet 超池",
            "Check-Raise",
            "Probe Bet 试探",
            "Block Bet 阻断",
            "All-in 全下"
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
            "Thin Value 1/3",
            "Value 1/2",
            "Value 2/3",
            "Overbet Value",
            "Block Bet 1/4",
            "Small Bluff 1/3",
            "Bluff 1/2",
            "Overbet Bluff",
            "Check 过牌",
            "Check-Raise",
            "Hero Call",
            "Crying Call"
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


def draw_compact_street(draw, x, y, width, height, key, data):
    """绘制紧凑的街道列"""
    color = data['color']
    
    # 浅色背景
    bg_color = (
        (240, 245, 255) if key == "preflop" else
        (240, 255, 240) if key == "flop" else
        (255, 248, 235) if key == "turn" else
        (248, 240, 255)
    )
    draw.rectangle([x, y, x + width, y + height], fill=bg_color, outline=color, width=4)
    
    cy = y + 20
    
    # 图标和标题
    icon_font = get_font(70)
    draw.text((x + width // 2 - 40, cy), data['icon'], font=icon_font)
    cy += 85
    
    title_font = get_font(60, bold=True)
    bbox = draw.textbbox((0, 0), data['title'], font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text((x + (width - tw) // 2, cy), data['title'], fill=color, font=title_font)
    cy += 75
    
    en_font = get_font(32, bold=True)
    bbox = draw.textbbox((0, 0), data['en'], font=en_font)
    ew = bbox[2] - bbox[0]
    draw.text((x + (width - ew) // 2, cy), data['en'], fill=COLOR_GRAY, font=en_font)
    cy += 50
    
    # 分隔线
    draw.rectangle([x + 30, cy, x + width - 30, cy + 3], fill=color)
    cy += 25
    
    # 核心分析
    section_font = get_font(42, bold=True)
    bbox = draw.textbbox((0, 0), "核心分析", font=section_font)
    sw = bbox[2] - bbox[0]
    draw.text((x + (width - sw) // 2, cy), "核心分析", fill=color, font=section_font)
    cy += 55
    
    core_font = get_font(28, bold=True)
    for item in data['core']:
        bbox = draw.textbbox((0, 0), item, font=core_font)
        iw = bbox[2] - bbox[0]
        draw.text((x + (width - iw) // 2, cy), item, fill=COLOR_BLACK, font=core_font)
        cy += 38
    
    cy += 10
    
    # 情绪自检
    emo_h = 120
    draw.rectangle([x + 20, cy, x + width - 20, cy + emo_h],
                   fill=(255, 240, 240), outline=COLOR_RED, width=4)
    
    emo_title_font = get_font(38, bold=True)
    draw.text((x + 30, cy + 15), "⚠️ 情绪自检", fill=COLOR_RED, font=emo_title_font)
    
    emo_font = get_font(26, bold=True)
    # 分行显示情绪
    emo_lines = data['emotion'].split('·')
    emo_y = cy + 55
    for line in emo_lines:
        bbox = draw.textbbox((0, 0), line, font=emo_font)
        lw = bbox[2] - bbox[0]
        draw.text((x + (width - lw) // 2, emo_y), line, fill=COLOR_RED, font=emo_font)
        emo_y += 30
    
    cy += emo_h + 20
    
    # 行动决策
    bbox = draw.textbbox((0, 0), "行动决策", font=section_font)
    sw = bbox[2] - bbox[0]
    draw.text((x + (width - sw) // 2, cy), "行动决策", fill=color, font=section_font)
    cy += 55
    
    # 行动选项（紧凑列表）
    action_font = get_font(26, bold=True)
    for action in data['actions']:
        bbox = draw.textbbox((0, 0), f"• {action}", font=action_font)
        aw = bbox[2] - bbox[0]
        draw.text((x + (width - aw) // 2, cy), f"• {action}", fill=COLOR_BLACK, font=action_font)
        cy += 35


def generate_pro_overview():
    """生成职业级横向全览"""
    print("=" * 70)
    print("职业级完整版 - 横向全览")
    print("=" * 70)
    print()
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    y = MARGIN
    
    # 超级标题
    title_font = get_font(100, bold=True)
    title = "德州扑克职业级决策流程全览"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_w) // 2, y), title, fill=COLOR_BLACK, font=title_font)
    y += 120
    
    subtitle_font = get_font(45, bold=True)
    subtitle = "Pre-Flop → Flop → Turn → River | 完整行动选项体系"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - sub_w) // 2, y), subtitle, fill=COLOR_GRAY, font=subtitle_font)
    y += 80
    
    # 4列布局
    col_width = (WIDTH - MARGIN * 2 - 90) // 4
    col_height = HEIGHT - y - MARGIN - 120
    
    streets = ["preflop", "flop", "turn", "river"]
    for i, key in enumerate(streets):
        col_x = MARGIN + i * (col_width + 30)
        draw_compact_street(draw, col_x, y, col_width, col_height, key, PRO_STREETS_COMPACT[key])
    
    # 底部说明
    bottom_y = HEIGHT - MARGIN - 100
    draw.rectangle([MARGIN, bottom_y, WIDTH - MARGIN, HEIGHT - MARGIN],
                   fill=(255, 255, 240), outline=COLOR_GRAY, width=3)
    
    bottom_font = get_font(38, bold=True)
    bottom_text = "🎯 职业级特点：8-12个完整行动选项 | 包含sizing策略 | 覆盖所有实战场景 | 每个决策点走完流程·保持纪律"
    bbox = draw.textbbox((0, 0), bottom_text, font=bottom_font)
    bt_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - bt_w) // 2, bottom_y + 30), bottom_text, fill=COLOR_BLACK, font=bottom_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = "poker_4streets_professional_overview.jpg"
    output = os.path.join(desktop, filename)
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print("✓ 生成完成")
    print()
    print(f"文件：{filename}")
    print("尺寸：A4横向 (297mm x 210mm)")
    print("布局：4栏并列")
    print()
    print("职业级特点：")
    print("  ✓ 翻前：8个完整行动选项")
    print("  ✓ 翻牌圈：10个完整行动选项")
    print("  ✓ 转牌圈：10个完整行动选项")
    print("  ✓ 河牌圈：12个完整行动选项")
    print("  ✓ 包含sizing策略")
    print("  ✓ 每个选项都有说明")
    print("  ✓ 4个街道横向对比")
    print("  ✓ 颜色编码快速识别")
    print()
    print("文件已保存到桌面！")
    print("=" * 70)


if __name__ == "__main__":
    try:
        generate_pro_overview()
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



