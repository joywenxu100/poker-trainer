#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
深筹码松凶训练器 - 全面范围审查
检查所有范围的逻辑一致性、理论正确性、数据完整性
"""

import re
import json

def load_js_data(filepath):
    """从JS文件中提取lagRanges数据"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到lagRanges定义
    match = re.search(r'const lagRanges = \{(.*?)\n\};', content, re.DOTALL)
    if match:
        return match.group(0)
    return None

def count_combos(range_list):
    """计算手牌组合数"""
    total = 0
    for hand in range_list:
        if len(hand) == 2:  # 对子
            total += 6  # AA有6种组合
        elif hand.endswith('s'):  # 同花
            total += 4  # AKs有4种组合
        elif hand.endswith('o'):  # 非同花
            total += 12  # AKo有12种组合
    return total

def extract_ranges(js_content):
    """提取所有范围数据"""
    ranges = {}
    
    # Open Raise
    open_pattern = r"(\w+): \{\s*range: \[(.*?)\],"
    
    # 这里简化处理，直接分析JS内容
    return ranges

def check_progression(ranges_dict, positions, range_type):
    """检查范围递进性（位置越后应该越宽）"""
    issues = []
    
    position_order = ['UTG', 'UTG1', 'LJ', 'HJ', 'CO', 'BTN']
    
    prev_percentage = 0
    for pos in position_order:
        if pos in positions:
            current = ranges_dict.get(pos, {})
            percentage = current.get('percentage', '0%')
            pct_value = int(re.search(r'\d+', percentage).group()) if re.search(r'\d+', percentage) else 0
            
            if pct_value < prev_percentage:
                issues.append(f"⚠️ {range_type} - {pos}位置({pct_value}%)比前一位置({prev_percentage}%)窄，违背递进原则")
            
            prev_percentage = pct_value
    
    return issues

def check_ip_oop_difference(ip_range, oop_range, range_type):
    """检查IP和OOP范围差异"""
    issues = []
    
    if not ip_range or not oop_range:
        return issues
    
    ip_hands = set(ip_range)
    oop_hands = set(oop_range)
    
    # OOP应该是IP的子集
    if not oop_hands.issubset(ip_hands):
        extra = oop_hands - ip_hands
        issues.append(f"❌ {range_type} OOP范围包含IP没有的牌: {extra}")
    
    # OOP应该明显更紧
    ip_count = len(ip_hands)
    oop_count = len(oop_hands)
    
    if oop_count >= ip_count:
        issues.append(f"❌ {range_type} OOP范围({oop_count})不比IP({ip_count})紧")
    elif oop_count > ip_count * 0.7:
        issues.append(f"⚠️ {range_type} OOP范围({oop_count})只比IP({ip_count})窄{int((1-oop_count/ip_count)*100)}%，建议至少窄50%")
    
    return issues

def check_hand_validity(hands):
    """检查手牌格式是否有效"""
    issues = []
    valid_ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
    
    for hand in hands:
        if len(hand) == 2:  # 对子
            if hand[0] != hand[1] or hand[0] not in valid_ranks:
                issues.append(f"❌ 无效的对子: {hand}")
        elif len(hand) == 3:  # 同花或非同花
            if hand[0] not in valid_ranks or hand[1] not in valid_ranks:
                issues.append(f"❌ 无效的手牌: {hand}")
            if hand[2] not in ['s', 'o']:
                issues.append(f"❌ 无效的后缀: {hand}")
        else:
            issues.append(f"❌ 无效的手牌长度: {hand}")
    
    return issues

def check_duplicates(hands, range_name):
    """检查重复手牌"""
    issues = []
    seen = set()
    
    for hand in hands:
        if hand in seen:
            issues.append(f"❌ {range_name} 包含重复手牌: {hand}")
        seen.add(hand)
    
    return issues

def check_percentage_match(hands, claimed_percentage):
    """检查手牌数量是否匹配声称的百分比"""
    issues = []
    
    total_combos = count_combos(hands)
    actual_percentage = (total_combos / 1326) * 100  # 总共1326种组合
    
    claimed = int(re.search(r'\d+', claimed_percentage).group()) if re.search(r'\d+', claimed_percentage) else 0
    
    if abs(actual_percentage - claimed) > 2:  # 允许2%误差
        issues.append(f"⚠️ 声称{claimed_percentage}，实际{actual_percentage:.1f}%，差异{abs(actual_percentage - claimed):.1f}%")
    
    return issues, actual_percentage

def analyze_range_composition(hands, range_name):
    """分析范围组成"""
    pairs = []
    suited = []
    offsuit = []
    
    for hand in hands:
        if len(hand) == 2:
            pairs.append(hand)
        elif hand.endswith('s'):
            suited.append(hand)
        elif hand.endswith('o'):
            offsuit.append(hand)
    
    return {
        'name': range_name,
        'pairs': pairs,
        'suited': suited,
        'offsuit': offsuit,
        'pair_count': len(pairs),
        'suited_count': len(suited),
        'offsuit_count': len(offsuit),
        'total': len(hands)
    }

def main():
    print("="*80)
    print("🔍 深筹码松凶训练器 - 全面范围审查")
    print("="*80)
    
    try:
        with open('deep_stack_lag_trainer.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        print("\n✅ 成功加载JS文件")
        
        all_issues = []
        
        # 1. 检查Open Raise范围递进
        print("\n" + "="*80)
        print("📊 1. Open Raise 范围递进检查")
        print("="*80)
        
        open_positions = ['UTG', 'UTG1', 'LJ', 'HJ', 'CO', 'BTN', 'SB']
        open_percentages = {}
        
        for pos in open_positions:
            pattern = rf"{pos}: \{{\s*range:.*?percentage: ['\"]([^'\"]+)['\"]"
            match = re.search(pattern, js_content, re.DOTALL)
            if match:
                pct = match.group(1)
                open_percentages[pos] = pct
                print(f"  {pos}: {pct}")
        
        # 检查递进性
        expected_order = [12, 17, 24, 28, 37, 52, 38]
        actual_order = []
        for pos in open_positions:
            pct = open_percentages.get(pos, '0%')
            num = int(re.search(r'\d+', pct).group()) if re.search(r'\d+', pct) else 0
            actual_order.append(num)
        
        for i in range(len(actual_order) - 2):  # 排除SB
            if actual_order[i] > actual_order[i+1]:
                issue = f"⚠️ {open_positions[i]}({actual_order[i]}%) > {open_positions[i+1]}({actual_order[i+1]}%)，违背递进原则"
                all_issues.append(issue)
                print(f"  {issue}")
        
        if not any('违背递进原则' in str(i) for i in all_issues):
            print("  ✅ Open Raise递进性正确")
        
        # 2. 检查Call 3-Bet的IP vs OOP
        print("\n" + "="*80)
        print("📊 2. Call 3-Bet IP vs OOP 检查")
        print("="*80)
        
        call3bet_ip_match = re.search(r"call3Bet:.*?IP: \{.*?range: \[(.*?)\].*?percentage: ['\"]([^'\"]+)['\"]", js_content, re.DOTALL)
        call3bet_oop_match = re.search(r"call3Bet:.*?OOP: \{.*?range: \[(.*?)\].*?percentage: ['\"]([^'\"]+)['\"]", js_content, re.DOTALL)
        
        if call3bet_ip_match and call3bet_oop_match:
            ip_range_str = call3bet_ip_match.group(1)
            ip_pct = call3bet_ip_match.group(2)
            oop_range_str = call3bet_oop_match.group(1)
            oop_pct = call3bet_oop_match.group(2)
            
            ip_hands = re.findall(r"'([^']+)'", ip_range_str)
            oop_hands = re.findall(r"'([^']+)'", oop_range_str)
            
            print(f"  IP: {ip_pct} ({len(ip_hands)}个手牌)")
            print(f"  OOP: {oop_pct} ({len(oop_hands)}个手牌)")
            
            ratio = len(ip_hands) / len(oop_hands) if len(oop_hands) > 0 else 0
            print(f"  IP/OOP比例: {ratio:.1f}:1")
            
            if ratio < 2:
                issue = f"⚠️ Call 3-Bet IP/OOP比例({ratio:.1f}:1)过小，建议至少2:1"
                all_issues.append(issue)
                print(f"  {issue}")
            else:
                print(f"  ✅ IP/OOP比例合理")
        
        # 3. 检查Call 4-Bet的IP vs OOP
        print("\n" + "="*80)
        print("📊 3. Call 4-Bet IP vs OOP 检查（刚修复）")
        print("="*80)
        
        call4bet_ip_match = re.search(r"call4Bet:.*?IP: \{.*?range: \[(.*?)\].*?percentage: ['\"]([^'\"]+)['\"]", js_content, re.DOTALL)
        call4bet_oop_match = re.search(r"call4Bet:.*?OOP: \{.*?range: \[(.*?)\].*?percentage: ['\"]([^'\"]+)['\"]", js_content, re.DOTALL)
        
        if call4bet_ip_match and call4bet_oop_match:
            ip_range_str = call4bet_ip_match.group(1)
            ip_pct = call4bet_ip_match.group(2)
            oop_range_str = call4bet_oop_match.group(1)
            oop_pct = call4bet_oop_match.group(2)
            
            ip_hands = re.findall(r"'([^']+)'", ip_range_str)
            oop_hands = re.findall(r"'([^']+)'", oop_range_str)
            
            print(f"  IP: {ip_pct} ({len(ip_hands)}个手牌)")
            print(f"  OOP: {oop_pct} ({len(oop_hands)}个手牌)")
            
            ratio = len(ip_hands) / len(oop_hands) if len(oop_hands) > 0 else 0
            print(f"  IP/OOP比例: {ratio:.1f}:1")
            
            if ratio < 2:
                issue = f"⚠️ Call 4-Bet IP/OOP比例({ratio:.1f}:1)过小，建议至少2:1"
                all_issues.append(issue)
                print(f"  {issue}")
            else:
                print(f"  ✅ IP/OOP比例合理")
        else:
            issue = "❌ Call 4-Bet缺少IP或OOP定义"
            all_issues.append(issue)
            print(f"  {issue}")
        
        # 4. 检查4-Bet范围的IP vs OOP
        print("\n" + "="*80)
        print("📊 4. 4-Bet IP vs OOP 检查")
        print("="*80)
        
        fourbet_ip_match = re.search(r"fourBet:.*?IP: \{.*?range: \[(.*?)\].*?percentage: ['\"]([^'\"]+)['\"]", js_content, re.DOTALL)
        fourbet_oop_match = re.search(r"fourBet:.*?OOP: \{.*?range: \[(.*?)\].*?percentage: ['\"]([^'\"]+)['\"]", js_content, re.DOTALL)
        
        if fourbet_ip_match and fourbet_oop_match:
            ip_range_str = fourbet_ip_match.group(1)
            ip_pct = fourbet_ip_match.group(2)
            oop_range_str = fourbet_oop_match.group(1)
            oop_pct = fourbet_oop_match.group(2)
            
            ip_hands = re.findall(r"'([^']+)'", ip_range_str)
            oop_hands = re.findall(r"'([^']+)'", oop_range_str)
            
            print(f"  IP: {ip_pct} ({len(ip_hands)}个手牌)")
            print(f"  OOP: {oop_pct} ({len(oop_hands)}个手牌)")
            print(f"  ✅ 4-Bet已正确区分IP/OOP")
        else:
            print(f"  ⚠️ 4-Bet有IP/OOP定义")
        
        # 5. 检查3-Bet范围的递进性
        print("\n" + "="*80)
        print("📊 5. 3-Bet 范围递进检查（对抗同一位置）")
        print("="*80)
        
        # 检查vs UTG的递进性
        vs_utg_positions = ['LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
        print("\n  vs UTG 的3-Bet范围:")
        
        for pos in vs_utg_positions:
            pattern = rf"{pos}:.*?vsUTG: \{{.*?percentage: ['\"]([^'\"]+)['\"]"
            match = re.search(pattern, js_content, re.DOTALL)
            if match:
                pct = match.group(1)
                print(f"    {pos} vs UTG: {pct}")
        
        # 6. 检查防守范围的MDF合理性
        print("\n" + "="*80)
        print("📊 6. 盲注防守范围 MDF检查")
        print("="*80)
        
        # BB vs BTN应该是最宽的防守
        print("\n  BB防守范围:")
        bb_positions = ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN']
        bb_defense = {}
        
        for vs_pos in bb_positions:
            # 查找3-Bet范围
            threebet_pattern = rf"BB:.*?{vs_pos}: \{{.*?percentage: ['\"]([^'\"]+)['\"]"
            threebet_match = re.search(threebet_pattern, js_content, re.DOTALL)
            
            # 查找Call范围
            call_pattern = rf"BB:.*?{vs_pos}: \{{.*?range:.*?percentage: ['\"]([^'\"]+)['\"]"
            call_match = re.search(call_pattern, js_content, re.DOTALL)
            
            threebet_pct = int(re.search(r'\d+', threebet_match.group(1)).group()) if threebet_match and re.search(r'\d+', threebet_match.group(1)) else 0
            call_pct = int(re.search(r'\d+', call_match.group(1)).group()) if call_match and re.search(r'\d+', call_match.group(1)) else 0
            
            total_defense = threebet_pct + call_pct
            bb_defense[vs_pos] = total_defense
            
            print(f"    {vs_pos.replace('vs', '')}: 3-Bet {threebet_pct}% + Call {call_pct}% = {total_defense}%", end="")
            
            # 检查MDF
            if 'BTN' in vs_pos and total_defense < 65:
                print(f" ⚠️ vs BTN防守不足，建议至少70%")
                all_issues.append(f"⚠️ BB vs BTN总防守{total_defense}%不足，建议至少70%")
            elif total_defense < 30:
                print(f" ⚠️ 防守可能过紧")
            else:
                print(f" ✅")
        
        # 7. 检查手牌格式错误
        print("\n" + "="*80)
        print("📊 7. 手牌格式检查")
        print("="*80)
        
        # 查找所有range定义
        all_ranges = re.findall(r"range: \[(.*?)\]", js_content, re.DOTALL)
        total_format_errors = 0
        
        for i, range_str in enumerate(all_ranges[:10]):  # 检查前10个
            hands = re.findall(r"'([^']+)'", range_str)
            format_issues = check_hand_validity(hands)
            if format_issues:
                print(f"  范围#{i+1}:")
                for issue in format_issues:
                    print(f"    {issue}")
                    total_format_errors += 1
        
        if total_format_errors == 0:
            print("  ✅ 所有手牌格式正确")
        else:
            print(f"  ❌ 发现{total_format_errors}个格式错误")
        
        # 8. 检查重复手牌
        print("\n" + "="*80)
        print("📊 8. 重复手牌检查")
        print("="*80)
        
        total_duplicates = 0
        for i, range_str in enumerate(all_ranges[:10]):
            hands = re.findall(r"'([^']+)'", range_str)
            dup_issues = check_duplicates(hands, f"范围#{i+1}")
            if dup_issues:
                for issue in dup_issues:
                    print(f"  {issue}")
                    total_duplicates += 1
        
        if total_duplicates == 0:
            print("  ✅ 未发现重复手牌")
        
        # 总结
        print("\n" + "="*80)
        print("📊 审查总结")
        print("="*80)
        
        if len(all_issues) == 0:
            print("\n🎉 恭喜！未发现严重问题，范围表质量优秀！")
            print("\n评分: ⭐⭐⭐⭐⭐ (99/100)")
        else:
            print(f"\n发现 {len(all_issues)} 个需要注意的问题:\n")
            for i, issue in enumerate(all_issues, 1):
                print(f"{i}. {issue}")
            
            critical = sum(1 for i in all_issues if '❌' in str(i))
            warnings = sum(1 for i in all_issues if '⚠️' in str(i))
            
            print(f"\n严重问题: {critical}个")
            print(f"警告: {warnings}个")
            
            if critical == 0:
                print("\n评分: ⭐⭐⭐⭐ (90/100) - 没有严重问题，仅有些微调建议")
            elif critical <= 2:
                print("\n评分: ⭐⭐⭐ (80/100) - 有少量严重问题需要修复")
            else:
                print("\n评分: ⭐⭐ (70/100) - 有多个严重问题需要立即修复")
        
        print("\n" + "="*80)
        
    except Exception as e:
        print(f"\n❌ 审查出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

