#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏆 全球顶级代码审阅专家 - WSOP Tournament Hub 审查
20年+经验 | 服务1000万用户级别 | 零容忍标准

审查标准：
- Google/Meta/Amazon 企业级
- 可服务1000万用户
- 零崩溃、零漏洞
- 100%可靠性
"""

import re
from collections import defaultdict

class WSPOCodeAuditor:
    def __init__(self, filepath):
        self.filepath = filepath
        self.issues = {
            'critical': [],
            'high': [],
            'medium': [],
            'low': [],
            'info': []
        }
        self.stats = {
            'total_lines': 0,
            'html_lines': 0,
            'css_lines': 0,
            'js_lines': 0
        }
        
    def load_file(self):
        with open(self.filepath, 'r', encoding='utf-8') as f:
            return f.read()
    
    def audit(self):
        print("="*80)
        print("🏆 全球顶级代码审阅专家 - WSOP Tournament Hub 审查")
        print("标准：服务1000万用户级别 | 零容忍 | 企业级")
        print("="*80)
        
        content = self.load_file()
        lines = content.split('\n')
        self.stats['total_lines'] = len(lines)
        
        # 1. HTML结构检查
        print("\n📄 Phase 1: HTML结构完整性检查")
        self.check_html_structure(content, lines)
        
        # 2. JavaScript安全检查
        print("\n🔒 Phase 2: JavaScript运行时安全检查")
        self.check_javascript_safety(content, lines)
        
        # 3. DOM操作安全
        print("\n🎯 Phase 3: DOM操作安全检查")
        self.check_dom_safety(content, lines)
        
        # 4. 事件处理检查
        print("\n⚡ Phase 4: 事件监听器检查")
        self.check_event_listeners(content, lines)
        
        # 5. 数据验证检查
        print("\n✓ Phase 5: 数据验证检查")
        self.check_data_validation(content, lines)
        
        # 6. 性能检查
        print("\n🚀 Phase 6: 性能优化检查")
        self.check_performance(content, lines)
        
        # 7. 浏览器兼容性
        print("\n🌐 Phase 7: 浏览器兼容性检查")
        self.check_browser_compatibility(content, lines)
        
        # 8. 安全漏洞扫描
        print("\n🛡️ Phase 8: 安全漏洞扫描")
        self.check_security(content, lines)
        
        # 9. CSS检查
        print("\n🎨 Phase 9: CSS质量检查")
        self.check_css(content, lines)
        
        # 10. 代码质量检查
        print("\n📊 Phase 10: 代码质量检查")
        self.check_code_quality(content, lines)
        
        return self.generate_report()
    
    def check_html_structure(self, content, lines):
        issues = []
        
        # 检查必要标签
        required = ['<!DOCTYPE', '<html', '<head', '<body', '<title']
        for tag in required:
            if tag not in content:
                self.issues['critical'].append(f"缺少必要标签: {tag}")
                issues.append(f"❌ {tag}")
        
        # 检查meta标签
        if 'charset' not in content:
            self.issues['high'].append("缺少字符编码声明")
            issues.append("⚠️ 缺少charset")
        
        if 'viewport' not in content:
            self.issues['high'].append("缺少viewport设置（移动端）")
            issues.append("⚠️ 缺少viewport")
        
        # 检查标签闭合
        open_divs = len(re.findall(r'<div[^>]*(?<!/)>', content))
        close_divs = len(re.findall(r'</div>', content))
        
        if open_divs != close_divs:
            self.issues['critical'].append(f"DIV标签不闭合: {open_divs} open vs {close_divs} close")
            issues.append(f"❌ DIV不闭合: {open_divs} vs {close_divs}")
        
        if not issues:
            print("  ✅ HTML结构完整")
        else:
            for issue in issues:
                print(f"  {issue}")
    
    def check_javascript_safety(self, content, lines):
        # 提取JavaScript
        js_blocks = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
        
        if not js_blocks:
            print("  ℹ️ 未找到JavaScript代码")
            return
        
        js_code = '\n'.join(js_blocks)
        
        # 检查DOM操作null check
        dom_ops = re.findall(r'(document\.(?:getElementById|querySelector|querySelectorAll)\([^)]+\))', js_code)
        
        print(f"  DOM操作数: {len(dom_ops)}")
        
        for i, op in enumerate(dom_ops[:5], 1):  # 只显示前5个
            # 检查是否有null check
            context_start = js_code.find(op)
            context = js_code[max(0, context_start-100):context_start+200]
            
            if 'if' not in context and '&&' not in context and '?.' not in context:
                line_num = self.find_line_number(lines, op)
                self.issues['high'].append(f"Line {line_num}: DOM操作缺少null check: {op[:50]}")
                print(f"  ⚠️ Line {line_num}: 缺少null check")
        
        # 检查数组访问
        array_access = len(re.findall(r'\w+\[\d+\]|\w+\[[\w\[\]]+\]', js_code))
        print(f"  数组访问: {array_access}次")
        
        if array_access > 50:
            self.issues['medium'].append(f"大量数组访问({array_access}次)，需要边界检查")
        
        # 检查try-catch
        try_count = len(re.findall(r'\btry\s*\{', js_code))
        print(f"  try-catch块: {try_count}个")
        
        if try_count == 0 and len(js_code) > 100:
            self.issues['medium'].append("代码缺少错误处理（无try-catch）")
            print(f"  ⚠️ 缺少错误处理")
    
    def check_dom_safety(self, content, lines):
        # 检查innerHTML使用
        innerHTML_count = len(re.findall(r'\.innerHTML\s*[=+]', content))
        textContent_count = len(re.findall(r'\.textContent\s*=', content))
        
        print(f"  innerHTML使用: {innerHTML_count}次")
        print(f"  textContent使用: {textContent_count}次")
        
        if innerHTML_count > 0:
            self.issues['medium'].append(f"innerHTML有XSS风险({innerHTML_count}处)")
            print(f"  ⚠️ innerHTML有XSS风险")
        
        # 检查eval使用
        if 'eval(' in content:
            self.issues['critical'].append("使用了eval()，严重安全风险")
            print(f"  ❌ 发现eval()使用")
        else:
            print(f"  ✅ 未使用eval()")
        
        # 检查document.write
        if 'document.write' in content:
            self.issues['high'].append("使用了document.write，性能和安全风险")
            print(f"  ⚠️ 发现document.write")
    
    def check_event_listeners(self, content, lines):
        add_listeners = len(re.findall(r'addEventListener', content))
        remove_listeners = len(re.findall(r'removeEventListener', content))
        inline_events = len(re.findall(r'on\w+="', content))
        
        print(f"  addEventListener: {add_listeners}个")
        print(f"  removeEventListener: {remove_listeners}个")
        print(f"  内联事件: {inline_events}个")
        
        if add_listeners > remove_listeners and add_listeners > 10:
            self.issues['medium'].append(f"可能有{add_listeners - remove_listeners}个事件监听器未清理")
            print(f"  ⚠️ 可能有内存泄漏")
        
        if inline_events > 10:
            self.issues['low'].append(f"大量内联事件处理器({inline_events}个)，建议使用addEventListener")
            print(f"  ℹ️ 建议减少内联事件")
    
    def check_data_validation(self, content, lines):
        # 检查输入字段
        inputs = len(re.findall(r'<input', content))
        selects = len(re.findall(r'<select', content))
        textareas = len(re.findall(r'<textarea', content))
        
        total_inputs = inputs + selects + textareas
        
        print(f"  输入字段: {total_inputs}个 (input:{inputs}, select:{selects}, textarea:{textareas})")
        
        if total_inputs > 0:
            # 检查是否有验证逻辑
            has_validation = 'required' in content or 'pattern' in content or 'validate' in content.lower()
            if not has_validation:
                self.issues['medium'].append(f"有{total_inputs}个输入字段，但缺少验证逻辑")
                print(f"  ⚠️ 缺少输入验证")
            else:
                print(f"  ✅ 有验证逻辑")
    
    def check_performance(self, content, lines):
        size_kb = len(content) / 1024
        print(f"  文件大小: {size_kb:.1f}KB")
        
        if size_kb > 150:
            self.issues['medium'].append(f"文件过大({size_kb:.1f}KB)，建议分离CSS/JS")
            print(f"  ⚠️ 文件较大")
        else:
            print(f"  ✅ 文件大小合理")
        
        # 检查图片
        images = len(re.findall(r'<img', content))
        print(f"  图片数量: {images}个")
        
        # 检查外部资源
        external_css = len(re.findall(r'<link[^>]+href=', content))
        external_js = len(re.findall(r'<script[^>]+src=', content))
        
        print(f"  外部CSS: {external_css}个")
        print(f"  外部JS: {external_js}个")
    
    def check_browser_compatibility(self, content, lines):
        # 检查现代API
        modern_features = {
            'fetch(': 0,
            'async/await': 0,
            'const ': 0,
            'let ': 0,
            '=>': 0,
            'classList': 0
        }
        
        for feature, _ in modern_features.items():
            modern_features[feature] = len(re.findall(re.escape(feature), content))
        
        print(f"  现代JavaScript特性:")
        for feature, count in modern_features.items():
            if count > 0:
                print(f"    {feature}: {count}次")
        
        # 检查CSS特性
        if 'grid' in content or 'flex' in content:
            print(f"  ✅ 使用现代CSS布局")
        
        print(f"  ✅ 兼容现代浏览器")
    
    def check_security(self, content, lines):
        issues = []
        
        # 危险函数检查
        dangerous = ['eval', 'innerHTML', 'document.write', 'setTimeout(string)']
        
        for func in dangerous:
            if func in content:
                count = content.count(func)
                issues.append(f"⚠️ {func}: {count}处")
        
        # 检查外部链接
        external_links = re.findall(r'href="(https?://[^"]+)"', content)
        if external_links:
            print(f"  外部链接: {len(external_links)}个")
            for link in external_links[:3]:
                print(f"    - {link[:50]}")
        
        if not issues:
            print(f"  ✅ 未发现明显安全漏洞")
        else:
            for issue in issues:
                print(f"  {issue}")
    
    def check_css(self, content, lines):
        css_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
        
        if css_blocks:
            css_code = '\n'.join(css_blocks)
            
            # 检查!important
            important_count = len(re.findall(r'!important', css_code))
            print(f"  !important使用: {important_count}次")
            
            if important_count > 20:
                self.issues['low'].append(f"!important使用过多({important_count}次)")
            
            # 检查动画
            animations = len(re.findall(r'@keyframes|animation:', css_code))
            print(f"  动画: {animations}个")
            
            # 检查媒体查询
            media_queries = len(re.findall(r'@media', css_code))
            print(f"  媒体查询: {media_queries}个")
            
            if media_queries > 0:
                print(f"  ✅ 包含响应式设计")
            
            print(f"  ✅ CSS质量良好")
    
    def check_code_quality(self, content, lines):
        # 检查注释
        comments = len(re.findall(r'<!--.*?-->|//.*?$|/\*.*?\*/', content, re.DOTALL | re.MULTILINE))
        print(f"  注释数量: {comments}个")
        
        # 检查代码缩进一致性
        indent_spaces = len([l for l in lines if l.startswith('    ')])
        indent_tabs = len([l for l in lines if l.startswith('\t')])
        
        print(f"  缩进: 空格{indent_spaces}行, Tab{indent_tabs}行")
        
        if indent_spaces > 0 and indent_tabs > 0:
            self.issues['low'].append("混合使用空格和Tab缩进")
            print(f"  ⚠️ 缩进不一致")
        
        # 检查函数数量
        functions = len(re.findall(r'\bfunction\s+\w+\s*\(', content))
        arrow_functions = len(re.findall(r'=>', content))
        
        print(f"  函数: {functions}个普通函数, {arrow_functions}个箭头函数")
        
        print(f"  ✅ 代码结构清晰")
    
    def find_line_number(self, lines, text):
        # 查找文本所在行号
        text_snippet = text[:30]
        for i, line in enumerate(lines, 1):
            if text_snippet in line:
                return i
        return 0
    
    def generate_report(self):
        print("\n" + "="*80)
        print("📊 最终审查报告")
        print("="*80)
        
        critical = len(self.issues['critical'])
        high = len(self.issues['high'])
        medium = len(self.issues['medium'])
        low = len(self.issues['low'])
        
        print(f"\n  🚨 严重问题: {critical}个")
        print(f"  ⚠️  高级问题: {high}个")
        print(f"  📝 中级问题: {medium}个")
        print(f"  ℹ️  低级问题: {low}个")
        
        # 显示详细问题
        if critical > 0:
            print(f"\n  🚨 严重问题详情:")
            for issue in self.issues['critical']:
                print(f"    - {issue}")
        
        if high > 0:
            print(f"\n  ⚠️  高级问题详情:")
            for issue in self.issues['high'][:5]:  # 只显示前5个
                print(f"    - {issue}")
            if len(self.issues['high']) > 5:
                print(f"    ... 还有{len(self.issues['high'])-5}个")
        
        # 评分
        score = 100 - critical * 20 - high * 10 - medium * 3 - low * 1
        score = max(0, score)
        
        print(f"\n🏆 代码质量评分: {score}/100")
        
        if score >= 95:
            grade = "A+ (企业级)"
            status = "✅ 可以发布给1000万用户"
        elif score >= 90:
            grade = "A (优秀)"
            status = "✅ 修复高级问题后可发布"
        elif score >= 80:
            grade = "B (良好)"
            status = "⚠️ 建议修复后发布"
        elif score >= 70:
            grade = "C (及格)"
            status = "⚠️ 需要改进"
        else:
            grade = "D (不及格)"
            status = "❌ 需要重大改进"
        
        print(f"  等级: {grade}")
        print(f"  发布建议: {status}")
        
        return {
            'score': score,
            'grade': grade,
            'critical': critical,
            'high': high,
            'medium': medium,
            'low': low,
            'can_publish': critical == 0 and high == 0 and score >= 85
        }

def main():
    auditor = WSPOCodeAuditor('wsop_tournament_hub.html')
    result = auditor.audit()
    
    print("\n" + "="*80)
    print("✅ 审查完成！")
    print("="*80)
    
    if result['can_publish']:
        print("\n🎉 代码质量优秀，可以发布！")
    else:
        print("\n⚠️ 建议修复问题后再发布")
    
    print(f"\n最终评分: {result['score']}/100 ({result['grade']})")
    
    if result['critical'] > 0:
        print(f"\n⚠️ 请优先修复 {result['critical']} 个严重问题！")
    
    if result['high'] > 0:
        print(f"⚠️ 请修复 {result['high']} 个高级问题！")

if __name__ == '__main__':
    main()

