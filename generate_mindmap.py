# -*- coding: utf-8 -*-
"""
德州扑克决策思维导图 - 流程式可视化
信息可视化设计师出品
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 4200
HEIGHT = 2970
BG_COLOR = (250, 250, 250)
COLOR_BLACK = (20, 20, 20)
COLOR_WHITE = (255, 255, 255)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (100, 100, 100)

# 思维导图数据（精简关键词）
MINDMAP_DATA = {
    "preflop": {
        "name": "翻前",
        "icon": "🎴",
        "color": COLOR_BLUE,
        "bg": (230, 240, 255),
        "core": ["牌力·位置", "对手·松紧", "底池·SPR", "隐含赔率"],
        "emotion": ["冷静", "别无聊想玩", "别连败报复"],
        "actions": [
            ("Fold", "弃牌"),
            ("Limp", "平跟"),
            ("Call", "跟注"),
            ("Raise", "2.5-3BB"),
            ("3-Bet", "9-12BB"),
            ("4-Bet", "22-25BB"),
            ("5-Bet", "All-in"),
            ("Cold Call", "冷跟")
        ]
    },
    "flop": {
        "name": "翻牌圈",
        "icon": "🎲",
        "color": COLOR_GREEN,
        "bg": (230, 255, 230),
        "core": ["牌面·干湿", "击中·未中", "对手·范围", "位置·主动"],
        "emotion": ["别兴奋", "别追逐", "别盲目诈唬"],
        "actions": [
            ("Check", "过牌"),
            ("C-bet 1/3", "小额"),
            ("C-bet 1/2", "标准"),
            ("C-bet 2/3", "大额"),
            ("Pot Bet", "满池"),
            ("Overbet", "超池"),
            ("Donk Bet", "主动"),
            ("Check-Raise", "陷阱"),
            ("Float", "位置偷"),
            ("Probe", "试探")
        ]
    },
    "turn": {
        "name": "转牌圈",
        "icon": "⚡",
        "color": COLOR_ORANGE,
        "bg": (255, 245, 220),
        "core": ["转牌·性质", "牌力·重估", "SPR·筹码", "故事·一致"],
        "emotion": ["别失智", "别不甘心", "别追差牌"],
        "actions": [
            ("Check", "过牌"),
            ("Bet 1/3", "控池"),
            ("Bet 1/2", "标准"),
            ("Bet 2/3", "大额"),
            ("Pot Bet", "满池"),
            ("Overbet", "超池"),
            ("C-Raise", "陷阱"),
            ("Probe", "试探"),
            ("Block", "阻断"),
            ("All-in", "全下")
        ]
    },
    "river": {
        "name": "河牌圈",
        "icon": "🎯",
        "color": COLOR_PURPLE,
        "bg": (245, 230, 255),
        "core": ["河牌·影响", "最终·牌力", "范围·分析", "EV·最大"],
        "emotion": ["别Hero Call", "别赌气", "别非理性"],
        "actions": [
            ("Thin 1/3", "薄价值"),
            ("Value 1/2", "中价值"),
            ("Value 2/3", "强价值"),
            ("Overbet V", "超池价值"),
            ("Block 1/4", "阻断"),
            ("Bluff 1/3", "小诈唬"),
            ("Bluff 1/2", "标准诈唬"),
            ("Overbet B", "超池诈唬"),
            ("Check", "过牌"),
            ("C-Raise", "陷阱"),
            ("Hero Call", "英雄跟"),
            ("Crying", "勉强跟")
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


def draw_rounded_rect(draw, x, y, w, h, r, fill, outline, width):
    """绘制圆角矩形"""
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=fill, outline=outline, width=width)


def draw_arrow(draw, x1, y1, x2, y2, color, width=8):
    """绘制箭头"""
    # 线条
    draw.line([x1, y1, x2, y2], fill=color, width=width)
    # 箭头
    arrow_size = 20
    draw.polygon([
        (x2, y2),
        (x2 - arrow_size, y2 - arrow_size // 2),
        (x2 - arrow_size, y2 + arrow_size // 2)
    ], fill=color)


def draw_street_node(draw, x, y, width, height, key, data):
    """绘制街道节点（思维导图风格）"""
    color = data['color']
    bg = data['bg']
    
    # 主框（圆角）
    draw_rounded_rect(draw, x, y, width, height, 25, bg, color, 6)
    
    cy = y + 20
    
    # 图标 + 街道名（超大）
    icon_font = get_font(70)
    name_font = get_font(65, bold=True)
    
    icon_text = f"{data['icon']} {data['name']}"
    bbox = draw.textbbox((0, 0), icon_text, font=name_font)
    tw = bbox[2] - bbox[0]
    draw.text((x + (width - tw) // 2, cy), icon_text, fill=color, font=name_font)
    cy += 85
    
    # 分隔线
    draw.rectangle([x + 30, cy, x + width - 30, cy + 4], fill=color)
    cy += 25
    
    # 核心分析（2列）
    title_font = get_font(45, bold=True)
    draw.text((x + 30, cy), "核心分析 ↓", fill=color, font=title_font)
    cy += 55
    
    core_font = get_font(36, bold=True)
    col_w = (width - 80) // 2
    for i, item in enumerate(data['core']):
        col = i % 2
        row = i // 2
        cx = x + 40 + col * (col_w + 20)
        cy_offset = cy + row * 50
        
        # 小方块
        draw.rectangle([cx, cy_offset + 8, cx + 12, cy_offset + 20], fill=color)
        draw.text((cx + 22, cy_offset), item, fill=COLOR_BLACK, font=core_font)
    
    cy += 110
    
    # 情绪自检（红色警告框）
    emo_h = 100
    draw_rounded_rect(draw, x + 20, cy, width - 40, emo_h, 15, (255, 230, 230), COLOR_RED, 5)
    
    emo_title_font = get_font(42, bold=True)
    draw.text((x + 35, cy + 12), "⚠️ 情绪自检", fill=COLOR_RED, font=emo_title_font)
    
    emo_font = get_font(32, bold=True)
    emo_y = cy + 58
    emo_text = " · ".join(data['emotion'])
    bbox = draw.textbbox((0, 0), emo_text, font=emo_font)
    ew = bbox[2] - bbox[0]
    draw.text((x + (width - ew) // 2, emo_y), emo_text, fill=COLOR_RED, font=emo_font)
    
    cy += emo_h + 25
    
    # 行动决策
    draw.text((x + 30, cy), "行动决策 ↓", fill=color, font=title_font)
    cy += 55
    
    # 行动选项（2列，紧凑）
    action_font = get_font(32, bold=True)
    action_sub_font = get_font(26)
    
    col_w = (width - 80) // 2
    for i, (name, sub) in enumerate(data['actions']):
        col = i % 2
        row = i // 2
        cx = x + 40 + col * (col_w + 20)
        cy_offset = cy + row * 42
        
        # 圆点
        draw.ellipse([cx, cy_offset + 8, cx + 10, cy_offset + 18], fill=color)
        draw.text((cx + 18, cy_offset), name, fill=COLOR_BLACK, font=action_font)
        
        # 副标题
        bbox = draw.textbbox((0, 0), name, font=action_font)
        nw = bbox[2] - bbox[0]
        draw.text((cx + 18 + nw + 10, cy_offset + 3), sub, fill=COLOR_GRAY, font=action_sub_font)


def generate_mindmap():
    """生成流程式思维导图"""
    print("=" * 70)
    print("德州扑克决策思维导图 - 流程可视化")
    print("=" * 70)
    print()
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # 顶部标题
    y = 35
    title_font = get_font(90, bold=True)
    title = "🃏 德州扑克职业级决策流程 - 思维导图"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, y), title, fill=COLOR_BLACK, font=title_font)
    y += 100
    
    # 流程箭头提示
    flow_font = get_font(42, bold=True)
    flow_text = "Pre-Flop → Flop → Turn → River"
    bbox = draw.textbbox((0, 0), flow_text, font=flow_font)
    fw = bbox[2] - bbox[0]
    draw.text(((WIDTH - fw) // 2, y), flow_text, fill=COLOR_GRAY, font=flow_font)
    y += 70
    
    # 2x2 节点布局
    gap = 30
    node_w = (WIDTH - 100 - gap) // 2
    node_h = 1200
    
    start_y = y
    
    # 绘制4个节点
    streets = ["preflop", "flop", "turn", "river"]
    positions = [
        (50, start_y),  # 左上
        (50 + node_w + gap, start_y),  # 右上
        (50, start_y + node_h + gap),  # 左下
        (50 + node_w + gap, start_y + node_h + gap)  # 右下
    ]
    
    for i, key in enumerate(streets):
        x, y_pos = positions[i]
        draw_street_node(draw, x, y_pos, node_w, node_h, key, MINDMAP_DATA[key])
    
    # 绘制流程箭头
    arrow_color = COLOR_GRAY
    
    # 翻前 → 翻牌圈
    draw_arrow(draw, 
               50 + node_w, start_y + node_h // 2,
               50 + node_w + gap, start_y + node_h // 2,
               arrow_color)
    
    # 翻牌圈 → 转牌圈（向下转弯）
    x1 = 50 + node_w + gap + node_w // 2
    y1 = start_y + node_h
    y2 = start_y + node_h + gap
    draw.line([x1, y1, x1, y2], fill=arrow_color, width=8)
    draw.polygon([
        (x1, y2),
        (x1 - 10, y2 - 20),
        (x1 + 10, y2 - 20)
    ], fill=arrow_color)
    
    # 转牌圈 ← 河牌圈（向左）
    draw_arrow(draw,
               50 + node_w + gap + node_w, start_y + node_h + gap + node_h // 2,
               50 + node_w, start_y + node_h + gap + node_h // 2,
               arrow_color)
    
    # 底部口诀
    mantra_y = start_y + 2 * node_h + gap + 35
    mantra_h = HEIGHT - mantra_y - 40
    
    draw_rounded_rect(draw, 50, mantra_y, WIDTH - 100, mantra_h, 20, 
                     (255, 255, 230), COLOR_RED, 5)
    
    mantra_font = get_font(75, bold=True)
    mantra = "🎯 位范情池算，听牌明赔率，底筹优河终"
    bbox = draw.textbbox((0, 0), mantra, font=mantra_font)
    mw = bbox[2] - bbox[0]
    draw.text(((WIDTH - mw) // 2, mantra_y + 20), mantra, fill=COLOR_RED, font=mantra_font)
    
    detail_font = get_font(38)
    detail = "位(位置)·范(范围)·情(情绪)·池(底池)·算(概率) | 听(听牌)·牌(牌面)·明(sizing)·赔(隐含)·率(胜率) | 底(管理)·筹(深度)·优(EV)·河(精细)·终(故事)"
    bbox = draw.textbbox((0, 0), detail, font=detail_font)
    dw = bbox[2] - bbox[0]
    draw.text(((WIDTH - dw) // 2, mantra_y + 105), detail, fill=COLOR_BLACK, font=detail_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = "poker_mindmap.jpg"
    output = os.path.join(desktop, filename)
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print("✓ 思维导图生成完成")
    print()
    print(f"文件：{filename}")
    print("格式：JPG")
    print("尺寸：A4横向 (297mm x 210mm)")
    print()
    print("思维导图特点：")
    print("  ✓ 流程箭头：翻前→翻牌圈→转牌圈→河牌圈")
    print("  ✓ 圆角设计：柔和视觉")
    print("  ✓ 颜色编码：4色区分街道")
    print("  ✓ 图标醒目：1秒识别")
    print("  ✓ 层次清晰：核心分析→情绪→行动")
    print("  ✓ 关键词精简：快速扫视")
    print("  ✓ 2列布局：减少视线移动")
    print("  ✓ 红色警告：情绪自检突出")
    print("  ✓ 底部口诀：记忆锚点")
    print()
    print("设计理念：")
    print("  • 信息可视化：图形>文字")
    print("  • 流程导向：跟随游戏节奏")
    print("  • 视觉引导：箭头指引思路")
    print("  • 快速决策：大字+精简")
    print()
    print("文件已保存到桌面！")
    print("=" * 70)


if __name__ == "__main__":
    try:
        generate_mindmap()
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



