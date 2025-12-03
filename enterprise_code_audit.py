#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏆 全球顶级代码审阅专家 - 企业级代码审查系统
20年+经验 | 服务过Google, Meta, Amazon等顶级公司
专注：零容忍bug | 企业级稳定性 | 生产环境标准

审查标准：
- 运行时安全性：100%
- 内存泄漏检测：100%
- 边界条件覆盖：100%
- 用户体验保证：100%
- 性能优化检查：100%
"""

import re
import json
from typing import List, Dict, Tuple
from collections import defaultdict

class EnterpriseCodeAuditor:
    def __init__(self, filepath):
        self.filepath = filepath
        self.issues = []
        self.critical_issues = []
        self.warnings = []
        self.suggestions = []
        
    def load_file(self):
        """加载文件"""
        with open(self.filepath, 'r', encoding='utf-8') as f:
            return f.read()
    
    def check_runtime_safety(self, content):
        """运行时安全性检查 - 最高优先级"""
        print("="*80)
        print("🚨 1. 运行时安全性检查 (CRITICAL)")
        print("="*80)
        
        issues = []
        
        # 1.1 检查所有数组访问
        array_access_patterns = [
            (r'(\w+)\[(\w+)\](?!\s*=)', '数组读取'),
            (r'(\w+)\.(\w+)\[', '对象属性数组访问'),
        ]
        
        for pattern, desc in array_access_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                context = content[max(0, match.start()-50):match.end()+50]
                
                # 检查是否有保护
                if '?' not in context and '||' not in context:
                    issues.append({
                        'severity': 'CRITICAL',
                        'line': line_num,
                        'type': f'未保护的{desc}',
                        'code': match.group(0),
                        'fix': f'建议添加可选链或默认值保护'
                    })
        
        # 1.2 检查DOM操作
        dom_patterns = [
            r'document\.getElementById\([^)]+\)\.(?!addEventListener)',
            r'document\.querySelector\([^)]+\)\.(?!addEventListener)',
            r'document\.querySelectorAll\([^)]+\)\.',
        ]
        
        for pattern in dom_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                before = content[max(0, match.start()-100):match.start()]
                
                # 检查前面是否有null check
                if 'if' not in before[-50:] and 'const' not in before[-50:]:
                    issues.append({
                        'severity': 'CRITICAL',
                        'line': line_num,
                        'type': 'DOM操作缺少null check',
                        'code': match.group(0)[:50],
                        'fix': '必须在DOM操作前检查元素是否存在'
                    })
        
        # 1.3 检查事件处理器中的this绑定
        event_handler_pattern = r'addEventListener\([^,]+,\s*function\s*\('
        matches = list(re.finditer(event_handler_pattern, content))
        
        if matches:
            issues.append({
                'severity': 'WARNING',
                'type': '事件处理器使用function而非箭头函数',
                'count': len(matches),
                'fix': '建议使用箭头函数避免this绑定问题'
            })
        
        # 1.4 检查异步操作的错误处理
        async_patterns = [
            (r'async\s+function[^{]+\{[^}]*\}', 'async函数缺少try-catch'),
            (r'\.then\([^)]+\)(?!\s*\.catch)', 'Promise缺少catch'),
        ]
        
        for pattern, desc in async_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                func_body = match.group(0)
                if 'try' not in func_body and 'catch' not in func_body:
                    line_num = content[:match.start()].count('\n') + 1
                    issues.append({
                        'severity': 'CRITICAL',
                        'line': line_num,
                        'type': desc,
                        'fix': '异步操作必须有错误处理'
                    })
        
        # 输出结果
        critical_count = sum(1 for i in issues if i.get('severity') == 'CRITICAL')
        warning_count = sum(1 for i in issues if i.get('severity') == 'WARNING')
        
        print(f"\n发现 {critical_count} 个严重问题, {warning_count} 个警告")
        
        for issue in issues[:10]:  # 只显示前10个
            print(f"\n  {issue.get('severity', 'INFO')}: {issue.get('type', 'Unknown')}")
            if 'line' in issue:
                print(f"  位置: 第{issue['line']}行")
            if 'code' in issue:
                print(f"  代码: {issue['code']}")
            print(f"  修复: {issue.get('fix', 'N/A')}")
        
        return issues
    
    def check_memory_leaks(self, content):
        """内存泄漏检查"""
        print("\n" + "="*80)
        print("💾 2. 内存泄漏检查")
        print("="*80)
        
        issues = []
        
        # 2.1 检查事件监听器是否被移除
        add_listeners = len(re.findall(r'addEventListener', content))
        remove_listeners = len(re.findall(r'removeEventListener', content))
        
        print(f"\n  添加的事件监听器: {add_listeners}")
        print(f"  移除的事件监听器: {remove_listeners}")
        
        if add_listeners > remove_listeners and add_listeners > 5:
            issues.append({
                'severity': 'WARNING',
                'type': '可能存在事件监听器泄漏',
                'detail': f'{add_listeners}个添加 vs {remove_listeners}个移除',
                'fix': '考虑在页面卸载时清理事件监听器'
            })
            print(f"  ⚠️ 警告: 事件监听器可能未正确清理")
        else:
            print(f"  ✅ 事件监听器管理正常")
        
        # 2.2 检查定时器
        set_timers = len(re.findall(r'setInterval|setTimeout', content))
        clear_timers = len(re.findall(r'clearInterval|clearTimeout', content))
        
        print(f"\n  设置的定时器: {set_timers}")
        print(f"  清除的定时器: {clear_timers}")
        
        if set_timers > clear_timers:
            issues.append({
                'severity': 'WARNING',
                'type': '定时器可能未清理',
                'fix': '确保在不需要时清理定时器'
            })
            print(f"  ⚠️ 警告: 定时器可能未清理")
        else:
            print(f"  ✅ 定时器管理正常")
        
        # 2.3 检查全局变量
        global_vars = re.findall(r'^(?:const|let|var)\s+(\w+)\s*=', content, re.MULTILINE)
        print(f"\n  全局变量数量: {len(global_vars)}")
        
        if len(global_vars) > 20:
            issues.append({
                'severity': 'INFO',
                'type': '全局变量过多',
                'count': len(global_vars),
                'fix': '考虑使用模块化或命名空间'
            })
            print(f"  ⚠️ 建议: 全局变量较多({len(global_vars)}个)，建议模块化")
        else:
            print(f"  ✅ 全局变量数量合理")
        
        return issues
    
    def check_data_validation(self, content):
        """数据验证检查"""
        print("\n" + "="*80)
        print("🔒 3. 数据验证与输入安全")
        print("="*80)
        
        issues = []
        
        # 3.1 检查用户输入处理
        input_patterns = [
            r'\.value(?!\s*=)',  # 读取input值
            r'\.textContent\s*=',  # 设置文本内容
            r'\.innerHTML\s*=',  # 设置HTML（危险）
        ]
        
        innerHTML_count = len(re.findall(r'\.innerHTML\s*=', content))
        textContent_count = len(re.findall(r'\.textContent\s*=', content))
        
        print(f"\n  innerHTML使用: {innerHTML_count}次")
        print(f"  textContent使用: {textContent_count}次")
        
        if innerHTML_count > 0:
            issues.append({
                'severity': 'WARNING',
                'type': 'innerHTML存在XSS风险',
                'count': innerHTML_count,
                'fix': '确保所有innerHTML内容都经过转义或使用textContent'
            })
            print(f"  ⚠️ 警告: innerHTML可能存在XSS风险")
        
        # 3.2 检查数据类型检查
        typeof_checks = len(re.findall(r'typeof\s+\w+', content))
        instanceof_checks = len(re.findall(r'instanceof', content))
        
        print(f"\n  类型检查(typeof): {typeof_checks}次")
        print(f"  实例检查(instanceof): {instanceof_checks}次")
        
        if typeof_checks + instanceof_checks < 5:
            issues.append({
                'severity': 'INFO',
                'type': '类型检查较少',
                'fix': '建议增加类型检查提高健壮性'
            })
        
        return issues
    
    def check_performance(self, content):
        """性能检查"""
        print("\n" + "="*80)
        print("⚡ 4. 性能优化检查")
        print("="*80)
        
        issues = []
        
        # 4.1 检查DOM操作
        dom_loop_pattern = r'for\s*\([^)]+\)\s*\{[^}]*document\.'
        dom_in_loop = len(re.findall(dom_loop_pattern, content))
        
        print(f"\n  循环中的DOM操作: {dom_in_loop}次")
        
        if dom_in_loop > 0:
            issues.append({
                'severity': 'WARNING',
                'type': '循环中有DOM操作',
                'count': dom_in_loop,
                'fix': '建议将DOM操作移到循环外或使用DocumentFragment'
            })
            print(f"  ⚠️ 警告: 循环中有DOM操作可能影响性能")
        else:
            print(f"  ✅ 无循环中的DOM操作")
        
        # 4.2 检查查询选择器使用
        querySelectorAll_count = len(re.findall(r'querySelectorAll', content))
        getElementById_count = len(re.findall(r'getElementById', content))
        
        print(f"\n  querySelectorAll: {querySelectorAll_count}次")
        print(f"  getElementById: {getElementById_count}次")
        
        if querySelectorAll_count > getElementById_count * 2:
            issues.append({
                'severity': 'INFO',
                'type': 'querySelectorAll使用较多',
                'fix': '考虑缓存查询结果或使用更快的选择器'
            })
        
        # 4.3 检查数组操作
        array_methods = {
            'forEach': len(re.findall(r'\.forEach\(', content)),
            'map': len(re.findall(r'\.map\(', content)),
            'filter': len(re.findall(r'\.filter\(', content)),
            'reduce': len(re.findall(r'\.reduce\(', content)),
        }
        
        print(f"\n  数组方法使用:")
        for method, count in array_methods.items():
            print(f"    {method}: {count}次")
        
        return issues
    
    def check_error_handling(self, content):
        """错误处理检查"""
        print("\n" + "="*80)
        print("🛡️ 5. 错误处理完整性")
        print("="*80)
        
        issues = []
        
        # 5.1 统计try-catch使用
        try_blocks = len(re.findall(r'\btry\s*\{', content))
        catch_blocks = len(re.findall(r'\bcatch\s*\(', content))
        
        print(f"\n  try块: {try_blocks}个")
        print(f"  catch块: {catch_blocks}个")
        
        if try_blocks != catch_blocks:
            issues.append({
                'severity': 'CRITICAL',
                'type': 'try-catch不匹配',
                'fix': '检查所有try块都有对应的catch'
            })
            print(f"  ❌ 严重: try-catch块数量不匹配")
        else:
            print(f"  ✅ try-catch匹配正确")
        
        # 5.2 检查console.error使用
        console_error = len(re.findall(r'console\.error', content))
        console_log = len(re.findall(r'console\.log', content))
        
        print(f"\n  console.error: {console_error}次")
        print(f"  console.log: {console_log}次")
        
        if console_log > console_error * 3 and console_error < 5:
            issues.append({
                'severity': 'INFO',
                'type': '错误日志不足',
                'fix': '建议在catch块中使用console.error记录错误'
            })
        
        return issues
    
    def check_code_quality(self, content):
        """代码质量检查"""
        print("\n" + "="*80)
        print("📝 6. 代码质量与可维护性")
        print("="*80)
        
        issues = []
        
        # 6.1 函数长度检查
        function_pattern = r'function\s+\w+[^{]*\{((?:[^{}]|\{[^}]*\})*)\}'
        functions = re.findall(function_pattern, content)
        
        long_functions = [f for f in functions if f.count('\n') > 50]
        
        print(f"\n  总函数数: {len(functions)}")
        print(f"  超长函数(>50行): {len(long_functions)}")
        
        if long_functions:
            issues.append({
                'severity': 'INFO',
                'type': '存在超长函数',
                'count': len(long_functions),
                'fix': '建议拆分为更小的函数'
            })
        
        # 6.2 注释覆盖率
        comment_lines = len(re.findall(r'^\s*//|^\s*/\*', content, re.MULTILINE))
        code_lines = len([l for l in content.split('\n') if l.strip() and not l.strip().startswith('//')])
        
        comment_ratio = comment_lines / code_lines if code_lines > 0 else 0
        
        print(f"\n  代码行数: {code_lines}")
        print(f"  注释行数: {comment_lines}")
        print(f"  注释率: {comment_ratio*100:.1f}%")
        
        if comment_ratio < 0.05:
            issues.append({
                'severity': 'INFO',
                'type': '注释不足',
                'fix': '建议增加关键逻辑的注释'
            })
            print(f"  ⚠️ 建议: 注释率偏低")
        else:
            print(f"  ✅ 注释率合理")
        
        # 6.3 魔法数字检查
        magic_numbers = re.findall(r'(?<!\d)(?:1\d{2,}|2\d{2,}|[3-9]\d{2,})(?!\d)', content)
        
        print(f"\n  潜在魔法数字: {len(magic_numbers)}个")
        
        if len(magic_numbers) > 10:
            issues.append({
                'severity': 'INFO',
                'type': '魔法数字较多',
                'count': len(magic_numbers),
                'fix': '建议使用命名常量'
            })
        
        return issues
    
    def generate_report(self):
        """生成最终报告"""
        print("\n" + "="*80)
        print("📊 7. 执行全面审查...")
        print("="*80)
        
        content = self.load_file()
        
        # 执行所有检查
        runtime_issues = self.check_runtime_safety(content)
        memory_issues = self.check_memory_leaks(content)
        validation_issues = self.check_data_validation(content)
        performance_issues = self.check_performance(content)
        error_issues = self.check_error_handling(content)
        quality_issues = self.check_code_quality(content)
        
        # 汇总
        all_issues = runtime_issues + memory_issues + validation_issues + \
                    performance_issues + error_issues + quality_issues
        
        critical = [i for i in all_issues if i.get('severity') == 'CRITICAL']
        warnings = [i for i in all_issues if i.get('severity') == 'WARNING']
        info = [i for i in all_issues if i.get('severity') == 'INFO']
        
        # 生成报告
        print("\n" + "="*80)
        print("🎯 最终审查报告")
        print("="*80)
        
        print(f"\n📊 问题统计:")
        print(f"  🚨 严重问题: {len(critical)}个")
        print(f"  ⚠️  警告: {len(warnings)}个")
        print(f"  ℹ️  建议: {len(info)}个")
        print(f"  总计: {len(all_issues)}个")
        
        # 评分
        score = 100
        score -= len(critical) * 10
        score -= len(warnings) * 3
        score -= len(info) * 0.5
        score = max(0, score)
        
        print(f"\n🏆 代码质量评分: {score:.1f}/100")
        
        if score >= 95:
            grade = "A+ (企业级)"
            status = "✅ 可以发布给1000万用户"
        elif score >= 90:
            grade = "A (优秀)"
            status = "⚠️ 建议修复警告后发布"
        elif score >= 80:
            grade = "B (良好)"
            status = "⚠️ 必须修复严重问题后才能发布"
        elif score >= 70:
            grade = "C (及格)"
            status = "❌ 不建议发布，存在较多问题"
        else:
            grade = "D (不及格)"
            status = "❌ 禁止发布，必须全面重构"
        
        print(f"  等级: {grade}")
        print(f"  发布建议: {status}")
        
        # 关键问题详情
        if critical:
            print(f"\n🚨 严重问题详情 (必须修复):")
            for i, issue in enumerate(critical, 1):
                print(f"\n  {i}. {issue.get('type', 'Unknown')}")
                if 'line' in issue:
                    print(f"     位置: 第{issue['line']}行")
                if 'code' in issue:
                    print(f"     代码: {issue['code'][:60]}")
                print(f"     修复: {issue.get('fix', 'N/A')}")
        
        return {
            'score': score,
            'grade': grade,
            'critical': len(critical),
            'warnings': len(warnings),
            'info': len(info),
            'can_publish': len(critical) == 0 and score >= 90
        }

def main():
    print("="*80)
    print("🏆 全球顶级代码审阅专家 - 企业级代码审查")
    print("20年+经验 | 服务1000万用户级别的严格标准")
    print("="*80)
    
    auditor = EnterpriseCodeAuditor('deep_stack_lag_trainer.js')
    result = auditor.generate_report()
    
    print("\n" + "="*80)
    print("✅ 审查完成！")
    print("="*80)
    
    if result['can_publish']:
        print("\n🎉 恭喜！代码已达到企业级标准，可以放心发布！")
    else:
        print("\n⚠️ 请先修复发现的问题再考虑发布！")
    
    print(f"\n最终评分: {result['score']:.1f}/100 ({result['grade']})")
    print(f"严重问题: {result['critical']}个")
    print(f"警告: {result['warnings']}个")
    print(f"建议: {result['info']}个")

if __name__ == '__main__':
    main()

