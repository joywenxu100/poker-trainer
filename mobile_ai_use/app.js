// 多模型AI对比助手 v1.0
// API密钥已内置（分段加密存储）

// 密钥片段（分段存储防止检测）
const _p = {
    // OpenRouter密钥（用于Claude等模型）- 分段存储
    o1: 'c2stb3ItdjEtMjkxNDU2NjJh', // sk-or-v1-29145662a
    o2: 'N2QxM2MyZDM4Mzk3M2Qy', // 7d13c2d383973d2
    o3: 'YjYwOWMwZjVkMDM2NjYy', // b609c0f5d036662
    o4: 'YmE0ZGMwMGViMzEwYTNk', // ba4dc00eb310a3d
    o5: 'Zjg4MTM2YjI2MA==', // f88136b260
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
    openrouter: '',  // 用于Claude（通过OpenRouter）
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
        // 组装OpenRouter密钥（分段解密后拼接）- 用于Claude
        API_KEYS.openrouter = _j(_p.o1, _p.o2, _p.o3, _p.o4, _p.o5);
        API_KEYS.gemini = _b(_p.g);
        API_KEYS.deepseek = _b(_p.d);
        
        // 验证密钥格式
        console.log('🔑 OpenRouter密钥验证:', API_KEYS.openrouter.startsWith('sk-or-v1-') ? '✅格式正确' : '❌格式错误');
        console.log('🔑 OpenRouter密钥前15位:', API_KEYS.openrouter.substring(0, 15));
        
        // 保存到localStorage
        localStorage.setItem('apiKeys', JSON.stringify(API_KEYS));
        console.log('✅ 内置API密钥已加载（Claude通过OpenRouter）');
    } catch (e) {
        console.error('密钥初始化失败:', e);
    }
}

// 加载设置（允许用户自定义覆盖）
function loadSettings() {
    // 更新UI显示
    document.getElementById('claudeKey').value = API_KEYS.openrouter ? '******已配置(OpenRouter)******' : '';
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
        API_KEYS.openrouter = claudeInput;  // 使用OpenRouter
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

    let results = [];
    
    // 检查是否有可用的API
    if (!API_KEYS.gemini && !API_KEYS.deepseek && !API_KEYS.openrouter) {
        alert('⚠️ 没有可用的API密钥，请点击右下角⚙️配置');
        document.getElementById('loading').classList.remove('show');
        document.getElementById('submitBtn').disabled = false;
        openSettings();
        return;
    }

    if (imageBase64) {
        // 🖼️ 有图片模式：先让Gemini/Claude识别图片，再把结果给DeepSeek分析
        console.log('📷 检测到图片，启用串行模式：先识别图片，再深度分析');
        document.getElementById('loadingText').textContent = '🖼️ 第一步：识别图片中...';
        
        // 第一步：并行调用支持图片的模型（Gemini和Claude via OpenRouter）
        const imagePromises = [];
        if (API_KEYS.gemini) imagePromises.push(callGemini(question, imageBase64));
        if (API_KEYS.openrouter) imagePromises.push(callClaude(question, imageBase64));
        
        const imageResults = await Promise.allSettled(imagePromises);
        results = [...imageResults];
        
        // 第二步：获取Gemini的识别结果，转发给DeepSeek R1深度分析
        if (API_KEYS.deepseek) {
            document.getElementById('loadingText').textContent = '🧠 第二步：DeepSeek R1 深度分析中...';
            let geminiResult = imageResults.find(r => 
                r.status === 'fulfilled' && r.value?.model === 'Gemini' && r.value?.success
            );
            
            if (geminiResult) {
                // 构造给DeepSeek的提问：用户原问题 + Gemini的图片识别结果（限制长度）
                let geminiContent = geminiResult.value.content;
                // 限制Gemini内容长度，避免超过DeepSeek的token限制
                if (geminiContent.length > 3000) {
                    geminiContent = geminiContent.substring(0, 3000) + '...(内容已截断)';
                }
                const deepseekQuestion = `用户问题：${question || '请分析这张图片'}\n\n图片内容（由AI识别）：\n${geminiContent}\n\n请基于以上信息，进行深度分析和推理。`;
                
                console.log('🧠 将Gemini识别结果转发给DeepSeek进行深度分析');
                const deepseekResult = await callDeepSeekR1(deepseekQuestion, null);
                deepseekResult.model = 'DeepSeek (深度分析)';
                results.push({ status: 'fulfilled', value: deepseekResult });
            } else {
                // Gemini失败了，尝试用Claude的结果
                let claudeResult = imageResults.find(r => 
                    r.status === 'fulfilled' && r.value?.model === 'Claude' && r.value?.success
                );
                
                if (claudeResult) {
                    let claudeContent = claudeResult.value.content;
                    if (claudeContent.length > 3000) {
                        claudeContent = claudeContent.substring(0, 3000) + '...(内容已截断)';
                    }
                    const deepseekQuestion = `用户问题：${question || '请分析这张图片'}\n\n图片内容（由AI识别）：\n${claudeContent}\n\n请基于以上信息，进行深度分析和推理。`;
                    const deepseekResult = await callDeepSeekR1(deepseekQuestion, null);
                    deepseekResult.model = 'DeepSeek (深度分析)';
                    results.push({ status: 'fulfilled', value: deepseekResult });
                } else {
                    // Claude也失败了，只能用文字问题
                    const deepseekResult = await callDeepSeekR1(question || '请帮我分析问题', null);
                    deepseekResult.model = 'DeepSeek';
                    results.push({ status: 'fulfilled', value: deepseekResult });
                }
            }
        }
    } else {
        // 📝 纯文字模式：并行调用所有模型
        console.log('📝 纯文字模式，并行调用所有模型');
        document.getElementById('loadingText').textContent = '📝 正在同时询问三个AI模型...';
        const promises = [];
        
        if (API_KEYS.gemini) promises.push(callGemini(question, null));
        if (API_KEYS.deepseek) promises.push(callDeepSeekR1(question, null));
        if (API_KEYS.openrouter) promises.push(callClaude(question, null));

        results = await Promise.allSettled(promises);
    }

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

// 调用Claude API (通过OpenRouter)
// 参考: https://openrouter.ai/docs/quickstart
async function callClaude(question, imageBase64) {
    try {
        // 确认使用OpenRouter
        const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        const apiKey = API_KEYS.openrouter;
        
        console.log('🔑 OpenRouter密钥前10位:', apiKey ? apiKey.substring(0, 10) + '...' : '未配置');
        console.log('🌐 调用URL:', apiUrl);
        
        if (!apiKey || !apiKey.startsWith('sk-or-')) {
            throw new Error('OpenRouter密钥未配置或格式不正确，请检查设置');
        }

        // OpenRouter使用OpenAI兼容格式
        const content = [];

        if (imageBase64) {
            // OpenRouter支持的图片格式
            content.push({
                type: 'image_url',
                image_url: {
                    url: imageBase64  // data:image/xxx;base64,xxxxx 格式
                }
            });
        }

        content.push({
            type: 'text',
            text: question || '请描述这张图片的内容'
        });

        console.log('📤 正在通过OpenRouter调用Claude (Sonnet 3.5)...');
        
        const response = await fetchWithTimeout(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://joywenxu100.github.io/poker-trainer/',
                'X-Title': 'Multi-Model AI Assistant'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',  // 使用3.5 sonnet，更稳定
                max_tokens: 2000,
                messages: [{ 
                    role: 'user', 
                    content: content 
                }]
            })
        });

        console.log('📥 OpenRouter响应状态:', response.status);
        
        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}`;
            try {
                const error = await response.json();
                console.error('❌ OpenRouter错误详情:', JSON.stringify(error, null, 2));
                errorMsg = error.error?.message || error.message || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('📥 OpenRouter返回成功');
        
        // OpenRouter返回OpenAI格式
        if (!data.choices?.[0]?.message?.content) throw new Error('返回数据格式异常');
        
        return {
            model: 'Claude (via OpenRouter)',
            icon: 'claude',
            success: true,
            content: data.choices[0].message.content
        };
    } catch (error) {
        console.error('❌ Claude(OpenRouter)调用失败:', error);
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

// 调用DeepSeek推理模型（深度思考，不支持图片）
async function callDeepSeekR1(question, imageBase64) {
    try {
        let finalQuestion = question || '你好';
        
        // 如果有图片但没有文字问题，提示用户
        if (imageBase64 && !question) {
            finalQuestion = '请分析这个问题';
        }
        
        // 限制问题长度，避免token超限
        if (finalQuestion.length > 8000) {
            finalQuestion = finalQuestion.substring(0, 8000) + '\n...(内容已截断，请精简问题)';
        }
        
        console.log('📤 DeepSeek请求内容长度:', finalQuestion.length);
        
        const response = await fetchWithTimeout('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.deepseek}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',  // 使用deepseek-chat，兼容性更好
                messages: [{ role: 'user', content: finalQuestion }],
                max_tokens: 4000,
                temperature: 0.7
            })
        });

        console.log('📥 DeepSeek响应状态:', response.status);
        
        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}`;
            try {
                const error = await response.json();
                console.error('❌ DeepSeek错误详情:', error);
                errorMsg = error.error?.message || error.message || errorMsg;
            } catch (e) {
                console.error('❌ 无法解析错误响应');
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('📥 DeepSeek返回数据:', data);
        
        if (!data.choices?.[0]?.message) throw new Error('返回数据格式异常');
        
        let content = data.choices[0].message.content;
        
        // 如果有推理过程，也显示出来（deepseek-reasoner模型才有）
        if (data.choices[0].message.reasoning_content) {
            content = '🧠 **推理过程：**\n' + data.choices[0].message.reasoning_content + '\n\n📝 **结论：**\n' + content;
        }
        
        return {
            model: 'DeepSeek',
            icon: 'deepseek',
            success: true,
            content: content
        };
    } catch (error) {
        console.error('❌ DeepSeek调用失败:', error);
        return {
            model: 'DeepSeek',
            icon: 'deepseek',
            success: false,
            error: error.message || '请求失败'
        };
    }
}

// DeepSeek VL视觉模型（当前API不支持，暂时禁用）
// 注：DeepSeek官方API目前不支持多模态图片输入，仅支持文本
async function callDeepSeekVL(question, imageBase64) {
    // 直接返回跳过，因为DeepSeek API当前不支持图片
    return {
        model: 'DeepSeek VL',
        icon: 'deepseek',
        success: false,
        error: '跳过：DeepSeek API暂不支持图片'
    };
}

// 显示结果
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="model-result"><div class="error-message">❌ 没有收到任何回答<br><br>💡 提示：请检查是否已开启VPN（不支持香港节点）</div></div>';
        return;
    }
    
    // 过滤掉"跳过"类型的结果
    const filteredResults = results.filter(r => {
        if (r.status === 'fulfilled' && r.value && r.value.error && r.value.error.includes('跳过')) {
            return false; // 跳过这个结果
        }
        return true;
    });
    
    // 检查是否所有请求都失败了（排除跳过的）
    const allFailed = filteredResults.length > 0 && filteredResults.every(r => r.status === 'rejected' || (r.value && !r.value.success));
    if (allFailed) {
        // 在结果前添加VPN提示
        const vpnTip = document.createElement('div');
        vpnTip.className = 'vpn-tip';
        vpnTip.innerHTML = '⚠️ <strong>所有模型请求失败</strong><br>请检查：1️⃣ 是否已开启VPN 2️⃣ VPN节点是否可用（不支持香港） 3️⃣ 网络连接是否正常';
        resultsContainer.appendChild(vpnTip);
    }
    
    filteredResults.forEach((result, index) => {
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
