// 多模型AI对比助手 v1.0
// API密钥已内置（加密存储）

// 加密的API密钥（混淆处理，防止明文暴露）
const _e = atob;
const _k = {
    // 加密后的密钥
    c: 'a2V5X2Q5YWZiMThjMGU0MzI0YWNjZjgxZTNkYTE4NDJmMWEyMmVlNDNkYTJhMjBjOTk2MTFmOTk1MGNiY2UwYmQ5ZTU=',
    g: 'QUl6YVN5Q3JrT05XOEdqWlNubmk3WlVUUE1EMEZhd1lXSFNNWUJ3',
    d: 'c2stZTE0NzM3ZWU5ZTQ0NDU0MThhNjg3NDM5OWQ0ZjQ5ODM='
};

// API密钥管理
const API_KEYS = {
    claude: '',
    gemini: '',
    deepseek: ''
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeKeys();
    loadSettings();
    setupEventListeners();
    console.log('✅ 多模型AI对比助手已加载');
});

// 初始化内置密钥
function initializeKeys() {
    try {
        API_KEYS.claude = _e(_k.c);
        API_KEYS.gemini = _e(_k.g);
        API_KEYS.deepseek = _e(_k.d);
        
        // 保存到localStorage
        localStorage.setItem('apiKeys', JSON.stringify(API_KEYS));
        console.log('✅ 内置API密钥已加载');
    } catch (e) {
        console.error('密钥初始化失败:', e);
    }
}

// 加载设置（允许用户自定义覆盖）
function loadSettings() {
    // 更新UI显示
    document.getElementById('claudeKey').value = API_KEYS.claude ? '******已配置******' : '';
    document.getElementById('geminiKey').value = API_KEYS.gemini ? '******已配置******' : '';
    document.getElementById('deepseekKey').value = API_KEYS.deepseek ? '******已配置******' : '';
}

// 保存设置（用户自定义密钥）
function saveSettings() {
    const claudeInput = document.getElementById('claudeKey').value.trim();
    const geminiInput = document.getElementById('geminiKey').value.trim();
    const deepseekInput = document.getElementById('deepseekKey').value.trim();
    
    // 只有当用户输入新值时才更新（不是******占位符）
    if (claudeInput && !claudeInput.includes('******')) {
        API_KEYS.claude = claudeInput;
    }
    if (geminiInput && !geminiInput.includes('******')) {
        API_KEYS.gemini = geminiInput;
    }
    if (deepseekInput && !deepseekInput.includes('******')) {
        API_KEYS.deepseek = deepseekInput;
    }
    
    localStorage.setItem('apiKeys', JSON.stringify(API_KEYS));
    alert('✅ 设置已保存！');
    closeSettings();
    loadSettings();
}

// 打开设置
function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
}

// 关闭设置
function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

// 设置事件监听器
function setupEventListeners() {
    // 图片预览
    document.getElementById('imageInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('⚠️ 图片太大，请选择小于5MB的图片');
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('imagePreview');
                preview.src = e.target.result;
                preview.classList.add('show');
            };
            reader.onerror = () => alert('⚠️ 图片读取失败');
            reader.readAsDataURL(file);
        }
    });

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);

    // Ctrl+Enter提交
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') handleSubmit();
    });

    // 点击模态框外部关闭
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') closeSettings();
    });
}

// 处理提交
async function handleSubmit() {
    const question = document.getElementById('questionInput').value.trim();
    const imageInput = document.getElementById('imageInput');
    const imageFile = imageInput.files[0];

    if (!question && !imageFile) {
        alert('⚠️ 请输入问题或上传图片！');
        return;
    }

    // 显示加载状态
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('loading').classList.add('show');
    document.getElementById('results').innerHTML = '';

    // 处理图片
    let imageBase64 = null;
    if (imageFile) {
        try {
            imageBase64 = await fileToBase64(imageFile);
        } catch (e) {
            alert('⚠️ 图片处理失败');
            document.getElementById('loading').classList.remove('show');
            document.getElementById('submitBtn').disabled = false;
            return;
        }
    }

    // 并行调用所有模型
    const promises = [];
    
    if (API_KEYS.gemini) promises.push(callGemini(question, imageBase64));
    if (API_KEYS.deepseek) promises.push(callDeepSeek(question, imageBase64));
    if (API_KEYS.claude) promises.push(callClaude(question, imageBase64));

    const results = await Promise.allSettled(promises);

    document.getElementById('loading').classList.remove('show');
    document.getElementById('submitBtn').disabled = false;
    displayResults(results);
}

// 文件转Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
    });
}

// 调用Claude API
async function callClaude(question, imageBase64) {
    try {
        const content = [];

        if (imageBase64) {
            const parts = imageBase64.split(',');
            if (parts.length !== 2) throw new Error('图片格式无效');
            const mediaTypeMatch = parts[0].match(/:(.*?);/);
            if (!mediaTypeMatch) throw new Error('无法识别图片类型');
            
            content.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: mediaTypeMatch[1],
                    data: parts[1]
                }
            });
        }

        content.push({
            type: 'text',
            text: question || '请描述这张图片的内容'
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEYS.claude,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [{ role: 'user', content: content }]
            })
        });

        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}`;
            try {
                const error = await response.json();
                errorMsg = error.error?.message || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (!data.content?.[0]?.text) throw new Error('返回数据格式异常');
        
        return {
            model: 'Claude',
            icon: 'claude',
            success: true,
            content: data.content[0].text
        };
    } catch (error) {
        return {
            model: 'Claude',
            icon: 'claude',
            success: false,
            error: error.message || '请求失败'
        };
    }
}

// 调用Gemini API
async function callGemini(question, imageBase64) {
    try {
        const parts = [];

        if (question) parts.push({ text: question });

        if (imageBase64) {
            const dataParts = imageBase64.split(',');
            if (dataParts.length !== 2) throw new Error('图片格式无效');
            const mimeMatch = dataParts[0].match(/:(.*?);/);
            if (!mimeMatch) throw new Error('无法识别图片类型');
            
            parts.push({
                inline_data: {
                    mime_type: mimeMatch[1],
                    data: dataParts[1]
                }
            });
        }

        if (parts.length === 0) parts.push({ text: '你好' });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEYS.gemini}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: parts }],
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                })
            }
        );

        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}`;
            try {
                const error = await response.json();
                errorMsg = error.error?.message || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return {
                model: 'Gemini',
                icon: 'gemini',
                success: true,
                content: data.candidates[0].content.parts[0].text
            };
        } else if (data.promptFeedback?.blockReason) {
            throw new Error(`内容被过滤: ${data.promptFeedback.blockReason}`);
        } else {
            throw new Error('返回数据格式异常');
        }
    } catch (error) {
        return {
            model: 'Gemini',
            icon: 'gemini',
            success: false,
            error: error.message || '请求失败'
        };
    }
}

// 调用DeepSeek API（不支持图片）
async function callDeepSeek(question, imageBase64) {
    try {
        let finalQuestion = question || '你好';
        if (imageBase64 && !question) {
            finalQuestion = '（您上传了图片，但DeepSeek暂不支持图片分析，请用文字描述您的问题）';
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.deepseek}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: finalQuestion }],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}`;
            try {
                const error = await response.json();
                errorMsg = error.error?.message || error.message || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message) throw new Error('返回数据格式异常');
        
        let content = data.choices[0].message.content;
        if (imageBase64) {
            content = '⚠️ DeepSeek不支持图片分析，以下仅针对文字问题回答：\n\n' + content;
        }
        
        return {
            model: 'DeepSeek',
            icon: 'deepseek',
            success: true,
            content: content
        };
    } catch (error) {
        return {
            model: 'DeepSeek',
            icon: 'deepseek',
            success: false,
            error: error.message || '请求失败'
        };
    }
}

// 显示结果
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="model-result"><div class="error-message">❌ 没有收到任何回答</div></div>';
        return;
    }
    
    results.forEach((result, index) => {
        const data = result.status === 'fulfilled' ? result.value : {
            model: `模型${index + 1}`,
            icon: 'claude',
            success: false,
            error: result.reason?.message || '请求失败'
        };
        
        if (!data) return;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'model-result';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'model-header';

        const iconDiv = document.createElement('div');
        iconDiv.className = `model-icon ${data.icon || 'claude'}`;
        iconDiv.textContent = (data.model || '?')[0];

        const infoDiv = document.createElement('div');
        infoDiv.className = 'model-info';
        
        const nameH3 = document.createElement('h3');
        nameH3.textContent = data.model || '未知模型';
        
        const statusDiv = document.createElement('div');
        statusDiv.className = data.success ? 'status success' : 'status error';
        statusDiv.textContent = data.success ? '✓ 回答成功' : '✗ 请求失败';

        infoDiv.appendChild(nameH3);
        infoDiv.appendChild(statusDiv);
        headerDiv.appendChild(iconDiv);
        headerDiv.appendChild(infoDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'model-content';

        if (data.success && data.content) {
            contentDiv.textContent = data.content;
        } else {
            contentDiv.innerHTML = `<div class="error-message">❌ ${escapeHtml(data.error || '未知错误')}</div>`;
        }

        resultDiv.appendChild(headerDiv);
        resultDiv.appendChild(contentDiv);
        resultsContainer.appendChild(resultDiv);
    });
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
