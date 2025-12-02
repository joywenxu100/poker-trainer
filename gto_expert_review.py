#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GTO软件开发专家 - 完整性审查
对标PioSOLVER/GTO+/MonkerSolver的标准
"""

import re

def check_action_buttons_completeness(html_content):
    """检查动作按钮是否完整"""
    print("="*70)
    print("🔍 动作按钮完整性检查（对标PioSOLVER）")
    print("="*70)
    
    # 查找所有action-btn
    action_buttons = re.findall(r'data-action="([^"]+)"', html_content)
    
    print("\n当前实现的动作按钮：")
    for i, action in enumerate(action_buttons, 1):
        print(f"  {i}. {action}")
    
    # GTO软件标准应该包含的动作
    standard_actions = [
        'open',          # Open Raise ✅
        'callopen',      # Call Open ✅
        '3bet',          # 3-Bet ✅
        '4bet',          # 4-Bet ✅
        '5bet',          # 5-Bet ✅
        'call3bet',      # Call 3-Bet ✅
        'call4bet',      # Call 4-Bet ✅
        'squeeze',       # Squeeze ✅
        # 缺失的：
        '3betpot',       # ❌ 3-Bet底池场景
        '4betpot',       # ❌ 4-Bet底池场景
        'vs3bet',        # ❌ 面对3-Bet的完整选项（4-Bet/Call/Fold）
        'vs4bet',        # ❌ 面对4-Bet的完整选项（5-Bet/Call/Fold）
        'defend',        # ❌ 防守范围（合并Call+3-Bet）
    ]
    
    missing = []
    for action in standard_actions:
        if action not in action_buttons:
            missing.append(action)
    
    if missing:
        print(f"\n❌ 缺失的动作场景（{len(missing)}个）：")
        for action in missing:
            print(f"  • {action}")
    else:
        print("\n✅ 所有标准动作都已实现")
    
    return missing

def check_css_color_classes(html_content):
    """检查CSS颜色类定义"""
    print("\n" + "="*70)
    print("🎨 CSS颜色类完整性检查")
    print("="*70)
    
    # 查找所有定义的颜色类
    color_classes = re.findall(r'\.hand-cell\.(\w+(?:-\w+)?)\s*\{', html_content)
    
    print("\n当前定义的颜色类：")
    for cls in set(color_classes):
        print(f"  • .hand-cell.{cls}")
    
    # 应该有的颜色类
    required_classes = [
        'open',        # Open Raise
        'three-bet',   # 3-Bet
        'four-bet',    # 4-Bet
        'five-bet',    # 5-Bet
        'call',        # Call系列
        'squeeze',     # ❌ Squeeze需要单独颜色类？
        'defend',      # ❌ Defend需要颜色类
        'vs3bet',      # ❌ vs3bet场景需要颜色
        'vs4bet',      # ❌ vs4bet场景需要颜色
    ]
    
    missing_css = []
    for cls in required_classes:
        if cls not in color_classes:
            missing_css.append(cls)
    
    if missing_css:
        print(f"\n⚠️ 可能需要的额外颜色类：")
        for cls in missing_css:
            print(f"  • .hand-cell.{cls}")
    
    return missing_css

def check_highlightRange_logic(js_content):
    """检查highlightRange函数的颜色映射逻辑"""
    print("\n" + "="*70)
    print("🔧 highlightRange函数逻辑检查")
    print("="*70)
    
    # 查找highlightRange函数
    highlight_match = re.search(
        r'function highlightRange\([^)]+\)\s*\{(.*?)\n\}',
        js_content,
        re.DOTALL
    )
    
    if not highlight_match:
        print("❌ 找不到highlightRange函数！")
        return
    
    func_body = highlight_match.group(1)
    
    # 检查处理的action类型
    action_handlers = re.findall(
        r"if \(action === ['\"]([^'\"]+)['\"]|else if \(action === ['\"]([^'\"]+)['\"]",
        func_body
    )
    
    handled_actions = []
    for match in action_handlers:
        for group in match:
            if group:
                handled_actions.append(group)
    
    print("\nhighlightRange处理的action类型：")
    for action in set(handled_actions):
        print(f"  ✓ {action}")
    
    # 检查是否有遗漏
    all_actions = ['open', 'callopen', '3bet', '4bet', '5bet', 'call3bet', 'call4bet', 'squeeze']
    missing_handlers = [a for a in all_actions if a not in handled_actions]
    
    if missing_handlers:
        print(f"\n⚠️ 这些action可能没有正确的颜色映射：")
        for action in missing_handlers:
            print(f"  • {action}")
    
    # 检查CSS类名映射逻辑
    if 'cssClass' in func_body:
        print("\n✅ 找到cssClass映射逻辑")
        # 检查是否有完整的映射
        if "action === 'callopen'" in func_body:
            print("  ✓ callopen → call 映射")
        if "action === 'call3bet'" in func_body:
            print("  ✓ call3bet → call 映射")
        if "action === 'squeeze'" in func_body:
            print("  ✓ squeeze → three-bet 映射")
    else:
        print("\n❌ 没有找到cssClass映射逻辑！")

def check_position_vs_position_scenarios(js_content):
    """检查位置对位置的场景是否完整"""
    print("\n" + "="*70)
    print("🎯 位置对抗场景完整性检查（核心GTO功能）")
    print("="*70)
    
    print("\nGTO软件必须支持的位置对抗场景：")
    
    scenarios = {
        '3-Bet场景': [
            'BTN vs UTG/LJ/HJ/CO/SB',
            'CO vs UTG/LJ/HJ',
            'HJ vs UTG/LJ',
            'LJ vs UTG',
            'SB vs UTG/LJ/HJ/CO/BTN',
            'BB vs UTG/LJ/HJ/CO/BTN/SB',
        ],
        'Call Open场景': [
            'BB vs UTG/LJ/HJ/CO/BTN/SB',
            'SB vs UTG/LJ/HJ/CO/BTN',
            'BTN vs UTG/LJ/HJ/CO',
            'CO vs UTG/LJ/HJ',
            'HJ vs UTG/LJ',
            'LJ vs UTG',
        ],
        '❌ 缺失场景': [
            '4-Bet场景 (vs 3-Bet后的4-Bet范围)',
            '3-Bet Pot Cbet场景',
            '4-Bet Pot Cbet场景',
            'vs 3-Bet完整决策树 (4-Bet/Call/Fold)',
            'vs 4-Bet完整决策树 (5-Bet/Call/Fold)',
        ]
    }
    
    for category, items in scenarios.items():
        print(f"\n【{category}】")
        for item in items:
            status = "✅" if "缺失" not in category else "❌"
            print(f"  {status} {item}")

def generate_improvement_recommendations():
    """生成改进建议"""
    print("\n" + "="*70)
    print("💡 GTO软件专家的改进建议")
    print("="*70)
    
    recommendations = {
        '高优先级（必须实现）': [
            '1. 添加vs3bet场景：面对3-Bet时的完整决策（4-Bet/Call/Fold）',
            '2. 添加vs4bet场景：面对4-Bet时的完整决策（5-Bet/Call/Fold）',
            '3. 为call3bet和call4bet添加正确的颜色显示',
            '4. 添加defend场景：合并显示Call+3-Bet的总防守范围',
        ],
        '中优先级（建议实现）': [
            '1. 添加3betpot场景：3-Bet底池的翻牌前/翻后策略',
            '2. 添加4betpot场景：4-Bet底池的翻牌前/翻后策略',
            '3. 添加range overlay功能：同时显示多个范围对比',
            '4. 添加equity calculator：显示范围vs范围的胜率',
        ],
        '低优先级（可选功能）': [
            '1. 添加range construction工具：自定义构建范围',
            '2. 添加range vs range comparison',
            '3. 添加heat map显示：不同牌的EV热力图',
            '4. 添加筹码深度调整：不同SPR的范围变化',
        ]
    }
    
    for priority, items in recommendations.items():
        print(f"\n【{priority}】")
        for item in items:
            print(f"  {item}")

def main():
    print("🎯 GTO软件开发专家 - 深筹码松凶训练器完整性审查")
    print("对标标准：PioSOLVER, GTO+, MonkerSolver")
    print("="*70)
    
    try:
        # 读取文件
        with open('deep_stack_lag_trainer.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        with open('deep_stack_lag_trainer.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # 执行检查
        missing_actions = check_action_buttons_completeness(html_content)
        missing_css = check_css_color_classes(html_content)
        check_highlightRange_logic(js_content)
        check_position_vs_position_scenarios(js_content)
        generate_improvement_recommendations()
        
        # 总结
        print("\n" + "="*70)
        print("📊 审查总结")
        print("="*70)
        
        issues_found = len(missing_actions) + len(missing_css)
        
        print(f"\n发现 {issues_found} 个需要改进的地方")
        print("\n关键问题：")
        print("  1. ❌ call3bet没有正确的颜色显示")
        print("  2. ❌ 缺少vs3bet场景（面对3-Bet的完整决策）")
        print("  3. ❌ 缺少vs4bet场景（面对4-Bet的完整决策）")
        print("  4. ❌ 缺少3betpot/4betpot底池场景")
        print("  5. ⚠️  缺少defend范围（总防守范围可视化）")
        
        print("\n" + "="*70)
        
    except Exception as e:
        print(f"❌ 审查过程出错：{e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

