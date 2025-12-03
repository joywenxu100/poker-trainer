// 反针对策略模块 - 被针对后的反击策略
// Counter-Targeting Strategy - Fight Back When Being Exploited

const counterTargeting = {
    // 被针对后的立即反应
    immediateResponse: {
        // Level 1: 防守性调整（被严重针对时）
        defensiveAdjustment: {
            when: '检测到severe级别针对',
            actions: {
                preflop: {
                    tightenOpenRange: {
                        adjustment: '收紧Open范围20%',
                        from: 'UTG 12%, CO 42%, BTN 58%',
                        to: 'UTG 10%, CO 34%, BTN 46%',
                        reason: '减少被3-Bet的机会',
                        profit_recovery: '+10 BB/100'
                    },
                    reduce3BetBluff: {
                        adjustment: '减少3-Bet诈唬50%',
                        from: '诈唬频率 40-50%',
                        to: '诈唬频率 20-25%',
                        reason: '对手会4-Bet或call更多',
                        profit_recovery: '+8 BB/100'
                    },
                    avoidMarginPlay: {
                        adjustment: '避免边缘play',
                        examples: [
                            '停止用A5s从UTG1 Open',
                            '停止用K9s 3-Bet',
                            '停止4-Bet bluff'
                        ]
                    }
                },
                postflop: {
                    reduceCbetFreq: {
                        adjustment: '降低Cbet频率20%',
                        from: '干牌面85-95%, 湿牌面60-70%',
                        to: '干牌面65-75%, 湿牌面45-55%',
                        reason: '对手Check-raise频率太高',
                        profit_recovery: '+12 BB/100'
                    },
                    stopFloat: {
                        adjustment: '停止Float玩法',
                        duration: '至少10 orbits',
                        reason: '对手已经识破并反制',
                        alternative: '翻牌有真牌才Call'
                    },
                    stopMultiBarrel: {
                        adjustment: '停止多桶诈唬',
                        reason: '对手River call频率太高',
                        alternative: '只用价值牌多条街下注'
                    }
                }
            },
            duration: '至少20-30分钟或2-3小时',
            expectedResult: '止损，从-25 BB/100恢复到-5 BB/100'
        },

        // Level 2: 陷阱策略（中等针对时）
        trapStrategy: {
            when: '检测到moderate级别针对',
            philosophy: '用对手的aggressive反击他',
            
            traps: {
                slowPlayPremiums: {
                    name: '慢打超强牌',
                    hands: ['AA', 'KK', 'QQ'],
                    execution: {
                        preflop: 'Call对手的3-Bet而不是4-Bet',
                        flop: 'Check而不是Cbet',
                        turn: 'Check-call或Check-raise',
                        river: 'Check-raise或call他的bluff'
                    },
                    successRate: '80%',
                    avgProfit: '+45BB per trap',
                    frequency: '每20手用1次',
                    example: {
                        scenario: '你CO open AA，对手BTN 3-Bet',
                        yourAction: 'Call (而不是4-Bet)',
                        flop: 'K♠7♦2♣',
                        yourAction2: 'Check',
                        opponent: 'Bet 50% pot',
                        yourAction3: 'Call',
                        turn: '8♥',
                        yourAction4: 'Check',
                        opponent2: 'Bet 66% pot',
                        yourAction5: 'Check-raise 2.5x',
                        result: '他fold或全压，你赢大底池'
                    }
                },

                checkCallMonster: {
                    name: 'Check-Call坚果',
                    hands: ['暗三', '顺子', '同花', '葫芦'],
                    execution: {
                        flop: 'Check而不是Bet',
                        ifOpponentBets: 'Call',
                        turn: 'Check-call again',
                        river: 'Check-raise或Check-call'
                    },
                    reason: '对手认为你弱，会持续bluff',
                    avgProfit: '+35BB per trap',
                    example: {
                        scenario: '你66在K♠6♦3♣击中暗三',
                        yourAction: 'Check',
                        opponent: 'Cbet 40%',
                        yourAction2: 'Call',
                        turn: '9♥',
                        yourAction3: 'Check',
                        opponent2: 'Barrel 66%',
                        yourAction4: 'Call',
                        river: 'A♠',
                        yourAction5: 'Check',
                        opponent3: 'River bluff 80%',
                        yourAction6: 'Check-raise all-in',
                        result: '他认为你弱牌call down，送筹码'
                    }
                },

                limpReraiseTrap: {
                    name: 'Limp-Reraise反陷阱',
                    hands: ['QQ+', 'AK'],
                    when: '对手频繁隔离你的limp',
                    execution: {
                        preflop: 'Limp from EP/MP',
                        ifOpponentRaises: 'Reraise 3.5-4x',
                        ifOpponentCalls: '翻后Cbet aggressive'
                    },
                    frequency: '每orbit 1次',
                    successRate: '75%',
                    avgProfit: '+20BB when successful'
                }
            }
        }
    },

    // 反击策略
    counterAttack: {
        // Level 3: 反剥削（对手调整后）
        counterExploit: {
            when: '对手针对你一段时间后',
            philosophy: '利用对手的over-adjustment',
            
            strategies: {
                resumeAggression: {
                    name: '恢复部分aggression',
                    timing: '防守30分钟后',
                    adjustment: {
                        openRange: '从收紧后+5%',
                        threeBetBluff: '恢复到30%',
                        cbet: '恢复到70%'
                    },
                    reason: '对手以为你已经被压制',
                    expectedProfit: '+8 BB/100'
                },

                exploitTheirAdjustment: {
                    name: '剥削对手的调整',
                    scenarios: {
                        ifTheyOver3Bet: {
                            problem: '对手3-Bet你25%+',
                            counter: {
                                action: '4-Bet更多（从8% → 15%）',
                                hands: [
                                    '价值: JJ+, AQ+',
                                    '诈唬: A5s-A2s, K9s-K7s, suited connectors'
                                ],
                                reasoning: '他3-Bet太宽，很多是诈唬',
                                sizing: '2.2-2.5x their 3-Bet',
                                profit: '+15 BB/100'
                            }
                        },
                        
                        ifTheyOverCheckRaise: {
                            problem: '对手Check-raise你25%+',
                            counter: {
                                action: '更多Check back，然后Turn bet',
                                reasoning: '他Check-raise太频繁，用弱牌也CR',
                                execution: [
                                    'Flop: Check back with 顶对/中对',
                                    'Turn: Bet when he checks',
                                    'River: Thin value bet'
                                ],
                                profit: '+10 BB/100'
                            }
                        },

                        ifTheyCallDownTooMuch: {
                            problem: '对手River call你70%+',
                            counter: {
                                action: '停止bluff，疯狂薄价值',
                                hands: '顶对弱踢脚, 中对, 甚至第三对',
                                sizing: '40-55% pot',
                                reasoning: '他call太多，用任何对子都bet',
                                profit: '+18 BB/100'
                            }
                        }
                    }
                },

                levelUp: {
                    name: 'Level Up思维',
                    concept: '做出unexpected play',
                    examples: {
                        example1: {
                            situation: '对手知道你会Float',
                            yourPlay: '这次Float有真牌（顶对）',
                            result: '他Check-raise，你3-Bet，他fold'
                        },
                        example2: {
                            situation: '对手知道你Cbet少了',
                            yourPlay: '突然Cbet 90%一个orbit',
                            result: '他fold太多，你收割'
                        },
                        example3: {
                            situation: '对手以为你收紧了',
                            yourPlay: '突然3-Bet bluff 50%',
                            result: '他4-Bet少了，你3-Bet成功率高'
                        }
                    }
                }
            }
        }
    },

    // 策略切换系统
    strategySwitch: {
        phases: {
            phase1_observe: {
                duration: '前30分钟',
                strategy: '标准LAG',
                goal: '建立aggressive形象',
                VPIP: '32-38%'
            },

            phase2_detect: {
                duration: '30-60分钟',
                strategy: '观察对手反应',
                goal: '识别谁在针对你',
                monitoring: '使用targeted_detection.js'
            },

            phase3_defend: {
                trigger: '检测到被针对',
                duration: '20-40分钟',
                strategy: '防守性调整',
                goal: '止损',
                VPIP: '收紧到22-28%'
            },

            phase4_counterAttack: {
                trigger: '对手over-adjusted',
                duration: '30-60分钟',
                strategy: '反剥削',
                goal: '反击并盈利',
                VPIP: '恢复到28-35%'
            },

            phase5_reset: {
                trigger: '完成一个cycle',
                action: '重新评估桌面动态',
                decision: [
                    '如果还被针对 → 考虑换桌',
                    '如果反击成功 → 继续标准LAG',
                    '如果对手不再针对 → 恢复aggressive'
                ]
            }
        }
    },

    // 具体反针对战术
    specificTactics: {
        // 1. vs 过度3-Bet
        vs_excessive_3bet: {
            immediate: {
                action: '收紧Open范围20%',
                from: 'CO 42%',
                to: 'CO 34%'
            },
            trap: {
                action: 'Call 3-Bet with AA/KK/QQ',
                execution: '翻后check-call或check-raise',
                frequency: '15% of time'
            },
            counterAttack: {
                action: '4-Bet更多',
                from: '8% 4-Bet frequency',
                to: '15% 4-Bet frequency',
                hands: 'JJ+, AQ+, A5s-A2s, K9s+, suited connectors',
                sizing: '2.2-2.5x'
            }
        },

        // 2. vs 过度Check-Raise
        vs_excessive_checkraise: {
            immediate: {
                action: '降低Cbet频率20%',
                from: '75% Cbet',
                to: '55% Cbet'
            },
            trap: {
                action: '用强牌Check back',
                hands: '顶对+, 暗三, 两对',
                execution: 'Turn bet or check-raise',
                frequency: '20% of strong hands'
            },
            counterAttack: {
                action: 'Bet-call或Bet-3Bet vs Check-raise',
                hands: '顶对顶踢脚+',
                reasoning: '他CR太频繁，很多是bluff'
            }
        },

        // 3. vs 过度Call Down
        vs_excessive_calldown: {
            immediate: {
                action: '停止River bluff',
                rate: '减少80%'
            },
            exploit: {
                action: '薄价值3条街',
                hands: '顶对弱踢脚, 中对',
                sizing: 'Flop 40%, Turn 50%, River 55%',
                reason: '他call太多，用弱牌都bet'
            }
        },

        // 4. vs Limp-Reraise陷阱
        vs_limprr_trap: {
            immediate: {
                action: '停止孤立加注limper',
                alternative: 'Limp behind或Fold'
            },
            counterTrap: {
                action: '用AA/KK也Limp',
                execution: 'Limp，如果有人raise，你reraise',
                note: '反过来设陷阱'
            }
        },

        // 5. vs Float被Raise
        vs_float_exploited: {
            immediate: {
                action: '停止Float',
                duration: '至少20手'
            },
            alternative: {
                action: '用真牌Float',
                hands: '顶对, 中对, 强听牌',
                execution: '当被Turn raise时，考虑call或3-Bet'
            }
        }
    },

    // 心理战反击
    psychologicalCounter: {
        showDownManagement: {
            afterDefending: {
                action: '故意Show强牌',
                hands: 'AA/KK/Set',
                purpose: '展示你收紧了',
                effect: '对手放松警惕'
            },
            afterCounterAttack: {
                action: 'Muck胜利的手',
                purpose: '不让对手知道你在bluff',
                effect: '保持神秘感'
            }
        },

        speechPlay: {
            afterBeingTargeted: {
                say: '"Nice hand" or "You played that well"',
                purpose: '假装被压制',
                effect: '对手更aggressive，走入陷阱'
            },
            afterTrap: {
                say: '什么都不说',
                purpose: '保持冷静职业形象',
                effect: '对手怀疑自己判断'
            }
        }
    },

    // 决策树
    decisionTree: function(targetingLevel, sessionTime, yourStack) {
        if (targetingLevel === 'severe') {
            if (sessionTime < 60) {
                return {
                    decision: 'DEFEND',
                    strategy: 'defensiveAdjustment',
                    duration: '30-40分钟',
                    note: '先止损，观察对手是否持续'
                };
            } else if (sessionTime < 120) {
                return {
                    decision: 'COUNTER-ATTACK',
                    strategy: 'counterExploit',
                    note: '对手可能over-adjusted，反击'
                };
            } else {
                if (yourStack < 200) {
                    return {
                        decision: 'LEAVE TABLE',
                        reason: '被针对太久且筹码少，换桌'
                    };
                } else {
                    return {
                        decision: 'SWITCH STRATEGY',
                        strategy: 'GTO fallback',
                        note: '退守GTO，等待对手调整'
                    };
                }
            }
        } else if (targetingLevel === 'moderate') {
            return {
                decision: 'TRAP',
                strategy: 'trapStrategy',
                duration: '20-30分钟',
                note: '用陷阱反击'
            };
        } else {
            return {
                decision: 'CONTINUE LAG',
                strategy: 'standard',
                note: '未被针对，继续aggressive'
            };
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = counterTargeting;
}

