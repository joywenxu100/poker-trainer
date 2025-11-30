// 德州扑克决策训练APP - JavaScript逻辑

// 7个阶段的完整数据
const PHASES = [
    {
        id: 1,
        name: "信息收集",
        time: "3-5秒",
        items: [
            { q: "我的位置是什么？", hint: "BTN/CO/MP/EP/SB/BB - 位置决定策略" },
            { q: "我的有效筹码是多少BB？", hint: "筹码量决定打法风格" },
            { q: "当前底池大小是多少？", hint: "影响赔率和下注sizing" },
            { q: "对手是谁？", hint: "紧/松/激进/被动 - 调整策略" }
        ]
    },
    {
        id: 2,
        name: "牌力评估",
        time: "2-3秒",
        items: [
            { q: "我的绝对牌力如何？", hint: "坚果/强牌/中牌/弱牌/诈唬" },
            { q: "我的牌在对手范围中的相对强度？", hint: "相对牌力比绝对牌力更重要" },
            { q: "我有多少改进潜力(outs)？", hint: "计算能改进的牌数" },
            { q: "公共牌面结构？", hint: "干燥/湿润/coordinated" }
        ]
    },
    {
        id: 3,
        name: "对手范围分析",
        time: "3-5秒",
        items: [
            { q: "对手之前的行动表示什么范围？", hint: "根据行动缩窄范围" },
            { q: "对手可能的强牌/中等牌/诈唬比例？", hint: "估算范围组成" },
            { q: "对手会不会在这里诈唬？", hint: "考虑对手特点和牌面" },
            { q: "对手会不会fold掉更好的牌？", hint: "评估bluff成功率" }
        ]
    },
    {
        id: 4,
        name: "赔率计算",
        time: "2-3秒",
        items: [
            { q: "底池赔率是多少？", hint: "pot odds = call金额 / (底池+call金额)" },
            { q: "我需要多少胜率才能call？", hint: "胜率需求 = 1 / (1 + 赔率)" },
            { q: "我的实际胜率/equity是多少？", hint: "估算或计算equity" },
            { q: "隐含赔率是否足够？", hint: "考虑后续街道能赢多少" }
        ]
    },
    {
        id: 5,
        name: "情绪自检",
        time: "1-2秒",
        warning: true,
        items: [
            { q: "我现在是否冷静？", hint: "深呼吸，保持理性" },
            { q: "刚才的结果是否影响我？", hint: "每手牌都是独立的" },
            { q: "我是基于逻辑还是情绪做决策？", hint: "情绪决策是最大敌人" },
            { q: "如果是1小时前，我会做同样决策吗？", hint: "时间测试法" }
        ]
    },
    {
        id: 6,
        name: "行动决策",
        time: "2-3秒",
        items: [
            { q: "Fold: 我的胜率不足以支撑call/raise", hint: "保存筹码，等待更好机会" },
            { q: "Call: 我有足够赔率，但raise价值不大", hint: "控制底池，看便宜牌" },
            { q: "Raise: 我要value bet/保护底池/诈唬", hint: "明确raise目的" },
            { q: "Sizing: bet/raise大小合理吗？", hint: "通常0.5-0.75pot" }
        ]
    },
    {
        id: 7,
        name: "二次确认",
        time: "1-2秒",
        items: [
            { q: "这个决策符合我的整体策略吗？", hint: "保持一致性" },
            { q: "这个决策长期来看是+EV的吗？", hint: "关注长期期望值" },
            { q: "我有没有漏掉关键信息？", hint: "最后检查" }
        ]
    }
];

// 全局状态
let state = {
    trainingMode: null,
    currentPhaseIndex: 0,
    currentItemIndex: 0,
    allItems: [],
    rememberedCount: 0,
    forgotCount: 0,
    startTime: null,
    stats: null
};

// 初始化
function init() {
    loadStats();
    updateUI();
    checkInstallPrompt();
    registerServiceWorker();
}

// 加载统计数据
function loadStats() {
    const saved = localStorage.getItem('pokerTrainingStats');
    if (saved) {
        state.stats = JSON.parse(saved);
    } else {
        state.stats = {
            totalCount: 0,
            todayCount: 0,
            lastTrainingDate: null,
            streak: 0,
            phaseScores: {},
            totalTime: 0,
            achievements: []
        };
        
        // 初始化每个阶段的分数
        PHASES.forEach(phase => {
            state.stats.phaseScores[phase.id] = {
                remembered: 0,
                forgot: 0,
                score: 0
            };
        });
    }
    
    // 检查是否是新的一天
    const today = new Date().toDateString();
    if (state.stats.lastTrainingDate !== today) {
        if (state.stats.lastTrainingDate) {
            const lastDate = new Date(state.stats.lastTrainingDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                state.stats.streak++;
            } else if (diffDays > 1) {
                state.stats.streak = 0;
            }
        }
        state.stats.todayCount = 0;
    }
}

// 保存统计数据
function saveStats() {
    const today = new Date().toDateString();
    state.stats.lastTrainingDate = today;
    localStorage.setItem('pokerTrainingStats', JSON.stringify(state.stats));
}

// 更新UI
function updateUI() {
    // 更新首页统计
    document.getElementById('totalCount').textContent = state.stats.totalCount;
    document.getElementById('todayCount').textContent = state.stats.todayCount;
    document.getElementById('streak').textContent = `连续打卡: ${state.stats.streak}天`;
    
    // 计算平均熟练度
    const avgScore = calculateAverageScore();
    document.getElementById('avgScore').textContent = avgScore;
    
    // 更新进度条
    const progress = Math.min((state.stats.totalCount / 1000) * 100, 100);
    document.getElementById('mainProgress').style.width = progress + '%';
    document.getElementById('mainProgress').textContent = Math.floor(progress) + '%';
    
    // 更新下个成就
    const milestones = [10, 50, 100, 300, 500, 1000];
    const nextMilestone = milestones.find(m => m > state.stats.totalCount) || 1000;
    const remaining = nextMilestone - state.stats.totalCount;
    document.getElementById('nextMilestone').textContent = remaining;
    
    // 更新成就徽章
    updateAchievements();
    
    // 更新统计页面
    updateStatsPage();
}

// 计算平均熟练度
function calculateAverageScore() {
    let totalScore = 0;
    let count = 0;
    
    Object.values(state.stats.phaseScores).forEach(phase => {
        if (phase.remembered + phase.forgot > 0) {
            totalScore += phase.score;
            count++;
        }
    });
    
    return count > 0 ? Math.round(totalScore / count) : 0;
}

// 更新成就
function updateAchievements() {
    const milestones = [10, 50, 100, 300, 500, 1000];
    const achievements = document.querySelectorAll('.achievement');
    
    achievements.forEach((achievement, index) => {
        const milestone = milestones[index];
        if (state.stats.totalCount >= milestone) {
            achievement.classList.add('unlocked');
        } else {
            achievement.classList.remove('unlocked');
        }
    });
}

// 更新统计页面
function updateStatsPage() {
    // 更新累计时间
    const totalMinutes = Math.round(state.stats.totalTime / 60);
    document.getElementById('statTotalTime').textContent = totalMinutes;
    
    // 更新平均用时
    const avgTime = state.stats.totalCount > 0 ? 
        Math.round(state.stats.totalTime / state.stats.totalCount) : 0;
    document.getElementById('statAvgTime').textContent = avgTime;
    
    // 更新各阶段统计
    const container = document.getElementById('phaseStatsContainer');
    container.innerHTML = '';
    
    PHASES.forEach(phase => {
        const phaseScore = state.stats.phaseScores[phase.id];
        const total = phaseScore.remembered + phaseScore.forgot;
        const score = total > 0 ? Math.round((phaseScore.remembered / total) * 100) : 0;
        
        const phaseStatHTML = `
            <div class="phase-stats">
                <div class="phase-stat-header">
                    <div class="phase-stat-title">阶段${phase.id}: ${phase.name}</div>
                    <div class="phase-stat-score">${score}分</div>
                </div>
                <div class="phase-progress-bar">
                    <div class="phase-progress-fill" style="width: ${score}%"></div>
                </div>
            </div>
        `;
        container.innerHTML += phaseStatHTML;
    });
}

// 开始训练
function startTraining(mode) {
    state.trainingMode = mode;
    state.currentPhaseIndex = 0;
    state.currentItemIndex = 0;
    state.rememberedCount = 0;
    state.forgotCount = 0;
    state.startTime = Date.now();
    
    // 准备所有训练项
    state.allItems = [];
    PHASES.forEach(phase => {
        phase.items.forEach(item => {
            state.allItems.push({
                phase: phase,
                item: item
            });
        });
    });
    
    // 如果是随机测试，打乱顺序
    if (mode === 'test') {
        state.allItems = shuffleArray(state.allItems);
    }
    
    // 显示训练页面
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('trainingPage').classList.add('active');
    document.getElementById('completionPage').classList.add('hidden');
    
    // 根据模式调整UI
    if (mode === 'test') {
        document.getElementById('trainingControls').classList.add('hidden');
        document.getElementById('testOptions').classList.remove('hidden');
    } else {
        document.getElementById('trainingControls').classList.remove('hidden');
        document.getElementById('testOptions').classList.add('hidden');
    }
    
    showCurrentCard();
}

// 显示当前卡片
function showCurrentCard() {
    const currentIndex = state.currentPhaseIndex * 4 + state.currentItemIndex;
    
    if (currentIndex >= state.allItems.length) {
        completeTraining();
        return;
    }
    
    const current = state.allItems[currentIndex];
    const phase = current.phase;
    const item = current.item;
    
    // 更新进度
    document.getElementById('phaseIndicator').textContent = `阶段${phase.id}: ${phase.name}`;
    document.getElementById('trainingProgress').textContent = 
        `${currentIndex + 1} / ${state.allItems.length}`;
    
    // 更新卡片内容
    document.getElementById('cardPhase').textContent = `阶段${phase.id}: ${phase.name}`;
    document.getElementById('cardContent').textContent = item.q;
    document.getElementById('cardHint').innerHTML = item.hint;
    
    // 重置卡片翻转
    document.getElementById('trainingCard').classList.remove('flipped');
    
    // 如果是测试模式，生成选项
    if (state.trainingMode === 'test') {
        generateTestOptions(phase);
    }
}

// 生成测试选项
function generateTestOptions(correctPhase) {
    const container = document.getElementById('testOptions');
    container.innerHTML = '';
    
    // 获取所有阶段
    const allPhases = [...PHASES];
    const correctAnswer = correctPhase.id;
    
    // 随机选择3个错误答案
    const wrongPhases = allPhases.filter(p => p.id !== correctAnswer);
    const shuffled = shuffleArray(wrongPhases);
    const wrongAnswers = shuffled.slice(0, 3);
    
    // 组合所有选项并打乱
    const options = [correctPhase, ...wrongAnswers];
    const shuffledOptions = shuffleArray(options);
    
    // 生成选项HTML
    shuffledOptions.forEach(phase => {
        const optionHTML = `
            <div class="test-option" onclick="checkTestAnswer(${phase.id}, ${correctAnswer})">
                阶段${phase.id}: ${phase.name} (${phase.time})
            </div>
        `;
        container.innerHTML += optionHTML;
    });
}

// 检查测试答案
function checkTestAnswer(selectedId, correctId) {
    const options = document.querySelectorAll('.test-option');
    
    options.forEach(option => {
        const phaseId = parseInt(option.textContent.match(/阶段(\d+)/)[1]);
        
        if (phaseId === correctId) {
            option.classList.add('correct');
        } else if (phaseId === selectedId && selectedId !== correctId) {
            option.classList.add('wrong');
        }
    });
    
    // 记录答案
    if (selectedId === correctId) {
        markAnswer(true);
    } else {
        markAnswer(false);
    }
    
    // 2秒后自动下一题
    setTimeout(() => {
        nextCard();
    }, 1500);
}

// 翻转卡片
function flipCard() {
    if (state.trainingMode === 'test') return;
    
    const card = document.getElementById('trainingCard');
    card.classList.toggle('flipped');
}

// 标记答案
function markAnswer(remembered) {
    const currentIndex = state.currentPhaseIndex * 4 + state.currentItemIndex;
    const current = state.allItems[currentIndex];
    const phaseId = current.phase.id;
    
    if (remembered) {
        state.rememberedCount++;
        state.stats.phaseScores[phaseId].remembered++;
    } else {
        state.forgotCount++;
        state.stats.phaseScores[phaseId].forgot++;
    }
    
    // 更新阶段分数
    const phaseScore = state.stats.phaseScores[phaseId];
    const total = phaseScore.remembered + phaseScore.forgot;
    phaseScore.score = Math.round((phaseScore.remembered / total) * 100);
}

// 下一张卡片
function nextCard() {
    state.currentItemIndex++;
    
    if (state.currentItemIndex >= 4) {
        state.currentItemIndex = 0;
        state.currentPhaseIndex++;
    }
    
    showCurrentCard();
}

// 完成训练
function completeTraining() {
    // 隐藏训练页面
    document.getElementById('trainingPage').classList.remove('active');
    document.getElementById('completionPage').classList.remove('hidden');
    
    // 计算用时
    const duration = Math.round((Date.now() - state.startTime) / 1000);
    const score = Math.round((state.rememberedCount / state.allItems.length) * 100);
    
    // 更新统计
    state.stats.totalCount++;
    state.stats.todayCount++;
    state.stats.totalTime += duration;
    
    // 显示完成信息
    document.getElementById('completionTime').textContent = duration;
    document.getElementById('rememberedCount').textContent = state.rememberedCount;
    document.getElementById('forgotCount').textContent = state.forgotCount;
    document.getElementById('completionScore').textContent = score;
    
    // 保存数据
    saveStats();
    
    // 检查成就
    checkAchievements();
}

// 检查成就
function checkAchievements() {
    const milestones = [10, 50, 100, 300, 500, 1000];
    const lastCount = state.stats.totalCount - 1;
    
    milestones.forEach(milestone => {
        if (lastCount < milestone && state.stats.totalCount >= milestone) {
            showAchievementNotification(milestone);
        }
    });
}

// 显示成就通知
function showAchievementNotification(milestone) {
    const achievementNames = {
        10: '🌱 入门',
        50: '🔥 坚持',
        100: '💪 熟练',
        300: '⭐ 精通',
        500: '🏆 大师',
        1000: '👑 传奇'
    };
    
    alert(`🎉 恭喜解锁成就：${achievementNames[milestone]}！\n继续加油，向1000次目标前进！`);
}

// 返回首页
function goHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('trainingPage').classList.remove('active');
    document.getElementById('completionPage').classList.add('hidden');
    
    updateUI();
}

// 切换页面
function switchPage(page) {
    // 更新导航栏
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // 显示对应页面
    document.getElementById('homePage').style.display = page === 'home' ? 'block' : 'none';
    document.getElementById('statsPage').classList.toggle('active', page === 'stats');
    document.getElementById('settingsPage').classList.toggle('active', page === 'settings');
    
    if (page === 'stats') {
        updateStatsPage();
    }
}

// 确认重置
function confirmReset() {
    if (confirm('确定要清除所有训练数据吗？此操作不可恢复！')) {
        localStorage.clear();
        location.reload();
    }
}

// 工具函数：打乱数组
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// PWA安装
let deferredPrompt;

function checkInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installBtn').style.display = 'block';
    });
}

document.getElementById('installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        document.getElementById('installBtn').style.display = 'none';
    }
});

// 注册Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker注册成功'))
            .catch(err => console.log('Service Worker注册失败', err));
    }
}

// 页面加载完成
window.addEventListener('DOMContentLoaded', init);

// 防止意外关闭
window.addEventListener('beforeunload', (e) => {
    if (document.getElementById('trainingPage').classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

