# -*- coding: utf-8 -*-
"""
德州扑克决策流程 - 分街道版本
PreFlop / Flop / Turn / River 专项决策流程
"""

from PIL import Image, ImageDraw, ImageFont
import os

# A4配置
WIDTH = 2480
HEIGHT = 3508
MARGIN = 80

# 配色
BG_COLOR = (255, 255, 255)
COLOR_BLACK = (30, 30, 30)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (150, 150, 150)
COLOR_LIGHT_GRAY = (240, 240, 240)

# 4个街道的决策流程
STREETS_DATA = {
    "preflop": {
        "title": "翻前决策流程 (Pre-Flop)",
        "subtitle": "起手牌选择 · 位置优势 · 开局策略",
        "color": COLOR_BLUE,
        "phases": [
            {
                "number": "1",
                "title": "起手牌评估",
                "mnemonic": "牌位范围",
                "time": "2-3秒",
                "items": [
                    "□ 我的起手牌强度？(优质/投机/垃圾)",
                    "□ 我的位置？(早/中/晚/盲注)",
                    "□ 起手牌在这个位置的可玩性？",
                    "□ 我的打法范围是否平衡？"
                ]
            },
            {
                "number": "2",
                "title": "对手分析",
                "mnemonic": "松紧激被",
                "time": "2-3秒",
                "items": [
                    "□ 对手类型？(紧凶/松凶/紧被动/松被动)",
                    "□ 对手的翻前加注频率？",
                    "□ 对手是否尊重加注？",
                    "□ 对手筹码量vs我的筹码？"
                ]
            },
            {
                "number": "3",
                "title": "行动前分析",
                "mnemonic": "前跟注池",
                "time": "2-3秒",
                "items": [
                    "□ 前面有无加注/跟注？",
                    "□ 有多少人进池？",
                    "□ 当前底池大小？",
                    "□ 我需要投入多少？"
                ]
            },
            {
                "number": "4",
                "title": "赔率考虑",
                "mnemonic": "赔率筹码",
                "time": "2-3秒",
                "items": [
                    "□ 底池赔率是否足够？",
                    "□ 隐含赔率如何？(能赢多少)",
                    "□ 有效筹码深度？(SPR)",
                    "□ 反向隐含赔率？(可能输多少)"
                ]
            },
            {
                "number": "5",
                "title": "情绪自检",
                "mnemonic": "冷静理性",
                "time": "1-2秒",
                "items": [
                    "□ 我是否因为无聊想玩牌？",
                    "□ 我是否因为连续弃牌想反击？",
                    "□ 这个决策是理性的吗？",
                    "□ 我的心态是否健康？"
                ],
                "warning": True
            },
            {
                "number": "6",
                "title": "行动决策",
                "mnemonic": "弃跟加再",
                "time": "2-3秒",
                "items": [
                    "□ Fold: 牌太弱或位置不利",
                    "□ Call: 有隐含赔率，想便宜看翻牌",
                    "□ Raise: 价值加注或隔离对手",
                    "□ 3-bet/4-bet: 我的范围和sizing？"
                ]
            },
            {
                "number": "7",
                "title": "计划翻后",
                "mnemonic": "翻后计划",
                "time": "1-2秒",
                "items": [
                    "□ 击中什么牌面我会继续？",
                    "□ 没击中如何应对？",
                    "□ 我的翻后位置优势？",
                    "□ 我的计划是否清晰？"
                ]
            }
        ]
    },
    
    "flop": {
        "title": "翻牌圈决策流程 (Flop)",
        "subtitle": "牌面分析 · 范围对抗 · 持续攻击",
        "color": COLOR_GREEN,
        "phases": [
            {
                "number": "1",
                "title": "牌面结构",
                "mnemonic": "干湿高低",
                "time": "2-3秒",
                "items": [
                    "□ 牌面是干燥还是湿润？",
                    "□ 牌面是高牌还是低牌？",
                    "□ 有无同花/顺子听牌？",
                    "□ 牌面对我的范围友好吗？"
                ]
            },
            {
                "number": "2",
                "title": "我的牌力",
                "mnemonic": "击中听牌",
                "time": "2-3秒",
                "items": [
                    "□ 我击中了什么？(对/两对/三条/听牌)",
                    "□ 我的牌在对手范围中的强度？",
                    "□ 我有多少outs？(改进机会)",
                    "□ 我的牌容易被读出来吗？"
                ]
            },
            {
                "number": "3",
                "title": "对手范围",
                "mnemonic": "范围对抗",
                "time": "2-3秒",
                "items": [
                    "□ 对手翻前范围在这个牌面击中什么？",
                    "□ 对手可能有的最强牌/听牌？",
                    "□ 对手会不会诈唬？",
                    "□ 我的牌vs对手范围的equity？"
                ]
            },
            {
                "number": "4",
                "title": "位置考虑",
                "mnemonic": "位置主动",
                "time": "2-3秒",
                "items": [
                    "□ 我有位置优势吗？",
                    "□ 谁有主动权？(翻前加注者)",
                    "□ 如何利用位置优势？",
                    "□ 失去位置如何应对？"
                ]
            },
            {
                "number": "5",
                "title": "情绪自检",
                "mnemonic": "冷静评估",
                "time": "1-2秒",
                "items": [
                    "□ 我是否因为击中而过度兴奋？",
                    "□ 我是否因为miss而想诈唬？",
                    "□ 我的决策是基于牌力还是情绪？",
                    "□ 我是否在追逐不好的听牌？"
                ],
                "warning": True
            },
            {
                "number": "6",
                "title": "行动决策",
                "mnemonic": "过跟注加",
                "time": "2-3秒",
                "items": [
                    "□ Check: 控制底池或陷阱",
                    "□ Call: 有足够equity继续",
                    "□ Bet/Raise: 价值下注或半诈唬",
                    "□ Sizing: 1/3, 1/2, 2/3, 还是超池？"
                ]
            },
            {
                "number": "7",
                "title": "转牌计划",
                "mnemonic": "转牌策略",
                "time": "1-2秒",
                "items": [
                    "□ 哪些转牌对我有利？",
                    "□ 哪些转牌我要放弃？",
                    "□ 我的转牌持续策略？",
                    "□ 底池大小vs剩余筹码？"
                ]
            }
        ]
    },
    
    "turn": {
        "title": "转牌圈决策流程 (Turn)",
        "subtitle": "牌力重估 · 底池控制 · 承诺点",
        "color": COLOR_ORANGE,
        "phases": [
            {
                "number": "1",
                "title": "转牌变化",
                "mnemonic": "改进完成",
                "time": "2-3秒",
                "items": [
                    "□ 转牌改进了我的牌吗？",
                    "□ 转牌完成了听牌吗？",
                    "□ 转牌改变了牌面结构吗？",
                    "□ 转牌对我的范围有利吗？"
                ]
            },
            {
                "number": "2",
                "title": "牌力重估",
                "mnemonic": "强度位置",
                "time": "2-3秒",
                "items": [
                    "□ 我的牌现在有多强？",
                    "□ 我还有改进机会吗？(河牌outs)",
                    "□ 对手可能击中了转牌吗？",
                    "□ 我的相对牌力变化？"
                ]
            },
            {
                "number": "3",
                "title": "底池筹码比",
                "mnemonic": "池筹承诺",
                "time": "2-3秒",
                "items": [
                    "□ 当前底池大小？",
                    "□ 我的剩余筹码？",
                    "□ SPR(筹码底池比)是多少？",
                    "□ 我是否已经pot committed？"
                ]
            },
            {
                "number": "4",
                "title": "对手故事",
                "mnemonic": "行动线索",
                "time": "2-3秒",
                "items": [
                    "□ 对手翻前-翻牌-转牌的行动一致吗？",
                    "□ 对手在讲什么故事？",
                    "□ 对手的sizing有什么含义？",
                    "□ 对手转牌是否变谨慎/激进？"
                ]
            },
            {
                "number": "5",
                "title": "情绪自检",
                "mnemonic": "冷静承诺",
                "time": "1-2秒",
                "items": [
                    "□ 底池大了，我是否因此失去理智？",
                    "□ 我是否在追逐不好的听牌？",
                    "□ 我是否不愿放弃已投入的筹码？",
                    "□ 这个决策理性吗？"
                ],
                "warning": True
            },
            {
                "number": "6",
                "title": "行动决策",
                "mnemonic": "控保价诈",
                "time": "2-3秒",
                "items": [
                    "□ Check: 控制底池/放弃",
                    "□ Call: 有赔率继续看河牌",
                    "□ Bet/Raise: 价值下注/保护/诈唬",
                    "□ All-in: 我是否应该全下？"
                ]
            },
            {
                "number": "7",
                "title": "河牌计划",
                "mnemonic": "河牌结局",
                "time": "1-2秒",
                "items": [
                    "□ 哪些河牌我继续价值？",
                    "□ 哪些河牌我要放弃？",
                    "□ 我的河牌诈唬机会？",
                    "□ 最终摊牌我能赢吗？"
                ]
            }
        ]
    },
    
    "river": {
        "title": "河牌圈决策流程 (River)",
        "subtitle": "最终对决 · 价值最大化 · 诈唬时机",
        "color": COLOR_PURPLE,
        "phases": [
            {
                "number": "1",
                "title": "河牌影响",
                "mnemonic": "完成砖牌",
                "time": "2-3秒",
                "items": [
                    "□ 河牌完成了听牌吗？",
                    "□ 河牌是砖牌(blank)吗？",
                    "□ 河牌改变了坚果牌吗？",
                    "□ 河牌对范围影响？"
                ]
            },
            {
                "number": "2",
                "title": "最终牌力",
                "mnemonic": "强弱对比",
                "time": "2-3秒",
                "items": [
                    "□ 我的最终牌力？",
                    "□ 我是否有坚果或接近坚果？",
                    "□ 我能打败哪些牌？",
                    "□ 我会输给哪些牌？"
                ]
            },
            {
                "number": "3",
                "title": "对手范围",
                "mnemonic": "范围缩小",
                "time": "2-3秒",
                "items": [
                    "□ 结合整个行动线，对手有什么？",
                    "□ 对手会用什么牌call/bet？",
                    "□ 对手的value range vs bluff range？",
                    "□ 我vs对手整体范围的equity？"
                ]
            },
            {
                "number": "4",
                "title": "底池优化",
                "mnemonic": "榨取价值",
                "time": "2-3秒",
                "items": [
                    "□ 我能从对手榨取多少价值？",
                    "□ 对手会call多大的bet？",
                    "□ 我应该bet多少获得最大价值？",
                    "□ 如果check，我会失去价值吗？"
                ]
            },
            {
                "number": "5",
                "title": "情绪自检",
                "mnemonic": "最后冷静",
                "time": "1-2秒",
                "items": [
                    "□ 我是否因为底池大而非理性？",
                    "□ 我是否在hero call(英雄跟注)？",
                    "□ 我是否在赌气诈唬？",
                    "□ 这个决策能长期盈利吗？"
                ],
                "warning": True
            },
            {
                "number": "6",
                "title": "行动决策",
                "mnemonic": "价诈弃跟",
                "time": "2-3秒",
                "items": [
                    "□ Value Bet: 我有最强牌，要下注多少？",
                    "□ Bluff: 我要诈唬吗？sizing多少？",
                    "□ Check: 控制底池/引诱诈唬",
                    "□ Call/Fold: 面对下注，我赢得够多吗？"
                ]
            },
            {
                "number": "7",
                "title": "摊牌决策",
                "mnemonic": "摊牌价值",
                "time": "1-2秒",
                "items": [
                    "□ 我的牌有摊牌价值吗？",
                    "□ 如果check，我能赢吗？",
                    "□ 如果bet被跟注，我能赢吗？",
                    "□ 如果fold，我是否被诈唬？"
                ]
            }
        ]
    }
}


def get_font(size, bold=False):
    """获取字体"""
    font_paths = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
    ]
    
    try:
        for font_path in font_paths:
            if os.path.exists(font_path):
                return ImageFont.truetype(font_path, size)
    except:
        pass
    
    return ImageFont.load_default()


def generate_single_street_a4(street_key, data):
    """生成单个街道的A4"""
    print(f"生成 {data['title']}...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    y_pos = MARGIN
    
    # 标题
    title_font = get_font(100, bold=True)
    bbox = draw.textbbox((0, 0), data['title'], font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_width) // 2, y_pos), data['title'], fill=data['color'], font=title_font)
    y_pos += 120
    
    # 副标题
    subtitle_font = get_font(45)
    bbox = draw.textbbox((0, 0), data['subtitle'], font=subtitle_font)
    subtitle_width = bbox[2] - bbox[0]
    draw.text(((WIDTH - subtitle_width) // 2, y_pos), data['subtitle'], fill=COLOR_GRAY, font=subtitle_font)
    y_pos += 80
    
    # 分隔线
    draw.rectangle([MARGIN, y_pos, WIDTH - MARGIN, y_pos + 3], fill=data['color'])
    y_pos += 40
    
    # 7个阶段
    for phase in data['phases']:
        y_pos = draw_phase_compact(draw, y_pos, phase, data['color'])
        y_pos += 10
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = f"poker_{street_key}_A4.jpg"
    output = os.path.join(desktop, filename)
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print(f"  完成: {filename}")
    return output


def draw_phase_compact(draw, y_start, phase, main_color):
    """绘制紧凑阶段"""
    item_count = len(phase["items"])
    box_height = 180 + item_count * 35
    
    x1, y1 = MARGIN, y_start
    x2, y2 = WIDTH - MARGIN, y_start + box_height
    
    # 背景
    is_warning = phase.get("warning", False)
    bg_color = (255, 230, 230) if is_warning else COLOR_LIGHT_GRAY
    phase_color = COLOR_RED if is_warning else main_color
    
    draw.rectangle([x1, y1, x2, y2], fill=bg_color, outline=phase_color, width=3)
    draw.rectangle([x1, y1, x1 + 15, y2], fill=phase_color)
    
    # 编号圆圈
    num_x, num_y = x1 + 80, y1 + 50
    radius = 50
    draw.ellipse([num_x - radius, num_y - radius, num_x + radius, num_y + radius], fill=phase_color)
    
    num_font = get_font(60, bold=True)
    num_text = phase["number"]
    bbox = draw.textbbox((0, 0), num_text, font=num_font)
    num_width, num_height = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((num_x - num_width // 2, num_y - num_height // 2 - 5), num_text, fill=BG_COLOR, font=num_font)
    
    # 标题
    title_x = num_x + radius + 25
    title_font = get_font(58, bold=True)
    draw.text((title_x, y1 + 20), phase["title"], fill=phase_color, font=title_font)
    
    # 时间
    time_font = get_font(36)
    draw.text((title_x, y1 + 85), phase["time"], fill=COLOR_GRAY, font=time_font)
    
    # 口诀
    mnemonic_font = get_font(44, bold=True)
    mnemonic_text = f"【{phase['mnemonic']}】"
    mnemonic_y = y1 + 125
    
    bbox = draw.textbbox((0, 0), mnemonic_text, font=mnemonic_font)
    mnemonic_width = bbox[2] - bbox[0]
    bg_x1, bg_y1 = title_x - 8, mnemonic_y - 5
    bg_x2, bg_y2 = title_x + mnemonic_width + 8, mnemonic_y + 50
    
    draw.rectangle([bg_x1, bg_y1, bg_x2, bg_y2], fill=(255, 255, 200), outline=phase_color, width=2)
    draw.text((title_x, mnemonic_y), mnemonic_text, fill=phase_color, font=mnemonic_font)
    
    # 项目列表
    items_y = y1 + 175
    item_font = get_font(32)
    
    for item in phase["items"]:
        draw.text((x1 + 40, items_y), item, fill=COLOR_BLACK, font=item_font)
        items_y += 35
    
    return y2


def generate_all_streets():
    """生成所有4个街道"""
    print("开始生成分街道决策流程...")
    print("=" * 60)
    
    outputs = []
    for street_key in ["preflop", "flop", "turn", "river"]:
        output = generate_single_street_a4(street_key, STREETS_DATA[street_key])
        outputs.append(output)
        print()
    
    return outputs


if __name__ == "__main__":
    try:
        outputs = generate_all_streets()
        
        print("=" * 60)
        print("全部完成！已生成4个街道的决策流程：")
        print()
        print("1. poker_preflop_A4.jpg - 翻前决策 (蓝色)")
        print("2. poker_flop_A4.jpg - 翻牌圈决策 (绿色)")
        print("3. poker_turn_A4.jpg - 转牌圈决策 (橙色)")
        print("4. poker_river_A4.jpg - 河牌圈决策 (紫色)")
        print()
        print("使用建议：")
        print("  - 初学者：打印全部4张，分街道学习")
        print("  - 进阶者：重点打印薄弱街道")
        print("  - 实战：根据当前街道查看对应的那张")
        print()
        print("所有文件已保存到桌面！")
        
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



