# -*- coding: utf-8 -*-
"""
测试 Gemini API 连接 - 支持代理
"""
import requests
import base64
import json
import sys
import socket

# 设置输出编码
sys.stdout.reconfigure(encoding='utf-8')

# 从环境变量读取API密钥（更安全）
import os
API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyBLZq8uTf6FKlsC1_K9VNqnriuXgjXG-bQ')
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}'

# 常见代理配置 (端口, 协议类型)
PROXY_CONFIGS = [
    (7890, "http"),      # Clash HTTP
    (7891, "http"),      # Clash HTTP Alt
    (10809, "http"),     # V2Ray HTTP
    (10808, "socks5"),   # V2Ray SOCKS
    (1080, "socks5"),    # 通用SOCKS
    (1081, "http"),      # 通用HTTP Alt
    (8080, "http"),      # 常见HTTP
    (8118, "http"),      # Privoxy
    (2080, "http"),      # 备用
    (2081, "http"),      # 备用
]

def check_port(port):
    """检查端口是否开放"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result == 0

def find_proxies():
    """自动检测本地代理"""
    print("🔍 检测本地代理端口...")
    found = []
    for port, proto in PROXY_CONFIGS:
        if check_port(port):
            proxy_url = f"{proto}://127.0.0.1:{port}"
            print(f"  ✅ 发现开放端口: {port} ({proto})")
            found.append(proxy_url)
    return found

def test_api(proxy=None):
    """测试API基本连接"""
    print(f"\n🔗 测试连接" + (f" [代理: {proxy}]" if proxy else " [直连]"))
    
    # 简单的文本测试
    payload = {
        "contents": [{
            "parts": [{
                "text": "请用中文回答：1+1等于几？只回答数字。"
            }]
        }],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 100
        }
    }
    
    proxies = {"http": proxy, "https": proxy} if proxy else None
    
    try:
        response = requests.post(
            API_URL,
            headers={'Content-Type': 'application/json'},
            json=payload,
            proxies=proxies,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            result = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            print(f"  ✅ 成功! AI回复: {result.strip()}")
            return True, proxy
        else:
            error = response.json().get('error', {}).get('message', response.text[:200])
            print(f"  ❌ API错误: {error}")
            return False, None
            
    except requests.exceptions.ProxyError as e:
        print(f"  ❌ 代理错误: 无法通过此代理连接")
        return False, None
    except requests.exceptions.ConnectTimeout:
        print(f"  ❌ 连接超时")
        return False, None
    except Exception as e:
        print(f"  ❌ 请求失败: {type(e).__name__}")
        return False, None

def test_image_analysis(proxy=None):
    """测试图片分析能力"""
    print("\n" + "=" * 50)
    print("🖼️ 测试 Gemini 图片分析能力...")
    print("=" * 50)
    
    # 检查是否有测试图片
    import os
    test_image = "ea76ae9a3ae2b0b8cacdc38317086382.jpg"
    
    if not os.path.exists(test_image):
        print(f"⚠️ 找不到测试图片 {test_image}")
        print("跳过图片测试")
        return True
    
    print(f"📷 读取测试图片: {test_image}")
    
    # 读取图片
    with open(test_image, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    payload = {
        "contents": [{
            "parts": [
                {"text": "请简单描述这张图片的内容，用中文回答，不超过100字。"},
                {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": image_data
                    }
                }
            ]
        }],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 200
        }
    }
    
    proxies = {"http": proxy, "https": proxy} if proxy else None
    
    try:
        print("⏳ 发送图片分析请求...")
        response = requests.post(
            API_URL,
            headers={'Content-Type': 'application/json'},
            json=payload,
            proxies=proxies,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            result = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            print(f"✅ 图片分析成功!")
            print(f"AI描述: {result}")
            return True
        else:
            print(f"❌ 图片分析失败: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return False

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("🚀 Gemini API 测试")
    print("=" * 50)
    
    # 自动检测代理
    proxies = find_proxies()
    
    working_proxy = None
    
    # 先尝试直连
    print("\n📡 尝试直连...")
    success, _ = test_api(None)
    
    if success:
        working_proxy = None
        print("\n✅ 直连成功!")
    else:
        # 尝试检测到的代理
        if proxies:
            print(f"\n📡 尝试 {len(proxies)} 个代理配置...")
            for proxy in proxies:
                success, p = test_api(proxy)
                if success:
                    working_proxy = p
                    break
        
        # 如果还没成功，尝试所有常见配置
        if not success:
            print("\n📡 尝试所有常见代理配置...")
            for port, proto in PROXY_CONFIGS:
                proxy = f"{proto}://127.0.0.1:{port}"
                if proxy not in proxies:  # 跳过已尝试的
                    success, p = test_api(proxy)
                    if success:
                        working_proxy = p
                        break
    
    # 测试图片分析
    if success:
        print(f"\n🎉 找到可用连接方式: {working_proxy if working_proxy else '直连'}")
        test_image_analysis(working_proxy)
        
        if working_proxy:
            print("\n" + "=" * 50)
            print("💡 请在HTML工具中配置代理:")
            print(f"   代理地址: {working_proxy}")
            print("=" * 50)
    else:
        print("\n" + "=" * 50)
        print("❌ 所有测试失败!")
        print("=" * 50)
        print("\n💡 解决方案:")
        print("  1. 确保代理软件(Clash/V2Ray)已开启")
        print("  2. 开启系统代理或TUN模式")
        print("  3. 或手动设置环境变量后重试:")
        print("     $env:HTTPS_PROXY = 'http://127.0.0.1:7890'")
        print("     python test_gemini.py")
    
    print("\n测试完成!")
