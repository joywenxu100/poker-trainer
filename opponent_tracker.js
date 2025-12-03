// 🧠 对手数据追踪系统 - 实时统计分析
// Opponent Data Tracking & Analysis System

// 对手数据结构
class OpponentProfile {
    constructor(name, seatNumber) {
        this.name = name || `对手${seatNumber}`;
        this.seatNumber = seatNumber;
        this.handsPlayed = 0;
        
        // 核心统计
        this.stats = {
            VPIP: { count: 0, total: 0 },  // Voluntarily Put in Pot
            PFR: { count: 0, total: 0 },   // Pre-Flop Raise
            threeBet: { count: 0, opportunities: 0 },
            fourBet: { count: 0, opportunities: 0 },
            cBet: { count: 0, opportunities: 0 },
            foldToCBet: { count: 0, opportunities: 0 },
            checkRaise: { count: 0, opportunities: 0 },
            aggression: { totalBets: 0, totalCalls: 0 }
        };
        
        // 位置统计
        this.positionalStats = {
            UTG: { vpip: 0, pfr: 0, hands: 0 },
            MP: { vpip: 0, pfr: 0, hands: 0 },
            CO: { vpip: 0, pfr: 0, hands: 0 },
            BTN: { vpip: 0, pfr: 0, hands: 0 },
            SB: { vpip: 0, pfr: 0, hands: 0 },
            BB: { vpip: 0, pfr: 0, hands: 0 }
        };
        
        // 特殊倾向
        this.tendencies = {
            slowPlaysNuts: 0,  // 慢打坚果次数
            overfoldsToAggression: 0,  // 过度弃牌次数
            callsWithWeak: 0,  // 用弱牌跟注次数
            bluffsRiver: 0,  // 河牌诈唬次数
            valueBetsThin: 0,  // 薄价值下注次数
            tilting: false,  // 是否Tilt
            tiltIndicators: []  // Tilt信号
        };
        
        // 手牌历史
        this.handHistory = [];
        this.showdownHands = [];
        
        // 实时分类
        this.classification = null;
        this.lastUpdated = Date.now();
    }
    
    // 更新VPIP
    updateVPIP(voluntarilyEnteredPot) {
        this.stats.VPIP.total++;
        if (voluntarilyEnteredPot) {
            this.stats.VPIP.count++;
        }
        this.handsPlayed++;
        this.recalculateClassification();
    }
    
    // 更新PFR
    updatePFR(raisedPreflop) {
        this.stats.PFR.total++;
        if (raisedPreflop) {
            this.stats.PFR.count++;
        }
        this.recalculateClassification();
    }
    
    // 更新3-Bet
    update3Bet(did3Bet, hadOpportunity) {
        if (hadOpportunity) {
            this.stats.threeBet.opportunities++;
            if (did3Bet) {
                this.stats.threeBet.count++;
            }
        }
        this.recalculateClassification();
    }
    
    // 更新Cbet
    updateCBet(didCBet, hadOpportunity) {
        if (hadOpportunity) {
            this.stats.cBet.opportunities++;
            if (didCBet) {
                this.stats.cBet.count++;
            }
        }
    }
    
    // 更新Fold to Cbet
    updateFoldToCBet(didFold, facedCBet) {
        if (facedCBet) {
            this.stats.foldToCBet.opportunities++;
            if (didFold) {
                this.stats.foldToCBet.count++;
            }
        }
    }
    
    // 更新Aggression
    updateAggression(action) {
        if (action === 'bet' || action === 'raise') {
            this.stats.aggression.totalBets++;
        } else if (action === 'call') {
            this.stats.aggression.totalCalls++;
        }
    }
    
    // 记录Showdown手牌
    recordShowdown(hand, action, result) {
        this.showdownHands.push({
            hand,
            action,
            result,
            timestamp: Date.now()
        });
        
        // 分析倾向
        this.analyzeTendencies(hand, action);
    }
    
    // 分析特殊倾向
    analyzeTendencies(hand, action) {
        // 简化的倾向分析
        if (action === 'slowplay' && hand.strength === 'nuts') {
            this.tendencies.slowPlaysNuts++;
        }
        
        if (action === 'fold' && hand.strength === 'medium') {
            this.tendencies.overfoldsToAggression++;
        }
        
        if (action === 'call' && hand.strength === 'weak') {
            this.tendencies.callsWithWeak++;
        }
    }
    
    // 检测Tilt
    detectTilt() {
        const recentHands = this.handHistory.slice(-10);
        const badBeats = recentHands.filter(h => h.result === 'bad_beat').length;
        const losingStreak = recentHands.filter(h => h.result === 'loss').length;
        
        if (badBeats >= 2 || losingStreak >= 5) {
            this.tendencies.tilting = true;
            this.tendencies.tiltIndicators.push({
                type: badBeats >= 2 ? 'bad_beats' : 'losing_streak',
                timestamp: Date.now()
            });
        }
    }
    
    // 重新分类对手
    recalculateClassification() {
        const vpip = this.getVPIP();
        const pfr = this.getPFR();
        const threeBet = this.get3Bet();
        const aggression = this.getAggression();
        const cBet = this.getCBet();
        const foldToCBet = this.getFoldToCBet();
        
        // 使用opponent_classifier.js的识别系统
        if (typeof identifyOpponentType === 'function') {
            const result = identifyOpponentType({
                VPIP: vpip,
                PFR: pfr,
                threeBet: threeBet,
                cBet: cBet,
                foldToCBet: foldToCBet,
                aggression: aggression
            });
            
            this.classification = result;
        }
        
        this.lastUpdated = Date.now();
    }
    
    // 获取统计数据
    getVPIP() {
        return this.stats.VPIP.total > 0 
            ? Math.round((this.stats.VPIP.count / this.stats.VPIP.total) * 100)
            : 0;
    }
    
    getPFR() {
        return this.stats.PFR.total > 0 
            ? Math.round((this.stats.PFR.count / this.stats.PFR.total) * 100)
            : 0;
    }
    
    get3Bet() {
        return this.stats.threeBet.opportunities > 0 
            ? Math.round((this.stats.threeBet.count / this.stats.threeBet.opportunities) * 100)
            : 0;
    }
    
    get4Bet() {
        return this.stats.fourBet.opportunities > 0 
            ? Math.round((this.stats.fourBet.count / this.stats.fourBet.opportunities) * 100)
            : 0;
    }
    
    getCBet() {
        return this.stats.cBet.opportunities > 0 
            ? Math.round((this.stats.cBet.count / this.stats.cBet.opportunities) * 100)
            : 0;
    }
    
    getFoldToCBet() {
        return this.stats.foldToCBet.opportunities > 0 
            ? Math.round((this.stats.foldToCBet.count / this.stats.foldToCBet.opportunities) * 100)
            : 0;
    }
    
    getAggression() {
        const total = this.stats.aggression.totalBets + this.stats.aggression.totalCalls;
        return total > 0 
            ? (this.stats.aggression.totalBets / this.stats.aggression.totalCalls).toFixed(1)
            : 0;
    }
    
    // 生成HUD显示数据
    generateHUD() {
        return {
            name: this.name,
            hands: this.handsPlayed,
            vpip: this.getVPIP(),
            pfr: this.getPFR(),
            threeBet: this.get3Bet(),
            cBet: this.getCBet(),
            foldToCBet: this.getFoldToCBet(),
            aggression: this.getAggression(),
            classification: this.classification,
            tilting: this.tendencies.tilting
        };
    }
    
    // 生成剥削建议
    generateExploitAdvice() {
        if (!this.classification || !this.classification.type) {
            return {
                summary: '数据不足，需要观察更多手牌（至少20-30手）',
                tactics: []
            };
        }
        
        const advice = {
            type: this.classification.type.name,
            emoji: this.classification.type.emoji,
            confidence: this.classification.confidence,
            profitBoost: this.classification.type.exploitStrategies.profitBoost,
            preflop: this.classification.type.exploitStrategies.preflop,
            postflop: this.classification.type.exploitStrategies.postflop,
            warning: this.classification.type.exploitStrategies.warning
        };
        
        // 添加实时调整
        if (this.tendencies.tilting) {
            advice.tiltAdjustment = '⚠️ 对手正在Tilt！增加价值下注，减少诈唬（他们会疯狂call）';
        }
        
        return advice;
    }
}

// 全局追踪管理器
class OpponentTracker {
    constructor() {
        this.opponents = new Map();  // seatNumber -> OpponentProfile
        this.session = {
            startTime: Date.now(),
            totalHands: 0,
            profitableOpponents: []
        };
    }
    
    // 添加对手
    addOpponent(seatNumber, name) {
        if (!this.opponents.has(seatNumber)) {
            this.opponents.set(seatNumber, new OpponentProfile(name, seatNumber));
        }
        return this.opponents.get(seatNumber);
    }
    
    // 获取对手
    getOpponent(seatNumber) {
        return this.opponents.get(seatNumber);
    }
    
    // 更新对手数据
    updateOpponent(seatNumber, updateData) {
        const opponent = this.getOpponent(seatNumber);
        if (!opponent) return;
        
        if (updateData.vpip !== undefined) {
            opponent.updateVPIP(updateData.vpip);
        }
        
        if (updateData.pfr !== undefined) {
            opponent.updatePFR(updateData.pfr);
        }
        
        if (updateData.threeBet !== undefined) {
            opponent.update3Bet(updateData.threeBet, updateData.had3BetOpportunity);
        }
        
        if (updateData.cBet !== undefined) {
            opponent.updateCBet(updateData.cBet, updateData.hadCBetOpportunity);
        }
        
        if (updateData.foldToCBet !== undefined) {
            opponent.updateFoldToCBet(updateData.foldToCBet, updateData.facedCBet);
        }
        
        if (updateData.action) {
            opponent.updateAggression(updateData.action);
        }
        
        if (updateData.showdown) {
            opponent.recordShowdown(updateData.showdown.hand, updateData.showdown.action, updateData.showdown.result);
        }
        
        opponent.detectTilt();
    }
    
    // 生成所有对手的HUD
    generateAllHUDs() {
        const huds = [];
        this.opponents.forEach((opponent, seat) => {
            huds.push({
                seat,
                ...opponent.generateHUD()
            });
        });
        return huds;
    }
    
    // 识别最有利可图的对手
    identifyProfitableOpponents() {
        const profitable = [];
        
        this.opponents.forEach((opponent, seat) => {
            const hud = opponent.generateHUD();
            let score = 0;
            
            // 鱼玩家特征（高VPIP，低PFR，低Aggression）
            if (hud.vpip > 40 && hud.pfr < 15) score += 50;
            
            // 紧弱玩家特征（低VPIP，高Fold to Cbet）
            if (hud.vpip < 18 && hud.foldToCBet > 65) score += 40;
            
            // Calling Station（高VPIP，低Aggression）
            if (hud.vpip > 35 && hud.aggression < 1.5) score += 60;
            
            // Maniac（极高VPIP，极高Aggression）
            if (hud.vpip > 50 && hud.aggression > 4) score += 45;
            
            // Tilt玩家
            if (hud.tilting) score += 30;
            
            if (score > 30) {
                profitable.push({
                    seat,
                    name: hud.name,
                    score,
                    classification: hud.classification,
                    expectedProfit: this.calculateExpectedProfit(opponent)
                });
            }
        });
        
        this.session.profitableOpponents = profitable.sort((a, b) => b.score - a.score);
        return this.session.profitableOpponents;
    }
    
    // 计算期望盈利
    calculateExpectedProfit(opponent) {
        const hud = opponent.generateHUD();
        
        // 简化的期望盈利计算
        let profitEstimate = 0;
        
        // 基于VPIP和Aggression的估算
        if (hud.vpip > 40 && hud.aggression < 2) {
            profitEstimate = 15 + (hud.vpip - 40) * 0.5;  // Calling Station
        } else if (hud.vpip < 15 && hud.foldToCBet > 70) {
            profitEstimate = 10 + (hud.foldToCBet - 70) * 0.3;  // Nit
        } else if (hud.vpip > 50 && hud.aggression > 4) {
            profitEstimate = 20 + hud.aggression * 2;  // Maniac
        }
        
        // Tilt加成
        if (hud.tilting) {
            profitEstimate *= 1.5;
        }
        
        return `+${profitEstimate.toFixed(1)} BB/100`;
    }
    
    // 导出数据（用于保存）
    exportData() {
        const data = {
            session: this.session,
            opponents: []
        };
        
        this.opponents.forEach((opponent, seat) => {
            data.opponents.push({
                seat,
                profile: opponent
            });
        });
        
        return JSON.stringify(data);
    }
    
    // 导入数据（用于恢复）
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.session = data.session;
            
            data.opponents.forEach(oppData => {
                const opponent = new OpponentProfile(oppData.profile.name, oppData.seat);
                Object.assign(opponent, oppData.profile);
                this.opponents.set(oppData.seat, opponent);
            });
            
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

// 创建全局实例
const globalTracker = new OpponentTracker();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OpponentProfile, OpponentTracker, globalTracker };
}

