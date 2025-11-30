# -*- coding: utf-8 -*-
"""
德州扑克4街道全览 - 专业出版级设计
一张A4横向，4个街道完整流程
"""

from PIL import Image, ImageDraw, ImageFont
import os

# A4横向
WIDTH = 3508
HEIGHT = 2480
MARGIN = 80

BG_COLOR = (255, 255, 255)
COLOR_BLACK = (20, 20, 20)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (120, 120, 120)

# 4街道精简数据
STREETS_OVERVIEW = [
    {
        "title": "翻前",
        "en": "PRE-FLOP",
        "icon": "🎴",
        "color": COLOR_BLUE,
        "core": [
            "① 起手牌：牌·位·范围",
            "② 对手：松紧·激被",
            "③ 底池：前·跟·池",
            "④ 赔率：赔·隐·筹"
        ],
        "emotion": "冷静\n无聊\n反击",
        "action": "Fold / Call / Raise"
    },
    {
        "title": "翻牌圈",
        "en": "FLOP",
        "icon": "🎲",
        "color": COLOR_GREEN,
        "core": [
            "① 牌面：干湿·高低",
            "② 我的牌：击中·听牌",
            "③ 对手：范围·对抗",
            "④ 位置：位·主动"
        ],
        "emotion": "兴奋\n诈唬\n追牌",
        "action": "Check / Call / Bet"
    },
    {
        "title": "转牌圈",
        "en": "TURN",
        "icon": "⚡",
        "color": COLOR_ORANGE,
        "core": [
            "① 转牌：改进·完成",
            "② 牌力：重估·强度",
            "③ 筹码：池·筹·SPR",
            "④ 故事：行动·一致"
        ],
        "emotion": "失智\n追逐\n不甘",
        "action": "Check / Call / All-in"
    },
    {
        "title": "河牌圈",
        "en": "RIVER",
        "icon": "🎯",
        "color": COLOR_PURPLE,
        "core": [
            "① 河牌：完成·砖牌",
            "② 牌力：最终·坚果",
            "③ 范围：行动线·缩小",
            "④ 优化：榨取·价值"
        ],
        "emotion": "英雄\n赌气\n盲目",
        "action": "Value / Bluff / Fold"
    }
]


def get_font(size, bold=False):
    try:
        path = "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    except:
        pass
    return ImageFont.load_default()


def generate_overview():
    """生成4街道全览图"""
    print("=" * 70)
    print("生成德州扑克4街道全览 - 专业出版级")
    print("=" * 70)
    print()
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # ===== 顶部大标题 =====
    y = MARGIN - 20
    
    # 主标题
    main_title_font = get_font(110, bold=True)
    main_title = "德州扑克决策流程全览"
    bbox = draw.textbbox((0, 0), main_title, font=main_title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_w) // 2, y), main_title, fill=COLOR_BLACK, font=main_title_font)
    y += 130
    
    # 副标题
    subtitle_font = get_font(50)
    subtitle = "Pre-Flop → Flop → Turn → River  |  完整决策体系"
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - sub_w) // 2, y), subtitle, fill=COLOR_GRAY, font=subtitle_font)
    y += 80
    
    # 顶部分隔线
    draw.rectangle([MARGIN, y, WIDTH - MARGIN, y + 5], fill=COLOR_BLACK)
    y += 40
    
    # ===== 4个街道列（4栏布局）=====
    col_width = (WIDTH - MARGIN * 2 - 90) // 4  # 4列
    col_gap = 30
    
    content_top = y
    
    for i, street in enumerate(STREETS_OVERVIEW):
        col_x = MARGIN + i * (col_width + col_gap)
        draw_street_column(draw, col_x, content_top, col_width, street)
    
    # ===== 底部核心原则 =====
    footer_y = HEIGHT - MARGIN - 140
    
    # 底部大框
    draw.rectangle([MARGIN, footer_y, WIDTH - MARGIN, footer_y + 130],
                   fill=(255, 250, 230), outline=COLOR_BLACK, width=5)
    
    # 标题
    footer_title_font = get_font(60, bold=True)
    footer_title = "核心原则"
    bbox = draw.textbbox((0, 0), footer_title, font=footer_title_font)
    ft_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - ft_w) // 2, footer_y + 20), footer_title, fill=COLOR_BLACK, font=footer_title_font)
    
    # 内容
    footer_content_font = get_font(45)
    footer_text = "每个决策点都走完流程  ·  保持纪律理性决策  ·  不被情绪左右  ·  长期盈利"
    bbox = draw.textbbox((0, 0), footer_text, font=footer_content_font)
    fc_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - fc_w) // 2, footer_y + 85), footer_text, fill=COLOR_GRAY, font=footer_content_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_4streets_overview.jpg")
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print("✓ 生成完成")
    print()
    print(f"文件：poker_4streets_overview.jpg")
    print(f"尺寸：A4横向 (297mm x 210mm)")
    print(f"布局：4栏并列")
    print()
    print("专业特点：")
    print("  ✓ 4个街道一目了然")
    print("  ✓ 颜色编码：蓝绿橙紫")
    print("  ✓ 超大图标，快速识别")
    print("  ✓ 关键词精炼，便于记忆")
    print("  ✓ 情绪自检红色醒目")
    print("  ✓ 统一规范，易于对比")
    print()
    print("使用场景：")
    print("  • 学习：横向对比4个街道的差异")
    print("  • 实战：快速找到当前街道并查看")
    print("  • 复盘：检查哪个街道决策有问题")
    print()
    print("文件已保存到桌面！")
    print("=" * 70)
    
    return output


def draw_street_column(draw, x, y, width, street):
    """绘制单个街道列"""
    
    color = street['color']
    col_height = 1600
    
    # 列背景（浅色）
    bg_colors = {
        COLOR_BLUE: (240, 248, 255),
        COLOR_GREEN: (240, 255, 240),
        COLOR_ORANGE: (255, 250, 240),
        COLOR_PURPLE: (248, 240, 255)
    }
    bg_color = bg_colors.get(color, (250, 250, 250))
    
    draw.rectangle([x, y, x + width, y + col_height],
                   fill=bg_color, outline=color, width=4)
    
    # 顶部彩色条
    draw.rectangle([x, y, x + width, y + 30], fill=color)
    
    y_pos = y + 50
    
    # ===== 图标区 =====
    icon_font = get_font(100)
    icon_text = street['icon']
    bbox = draw.textbbox((0, 0), icon_text, font=icon_font)
    icon_w = bbox[2] - bbox[0]
    draw.text((x + (width - icon_w) // 2, y_pos), icon_text, font=icon_font)
    y_pos += 120
    
    # ===== 英文标题 =====
    en_font = get_font(36, bold=True)
    en_text = street['en']
    bbox = draw.textbbox((0, 0), en_text, font=en_font)
    en_w = bbox[2] - bbox[0]
    draw.text((x + (width - en_w) // 2, y_pos), en_text, fill=COLOR_GRAY, font=en_font)
    y_pos += 50
    
    # ===== 中文标题 =====
    title_font = get_font(65, bold=True)
    title_text = street['title']
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text((x + (width - title_w) // 2, y_pos), title_text, fill=color, font=title_font)
    y_pos += 90
    
    # 分隔线
    draw.rectangle([x + 30, y_pos, x + width - 30, y_pos + 2], fill=color)
    y_pos += 30
    
    # ===== 核心分析（4个要点）=====
    section_font = get_font(42, bold=True)
    draw.text((x + 30, y_pos), "核心分析", fill=color, font=section_font)
    y_pos += 60
    
    item_font = get_font(32, bold=True)
    for item in street['core']:
        # 背景框
        item_bg_y = y_pos
        draw.rectangle([x + 20, item_bg_y, x + width - 20, item_bg_y + 75],
                       fill=(255, 255, 255), outline=color, width=2)
        
        # 文字
        draw.text((x + 35, item_bg_y + 20), item, fill=COLOR_BLACK, font=item_font)
        y_pos += 85
    
    y_pos += 20
    
    # ===== 情绪自检区（红色）=====
    emotion_h = 200
    draw.rectangle([x + 20, y_pos, x + width - 20, y_pos + emotion_h],
                   fill=(255, 240, 240), outline=COLOR_RED, width=4)
    
    # 警告图标
    warning_font = get_font(50)
    draw.text((x + 40, y_pos + 15), "⚠️", font=warning_font)
    
    # 标题
    emotion_title_font = get_font(45, bold=True)
    draw.text((x + 110, y_pos + 20), "情绪自检", fill=COLOR_RED, font=emotion_title_font)
    
    # 警惕内容
    emotion_font = get_font(36, bold=True)
    emotion_y = y_pos + 80
    emotion_lines = street['emotion'].split('\n')
    for line in emotion_lines:
        bbox = draw.textbbox((0, 0), line, font=emotion_font)
        line_w = bbox[2] - bbox[0]
        draw.text((x + (width - line_w) // 2, emotion_y), line, fill=COLOR_RED, font=emotion_font)
        emotion_y += 42
    
    y_pos += emotion_h + 20
    
    # ===== 行动决策 =====
    draw.text((x + 30, y_pos), "行动决策", fill=color, font=section_font)
    y_pos += 60
    
    action_font = get_font(38, bold=True)
    action_text = street['action']
    bbox = draw.textbbox((0, 0), action_text, font=action_font)
    action_w = bbox[2] - bbox[0]
    
    # 行动背景框
    draw.rectangle([x + 20, y_pos, x + width - 20, y_pos + 70],
                   fill=(255, 255, 220), outline=color, width=3)
    
    draw.text((x + (width - action_w) // 2, y_pos + 15), action_text, fill=color, font=action_font)


if __name__ == "__main__":
    try:
        generate_overview()
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



