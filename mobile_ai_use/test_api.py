# 测试OpenRouter API
import requests
import json

# OpenRouter API Key
API_KEY = "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"

def test_gemini():
    print("=" * 50)
    print("测试 Gemini 2.5 Flash")
    print("=" * 50)
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "https://joywenxu100.github.io/poker-trainer/",
        "X-Title": "Test"
    }
    
    data = {
        "model": "google/gemini-3-pro-preview",
        "max_tokens": 16384,
        "messages": [{
            "role": "user",
            "content": "你扮演德州扑克锦标赛冠军，教我怎么打好锦标赛"
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=120)
        print(f"状态码: {response.status_code}")
        
        result = response.json()
        
        print(f"\n完整返回数据: {json.dumps(result, indent=2, ensure_ascii=False)[:2000]}")
        
        if response.ok:
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            print(f"\n回答长度: {len(content)} 字符")
            print(f"\n回答内容:\n{content}")
            
            # 检查是否被截断
            usage = result.get("usage", {})
            print(f"\n使用情况:")
            print(f"  输入tokens: {usage.get('prompt_tokens', 'N/A')}")
            print(f"  输出tokens: {usage.get('completion_tokens', 'N/A')}")
            print(f"  总tokens: {usage.get('total_tokens', 'N/A')}")
            
            # 检查finish_reason
            finish_reason = result.get("choices", [{}])[0].get("finish_reason", "")
            print(f"  结束原因: {finish_reason}")
            
            if finish_reason == "length":
                print("\n⚠️ 警告: 回答因达到max_tokens限制而被截断!")
            elif finish_reason == "stop":
                print("\n✅ 回答完整结束")
        else:
            print(f"错误: {json.dumps(result, indent=2, ensure_ascii=False)}")
            
    except Exception as e:
        print(f"请求失败: {e}")

def test_claude():
    print("\n" + "=" * 50)
    print("测试 Claude Sonnet 4")
    print("=" * 50)
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "https://joywenxu100.github.io/poker-trainer/",
        "X-Title": "Test"
    }
    
    data = {
        "model": "anthropic/claude-sonnet-4",
        "max_tokens": 16384,
        "messages": [{
            "role": "user",
            "content": "你扮演德州扑克锦标赛冠军，教我怎么打好锦标赛"
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=120)
        print(f"状态码: {response.status_code}")
        
        result = response.json()
        
        if response.ok:
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            print(f"\n回答长度: {len(content)} 字符")
            print(f"\n回答内容:\n{content[:500]}...")  # 只显示前500字符
            
            usage = result.get("usage", {})
            print(f"\n使用情况:")
            print(f"  输入tokens: {usage.get('prompt_tokens', 'N/A')}")
            print(f"  输出tokens: {usage.get('completion_tokens', 'N/A')}")
            print(f"  总tokens: {usage.get('total_tokens', 'N/A')}")
            
            finish_reason = result.get("choices", [{}])[0].get("finish_reason", "")
            print(f"  结束原因: {finish_reason}")
            
            if finish_reason == "length":
                print("\n⚠️ 警告: 回答因达到max_tokens限制而被截断!")
            elif finish_reason == "stop":
                print("\n✅ 回答完整结束")
        else:
            print(f"错误: {json.dumps(result, indent=2, ensure_ascii=False)}")
            
    except Exception as e:
        print(f"请求失败: {e}")

if __name__ == "__main__":
    test_gemini()
    test_claude()

