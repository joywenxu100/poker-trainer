# -*- coding: utf-8 -*-
"""
德州扑克分街道决策流程 - 优化版布局
左右两栏均衡分布，间距充足，便于查看
"""

from PIL import Image, ImageDraw, ImageFont
import os

# A4配置
WIDTH = 2480
HEIGHT = 3508
MARGIN = 60

# 配色
BG_COLOR = (255, 255, 255)
COLOR_BLACK = (30, 30, 30)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (150, 150, 150)
COLOR_LIGHT_GRAY = (245, 245, 245)

# 街道数据（简化版）
STREETS_DATA = {
    "preflop": {
        "title": "翻前决策 (Pre-Flop)",
        "color": COLOR_BLUE,
        "slogan": "起手牌选择 · 位置优势 · 开局策略",
        "phases": [
            {"num": "1", "title": "起手牌评估", "key": "牌位范围", "items": ["起手牌强度？", "我的位置？", "可玩性如何？", "范围平衡吗？"]},
            {"num": "2", "title": "对手分析", "key": "松紧激被", "items": ["对手类型？", "加注频率？", "尊重加注？", "筹码对比？"]},
            {"num": "3", "title": "行动前分析", "key": "前跟注池", "items": ["前面行动？", "多少人进池？", "底池大小？", "投入多少？"]},
            {"num": "4", "title": "赔率考虑", "key": "赔率筹码", "items": ["底池赔率？", "隐含赔率？", "有效筹码？", "反向赔率？"]},
            {"num": "5", "title": "情绪自检", "key": "冷静理性", "items": ["无聊想玩？", "想反击？", "理性决策？", "心态健康？"], "warning": True},
            {"num": "6", "title": "行动决策", "key": "弃跟加再", "items": ["Fold理由？", "Call理由？", "Raise理由？", "3bet sizing？"]},
            {"num": "7", "title": "翻后计划", "key": "翻后预判", "items": ["击中什么继续？", "没击中咋办？", "位置优势？", "计划清晰？"]}
        ]
    },
    "flop": {
        "title": "翻牌圈决策 (Flop)",
        "color": COLOR_GREEN,
        "slogan": "牌面分析 · 范围对抗 · 持续攻击",
        "phases": [
            {"num": "1", "title": "牌面结构", "key": "干湿高低", "items": ["干燥or湿润？", "高牌or低牌？", "听牌可能？", "范围友好？"]},
            {"num": "2", "title": "我的牌力", "key": "击中听牌", "items": ["击中什么？", "相对强度？", "多少outs？", "易被读出？"]},
            {"num": "3", "title": "对手范围", "key": "范围对抗", "items": ["对手击中？", "最强牌？", "会诈唬？", "我的equity？"]},
            {"num": "4", "title": "位置考虑", "key": "位置主动", "items": ["有位置？", "谁主动？", "如何利用？", "失位应对？"]},
            {"num": "5", "title": "情绪自检", "key": "冷静评估", "items": ["过度兴奋？", "想诈唬？", "基于牌力？", "追烂听牌？"], "warning": True},
            {"num": "6", "title": "行动决策", "key": "过跟注加", "items": ["Check？", "Call？", "Bet/Raise？", "Sizing？"]},
            {"num": "7", "title": "转牌计划", "key": "转牌策略", "items": ["有利转牌？", "放弃转牌？", "持续策略？", "底池vs筹码？"]}
        ]
    },
    "turn": {
        "title": "转牌圈决策 (Turn)",
        "color": COLOR_ORANGE,
        "slogan": "牌力重估 · 底池控制 · 承诺点",
        "phases": [
            {"num": "1", "title": "转牌变化", "key": "改进完成", "items": ["改进我的牌？", "完成听牌？", "改变结构？", "范围有利？"]},
            {"num": "2", "title": "牌力重估", "key": "强度位置", "items": ["现在多强？", "改进机会？", "对手击中？", "相对变化？"]},
            {"num": "3", "title": "底池筹码比", "key": "池筹承诺", "items": ["底池大小？", "剩余筹码？", "SPR多少？", "已承诺？"]},
            {"num": "4", "title": "对手故事", "key": "行动线索", "items": ["行动一致？", "讲什么故事？", "sizing含义？", "变化特征？"]},
            {"num": "5", "title": "情绪自检", "key": "冷静承诺", "items": ["底池大失智？", "追烂听牌？", "不愿放弃？", "理性吗？"], "warning": True},
            {"num": "6", "title": "行动决策", "key": "控保价诈", "items": ["Check？", "Call？", "Bet/Raise？", "All-in？"]},
            {"num": "7", "title": "河牌计划", "key": "河牌结局", "items": ["继续价值？", "放弃河牌？", "诈唬机会？", "能赢吗？"]}
        ]
    },
    "river": {
        "title": "河牌圈决策 (River)",
        "color": COLOR_PURPLE,
        "slogan": "最终对决 · 价值最大化 · 诈唬时机",
        "phases": [
            {"num": "1", "title": "河牌影响", "key": "完成砖牌", "items": ["完成听牌？", "砖牌？", "改变坚果？", "范围影响？"]},
            {"num": "2", "title": "最终牌力", "key": "强弱对比", "items": ["最终牌力？", "坚果？", "打败哪些？", "输给哪些？"]},
            {"num": "3", "title": "对手范围", "key": "范围缩小", "items": ["整体行动线？", "会call/bet？", "value vs bluff？", "我的equity？"]},
            {"num": "4", "title": "底池优化", "key": "榨取价值", "items": ["榨取多少？", "会call多大？", "bet多少？", "check失价值？"]},
            {"num": "5", "title": "情绪自检", "key": "最后冷静", "items": ["底池大非理性？", "hero call？", "赌气诈唬？", "长期盈利？"], "warning": True},
            {"num": "6", "title": "行动决策", "key": "价诈弃跟", "items": ["Value bet？", "Bluff？", "Check？", "Call/Fold？"]},
            {"num": "7", "title": "摊牌决策", "key": "摊牌价值", "items": ["摊牌价值？", "check能赢？", "bet被跟能赢？", "fold被诈唬？"]}
        ]
    }
}


def get_font(size, bold=False):
    """获取字体"""
    try:
        path = "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    except:
        pass
    return ImageFont.load_default()


def generate_balanced_layout(street_key, data):
    """生成平衡布局"""
    print(f"生成 {data['title']} (优化版)...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # === 顶部标题区 ===
    y = MARGIN
    
    # 主标题
    title_font = get_font(90, bold=True)
    bbox = draw.textbbox((0, 0), data['title'], font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_w) // 2, y), data['title'], fill=data['color'], font=title_font)
    y += 110
    
    # 副标题
    slogan_font = get_font(42)
    bbox = draw.textbbox((0, 0), data['slogan'], font=slogan_font)
    slogan_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - slogan_w) // 2, y), data['slogan'], fill=COLOR_GRAY, font=slogan_font)
    y += 70
    
    # 分隔线
    draw.rectangle([MARGIN, y, WIDTH - MARGIN, y + 3], fill=data['color'])
    y += 40
    
    # === 两栏布局 ===
    col_width = (WIDTH - MARGIN * 2 - 40) // 2
    left_x = MARGIN
    right_x = MARGIN + col_width + 40
    
    phases = data['phases']
    
    # 左栏：阶段1-4
    left_y = y
    for i in range(4):
        left_y = draw_compact_card(draw, left_x, left_y, col_width, phases[i], data['color'])
        left_y += 15
    
    # 右栏：阶段5-7
    right_y = y
    for i in range(4, 7):
        right_y = draw_compact_card(draw, right_x, right_y, col_width, phases[i], data['color'])
        right_y += 15
    
    # === 底部提示框 ===
    footer_y = max(left_y, right_y) + 30
    footer_height = 100
    
    draw.rectangle([MARGIN, footer_y, WIDTH - MARGIN, footer_y + footer_height],
                   fill=(255, 250, 230), outline=data['color'], width=3)
    
    # 提示文字
    tip_font = get_font(38, bold=True)
    tip = "每个决策点都走完流程  保持冷静  长期盈利"
    bbox = draw.textbbox((0, 0), tip, font=tip_font)
    tip_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - tip_w) // 2, footer_y + 30), tip, fill=data['color'], font=tip_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = f"poker_{street_key}_balanced.jpg"
    output = os.path.join(desktop, filename)
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print(f"  完成: {filename}")
    return output


def draw_compact_card(draw, x, y, width, phase, main_color):
    """绘制紧凑卡片"""
    
    is_warning = phase.get("warning", False)
    color = COLOR_RED if is_warning else main_color
    bg = (255, 240, 240) if is_warning else COLOR_LIGHT_GRAY
    
    # 卡片高度
    card_h = 260
    
    # 背景
    draw.rectangle([x, y, x + width, y + card_h], fill=bg, outline=color, width=3)
    draw.rectangle([x, y, x + 10, y + card_h], fill=color)
    
    # 编号圆圈
    circle_x, circle_y = x + 55, y + 45
    r = 35
    draw.ellipse([circle_x - r, circle_y - r, circle_x + r, circle_y + r], fill=color)
    
    num_font = get_font(48, bold=True)
    num = phase["num"]
    bbox = draw.textbbox((0, 0), num, font=num_font)
    nw, nh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((circle_x - nw // 2, circle_y - nh // 2 - 3), num, fill=BG_COLOR, font=num_font)
    
    # 标题
    title_font = get_font(46, bold=True)
    draw.text((circle_x + r + 15, y + 18), phase["title"], fill=color, font=title_font)
    
    # 口诀
    key_font = get_font(36, bold=True)
    key_text = f"【{phase['key']}】"
    key_y = y + 70
    
    bbox = draw.textbbox((0, 0), key_text, font=key_font)
    kw = bbox[2] - bbox[0]
    kx = circle_x + r + 15
    
    draw.rectangle([kx - 5, key_y - 3, kx + kw + 5, key_y + 42],
                   fill=(255, 255, 200), outline=color, width=1)
    draw.text((kx, key_y), key_text, fill=color, font=key_font)
    
    # 项目列表
    item_y = y + 130
    item_font = get_font(28)
    
    for item in phase["items"]:
        # 圆点
        dot_x, dot_y = x + 25, item_y + 12
        draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=color)
        
        # 文字
        draw.text((x + 40, item_y), f"{item}", fill=COLOR_BLACK, font=item_font)
        item_y += 32
    
    return y + card_h


def generate_all_balanced():
    """生成所有优化版"""
    print("开始生成优化版分街道决策流程...")
    print("=" * 60)
    
    for key in ["preflop", "flop", "turn", "river"]:
        generate_balanced_layout(key, STREETS_DATA[key])
        print()
    
    print("=" * 60)
    print("全部完成！已生成优化版：")
    print()
    print("1. poker_preflop_balanced.jpg - 翻前 (蓝色)")
    print("2. poker_flop_balanced.jpg - 翻牌圈 (绿色)")
    print("3. poker_turn_balanced.jpg - 转牌圈 (橙色)")
    print("4. poker_river_balanced.jpg - 河牌圈 (紫色)")
    print()
    print("优化特点：")
    print("  ✅ 左右两栏均衡布局")
    print("  ✅ 间距充足，不拥挤")
    print("  ✅ 卡片式设计，清晰易读")
    print("  ✅ 彩色编号，快速定位")
    print("  ✅ 情绪自检红色突出")
    print()
    print("所有文件已保存到桌面！")


if __name__ == "__main__":
    try:
        generate_all_balanced()
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



