# -*- coding: utf-8 -*-
"""
德州扑克职业级决策流程 - 完整版
包含所有行动选项和sizing策略
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 2480
HEIGHT = 3508
MARGIN = 70

BG_COLOR = (255, 255, 255)
COLOR_BLACK = (20, 20, 20)
COLOR_BLUE = (0, 120, 215)
COLOR_GREEN = (16, 124, 16)
COLOR_RED = (220, 50, 50)
COLOR_ORANGE = (230, 140, 0)
COLOR_PURPLE = (150, 50, 200)
COLOR_GRAY = (120, 120, 120)

# 职业级完整数据
PRO_STREETS = {
    "preflop": {
        "title": "翻前决策",
        "en": "PRE-FLOP",
        "color": COLOR_BLUE,
        "icon": "🎴",
        "core": [
            {"n": "①", "t": "起手牌", "k": "牌力·位置·范围·平衡"},
            {"n": "②", "t": "对手", "k": "松紧·激被·频率·倾向"},
            {"n": "③", "t": "底池", "k": "前位·跟注者·池大·SPR"},
            {"n": "④", "t": "赔率", "k": "底池赔率·隐含·反向·筹码"}
        ],
        "emotion": "冷静·无聊想玩·连续弃牌想反击",
        "actions": {
            "title": "行动决策（翻前）",
            "options": [
                {"name": "Fold", "sub": "弃牌", "desc": "牌弱/位置差/无赔率"},
                {"name": "Limp", "sub": "平跟", "desc": "后位/投机牌/设陷阱"},
                {"name": "Call", "sub": "跟注", "desc": "有隐含赔率/不想加注"},
                {"name": "Raise", "sub": "加注", "desc": "2.5-3BB，价值/隔离"},
                {"name": "3-Bet", "sub": "再加注", "desc": "9-12BB，强牌/挤压"},
                {"name": "4-Bet", "sub": "四次加注", "desc": "22-25BB，极强/平衡"},
                {"name": "5-Bet/All-in", "sub": "五次加注", "desc": "坚果/bluff平衡"},
                {"name": "Cold Call", "sub": "冷跟", "desc": "跟注前位加注"}
            ]
        },
        "plan": "翻后计划：击中什么继续？位置优势？SPR？"
    },
    
    "flop": {
        "title": "翻牌圈决策",
        "en": "FLOP",
        "color": COLOR_GREEN,
        "icon": "🎲",
        "core": [
            {"n": "①", "t": "牌面", "k": "干湿·高低·同花·顺面·A-high"},
            {"n": "②", "t": "我的牌", "k": "对·两对·三条·听牌·空气"},
            {"n": "③", "t": "对手", "k": "翻前范围·击中·未击中·范围优势"},
            {"n": "④", "t": "位置", "k": "有位/失位·主动权·信息优势"}
        ],
        "emotion": "击中兴奋·未击中想诈唬·追逐听牌",
        "actions": {
            "title": "行动决策（翻牌圈）",
            "options": [
                {"name": "Check", "sub": "过牌", "desc": "→ Check-Fold/Call/Raise"},
                {"name": "C-bet 1/3", "sub": "小额持续", "desc": "控池/多人池/弱牌面"},
                {"name": "C-bet 1/2", "sub": "标准持续", "desc": "标准C-bet sizing"},
                {"name": "C-bet 2/3", "sub": "大额持续", "desc": "保护/强牌/好牌面"},
                {"name": "Pot Bet", "sub": "满池下注", "desc": "价值/极化/湿润牌面"},
                {"name": "Overbet", "sub": "超池", "desc": "1.5x+ pot，极化range"},
                {"name": "Donk Bet", "sub": "主动下注", "desc": "失位主动，阻断/价值"},
                {"name": "Check-Raise", "sub": "过牌加注", "desc": "陷阱/半诈唬/保护"},
                {"name": "Float", "sub": "跟注计划", "desc": "位置+后街偷池"},
                {"name": "Probe Bet", "sub": "试探", "desc": "对手check后试探"}
            ]
        },
        "plan": "转牌计划：有利转牌？放弃转牌？持续策略？"
    },
    
    "turn": {
        "title": "转牌圈决策",
        "en": "TURN",
        "color": COLOR_ORANGE,
        "icon": "⚡",
        "core": [
            {"n": "①", "t": "转牌", "k": "改进·完成听牌·砖牌·危险牌"},
            {"n": "②", "t": "牌力", "k": "重新评估·outs·河牌equity"},
            {"n": "③", "t": "筹码", "k": "SPR·底池·剩余·承诺点"},
            {"n": "④", "t": "故事", "k": "对手行动线·sizing·一致性"}
        ],
        "emotion": "底池大失智·不甘放弃·追逐差听牌",
        "actions": {
            "title": "行动决策（转牌圈）",
            "options": [
                {"name": "Check", "sub": "过牌", "desc": "控池/放弃/陷阱"},
                {"name": "Bet 1/3", "sub": "小额下注", "desc": "控制底池/保持主动"},
                {"name": "Bet 1/2", "sub": "标准下注", "desc": "持续价值/保护"},
                {"name": "Bet 2/3", "sub": "大额下注", "desc": "强价值/保护/诈唬"},
                {"name": "Pot Bet", "sub": "满池", "desc": "大价值/极化"},
                {"name": "Overbet", "sub": "超池", "desc": "1.5-2x，极化range"},
                {"name": "Check-Raise", "sub": "过牌加注", "desc": "强牌/半诈唬"},
                {"name": "Probe Bet", "sub": "试探", "desc": "对手转牌check"},
                {"name": "Block Bet", "sub": "阻断", "desc": "1/4 pot，防止大额"},
                {"name": "All-in", "sub": "全下", "desc": "价值/半诈唬/committed"}
            ]
        },
        "plan": "河牌计划：什么河牌价值？什么放弃？诈唬机会？"
    },
    
    "river": {
        "title": "河牌圈决策",
        "en": "RIVER",
        "color": COLOR_PURPLE,
        "icon": "🎯",
        "core": [
            {"n": "①", "t": "河牌", "k": "完成听牌·砖牌·改变坚果"},
            {"n": "②", "t": "牌力", "k": "最终牌力·坚果·bluff catcher"},
            {"n": "③", "t": "范围", "k": "整体行动线·对手range·极化"},
            {"n": "④", "t": "优化", "k": "EV最大化·sizing优化·GTO"}
        ],
        "emotion": "Hero call冲动·赌气诈唬·底池大非理性",
        "actions": {
            "title": "行动决策（河牌圈）",
            "options": [
                {"name": "Thin Value 1/3", "sub": "薄价值", "desc": "边缘价值，小sizing"},
                {"name": "Value 1/2", "sub": "中等价值", "desc": "标准价值下注"},
                {"name": "Value 2/3", "sub": "强价值", "desc": "强牌价值"},
                {"name": "Overbet Value", "sub": "超池价值", "desc": "坚果，榨取最大"},
                {"name": "Block Bet", "sub": "阻断", "desc": "1/4 pot，防对手大注"},
                {"name": "Small Bluff", "sub": "小诈唬", "desc": "1/3 pot，低风险"},
                {"name": "Bluff 1/2", "sub": "标准诈唬", "desc": "标准诈唬sizing"},
                {"name": "Overbet Bluff", "sub": "超池诈唬", "desc": "极化，代表坚果"},
                {"name": "Check", "sub": "过牌", "desc": "→ 放弃/抓诈唬/陷阱"},
                {"name": "Check-Raise", "sub": "过牌加注", "desc": "坚果陷阱/诈唬"},
                {"name": "Hero Call", "sub": "英雄跟注", "desc": "抓诈唬，高级读牌"},
                {"name": "Crying Call", "sub": "勉强跟", "desc": "赔率够，不情愿"}
            ]
        },
        "plan": "摊牌：能打败多少？会输给哪些？EV是否为正？"
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


def generate_pro_single(street_key, data):
    """生成职业级单独版本"""
    print(f"生成职业级 {data['title']}...")
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    color = data['color']
    y = MARGIN
    
    # 标题
    title_font = get_font(100, bold=True)
    title = f"{data['icon']} {data['title']}"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - title_w) // 2, y), title, fill=color, font=title_font)
    y += 130
    
    # 英文
    en_font = get_font(50, bold=True)
    bbox = draw.textbbox((0, 0), data['en'], font=en_font)
    en_w = bbox[2] - bbox[0]
    draw.text(((WIDTH - en_w) // 2, y), data['en'], fill=COLOR_GRAY, font=en_font)
    y += 80
    
    draw.rectangle([MARGIN, y, WIDTH - MARGIN, y + 4], fill=color)
    y += 40
    
    # 核心分析（2x2网格）
    section_font = get_font(55, bold=True)
    draw.text((MARGIN, y), "核心分析", fill=color, font=section_font)
    y += 70
    
    grid_w = (WIDTH - MARGIN * 2 - 40) // 2
    grid_h = 180
    
    for i, item in enumerate(data['core']):
        row, col = i // 2, i % 2
        gx = MARGIN + col * (grid_w + 40)
        gy = y + row * (grid_h + 20)
        
        draw.rectangle([gx, gy, gx + grid_w, gy + grid_h],
                       fill=(250, 250, 250), outline=color, width=3)
        
        num_font = get_font(70, bold=True)
        draw.text((gx + 30, gy + 25), item['n'], fill=color, font=num_font)
        
        name_font = get_font(52, bold=True)
        draw.text((gx + 120, gy + 35), item['t'], fill=COLOR_BLACK, font=name_font)
        
        key_font = get_font(34, bold=True)
        key_y = gy + 105
        draw.rectangle([gx + 30, key_y, gx + grid_w - 30, key_y + 60],
                       fill=(255, 255, 220), outline=color, width=2)
        
        bbox = draw.textbbox((0, 0), item['k'], font=key_font)
        kw = bbox[2] - bbox[0]
        draw.text((gx + (grid_w - kw) // 2, key_y + 13), item['k'], fill=color, font=key_font)
    
    y += 2 * (grid_h + 20) + 30
    
    # 情绪自检
    emotion_h = 200
    draw.rectangle([MARGIN, y, WIDTH - MARGIN, y + emotion_h],
                   fill=(255, 240, 240), outline=COLOR_RED, width=6)
    
    warning_font = get_font(80)
    draw.text((MARGIN + 40, y + 30), "⚠️", font=warning_font)
    
    emo_title_font = get_font(75, bold=True)
    draw.text((MARGIN + 160, y + 40), "情绪自检", fill=COLOR_RED, font=emo_title_font)
    
    emo_font = get_font(50, bold=True)
    draw.text((MARGIN + 160, y + 125), f"警惕：{data['emotion']}", fill=COLOR_RED, font=emo_font)
    
    y += emotion_h + 30
    
    # 行动决策（详细版）
    draw.text((MARGIN, y), data['actions']['title'], fill=color, font=section_font)
    y += 70
    
    # 计算行数和列数
    options = data['actions']['options']
    cols = 2
    rows = (len(options) + 1) // 2
    
    action_w = (WIDTH - MARGIN * 2 - 40) // 2
    action_h = 110
    
    for i, opt in enumerate(options):
        row, col = i // 2, i % 2
        ax = MARGIN + col * (action_w + 40)
        ay = y + row * (action_h + 15)
        
        draw.rectangle([ax, ay, ax + action_w, ay + action_h],
                       fill=(250, 250, 245), outline=color, width=2)
        
        # 名称
        name_font = get_font(40, bold=True)
        draw.text((ax + 20, ay + 15), opt['name'], fill=color, font=name_font)
        
        # 副标题
        sub_font = get_font(32)
        draw.text((ax + 20, ay + 55), opt['sub'], fill=COLOR_GRAY, font=sub_font)
        
        # 描述
        desc_font = get_font(26)
        draw.text((ax + action_w - 360, ay + 20), opt['desc'], fill=COLOR_BLACK, font=desc_font)
    
    y += rows * (action_h + 15) + 30
    
    # 下一步计划
    if y < HEIGHT - 200:
        draw.rectangle([MARGIN, y, WIDTH - MARGIN, y + 100],
                       fill=(250, 250, 240), outline=color, width=3)
        
        plan_font = get_font(40, bold=True)
        draw.text((MARGIN + 30, y + 30), f"📋 {data['plan']}", fill=color, font=plan_font)
    
    # 保存
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    filename = f"poker_{street_key}_professional.jpg"
    output = os.path.join(desktop, filename)
    img.save(output, "JPEG", quality=95, optimize=True, dpi=(300, 300))
    
    print(f"  ✓ {filename}")
    return output


def generate_all_pro_singles():
    """生成所有职业级单独版本"""
    print("=" * 70)
    print("职业级完整版 - 单独详细版")
    print("=" * 70)
    print()
    
    for key in ["preflop", "flop", "turn", "river"]:
        generate_pro_single(key, PRO_STREETS[key])
    
    print()
    print("=" * 70)
    print("✓ 单独详细版完成")
    print()
    print("已生成：")
    print("  • poker_preflop_professional.jpg (8个行动选项)")
    print("  • poker_flop_professional.jpg (10个行动选项)")
    print("  • poker_turn_professional.jpg (10个行动选项)")
    print("  • poker_river_professional.jpg (12个行动选项)")
    print()
    print("职业级特点：")
    print("  ✓ 完整的行动选项树")
    print("  ✓ 包含sizing策略")
    print("  ✓ 每个选项都有说明")
    print("  ✓ 覆盖所有实战场景")
    print("=" * 70)


if __name__ == "__main__":
    try:
        generate_all_pro_singles()
    except Exception as e:
        print(f"生成失败: {e}")
        import traceback
        traceback.print_exc()



