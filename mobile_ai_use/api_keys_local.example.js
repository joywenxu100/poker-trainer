// API密钥配置模板
// 使用步骤：
// 1. 复制此文件，重命名为 api_keys_local.js
// 2. 填入你的API密钥
// 3. api_keys_local.js 已在.gitignore中，不会上传到GitHub

const LOCAL_API_KEYS = {
    claude: '在这里填入你的Claude API Key',
    gemini: '在这里填入你的Gemini API Key',
    deepseek: '在这里填入你的DeepSeek API Key'
};

// 自动加载到localStorage
(function() {
    const existingKeys = localStorage.getItem('apiKeys');
    if (!existingKeys) {
        localStorage.setItem('apiKeys', JSON.stringify(LOCAL_API_KEYS));
        console.log('✅ API密钥已自动配置');
    }
})();

