// 🔍 手牌分析引擎 - Hand Analyzer Engine
// 深度分析实战手牌，检测leaks，提供训练建议

const handAnalyzerEngine = {
    // ==================== 核心分析函数 ====================
    
    analyzeHand: function(handData) {
        const {
            position,      // 位置
            stack,         // 筹码深度(BB)
            hand,          // 手牌
            action,        // 翻前动作
            opponentPos,   // 对手位置
            opponentType,  // 对手类型
            result,        // 结果
            pot,           // 底池大小
            details        // 详细描述
        } = handData;

        // 1. 获取理想策略
        const idealStrategy = this.getIdealStrategy(position, stack, hand, opponentPos);

        // 2. 比较实际action vs 理想strategy
        const matchScore = this.calculateMatchScore(action, idealStrategy);

        // 3. 检测leaks
        const leaks = this.detectLeaks(handData, idealStrategy);

        // 4. 识别好的play
        const goodPlays = this.identifyGoodPlays(handData, idealStrategy);

        // 5. 计算各项评分
        const decisionQuality = this.evaluateDecisionQuality(matchScore, leaks.length);
        const positionScore = this.evaluatePositionAwareness(handData);
        const adjustmentScore = this.evaluateOpponentAdjustment(handData, opponentType);

        // 6. 生成训练建议
        const recommendations = this.generateRecommendations(handData, leaks);

        return {
            matchScore,
            decisionQuality,
            positionScore,
            adjustmentScore,
            leaks,
            goodPlays,
            recommendations,
            idealStrategy
        };
    },

    // ==================== 获取理想策略 ====================
    
    getIdealStrategy: function(position, stack, hand, opponentPos) {
        // 根据筹码深度选择策略
        let strategy = {};
        
        if (stack >= 250) {
            strategy = this.get300BBStrategy(position, hand, opponentPos);
        } else if (stack >= 150) {
            strategy = this.get150BBStrategy(position, hand, opponentPos);
        } else if (stack >= 100) {
            strategy = this.get100BBStrategy(position, hand, opponentPos);
        } else if (stack >= 60) {
            strategy = this.get60BBStrategy(position, hand, opponentPos);
        } else if (stack >= 40) {
            strategy = this.get40BBStrategy(position, hand, opponentPos);
        } else {
            strategy = this.getPushFoldStrategy(position, hand, stack);
        }

        return strategy;
    },

    get300BBStrategy: function(position, hand, opponentPos) {
        // 300BB LAG策略
        const handStrength = this.evaluateHandStrength(hand);
        const positionValue = this.getPositionValue(position);

        if (handStrength >= 90) {
            return { action: 'open', frequency: 100, notes: 'Premium hand, always open/raise' };
        } else if (handStrength >= 70) {
            return { action: 'open', frequency: 95, notes: 'Strong hand, open most positions' };
        } else if (handStrength >= 50 && positionValue >= 70) {
            return { action: 'open', frequency: 80, notes: 'Decent hand + good position' };
        } else if (handStrength >= 30 && positionValue >= 85) {
            return { action: 'open', frequency: 60, notes: 'Speculative hand, late position only' };
        } else {
            return { action: 'fold', frequency: 100, notes: 'Hand too weak even for LAG' };
        }
    },

    get150BBStrategy: function(position, hand, opponentPos) {
        // 150BB LAG 80%策略
        const handStrength = this.evaluateHandStrength(hand);
        const positionValue = this.getPositionValue(position);

        if (handStrength >= 90) {
            return { action: 'open', frequency: 100, notes: 'Premium hand' };
        } else if (handStrength >= 65) {
            return { action: 'open', frequency: 95, notes: 'Strong hand' };
        } else if (handStrength >= 45 && positionValue >= 70) {
            return { action: 'open', frequency: 75, notes: 'Decent hand + position' };
        } else if (handStrength >= 30 && positionValue >= 90) {
            return { action: 'open', frequency: 50, notes: 'Late position speculative' };
        } else {
            return { action: 'fold', frequency: 100, notes: 'Tighten up from 300BB' };
        }
    },

    get100BBStrategy: function(position, hand, opponentPos) {
        // 100BB TAG+策略
        const handStrength = this.evaluateHandStrength(hand);
        const positionValue = this.getPositionValue(position);

        if (handStrength >= 85) {
            return { action: 'open', frequency: 100, notes: 'Premium TAG hand' };
        } else if (handStrength >= 65) {
            return { action: 'open', frequency: 90, notes: 'Strong hand' };
        } else if (handStrength >= 50 && positionValue >= 70) {
            return { action: 'open', frequency: 70, notes: 'Solid hand + position' };
        } else if (handStrength >= 35 && positionValue >= 90) {
            return { action: 'open', frequency: 40, notes: 'Late position only' };
        } else {
            return { action: 'fold', frequency: 100, notes: 'TAG fold' };
        }
    },

    get60BBStrategy: function(position, hand, opponentPos) {
        // 60BB TAG策略
        const handStrength = this.evaluateHandStrength(hand);
        const positionValue = this.getPositionValue(position);

        if (handStrength >= 80) {
            return { action: 'open', frequency: 100, notes: 'Premium' };
        } else if (handStrength >= 60) {
            return { action: 'open', frequency: 85, notes: 'Strong' };
        } else if (handStrength >= 45 && positionValue >= 75) {
            return { action: 'open', frequency: 60, notes: 'Decent + position' };
        } else {
            return { action: 'fold', frequency: 100, notes: 'Tight TAG fold' };
        }
    },

    get40BBStrategy: function(position, hand, opponentPos) {
        // 40BB Short-stack策略
        const handStrength = this.evaluateHandStrength(hand);
        const positionValue = this.getPositionValue(position);

        if (handStrength >= 75) {
            return { action: 'allin', frequency: 80, notes: 'Strong hand, push' };
        } else if (handStrength >= 55 && positionValue >= 80) {
            return { action: 'open', frequency: 70, notes: 'Open/fold or all-in' };
        } else {
            return { action: 'fold', frequency: 100, notes: 'Wait for better spot' };
        }
    },

    getPushFoldStrategy: function(position, hand, stack) {
        // Push/Fold策略
        const handStrength = this.evaluateHandStrength(hand);
        const positionValue = this.getPositionValue(position);
        const pushThreshold = 80 - (stack * 0.5); // 筹码越少，push范围越宽

        if (handStrength >= pushThreshold) {
            return { action: 'allin', frequency: 100, notes: 'Push/Fold range' };
        } else {
            return { action: 'fold', frequency: 100, notes: 'Fold and wait' };
        }
    },

    // ==================== 评估手牌强度 ====================
    
    evaluateHandStrength: function(hand) {
        if (!hand) return 0;
        
        const h = hand.toUpperCase();
        
        // Pocket pairs
        if (h === 'AA') return 100;
        if (h === 'KK') return 98;
        if (h === 'QQ') return 95;
        if (h === 'JJ') return 90;
        if (h === 'TT') return 85;
        if (h === '99') return 78;
        if (h === '88') return 72;
        if (h === '77') return 66;
        if (h === '66') return 60;
        if (h === '55') return 54;
        if (h === '44') return 48;
        if (h === '33') return 42;
        if (h === '22') return 38;

        // Broadway hands
        if (h === 'AKS') return 92;
        if (h === 'AKO') return 88;
        if (h === 'AQS') return 84;
        if (h === 'AQO') return 78;
        if (h === 'AJS') return 80;
        if (h === 'AJO') return 72;
        if (h === 'ATS') return 76;
        if (h === 'ATO') return 68;
        if (h === 'KQS') return 75;
        if (h === 'KQO') return 70;
        if (h === 'KJS') return 72;
        if (h === 'KJO') return 65;

        // Suited connectors
        if (h.includes('S')) {
            if (h === '87S' || h === '76S' || h === '98S') return 55;
            if (h === '65S' || h === '54S') return 48;
            if (h === '43S' || h === '32S') return 40;
        }

        // Default
        return 35;
    },

    getPositionValue: function(position) {
        const posValues = {
            'BTN': 100,
            'CO': 90,
            'HJ': 75,
            'LJ': 65,
            'MP': 55,
            'UTG1': 45,
            'UTG': 35,
            'SB': 50,
            'BB': 60
        };
        return posValues[position] || 50;
    },

    // ==================== 计算匹配度 ====================
    
    calculateMatchScore: function(actualAction, idealStrategy) {
        if (!idealStrategy) return 50;

        const actionMatch = {
            'fold': { 'fold': 100, 'call': 30, 'open': 0, '3bet': 0, '4bet': 0, 'allin': 0 },
            'call': { 'fold': 50, 'call': 100, 'open': 70, '3bet': 40, '4bet': 20, 'allin': 10 },
            'open': { 'fold': 20, 'call': 60, 'open': 100, '3bet': 80, '4bet': 50, 'allin': 30 },
            '3bet': { 'fold': 10, 'call': 50, 'open': 70, '3bet': 100, '4bet': 80, 'allin': 60 },
            '4bet': { 'fold': 5, 'call': 40, 'open': 50, '3bet': 70, '4bet': 100, 'allin': 90 },
            'allin': { 'fold': 0, 'call': 30, 'open': 40, '3bet': 60, '4bet': 80, 'allin': 100 }
        };

        const idealAction = idealStrategy.action;
        const score = actionMatch[idealAction][actualAction] || 50;

        // 考虑frequency调整
        if (score < 100 && idealStrategy.frequency < 100) {
            return Math.min(100, score + (100 - idealStrategy.frequency) * 0.3);
        }

        return score;
    },

    // ==================== 检测Leaks ====================
    
    detectLeaks: function(handData, idealStrategy) {
        const leaks = [];

        // Leak 1: 范围过宽
        if (handData.action !== 'fold' && idealStrategy.action === 'fold') {
            leaks.push({
                type: 'leak',
                title: '范围过宽',
                description: `在${handData.position}位置用${handData.hand} ${handData.action}是错误的。在${handData.stack}BB深度时，这个手牌应该fold。`,
                severity: 'high',
                fix: `学习${handData.stack}BB深度的正确Open范围，特别是${handData.position}位置。`
            });
        }

        // Leak 2: 范围过紧
        if (handData.action === 'fold' && idealStrategy.action === 'open' && idealStrategy.frequency > 80) {
            leaks.push({
                type: 'leak',
                title: '范围过紧',
                description: `${handData.hand}在${handData.position}位置应该open，你fold了。这是missed opportunity。`,
                severity: 'medium',
                fix: `扩大你的Open范围，特别是在有利位置。`
            });
        }

        // Leak 3: 位置awareness不足
        const posValue = this.getPositionValue(handData.position);
        if (handData.action === 'open' && posValue < 60) {
            const handStrength = this.evaluateHandStrength(handData.hand);
            if (handStrength < 70) {
                leaks.push({
                    type: 'leak',
                    title: '位置利用不当',
                    description: `在${handData.position}（早位置）用${handData.hand} open是too loose。早位置需要更强的手牌。`,
                    severity: 'medium',
                    fix: `早位置只用premium hands open（TT+, AJ+）。`
                });
            }
        }

        // Leak 4: 筹码深度awareness不足
        if (handData.stack < 60 && handData.action === 'call') {
            leaks.push({
                type: 'leak',
                title: '筹码深度错误',
                description: `在${handData.stack}BB深度时call不是optimal。应该3-Bet or Fold。`,
                severity: 'medium',
                fix: `学习短筹码策略：3-Bet or Fold > Call。`
            });
        }

        // Leak 5: vs对手类型调整不足
        if (handData.opponentType === 'nit' && handData.action !== 'fold') {
            const handStrength = this.evaluateHandStrength(handData.hand);
            if (handStrength < 80) {
                leaks.push({
                    type: 'leak',
                    title: '对手调整不足',
                    description: `对手是Nit（极紧），你的${handData.hand}面对他的range太弱。应该fold。`,
                    severity: 'low',
                    fix: `vs Nit玩家：只用premium hands继续，其他fold。`
                });
            }
        }

        return leaks;
    },

    // ==================== 识别好的Play ====================
    
    identifyGoodPlays: function(handData, idealStrategy) {
        const goodPlays = [];

        // Good play 1: 正确的aggressive play
        if (handData.action === idealStrategy.action && idealStrategy.frequency > 80) {
            goodPlays.push({
                type: 'good',
                title: '策略正确',
                description: `你的${handData.action}与理想策略完全匹配。做得好！`
            });
        }

        // Good play 2: 位置利用好
        const posValue = this.getPositionValue(handData.position);
        if (posValue >= 85 && handData.action === 'open') {
            goodPlays.push({
                type: 'good',
                title: '位置利用优秀',
                description: `你在${handData.position}位置积极open，充分利用了位置优势。`
            });
        }

        // Good play 3: 正确的fold
        if (handData.action === 'fold' && idealStrategy.action === 'fold') {
            goodPlays.push({
                type: 'good',
                title: '正确的Fold',
                description: `在这个spot fold是正确的。避免了一个losing situation。`
            });
        }

        return goodPlays;
    },

    // ==================== 评分系统 ====================
    
    evaluateDecisionQuality: function(matchScore, leakCount) {
        const adjusted = matchScore - (leakCount * 10);
        if (adjusted >= 95) return 'A+';
        if (adjusted >= 90) return 'A';
        if (adjusted >= 85) return 'A-';
        if (adjusted >= 80) return 'B+';
        if (adjusted >= 75) return 'B';
        if (adjusted >= 70) return 'B-';
        if (adjusted >= 65) return 'C+';
        if (adjusted >= 60) return 'C';
        return 'D';
    },

    evaluatePositionAwareness: function(handData) {
        const posValue = this.getPositionValue(handData.position);
        const handStrength = this.evaluateHandStrength(handData.hand);

        // 早位置需要强手牌
        if (posValue < 60 && handStrength >= 80) return 95;
        if (posValue < 60 && handStrength < 60) return 40;

        // 后位置可以wider range
        if (posValue >= 85 && handData.action !== 'fold') return 90;
        if (posValue >= 85 && handData.action === 'fold' && handStrength < 40) return 85;

        return 70;
    },

    evaluateOpponentAdjustment: function(handData, opponentType) {
        // 简化版：根据对手类型评估调整
        if (opponentType === 'unknown') return 50;

        const handStrength = this.evaluateHandStrength(handData.hand);

        if (opponentType === 'nit' && handStrength >= 85) return 90;
        if (opponentType === 'lag' && handData.action !== 'fold') return 80;
        if (opponentType === 'maniac' && handData.action === 'fold' && handStrength < 70) return 85;

        return 65;
    },

    // ==================== 生成训练建议 ====================
    
    generateRecommendations: function(handData, leaks) {
        const recommendations = [];

        // 基于筹码深度推荐模块
        if (handData.stack >= 250) {
            recommendations.push('推荐训练：deep_stack_lag_trainer.html - 300BB完整LAG策略');
        } else if (handData.stack >= 150) {
            recommendations.push('推荐训练：stack_150bb_trainer.html - 150BB LAG 80%策略');
        } else if (handData.stack >= 100) {
            recommendations.push('推荐训练：stack_100bb_trainer.html - 100BB LAG→TAG关键过渡');
        } else if (handData.stack >= 60) {
            recommendations.push('推荐训练：stack_60bb_trainer.html - 60BB TAG策略');
        } else {
            recommendations.push('推荐训练：wsop_short_stack.html - 短筹码训练');
        }

        // 基于位置推荐
        const posValue = this.getPositionValue(handData.position);
        if (posValue < 60) {
            recommendations.push('建议学习：早位置范围收紧技巧');
        } else if (posValue >= 85) {
            recommendations.push('建议学习：后位置aggressive steal技巧');
        }

        // 基于leaks推荐
        if (leaks.length > 0) {
            leaks.forEach(leak => {
                if (leak.fix) {
                    recommendations.push(leak.fix);
                }
            });
        }

        // 基于对手类型推荐
        if (handData.opponentType !== 'unknown') {
            recommendations.push(`针对${handData.opponentType}对手的剥削策略训练`);
        }

        return recommendations;
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = handAnalyzerEngine;
}

