// 本地API密钥配置文件 - 此文件不会上传到GitHub
// ⚠️ 请勿分享此文件！

const LOCAL_API_KEYS = {
    // Claude API Key（注意：标准格式应为 sk-ant-api03-...）
    // 如果调用失败，请检查key格式是否正确
    claude: 'key_d9afb18c0e4324accf81e3da1842f1a22ee43da2a20c99611f9950cbce0bd9e5',
    
    // Gemini API Key（格式：AIza...）
    gemini: 'AIzaSyCrkONW8GjZSnni7ZUTPMD0FawYWHSMYBw',
    
    // DeepSeek API Key（格式：sk-...）
    deepseek: 'sk-e14737ee9e4445418a6874399d4f4983'
};

// 自动加载到localStorage
(function() {
    try {
        // 始终更新，确保使用最新的密钥
        localStorage.setItem('apiKeys', JSON.stringify(LOCAL_API_KEYS));
        console.log('✅ API密钥已自动配置');
        console.log('📝 已配置的模型:');
        if (LOCAL_API_KEYS.claude) console.log('  - Claude');
        if (LOCAL_API_KEYS.gemini) console.log('  - Gemini');
        if (LOCAL_API_KEYS.deepseek) console.log('  - DeepSeek');
    } catch (e) {
        console.error('❌ API密钥配置失败:', e);
    }
})();
