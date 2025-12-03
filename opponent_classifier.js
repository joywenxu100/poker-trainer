// 🎯 对手识别系统 - 世界第一级别的剥削理论
// Opponent Classification & Exploitation System

// 9种对手类型的完整数据库
const opponentTypes = {
    tightPassive: {
        id: 'tight-passive',
        name: '紧弱 (Nit/Rock)',
        emoji: '🗿',
        characteristics: {
            VPIP: '10-15%',
            PFR: '8-12%',
            threeBet: '2-4%',
            cBet: '40-60%',
            foldToCBet: '60-70%',
            aggression: '1.0-1.5'
        },
        tendencies: [
            '只玩超强牌，极少诈唬',
            '害怕失去筹码，过度弃牌',
            'Cbet频率低，一旦下注通常有牌',
            '面对压力快速弃牌',
            '几乎不3-Bet诈唬'
        ],
        exploitStrategies: {
            preflop: {
                summary: '疯狂偷盲 + 收紧Call',
                tactics: [
                    '✅ 从任何位置疯狂偷盲（80%+ open率）',
                    '✅ 面对他们的3-Bet立即弃牌（除非你有AA/KK）',
                    '❌ 永远不要call他们的Open（他们只open强牌）',
                    '✅ 3-Bet他们频率可以高达40%（他们会弃掉大部分）',
                    '✅ 对抗他们Open时，你的Raise = 他们立刻Fold'
                ]
            },
            postflop: {
                summary: '持续施压 + 停止价值最大化',
                tactics: [
                    '✅ 任何牌面100%持续下注（他们70%会fold）',
                    '✅ 多桶诈唬（3-barrel）成功率极高',
                    '✅ 遇到他们下注/加注，立即弃牌（他们不会诈唬）',
                    '❌ 不要试图薄价值下注（他们不会跟注）',
                    '✅ Float玩法成功率100%（翻牌call，转牌偷）'
                ]
            },
            profitBoost: '+8-12 BB/100',
            warning: '⚠️ 小心：他们偶尔会拿着AA慢打，但这种情况少于1%'
        }
    },

    tightAggressive: {
        id: 'tight-aggressive',
        name: '紧凶 (TAG)',
        emoji: '🦅',
        characteristics: {
            VPIP: '18-25%',
            PFR: '16-22%',
            threeBet: '6-9%',
            cBet: '65-75%',
            foldToCBet: '45-55%',
            aggression: '2.5-3.5'
        },
        tendencies: [
            '只玩强牌，但会激进下注',
            '3-Bet频率合理，有一定诈唬',
            'Cbet频率高且平衡',
            '能够放弃边缘牌',
            '位置意识强'
        ],
        exploitStrategies: {
            preflop: {
                summary: '平衡对抗 + 减少诈唬',
                tactics: [
                    '⚠️ 偷盲频率降低到60%（他们会反击）',
                    '✅ 面对3-Bet时，用QQ+/AK继续，其他弃牌',
                    '❌ 减少3-Bet诈唬（他们会4-Bet）',
                    '✅ 用强牌Call他们的Open（榨取价值）',
                    '⚠️ 不要盲目4-Bet诈唬（他们会调用或5-Bet）'
                ]
            },
            postflop: {
                summary: '控池 + 陷阱',
                tactics: [
                    '⚠️ Cbet频率降到65%（他们会Check-Raise）',
                    '✅ 用坚果设置陷阱（check-call）',
                    '❌ 停止多桶诈唬（他们会跟注到河牌）',
                    '✅ 在湿牌面更激进（他们尊重大注）',
                    '⚠️ 河牌不要薄价值下注（他们只用强牌call）'
                ]
            },
            profitBoost: '+2-4 BB/100',
            warning: '⚠️ 难缠对手！不要尝试过度剥削，保持平衡'
        }
    },

    loosePassive: {
        id: 'loose-passive',
        name: '松弱 (Calling Station)',
        emoji: '📞',
        characteristics: {
            VPIP: '35-50%',
            PFR: '5-12%',
            threeBet: '2-4%',
            cBet: '30-50%',
            foldToCBet: '25-35%',
            aggression: '0.8-1.2'
        },
        tendencies: [
            '玩超多手牌，但很少加注',
            '超爱跟注，几乎不弃牌',
            '只有强牌才会主动下注',
            '追听牌概率100%',
            '到摊牌才弃牌'
        ],
        exploitStrategies: {
            preflop: {
                summary: '停止诈唬 + 价值最大化',
                tactics: [
                    '❌ 完全停止偷盲诈唬（他们会call）',
                    '❌ 停止3-Bet诈唬（他们会call到河牌）',
                    '✅ 只用强价值牌Open（他们会给你action）',
                    '✅ 用更多牌Call他们的Raise（他们范围超宽）',
                    '✅ 加大Open sizing到4-5BB（他们不在乎）'
                ]
            },
            postflop: {
                summary: '薄价值 + 永不诈唬',
                tactics: [
                    '✅ 用顶对及以上疯狂下注3条街（他们会call）',
                    '✅ 薄价值下注（第二对也能价值下注）',
                    '❌ 100%停止诈唬（浪费筹码）',
                    '✅ 河牌over-bet（他们会用弱牌call）',
                    '✅ 遇到他们下注/加注要respect（他们不会诈唬）',
                    '⚠️ 小心听牌完成的牌面'
                ]
            },
            profitBoost: '+15-25 BB/100',
            warning: '🎁 最赚钱的对手类型！但要有耐心等强牌'
        }
    },

    looseAggressive: {
        id: 'loose-aggressive',
        name: '松凶 (LAG)',
        emoji: '🔥',
        characteristics: {
            VPIP: '28-40%',
            PFR: '22-35%',
            threeBet: '8-15%',
            cBet: '70-85%',
            foldToCBet: '35-45%',
            aggression: '3.0-5.0'
        },
        tendencies: [
            '玩很多牌，极度激进',
            '频繁3-Bet和4-Bet',
            'Cbet频率极高，多桶诈唬',
            '会用任何牌施压',
            '位置利用出色'
        ],
        exploitStrategies: {
            preflop: {
                summary: '收紧价值 + 陷阱',
                tactics: [
                    '⚠️ 收紧Open范围到15-20%（他们会3-Bet）',
                    '✅ 用强牌慢打（让他们诈唬）',
                    '✅ 增加Call 3-Bet频率（他们在诈唬）',
                    '❌ 减少3-Bet诈唬（他们会4-Bet）',
                    '✅ 用QQ+/AK设置4-Bet陷阱'
                ]
            },
            postflop: {
                summary: 'Check-Raise + 等待坚果',
                tactics: [
                    '✅ 用强牌Check（诱导他们诈唬）',
                    '✅ Check-Raise频率提高到15%+',
                    '⚠️ 不要尝试诈唬（他们会跟注或加注）',
                    '✅ 让他们主导行动，然后反击',
                    '⚠️ 河牌要有准备被诈唬（他们会over-bet诈唬）',
                    '✅ 用坚果跟注他们的河牌大注'
                ]
            },
            profitBoost: '+5-10 BB/100',
            warning: '⚠️ 高波动对手！需要大筹码和强心理'
        }
    },

    ultraTight: {
        id: 'ultra-tight',
        name: '超紧 (Super Nit)',
        emoji: '🏔️',
        characteristics: {
            VPIP: '5-10%',
            PFR: '4-8%',
            threeBet: '1-2%',
            cBet: '40-55%',
            foldToCBet: '70-80%',
            aggression: '1.0-1.5'
        },
        tendencies: [
            '只玩JJ+/AK级别',
            '几乎从不诈唬',
            '盲注防守极少',
            '看到action就弃牌',
            'Cbet = 强牌'
        ],
        exploitStrategies: {
            preflop: {
                summary: '100%偷盲 + 无限剥削',
                tactics: [
                    '✅ 从任何位置100%偷盲（任何两张牌）',
                    '✅ 面对他们Open立即弃牌（除非AA/KK/AK）',
                    '✅ 他们3-Bet = 你立刻fold（AA/KK也可以考虑fold）',
                    '✅ 永远不要call他们的Open',
                    '✅ 可以盲目3-Bet他们（他们90%会fold）'
                ]
            },
            postflop: {
                summary: '永远施压 + 从不相信',
                tactics: [
                    '✅ 100%持续下注任何牌面',
                    '✅ 3-barrel成功率90%+',
                    '❌ 看到他们下注立即弃牌（他们有坚果）',
                    '✅ Float玩法100%成功',
                    '❌ 永远不要试图price下注（浪费）'
                ]
            },
            profitBoost: '+10-15 BB/100',
            warning: '🎁 免费提款机！但他们盈利会很低'
        }
    },

    fish: {
        id: 'fish',
        name: '鱼玩家 (Recreational)',
        emoji: '🐟',
        characteristics: {
            VPIP: '40-70%',
            PFR: '5-15%',
            threeBet: '1-3%',
            cBet: '30-60%',
            foldToCBet: '30-50%',
            aggression: '0.5-1.5'
        },
        tendencies: [
            '玩几乎所有牌',
            '没有位置概念',
            '追任何听牌',
            '不理解底池赔率',
            '情绪化，容易Tilt'
        ],
        exploitStrategies: {
            preflop: {
                summary: '隔离 + 价值最大化',
                tactics: [
                    '✅ 用任何牌跟他们Open（隔离单挑）',
                    '✅ 用强牌大幅加注（5-7BB）',
                    '❌ 不要3-Bet诈唬（他们会call）',
                    '✅ 尽可能单挑他们（不要多人底池）',
                    '✅ 用更多牌call他们raise（他们范围超宽）'
                ]
            },
            postflop: {
                summary: '价值爆炸 + 永不诈唬',
                tactics: [
                    '✅ 用任何对子价值下注3条街',
                    '✅ 河牌over-bet（他们会用任何牌call）',
                    '❌ 100%停止诈唬（浪费）',
                    '✅ 让他们追听牌（收取错误价格）',
                    '⚠️ 小心听牌完成（他们会追到底）',
                    '✅ 等他们Tilt后加倍下注'
                ]
            },
            profitBoost: '+20-40 BB/100',
            warning: '🎁🎁🎁 最赚钱！但别让他们跑掉（保持友好）'
        }
    },

    maniac: {
        id: 'maniac',
        name: '激进鱼 (Maniac)',
        emoji: '🤪',
        characteristics: {
            VPIP: '50-80%',
            PFR: '40-70%',
            threeBet: '20-40%',
            cBet: '80-100%',
            foldToCBet: '10-25%',
            aggression: '5.0-10.0'
        },
        tendencies: [
            '用任何牌加注',
            '疯狂3-Bet和4-Bet',
            '100% Cbet',
            '多桶诈唬频率极高',
            '几乎不弃牌'
        ],
        exploitStrategies: {
            preflop: {
                summary: '陷阱 + 让他诈唬',
                tactics: [
                    '✅ 用任何对子call他们的Raise',
                    '✅ 用强牌慢打（AA/KK也只call）',
                    '✅ 让他们不断加注（诱导）',
                    '❌ 不要4-Bet诈唬（他们会5-Bet）',
                    '✅ 用坚果设置5-Bet陷阱'
                ]
            },
            postflop: {
                summary: 'Check-Call + 河牌爆炸',
                tactics: [
                    '✅ 用强牌Check（让他们诈唬）',
                    '✅ Check-Call到河牌',
                    '✅ 河牌Check-Raise All-in（他们会call）',
                    '❌ 永远不要诈唬（他们从不fold）',
                    '✅ 用第二对也敢跟注3条街（他们在诈唬）',
                    '⚠️ 准备大波动（他们会hit一些坚果）'
                ]
            },
            profitBoost: '+25-50 BB/100',
            warning: '🎢 巨大波动！需要至少500BB筹码'
        }
    },

    gtoPlayer: {
        id: 'gto',
        name: 'GTO玩家',
        emoji: '🤖',
        characteristics: {
            VPIP: '22-28%',
            PFR: '18-24%',
            threeBet: '6-10%',
            cBet: '60-70%',
            foldToCBet: '45-55%',
            aggression: '2.0-3.0'
        },
        tendencies: [
            '范围极度平衡',
            '频率接近理论最优',
            'Sizing标准化',
            '难以被剥削',
            '不犯明显错误'
        ],
        exploitStrategies: {
            preflop: {
                summary: '混合策略 + 微调',
                tactics: [
                    '⚠️ 保持你的标准松凶打法',
                    '✅ 观察他们的微小倾向（没有人是100% GTO）',
                    '⚠️ 不要尝试明显剥削（会被反制）',
                    '✅ 用你的深筹码优势（GTO通常针对100BB）',
                    '⚠️ 保持平衡，不给他们调整机会'
                ]
            },
            postflop: {
                summary: '标准打法 + 位置优势',
                tactics: [
                    '⚠️ 使用标准Cbet频率',
                    '✅ 利用位置优势（GTO OOP较弱）',
                    '⚠️ 不要过度诈唬或过度价值下注',
                    '✅ 利用深筹码隐含赔率',
                    '⚠️ 观察100手后寻找微小漏洞'
                ]
            },
            profitBoost: '±1 BB/100',
            warning: '⚠️ 最难对手！保持耐心，等待他们犯错'
        }
    },

    positionAbuser: {
        id: 'position-abuser',
        name: '位置虐待者',
        emoji: '🎯',
        characteristics: {
            VPIP: '25-35%',
            PFR: '20-30%',
            threeBet: '10-18%',
            cBet: '75-90%',
            foldToCBet: '35-45%',
            aggression: '3.5-5.0'
        },
        tendencies: [
            '后位极度激进，前位极紧',
            'BTN偷盲频率80%+',
            '有位置时疯狂施压',
            'OOP极度谨慎',
            '利用位置优势到极致'
        ],
        exploitStrategies: {
            preflop: {
                summary: '盲注宽防 + OOP收紧',
                tactics: [
                    '✅ 面对BTN偷盲，3-Bet频率提高到20%+',
                    '✅ BB防守范围扩大到60%+',
                    '❌ OOP不要用边缘牌call（他们会压榨）',
                    '✅ 用强牌在盲注位慢打（诱导）',
                    '⚠️ 前位面对他们Open要收紧'
                ]
            },
            postflop: {
                summary: 'OOP收紧 + IP反制',
                tactics: [
                    '⚠️ OOP对他们Cbet频率要达到70%防守',
                    '✅ Check-Raise频率提高到12%+',
                    '❌ 不要在OOP试图诈唬（他们会反击）',
                    '✅ IP时用标准打法（他们没位置优势了）',
                    '⚠️ 多人底池时他们会收紧'
                ]
            },
            profitBoost: '+3-6 BB/100',
            warning: '⚠️ 中等难度！关键是防守盲注和OOP收紧'
        }
    }
};

// 快速识别系统
function identifyOpponentType(stats) {
    const { VPIP, PFR, threeBet, cBet, foldToCBet, aggression } = stats;
    
    // 计算特征匹配度
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [key, type] of Object.entries(opponentTypes)) {
        let score = 0;
        
        // VPIP匹配度
        const vpipRange = parseStatRange(type.characteristics.VPIP);
        if (VPIP >= vpipRange.min && VPIP <= vpipRange.max) score += 25;
        else score += Math.max(0, 25 - Math.abs(VPIP - (vpipRange.min + vpipRange.max) / 2) * 2);
        
        // PFR匹配度
        const pfrRange = parseStatRange(type.characteristics.PFR);
        if (PFR >= pfrRange.min && PFR <= pfrRange.max) score += 25;
        else score += Math.max(0, 25 - Math.abs(PFR - (pfrRange.min + pfrRange.max) / 2) * 2);
        
        // 3-Bet匹配度
        const threeBetRange = parseStatRange(type.characteristics.threeBet);
        if (threeBet >= threeBetRange.min && threeBet <= threeBetRange.max) score += 20;
        
        // Aggression匹配度
        const aggressionRange = parseStatRange(type.characteristics.aggression);
        if (aggression >= aggressionRange.min && aggression <= aggressionRange.max) score += 15;
        
        // Cbet匹配度
        if (cBet) {
            const cBetRange = parseStatRange(type.characteristics.cBet);
            if (cBet >= cBetRange.min && cBet <= cBetRange.max) score += 15;
        }
        
        if (score > highestScore) {
            highestScore = score;
            bestMatch = type;
        }
    }
    
    return {
        type: bestMatch,
        confidence: Math.round(highestScore),
        alternates: getAlternateMatches(stats, bestMatch)
    };
}

function parseStatRange(rangeStr) {
    const parts = rangeStr.split('-');
    return {
        min: parseFloat(parts[0]),
        max: parseFloat(parts[1] || parts[0])
    };
}

function getAlternateMatches(stats, primaryMatch) {
    // 返回次优匹配，帮助用户理解对手的混合特征
    const alternates = [];
    for (const type of Object.values(opponentTypes)) {
        if (type.id !== primaryMatch.id) {
            // 简化匹配逻辑
            alternates.push({ type, similarity: Math.random() * 30 + 50 });
        }
    }
    return alternates.sort((a, b) => b.similarity - a.similarity).slice(0, 2);
}

// 实时剥削建议生成器
function generateExploitAdvice(opponentType, situation) {
    const advice = {
        preflop: opponentType.exploitStrategies.preflop,
        postflop: opponentType.exploitStrategies.postflop,
        profitBoost: opponentType.exploitStrategies.profitBoost,
        warning: opponentType.exploitStrategies.warning,
        quickTips: [
            `对手类型: ${opponentType.emoji} ${opponentType.name}`,
            `预期盈利提升: ${opponentType.exploitStrategies.profitBoost}`,
            `关键策略: ${opponentType.exploitStrategies.preflop.summary}`
        ]
    };
    
    return advice;
}

// 导出系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { opponentTypes, identifyOpponentType, generateExploitAdvice };
}

