#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
德州扑克顶级教练 - 实战视角审查
从教学和实战角度检查范围的可训练性和实用性
"""

import re

def coach_review_open_ranges(content):
    """教练视角：检查Open Raise范围的实战合理性"""
    print("="*70)
    print("🎓 德州扑克顶级教练 - Open Raise范围实战审查")
    print("="*70)
    
    issues = []
    
    # 检查UTG
    print("\n【UTG位置审查】")
    print("实战要求：最紧位置，避免OOP困境")
    if 'UTG:' in content:
        utg_match = re.search(r"UTG:.*?percentage:\s*'(\d+)%'", content, re.DOTALL)
        if utg_match:
            pct = utg_match.group(1)
            print(f"  当前：{pct}%")
            if int(pct) > 13:
                issues.append("⚠️ UTG范围过宽，实战中容易陷入OOP困境")
                print(f"  ⚠️ {pct}% 对UTG来说偏宽")
            else:
                print(f"  ✅ {pct}% 符合紧凶标准")
    
    # 检查BTN
    print("\n【BTN位置审查】")
    print("实战要求：最激进位置，利用位置优势")
    btn_match = re.search(r"BTN:.*?percentage:\s*'(\d+)%'", content, re.DOTALL)
    if btn_match:
        pct = btn_match.group(1)
        print(f"  当前：{pct}%")
        if int(pct) < 48:
            issues.append("⚠️ BTN范围过紧，没有充分利用位置优势")
            print(f"  ⚠️ {pct}% 对BTN来说偏紧")
        elif int(pct) > 55:
            issues.append("⚠️ BTN范围可能过宽")
            print(f"  ⚠️ {pct}% 可能过于激进")
        else:
            print(f"  ✅ {pct}% 完美利用位置")
    
    return issues

def coach_review_3bet_ranges(content):
    """教练视角：检查3-Bet范围的实战性"""
    print("\n" + "="*70)
    print("🎓 3-Bet范围实战审查")
    print("="*70)
    
    issues = []
    
    # 检查BB vs BTN
    print("\n【BB vs BTN 3-Bet - 最关键的防守spot】")
    pattern = r"BB:.*?vsBTN:.*?percentage:\s*'(\d+)%'"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        pct = match.group(1)
        print(f"  3-Bet频率：{pct}%")
        
        # 检查Call范围
        call_pattern = r"BB:.*?vsBTN:.*?range:.*?percentage:\s*'(\d+)%'"
        call_match = re.search(call_pattern, content, re.DOTALL)
        if call_match:
            call_pct = int(call_match.group(1))
            threbet_pct = int(pct)
            total_defense = call_pct + threbet_pct
            
            print(f"  Call频率：{call_pct}%")
            print(f"  总防守：{total_defense}%")
            
            if total_defense < 65:
                issues.append(f"❌ BB vs BTN总防守{total_defense}%不足，会被疯狂剥削！应该70%+")
                print(f"  ❌ 总防守{total_defense}%太低！（应该70%+）")
            elif total_defense > 75:
                issues.append(f"⚠️ BB vs BTN总防守{total_defense}%偏高，可能防守过度")
                print(f"  ⚠️ 总防守{total_defense}%偏高")
            else:
                print(f"  ✅ 总防守{total_defense}%符合MDF！")
    
    return issues

def coach_review_call_open_ranges(content):
    """教练视角：检查Call Open范围"""
    print("\n" + "="*70)
    print("🎓 Call Open范围实战审查")
    print("="*70)
    
    issues = []
    
    print("\n【深筹码松凶的核心：大量使用Call】")
    print("教学要点：")
    print("  1. 对子要Call（setmining）")
    print("  2. 同花Axs要Call（隐含赔率）")
    print("  3. 有位置时更激进")
    print("  4. OOP要谨慎")
    
    # 检查BB是否有足够的call范围
    if 'callOpen:' not in content:
        issues.append("❌ 完全缺少Call Open范围！这是松凶策略的核心！")
        print("  ❌ 缺少Call Open范围定义")
    else:
        print("  ✅ 包含Call Open范围")
        
        # 检查BB vs BTN call
        bb_btn_pattern = r"BB:.*?vsBTN:.*?percentage:\s*'(\d+)%'"
        match = re.search(bb_btn_pattern, content, re.DOTALL)
        if match:
            pct = int(match.group(1))
            print(f"\n  BB vs BTN Call: {pct}%")
            if pct < 50:
                issues.append(f"⚠️ BB vs BTN Call {pct}%偏低（建议55%）")
                print(f"    ⚠️ {pct}% 偏低，建议55%")
            elif pct > 60:
                issues.append(f"⚠️ BB vs BTN Call {pct}%偏高")
                print(f"    ⚠️ {pct}% 偏高")
            else:
                print(f"    ✅ {pct}% 完美！")
    
    return issues

def coach_review_training_usability(content):
    """教练视角：检查可训练性"""
    print("\n" + "="*70)
    print("🎓 训练器可用性审查")
    print("="*70)
    
    issues = []
    
    print("\n【作为教学工具的完整性】")
    
    # 检查是否有记忆辅助
    if '记忆' in content or 'memory' in content.lower():
        print("  ✅ 包含记忆辅助")
    else:
        issues.append("⚠️ 缺少记忆辅助，学员难以记住复杂范围")
        print("  ⚠️ 建议增加记忆辅助")
    
    # 检查是否有策略说明
    if 'notes:' in content:
        notes_count = len(re.findall(r"notes:", content))
        print(f"  ✅ 包含{notes_count}个策略说明")
    else:
        issues.append("❌ 缺少策略说明")
        print("  ❌ 缺少策略说明")
    
    # 检查是否有测试系统
    if 'quiz' in content.lower() or 'test' in content.lower():
        print("  ✅ 包含测试系统")
    else:
        issues.append("⚠️ 建议增加测试系统")
        print("  ⚠️ 建议增加测试系统")
    
    return issues

def coach_final_evaluation():
    """教练的最终评估和建议"""
    print("\n" + "="*70)
    print("🎓 教练最终评估")
    print("="*70)
    
    print("\n【实战建议】")
    print("1. 早位（UTG/UTG1）：严格执行范围，避免边际牌")
    print("2. 中位（LJ/HJ）：开始扩张，但仍需纪律性")
    print("3. 后位（CO/BTN）：充分利用位置优势")
    print("4. 盲注防守：必须用足够频率防守，特别是vs BTN")
    
    print("\n【学员常犯错误】")
    print("❌ UTG打太多小对子（55/66）")
    print("❌ BTN不够激进（应该52%+）")
    print("❌ BB vs BTN防守不足（应该70%）")
    print("❌ 忽视Call Open，过度依赖3-Bet")
    
    print("\n【教学重点】")
    print("⭐ 位置的重要性（IP vs OOP）")
    print("⭐ MDF理论（最小防守频率）")
    print("⭐ 深筹码隐含赔率（对子和同花牌）")
    print("⭐ 极化范围（价值+阻断牌诈唬）")

def main():
    print("🎓 德州扑克顶级教练审查报告")
    print("审查重点：实战可行性、可训练性、常见错误预防")
    print("="*70)
    
    try:
        with open('deep_stack_lag_trainer.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        all_issues = []
        
        # 教练视角审查
        all_issues.extend(coach_review_open_ranges(content))
        all_issues.extend(coach_review_3bet_ranges(content))
        all_issues.extend(coach_review_call_open_ranges(content))
        all_issues.extend(coach_review_training_usability(content))
        
        # 最终评估
        coach_final_evaluation()
        
        print("\n" + "="*70)
        print("📋 发现的问题总结")
        print("="*70)
        
        if all_issues:
            print(f"\n发现 {len(all_issues)} 个需要关注的点：\n")
            for i, issue in enumerate(all_issues, 1):
                print(f"{i}. {issue}")
        else:
            print("\n🏆 优秀！这是一个实战可用的训练器！")
        
        print("\n" + "="*70)
        print("💡 教练寄语")
        print("="*70)
        print("""
深筹码松凶不是无脑激进，而是：
1. 在正确的位置用正确的范围
2. 充分利用位置优势
3. 理解并应用MDF理论
4. 平衡3-Bet和Call的比例
5. 重视翻后技术的发挥空间

记住：范围只是起点，真正的盈利来自于翻后的决策！
        """)
        
    except Exception as e:
        print(f"❌ 审查过程出错：{e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

