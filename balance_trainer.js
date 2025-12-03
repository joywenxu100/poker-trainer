// 平衡训练模块 - 让每个action都无法被exploit
// Balance Training Module - Make Every Action Unexploitable

const balanceTrainer = {
    // 平衡的核心概念
    corePhilosophy: {
        definition: '平衡 = 每个action都包含价值和诈唬的混合，让对手无法exploit',
        
        example: {
            unbalanced: {
                cbet: '你Cbet 95%时间',
                check: '你Check 5%时间',
                problem: '❌ 你Check = 你弱 = 对手可以Bet偷池',
                exploitability: '对手可以+10 BB/100'
            },
            balanced: {
                cbet: '你Cbet 70%（包括50%价值+20%诈唬）',
                check: '你Check 30%（包括15%强慢打+15%弱牌）',
                result: '✅ 对手无法通过你的action判断你的牌力',
                exploitability: '对手无法exploit'
            }
        },

        GTO_Balance: {
            principle: '在GTO策略中，每个分支都是平衡的',
            implementation: [
                '你的Bet range包含nuts和bluff',
                '你的Check range包含强牌和弱牌',
                '你的Raise range包含价值和诈唬',
                '对手无法通过action获得信息'
            ]
        }
    },

    // Cbet平衡
    cbetBalance: {
        // 干牌面平衡
        dryBoard: {
            example: 'K♠7♦2♣',
            unbalanced_approach: {
                cbetFreq: '95%',
                cbetRange: '100% of your range',
                checkFreq: '5%',
                checkRange: '完全miss',
                problem: '❌ Check = 你没牌'
            },
            
            balanced_approach: {
                cbetFreq: '70-75%',
                cbetComposition: {
                    value: '50% (顶对+, 超对, 暗三)',
                    bluff: '50% (A高, Q高, 后门听牌)',
                    examples_value: ['AK', 'KQ', 'KJ', 'QQ', 'AA', '22(set)'],
                    examples_bluff: ['AJ', 'AT', 'A9', 'QJ', 'Q9', '98s']
                },
                checkFreq: '25-30%',
                checkComposition: {
                    slowPlay: '50% (强牌慢打)',
                    giveUp: '50% (完全miss)',
                    examples_slowPlay: ['KK', 'AA', 'K7s(两对)', '77(set)', '22(set)'],
                    examples_giveUp: ['65s', '54s', 'J9', 'T9', '43s']
                },
                result: '✅ 对手无法通过Check判断你的牌力'
            },

            training: {
                exercise: '每次在干牌面时，问自己：',
                questions: [
                    '1. 我Check的25%牌里，是否有强牌？',
                    '2. 我Cbet的70%牌里，是否有bluff？',
                    '3. 对手看到我Check，能知道我的牌力吗？'
                ],
                goal: '让答案都是NO（对手无法知道）'
            }
        },

        // 湿牌面平衡
        wetBoard: {
            example: 'J♠T♦9♣',
            unbalanced_approach: {
                cbetFreq: '60%',
                cbetRange: '只用强牌（两对+, 顺子）',
                checkFreq: '40%',
                checkRange: '所有弱牌和听牌',
                problem: '❌ Cbet = 你有强牌，对手只call'
            },

            balanced_approach: {
                cbetFreq: '55-60%',
                cbetComposition: {
                    value: '40% (两对+, 顶对顶踢脚)',
                    semiBluff: '40% (OESD+同花, 超对)',
                    bluff: '20% (A高+后门同花)',
                    sizing: '66-75% pot'
                },
                checkFreq: '40-45%',
                checkComposition: {
                    checkRaise: '30% (坚果+强听牌)',
                    checkCall: '40% (中对, 弱顶对, 听牌)',
                    checkFold: '30% (完全miss)'
                },
                result: '✅ Cbet包含不同强度的牌'
            }
        },

        // A高牌面平衡
        highBoard: {
            example: 'A♣K♦5♥',
            balanced_approach: {
                cbetFreq: '75%',
                cbetComposition: {
                    value: '55% (Ax, KK+, AK)',
                    bluff: '45% (QQ-88, 听牌, Kx)',
                    sizing: '40-50% pot (Range Cbet)'
                },
                checkFreq: '25%',
                checkComposition: {
                    trap: '40% (AA, AK, A5s)',
                    weak: '60% (完全miss, 小对)'
                }
            }
        }
    },

    // Check-Raise平衡
    checkRaiseBalance: {
        // 当前问题
        currentProblem: {
            typicalLAG: {
                checkRaiseFreq: '11-17%',
                composition: '8-12% 价值 + 3-5% 诈唬',
                problem: '❌ 太低！对手可以无限Cbet',
                exploitability: '对手Cbet 95%，+10 BB/100'
            }
        },

        // 平衡方案
        balancedSolution: {
            checkRaiseFreq: '20-25%',
            composition: {
                value: '12-15%',
                valueHands: [
                    '暗三',
                    '两对',
                    '坚果同花',
                    '坚果顺子',
                    '超强顶对 (AK on Axx)'
                ],
                bluff: '8-10%',
                bluffHands: [
                    '坚果同花听牌',
                    'OESD + 同花听牌',
                    'OESD + 超对',
                    '后门同花 + 后门顺子 + overcard'
                ],
                ratio: '价值:诈唬 = 1.5:1',
                sizing: '2.5-3x Cbet'
            },
            effect: {
                onOpponent: '对手Cbet频率必须降到60-65%',
                yourProfit: '+15 BB/100'
            }
        },

        // 训练方法
        training: {
            step1: {
                goal: '识别Check-Raise spots',
                criteria: [
                    '你OOP且miss但有equity',
                    '对手Cbet频率70%+',
                    '牌面有你可以代表的nuts',
                    '你有blockers'
                ]
            },
            step2: {
                goal: '平衡你的Check-Raise range',
                practice: [
                    '每10次Check-Raise，6次是价值，4次是bluff',
                    '价值: 两对+',
                    'Bluff: 强听牌 (12+ outs)',
                    'Sizing一致（2.5-3x）'
                ]
            },
            step3: {
                goal: '追踪效果',
                metrics: [
                    '对手Cbet频率是否下降？',
                    '你的Check-Raise成功率？',
                    'Bluff CR成功率应该60%+',
                    '价值CR应该被Call/Raise 80%+'
                ]
            }
        }
    },

    // 3-Bet平衡
    threeBetBalance: {
        // 位置平衡
        byPosition: {
            BTN_vs_CO: {
                threeBetFreq: '16-18%',
                composition: {
                    value: '55% (JJ+, AJs+, KQs, AQo+)',
                    valuePercent: '9-10%',
                    bluff: '45% (A2s-A5s, K9s-K7s, Q9s-Q7s, J9s, T9s, 98s, 87s, 76s)',
                    bluffPercent: '7-8%',
                    ratio: '价值:诈唬 = 1.2:1'
                },
                sizing: '3x (CO 2.5BB open → 7.5BB 3-Bet)'
            },

            SB_vs_BTN: {
                threeBetFreq: '14-16%',
                composition: {
                    value: '60% (99+, ATs+, KJs+, AJo+)',
                    bluff: '40% (A2s-A7s, K8s-K5s, Q9s-Q6s, suited connectors)',
                    ratio: '价值:诈唬 = 1.5:1',
                    reason: 'OOP需要更多价值'
                },
                sizing: '3.5x'
            }
        },

        // 平衡原则
        balancePrinciples: {
            rule1: {
                name: '价值:诈唬比例',
                ratio: '1.2:1 to 1.8:1',
                reason: '确保即使被call，你的range仍然强'
            },
            rule2: {
                name: '诈唬手选择',
                criteria: [
                    '有blockers (A, K)',
                    '有playability (suited connectors)',
                    '有equity when called (wheel aces)',
                    '不太弱也不太强（中等牌3-Bet更亏）'
                ]
            },
            rule3: {
                name: 'Sizing一致性',
                principle: '价值和诈唬sizing相同',
                reason: '否则对手可以通过sizing推断'
            }
        }
    },

    // 河牌平衡
    riverBalance: {
        // 河牌决策平衡
        decisionBalance: {
            scenario: '你是IP，河牌对手Check to you',
            
            unbalanced: {
                withNuts: 'Bet 100%',
                withBluff: 'Bet 80%',
                withMedium: 'Check 100%',
                problem: '❌ 你Check = 你中等牌，对手可以Bet偷'
            },

            balanced: {
                withNuts: {
                    bet: '70%',
                    check: '30% (诱导bluff或控池)'
                },
                withBluff: {
                    bet: '40%',
                    check: '60%'
                },
                withMedium: {
                    bet: '30% (Blocking bet)',
                    check: '70%'
                },
                result: '✅ 对手无法从你的Check推断你的牌力'
            }
        },

        // 河牌Bet sizing平衡
        sizingBalance: {
            principle: '不同强度的牌用相同sizing',
            
            implementation: {
                polarizedSpots: {
                    when: '河牌完成听牌',
                    sizing: '75-100% pot',
                    range: [
                        '价值: 坚果+',
                        'Bluff: 完全miss',
                        '不包含: 中等牌（Check）'
                    ],
                    ratio: '价值:诈唬 = 1.5:1'
                },
                
                mergedSpots: {
                    when: '河牌brick',
                    sizing: '50-66% pot',
                    range: [
                        '价值: 顶对+',
                        'Bluff: A高, 弱对',
                        '包含: 不同强度的牌'
                    ],
                    ratio: '价值:诈唬 = 2:1'
                },

                thinValue: {
                    when: 'vs 弱玩家',
                    sizing: '40-55% pot',
                    range: '顶对弱踢脚, 中对',
                    bluff: '很少bluff vs 弱玩家'
                }
            }
        }
    },

    // 范围平衡训练
    rangeBalanceTraining: {
        // 练习1: Cbet range构建
        exercise1: {
            name: 'Cbet Range平衡练习',
            scenario: '你CO open，BTN call。Flop K♠8♥3♦',
            yourRange: ['AA-22', 'AKo-A2o', 'AKs-A2s', 'KQo-K9o', 'KQs-K2s', 'QJo-Q9o', 'QJs-Q2s', 'JTo-J9o', 'JTs-J2s', 'T9s-T2s', '98s-92s', '87s-82s', '76s-72s', '65s-62s', '54s'],
            
            task: '把你的range分成3组',
            solution: {
                cbetValue: {
                    hands: ['AA-JJ', 'AK', 'KQ', 'KJ', 'KT', 'K9', '88', '33'],
                    percent: '40% of your range',
                    reason: '强牌需要保护和价值'
                },
                cbetBluff: {
                    hands: ['A9-A2', 'QJ', 'QT', 'JT', 'T9', '98', '76', '65'],
                    percent: '30% of your range',
                    reason: '有equity或后门听牌'
                },
                check: {
                    hands: ['TT-99', 'K8(慢打)', 'A8', 'Q9', 'J9', '77-44', '22(慢打)'],
                    percent: '30% of your range',
                    reason: '中等牌控池或强牌慢打'
                }
            },
            
            verify: '你的Check range包含强牌吗？（✅ 有：K8, 22 set）'
        },

        // 练习2: Check-Raise range平衡
        exercise2: {
            name: 'Check-Raise Range平衡',
            scenario: '你BB，对手BTN open你call。Flop T♠9♠6♣，对手Cbet',
            yourRange: 'BB call range vs BTN',
            
            task: '构建平衡的Check-Raise range',
            solution: {
                checkRaiseValue: {
                    hands: ['TT', '99', '66', 'T9', 'T6s', '96s', 'JT', 'QT'],
                    percent: '12% of your range',
                    reason: '两对+或强顶对'
                },
                checkRaiseBluff: {
                    hands: ['A♠K♠', 'A♠Q♠', 'K♠Q♠', 'Q♠J♠', 'J♠8♠', '8♠7♠', '7♠5♠'],
                    percent: '8% of your range',
                    reason: '坚果同花听牌+overs或OESD'
                },
                checkCall: {
                    hands: ['Tx', '9x', '88', '77', '弱同花听牌', '顺子听牌'],
                    percent: '50% of your range'
                },
                checkFold: {
                    hands: ['A高无听牌', '完全miss'],
                    percent: '30% of your range'
                }
            },
            
            ratio: '价值:诈唬 = 12:8 = 1.5:1 ✅ 平衡'
        },

        // 练习3: River决策平衡
        exercise3: {
            name: 'River决策平衡',
            scenario: '你IP，河牌K♠7♦2♣-8♥-A♠，对手Check to you',
            
            task: '不同牌力如何action',
            solution: {
                withNuts: {
                    hands: ['AA', 'KK', 'A8', '88', 'A7', '77', '22'],
                    bet: '75%',
                    check: '25%',
                    reason: '偶尔check诱导bluff或给对手摊牌机会'
                },
                withStrong: {
                    hands: ['AK', 'AQ', 'AJ', 'AT'],
                    bet: '60%',
                    check: '40%',
                    reason: '价值bet或check back'
                },
                withMedium: {
                    hands: ['KQ', 'KJ', 'KT', 'K9'],
                    bet: '20% (blocking bet 33% pot)',
                    check: '80%',
                    reason: '主要check，偶尔blocking bet'
                },
                withBluff: {
                    hands: ['QJ', 'QT', 'JT', 'T9'],
                    bet: '30%',
                    check: '70%',
                    reason: '选择性bluff'
                }
            },
            
            result: '对手看到你Check，无法确定你的牌力（可能是nuts，可能是中等，可能是bluff）'
        }
    },

    // 平衡检查清单
    balanceChecklist: {
        beforeEveryAction: [
            '1. 我的Cbet range包含价值和诈唬吗？',
            '2. 我的Check range包含强牌吗？',
            '3. 对手能从我的action推断我的牌力吗？',
            '4. 我的sizing对所有牌力都一致吗？',
            '5. 我的价值:诈唬比例合理吗（1.5:1到2:1）？'
        ],

        sessionReview: [
            '1. 我今天Cbet了多少次？其中多少是诈唬？',
            '2. 我今天Check back了多少次？其中有强牌吗？',
            '3. 我的Check-Raise频率是否足够（20%+）？',
            '4. 对手是否识破了我的patterns？',
            '5. 我有哪些action太predictable？'
        ]
    },

    // 平衡vs剥削
    balanceVsExploit: {
        philosophy: {
            GTO: '平衡策略是baseline，避免被exploit',
            exploit: '识别对手弱点后，偏离平衡去剥削',
            balance: '当被针对或不确定时，回到平衡'
        },

        whenToBalance: [
            '✅ 对手是强TAG/LAG玩家',
            '✅ 对手在针对你',
            '✅ 你不确定对手倾向',
            '✅ 多人底池',
            '✅ 大底池/重要spot'
        ],

        whenToExploit: [
            '✅ 对手是Nit（他们fold太多）',
            '✅ 对手是Calling Station（停止bluff）',
            '✅ 对手有明显leak',
            '✅ 你有clear read'
        ],

        exampleDecision: {
            situation: '干牌面K♠7♦2♣，你miss',
            
            balanced: {
                action: 'Cbet 70%时间（包括这次）',
                sizing: '40% pot',
                reason: '保持平衡，让对手无法exploit你的Check'
            },
            
            exploitative_vs_Nit: {
                action: 'Cbet 95%时间（一定Cbet）',
                sizing: '33% pot',
                reason: 'Nit fold 85%+，无需平衡'
            },
            
            exploitative_vs_CallingStation: {
                action: 'Check 100%（不Cbet）',
                reason: 'Calling Station不fold，不要bluff'
            }
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = balanceTrainer;
}

