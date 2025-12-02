# -*- coding: utf-8 -*-
"""
测试 OpenRouter API 连接
"""
import requests
import json
import time
import sys

# 设置输出编码
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# OpenRouter API配置
api_key = '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'
api_url = 'https://openrouter.ai/api/v1/chat/completions'

print('=' * 60)
print('🔍 测试 OpenRouter API 连接...')
print('=' * 60)

# 测试: API调用
print('\n📡 测试API连接...')
try:
    start_time = time.time()
    response = requests.post(
        api_url,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
            'HTTP-Referer': 'https://joywenxu100.github.io/poker-trainer',
            'X-Title': 'Texas Poker Quick Review'
        },
        json={
            'model': 'google/gemini-2.0-flash-exp:free',
            'messages': [
                {'role': 'user', 'content': 'Say "Hello" in Chinese (one word only)'}
            ],
            'max_tokens': 50
        },
        timeout=30
    )
    elapsed = time.time() - start_time
    
    print(f'✅ 连接成功！响应时间: {elapsed:.2f}秒')
    print(f'📊 HTTP状态码: {response.status_code}')
    
    if response.status_code == 200:
        data = response.json()
        content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
        model_used = data.get('model', 'unknown')
        
        print(f'\n🤖 AI回复: {content}')
        print(f'📦 使用模型: {model_used}')
        print(f'\n' + '=' * 60)
        print('✅ OpenRouter API 完全正常！')
        print('✅ 国内可以直接访问，无需VPN！')
        print('✅ 免费Gemini模型可用！')
        print('=' * 60)
    else:
        print(f'\n⚠️ API返回错误:')
        print(response.text[:500])
        
except requests.exceptions.Timeout:
    print('❌ 连接超时（30秒）')
    print('   可能原因: 网络不稳定或防火墙拦截')
except requests.exceptions.ConnectionError as e:
    print(f'❌ 连接失败: 无法连接到OpenRouter服务器')
    print(f'   这可能说明: 1) 需要VPN  2) 网络问题  3) 防火墙拦截')
except Exception as e:
    print(f'❌ 发生错误: {str(e)}')
    import traceback
    traceback.print_exc()

print('\n测试完成！')

