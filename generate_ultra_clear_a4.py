# -*- coding: utf-8 -*-
"""
德州扑克决策流程 - 超清晰A4纵向打印版
专为打牌时快速查看设计，一目了然
"""

from PIL import Image, ImageDraw, ImageFont
import os

# A4纸张配置 (300 DPI)
WIDTH = 2480
HEIGHT = 3508
MARGIN = 80

# 配色方案（清晰识别）
BG_COLOR = (255, 255, 255)
COLOR_BLACK = (30, 30, 30)
COLOR_BLUE = (0, 120, 215)  # 蓝色 - 信息类
COLOR_GREEN = (16, 124, 16)  # 绿色 - 分析类
COLOR_RED = (220, 50, 50)  # 红色 - 情绪类
COLOR_ORANGE = (230, 140, 0)  # 橙色 - 决策类
COLOR_GRAY = (150, 150, 150)
COLOR_LIGHT_GRAY = (240, 240, 240)

# 7阶段数据（带颜色分类）
PHASES = [
    {
        "number": "1",
        "title": "信息收集",
        "mnemonic": "位筹池敌",
        "time": "3-5秒",
        "items": [
            "□ 我的位置是什么？(BTN/CO/MP/EP/SB/BB)",
            "□ 我的有效筹码是多少BB？",
            "□ 当前底池大小是多少？",
            "□ 对手是谁？(紧/松/激进/被动)"
        ],
        "color": COLOR_BLUE
    },
    {
        "number": "2",
        "title": "牌力评估",
        "mnemonic": "绝相听面",
        "time": "2-3秒",
        "items": [
            "□ 我的绝对牌力如何？(坚果/强牌/中牌/弱牌)",
            "□ 我的牌在对手范围中的相对强度？",
            "□ 我有多少改进潜力(outs)？",
            "□ 公共牌面结构？(干燥/湿润/coordinated)"
        ],
        "color": COLOR_GREEN
    },
    {
        "number": "3",
        "title": "对手范围",
        "mnemonic": "之前比例唬弃",
        "time": "3-5秒",
        "items": [
            "□ 对手之前的行动表示什么范围？",
            "□ 对手可能的强牌/中等牌/诈唬比例？",
            "□ 对手会不会在这里诈唬？",
            "□ 对手会不会fold掉更好的牌？"
        ],
        "color": COLOR_GREEN
    },
    {
        "number": "4",
        "title": "赔率计算",
        "mnemonic": "池需实隐",
        "time": "2-3秒",
        "items": [
            "□ 底池赔率是多少？(pot odds)",
            "□ 我需要多少胜率才能call？",
            "□ 我的实际胜率/equity是多少？",
            "□ 隐含赔率(implied odds)是否足够？"
        ],
        "color": COLOR_GREEN
    },
    {
        "number": "5",
        "title": "情绪自检",
        "mnemonic": "冷影逻一",
        "time": "1-2秒",
        "items": [
            "□ 我现在是否冷静？",
            "□ 刚才的结果是否影响我？",
            "□ 我是基于逻辑还是情绪做决策？",
            "□ 如果是1小时前，我会做同样决策吗？"
        ],
        "color": COLOR_RED,
        "warning": True
    },
    {
        "number": "6",
        "title": "行动决策",
        "mnemonic": "弃跟加量",
        "time": "2-3秒",
        "items": [
            "□ Fold: 我的胜率不足以支撑call/raise",
            "□ Call: 我有足够赔率，但raise价值不大",
            "□ Raise: 我要value bet/保护底池/诈唬",
            "□ Sizing: bet/raise大小合理吗？(0.5-0.75pot)"
        ],
        "color": COLOR_ORANGE
    },
    {
        "number": "7",
        "title": "二次确认",
        "mnemonic": "略期漏",
        "time": "1-2秒",
        "items": [
            "□ 这个决策符合我的整体策略吗？",
            "□ 这个决策长期来看是+EV的吗？",
            "□ 我有没有漏掉关键信息？"
        ],
        "color": COLOR_ORANGE
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


def generate_ultra_clear_a4():
    """生成超清晰版A4"""
    print("生成超清晰A4纵向版...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    y_pos = MARGIN
    
    # === 顶部标题区 ===
    # 主标题
    title_font = get_font(110, bold=True)
    title = "德州扑克决策流程"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width) // 2, y_pos), title, fill=COLOR_BLACK, font=title_font)
    y_pos += 140
    
    # 主干口诀（超大，带底色）
    slogan_bg_y1 = y_pos
    slogan_bg_y2 = y_pos + 100
    draw.rectangle([MARGIN, slogan_bg_y1, WIDTH - MARGIN, slogan_bg_y2], 
                   fill=(0, 120, 215, 30), outline=COLOR_BLUE, width=4)
    
    slogan_font = get_font(70, bold=True)
    slogan = "信牌对赔情   行动再确认"
    bbox = draw.textbbox((0, 0), slogan, font=slogan_font)
    slogan_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - slogan_width) // 2, y_pos + 20), slogan, fill=COLOR_BLUE, font=slogan_font)
    y_pos += 130
    
    # 时间提示
    time_font = get_font(40)
    time_text = "总用时: 15-25秒  •  长期盈利的保证"
    bbox = draw.textbbox((0, 0), time_text, font=time_font)
    time_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - time_width) // 2, y_pos), time_text, fill=COLOR_GRAY, font=time_font)
    y_pos += 70
    
    # 分隔线
    draw.rectangle([MARGIN, y_pos, WIDTH - MARGIN, y_pos + 3], fill=COLOR_BLACK)
    y_pos += 50
    
    # === 7个阶段（紧凑布局）===
    for phase in PHASES:
        y_pos = draw_compact_phase(draw, y_pos, phase)
        y_pos += 10  # 阶段间距
    
    # === 底部核心原则 ===
    footer_y = HEIGHT - MARGIN - 180
    
    # 背景框
    draw.rectangle([MARGIN, footer_y, WIDTH - MARGIN, footer_y + 150],
                   fill=(255, 215, 0, 40), outline=COLOR_ORANGE, width=4)
    
    # 标题
    footer_title_font = get_font(50, bold=True)
    footer_title = "核心原则"
    bbox = draw.textbbox((0, 0), footer_title, font=footer_title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width) // 2, footer_y + 20), footer_title, fill=COLOR_ORANGE, font=footer_title_font)
    
    # 内容
    footer_font = get_font(36)
    footer_text1 = "保持纪律  基础决策  不被情绪左右"
    bbox = draw.textbbox((0, 0), footer_text1, font=footer_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_width) // 2, footer_y + 80), footer_text1, fill=COLOR_BLACK, font=footer_font)
    
    footer_text2 = "每个决策点都走完流程  形成肌肉记忆"
    bbox = draw.textbbox((0, 0), footer_text2, font=footer_font)
    text_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - text_width) // 2, footer_y + 120), footer_text2, fill=COLOR_BLACK, font=footer_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_ultra_clear_A4.jpg")
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print(f"超清晰版生成成功！")
    print(f"文件：{output}")
    
    return output


def draw_compact_phase(draw, y_start, phase):
    """绘制紧凑型阶段框"""
    
    # 计算高度
    item_count = len(phase["items"])
    box_height = 220 + item_count * 38
    
    x1 = MARGIN
    y1 = y_start
    x2 = WIDTH - MARGIN
    y2 = y_start + box_height
    
    # 背景色
    is_warning = phase.get("warning", False)
    if is_warning:
        bg_color = (255, 230, 230)
    else:
        bg_color = COLOR_LIGHT_GRAY
    
    draw.rectangle([x1, y1, x2, y2], fill=bg_color, outline=phase["color"], width=4)
    
    # 左侧彩色条
    draw.rectangle([x1, y1, x1 + 20, y2], fill=phase["color"])
    
    # === 头部区域 ===
    header_y = y1 + 25
    
    # 超大编号（左侧）
    num_x = x1 + 100
    num_y = header_y + 40
    
    # 编号圆圈
    circle_radius = 60
    draw.ellipse(
        [num_x - circle_radius, num_y - circle_radius,
         num_x + circle_radius, num_y + circle_radius],
        fill=phase["color"]
    )
    
    # 编号文字
    num_font = get_font(70, bold=True)
    num_text = phase["number"]
    bbox = draw.textbbox((0, 0), num_text, font=num_font)
    num_width = bbox[2] - bbox[0]
    num_height = bbox[3] - bbox[1]
    draw.text((num_x - num_width // 2, num_y - num_height // 2 - 5),
              num_text, fill=BG_COLOR, font=num_font)
    
    # 标题（右侧）
    title_x = num_x + circle_radius + 30
    title_font = get_font(66, bold=True)
    draw.text((title_x, header_y), phase["title"], fill=phase["color"], font=title_font)
    
    # 时间（右侧下方）
    time_font = get_font(40)
    draw.text((title_x, header_y + 80), phase["time"], fill=COLOR_GRAY, font=time_font)
    
    # 口诀（右侧，底色）
    mnemonic_y = header_y + 130
    mnemonic_font = get_font(50, bold=True)
    mnemonic_text = f"【{phase['mnemonic']}】"
    
    # 口诀背景
    bbox = draw.textbbox((0, 0), mnemonic_text, font=mnemonic_font)
    mnemonic_width = bbox[2] - bbox[0]
    mnemonic_bg_x1 = title_x - 10
    mnemonic_bg_y1 = mnemonic_y - 8
    mnemonic_bg_x2 = title_x + mnemonic_width + 10
    mnemonic_bg_y2 = mnemonic_y + 55
    
    # 浅色背景
    bg_alpha = [255, 240, 200] if is_warning else [255, 255, 200]
    draw.rectangle([mnemonic_bg_x1, mnemonic_bg_y1, mnemonic_bg_x2, mnemonic_bg_y2],
                   fill=tuple(bg_alpha), outline=phase["color"], width=2)
    
    draw.text((title_x, mnemonic_y), mnemonic_text, fill=phase["color"], font=mnemonic_font)
    
    # === 分支列表 ===
    items_y = y1 + 200
    item_font = get_font(36)
    
    for item in phase["items"]:
        # 缩进
        item_x = x1 + 50
        
        # 绘制项目
        draw.text((item_x, items_y), item, fill=COLOR_BLACK, font=item_font)
        items_y += 38
    
    return y2


if __name__ == "__main__":
    try:
        print("开始生成超清晰A4打印版...")
        print("=" * 60)
        
        output = generate_ultra_clear_a4()
        
        print()
        print("=" * 60)
        print("完成！")
        print()
        print("文件：poker_ultra_clear_A4.jpg")
        print("尺寸：A4纵向 (210mm x 297mm)")
        print("分辨率：300 DPI")
        print()
        print("设计特点：")
        print("  - 彩色编码：蓝色(信息) 绿色(分析) 红色(情绪) 橙色(决策)")
        print("  - 超大编号：远处也能一眼看到第几步")
        print("  - 口诀突出：黄色底色，快速识别")
        print("  - 紧凑布局：7个阶段在一页纸上清晰展示")
        print("  - 勾选框：可以打印后用笔勾选")
        print()
        print("打印建议：")
        print("  - 彩色打印效果最佳")
        print("  - 覆膜后更耐用")
        print("  - 放在桌面随时查看")
        print()
        print("文件已保存到桌面！")
        
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



