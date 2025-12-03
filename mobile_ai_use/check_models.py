# 查询OpenRouter可用的Google模型
import requests

API_KEY = "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"

url = "https://openrouter.ai/api/v1/models"
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(url, headers=headers)
models = response.json().get("data", [])

print("可用的Google/Gemini模型:")
print("=" * 60)
for model in models:
    model_id = model.get("id", "")
    if "google" in model_id.lower() or "gemini" in model_id.lower():
        print(f"  {model_id}")

