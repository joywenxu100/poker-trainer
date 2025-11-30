# -*- coding: utf-8 -*-
"""
德州扑克决策流程 - 手机壁纸生成器
生成适合手机使用的记忆卡片壁纸
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 手机壁纸配置 (1080x2400 适配大部分安卓手机和iPhone)
WIDTH = 1080
HEIGHT = 2400
PADDING = 40

# 颜色配置
BG_COLOR = (15, 32, 39)  # 深蓝色背景
COLOR_TITLE = (0, 212, 255)  # 青色
COLOR_SUBTITLE = (255, 215, 0)  # 金色
COLOR_TEXT = (224, 224, 224)  # 浅灰色
COLOR_WARNING = (255, 107, 107)  # 红色警告
COLOR_ACCENT = (0, 255, 136)  # 绿色强调

# 7阶段数据（主干+分支）
PHASES_DATA = [
    {
        "number": "1",
        "title": "信息收集",
        "mnemonic": "位筹池敌",
        "items": ["位置?", "筹码?", "底池?", "对手?"],
        "color": COLOR_ACCENT
    },
    {
        "number": "2",
        "title": "牌力评估",
        "mnemonic": "绝相听面",
        "items": ["绝对牌力?", "相对强度?", "听牌outs?", "牌面结构?"],
        "color": COLOR_ACCENT
    },
    {
        "number": "3",
        "title": "对手范围",
        "mnemonic": "之前比例唬弃",
        "items": ["之前行动?", "强中弱比例?", "会唬吗?", "会弃吗?"],
        "color": COLOR_ACCENT
    },
    {
        "number": "4",
        "title": "赔率计算",
        "mnemonic": "池需实隐",
        "items": ["底池赔率?", "需要胜率?", "实际equity?", "隐含赔率?"],
        "color": COLOR_ACCENT
    },
    {
        "number": "5",
        "title": "情绪自检",
        "mnemonic": "冷影逻一",
        "items": ["是否冷静?", "有无影响?", "逻辑决策?", "1小时前?"],
        "color": COLOR_WARNING
    },
    {
        "number": "6",
        "title": "行动决策",
        "mnemonic": "弃跟加量",
        "items": ["Fold理由?", "Call理由?", "Raise理由?", "Sizing?"],
        "color": COLOR_ACCENT
    },
    {
        "number": "7",
        "title": "二次确认",
        "mnemonic": "略期漏",
        "items": ["符合策略?", "长期+EV?", "有无遗漏?"],
        "color": COLOR_ACCENT
    }
]

def get_font(size, bold=False):
    """获取字体"""
    font_paths = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
    ]
    
    try:
        for font_path in font_paths:
            if os.path.exists(font_path):
                return ImageFont.truetype(font_path, size)
    except:
        pass
    
    return ImageFont.load_default()


def draw_rounded_rectangle(draw, xy, radius, fill):
    """绘制圆角矩形"""
    x1, y1, x2, y2 = xy
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
    draw.ellipse([x1, y1, x1 + radius * 2, y1 + radius * 2], fill=fill)
    draw.ellipse([x2 - radius * 2, y1, x2, y1 + radius * 2], fill=fill)
    draw.ellipse([x1, y2 - radius * 2, x1 + radius * 2, y2], fill=fill)
    draw.ellipse([x2 - radius * 2, y2 - radius * 2, x2, y2], fill=fill)


def generate_wallpaper_v1():
    """版本1：完整详细版"""
    print("生成版本1：完整详细版壁纸...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    y_pos = 60
    
    # 主标题
    title_font = get_font(48, bold=True)
    title = "🎯 德州扑克决策流程"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width) // 2, y_pos), title, fill=COLOR_TITLE, font=title_font)
    y_pos += 70
    
    # 主干口诀
    slogan_font = get_font(32, bold=True)
    slogan = "信牌对赔情，行动再确认"
    bbox = draw.textbbox((0, 0), slogan, font=slogan_font)
    slogan_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - slogan_width) // 2, y_pos), slogan, fill=COLOR_SUBTITLE, font=slogan_font)
    y_pos += 60
    
    # 分隔线
    draw.rectangle([PADDING * 2, y_pos, WIDTH - PADDING * 2, y_pos + 2], fill=COLOR_TITLE)
    y_pos += 40
    
    # 绘制7个阶段
    for phase in PHASES_DATA:
        # 阶段卡片背景
        card_height = 140
        card_y1 = y_pos
        card_y2 = y_pos + card_height
        
        bg_color = (255, 107, 107, 30) if phase["color"] == COLOR_WARNING else (0, 255, 136, 20)
        draw_rounded_rectangle(draw, [PADDING, card_y1, WIDTH - PADDING, card_y2], 12, bg_color)
        
        # 左侧边框
        accent_color = phase["color"]
        draw.rectangle([PADDING, card_y1, PADDING + 5, card_y2], fill=accent_color)
        
        # 阶段标题行
        phase_y = card_y1 + 15
        
        # 编号圆圈
        circle_x = PADDING + 35
        circle_y = phase_y + 20
        circle_radius = 18
        draw.ellipse(
            [circle_x - circle_radius, circle_y - circle_radius,
             circle_x + circle_radius, circle_y + circle_radius],
            fill=accent_color
        )
        
        # 编号
        num_font = get_font(24, bold=True)
        num_text = phase["number"]
        bbox = draw.textbbox((0, 0), num_text, font=num_font)
        num_width = bbox[2] - bbox[0]
        draw.text((circle_x - num_width // 2, circle_y - 12), num_text, fill=BG_COLOR, font=num_font)
        
        # 阶段名称
        title_font = get_font(28, bold=True)
        draw.text((circle_x + circle_radius + 15, phase_y + 5), 
                  f"{phase['title']}", fill=accent_color, font=title_font)
        
        # 口诀
        mnemonic_font = get_font(24, bold=True)
        draw.text((circle_x + circle_radius + 15, phase_y + 40),
                  f"「{phase['mnemonic']}」", fill=COLOR_SUBTITLE, font=mnemonic_font)
        
        # 分支问题
        items_y = card_y1 + 85
        item_font = get_font(18)
        items_text = " · ".join(phase["items"])
        draw.text((PADDING + 25, items_y), items_text, fill=COLOR_TEXT, font=item_font)
        
        y_pos = card_y2 + 15
    
    # 底部提示
    footer_y = HEIGHT - 100
    footer_font = get_font(20)
    footer_text = "每个决策点都走完流程 · 形成肌肉记忆"
    bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
    footer_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - footer_width) // 2, footer_y), footer_text, fill=(150, 150, 150), font=footer_font)
    
    footer2_text = "目标：1000次训练 🏆"
    bbox = draw.textbbox((0, 0), footer2_text, font=footer_font)
    footer2_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - footer2_width) // 2, footer_y + 35), footer2_text, fill=COLOR_SUBTITLE, font=footer_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_wallpaper_full.jpg")
    img.save(output, "JPEG", quality=95, optimize=True)
    
    print(f"完整版壁纸生成成功！")
    print(f"{output}")
    return output


def generate_wallpaper_v2():
    """版本2：精简口诀版"""
    print("生成版本2：精简口诀版壁纸...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    y_pos = HEIGHT // 2 - 400
    
    # 主标题
    title_font = get_font(56, bold=True)
    title = "🎯 决策流程"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width) // 2, y_pos), title, fill=COLOR_TITLE, font=title_font)
    y_pos += 100
    
    # 主干口诀（超大字体）
    slogan_font = get_font(48, bold=True)
    slogan1 = "信牌对赔情"
    slogan2 = "行动再确认"
    
    bbox = draw.textbbox((0, 0), slogan1, font=slogan_font)
    slogan_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - slogan_width) // 2, y_pos), slogan1, fill=COLOR_SUBTITLE, font=slogan_font)
    y_pos += 80
    
    bbox = draw.textbbox((0, 0), slogan2, font=slogan_font)
    slogan_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - slogan_width) // 2, y_pos), slogan2, fill=COLOR_SUBTITLE, font=slogan_font)
    y_pos += 120
    
    # 分隔线
    draw.rectangle([WIDTH // 2 - 200, y_pos, WIDTH // 2 + 200, y_pos + 3], fill=COLOR_TITLE)
    y_pos += 60
    
    # 口诀列表
    mnemonic_font = get_font(32, bold=True)
    mnemonics = [
        ("1. 位筹池敌", COLOR_ACCENT),
        ("2. 绝相听面", COLOR_ACCENT),
        ("3. 之前比例唬弃", COLOR_ACCENT),
        ("4. 池需实隐", COLOR_ACCENT),
        ("5. 冷影逻一 ⚠️", COLOR_WARNING),
        ("6. 弃跟加量", COLOR_ACCENT),
        ("7. 略期漏", COLOR_ACCENT),
    ]
    
    for text, color in mnemonics:
        bbox = draw.textbbox((0, 0), text, font=mnemonic_font)
        text_width = bbox[2] - bbox[0]
        draw.text(((WIDTH - text_width) // 2, y_pos), text, fill=color, font=mnemonic_font)
        y_pos += 70
    
    # 底部提示
    footer_y = HEIGHT - 120
    footer_font = get_font(24)
    footer_text = "重复1000次 · 形成本能"
    bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
    footer_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - footer_width) // 2, footer_y), footer_text, fill=(150, 150, 150), font=footer_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_wallpaper_simple.jpg")
    img.save(output, "JPEG", quality=95, optimize=True)
    
    print(f"精简版壁纸生成成功！")
    print(f"{output}")
    return output


def generate_wallpaper_v3():
    """版本3：锁屏专用版（一眼就能看）"""
    print("生成版本3：锁屏专用版壁纸...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 背景装饰圆圈
    for i in range(3):
        alpha = 20 - i * 5
        radius = 400 + i * 100
        center_x, center_y = WIDTH // 2, HEIGHT // 3
        draw.ellipse(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            fill=(0, 212, 255, alpha)
        )
    
    y_pos = 200
    
    # 超大主口诀
    main_font = get_font(64, bold=True)
    main_text = "信牌对赔情"
    bbox = draw.textbbox((0, 0), main_text, font=main_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_width) // 2, y_pos), main_text, fill=COLOR_TITLE, font=main_font)
    y_pos += 100
    
    main_text2 = "行动再确认"
    bbox = draw.textbbox((0, 0), main_text2, font=main_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_width) // 2, y_pos), main_text2, fill=COLOR_TITLE, font=main_font)
    y_pos += 180
    
    # 关键提醒
    warning_font = get_font(48, bold=True)
    warning_text = "⚠️ 情绪自检最关键"
    bbox = draw.textbbox((0, 0), warning_text, font=warning_font)
    text_width = bbox[2] - bbox[0]
    
    # 警告背景框
    padding = 30
    box_x1 = (WIDTH - text_width) // 2 - padding
    box_y1 = y_pos - 20
    box_x2 = (WIDTH + text_width) // 2 + padding
    box_y2 = y_pos + 60
    draw_rounded_rectangle(draw, [box_x1, box_y1, box_x2, box_y2], 15, (255, 107, 107, 50))
    draw.rectangle([box_x1, box_y1, box_x1 + 5, box_y2], fill=COLOR_WARNING)
    
    draw.text(((WIDTH - text_width) // 2, y_pos), warning_text, fill=COLOR_WARNING, font=warning_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_wallpaper_lockscreen.jpg")
    img.save(output, "JPEG", quality=95, optimize=True)
    
    print(f"锁屏版壁纸生成成功！")
    print(f"{output}")
    return output


if __name__ == "__main__":
    try:
        print("开始生成德州扑克记忆壁纸...")
        print("=" * 60)
        
        # 生成3个版本
        v1 = generate_wallpaper_v1()
        print()
        v2 = generate_wallpaper_v2()
        print()
        v3 = generate_wallpaper_v3()
        
        print()
        print("=" * 60)
        print("全部完成！生成了3个版本：")
        print()
        print("版本1：完整详细版")
        print("   - 文件：poker_wallpaper_full.jpg")
        print("   - 用途：日常查看，包含所有26个问题")
        print()
        print("版本2：精简口诀版")
        print("   - 文件：poker_wallpaper_simple.jpg")
        print("   - 用途：快速记忆，只显示口诀")
        print()
        print("版本3：锁屏专用版")
        print("   - 文件：poker_wallpaper_lockscreen.jpg")
        print("   - 用途：锁屏提醒，一眼就能看到核心")
        print()
        print("使用建议：")
        print("   - 版本3设为锁屏壁纸（打牌前看一眼）")
        print("   - 版本1或2设为主屏幕壁纸（训练时查看）")
        print()
        print("所有壁纸已保存到桌面！")
        
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()

