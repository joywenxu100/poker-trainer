# -*- coding: utf-8 -*-
"""
德州扑克快速复盘 - 本地服务器
通过代理调用 Gemini API
"""
import http.server
import socketserver
import json
import requests
import base64
import sys
import os
import webbrowser
from urllib.parse import urlparse, parse_qs
import threading
import time

# 设置输出编码
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# ==================== 配置 ====================
PORT = 8899
API_KEY = 'AIzaSyCGLHoZLcXU7oQiKXT9929PZwal1UenRjY'
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}'
PROXY = 'http://127.0.0.1:10809'  # V2Ray HTTP 代理

# ==================== 提示词模板 ====================
def build_prompt(username='luckywm', stack_depth='200-300', is_short_stack=False, opponent_stack=''):
    """构建专业的德州扑克复盘提示词"""
    
    stack_info = f"有效筹码深度约为 {stack_depth} BB"
    if is_short_stack and opponent_stack:
        stack_info += f"，对手是短码玩家，有效筹码约 {opponent_stack} BB"

    return f'''你是一位世界顶级的德州扑克职业选手和教练，拥有20年以上的高级别现金局和锦标赛经验。你的任务是帮助玩家复盘和分析他们的手牌，找出决策中的问题并提供改进建议。

## 基本信息
- **目标玩家昵称**: {username}（请在截图中找到这个玩家，分析他的决策）
- **筹码深度信息**: {stack_info}
- **游戏类型**: 这是一局有 Straddle 的现金局（盲注结构通常是 小盲/大盲/Straddle）

## 分析要求

请仔细查看提供的两张截图：
1. **第一张图片**：牌局回顾界面，包含：
   - 牌局ID和时间
   - 盲注结构（如 2/4/8 表示小盲2、大盲4、Straddle 8）
   - 底池大小和保险信息
   - 所有玩家的手牌（如果有显示）
   - 公共牌（翻牌、转牌、河牌）
   - 每个玩家的行动和盈亏结果

2. **第二张图片**：对手数据面板，包含：
   - 对手昵称和ID
   - 本级别手数
   - 胜率
   - 入局率（VPIP）
   - 摊牌率

## 分析框架

请按以下结构进行详细分析：

### 1️⃣ 牌局信息提取
- 准确识别并列出：盲注结构、底池大小、参与玩家、每个玩家的手牌、公共牌
- 识别目标玩家 {username} 的位置和手牌

### 2️⃣ 对手画像分析
- 根据对手的统计数据（入局率、胜率、摊牌率）判断对手类型
- 入局率 > 40% 通常是松手玩家
- 摊牌率低说明对手弃牌频率高
- 结合手数判断数据的可靠性

### 3️⃣ 翻前分析 (Preflop)
- {username} 的起手牌强度如何？
- 在当前位置，这手牌应该如何行动？（加注、跟注、弃牌）
- 如果有加注，加注量是否合理？
- 考虑到对手类型，翻前策略是否需要调整？

### 4️⃣ 翻牌分析 (Flop)
- 翻牌结构如何？（干燥/湿润、有无听牌、高/低牌面）
- {username} 在翻牌上的牌力如何？
- 翻牌上的行动是否正确？（下注尺寸、是否应该持续下注、check-raise等）
- 如果有犯错，应该如何改进？

### 5️⃣ 转牌分析 (Turn)
- 转牌对双方牌力的影响
- 行动是否合理？
- 底池控制 vs 价值下注的权衡

### 6️⃣ 河牌分析 (River)
- 河牌对最终牌力的影响
- 最终行动是否正确？
- 如果是诈唬，诈唬故事是否可信？
- 如果是价值下注，下注尺寸是否最优？

### 7️⃣ 关键决策点评估
- 指出本手牌中最关键的决策点
- 评估每个决策点的 EV（期望值）
- 如果有明显错误，计算大约损失了多少 EV

### 8️⃣ 总结与建议
- 本手牌打得如何？（优秀/良好/一般/需改进）
- 主要问题在哪里？
- 具体的改进建议
- 类似情况下的最优打法

## 输出格式要求
- 使用清晰的层级结构
- 重要信息用 **粗体** 标注
- 数字和金额用精确数值
- 对错决策要明确给出判断
- 语言简洁但分析要深入
- 最后给出一个简短的结论和评分（1-10分）

请开始分析：'''


class QuickReviewHandler(http.server.SimpleHTTPRequestHandler):
    """处理快速复盘请求的HTTP处理器"""
    
    def do_OPTIONS(self):
        """处理CORS预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """处理POST请求"""
        if self.path == '/api/analyze':
            self.handle_analyze()
        else:
            self.send_error(404, 'Not Found')
    
    def handle_analyze(self):
        """处理手牌分析请求"""
        try:
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 提取参数
            hand_image = data.get('handImage', '')
            opponent_image = data.get('opponentImage', '')
            username = data.get('username', 'luckywm')
            stack_depth = data.get('stackDepth', '200-300')
            is_short_stack = data.get('isShortStack', False)
            opponent_stack = data.get('opponentStack', '')
            
            print(f"\n📥 收到分析请求")
            print(f"   用户: {username}")
            print(f"   筹码: {stack_depth} BB")
            
            # 构建提示词
            prompt = build_prompt(username, stack_depth, is_short_stack, opponent_stack)
            
            # 准备Gemini API请求
            parts = [{"text": prompt}]
            
            # 添加手牌图片
            if hand_image:
                # 去除data URL前缀
                if ',' in hand_image:
                    mime_type = hand_image.split(';')[0].split(':')[1]
                    image_data = hand_image.split(',')[1]
                else:
                    mime_type = 'image/jpeg'
                    image_data = hand_image
                
                parts.append({
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": image_data
                    }
                })
                print("   ✅ 手牌图片已添加")
            
            # 添加对手数据图片
            if opponent_image:
                if ',' in opponent_image:
                    mime_type = opponent_image.split(';')[0].split(':')[1]
                    image_data = opponent_image.split(',')[1]
                else:
                    mime_type = 'image/jpeg'
                    image_data = opponent_image
                
                parts.append({
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": image_data
                    }
                })
                print("   ✅ 对手数据图片已添加")
            
            # 调用Gemini API
            print("\n🚀 调用 Gemini API...")
            
            payload = {
                "contents": [{"parts": parts}],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 8192,
                },
                "safetySettings": [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
                ]
            }
            
            proxies = {"http": PROXY, "https": PROXY}
            
            response = requests.post(
                API_URL,
                headers={'Content-Type': 'application/json'},
                json=payload,
                proxies=proxies,
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                print("✅ 分析完成!")
                
                # 返回成功响应
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_data = {
                    "success": True,
                    "result": text
                }
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
            else:
                error_msg = response.json().get('error', {}).get('message', response.text)
                print(f"❌ API错误: {error_msg}")
                
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_data = {
                    "success": False,
                    "error": error_msg
                }
                self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
                
        except Exception as e:
            print(f"❌ 处理错误: {e}")
            import traceback
            traceback.print_exc()
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "success": False,
                "error": str(e)
            }
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        if '/api/' in args[0]:
            return  # API请求已经有自定义日志
        print(f"📄 {args[0]}")


def open_browser():
    """延迟打开浏览器"""
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}/quick_review.html')


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("🃏 德州扑克快速复盘工具 - 本地服务器")
    print("=" * 60)
    print(f"\n📍 服务地址: http://localhost:{PORT}")
    print(f"🌐 代理地址: {PROXY}")
    print(f"🔑 API: Gemini 2.5 Flash")
    print("\n" + "-" * 60)
    print("💡 使用方法:")
    print("   1. 上传手牌截图（牌局回顾界面）")
    print("   2. 上传对手数据截图（玩家面板）")
    print("   3. 点击「开始 AI 复盘分析」")
    print("-" * 60)
    print("\n⏳ 启动服务器...\n")
    
    # 切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 启动浏览器（在新线程中延迟打开）
    threading.Thread(target=open_browser, daemon=True).start()
    
    # 启动HTTP服务器
    with socketserver.TCPServer(("", PORT), QuickReviewHandler) as httpd:
        print(f"✅ 服务器已启动: http://localhost:{PORT}")
        print("📱 浏览器将自动打开...")
        print("\n按 Ctrl+C 停止服务器\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 服务器已停止")


if __name__ == "__main__":
    main()

