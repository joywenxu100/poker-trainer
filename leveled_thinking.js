// 多级思维训练 - 从Level 2提升到Level 5
// Leveled Thinking Training - From Level 2 to Level 5

const leveledThinking = {
    // 思维等级体系
    levelSystem: {
        level1: {
            name: 'Level 1 - 新手思维',
            thinking: '我有什么牌？',
            example: '我有顶对，我Bet',
            weakness: '完全可预测，被任何人读穿',
            playerType: '鱼玩家',
            exploitability: '极高'
        },

        level2: {
            name: 'Level 2 - 初级玩家',
            thinking: '对手有什么牌？',
            example: '对手可能有听牌，我Bet保护',
            weakness: '还是基于简单逻辑，predictable',
            playerType: '业余玩家，你的训练器当前level',
            exploitability: '高',
            currentTrainer: '👈 你的V2.0训练器在这里'
        },

        level3: {
            name: 'Level 3 - 中级玩家（欺骗）',
            thinking: '对手认为我有什么牌？',
            example: '我Check显示弱，但我有暗三，他会Bet，我check-raise',
            skill: '欺骗、陷阱、形象管理',
            playerType: '半职业玩家',
            exploitability: '中等'
        },

        level4: {
            name: 'Level 4 - 高级玩家（反向心理）',
            thinking: '对手认为我认为他有什么牌？',
            example: '他知道我知道他在bluff，所以他这次是价值，我Fold',
            skill: '反向心理、Meta-game',
            playerType: '职业玩家',
            exploitability: '低'
        },

        level5: {
            name: 'Level 5 - 世界级玩家（GTO + 动态调整）',
            thinking: '无限递归 + 平衡策略 + 实时调整',
            example: '我用混合策略让对手无法exploit，同时根据对手level实时调整',
            skill: 'GTO baseline + Exploitative adjustment',
            playerType: '世界级玩家',
            exploitability: '最小',
            target: '👈 你的目标！'
        }
    },

    // Level 3训练：欺骗与陷阱
    level3Training: {
        concept: '让对手看到你的弱，实际你很强',
        
        techniques: {
            // 1. 慢打强牌
            slowPlay: {
                name: '慢打坚果',
                implementation: {
                    situation: '你击中坚果或极强牌',
                    normalPlay: 'Bet/Raise (Level 1-2)',
                    level3Play: 'Check/Call (显示弱)',
                    opponent_thinks: '你有弱牌或听牌',
                    result: '他继续bluff，你check-raise或call down'
                },
                
                examples: {
                    example1: {
                        hand: '你66在K♠6♦3♣击中暗三',
                        level2_play: 'Check-raise flop',
                        level3_play: {
                            flop: 'Check-call',
                            turn: 'Check-call',
                            river: 'Check-raise all-in',
                            opponent_thinks: '你有弱Kx或听牌'
                        },
                        result: '他river bluff all-in，你check-raise赢full stack'
                    },
                    
                    example2: {
                        hand: '你AK在A♠K♦7♣击中两对',
                        level2_play: 'Bet/Bet/Bet',
                        level3_play: {
                            flop: 'Check (OOP)',
                            opponent_cbet: 'Call',
                            turn: 'Check',
                            opponent_barrel: 'Call',
                            river: 'Check-raise',
                            opponent_thinks: '你有Ax弱踢脚'
                        },
                        result: '他triple barrel bluff，你赢大底池'
                    }
                },
                
                frequency: '20-30% with nuts',
                risk: '低（你有nuts）',
                reward: '高（赢full stack）',
                profit: '+25 BB/100'
            },

            // 2. 假弱示强
            fakeWeakness: {
                name: '假装放弃',
                implementation: {
                    situation: '你有中等强度牌',
                    normalPlay: 'Bet/Bet/Check',
                    level3Play: 'Check/Check/Bet大',
                    opponent_thinks: '你终于放弃了，这次是bluff'
                },
                
                example: {
                    hand: 'AQ on A♠8♥3♦-2♣-K♠',
                    level2_play: 'Cbet flop, bet turn, check river',
                    level3_play: {
                        flop: 'Check (OOP)',
                        turn: 'Check',
                        river: 'Bet 75% pot',
                        opponent_thinks: '你前面check两次，现在bluff',
                        opponentCall: '他用Ax call',
                        result: '薄价值成功'
                    }
                }
            },

            // 3. 反向阻断下注
            reverseBlockingBet: {
                name: '用强牌做Blocking Bet',
                implementation: {
                    normalUse: 'Blocking bet用中等牌',
                    level3Use: '用强牌做小bet',
                    opponent_thinks: '你的blocking bet是中等牌',
                    result: '他raise，你3-Bet all-in'
                },
                
                example: {
                    hand: 'AA on K♠7♦2♣-8♥-A♠ (river set)',
                    level2_play: 'Bet 75% pot',
                    level3_play: 'Bet 25% pot (blocking bet)',
                    opponent_reaction: '他认为你是中等牌，raise to 80% pot',
                    yourAction: '3-Bet all-in',
                    result: '他pot committed，call，你win'
                }
            },

            // 4. 延迟show strength
            delayedAggression: {
                name: '延迟展示强度',
                implementation: {
                    flop: 'Check (有强牌)',
                    turn: 'Check (仍然有强牌)',
                    river: '突然Bet大或Check-raise',
                    opponent_thinks: '你前面弱，突然bluff',
                    reality: '你一直有强牌'
                },
                
                example: {
                    hand: 'JJ on J♠9♦4♣',
                    level2: 'Cbet/Bet/Bet',
                    level3: {
                        flop: 'Check，对手Cbet，你Call',
                        turn: '8♥，Check，对手Bet，你Call',
                        river: 'A♠，Check，对手Bet 80%',
                        yourAction: 'Check-raise all-in',
                        opponent_thinks: '你catch了A，但你一直有set'
                    }
                }
            }
        },

        training: {
            practice: [
                '每session至少慢打强牌3次',
                '每session至少用Level 3思维做决策10次',
                '记录对手反应'
            ],
            goal: '让对手无法根据你的action判断牌力'
        }
    },

    // Level 4训练：反向心理
    level4Training: {
        concept: '对手知道你在Level 3，所以你Level up to 4',
        
        techniques: {
            // 1. Meta-game
            metaGame: {
                name: 'Meta-thinking',
                implementation: {
                    understanding: '对手知道你会慢打强牌',
                    yourAdjustment: '这次用强牌快打（unexpected）',
                    opponent_confused: '他不知道该相信快打还是慢打'
                },
                
                example1: {
                    situation: '之前慢打了2次强牌',
                    nextTime: '用强牌快打',
                    hand: '你AA on A♠K♦7♣',
                    normalLevel3: 'Check-call',
                    level4_play: 'Bet/Bet/Bet aggressive',
                    opponent_thinks: '他这次在bluff（因为之前慢打过）',
                    result: '他call/raise，你赢大底池'
                },
                
                example2: {
                    situation: '对手知道你经常Float',
                    level4_play: '这次Float时有真牌（顶对）',
                    execution: {
                        flop: '对手Cbet，你Call（他以为你Float）',
                        turn: '对手Check，你Bet',
                        opponent_raise: '他check-raise（抓你Float）',
                        yourAction: '3-Bet',
                        result: '他Fold（惊讶你有牌）'
                    }
                }
            },

            // 2. 反向利用对手的read
            exploitOpponentRead: {
                name: '利用对手对你的read',
                implementation: {
                    step1: '建立pattern（故意）',
                    step2: '对手识别pattern',
                    step3: '反向利用pattern'
                },
                
                fullExample: {
                    phase1_buildPattern: {
                        action: '前30分钟只用强牌value bet river',
                        showdown: 'Show强牌2-3次',
                        opponent_learns: '你的river bet = 有牌'
                    },
                    
                    phase2_exploit: {
                        action: '接下来river bluff 60%',
                        opponent_thinks: '你有牌（基于之前pattern）',
                        opponent_folds: '70%+ fold rate',
                        profit: '+20BB per bluff'
                    }
                }
            },

            // 3. 多层次诈唬
            multilayerBluff: {
                name: '对手知道你知道他知道',
                scenario: {
                    board: 'K♠Q♦J♥-T♠-9♠ (五张顺子牌面)',
                    yourHand: 'A♣3♣ (完全miss)',
                    
                    level1: 'Check（我没牌）',
                    level2: 'Bet大（代表顺子）',
                    level3: 'Check（让对手bluff，因为他知道你会在这牌面bluff）',
                    level4: 'Bet小（他知道你Level 3会check，所以你做blocking bet代表有牌但不想被raise）',
                    
                    level4_reasoning: [
                        '对手知道：这牌面你会bluff（Level 2）',
                        '对手知道：你知道他知道，所以你会check trap（Level 3）',
                        '你知道：他知道你会check trap',
                        '所以你：Bet小（看起来是有牌的blocking bet）',
                        '对手：Fold（因为你的bet pattern不像bluff）'
                    ]
                }
            },

            // 4. 时间tell的使用
            timingTell: {
                name: '用时间传递假信息',
                techniques: {
                    quickAction_strongHand: {
                        situation: '你有强牌',
                        level2: '慢慢思考（假装困难）',
                        level4: '快速Bet（看起来像bluff）',
                        opponent_thinks: '快bet = bluff',
                        result: '他call/raise'
                    },
                    
                    slowAction_bluff: {
                        situation: '你在bluff',
                        level2: '快速bet（急于赢池）',
                        level4: '慢慢bet（假装深思）',
                        opponent_thinks: '慢bet = 有牌',
                        result: '他fold'
                    }
                }
            }
        }
    },

    // Level 5训练：GTO + 动态调整
    level5Training: {
        concept: '建立unexploitable baseline，根据对手level实时调整',
        
        framework: {
            // GTO Baseline
            gtoBaseline: {
                purpose: '确保你不被exploit',
                implementation: {
                    defaultStrategy: 'GTO-based ranges and frequencies',
                    cbetFreq: '60-65%',
                    threeBetFreq: '8-10%',
                    checkRaiseFreq: '20-25%',
                    balance: '每个action包含价值和诈唬'
                },
                when: [
                    '对手未知',
                    '对手是GTO player',
                    '被针对时',
                    '不确定时'
                ]
            },

            // 动态调整层
            dynamicLayer: {
                purpose: '识别对手level并调整',
                
                vsLevel1_2: {
                    opponent: 'Level 1-2（大多数业余玩家）',
                    adjustment: 'Pure exploitative',
                    strategy: [
                        'vs Nit: 疯狂bluff',
                        'vs Calling Station: 只价值',
                        'vs Fish: 隔离+价值'
                    ],
                    level: '你用Level 2思维就够了'
                },
                
                vsLevel3: {
                    opponent: 'Level 3（半职业玩家）',
                    adjustment: 'Level 4 counter',
                    strategy: [
                        '识别他们的trap',
                        '反向利用他们的欺骗',
                        '做unexpected play'
                    ],
                    level: '你需要Level 4思维'
                },
                
                vsLevel4: {
                    opponent: 'Level 4（职业玩家）',
                    adjustment: 'Level 5 混合',
                    strategy: [
                        'GTO baseline防止被exploit',
                        '偶尔Level 4 play混淆',
                        '不要固定pattern'
                    ],
                    level: '你需要Level 5思维'
                },
                
                vsLevel5: {
                    opponent: 'Level 5（世界级）',
                    adjustment: 'Pure GTO',
                    strategy: '使用GTO策略，小盈利或break even',
                    level: '不要试图out-level，保持GTO'
                }
            },

            // 实时识别对手level
            identifyOpponentLevel: {
                signals: {
                    level1_2: [
                        '总是bet强牌，check弱牌',
                        '不会慢打',
                        '面对aggression立即fold中等牌',
                        'Predictable patterns'
                    ],
                    
                    level3: [
                        '偶尔慢打强牌',
                        '使用check-raise陷阱',
                        '有时做unexpected play',
                        '会利用你的假设'
                    ],
                    
                    level4: [
                        '识别并利用你的pattern',
                        'Meta-game aware',
                        'Timing tells变化',
                        '能反向利用你的trap'
                    ],
                    
                    level5: [
                        '极度平衡',
                        '难以read',
                        'No clear pattern',
                        'GTO-based with adjustments'
                    ]
                },
                
                testMethod: {
                    step1: '做一个Level 3 play（trap）',
                    step2: '观察对手反应',
                    result: {
                        ifFellForTrap: 'Level 1-2',
                        ifAvoided: 'Level 3',
                        ifExploited: 'Level 4',
                        ifNeutral: 'Level 5'
                    }
                }
            }
        },

        // 完整决策流程
        decisionProcess: {
            step1: '识别对手level',
            step2: '选择对应策略层',
            step3: '执行并观察',
            step4: '根据反馈调整',
            
            example: {
                situation: '对手未知，river你有bluff catcher',
                
                initialPlay: 'GTO baseline: Check (50%), Call if bet (按pot odds)',
                
                observation1: '对手bet大，你call，他show bluff',
                analysis: '对手可能Level 2-3（会river bluff）',
                
                nextTime: '同样情况，你更多call',
                
                observation2: '对手发现你call多了，停止river bluff',
                analysis: '对手Level 3-4（能调整）',
                
                yourAdjustment: '回到GTO baseline或偶尔check-raise bluff',
                
                result: '动态平衡，小优势'
            }
        },

        // Level 5训练计划
        trainingPlan: {
            week1: {
                focus: '建立GTO baseline',
                practice: '学习GTO频率和范围',
                goal: '默认策略是GTO'
            },
            
            week2: {
                focus: '识别对手level',
                practice: '每个对手标注level',
                goal: '快速识别（5-10手）'
            },
            
            week3: {
                focus: 'Level 3-4 plays',
                practice: '每session 5-10次高level play',
                goal: '自如使用'
            },
            
            week4: {
                focus: '动态调整',
                practice: '根据对手实时switch level',
                goal: '流畅切换'
            }
        }
    },

    // 实战案例
    realWorldExamples: {
        case1: {
            title: 'Level 3 vs Level 2',
            scenario: {
                opponent: 'TAG玩家（Level 2）',
                yourHand: 'QQ',
                board: 'K♠9♦4♣-2♥-7♠',
                
                level2_play: {
                    flop: 'Check-fold (他Cbet)',
                    reasoning: '他可能有K'
                },
                
                level3_play: {
                    flop: 'Check-call',
                    turn: 'Check-call',
                    river: 'Check-call or Check-raise',
                    reasoning: [
                        '他会Cbet continuation',
                        '他会double barrel',
                        '他可能triple barrel bluff',
                        '你用Level 3识破他的Level 2 pattern'
                    ],
                    result: '他show A高bluff，你win'
                }
            }
        },

        case2: {
            title: 'Level 4 vs Level 3',
            scenario: {
                opponent: 'LAG玩家（Level 3），刚慢打了强牌',
                yourObservation: '他会慢打强牌',
                nextHand: {
                    board: 'A♠J♦7♣',
                    action: '他check，你bet，他raise',
                    
                    level2_thinking: '他有强牌（两对+）',
                    level3_thinking: '他check-raise trap',
                    level4_thinking: '但他刚show了trap，这次可能是bluff（反向利用形象）',
                    
                    yourAction: '3-Bet',
                    result: '他fold，show QJ（他用level 3，你用level 4 counter）'
                }
            }
        },

        case3: {
            title: 'Level 5 vs Level 4',
            scenario: {
                opponent: '职业玩家（Level 4）',
                observation: '他在试图out-level你',
                
                yourStrategy: {
                    baseline: 'GTO strategy',
                    adjustments: '偶尔Level 4 play混淆',
                    frequency: '80% GTO + 20% Level 4',
                    result: '他无法exploit你，你小盈利'
                }
            }
        }
    },

    // 思维升级路径
    upgradePath: {
        currentState: 'Level 2（你的训练器V2.0）',
        
        toLevel3: {
            time: '2-4周',
            practice: [
                '每session慢打强牌3-5次',
                '每session设陷阱5-10次',
                '记录对手是否fall for traps'
            ],
            milestone: '对手开始怀疑你的check'
        },
        
        toLevel4: {
            time: '2-3个月',
            practice: [
                '建立pattern然后break it',
                'Meta-game thinking',
                '反向利用对手read'
            ],
            milestone: '对手说"I can\'t read you"'
        },
        
        toLevel5: {
            time: '6-12个月',
            practice: [
                'GTO基础学习',
                '动态识别对手level',
                '实时调整策略层'
            ],
            milestone: '在任何level对手面前都有优势'
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = leveledThinking;
}

