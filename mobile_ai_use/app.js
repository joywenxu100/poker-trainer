// API密钥管理
const API_KEYS = {
    claude: '',
    gemini: '',
    deepseek: ''
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

// 加载设置
function loadSettings() {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
        const keys = JSON.parse(savedKeys);
        API_KEYS.claude = keys.claude || '';
        API_KEYS.gemini = keys.gemini || '';
        API_KEYS.deepseek = keys.deepseek || '';
        
        document.getElementById('claudeKey').value = API_KEYS.claude;
        document.getElementById('geminiKey').value = API_KEYS.gemini;
        document.getElementById('deepseekKey').value = API_KEYS.deepseek;
    }
}

// 保存设置
function saveSettings() {
    API_KEYS.claude = document.getElementById('claudeKey').value.trim();
    API_KEYS.gemini = document.getElementById('geminiKey').value.trim();
    API_KEYS.deepseek = document.getElementById('deepseekKey').value.trim();
    
    localStorage.setItem('apiKeys', JSON.stringify(API_KEYS));
    alert('✅ API密钥已保存！');
    closeSettings();
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
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('imagePreview');
                preview.src = e.target.result;
                preview.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);

    // 回车提交（Ctrl+Enter）
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSubmit();
        }
    });

    // 点击模态框外部关闭
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
            closeSettings();
        }
    });
}

// 处理提交
async function handleSubmit() {
    const question = document.getElementById('questionInput').value.trim();
    const imageInput = document.getElementById('imageInput');
    const imageFile = imageInput.files[0];

    // 验证输入
    if (!question && !imageFile) {
        alert('⚠️ 请输入问题或上传图片！');
        return;
    }

    // 验证API密钥
    if (!API_KEYS.claude && !API_KEYS.gemini && !API_KEYS.deepseek) {
        alert('⚠️ 请先设置至少一个API密钥！');
        openSettings();
        return;
    }

    // 显示加载状态
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('loading').classList.add('show');
    document.getElementById('results').innerHTML = '';

    // 处理图片（转base64）
    let imageBase64 = null;
    if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
    }

    // 同时调用三个模型
    const promises = [];
    
    if (API_KEYS.claude) {
        promises.push(callClaude(question, imageBase64));
    }
    
    if (API_KEYS.gemini) {
        promises.push(callGemini(question, imageBase64));
    }
    
    if (API_KEYS.deepseek) {
        promises.push(callDeepSeek(question, imageBase64));
    }

    // 等待所有结果
    const results = await Promise.allSettled(promises);

    // 隐藏加载状态
    document.getElementById('loading').classList.remove('show');
    document.getElementById('submitBtn').disabled = false;

    // 显示结果
    displayResults(results);
}

// 文件转Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 调用Claude API
async function callClaude(question, imageBase64) {
    try {
        const messages = [];
        const content = [];

        if (imageBase64) {
            // 提取实际的base64数据和媒体类型
            const [mediaType, base64Data] = imageBase64.split(',');
            const mimeType = mediaType.match(/:(.*?);/)[1];
            
            content.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: mimeType,
                    data: base64Data
                }
            });
        }

        if (question) {
            content.push({
                type: 'text',
                text: question
            });
        }

        messages.push({
            role: 'user',
            content: content
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEYS.claude,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: messages
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }

        const data = await response.json();
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
            error: error.message
        };
    }
}

// 调用Gemini API
async function callGemini(question, imageBase64) {
    try {
        const parts = [];

        if (question) {
            parts.push({ text: question });
        }

        if (imageBase64) {
            // 提取base64数据
            const base64Data = imageBase64.split(',')[1];
            const mimeType = imageBase64.match(/:(.*?);/)[1];
            
            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                }
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEYS.gemini}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: parts
                    }]
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts) {
            return {
                model: 'Gemini',
                icon: 'gemini',
                success: true,
                content: data.candidates[0].content.parts[0].text
            };
        } else {
            throw new Error('返回格式异常');
        }
    } catch (error) {
        return {
            model: 'Gemini',
            icon: 'gemini',
            success: false,
            error: error.message
        };
    }
}

// 调用DeepSeek API
async function callDeepSeek(question, imageBase64) {
    try {
        const messages = [];
        
        if (imageBase64) {
            // DeepSeek-VL 支持多模态
            messages.push({
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageBase64
                        }
                    },
                    {
                        type: 'text',
                        text: question || '请描述这张图片'
                    }
                ]
            });
        } else {
            messages.push({
                role: 'user',
                content: question
            });
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.deepseek}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || '请求失败');
        }

        const data = await response.json();
        return {
            model: 'DeepSeek',
            icon: 'deepseek',
            success: true,
            content: data.choices[0].message.content
        };
    } catch (error) {
        return {
            model: 'DeepSeek',
            icon: 'deepseek',
            success: false,
            error: error.message
        };
    }
}

// 显示结果
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    
    results.forEach(result => {
        const data = result.value;
        const resultDiv = document.createElement('div');
        resultDiv.className = 'model-result';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'model-header';

        const iconDiv = document.createElement('div');
        iconDiv.className = `model-icon ${data.icon}`;
        iconDiv.textContent = data.model[0];

        const infoDiv = document.createElement('div');
        infoDiv.className = 'model-info';
        
        const nameH3 = document.createElement('h3');
        nameH3.textContent = data.model;
        
        const statusDiv = document.createElement('div');
        statusDiv.className = data.success ? 'status success' : 'status error';
        statusDiv.textContent = data.success ? '✓ 回答成功' : '✗ 请求失败';

        infoDiv.appendChild(nameH3);
        infoDiv.appendChild(statusDiv);
        headerDiv.appendChild(iconDiv);
        headerDiv.appendChild(infoDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'model-content';

        if (data.success) {
            contentDiv.textContent = data.content;
        } else {
            contentDiv.innerHTML = `<div class="error-message">❌ ${data.error}</div>`;
        }

        resultDiv.appendChild(headerDiv);
        resultDiv.appendChild(contentDiv);
        resultsContainer.appendChild(resultDiv);
    });
}

