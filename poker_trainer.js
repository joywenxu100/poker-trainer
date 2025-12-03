// 德州扑克训练师 - 核心逻辑
// 数据结构

const PHASES = [
    {
        id: 1,
        title: "信息收集",
        time: "3-5秒",
        warning: false,
        questions: [
            { q: "我的位置是什么？", a: "BTN/CO/MP/EP/SB/BB - 位置决定你的行动范围和策略" },
            { q: "我的有效筹码是多少BB？", a: "筹码量决定你的策略，深筹码vs短筹码打法完全不同" },
            { q: "当前底池大小是多少？", a: "底池大小影响下注sizing和赔率计算" },
            { q: "对手是谁？", a: "识别对手类型：紧/松/激进/被动，针对性调整策略" }
        ]
    },
    {
        id: 2,
        title: "牌力评估",
        time: "2-3秒",
        warning: false,
        questions: [
            { q: "我的绝对牌力如何？", a: "坚果/强牌/中牌/弱牌 - 客观评估你的牌" },
            { q: "我的牌在对手范围中的相对强度？", a: "不是看牌面，而是看对手可能有什么" },
            { q: "我有多少改进潜力(outs)？", a: "计算能改进成强牌的张数，评估听牌价值" },
            { q: "公共牌面结构？", a: "干燥board vs 湿润board，coordinated还是rainbow" }
        ]
    },
    {
        id: 3,
        title: "对手范围分析",
        time: "3-5秒",
        warning: false,
        questions: [
            { q: "对手之前的行动表示什么范围？", a: "根据preflop和之前街道的action缩小范围" },
            { q: "对手可能的强牌/中等牌/诈唬比例？", a: "估算对手range的组成，不要只想一手牌" },
            { q: "对手会不会在这里诈唬？", a: "评估对手的诈唬频率和倾向" },
            { q: "对手会不会fold掉更好的牌？", a: "考虑fold equity，能否让对手弃掉中等牌" }
        ]
    },
    {
        id: 4,
        title: "赔率计算",
        time: "2-3秒",
        warning: false,
        questions: [
            { q: "底池赔率是多少？", a: "需要call的筹码 / (当前底池 + call的筹码)，例如call 100进入300的底池 = 100/(300+100) = 25%胜率即可盈利" },
            { q: "我需要多少胜率才能call？", a: "根据底池赔率计算盈亏平衡点：Call / (Pot + Call)" },
            { q: "我的实际胜率/equity是多少？", a: "对抗对手范围，我的牌能赢多少%" },
            { q: "隐含赔率是否足够？", a: "击中后能从对手那赢多少，是否值得追" }
        ]
    },
    {
        id: 5,
        title: "情绪自检",
        time: "1-2秒",
        warning: true,
        questions: [
            { q: "我现在是否冷静？", a: "情绪失控是输钱的头号原因，必须诚实自检" },
            { q: "刚才的结果是否影响我？", a: "不要带着上一手的情绪做决策，每手都是独立的" },
            { q: "我是基于逻辑还是情绪做决策？", a: "想报复？想追回损失？这都是情绪，不是逻辑" },
            { q: "如果是1小时前，我会做同样决策吗？", a: "用这个问题检验决策的理性程度" }
        ]
    },
    {
        id: 6,
        title: "行动决策",
        time: "2-3秒",
        warning: false,
        questions: [
            { q: "Fold的理由是什么？", a: "胜率不足以支撑call/raise，没有足够的fold equity" },
            { q: "Call的理由是什么？", a: "有足够的赔率，但raise的价值不大或风险高" },
            { q: "Raise的理由是什么？", a: "Value bet强牌、保护底池、诈唬、获取fold equity" },
            { q: "我的bet/raise大小合理吗？", a: "通常0.5-0.75pot，根据目的调整sizing" }
        ]
    },
    {
        id: 7,
        title: "二次确认",
        time: "1-2秒",
        warning: false,
        questions: [
            { q: "这个决策符合我的整体策略吗？", a: "不要偏离既定策略，保持一致性" },
            { q: "这个决策长期来看是+EV的吗？", a: "短期输赢不重要，长期盈利才是目标" },
            { q: "我有没有漏掉关键信息？", a: "最后检查一遍，确保没有遗漏" }
        ]
    }
];

const ACHIEVEMENTS = [
    { id: 'first', title: '初次尝试', desc: '完成第1次训练', icon: '🎯', requirement: 1 },
    { id: 'beginner', title: '入门', desc: '完成10次训练', icon: '📚', requirement: 10 },
    { id: 'intermediate', title: '进阶', desc: '完成50次训练', icon: '🎓', requirement: 50 },
    { id: 'advanced', title: '熟练', desc: '完成100次训练', icon: '⭐', requirement: 100 },
    { id: 'expert', title: '专家', desc: '完成500次训练', icon: '💎', requirement: 500 },
    { id: 'master', title: '大师', desc: '完成1000次训练', icon: '🏆', requirement: 1000 },
    { id: 'streak7', title: '连续7天', desc: '连续7天训练', icon: '🔥', requirement: 7, type: 'streak' },
    { id: 'streak30', title: '连续30天', desc: '连续30天训练', icon: '💪', requirement: 30, type: 'streak' }
];

// 全局状态
let trainingData = {
    totalCount: 0,
    todayCount: 0,
    lastTrainingDate: null,
    consecutiveDays: 0,
    phaseScores: [0, 0, 0, 0, 0, 0, 0],
    totalTime: 0,
    achievements: []
};

let currentTraining = {
    mode: 'complete',
    currentPhase: 0,
    currentQuestion: 0,
    startTime: 0,
    timerInterval: null,
    questions: [],
    flipped: false,
    correctCount: 0,
    wrongCount: 0
};

// 初始化
function init() {
    loadData();
    updateHomePage();
    updateStatsPage();
    
    // 检查是否为PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as PWA');
    }
}

// 数据持久化
function saveData() {
    localStorage.setItem('pokerTrainerData', JSON.stringify(trainingData));
}

function loadData() {
    const saved = localStorage.getItem('pokerTrainerData');
    if (saved) {
        trainingData = JSON.parse(saved);
        
        // 检查日期，更新今日计数
        const today = new Date().toDateString();
        if (trainingData.lastTrainingDate !== today) {
            // 检查连续天数
            if (trainingData.lastTrainingDate) {
                const lastDate = new Date(trainingData.lastTrainingDate);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    trainingData.consecutiveDays++;
                } else if (diffDays > 1) {
                    trainingData.consecutiveDays = 0;
                }
            } else {
                trainingData.consecutiveDays = 1;
            }
            
            trainingData.todayCount = 0;
        }
    }
}

// 页面切换
function switchPage(pageName) {
    // 更新导航栏
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // 更新页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName + 'Page').classList.add('active');
    
    // 更新对应页面数据
    if (pageName === 'home') {
        updateHomePage();
    } else if (pageName === 'stats') {
        updateStatsPage();
    } else if (pageName === 'settings') {
        updateSettingsPage();
    }
}

// 更新首页
function updateHomePage() {
    document.getElementById('totalTrainingCount').textContent = trainingData.totalCount;
    document.getElementById('todayTrainingCount').textContent = trainingData.todayCount;
    document.getElementById('consecutiveDays').textContent = trainingData.consecutiveDays;
    
    const mastery = Math.min(100, Math.floor((trainingData.totalCount / 1000) * 100));
    document.getElementById('masteryLevel').textContent = mastery + '%';
    
    document.getElementById('progressPercent').textContent = mastery + '%';
    document.getElementById('progressBarFill').style.width = mastery + '%';
    document.getElementById('progressText').textContent = 
        `已完成 ${trainingData.totalCount} / 1000 次训练`;
}

// 开始训练
function startTraining(mode) {
    currentTraining.mode = mode;
    currentTraining.currentPhase = 0;
    currentTraining.currentQuestion = 0;
    currentTraining.startTime = Date.now();
    currentTraining.flipped = false;
    currentTraining.correctCount = 0;
    currentTraining.wrongCount = 0;
    
    // 准备问题列表
    if (mode === 'complete' || mode === 'quick') {
        currentTraining.questions = [];
        PHASES.forEach(phase => {
            phase.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: phase,
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (mode === 'test') {
        // 随机模式
        currentTraining.questions = [];
        PHASES.forEach(phase => {
            phase.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: phase,
                    question: q.q,
                    answer: q.a
                });
            });
        });
        // 随机打乱
        currentTraining.questions.sort(() => Math.random() - 0.5);
        // 只取10个
        currentTraining.questions = currentTraining.questions.slice(0, 10);
    }
    
    // 切换到训练页面
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('trainPage').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[1].classList.add('active');
    
    // 开始计时
    startTimer();
    
    // 显示第一个问题
    showQuestion();
}

// 显示问题
function showQuestion() {
    if (currentTraining.currentQuestion >= currentTraining.questions.length) {
        finishTraining();
        return;
    }
    
    const current = currentTraining.questions[currentTraining.currentQuestion];
    const card = document.getElementById('trainingCard');
    
    // 重置卡片状态
    card.classList.remove('flipped');
    currentTraining.flipped = false;
    
    // 更新徽章
    const badge = document.getElementById('phaseBadge');
    badge.textContent = `阶段${current.phase.id}: ${current.phase.title}`;
    badge.className = current.phase.warning ? 'phase-badge warning' : 'phase-badge';
    
    // 更新进度
    document.getElementById('trainingProgress').textContent = 
        `问题 ${currentTraining.currentQuestion + 1} / ${currentTraining.questions.length}`;
    
    // 更新卡片内容
    document.getElementById('cardQuestion').textContent = current.question;
    document.getElementById('cardAnswer').textContent = current.answer;
    document.getElementById('cardHint').textContent = '轻触卡片查看答案';
    
    // 隐藏按钮
    document.getElementById('btnKnow').style.display = 'none';
    document.getElementById('btnForget').style.display = 'none';
}

// 翻转卡片
function flipCard() {
    if (currentTraining.flipped) return;
    
    const card = document.getElementById('trainingCard');
    card.classList.add('flipped');
    currentTraining.flipped = true;
    
    // 显示按钮
    document.getElementById('btnKnow').style.display = 'block';
    document.getElementById('btnForget').style.display = 'block';
}

// 回答：记住了
function answerKnow() {
    if (!currentTraining.flipped) return;
    
    currentTraining.correctCount++;
    
    // 更新该阶段分数
    const phaseId = currentTraining.questions[currentTraining.currentQuestion].phase.id;
    trainingData.phaseScores[phaseId - 1] = Math.min(100, trainingData.phaseScores[phaseId - 1] + 2);
    
    nextQuestion();
}

// 回答：不记得
function answerForget() {
    if (!currentTraining.flipped) return;
    
    currentTraining.wrongCount++;
    
    // 该阶段分数略微减少
    const phaseId = currentTraining.questions[currentTraining.currentQuestion].phase.id;
    trainingData.phaseScores[phaseId - 1] = Math.max(0, trainingData.phaseScores[phaseId - 1] - 1);
    
    nextQuestion();
}

// 下一题
function nextQuestion() {
    currentTraining.currentQuestion++;
    showQuestion();
}

// 完成训练
function finishTraining() {
    stopTimer();
    
    // 更新数据
    trainingData.totalCount++;
    trainingData.todayCount++;
    trainingData.lastTrainingDate = new Date().toDateString();
    
    const elapsed = Math.floor((Date.now() - currentTraining.startTime) / 1000);
    trainingData.totalTime += elapsed;
    
    // 检查成就
    checkAchievements();
    
    saveData();
    
    // 显示庆祝
    showCelebration();
}

// 显示庆祝
function showCelebration() {
    const count = trainingData.totalCount;
    let title = '太棒了！';
    let text = `完成第${count}次训练`;
    
    // 检查里程碑
    if (count === 1) {
        title = '🎉 开启训练之旅！';
        text = '第一次总是特别的，坚持下去！';
    } else if (count === 10) {
        title = '🎊 入门成功！';
        text = '完成10次训练，你已经入门了！';
    } else if (count === 50) {
        title = '🌟 进步显著！';
        text = '完成50次训练，感觉到进步了吗？';
    } else if (count === 100) {
        title = '💎 百次里程碑！';
        text = '100次训练！决策流程开始内化了！';
    } else if (count === 500) {
        title = '🏅 半程达成！';
        text = '500次训练！肌肉记忆正在形成！';
    } else if (count === 1000) {
        title = '🏆 大师诞生！';
        text = '1000次训练！你已经是大师了！';
    }
    
    const accuracy = Math.round((currentTraining.correctCount / currentTraining.questions.length) * 100);
    text += `\n准确率：${accuracy}%`;
    
    document.getElementById('celebrationTitle').textContent = title;
    document.getElementById('celebrationText').textContent = text;
    document.getElementById('celebration').classList.add('show');
}

// 关闭庆祝
function closeCelebration() {
    document.getElementById('celebration').classList.remove('show');
    
    // 返回首页
    switchPage('home');
}

// 检查成就
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (trainingData.achievements.includes(achievement.id)) return;
        
        if (achievement.type === 'streak') {
            if (trainingData.consecutiveDays >= achievement.requirement) {
                trainingData.achievements.push(achievement.id);
            }
        } else {
            if (trainingData.totalCount >= achievement.requirement) {
                trainingData.achievements.push(achievement.id);
            }
        }
    });
}

// 更新统计页面
function updateStatsPage() {
    // 更新成就
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    
    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = trainingData.achievements.includes(achievement.id);
        const div = document.createElement('div');
        div.className = 'achievement ' + (unlocked ? 'unlocked' : 'locked');
        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        achievementsList.appendChild(div);
    });
    
    // 更新阶段熟练度
    const phaseList = document.getElementById('phaseList');
    phaseList.innerHTML = '';
    
    PHASES.forEach((phase, index) => {
        const score = trainingData.phaseScores[index];
        const div = document.createElement('div');
        div.className = 'phase-item' + (phase.warning ? ' warning' : '');
        div.innerHTML = `
            <div class="phase-item-header">
                <div class="phase-item-title">阶段${phase.id}: ${phase.title}</div>
                <div class="phase-score">${score}%</div>
            </div>
            <div class="phase-progress-bar">
                <div class="phase-progress-fill" style="width: ${score}%"></div>
            </div>
        `;
        phaseList.appendChild(div);
    });
}

// 更新设置页面
function updateSettingsPage() {
    document.getElementById('settingsTotalCount').textContent = trainingData.totalCount;
    
    const minutes = Math.floor(trainingData.totalTime / 60);
    document.getElementById('totalTime').textContent = minutes + '分钟';
}

// 计时器
function startTimer() {
    currentTraining.startTime = Date.now();
    currentTraining.timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - currentTraining.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timerEl = document.getElementById('timer');
    timerEl.textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    
    // 如果超过30秒，标红提醒
    if (elapsed > 30) {
        timerEl.classList.add('warning');
    } else {
        timerEl.classList.remove('warning');
    }
}

function stopTimer() {
    if (currentTraining.timerInterval) {
        clearInterval(currentTraining.timerInterval);
        currentTraining.timerInterval = null;
    }
}

// 退出训练
function exitTraining() {
    if (confirm('确定要退出训练吗？进度将不会保存。')) {
        stopTimer();
        switchPage('home');
    }
}

// 重置数据
function resetData() {
    if (confirm('⚠️ 警告：此操作将清除所有训练数据，无法恢复！\n\n确定要重置吗？')) {
        if (confirm('再次确认：真的要清除所有数据吗？')) {
            trainingData = {
                totalCount: 0,
                todayCount: 0,
                lastTrainingDate: null,
                consecutiveDays: 0,
                phaseScores: [0, 0, 0, 0, 0, 0, 0],
                totalTime: 0,
                achievements: []
            };
            saveData();
            updateHomePage();
            updateStatsPage();
            updateSettingsPage();
            alert('数据已重置！');
        }
    }
}

// 页面加载完成
window.addEventListener('load', () => {
    init();
    
    // 注册Service Worker（PWA支持）
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => {
            console.log('Service Worker registered');
        }).catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});

// 防止意外关闭
window.addEventListener('beforeunload', (e) => {
    if (currentTraining.timerInterval) {
        e.preventDefault();
        e.returnValue = '';
    }
});


