# -*- coding: utf-8 -*-
"""
测试本地服务器API
"""
import requests
import base64
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

def test_server():
    """测试服务器API"""
    print("=" * 50)
    print("🧪 测试本地服务器 API")
    print("=" * 50)
    
    # 检查图片文件
    test_image = "ea76ae9a3ae2b0b8cacdc38317086382.jpg"
    
    if not os.path.exists(test_image):
        print(f"⚠️ 找不到测试图片 {test_image}")
        # 使用一个简单的占位图片
        hand_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        opponent_image = hand_image
    else:
        print(f"📷 使用测试图片: {test_image}")
        with open(test_image, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        hand_image = f"data:image/jpeg;base64,{image_data}"
        opponent_image = hand_image
    
    # 构建请求数据
    payload = {
        "handImage": hand_image,
        "opponentImage": opponent_image,
        "username": "luckywm",
        "stackDepth": "200-300",
        "isShortStack": False,
        "opponentStack": ""
    }
    
    print("\n📤 发送测试请求到 http://localhost:8899/api/analyze")
    print("   (这可能需要30-60秒...)\n")
    
    try:
        response = requests.post(
            "http://localhost:8899/api/analyze",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=120
        )
        
        data = response.json()
        
        if data.get('success'):
            print("✅ API 测试成功!")
            print("\n" + "=" * 50)
            print("📊 AI 分析结果预览:")
            print("=" * 50)
            result = data.get('result', '')[:500]
            print(result)
            if len(data.get('result', '')) > 500:
                print("\n... (结果已截断)")
        else:
            print(f"❌ API 返回错误: {data.get('error')}")
            
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接服务器")
        print("   请确保 quick_review_server.py 正在运行")
    except Exception as e:
        print(f"❌ 测试失败: {e}")

if __name__ == "__main__":
    test_server()

