// 翻后策略模块 - 世界级LAG玩家必备
// Postflop Strategies Module for World-Class LAG Players

const postflopStrategies = {
    // 1. Cbet策略 (持续下注)
    cbet: {
        dryBoards: {
            frequency: '85-95%',
            sizing: '33-50% pot',
            examples: ['K♠7♦2♣', 'A♣8♥3♦', 'Q♦9♠4♣'],
            explanation: '干牌面（不连接、不同花）对Open者极度有利，几乎总是Cbet',
            reasoning: [
                '对手很难击中这种牌面',
                '你代表强Ax/Kx高对',
                '小sizing即可赢得底池',
                '即使被跟注，转牌仍有主动权'
            ],
            ranges: {
                valueBet: ['顶对+', '超对', '暗三', '两对+'],
                bluff: ['A高', 'K高带后门听牌', '任何有摊牌价值的牌'],
                frequency: '90%+ 的翻前范围'
            },
            profit: '+15 BB/100'
        },
        wetBoards: {
            frequency: '60-70%',
            sizing: '66-75% pot',
            examples: ['J♠T♦9♣', '8♥7♠6♦', 'Q♦J♣9♠'],
            explanation: '湿牌面（连接、同花）需要选择性Cbet，大sizing保护',
            reasoning: [
                '对手容易击中两对/顺子/听牌',
                '需要更大sizing保护强牌',
                '诈唬频率降低到40-50%',
                '多用check-call/check-raise'
            ],
            ranges: {
                valueBet: ['两对+', '顺子', '暗三', '超对(需要保护)'],
                bluff: ['强听牌(OESD+同花听牌)', '超对+后门同花', '顶对带踢脚'],
                giveUp: ['A高无听牌', '完全miss的小对']
            },
            profit: '+8 BB/100'
        },
        highBoards: {
            frequency: '80-90%',
            sizing: '40-50% pot',
            examples: ['A♠K♣5♦', 'K♦Q♥7♠', 'A♣J♠4♦'],
            explanation: 'A/K高牌面极度有利于Open者，频繁Cbet',
            reasoning: [
                'Open范围包含所有AK/AQ/KQ',
                '对手很难有顶对顶踢脚',
                '中等sizing平衡价值和诈唬',
                'IP时可以控池打薄价值'
            ],
            ranges: {
                valueBet: ['顶对弱踢脚+', 'AK/AQ', '超对', '暗三'],
                bluff: ['口袋对(88-QQ)', 'Kx带后门', 'Q高带后门'],
                sizing: 'Range Cbet策略，统一sizing'
            },
            profit: '+12 BB/100'
        },
        // 深筹码特殊考虑
        deepStackAdjustments: {
            SPR_15plus: {
                strategy: '更多控池Cbet，准备多条街价值',
                sizing: '30-40% pot (更小)',
                philosophy: '深筹码时不急于全压，保留操作空间'
            },
            multiway: {
                strategy: '大幅收紧Cbet频率到50-60%',
                focus: '只Cbet强牌和坚果听牌',
                note: '多人底池极易失控，优先check-call'
            }
        }
    },

    // 2. Float玩法 (翻牌Call，转牌偷)
    float: {
        description: 'Float是松凶玩家最赚钱的技巧之一！利用位置优势在转牌偷池',
        requirements: [
            '✅ 必须有位置 (IP)',
            '✅ 对手是紧弱玩家 (70%+ fold to turn barrel)',
            '✅ 干牌面或半干牌面',
            '✅ 你有弱对子或后门听牌'
        ],
        execution: {
            flop: {
                action: 'Call对手的Cbet',
                handStrength: '弱对、后门听牌、A高',
                sizing: '接受任何sizing'
            },
            turn: {
                action: '对手Check时下注60-75%底池',
                frequency: '80-90% 的时间',
                reasoning: '对手Cbet后Check表示弱势，立即施压'
            },
            river: {
                ifCalled: 'Check back或小bet看摊牌',
                ifRaised: 'Fold（对手终于有牌了）'
            }
        },
        bestSpots: {
            vsNit: {
                successRate: '85%+',
                profit: '+12 BB/100',
                example: '他Cbet K72，你Call 44，转牌他Check，你Bet 75%，他Fold'
            },
            vsWeakTAG: {
                successRate: '70%+',
                profit: '+8 BB/100',
                note: '弱紧凶只在强牌时多条街下注'
            }
        },
        avoidSpots: [
            '❌ 对手是Calling Station（不会弃牌）',
            '❌ 湿牌面（对手可能有听牌）',
            '❌ 你OOP（无位置）',
            '❌ 多人底池'
        ],
        exampleHand: {
            scenario: 'BTN vs BB',
            flop: 'K♠7♦2♣',
            yourHand: '5♣4♣',
            opponentBets: '40% pot',
            yourAction: 'Call (Float)',
            turn: '8♥',
            opponentChecks: true,
            yourBet: '65% pot',
            opponentFolds: true,
            profit: '+6BB'
        },
        profit: '+10 BB/100 vs 合适对手'
    },

    // 3. Check-Raise策略
    checkRaise: {
        description: 'Check-Raise是最强的进攻武器，用于：1) 价值最大化 2) 保护范围 3) 诈唬',
        
        valueCheckRaise: {
            frequency: '8-12% OOP翻牌范围',
            hands: ['暗三', '两对', '顺子', '同花', '超强顶对(AK on Axx)'],
            sizing: '2.5-3x Cbet',
            reasoning: [
                '让对手用弱牌Cbet后难以弃牌',
                '建立大底池',
                'IP对手通常会float，正好价值',
                '平衡你的check-call范围'
            ],
            bestBoards: {
                paired: {
                    example: 'K♠K♣7♦',
                    hand: 'Kx',
                    reasoning: '对手会Cbet A高/Q高，你有坚果'
                },
                monotone: {
                    example: '9♠7♠4♠',
                    hand: 'A♠X♠',
                    reasoning: '坚果同花对Cbet范围有巨大优势'
                }
            },
            profit: '+18 BB/100'
        },

        bluffCheckRaise: {
            frequency: '3-5% OOP翻牌范围',
            hands: [
                '强听牌(OESD + 同花听牌)',
                '坚果同花听牌',
                '两端顺子听牌 + 超对',
                '后门同花 + 后门顺子'
            ],
            sizing: '2.5-3x Cbet',
            reasoning: [
                '大量equity作为保险',
                '让对手难以继续',
                '平衡价值check-raise',
                '即使被call也有机会改进'
            ],
            bestSpots: [
                '✅ 对手是紧凶 (TAG)，Cbet后容易弃牌',
                '✅ 湿牌面（你的听牌可信度高）',
                '✅ 你有阻断牌（Ax同花听牌）',
                '✅ SPR < 8（全压压力大）'
            ],
            exampleHand: {
                board: 'J♠9♠3♦',
                yourHand: 'T♠8♠',
                equity: '54% (OESD + 同花听牌)',
                opponentCbets: '50% pot',
                yourCheckRaise: '3x to 150% pot',
                outcome: '对手Fold 70%，Call你仍有54% equity'
            },
            profit: '+8 BB/100'
        },

        mergedCheckRaise: {
            concept: '混合价值和诈唬，让对手无法exploitive',
            ratio: '价值:诈唬 = 2:1 最优',
            implementation: '每次check-raise时，对手无法确定你是价值还是诈唬'
        }
    },

    // 4. 延迟Cbet (Delayed Cbet)
    delayedCbet: {
        description: '翻牌Check，转牌下注。强大的欺骗性武器',
        
        whenToUse: [
            '翻牌湿牌面（不适合立即Cbet）',
            '你有弱顶对/中对（需要控池）',
            '你完全miss但有位置',
            '转牌改进成顺子/同花听牌'
        ],

        execution: {
            flop: {
                action: 'Check',
                appearance: '表示弱牌或放弃',
                actualHands: ['A高', '弱对', 'K高', '后门听牌']
            },
            turn: {
                action: 'Bet 60-75% pot',
                trigger: '对手Check或转牌改进你的牌',
                reasoning: [
                    '对手认为你弱，更容易弃牌',
                    '转牌brick对你更有利',
                    '你代表延迟价值（慢打强牌）'
                ]
            }
        },

        bestScenarios: {
            scenario1: {
                flop: 'J♠T♦7♣',
                yourHand: 'A♠K♠',
                flopAction: 'Check (太湿不适合Cbet)',
                turn: '3♦',
                turnAction: 'Bet 66% (brick牌对你有利)',
                successRate: '75%'
            },
            scenario2: {
                flop: 'K♦9♠4♣',
                yourHand: 'A♣Q♣',
                flopAction: 'Check (A高控池)',
                turn: 'Q♥',
                turnAction: 'Bet 75% (击中顶对)',
                value: '薄价值+保护'
            }
        },

        profit: '+6 BB/100'
    },

    // 5. 河牌薄价值下注 (Thin Value Betting)
    thinValueBetting: {
        difficulty: '⭐⭐⭐⭐⭐ 最难技能！区分优秀玩家和世界级玩家',
        description: '用中等强度的牌在河牌下注赚取价值',

        definition: '当你的牌强到能击败对手50-65%的跟注范围时下注',

        requirements: [
            '对手是Calling Station或弱玩家',
            '牌面不scary（没有明显听牌成型）',
            '你能读懂对手的跟注范围',
            '有位置优势（IP）'
        ],

        handsToValueBet: {
            marginal: [
                '顶对弱踢脚 (A9 on A743K)',
                '中对 (88 on KJ842)',
                '第二对顶踢脚 (AK on KJ852)',
                '弱两对 (J8 on J842K)'
            ],
            sizing: '40-55% pot',
            reasoning: '小sizing让弱牌跟注，同时限制损失'
        },

        readingOpponent: {
            callingStation: {
                description: 'VPIP 40%+, Aggression <1.5, 不爱弃牌',
                exploit: '疯狂薄价值！他会用任何对子跟注',
                example: '你KT on KJ842，他可能跟注K2, J9, 88',
                profit: '+15 BB/100'
            },
            weakPlayer: {
                description: '不理解范围，过度跟注',
                exploit: '河牌bet任何对子以上',
                note: '他们认为你总是诈唬'
            }
        },

        avoidSpots: [
            '❌ 对手是Nit（不会用弱牌跟注）',
            '❌ 牌面Scary（三张同花/四张顺子）',
            '❌ 对手一直主动（他可能很强）',
            '❌ 你OOP（被加注很尴尬）'
        ],

        exampleHands: [
            {
                hero: 'A♠9♠',
                board: 'A♦7♣3♥8♠2♦',
                opponentType: 'Calling Station',
                riverBet: '50% pot',
                opponentCalls: 'A6, A4, 77, 88',
                result: '+5.5BB',
                analysis: '对手用弱Ax跟注，薄价值成功'
            },
            {
                hero: 'K♣J♥',
                board: 'K♠9♦4♣2♥7♠',
                opponentType: 'Weak TAG',
                riverBet: '45% pot',
                opponentCalls: 'K8, K7, 99, 77',
                result: '+4.5BB',
                analysis: '极薄价值，但对手范围足够弱'
            }
        ],

        profit: '+12 BB/100 vs 弱玩家'
    },

    // 6. 多桶诈唬 (Multi-barrel Bluffing / Triple Barrel)
    multiBarrelBluff: {
        description: '3条街持续施压，代表极强牌力',
        difficulty: '⭐⭐⭐⭐ 高难度，需要读牌和勇气',

        requirements: [
            '你有credible story（可信的故事）',
            '对手不是Calling Station',
            '牌面支持你的range',
            '你有blockers（阻断牌）'
        ],

        execution: {
            flop: {
                action: 'Cbet 33-50% pot',
                range: '任何两张牌（诈唬或半诈唬）'
            },
            turn: {
                action: 'Barrel 66-75% pot',
                condition: '对手Call',
                story: '你代表顶对+或听牌'
            },
            river: {
                action: 'Barrel 75-100% pot (甚至超池)',
                condition: '对手Call turn',
                story: '你代表坚果或极强两对+',
                successRate: '对手必须用75%+范围Call才能防守你'
            }
        },

        bestStories: [
            {
                board: 'K♠9♦3♣ - 7♥ - 2♠',
                yourHand: 'A♠J♠',
                story: 'AK, KK, AA',
                believability: '⭐⭐⭐⭐⭐ 极可信',
                sizing: 'Flop 40%, Turn 66%, River 80%',
                successRate: '85%+'
            },
            {
                board: 'J♥T♦7♠ - 4♣ - 2♦',
                yourHand: 'A♠Q♠',
                story: 'QQ, JJ, 顺子',
                believability: '⭐⭐⭐⭐ 可信',
                sizing: 'Flop 50%, Turn 75%, River 100%',
                successRate: '70%'
            }
        ],

        avoidSpots: [
            '❌ 对手已经投入大量筹码（pot committed）',
            '❌ 对手是Calling Station（不会弃牌）',
            '❌ 你的story不一致',
            '❌ 你没有blockers（对手可能有坚果）'
        ],

        blockers: {
            importance: '⭐⭐⭐⭐⭐ 极其重要',
            examples: [
                'A♠ blocks AA (减少对手有AA的可能)',
                'K♦ on K♠Q♣J♥ blocks KK/KQ/KJ',
                'A♠ on 三张同花牌面 blocks 坚果同花'
            ],
            usage: '选择有blockers的牌诈唬，成功率提升20%+'
        },

        profit: '+10 BB/100 (vs 紧凶玩家)'
    },

    // 7. 阻断下注 (Blocking Bet / Denial Bet)
    blockingBet: {
        description: '用极小bet（20-33% pot）控制底池大小，防止对手大额下注',
        difficulty: '⭐⭐⭐ 中等难度，需要精准的范围控制',

        concept: '用边缘牌主动下注小额，让对手难以加注，获得便宜摊牌',

        whenToUse: [
            '你有中等强度牌（第二对、弱顶对）',
            '河牌，你担心对手会大bet',
            '有位置优势（IP）',
            '对手是平衡玩家（既有价值也有诈唬）'
        ],

        sizing: '20-35% pot',
        reasoning: [
            '给自己便宜的摊牌价格',
            '对手用诈唬加注的incentive降低',
            '对手强牌会加注，你可以fold',
            '对手弱牌会call/fold，你赢得底池'
        ],

        exampleHands: [
            {
                hero: 'K♣Q♦',
                board: 'K♠8♥4♣2♦7♠',
                concern: '对手可能有KJ+, 88, 两对',
                action: 'Bet 25% pot',
                outcome: [
                    '对手弱Kx/88-/听牌miss → Fold (你赢)',
                    '对手中等Kx → Call (便宜摊牌)',
                    '对手两对+ → Raise (你fold，止损)'
                ],
                benefit: '把50% pot的call变成25% pot'
            },
            {
                hero: 'A♥J♥',
                board: 'J♠9♣3♦5♠2♥',
                concern: '担心对手有JT, J9, 暗三',
                action: 'Bet 30% pot',
                result: '获得便宜摊牌，vs 诈唬fold equity'
            }
        ],

        vsRaise: {
            frequency: '对手会raise 15-25%时间',
            decision: [
                '对手紧凶 → Fold (他有强牌)',
                '对手松凶 → 考虑Call (他可能诈唬)',
                '底池赔率好 + 你有顶对 → Call'
            ]
        },

        profit: '+5 BB/100 (降低波动，保护中等牌)'
    },

    // 深筹码综合考虑
    deepStackPhilosophy: {
        coreIdeas: [
            '控池比全压重要（保留操作空间）',
            '小bet build pot（多条街价值）',
            '避免边缘spot堆叠（等待坚果spot）',
            '利用隐含赔率（对子/同花连牌）',
            '位置价值放大（IP能控制底池）'
        ],

        SPRmanagement: {
            SPR_15plus: {
                strategy: '极度谨慎，只用坚果全压',
                goodHands: '同花/顺子/暗三/超对顶set',
                avoidStacks: '顶对顶踢脚（可能输给两对）'
            },
            SPR_8_15: {
                strategy: '松凶玩家的天堂，灵活操作',
                goodHands: '所有投机牌，两对+全压',
                philosophy: '这是你的最佳SPR！'
            }
        },

        positionAdjustments: {
            IP: {
                cbetMore: '+10-15% frequency',
                thinValueMore: '可以更薄',
                floatMore: '+20% float frequency'
            },
            OOP: {
                checkRaiseMore: '+5% frequency',
                checkCallMore: '更多被动防守',
                避免: '减少多桶诈唬（易被float）'
            }
        }
    },

    // 训练建议
    trainingPath: {
        week1: {
            focus: 'Cbet策略',
            practice: '每天100手，专注Cbet sizing和频率',
            goal: '达到理论频率±5%'
        },
        week2: {
            focus: 'Float和延迟Cbet',
            practice: '识别合适spot，记录成功率',
            goal: '70%+ 成功率'
        },
        week3: {
            focus: 'Check-Raise和薄价值',
            practice: '读对手范围，大胆薄价值',
            goal: 'Check-raise至少10次，薄价值15次'
        },
        week4: {
            focus: '综合运用',
            practice: '混合所有技巧，记录盈利',
            goal: '翻后盈利提升到20+ BB/100'
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = postflopStrategies;
}

