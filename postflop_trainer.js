// 🎲 翻后决策训练器 - 70%盈利来源！
// Postflop Decision Training System

// 翻后策略数据库
const postflopStrategies = {
    // Cbet策略（持续下注）
    cbet: {
        dryBoards: {
            name: '干牌面 (K72r, A83r)',
            frequency: '80-95%',
            sizing: '33-50%底池',
            example: 'K♠7♥2♣',
            reasoning: '对手很难击中，Cbet成功率极高',
            hands: {
                range: '你的整个Open范围',
                adjustments: [
                    '✅ 用任何两张牌Cbet',
                    '✅ 小注即可（33-40%底池）',
                    '⚠️ 面对Check-Raise要准备弃牌',
                    '✅ 转牌延迟Cbet成功率高'
                ]
            }
        },
        wetBoards: {
            name: '湿牌面 (JT9r, 876r)',
            frequency: '50-65%',
            sizing: '66-75%底池',
            example: 'J♠T♥9♠',
            reasoning: '对手容易击中听牌和对子，要选择性下注',
            hands: {
                range: '强牌+强听牌',
                adjustments: [
                    '⚠️ 只用顶对+/强听牌Cbet',
                    '✅ 大注保护（66-75%底池）',
                    '❌ 空气牌频繁Check',
                    '✅ 用坚果听牌半诈唬'
                ]
            }
        },
        highBoards: {
            name: '高牌面 (AKQ, KQJ)',
            frequency: '70-85%',
            sizing: '40-50%底池',
            example: 'A♠K♥5♦',
            reasoning: 'A高牌面有利于Open者，应该频繁Cbet',
            hands: {
                range: '你的整个范围（包括空气）',
                adjustments: [
                    '✅ 用任何Ax Cbet',
                    '✅ 甚至KQ, QJ也可以Cbet',
                    '⚠️ 遇到抵抗要小心AA/AK',
                    '✅ 转牌继续施压'
                ]
            }
        },
        lowBoards: {
            name: '低牌面 (742, 863)',
            frequency: '60-75%',
            sizing: '33-50%底池',
            example: '7♠4♥2♦',
            reasoning: '双方都很难击中，频繁Cbet但sizing要小',
            hands: {
                range: '宽泛（但要注意对手类型）',
                adjustments: [
                    '✅ 用超对（99+）总是Cbet',
                    '⚠️ 用A高可以Cbet',
                    '❌ 完全空气建议Check',
                    '✅ 对子以下建议弃牌'
                ]
            }
        },
        pairedBoards: {
            name: '对子牌面 (KK7, 885)',
            frequency: '85-95%',
            sizing: '25-40%底池',
            example: 'K♠K♥7♦',
            reasoning: '对子牌面双方都没击中，小注Cbet成功率极高',
            hands: {
                range: '100%范围',
                adjustments: [
                    '✅ 用任何牌都可以Cbet',
                    '✅ 极小sizing（25-33%）',
                    '✅ 多桶诈唬成功率高',
                    '⚠️ 面对Check-Raise要尊重'
                ]
            }
        }
    },

    // Float玩法（翻牌Call，转牌偷）
    float: {
        description: '翻牌跟注Cbet，转牌在对手Check时下注偷取底池',
        bestSituations: [
            '对手是紧弱玩家（Cbet后经常放弃）',
            '你有位置优势',
            '干牌面（对手难以继续）',
            '你有后门听牌（额外胜率）'
        ],
        execution: {
            flop: {
                action: 'Call Cbet',
                requirements: [
                    '✅ 必须有位置（IP Float）',
                    '✅ 对手Cbet sizing < 60%',
                    '⚠️ 你至少有后门听牌或弱对子',
                    '❌ OOP不要Float（太危险）'
                ],
                handExamples: [
                    '任何弱对子 (77 on K94)',
                    '后门同花听牌 (A♠5♠ on K♥9♦2♠)',
                    'Gutshot (QJ on K93)',
                    '两张Over (AQ on 975)'
                ]
            },
            turn: {
                action: '对手Check时下注60-75%底池',
                successRate: '70-85% (vs 紧弱玩家)',
                adjustments: [
                    '✅ 对手Check = 你立即下注',
                    '✅ Sizing 60-75%底池',
                    '⚠️ 如果对手Call转牌，河牌要准备弃牌',
                    '❌ 对手转牌继续下注 = 你弃牌'
                ]
            }
        },
        profitBoost: '+5-10 BB/100 (vs 紧弱玩家)',
        warning: '⚠️ 不要对松凶玩家Float，他们会3-barrel！'
    },

    // Check-Raise策略
    checkRaise: {
        description: '翻牌Check，对手Cbet后加注',
        types: {
            value: {
                name: '价值Check-Raise',
                frequency: '8-12%',
                hands: [
                    '两对+ (暗三, 顺子, 同花)',
                    '强顶对 (AK on AJ5)',
                    '强听牌 + 对子 (QJ on JT8 - 两对+顺子听牌)'
                ],
                sizing: '3x Cbet (例如Cbet 6BB，你Raise到18BB)',
                goal: '榨取价值 + 保护强牌'
            },
            bluff: {
                name: '诈唬Check-Raise',
                frequency: '3-5%',
                hands: [
                    '强听牌 (OESD, FD)',
                    '后门同花+Gutshot',
                    'A高后门同花'
                ],
                sizing: '2.5-3x Cbet',
                goal: '立即赢得底池 OR 转牌继续半诈唬'
            }
        },
        bestBoards: [
            '湿牌面 (J♠T♥9♠) - 你有强听牌',
            '中牌面 (9♠8♥5♠) - 对手难以call',
            '你范围优势牌面'
        ],
        execution: {
            flop: 'Check',
            opponentCbets: 'Raise 2.5-3x',
            opponentFolds: '✅ 立即获利',
            opponentCalls: '⚠️ 转牌继续施压（如果你是bluff）或价值下注（如果你是value）',
            opponentReraises: '❌ 通常弃牌（除非你有坚果）'
        },
        frequency: '总Check-Raise频率应在 10-15%',
        warning: '⚠️ Check-Raise太频繁会被识破！保持平衡'
    },

    // 延迟Cbet (Delayed Cbet)
    delayedCbet: {
        description: '翻牌Check，转牌下注',
        when: [
            '翻牌牌面对你不利（你范围弱）',
            '对手是Calling Station（翻牌会call）',
            '你在转牌击中牌',
            '转牌出现恐吓牌'
        ],
        execution: {
            flop: 'Check (Show weakness)',
            turn: {
                action: 'Bet 60-75%底池',
                bestTurnCards: [
                    'A或K落地（恐吓牌）',
                    '第三张同花（你代表同花）',
                    '顺面完成（你代表顺子）',
                    '任何高牌'
                ]
            }
        },
        example: {
            scenario: '你CO Open AQ，BB Call',
            flop: '8♠6♥3♦ - 你Check（太干，Cbet会被float）',
            turn: 'K♠ - 你Bet 10BB进入12BB底池',
            reasoning: 'K是恐吓牌，对手会认为你击中KK或Kx'
        },
        successRate: '60-70%',
        profitBoost: '+3-6 BB/100'
    },

    // 河牌薄价值下注
    thinValueBetting: {
        description: '河牌用中等强度牌下注，期望被更弱的牌跟注',
        difficulty: '⭐⭐⭐⭐⭐ (最难技能)',
        when: [
            '你有顶对弱踢脚（AJ on AK752）',
            '第二对顶踢脚（KQ on A96K2）',
            '你击中小暗三（77 on AK772）',
            '对手是Calling Station'
        ],
        sizing: '40-55%底池（不要太大）',
        requirements: [
            '⚠️ 对手必须是松弱/鱼玩家',
            '❌ 不要对紧凶玩家薄价值',
            '✅ 你必须能Beat他们的跟注范围',
            '⚠️ 牌面不能太scary'
        ],
        examples: {
            good: {
                hand: 'AJ',
                board: 'A♠9♥5♦2♣7♥',
                river: 'Bet 8BB into 15BB',
                reason: '对手会用A8, A6, A5跟注'
            },
            bad: {
                hand: 'AJ',
                board: 'A♠K♥Q♦J♣T♥',
                river: 'Check',
                reason: '牌面太scary，对手只用更强牌call'
            }
        },
        profitBoost: '+8-15 BB/100 (vs 鱼玩家)',
        warning: '⚠️ 被河牌加注要准备弃牌！（除非对手是maniac）'
    },

    // 多桶诈唬 (3-Barrel Bluff)
    multiBarrelBluff: {
        description: '翻牌-转牌-河牌连续3次下注诈唬',
        difficulty: '⭐⭐⭐⭐ (高风险高回报)',
        requirements: [
            '✅ 对手必须是紧弱玩家（弃牌率高）',
            '✅ 你必须有credible story（可信的牌力故事）',
            '✅ 牌面发展对你有利',
            '❌ 不要对Calling Station多桶诈唬'
        ],
        execution: {
            flop: {
                action: 'Cbet 50%底池',
                requirement: '你需要代表强牌或强听牌'
            },
            turn: {
                action: 'Bet 65%底池',
                bestCards: [
                    'A或K落地（代表击中）',
                    '第三张同花（代表同花）',
                    '顺面完成（代表顺子）'
                ]
            },
            river: {
                action: 'Over-bet 125-150%底池',
                reasoning: '代表坚果，对手很难call',
                successRate: '60-75% vs 紧弱玩家'
            }
        },
        example: {
            hand: 'K♠Q♠',
            flop: 'A♥7♠3♠ - Cbet 6BB (代表Ax或同花听牌)',
            turn: '2♠ - Bet 12BB (击中同花！)',
            river: '8♥ - Bet 30BB into 24BB (代表坚果同花)',
            result: '对手弃掉Ax (他害怕同花)'
        },
        costOfFailure: '失败会损失大底池',
        profitBoost: '+10-20 BB/100 (vs 紧弱玩家)',
        frequency: '不要超过5%频率（会被识破）',
        warning: '⚠️ 被call时准备show bluff（建立形象）'
    },

    // 阻断下注 (Blocker Bet)
    blockerBet: {
        description: '河牌用小注（20-33%底池）阻止对手下大注',
        when: [
            '你有showdown价值但不够强',
            '害怕对手Over-bet',
            '你OOP想控制底池',
            '牌面完成听牌'
        ],
        sizing: '20-33%底池',
        goal: '便宜地到摊牌 OR 对手弃牌',
        examples: {
            good: {
                hand: 'KQ',
                board: 'K♠9♥5♦3♣A♥',
                river: 'Bet 4BB into 16BB (Block)',
                reason: 'K可能还good，但害怕对手有A'
            }
        },
        responses: {
            opponentFolds: '✅ 立即获利',
            opponentCalls: '✅ 便宜地摊牌',
            opponentRaises: '❌ 通常弃牌'
        },
        profitBoost: '+2-4 BB/100',
        warning: '⚠️ 不要对激进玩家blocker bet（他们会raise）'
    }
};

// SPR管理系统
const sprManagement = {
    definition: 'SPR = 有效筹码 / 底池大小',
    ranges: {
        low: {
            range: '0-3',
            strategy: 'Commit Range (全压范围)',
            hands: '顶对+ 应该全压',
            adjustments: [
                '✅ 减少投机，增加成手牌',
                '❌ 不要慢打强牌',
                '✅ 翻牌All-in频率高',
                '⚠️ Set通常直接全压'
            ]
        },
        medium: {
            range: '4-7',
            strategy: 'Mixed Strategy',
            hands: '需要更强牌才能全压（两对+）',
            adjustments: [
                '⚠️ 顶对需要谨慎（可能不够强）',
                '✅ 两对可以comfortably全压',
                '⚠️ 听牌要计算pot odds',
                '✅ 可以慢打坚果'
            ]
        },
        high: {
            range: '8-15',
            strategy: 'Deep Stack Play (深筹码打法)',
            hands: '需要坚果才考虑全压',
            adjustments: [
                '✅ 小对子setmine价值高',
                '✅ 同花连牌价值大',
                '⚠️ 顶对不够强（只下2条街）',
                '✅ 慢打坚果吸引action',
                '✅ 多桶诈唬效果好'
            ]
        },
        veryHigh: {
            range: '15+',
            strategy: '超深筹码 (你的游戏！)',
            hands: '只有坚果才全压',
            adjustments: [
                '✅ 投机牌价值最大化',
                '✅ 隐含赔率爆炸',
                '⚠️ 顶对只check-call',
                '✅ 暗三可以慢打1-2条街',
                '🔥 这是LAG玩家的天堂！'
            ]
        }
    },
    calculator: function(effectiveStack, pot) {
        const spr = effectiveStack / pot;
        let advice = '';
        
        if (spr <= 3) {
            advice = '低SPR: 顶对+全压，减少花哨操作';
        } else if (spr <= 7) {
            advice = '中SPR: 两对+全压，顶对谨慎';
        } else if (spr <= 15) {
            advice = '高SPR: 坚果或接近坚果才全压，多用位置';
        } else {
            advice = '超高SPR: 只有坚果全压，投机牌价值最大化！';
        }
        
        return { spr: spr.toFixed(1), advice };
    }
};

// 牌面纹理分析
function analyzeBoardTexture(board) {
    // board格式: ['A♠', 'K♥', '7♦']
    if (!board || board.length < 3) return null;
    
    const ranks = board.map(card => card[0]);
    const suits = board.map(card => card.slice(-1));
    
    // 判断是否同花面
    const isMonotone = suits.every(s => s === suits[0]);
    const isTwoTone = new Set(suits).size === 2;
    
    // 判断是否顺面
    const rankValues = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2};
    const values = ranks.map(r => rankValues[r]).sort((a, b) => b - a);
    const isConnected = values[0] - values[2] <= 4;
    
    // 判断是否对子面
    const isPaired = ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2];
    
    // 判断高低
    const isHighBoard = values[0] >= 11; // J+
    const isLowBoard = values[0] <= 9;
    
    // 综合判断湿度
    let texture = '';
    let wetness = 0;
    
    if (isPaired) {
        texture = 'Paired (对子面)';
        wetness = 20;
    } else if (isMonotone) {
        texture = 'Monotone (单色面)';
        wetness = 80;
    } else if (isTwoTone && isConnected) {
        texture = 'Wet (湿牌面)';
        wetness = 90;
    } else if (isConnected) {
        texture = 'Connected (连接面)';
        wetness = 70;
    } else if (isTwoTone) {
        texture = 'Two-Tone (双色面)';
        wetness = 50;
    } else {
        texture = 'Rainbow Dry (彩虹干面)';
        wetness = 10;
    }
    
    if (isHighBoard) texture += ' - High';
    else if (isLowBoard) texture += ' - Low';
    
    return {
        texture,
        wetness,
        isMonotone,
        isTwoTone,
        isConnected,
        isPaired,
        isHighBoard,
        isLowBoard,
        recommendation: wetness > 60 ? '谨慎Cbet，选择性下注' : 'Cbet频繁，用整个范围'
    };
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { postflopStrategies, sprManagement, analyzeBoardTexture };
}

