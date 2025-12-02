# -*- coding: utf-8 -*-
"""
德州扑克快速复盘 - 本地服务器
通过代理调用 Gemini API

版本: 2.0
修复: 端口占用、错误处理、代理配置
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
import socket

# 设置输出编码
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# ==================== 密钥解密工具 ====================
# 注意：这是混淆而非真正的加密，仅防止源码中明文显示
def _decrypt_key(encoded_key):
    """解密混淆的API密钥"""
    try:
        import base64
        decoded = base64.b64decode(encoded_key).decode('utf-8')
        return ''.join(chr(ord(c) - (i % 7 + 1)) for i, c in enumerate(decoded))
    except Exception as e:
        print(f"⚠️ 密钥解密失败: {e}")
        return ''

# 混淆后的内置密钥
_GEMINI_KEY_ENCRYPTED = 'Qkt9ZVh/SU1cdDx6Wm03SE5weEk4YE08WlN3dXNreFxscF9IL2VV'
_DEEPSEEK_KEY_ENCRYPTED = 'dG0waTlsOTg3O2c6PmsyNjs0PGhqOjIzODo5QGdoZWY1az8='

# ==================== 配置 ====================
PORT = 8899
# 优先使用环境变量，否则使用内置混淆密钥
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', _decrypt_key(_GEMINI_KEY_ENCRYPTED))
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', _decrypt_key(_DEEPSEEK_KEY_ENCRYPTED))

# API URLs
API_KEY = GEMINI_API_KEY  # 主要使用Gemini
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}'
DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

# 代理配置 - 自动检测
PROXY_CANDIDATES = [
    'http://127.0.0.1:10809',  # V2Ray HTTP
    'http://127.0.0.1:7890',   # Clash
    'http://127.0.0.1:1080',   # 通用
]

# 最大请求大小 (20MB)
MAX_CONTENT_LENGTH = 20 * 1024 * 1024

def find_working_proxy():
    """自动检测可用的代理"""
    for proxy in PROXY_CANDIDATES:
        try:
            # 尝试通过代理连接Google
            response = requests.get(
                'https://www.google.com',
                proxies={'http': proxy, 'https': proxy},
                timeout=5
            )
            if response.status_code == 200:
                return proxy
        except:
            continue
    # 默认返回第一个
    return PROXY_CANDIDATES[0]

# 自动检测代理
PROXY = find_working_proxy()

# ==================== 提示词模板 (优化版 v2.1 - 支持多种输入模式) ====================
def build_prompt(username='luckywm', stack_depth='200-300', is_short_stack=False, opponent_stack='',
                 hand_mode='image', opponent_mode='image', manual_hand_text='', manual_opponent_text=''):
    """
    构建专业的德州扑克复盘提示词 - 支持多种输入模式
    
    Args:
        hand_mode: 'image' 或 'manual' - 手牌信息输入方式
        opponent_mode: 'image' 或 'manual' - 对手数据输入方式
        manual_hand_text: 手动输入的手牌信息文本
        manual_opponent_text: 手动输入的对手数据文本
    """
    
    stack_info = f"有效筹码深度约为 {stack_depth} BB"
    if is_short_stack and opponent_stack:
        stack_info += f"，对手是短码玩家，有效筹码约 {opponent_stack} BB"

    # 根据输入模式构建不同的数据说明
    input_description = ""
    
    if hand_mode == 'image' and opponent_mode == 'image':
        input_description = """
## 📸 输入数据：两张截图

你将收到两张截图：
1. **第一张图片** - 牌局回顾界面
2. **第二张图片** - 对手数据面板

请从截图中识别所有必要信息。"""
    
    elif hand_mode == 'manual' and opponent_mode == 'manual':
        input_description = f"""
## 📝 输入数据：用户手动输入

用户已手动输入所有信息，**无需识别截图**，请直接使用以下数据进行分析：

{manual_hand_text}

{manual_opponent_text}"""
    
    elif hand_mode == 'image' and opponent_mode == 'manual':
        input_description = f"""
## 📸+📝 输入数据：混合模式

**手牌信息**：请从截图中识别（第一张图片 - 牌局回顾界面）

**对手数据**：用户已手动输入，请直接使用：
{manual_opponent_text}"""
    
    elif hand_mode == 'manual' and opponent_mode == 'image':
        input_description = f"""
## 📝+📸 输入数据：混合模式

**手牌信息**：用户已手动输入，请直接使用：
{manual_hand_text}

**对手数据**：请从截图中识别（图片 - 对手数据面板）"""

    return f'''你是一位世界顶级的德州扑克职业选手和教练，拥有20年以上的高级别现金局经验，擅长深筹码博弈(200BB+)和漏洞利用打法。你的任务是帮助玩家复盘和分析他们的手牌，找出决策中的问题并提供专业的改进建议。

## 基本信息
- **目标玩家昵称**: {username}（分析这个玩家的所有决策）
- **筹码深度信息**: {stack_info}
- **游戏类型**: 这是一局有 Straddle 的中国线上现金局（盲注结构通常是 小盲/大盲/Straddle，如2/4/8）

{input_description}

## ⚠️ 截图识别说明（如需要从截图识别）

如果需要从截图识别信息，这是**中文界面**的截图格式说明：

### 牌局回顾界面
- 顶部: **牌局ID** 和 **日期时间**
- **盲注结构**: 格式如 "2/4/8(2)" = 小盲2/大盲4/Straddle8
- **底池**: "底池: xxx"
- **保险**: "保险 xx.x"（绿色数字）
- **玩家列表**: 头像+昵称+手牌+行动+盈亏
- **公共牌**: 5张牌
- 红色背面 = 弃牌

### 对手数据面板
- 昵称、ID号
- 本级别手数、胜率、入局率(VPIP)、摊牌率

## 🎯 分析要求

### 步骤1️⃣ 信息确认（必须完成）

请先列出所有关键信息（从截图识别或用户输入）：
```
【牌局基本信息】
- 盲注结构: [小盲/大盲/Straddle]
- 底池大小: [数值]

【{username}的信息】
- 位置: [SB/BB/Straddle/UTG/MP/CO/BTN]
- 手牌: [两张牌]
- 行动: [所有行动]
- 最终盈亏: [数值]

【对手信息】
- 主要对手昵称: [昵称]
- 手牌: [两张牌，如已知]
- 统计数据: 手数[x] / 入局率[x%] / 胜率[x%] / 摊牌率[x%]

【公共牌】
- 翻牌(Flop): [三张牌]
- 转牌(Turn): [一张牌]  
- 河牌(River): [一张牌]
```

### 步骤2️⃣ 对手类型判断

根据对手数据判断类型：
- **松凶(LAG)**: 入局率>35%, 摊牌率<20%
- **松被动(LP)**: 入局率>40%, 高摊牌率
- **紧凶(TAG)**: 入局率<25%, 低摊牌率
- **紧被动(TP)**: 入局率<25%, 高摊牌率
- **鱼(Fish)**: 入局率>45%, 各种非常规数据

手数参考：
- <100手：数据参考价值低
- 100-500手：可以初步参考
- >500手：数据较为可靠

### 步骤3️⃣ 逐街详细分析

**翻前 (Preflop)**
- {username}的起手牌在当前位置的强度（参考GTO范围）
- 翻前行动是否正确？加注尺寸是否合理？
- 面对对手的行动（3bet/cold call等）如何应对？
- 考虑到对手类型，是否需要调整？

**翻牌 (Flop)**
- 牌面结构分析（干燥/湿润/连接/彩虹）
- {username}在这个牌面的范围优势/劣势
- 下注/过牌/加注的选择是否正确？
- 下注尺寸是否合理？（1/3pot, 1/2pot, 2/3pot, pot+）

**转牌 (Turn)**
- 转牌对双方范围的影响
- SPR（筹码底池比）分析
- 是继续价值下注还是底池控制？
- 行动线是否合理？

**河牌 (River)**
- 河牌完成了哪些听牌？
- 价值下注 vs 诈唬 vs 过牌的选择
- 下注尺寸的考量
- 面对对手行动的应对

### 步骤4️⃣ 关键决策点 EV 分析

找出本手牌1-2个最关键的决策点：
- 指出当时的情况
- 分析{username}的选择
- 给出GTO/剥削性打法的建议
- 估算EV损失（如有）

### 步骤5️⃣ 保险决策分析（如适用）

如果涉及保险：
- 买保险的时机是否正确？
- 保险的期望值分析
- 建议是否购买

### 步骤6️⃣ 总结与评分

**整体评价**: [优秀/良好/一般/需改进]

**主要问题**:
1. [问题1]
2. [问题2]

**改进建议**:
1. [建议1]
2. [建议2]

**最终评分**: X/10

**一句话总结**: [简洁的总结这手牌的核心问题或亮点]

---

## 输出格式要求
- 使用清晰的层级结构和emoji标记
- 重要信息用 **粗体** 标注
- 数字和金额用精确数值
- 明确给出"正确"或"错误"的判断
- 如果信息不完整或无法识别，请明确说明

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
    
    def send_json_response(self, status_code, data):
        """统一的JSON响应发送方法"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def parse_image_data(self, image_str):
        """安全解析图片数据"""
        try:
            if not image_str:
                return None, None
            
            if ',' in image_str and ';base64,' in image_str:
                # 标准 data URL 格式
                header, data = image_str.split(',', 1)
                mime_type = header.split(':')[1].split(';')[0]
                return mime_type, data
            elif ',' in image_str:
                # 简化格式
                parts = image_str.split(',', 1)
                if len(parts) == 2:
                    return 'image/jpeg', parts[1]
            
            # 假设是纯base64
            return 'image/jpeg', image_str
        except Exception as e:
            print(f"⚠️ 图片解析警告: {e}")
            return 'image/jpeg', image_str
    
    def handle_analyze(self):
        """处理手牌分析请求"""
        try:
            # 检查请求大小
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > MAX_CONTENT_LENGTH:
                self.send_json_response(413, {
                    "success": False,
                    "error": f"请求太大，最大允许 {MAX_CONTENT_LENGTH // 1024 // 1024}MB"
                })
                return
            
            # 读取请求体
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 提取参数
            hand_image = data.get('handImage', '')
            opponent_image = data.get('opponentImage', '')
            username = data.get('username', 'luckywm')
            stack_depth = data.get('stackDepth', '200-300')
            is_short_stack = data.get('isShortStack', False)
            opponent_stack = data.get('opponentStack', '')
            
            # 新增：输入模式和手动输入数据
            hand_mode = data.get('handMode', 'image')
            opponent_mode = data.get('opponentMode', 'image')
            manual_hand_text = data.get('manualHandText', '')
            manual_opponent_text = data.get('manualOpponentText', '')
            
            print(f"\n{'='*50}")
            print(f"📥 收到分析请求")
            print(f"   用户: {username}")
            print(f"   筹码: {stack_depth} BB")
            print(f"   输入模式: 手牌={hand_mode}, 对手={opponent_mode}")
            print(f"   短码对手: {'是 (' + opponent_stack + 'BB)' if is_short_stack else '否'}")
            
            # 验证输入（根据模式）
            if hand_mode == 'image' and not hand_image:
                self.send_json_response(400, {
                    "success": False,
                    "error": "请上传手牌截图或切换到手动输入模式"
                })
                return
            
            if opponent_mode == 'image' and not opponent_image:
                self.send_json_response(400, {
                    "success": False,
                    "error": "请上传对手数据截图或切换到手动输入模式"
                })
                return
            
            if hand_mode == 'manual' and not manual_hand_text:
                self.send_json_response(400, {
                    "success": False,
                    "error": "请输入手牌信息"
                })
                return
            
            if opponent_mode == 'manual' and not manual_opponent_text:
                self.send_json_response(400, {
                    "success": False,
                    "error": "请输入对手数据"
                })
                return
            
            # 构建提示词（支持多种输入模式）
            prompt = build_prompt(
                username=username,
                stack_depth=stack_depth,
                is_short_stack=is_short_stack,
                opponent_stack=opponent_stack,
                hand_mode=hand_mode,
                opponent_mode=opponent_mode,
                manual_hand_text=manual_hand_text,
                manual_opponent_text=manual_opponent_text
            )
            
            # 准备Gemini API请求
            parts = [{"text": prompt}]
            
            # 添加手牌图片（仅在图片模式时）
            if hand_mode == 'image' and hand_image:
                mime_type, image_data = self.parse_image_data(hand_image)
                if image_data:
                    parts.append({
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_data
                        }
                    })
                    print(f"   ✅ 手牌图片已添加 ({mime_type})")
            else:
                print(f"   📝 手牌信息: 手动输入")
            
            # 添加对手数据图片（仅在图片模式时）
            if opponent_mode == 'image' and opponent_image:
                mime_type, image_data = self.parse_image_data(opponent_image)
                if image_data:
                    parts.append({
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_data
                        }
                    })
                    print(f"   ✅ 对手数据图片已添加 ({mime_type})")
            else:
                print(f"   📝 对手数据: 手动输入")
            
            # 调用Gemini API
            print(f"\n🚀 调用 Gemini API (代理: {PROXY})...")
            
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
            
            try:
                response = requests.post(
                    API_URL,
                    headers={'Content-Type': 'application/json'},
                    json=payload,
                    proxies=proxies,
                    timeout=120
                )
            except requests.exceptions.Timeout:
                print("❌ API请求超时")
                self.send_json_response(504, {
                    "success": False,
                    "error": "API请求超时，请重试"
                })
                return
            except requests.exceptions.ProxyError:
                print("❌ 代理连接失败")
                self.send_json_response(502, {
                    "success": False,
                    "error": "代理连接失败，请检查VPN/代理是否开启"
                })
                return
            
            if response.status_code == 200:
                try:
                    result = response.json()
                    text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    
                    if not text:
                        # 检查是否被安全过滤
                        block_reason = result.get('candidates', [{}])[0].get('finishReason', '')
                        if block_reason == 'SAFETY':
                            text = "⚠️ 内容被安全过滤，请尝试重新提交。"
                        else:
                            text = "⚠️ 未能获取分析结果，请重试。"
                    
                    print("✅ 分析完成!")
                    print(f"   响应长度: {len(text)} 字符")
                    
                    self.send_json_response(200, {
                        "success": True,
                        "result": text
                    })
                except json.JSONDecodeError:
                    print(f"❌ API返回非JSON格式: {response.text[:200]}")
                    self.send_json_response(500, {
                        "success": False,
                        "error": "API返回格式错误"
                    })
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', {}).get('message', str(error_data))
                except:
                    error_msg = response.text[:500]
                
                print(f"❌ API错误 ({response.status_code}): {error_msg}")
                self.send_json_response(response.status_code, {
                    "success": False,
                    "error": error_msg
                })
                
        except json.JSONDecodeError as e:
            print(f"❌ JSON解析错误: {e}")
            self.send_json_response(400, {
                "success": False,
                "error": "请求数据格式错误"
            })
        except Exception as e:
            print(f"❌ 处理错误: {e}")
            import traceback
            traceback.print_exc()
            
            self.send_json_response(500, {
                "success": False,
                "error": f"服务器内部错误: {str(e)}"
            })
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        if '/api/' in str(args[0]):
            return  # API请求已经有自定义日志
        print(f"📄 {args[0]}")


class ReusableTCPServer(socketserver.TCPServer):
    """可重用端口的TCP服务器"""
    allow_reuse_address = True


def is_port_in_use(port):
    """检查端口是否被占用"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0


def open_browser():
    """延迟打开浏览器"""
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}/quick_review.html')


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("🃏 德州扑克快速复盘工具 - 本地服务器 v2.2")
    print("=" * 60)
    
    # 检查API密钥来源
    if os.environ.get('GEMINI_API_KEY'):
        print("\n✅ 使用环境变量中的 Gemini API Key")
    else:
        print("\n✅ 使用内置混淆的 Gemini API Key（开箱即用）")
        print("   💡 如需自定义，可设置环境变量：")
        print("      Windows: $env:GEMINI_API_KEY = \"你的密钥\"")
        print("      Linux/Mac: export GEMINI_API_KEY=\"你的密钥\"")
    
    # 检查端口
    if is_port_in_use(PORT):
        print(f"\n⚠️ 端口 {PORT} 已被占用!")
        print(f"   可能服务器已在运行，请访问: http://localhost:{PORT}/quick_review.html")
        print(f"   或者关闭占用端口的程序后重试")
        
        # 尝试打开浏览器
        webbrowser.open(f'http://localhost:{PORT}/quick_review.html')
        return
    
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
    
    # 启动HTTP服务器（使用可重用端口）
    try:
        with ReusableTCPServer(("", PORT), QuickReviewHandler) as httpd:
            print(f"✅ 服务器已启动: http://localhost:{PORT}")
            print("📱 浏览器将自动打开...")
            print("\n按 Ctrl+C 停止服务器\n")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n👋 服务器已停止")
    except OSError as e:
        print(f"\n❌ 服务器启动失败: {e}")
        print("   请检查端口是否被占用")


if __name__ == "__main__":
    main()
