"""
德州扑克决策流程图生成器
生成一张精美的JPG图片，适合手机查看
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 图片配置
WIDTH = 1080
HEIGHT = 3200
PADDING = 40
BG_COLOR = (15, 32, 39)  # 深蓝色背景

# 颜色配置
COLOR_TITLE = (0, 212, 255)  # 青色
COLOR_SUBTITLE = (255, 215, 0)  # 金色
COLOR_TEXT = (224, 224, 224)  # 浅灰色
COLOR_PHASE_BG = (30, 50, 60, 180)  # 半透明深色
COLOR_WARNING = (255, 107, 107)  # 红色警告
COLOR_ACCENT = (0, 255, 136)  # 绿色强调

# 阶段数据
PHASES = [
    {
        "number": 1,
        "title": "信息收集",
        "time": "3-5秒",
        "items": [
            "我的位置是什么？(BTN/CO/MP/EP/SB/BB)",
            "我的有效筹码是多少BB？",
            "当前底池大小是多少？",
            "对手是谁？(紧/松/激进/被动)"
        ],
        "warning": False
    },
    {
        "number": 2,
        "title": "牌力评估",
        "time": "2-3秒",
        "items": [
            "我的绝对牌力如何？(坚果/强牌/中牌/弱牌)",
            "我的牌在对手范围中的相对强度？",
            "我有多少改进潜力(outs)？",
            "公共牌面结构？(干燥/湿润/coordinated)"
        ],
        "warning": False
    },
    {
        "number": 3,
        "title": "对手范围分析",
        "time": "3-5秒",
        "items": [
            "对手之前的行动表示什么范围？",
            "对手可能的强牌/中等牌/诈唬比例？",
            "对手会不会在这里诈唬？",
            "对手会不会fold掉更好的牌？"
        ],
        "warning": False
    },
    {
        "number": 4,
        "title": "赔率计算",
        "time": "2-3秒",
        "items": [
            "底池赔率是多少？(pot odds)",
            "我需要多少胜率才能call？",
            "我的实际胜率/equity是多少？",
            "隐含赔率(implied odds)是否足够？"
        ],
        "warning": False
    },
    {
        "number": 5,
        "title": "情绪自检 ⚠️必检",
        "time": "1-2秒",
        "items": [
            "我现在是否冷静？",
            "刚才的结果是否影响我？",
            "我是基于逻辑还是情绪做决策？",
            "如果是1小时前，我会做同样决策吗？"
        ],
        "warning": True
    },
    {
        "number": 6,
        "title": "行动决策",
        "time": "2-3秒",
        "items": [
            "Fold: 我的胜率不足以支撑call/raise",
            "Call: 我有足够赔率，但raise价值不大",
            "Raise: 我要value bet/保护底池/诈唬",
            "Sizing: bet/raise大小合理吗？(0.5-0.75pot)"
        ],
        "warning": False
    },
    {
        "number": 7,
        "title": "二次确认",
        "time": "1-2秒",
        "items": [
            "这个决策符合我的整体策略吗？",
            "这个决策长期来看是+EV的吗？",
            "我有没有漏掉关键信息？"
        ],
        "warning": False
    }
]


def get_font(size, bold=False):
    """获取字体，优先使用系统中文字体"""
    font_paths = [
        # Windows字体
        "C:/Windows/Fonts/msyh.ttc",  # 微软雅黑
        "C:/Windows/Fonts/msyhbd.ttc",  # 微软雅黑粗体
        "C:/Windows/Fonts/simhei.ttf",  # 黑体
        "C:/Windows/Fonts/simsun.ttc",  # 宋体
        # 通用fallback
        "/System/Library/Fonts/PingFang.ttc",  # Mac
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",  # Linux
    ]
    
    try:
        if bold and os.path.exists("C:/Windows/Fonts/msyhbd.ttc"):
            return ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", size)
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                return ImageFont.truetype(font_path, size)
    except Exception as e:
        print(f"加载字体失败: {e}")
    
    # 如果所有字体都加载失败，使用默认字体
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


def draw_phase_card(draw, y_offset, phase):
    """绘制单个阶段卡片"""
    card_x1 = PADDING
    card_x2 = WIDTH - PADDING
    
    # 计算卡片高度
    items_count = len(phase["items"])
    card_height = 120 + items_count * 45
    
    card_y1 = y_offset
    card_y2 = y_offset + card_height
    
    # 绘制卡片背景
    draw_rounded_rectangle(
        draw,
        [card_x1, card_y1, card_x2, card_y2],
        radius=15,
        fill=COLOR_PHASE_BG
    )
    
    # 绘制左侧强调线
    accent_color = COLOR_WARNING if phase["warning"] else COLOR_TITLE
    draw.rectangle(
        [card_x1, card_y1, card_x1 + 6, card_y2],
        fill=accent_color
    )
    
    # 绘制阶段编号圆圈
    circle_x = card_x1 + 40
    circle_y = card_y1 + 45
    circle_radius = 25
    draw.ellipse(
        [circle_x - circle_radius, circle_y - circle_radius,
         circle_x + circle_radius, circle_y + circle_radius],
        fill=accent_color
    )
    
    # 绘制编号
    number_font = get_font(32, bold=True)
    number_text = str(phase["number"])
    bbox = draw.textbbox((0, 0), number_text, font=number_font)
    number_width = bbox[2] - bbox[0]
    number_height = bbox[3] - bbox[1]
    draw.text(
        (circle_x - number_width // 2, circle_y - number_height // 2 - 5),
        number_text,
        fill=BG_COLOR,
        font=number_font
    )
    
    # 绘制阶段标题
    title_font = get_font(40, bold=True)
    title_color = COLOR_WARNING if phase["warning"] else COLOR_TITLE
    draw.text(
        (circle_x + circle_radius + 20, card_y1 + 25),
        phase["title"],
        fill=title_color,
        font=title_font
    )
    
    # 绘制时间
    time_font = get_font(22)
    draw.text(
        (circle_x + circle_radius + 20, card_y1 + 75),
        phase["time"],
        fill=(150, 150, 150),
        font=time_font
    )
    
    # 绘制检查项
    item_y = card_y1 + 120
    item_font = get_font(24)
    
    for item in phase["items"]:
        # 绘制勾选标记
        check_x = card_x1 + 90
        draw.text(
            (check_x, item_y),
            "✓",
            fill=COLOR_ACCENT,
            font=get_font(28, bold=True)
        )
        
        # 绘制文本
        draw.text(
            (check_x + 35, item_y + 2),
            item,
            fill=COLOR_TEXT,
            font=item_font
        )
        
        item_y += 45
    
    return card_y2 + 25  # 返回下一个卡片的起始Y坐标


def generate_poker_checklist():
    """生成德州扑克决策流程图"""
    print("🎨 开始生成德州扑克决策流程图...")
    
    # 创建画布
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 绘制标题区域
    y_pos = PADDING + 20
    
    # 主标题
    title_font = get_font(60, bold=True)
    title_text = "🎯 德州扑克决策流程"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - title_width) // 2, y_pos),
        title_text,
        fill=COLOR_TITLE,
        font=title_font
    )
    
    y_pos += 80
    
    # 副标题
    subtitle_font = get_font(28)
    subtitle_text = "7步标准化思维 · 杜绝低级错误"
    bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - subtitle_width) // 2, y_pos),
        subtitle_text,
        fill=COLOR_SUBTITLE,
        font=subtitle_font
    )
    
    y_pos += 70
    
    # 绘制分隔线
    draw.rectangle(
        [PADDING * 2, y_pos, WIDTH - PADDING * 2, y_pos + 3],
        fill=COLOR_TITLE
    )
    
    y_pos += 40
    
    # 绘制所有阶段卡片
    for phase in PHASES:
        print(f"  绘制阶段 {phase['number']}: {phase['title']}")
        y_pos = draw_phase_card(draw, y_pos, phase)
    
    # 绘制底部提示框
    tips_y1 = y_pos + 10
    tips_y2 = tips_y1 + 150
    
    draw_rounded_rectangle(
        draw,
        [PADDING * 2, tips_y1, WIDTH - PADDING * 2, tips_y2],
        radius=15,
        fill=(255, 215, 0, 40)
    )
    
    # 绘制边框
    draw.rectangle(
        [PADDING * 2, tips_y1, PADDING * 2 + 3, tips_y2],
        fill=COLOR_SUBTITLE
    )
    draw.rectangle(
        [WIDTH - PADDING * 2 - 3, tips_y1, WIDTH - PADDING * 2, tips_y2],
        fill=COLOR_SUBTITLE
    )
    draw.rectangle(
        [PADDING * 2, tips_y1, WIDTH - PADDING * 2, tips_y1 + 3],
        fill=COLOR_SUBTITLE
    )
    draw.rectangle(
        [PADDING * 2, tips_y2 - 3, WIDTH - PADDING * 2, tips_y2],
        fill=COLOR_SUBTITLE
    )
    
    # 提示文本
    tips_font = get_font(30, bold=True)
    tips_text = "💡 核心原则"
    bbox = draw.textbbox((0, 0), tips_text, font=tips_font)
    tips_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - tips_width) // 2, tips_y1 + 25),
        tips_text,
        fill=COLOR_SUBTITLE,
        font=tips_font
    )
    
    content_font = get_font(22)
    content_text1 = "保持纪律 · 理性决策 · 不被情绪左右"
    bbox = draw.textbbox((0, 0), content_text1, font=content_font)
    content_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - content_width) // 2, tips_y1 + 75),
        content_text1,
        fill=COLOR_TEXT,
        font=content_font
    )
    
    content_text2 = "每个决策点都走完流程 · 形成肌肉记忆"
    bbox = draw.textbbox((0, 0), content_text2, font=content_font)
    content_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - content_width) // 2, tips_y1 + 110),
        content_text2,
        fill=COLOR_TEXT,
        font=content_font
    )
    
    # 绘制底部说明
    footer_y = tips_y2 + 40
    footer_font = get_font(32, bold=True)
    footer_text = "⏱️ 总用时: 15-25秒 · 长期盈利的保证"
    bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
    footer_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - footer_width) // 2, footer_y),
        footer_text,
        fill=COLOR_SUBTITLE,
        font=footer_font
    )
    
    subfooter_font = get_font(22)
    subfooter_text = "重复1000次，变成本能反应"
    bbox = draw.textbbox((0, 0), subfooter_text, font=subfooter_font)
    subfooter_width = bbox[2] - bbox[0]
    draw.text(
        ((WIDTH - subfooter_width) // 2, footer_y + 45),
        subfooter_text,
        fill=(150, 150, 150),
        font=subfooter_font
    )
    
    # 保存图片到桌面
    import os
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output_filename = os.path.join(desktop, "poker_checklist.jpg")
    img.save(output_filename, "JPEG", quality=95, optimize=True)
    
    print(f"✅ 图片生成成功！")
    print(f"📁 保存位置: {os.path.abspath(output_filename)}")
    print(f"📐 图片尺寸: {WIDTH}x{HEIGHT} 像素")
    print(f"💾 文件大小: {os.path.getsize(output_filename) / 1024:.1f} KB")
    print(f"\n🎉 现在可以把图片发送到手机查看了！")


if __name__ == "__main__":
    try:
        generate_poker_checklist()
    except Exception as e:
        print(f"❌ 生成失败: {e}")
        import traceback
        traceback.print_exc()

