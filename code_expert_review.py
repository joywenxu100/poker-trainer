#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
顶级代码专家 - 完整代码审查
逐行检查JavaScript代码的所有潜在bug
"""

import re

def check_syntax_errors(js_content):
    """检查语法错误"""
    print("="*70)
    print("🔍 语法错误检查")
    print("="*70)
    
    issues = []
    
    # 检查括号匹配
    open_braces = js_content.count('{')
    close_braces = js_content.count('}')
    if open_braces != close_braces:
        issues.append(f"❌ 括号不匹配: {{ {open_braces} vs }} {close_braces}")
    else:
        print(f"✅ 括号匹配: {open_braces} 对")
    
    # 检查方括号匹配
    open_brackets = js_content.count('[')
    close_brackets = js_content.count(']')
    if open_brackets != close_brackets:
        issues.append(f"❌ 方括号不匹配: [ {open_brackets} vs ] {close_brackets}")
    else:
        print(f"✅ 方括号匹配: {open_brackets} 对")
    
    # 检查圆括号匹配
    open_parens = js_content.count('(')
    close_parens = js_content.count(')')
    if open_parens != close_parens:
        issues.append(f"❌ 圆括号不匹配: ( {open_parens} vs ) {close_parens}")
    else:
        print(f"✅ 圆括号匹配: {open_parens} 对")
    
    return issues

def check_undefined_variables(js_content):
    """检查可能未定义的变量"""
    print("\n" + "="*70)
    print("🔍 变量定义检查")
    print("="*70)
    
    issues = []
    
    # 查找所有变量声明
    declared_vars = set()
    
    # const声明
    const_vars = re.findall(r'const\s+(\w+)', js_content)
    declared_vars.update(const_vars)
    
    # let声明
    let_vars = re.findall(r'let\s+(\w+)', js_content)
    declared_vars.update(let_vars)
    
    # var声明
    var_vars = re.findall(r'var\s+(\w+)', js_content)
    declared_vars.update(var_vars)
    
    # function声明
    func_vars = re.findall(r'function\s+(\w+)', js_content)
    declared_vars.update(func_vars)
    
    print(f"\n声明的变量/函数数量: {len(declared_vars)}")
    
    # 检查关键变量
    critical_vars = ['lagRanges', 'allHands', 'quizState', 'highlightRange', 'generateQuestion']
    for var in critical_vars:
        if var in declared_vars or var in js_content:
            print(f"  ✅ {var}")
        else:
            issues.append(f"❌ 关键变量 {var} 可能未定义")
            print(f"  ❌ {var}")
    
    return issues

def check_null_safety(js_content):
    """检查空指针安全"""
    print("\n" + "="*70)
    print("🔍 空指针安全检查")
    print("="*70)
    
    issues = []
    
    # 检查document.getElementById没有null check
    getelements = re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", js_content)
    
    print(f"\n找到 {len(set(getelements))} 个getElementById调用")
    
    # 检查是否有null check
    for elem_id in set(getelements):
        # 简单检查是否有if判断
        pattern = rf"const\s+\w+\s*=\s*document\.getElementById\(['\"]{ elem_id}['\"].*?\n\s*if\s*\("
        if not re.search(pattern, js_content, re.DOTALL):
            # 检查是否直接使用
            direct_use = rf"document\.getElementById\(['\"]{ elem_id}['\"]\)\.(textContent|innerHTML|value)"
            if re.search(direct_use, js_content):
                issues.append(f"⚠️ '{elem_id}' 没有null check就直接使用")
    
    if not issues:
        print("✅ 所有getElementById都有适当的处理")
    
    return issues

def check_array_operations(js_content):
    """检查数组操作"""
    print("\n" + "="*70)
    print("🔍 数组操作安全检查")
    print("="*70)
    
    issues = []
    
    # 检查数组访问
    array_access = re.findall(r'(\w+)\[(\w+)\]', js_content)
    
    # 检查.range访问是否有undefined check
    range_access = re.findall(r'(\w+)\.range', js_content)
    print(f"\n找到 {len(range_access)} 个.range访问")
    
    # 检查是否有 || [] 的保护
    safe_range_access = len(re.findall(r'\.range\s*\|\|\s*\[\]', js_content))
    print(f"  其中 {safe_range_access} 个有 || [] 保护")
    
    if safe_range_access < len(range_access):
        issues.append(f"⚠️ 有 {len(range_access) - safe_range_access} 个.range访问可能没有保护")
    
    return issues

def check_function_calls(js_content):
    """检查函数调用"""
    print("\n" + "="*70)
    print("🔍 函数调用检查")
    print("="*70)
    
    issues = []
    
    # 检查highlightRange函数调用
    highlight_calls = len(re.findall(r'highlightRange\s*\(', js_content))
    print(f"\nhighlightRange被调用 {highlight_calls} 次")
    
    # 检查generateQuestion函数
    gen_q_calls = len(re.findall(r'generateQuestion\s*\(', js_content))
    print(f"generateQuestion被调用 {gen_q_calls} 次")
    
    # 检查isInRange函数
    isinrange_calls = len(re.findall(r'isInRange\s*\(', js_content))
    print(f"isInRange被调用 {isinrange_calls} 次")
    
    # 检查isInRange是否定义
    isinrange_def = re.search(r'function\s+isInRange', js_content)
    if isinrange_calls > 0 and not isinrange_def:
        issues.append("❌ isInRange被调用但未定义")
    else:
        print("✅ isInRange已定义")
    
    return issues

def check_event_listeners(js_content):
    """检查事件监听器"""
    print("\n" + "="*70)
    print("🔍 事件监听器检查")
    print("="*70)
    
    issues = []
    
    # 查找所有addEventListener
    listeners = re.findall(r"addEventListener\(['\"](\w+)['\"]", js_content)
    print(f"\n找到 {len(listeners)} 个事件监听器")
    
    for event in set(listeners):
        count = listeners.count(event)
        print(f"  {event}: {count}次")
    
    # 检查是否有重复绑定
    if len(listeners) != len(set(listeners)):
        print("⚠️ 可能存在重复绑定的事件")
    
    return issues

def check_css_class_usage(js_content, html_content):
    """检查CSS类名使用"""
    print("\n" + "="*70)
    print("🔍 CSS类名一致性检查")
    print("="*70)
    
    issues = []
    
    # 从JS中提取使用的CSS类
    js_classes = set()
    js_classes.update(re.findall(r"classList\.add\(['\"]([^'\"]+)['\"]", js_content))
    js_classes.update(re.findall(r"classList\.remove\(['\"]([^'\"]+)['\"]", js_content))
    
    # 从HTML中提取定义的CSS类
    html_classes = set(re.findall(r'\.hand-cell\.(\S+)\s*\{', html_content))
    
    print(f"\nJS中使用的CSS类: {len(js_classes)}")
    print(f"HTML中定义的CSS类: {len(html_classes)}")
    
    # 检查未定义的类
    undefined_classes = js_classes - html_classes - {'pair', 'suited', 'offsuit'}
    
    if undefined_classes:
        print(f"\n⚠️ 这些CSS类在JS中使用但HTML中未定义:")
        for cls in undefined_classes:
            print(f"  • {cls}")
            issues.append(f"CSS类 '{cls}' 未定义")
    else:
        print("\n✅ 所有CSS类都已定义")
    
    return issues

def check_action_handlers(js_content):
    """检查action处理的完整性"""
    print("\n" + "="*70)
    print("🔍 Action处理完整性检查")
    print("="*70)
    
    issues = []
    
    # highlightRange函数中处理的action
    highlight_func = re.search(
        r'function highlightRange.*?\n\}',
        js_content,
        re.DOTALL
    )
    
    if highlight_func:
        func_body = highlight_func.group(0)
        
        # 查找所有if (action === 'xxx')
        actions = re.findall(r"action === ['\"](\w+)['\"]", func_body)
        
        print(f"\nhighlightRange处理的actions:")
        for action in set(actions):
            print(f"  ✓ {action}")
        
        # 应该处理的actions
        expected_actions = ['open', 'callopen', '3bet', '4bet', '5bet', 
                          'call3bet', 'call4bet', 'squeeze', 'vs3bet', 'vs4bet', 'defend']
        
        missing = set(expected_actions) - set(actions)
        if missing:
            print(f"\n⚠️ 这些actions可能没有处理:")
            for action in missing:
                print(f"  • {action}")
                issues.append(f"Action '{action}' 可能没有处理")
    
    return issues

def check_data_integrity(js_content):
    """检查数据完整性"""
    print("\n" + "="*70)
    print("🔍 数据完整性检查")
    print("="*70)
    
    issues = []
    
    # 检查lagRanges结构
    print("\n检查lagRanges数据结构...")
    
    sections = ['openRaise', 'threeBet', 'fourBet', 'fiveBet', 
                'call3Bet', 'call4Bet', 'callOpen', 'squeeze']
    
    for section in sections:
        if section in js_content:
            print(f"  ✅ {section}")
        else:
            issues.append(f"❌ {section} 数据缺失")
            print(f"  ❌ {section}")
    
    return issues

def main():
    print("🎯 顶级代码专家 - 完整代码审查")
    print("逐行检查所有潜在bug和错误")
    print("="*70)
    
    try:
        with open('deep_stack_lag_trainer.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        with open('deep_stack_lag_trainer.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        all_issues = []
        
        # 执行所有检查
        all_issues.extend(check_syntax_errors(js_content))
        all_issues.extend(check_undefined_variables(js_content))
        all_issues.extend(check_null_safety(js_content))
        all_issues.extend(check_array_operations(js_content))
        all_issues.extend(check_function_calls(js_content))
        all_issues.extend(check_event_listeners(js_content))
        all_issues.extend(check_css_class_usage(js_content, html_content))
        all_issues.extend(check_action_handlers(js_content))
        all_issues.extend(check_data_integrity(js_content))
        
        # 总结
        print("\n" + "="*70)
        print("📊 审查总结")
        print("="*70)
        
        if all_issues:
            print(f"\n发现 {len(all_issues)} 个问题:")
            for i, issue in enumerate(all_issues, 1):
                print(f"{i}. {issue}")
        else:
            print("\n🎉 未发现严重错误！代码质量优秀！")
        
        print("\n" + "="*70)
        
        return all_issues
        
    except Exception as e:
        print(f"❌ 审查过程出错：{e}")
        import traceback
        traceback.print_exc()
        return []

if __name__ == '__main__':
    issues = main()
    exit(0 if len(issues) == 0 else 1)

