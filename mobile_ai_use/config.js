// 配置文件 - 可根据需要调整API参数

const CONFIG = {
    // Claude配置
    claude: {
        apiUrl: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 2000,
        apiVersion: '2023-06-01'
    },
    
    // Gemini配置
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        model: 'gemini-2.0-flash-exp'
    },
    
    // DeepSeek配置
    deepseek: {
        apiUrl: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        maxTokens: 2000
    },
    
    // 应用配置
    app: {
        timeout: 60000, // 请求超时时间(毫秒)
        maxImageSize: 5 * 1024 * 1024, // 最大图片大小5MB
        supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
};

// 导出配置（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

