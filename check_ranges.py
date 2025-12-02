# -*- coding: utf-8 -*-
"""
深筹码松凶训练器 - 范围数据完整性检查工具
检查所有翻前范围的逻辑性和完整性
"""

import re
import json

def extract_ranges_from_js(file_path):
    """从JS文件中提取范围数据"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取lagRanges对象
    match = re.search(r'const lagRanges = ({.*?});', content, re.DOTALL)
    if not match:
        print("❌ 无法找到lagRanges对象")
        return None
    
    return content

def check_open_raise(content):
    """检查Open Raise范围"""
    print("\n" + "="*60)
    print("检查 Open Raise 范围")
    print("="*60)
    
    positions = ['UTG', 'UTG1', 'LJ', 'HJ', 'CO', 'BTN', 'SB']
    issues = []
    
    for pos in positions:
        pattern = rf"{pos}:\s*{{[^}}]*?range:\s*\[(.*?)\]"
        match = re.search(pattern, content, re.DOTALL)
        
        if not match:
            if pos in ['BB', 'STRADDLE']:
                print(f"✓ {pos}: 防守位（正常）")
            else:
                issues.append(f"❌ {pos}: 范围缺失")
            continue
        
        range_str = match.group(1)
        hands = re.findall(r"'([^']+)'", range_str)
        
        # 检查必须包含的强牌
        must_have = ['AA', 'KK', 'QQ', 'AKs', 'AKo']
        missing = [h for h in must_have if h not in hands]
        
        if missing:
            issues.append(f"⚠️ {pos}: 缺少强牌 {', '.join(missing)}")
        
        # 提取百分比
        perc_match = re.search(rf"{pos}:.*?percentage:\s*'([^']+)'", content, re.DOTALL)
        percentage = perc_match.group(1) if perc_match else "未知"
        
        print(f"✓ {pos}: {len(hands)}个组合, {percentage}")
        
        # 逻辑检查：后位应该比前位范围更宽
        if pos == 'UTG' and len(hands) > 40:
            issues.append(f"⚠️ {pos}: 范围过宽（{len(hands)}个组合）")
        if pos == 'BTN' and len(hands) < 70:
            issues.append(f"⚠️ {pos}: 范围过紧（{len(hands)}个组合）")
    
    if issues:
        print("\n发现问题：")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ Open Raise范围全部正确")
    
    return issues

def check_3bet(content):
    """检查3-Bet范围"""
    print("\n" + "="*60)
    print("检查 3-Bet 范围")
    print("="*60)
    
    # 预期的组合
    expected_combos = {
        'BTN': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsSB'],
        'CO': ['vsUTG', 'vsLJ', 'vsHJ'],
        'HJ': ['vsUTG', 'vsLJ'],
        'LJ': ['vsUTG'],
        'SB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN'],
        'BB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN', 'vsSB']
    }
    
    issues = []
    total_found = 0
    
    for pos, vs_positions in expected_combos.items():
        for vs_pos in vs_positions:
            # 搜索这个组合
            pattern = rf"{pos}:.*?{vs_pos}:\s*{{[^}}]*?range:\s*\[(.*?)\]"
            match = re.search(pattern, content, re.DOTALL)
            
            if not match:
                issues.append(f"❌ {pos} {vs_pos}: 缺失")
            else:
                range_str = match.group(1)
                hands = re.findall(r"'([^']+)'", range_str)
                
                if len(hands) == 0:
                    issues.append(f"❌ {pos} {vs_pos}: 范围为空")
                else:
                    total_found += 1
                    
                    # 提取百分比
                    perc_pattern = rf"{vs_pos}:.*?percentage:\s*'([^']+)'"
                    perc_match = re.search(perc_pattern, content[match.start():match.end()+500])
                    percentage = perc_match.group(1) if perc_match else "未知"
                    
                    print(f"✓ {pos} {vs_pos}: {len(hands)}个组合, {percentage}")
                    
                    # 检查必须包含的价值牌
                    value_hands = ['AA', 'KK', 'QQ']
                    missing_value = [h for h in value_hands if h not in hands]
                    if missing_value:
                        issues.append(f"⚠️ {pos} {vs_pos}: 缺少价值牌 {', '.join(missing_value)}")
    
    print(f"\n总计找到：{total_found}/{sum(len(v) for v in expected_combos.values())}个组合")
    
    if issues:
        print("\n发现问题：")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ 3-Bet范围全部完整")
    
    return issues

def check_call_open(content):
    """检查Call Open范围"""
    print("\n" + "="*60)
    print("检查 Call Open 范围")
    print("="*60)
    
    expected_combos = {
        'BB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN', 'vsSB'],
        'SB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN'],
        'BTN': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO'],
        'CO': ['vsUTG', 'vsLJ', 'vsHJ'],
        'HJ': ['vsUTG', 'vsLJ'],
        'LJ': ['vsUTG']
    }
    
    issues = []
    total_found = 0
    
    for pos, vs_positions in expected_combos.items():
        for vs_pos in vs_positions:
            # 在callOpen部分搜索
            pattern = rf"callOpen:.*?{pos}:.*?{vs_pos}:\s*{{[^}}]*?range:\s*\[(.*?)\]"
            match = re.search(pattern, content, re.DOTALL)
            
            if not match:
                issues.append(f"❌ {pos} {vs_pos}: 缺失")
            else:
                range_str = match.group(1)
                hands = re.findall(r"'([^']+)'", range_str)
                
                if len(hands) == 0:
                    issues.append(f"❌ {pos} {vs_pos}: 范围为空")
                else:
                    total_found += 1
                    
                    # 提取百分比
                    perc_pattern = rf"{vs_pos}:.*?percentage:\s*'([^']+)'"
                    perc_match = re.search(perc_pattern, content[match.start():match.end()+500])
                    percentage = perc_match.group(1) if perc_match else "未知"
                    
                    print(f"✓ {pos} {vs_pos}: {len(hands)}个组合, {percentage}")
                    
                    # BB vs BTN应该是最宽的防守
                    if pos == 'BB' and vs_pos == 'vsBTN' and len(hands) < 100:
                        issues.append(f"⚠️ {pos} {vs_pos}: 范围可能过紧（只有{len(hands)}个组合）")
    
    print(f"\n总计找到：{total_found}/{sum(len(v) for v in expected_combos.values())}个组合")
    
    if issues:
        print("\n发现问题：")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ Call Open范围全部完整")
    
    return issues

def check_other_ranges(content):
    """检查其他范围"""
    print("\n" + "="*60)
    print("检查其他范围（4-Bet, 5-Bet等）")
    print("="*60)
    
    checks = [
        ('fourBet.general', '4-Bet通用'),
        ('fourBet.vsEP', '4-Bet vs早位'),
        ('fourBet.vsLP', '4-Bet vs后位'),
        ('fourBet.IP', '4-Bet有位置'),
        ('fourBet.OOP', '4-Bet无位置'),
        ('fiveBet.general', '5-Bet通用'),
        ('fiveBet.vsAggressor', '5-Bet vs激进'),
        ('call3Bet.IP', 'Call 3-Bet IP'),
        ('call3Bet.OOP', 'Call 3-Bet OOP'),
        ('call4Bet.general', 'Call 4-Bet通用'),
        ('call4Bet.deep', 'Call 4-Bet深筹码'),
        ('squeeze.BB.general', 'Squeeze BB'),
        ('squeeze.SB.general', 'Squeeze SB')
    ]
    
    issues = []
    
    for key, name in checks:
        pattern = rf"{key.split('.')[-1]}:\s*{{[^}}]*?range:\s*\[(.*?)\]"
        if re.search(pattern, content):
            hands_match = re.search(pattern, content, re.DOTALL)
            if hands_match:
                hands = re.findall(r"'([^']+)'", hands_match.group(1))
                print(f"✓ {name}: {len(hands)}个组合")
            else:
                issues.append(f"❌ {name}: 无法解析")
        else:
            issues.append(f"❌ {name}: 缺失")
    
    if issues:
        print("\n发现问题：")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ 其他范围全部完整")
    
    return issues

def main():
    file_path = 'deep_stack_lag_trainer.js'
    
    print("🔍 深筹码松凶训练器 - 范围数据完整性检查")
    print("="*60)
    
    try:
        content = extract_ranges_from_js(file_path)
        if not content:
            return
        
        issues1 = check_open_raise(content)
        issues2 = check_3bet(content)
        issues3 = check_call_open(content)
        issues4 = check_other_ranges(content)
        
        total_issues = len(issues1) + len(issues2) + len(issues3) + len(issues4)
        
        print("\n" + "="*60)
        print("检查完成")
        print("="*60)
        
        if total_issues == 0:
            print("🎉 所有范围数据100%完整！")
            print("✅ 可以放心使用")
        else:
            print(f"⚠️ 发现 {total_issues} 个问题")
            print("\n所有问题列表：")
            for issue in issues1 + issues2 + issues3 + issues4:
                print(f"  {issue}")
        
        print("="*60)
        
    except Exception as e:
        print(f"❌ 检查过程出错：{e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

