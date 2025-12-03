// 动态调整引擎 - 根据桌面情况和对手类型实时调整策略
// Dynamic Strategy Adjuster

const dynamicAdjuster = {
    // 根据对手类型调整范围
    adjustRangeByOpponent: function(baseRange, opponentType) {
        const adjustments = {
            nit: {
                multiplier: 1.3,
                description: '对抗Nit扩大30%范围',
                reason: '他们极少防守，可以疯狂偷盲'
            },
            callingStation: {
                multiplier: 0.85,
                description: '对抗Calling Station收紧15%',
                reason: '他们总是call，需要更强牌才能盈利'
            },
            lag: {
                multiplier: 0.85,
                description: '对抗LAG收紧15%',
                reason: '他们频繁3-Bet，需要更强范围对抗'
            },
            tag: {
                multiplier: 1.0,
                description: '对抗TAG使用标准范围',
                reason: '平衡对手，使用GTO策略'
            },
            fish: {
                multiplier: 1.0,
                description: '对抗Fish使用标准范围（但只价值打）',
                reason: '不需要调整范围，重点是翻后价值最大化'
            },
            maniac: {
                multiplier: 0.7,
                description: '对抗Maniac极度收紧30%',
                reason: '他们疯狂施压，只用顶级牌对抗'
            }
        };

        return adjustments[opponentType] || adjustments.tag;
    },

    // 根据桌面动态调整
    adjustByTableDynamics: function(situation) {
        const adjustments = {
            // 频繁3-Bet的桌子
            frequent3Bet: {
                openAdjustment: -0.15, // 收紧15%
                call3BetAdjustment: +0.10, // 增加10% call 3-Bet
                fourBetAdjustment: +0.05, // 增加5% 4-Bet
                advice: [
                    '收紧Open范围15-20%',
                    '增加call 3-Bet频率（他们在诈唬）',
                    '用强牌慢打（AA/KK平call 3-Bet）',
                    '减少3-Bet诈唬'
                ]
            },

            // 所有人都Fold的桌子
            passiveTable: {
                openAdjustment: +0.25, // 扩大25%
                call3BetAdjustment: -0.10, // 减少call（很少3-Bet）
                cbetAdjustment: +0.15, // 提高Cbet频率
                advice: [
                    '疯狂扩大Open范围（60%+ from BTN）',
                    '几乎总是Cbet（他们不防守）',
                    '多条街诈唬（他们容易弃牌）',
                    '薄价值下注（他们会call弱牌）'
                ]
            },

            // 刚展示过诈唬
            afterShowingBluff: {
                openAdjustment: -0.10, // 收紧10%
                cbetAdjustment: -0.10, // 减少Cbet
                valueBetAdjustment: +0.15, // 增加价值下注
                advice: [
                    '接下来5-10手收紧10%',
                    '减少诈唬频率',
                    '增加价值下注sizing（他们会call）',
                    '用强牌设陷阱（他们会反击）'
                ]
            },

            // 刚展示过强牌
            afterShowingNuts: {
                openAdjustment: +0.05, // 稍微扩大
                bluffAdjustment: +0.15, // 增加诈唬
                cbetAdjustment: +0.10, // 增加Cbet
                advice: [
                    '增加诈唬频率15%（形象好）',
                    '可以更激进（对手会尊重）',
                    'Cbet频率提升10%',
                    '利用紧形象偷盲'
                ]
            },

            // 你在大赢
            bigWinner: {
                imageEffect: 'positive',
                adjustment: 'neutral',
                advice: [
                    '⚠️ 保持冷静，不要over-aggressive',
                    '继续使用标准策略',
                    '对手可能tilt，注意调整',
                    '不要炫耀筹码（保持好形象）'
                ]
            },

            // 你在大输
            bigLoser: {
                imageEffect: 'negative',
                adjustment: 'tighten',
                advice: [
                    '⚠️ 极度注意Tilt',
                    '收紧10-15%避免报复性play',
                    '只玩premium牌',
                    '考虑休息（避免情绪化）',
                    '对手会针对你，更加谨慎'
                ]
            }
        };

        return adjustments[situation] || null;
    },

    // 位置调整（已在桌x分钟）
    adjustBySessionLength: function(minutesPlayed) {
        if (minutesPlayed < 30) {
            return {
                strategy: '初期 - 标准GTO',
                advice: [
                    '使用标准范围',
                    '观察对手倾向',
                    '建立紧形象',
                    '不要立即展示诈唬'
                ]
            };
        } else if (minutesPlayed < 90) {
            return {
                strategy: '中期 - 开始调整',
                advice: [
                    '根据对手分类开始exploit',
                    '识别鱼玩家并隔离',
                    '避开强对手',
                    '利用形象偷盲'
                ]
            };
        } else if (minutesPlayed < 180) {
            return {
                strategy: '后期 - 深度exploit',
                advice: [
                    '完全针对对手调整',
                    '增加诈唬频率（形象好）',
                    '压榨弱玩家',
                    '避免与强玩家大底池'
                ]
            };
        } else {
            return {
                strategy: '长时间 - 注意疲劳',
                advice: [
                    '⚠️ 警惕疲劳导致的错误',
                    '收紧范围10%（降低波动）',
                    '考虑休息',
                    '只打高EV spot',
                    '对手可能已经识别你的模式'
                ]
            };
        }
    },

    // 根据筹码量调整
    adjustByStackSize: function(effectiveBB) {
        if (effectiveBB < 100) {
            return {
                strategy: '浅筹码 (<100BB)',
                adjustments: {
                    openRangeChange: -0.15, // 收紧15%
                    call3BetChange: -0.20, // 大幅减少call 3-Bet
                    推挤范围: 'active below 20BB'
                },
                advice: [
                    '收紧至接近GTO范围',
                    '减少投机牌（22-55, 小同花连牌）',
                    '避免4-Bet pot（易all-in）',
                    '<20BB使用推挤表',
                    'SPR低，顶对即可全压'
                ]
            };
        } else if (effectiveBB < 200) {
            return {
                strategy: '标准筹码 (100-200BB)',
                adjustments: {
                    openRangeChange: -0.05, // 稍微收紧
                    call3BetChange: -0.10
                },
                advice: [
                    '接近标准LAG范围',
                    '小对和同花连牌价值降低',
                    'SPR适中，灵活操作',
                    '两对+可以全压'
                ]
            };
        } else if (effectiveBB < 300) {
            return {
                strategy: '深筹码 (200-300BB)',
                adjustments: {
                    openRangeChange: 0, // 标准
                    call3BetChange: +0.05
                },
                advice: [
                    '使用完整LAG范围',
                    '投机牌开始有价值',
                    'SPR 8-12最优',
                    '暗三/两对容易堆叠对手'
                ]
            };
        } else {
            return {
                strategy: '超深筹码 (300BB+)',
                adjustments: {
                    openRangeChange: +0.05, // 稍微扩大
                    call3BetChange: +0.15, // 大幅增加call
                    投机牌价值: 'maximum'
                },
                advice: [
                    '✅ 你的主场！最适合LAG',
                    '✅ 所有投机牌价值最大',
                    '✅ 可以call 3-Bet用22-66',
                    '✅ 同花连牌隐含赔率爆炸',
                    '⚠️ 只用坚果全压（避免边缘堆叠）'
                ]
            };
        }
    },

    // 实时建议生成器
    generateRealTimeAdvice: function(context) {
        const {
            position,
            action,
            effectiveBB,
            opponentType,
            tableDynamic,
            yourImage
        } = context;

        let advice = [];

        // 1. 筹码深度建议
        const stackAdvice = this.adjustByStackSize(effectiveBB);
        advice.push({
            category: '筹码深度',
            tips: stackAdvice.advice.slice(0, 2)
        });

        // 2. 对手类型建议
        const opponentAdj = this.adjustRangeByOpponent(null, opponentType);
        advice.push({
            category: '对手调整',
            tips: [opponentAdj.description, opponentAdj.reason]
        });

        // 3. 桌面动态建议
        if (tableDynamic) {
            const tableAdj = this.adjustByTableDynamics(tableDynamic);
            if (tableAdj) {
                advice.push({
                    category: '桌面情况',
                    tips: tableAdj.advice.slice(0, 2)
                });
            }
        }

        // 4. 形象建议
        if (yourImage === 'tight') {
            advice.push({
                category: '你的形象',
                tips: [
                    '✅ 你有紧形象，可以增加诈唬',
                    '✅ 偷盲成功率提升20%'
                ]
            });
        } else if (yourImage === 'loose') {
            advice.push({
                category: '你的形象',
                tips: [
                    '⚠️ 你有松形象，收紧10%',
                    '⚠️ 对手会更频繁3-Bet你'
                ]
            });
        }

        return advice;
    },

    // 简化版：快速调整建议
    quickAdvice: function(situation) {
        const quickTips = {
            'vsNit': '🎯 疯狂偷盲！Cbet 100%！他们75%+ fold',
            'vsCallingStation': '💰 停止诈唬！价值3条街！用顶对bet大',
            'vsLAG': '🛡️ 收紧15%！设陷阱！Check-raise频率提升',
            'vsTAG': '📚 标准GTO策略！保持平衡',
            'vsFish': '💎 隔离+价值！永不诈唬！',
            'vsManiac': '😤 极度收紧！慢打强牌！只call down',
            
            'deepStack': '✅ 你的主场！投机牌价值最大！',
            'shallowStack': '⚠️ 收紧15%！减少投机牌！',
            
            'passiveTable': '🚀 扩大25%范围！Cbet一切！',
            'aggressiveTable': '🛑 收紧15%！增加trap！',
            
            'afterBluffShown': '😶 收紧10%！减少诈唬5-10手',
            'afterNutsShown': '😎 增加诈唬15%！利用形象',
            
            'winning': '✅ 保持策略！不要over-aggressive',
            'losing': '⚠️ 极度注意Tilt！收紧10%！考虑休息'
        };

        return quickTips[situation] || '使用标准LAG策略';
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dynamicAdjuster;
}

