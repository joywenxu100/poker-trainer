# -*- coding: utf-8 -*-
"""
德州扑克决策流程 - A4打印版生成器
专为打印设计，布局清晰，适合贴在桌边查看
"""

from PIL import Image, ImageDraw, ImageFont
import os

# A4纸张配置 (300 DPI)
# A4尺寸：210mm x 297mm
WIDTH = 2480  # 210mm @ 300dpi
HEIGHT = 3508  # 297mm @ 300dpi
MARGIN = 120

# 打印友好的颜色（适合黑白打印）
BG_COLOR = (255, 255, 255)  # 白色背景
COLOR_BLACK = (0, 0, 0)
COLOR_DARK_GRAY = (60, 60, 60)
COLOR_GRAY = (120, 120, 120)
COLOR_LIGHT_GRAY = (200, 200, 200)
COLOR_RED = (200, 50, 50)  # 情绪自检用红色

# 7阶段数据
PHASES_DATA = [
    {
        "number": "1",
        "title": "信息收集",
        "mnemonic": "位筹池敌",
        "items": ["位置", "筹码", "底池", "对手"],
        "is_warning": False
    },
    {
        "number": "2",
        "title": "牌力评估",
        "mnemonic": "绝相听面",
        "items": ["绝对牌力", "相对强度", "听牌outs", "牌面结构"],
        "is_warning": False
    },
    {
        "number": "3",
        "title": "对手范围",
        "mnemonic": "之前比例唬弃",
        "items": ["之前行动", "强中弱比例", "会唬吗", "会弃吗"],
        "is_warning": False
    },
    {
        "number": "4",
        "title": "赔率计算",
        "mnemonic": "池需实隐",
        "items": ["底池赔率", "需要胜率", "实际equity", "隐含赔率"],
        "is_warning": False
    },
    {
        "number": "5",
        "title": "情绪自检",
        "mnemonic": "冷影逻一",
        "items": ["是否冷静", "有无影响", "逻辑决策", "1小时前"],
        "is_warning": True
    },
    {
        "number": "6",
        "title": "行动决策",
        "mnemonic": "弃跟加量",
        "items": ["Fold理由", "Call理由", "Raise理由", "Sizing"],
        "is_warning": False
    },
    {
        "number": "7",
        "title": "二次确认",
        "mnemonic": "略期漏",
        "items": ["符合策略", "长期+EV", "有无遗漏"],
        "is_warning": False
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


def generate_a4_print_version():
    """生成A4打印版本"""
    print("生成A4打印版本...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    y_pos = MARGIN
    
    # === 顶部标题区域 ===
    title_font = get_font(120, bold=True)
    title = "德州扑克决策流程"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width) // 2, y_pos), title, fill=COLOR_BLACK, font=title_font)
    y_pos += 150
    
    # 主干口诀
    slogan_font = get_font(80, bold=True)
    slogan = "信牌对赔情  行动再确认"
    bbox = draw.textbbox((0, 0), slogan, font=slogan_font)
    slogan_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - slogan_width) // 2, y_pos), slogan, fill=COLOR_DARK_GRAY, font=slogan_font)
    y_pos += 110
    
    # 分隔线
    draw.rectangle([MARGIN, y_pos, WIDTH - MARGIN, y_pos + 4], fill=COLOR_BLACK)
    y_pos += 50
    
    # === 7个阶段区域 ===
    # 每个阶段的高度
    phase_height = 350
    
    for i, phase in enumerate(PHASES_DATA):
        # 阶段背景框
        box_x1 = MARGIN
        box_y1 = y_pos
        box_x2 = WIDTH - MARGIN
        box_y2 = y_pos + phase_height
        
        # 背景
        bg_color = (255, 240, 240) if phase["is_warning"] else (245, 245, 245)
        draw.rectangle([box_x1, box_y1, box_x2, box_y2], fill=bg_color, outline=COLOR_LIGHT_GRAY, width=3)
        
        # 左侧强调条
        border_color = COLOR_RED if phase["is_warning"] else COLOR_BLACK
        draw.rectangle([box_x1, box_y1, box_x1 + 15, box_y2], fill=border_color)
        
        # === 阶段头部 ===
        header_y = box_y1 + 30
        
        # 编号圆圈
        circle_x = box_x1 + 80
        circle_y = header_y + 45
        circle_radius = 50
        draw.ellipse(
            [circle_x - circle_radius, circle_y - circle_radius,
             circle_x + circle_radius, circle_y + circle_radius],
            fill=border_color
        )
        
        # 编号文字
        num_font = get_font(60, bold=True)
        num_text = phase["number"]
        bbox = draw.textbbox((0, 0), num_text, font=num_font)
        num_width = bbox[2] - bbox[0]
        num_height = bbox[3] - bbox[1]
        draw.text(
            (circle_x - num_width // 2, circle_y - num_height // 2 - 5),
            num_text,
            fill=BG_COLOR,
            font=num_font
        )
        
        # 阶段标题
        title_font = get_font(72, bold=True)
        title_color = COLOR_RED if phase["is_warning"] else COLOR_BLACK
        draw.text((circle_x + circle_radius + 40, header_y), phase["title"], fill=title_color, font=title_font)
        
        # 口诀（在标题右侧）
        mnemonic_font = get_font(60, bold=True)
        mnemonic_x = circle_x + circle_radius + 40
        mnemonic_y = header_y + 90
        draw.text((mnemonic_x, mnemonic_y), f"【{phase['mnemonic']}】", fill=COLOR_DARK_GRAY, font=mnemonic_font)
        
        # === 分支项目（横向排列）===
        items_y = box_y1 + 200
        item_font = get_font(48)
        
        # 计算每个item的宽度
        content_width = box_x2 - box_x1 - 100
        item_count = len(phase["items"])
        item_spacing = content_width // item_count
        
        start_x = box_x1 + 50
        for idx, item in enumerate(phase["items"]):
            item_x = start_x + idx * item_spacing
            
            # 绘制圆点
            dot_x = item_x + 20
            dot_y = items_y + 20
            draw.ellipse(
                [dot_x - 8, dot_y - 8, dot_x + 8, dot_y + 8],
                fill=COLOR_DARK_GRAY
            )
            
            # 绘制文字
            draw.text((item_x + 45, items_y), item, fill=COLOR_DARK_GRAY, font=item_font)
        
        y_pos = box_y2 + 20
    
    # === 底部提示 ===
    footer_y = HEIGHT - MARGIN - 120
    
    # 上边框线
    draw.rectangle([MARGIN, footer_y, WIDTH - MARGIN, footer_y + 3], fill=COLOR_LIGHT_GRAY)
    footer_y += 30
    
    footer_font = get_font(48)
    footer_text1 = "每个决策点都走完流程  形成肌肉记忆  目标1000次"
    bbox = draw.textbbox((0, 0), footer_text1, font=footer_font)
    footer_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - footer_width) // 2, footer_y), footer_text1, fill=COLOR_GRAY, font=footer_font)
    
    # 保存到桌面
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_checklist_A4_print.jpg")
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print(f"A4打印版生成成功！")
    print(f"文件：{output}")
    print(f"尺寸：A4 (210mm x 297mm)")
    print(f"分辨率：300 DPI（高清打印）")
    
    return output


def generate_a4_landscape_version():
    """生成A4横向版本（更适合桌面查看）"""
    print("生成A4横向版本...")
    
    # 横向A4
    width = 3508
    height = 2480
    margin = 100
    
    img = Image.new('RGB', (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # === 顶部标题 ===
    y_pos = margin
    
    title_font = get_font(100, bold=True)
    title = "德州扑克决策流程"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((width - title_width) // 2, y_pos), title, fill=COLOR_BLACK, font=title_font)
    y_pos += 130
    
    # 主干口诀
    slogan_font = get_font(64, bold=True)
    slogan = "信牌对赔情  行动再确认"
    bbox = draw.textbbox((0, 0), slogan, font=slogan_font)
    slogan_width = bbox[2] - bbox[0]
    draw.text(((width - slogan_width) // 2, y_pos), slogan, fill=COLOR_DARK_GRAY, font=slogan_font)
    y_pos += 100
    
    # 分隔线
    draw.rectangle([margin, y_pos, width - margin, y_pos + 3], fill=COLOR_BLACK)
    y_pos += 40
    
    # === 7个阶段（横向2行布局）===
    # 第一行：4个阶段
    # 第二行：3个阶段
    
    row1_phases = PHASES_DATA[:4]
    row2_phases = PHASES_DATA[4:]
    
    phase_width = (width - margin * 2 - 60) // 4
    phase_height = 500
    
    # 第一行
    x_start = margin
    y_start = y_pos
    
    for i, phase in enumerate(row1_phases):
        draw_phase_box_horizontal(draw, x_start + i * (phase_width + 20), y_start, phase_width, phase_height, phase)
    
    # 第二行（3个，居中）
    y_start2 = y_start + phase_height + 30
    phase_width2 = (width - margin * 2 - 40) // 3
    
    for i, phase in enumerate(row2_phases):
        x_offset = (width - 3 * phase_width2 - 40) // 2
        draw_phase_box_horizontal(draw, x_offset + i * (phase_width2 + 20), y_start2, phase_width2, phase_height, phase)
    
    # 底部提示
    footer_y = height - margin - 60
    footer_font = get_font(40)
    footer_text = "每个决策点都走完流程  形成肌肉记忆  目标1000次"
    bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
    footer_width = bbox[2] - bbox[0]
    draw.text(((width - footer_width) // 2, footer_y), footer_text, fill=COLOR_GRAY, font=footer_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    output = os.path.join(desktop, "poker_checklist_A4_landscape.jpg")
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print(f"A4横向版生成成功！")
    print(f"文件：{output}")
    print(f"尺寸：A4横向 (297mm x 210mm)")
    
    return output


def draw_phase_box_horizontal(draw, x, y, w, h, phase):
    """绘制横向布局的阶段框"""
    # 背景
    bg_color = (255, 240, 240) if phase["is_warning"] else (245, 245, 245)
    draw.rectangle([x, y, x + w, y + h], fill=bg_color, outline=COLOR_LIGHT_GRAY, width=2)
    
    # 顶部边框
    border_color = COLOR_RED if phase["is_warning"] else COLOR_BLACK
    draw.rectangle([x, y, x + w, y + 10], fill=border_color)
    
    # 编号
    num_font = get_font(50, bold=True)
    num_text = phase["number"]
    bbox = draw.textbbox((0, 0), num_text, font=num_font)
    num_width = bbox[2] - bbox[0]
    draw.text((x + (w - num_width) // 2, y + 30), num_text, fill=border_color, font=num_font)
    
    # 标题
    title_font = get_font(48, bold=True)
    title_color = COLOR_RED if phase["is_warning"] else COLOR_BLACK
    title_text = phase["title"]
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text((x + (w - title_width) // 2, y + 100), title_text, fill=title_color, font=title_font)
    
    # 口诀
    mnemonic_font = get_font(40, bold=True)
    mnemonic_text = f"【{phase['mnemonic']}】"
    bbox = draw.textbbox((0, 0), mnemonic_text, font=mnemonic_font)
    mnemonic_width = bbox[2] - bbox[0]
    draw.text((x + (w - mnemonic_width) // 2, y + 170), mnemonic_text, fill=COLOR_DARK_GRAY, font=mnemonic_font)
    
    # 分支（竖向排列）
    item_font = get_font(32)
    item_y = y + 250
    
    for item in phase["items"]:
        # 圆点
        dot_x = x + 40
        dot_y = item_y + 15
        draw.ellipse([dot_x - 5, dot_y - 5, dot_x + 5, dot_y + 5], fill=COLOR_DARK_GRAY)
        
        # 文字
        draw.text((x + 60, item_y), item, fill=COLOR_DARK_GRAY, font=item_font)
        item_y += 50


if __name__ == "__main__":
    try:
        print("开始生成A4打印版本...")
        print("=" * 60)
        
        # 生成竖向版本
        v1 = generate_a4_print_version()
        print()
        
        # 生成横向版本
        v2 = generate_a4_landscape_version()
        
        print()
        print("=" * 60)
        print("全部完成！生成了2个A4打印版本：")
        print()
        print("版本1：A4竖向版")
        print("   - 文件：poker_checklist_A4_print.jpg")
        print("   - 用途：贴在墙上或夹在文件夹")
        print()
        print("版本2：A4横向版")
        print("   - 文件：poker_checklist_A4_landscape.jpg")
        print("   - 用途：放在桌面，打牌时平铺查看")
        print()
        print("打印建议：")
        print("   - 使用彩色打印效果更好")
        print("   - 黑白打印也完全可用")
        print("   - 建议覆膜或过塑，更耐用")
        print()
        print("所有文件已保存到桌面！")
        
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



