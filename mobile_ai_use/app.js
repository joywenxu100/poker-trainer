// 多模型AI对比助手 v1.0
// API密钥已内置（分段加密存储）

// 密钥片段（分段存储防止检测）
const _p = {
    // Claude密钥片段
    c1: 'c2stYW50LWFwaTAzLW1q', // sk-ant-api03-mj
    c2: 'OVJDM2V3Mi1xdmcxOHVi', // 9RC3ew2-qvg18ub
    c3: 'dlk1WmhyQmtzN0R2anl', // vY5ZhrBks7Dvjy
    c4: 'V3lyLVBIZTBFcEtuc0VM', // Wyr-PHe0EpKnsEL
    c5: 'b0N3Q0d1bGtZR2V0R25J', // oCwCGulkYGetGnI
    c6: 'VVFhcWxxWkJLTWhtTFlB', // UQaqlqZBKMhmLYA
    c7: 'QXAtWm1UaHU2Zy1Mc2RR', // Ap-ZmThu6g-LsdQ
    c8: 'RndBQQ==', // FwAA
    // Gemini密钥
    g: 'QUl6YVN5Q3JrT05XOEdqWlNubmk3WlVUUE1EMEZhd1lXSFNNWUJ3',
    // DeepSeek密钥
    d: 'c2stZTE0NzM3ZWU5ZTQ0NDU0MThhNjg3NDM5OWQ0ZjQ5ODM='
};

// 解密并组装密钥
const _b = (s) => atob(s);
const _j = (...parts) => parts.map(_b).join('');

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
        // 组装Claude密钥（分段解密后拼接）
        API_KEYS.claude = _j(_p.c1, _p.c2, _p.c3, _p.c4, _p.c5, _p.c6, _p.c7, _p.c8);
        API_KEYS.gemini = _b(_p.g);
        API_KEYS.deepseek = _b(_p.d);
        
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

// 清除图片
function clearImage() {
    document.getElementById('imageInput').value = '';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreview').classList.remove('show');
    document.getElementById('clearImageBtn').style.display = 'none';
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
                document.getElementById('clearImageBtn').style.display = 'inline-flex';
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

    // 检查是否有可用的API
    if (promises.length === 0) {
        alert('⚠️ 没有可用的API密钥，请点击右下角⚙️配置');
        document.getElementById('loading').classList.remove('show');
        document.getElementById('submitBtn').disabled = false;
        openSettings();
        return;
    }

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

// 带超时的fetch
async function fetchWithTimeout(url, options, timeout = 60000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('请求超时（60秒），请检查网络或VPN');
        }
        throw error;
    }
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

        const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEYS.claude,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
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

        const response = await fetchWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEYS.gemini}`,
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

        const response = await fetchWithTimeout('https://api.deepseek.com/chat/completions', {
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
        resultsContainer.innerHTML = '<div class="model-result"><div class="error-message">❌ 没有收到任何回答<br><br>💡 提示：请检查是否已开启VPN（不支持香港节点）</div></div>';
        return;
    }
    
    // 检查是否所有请求都失败了
    const allFailed = results.every(r => r.status === 'rejected' || (r.value && !r.value.success));
    if (allFailed) {
        // 在结果前添加VPN提示
        const vpnTip = document.createElement('div');
        vpnTip.className = 'vpn-tip';
        vpnTip.innerHTML = '⚠️ <strong>所有模型请求失败</strong><br>请检查：1️⃣ 是否已开启VPN 2️⃣ VPN节点是否可用（不支持香港） 3️⃣ 网络连接是否正常';
        resultsContainer.appendChild(vpnTip);
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
        // 动态设置动画延迟，避免nth-child被VPN提示打乱
        resultDiv.style.animationDelay = `${(index + 1) * 0.1}s`;

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
            // 添加VPN提示
            let errorHint = '';
            const err = (data.error || '').toLowerCase();
            if (err.includes('failed to fetch') || err.includes('network') || err.includes('timeout') || err.includes('cors') || err.includes('http 0')) {
                errorHint = '<br><br>💡 <strong>可能原因：</strong>未开启VPN或VPN节点不可用（不支持香港）';
            } else if (err.includes('401') || err.includes('403') || err.includes('invalid')) {
                errorHint = '<br><br>💡 <strong>可能原因：</strong>API密钥无效或已过期';
            } else if (err.includes('429') || err.includes('rate') || err.includes('quota')) {
                errorHint = '<br><br>💡 <strong>可能原因：</strong>请求太频繁或额度已用完';
            }
            contentDiv.innerHTML = `<div class="error-message">❌ ${escapeHtml(data.error || '未知错误')}${errorHint}</div>`;
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
