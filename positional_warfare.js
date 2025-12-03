// 位置战争专项 - 对抗同样松凶的对手
// Positional Warfare - Fighting Against Other LAG Players

const positionalWarfare = {
    // 核心哲学
    philosophy: {
        concept: '位置战争 = 谁能控制position优势，谁就赢',
        reality: '当两个松凶玩家对抗时，position becomes everything',
        
        goldenRule: [
            '有Position = 激进施压',
            '无Position = 谨慎防守或设陷阱',
            '避免OOP玩大底池（除非有坚果）'
        ]
    },

    // vs 松凶玩家的识别
    lagIdentification: {
        stats: {
            VPIP: '28-45%',
            PFR: '22-38%',
            threeBet: '10-18%',
            aggression: '2.5-4.5',
            cBet: '65-85%'
        },
        
        behaviors: [
            '频繁从后位偷盲',
            '经常3-Bet你的Open',
            '翻后aggressive（Float, barrel）',
            '不轻易fold',
            'Showdown可能有任何牌'
        ],
        
        danger: '🚨 这是强对手！需要专门策略'
    },

    // 翻前位置战
    preflopWarfare: {
        // 你在IP
        whenYouHavePosition: {
            // 场景1: CO Open，LAG在BTN
            CO_vs_LAG_BTN: {
                problem: 'BTN松凶会3-Bet你15-20%',
                
                adjustment: {
                    tightenOpen: {
                        from: 'CO 42%',
                        to: 'CO 36%',
                        remove: ['边缘同花连牌', 'K9o-K8o', 'Q9o-Q8o', 'Jxo'],
                        reason: '减少被3-Bet的频率'
                    },
                    
                    call3BetMore: {
                        frequency: '从40% → 55%',
                        addHands: ['TT-88', 'AJ', 'KQ', 'suited connectors'],
                        reason: '你有position，可以翻后操作',
                        SPR: 'aim for SPR 8-15'
                    },
                    
                    fourBetPolarized: {
                        value: ['QQ+', 'AK'],
                        bluff: ['A5s-A2s', 'K9s-K7s', 'suited connectors'],
                        frequency: '10-12%',
                        sizing: '2.2-2.5x',
                        reason: '他3-Bet宽，你4-Bet他fold很多'
                    }
                },
                
                postflopStrategy: {
                    ifYouCall3Bet: {
                        flop: [
                            'Check大部分时间（让他Cbet）',
                            'Float或Check-raise 30%',
                            '用强牌check-call设陷阱'
                        ],
                        turn: [
                            '他Cbet后Check，你Bet 70%',
                            '他Check to you，你Bet 75%',
                            '控制底池节奏'
                        ],
                        river: [
                            '薄价值下注',
                            'Bluff river 40%当他show weakness'
                        ]
                    }
                },
                
                profit: '+8 BB/100'
            },

            // 场景2: BTN Open，LAG在SB/BB
            BTN_vs_LAG_Blinds: {
                problem: 'SB/BB会3-Bet/Squeeze你15-18%',
                
                adjustment: {
                    dontOverOpen: {
                        from: 'BTN 58%',
                        to: 'BTN 52% vs LAG blinds',
                        remove: ['最弱的suited connectors', 'offsuit junk'],
                        reason: '他们防守aggressive'
                    },
                    
                    call3BetIP: {
                        frequency: '60%',
                        hands: ['99-22', 'AJ-A9', 'KQ-KT', 'QJ-QT', 'JT', 'suited connectors'],
                        reason: 'IP优势巨大，可以玩小底池'
                    },
                    
                    fourBetBluff: {
                        frequency: '8-10%',
                        hands: ['A5s-A2s', 'K8s-K6s', 'Q9s-Q7s', '87s', '76s', '65s'],
                        reason: '他们3-Bet宽，4-Bet fold equity高'
                    }
                },
                
                profit: '+6 BB/100'
            }
        },

        // 你在OOP
        whenYouAreOOP: {
            // 场景1: UTG/EP Open，LAG在Position
            EP_vs_LAG_Position: {
                problem: 'LAG会从position 3-Bet或Call，你OOP打底池',
                
                solution: {
                    tightenSignificantly: {
                        from: 'UTG 12%, UTG1 17%',
                        to: 'UTG 10%, UTG1 14% vs LAG',
                        remove: ['22-55', 'A9s-A6s', 'KJs-KTs', 'suited connectors'],
                        reason: '避免OOP玩边缘牌'
                    },
                    
                    vs3Bet_tightFold: {
                        frequency: '70% fold',
                        continue: ['JJ+', 'AK', 'QQ (call)'],
                        reason: 'OOP不要打边缘spot'
                    },
                    
                    fourBetOnlyValue: {
                        range: ['KK+', 'AK occasionally'],
                        noBluff: '不要4-Bet bluff from OOP',
                        reason: 'OOP 4-Bet pot很难打'
                    }
                },
                
                philosophy: '从早位vs LAG：紧是对的！',
                profit: '止损，避免-10 BB/100'
            },

            // 场景2: CO Open，LAG在BTN
            CO_vs_LAG_BTN_OOP: {
                problem: 'BTN是松凶，频繁3-Bet',
                
                solution: {
                    reduceOpen: {
                        from: 'CO 42%',
                        to: 'CO 35%',
                        focus: '强牌和投机牌'
                    },
                    
                    vs3Bet_mixStrategy: {
                        call: '45% (投机牌+中对)',
                        fourBet: '10% (QQ+, AQ+, bluffs)',
                        fold: '45%'
                    },
                    
                    postflop_checkMore: {
                        flop: 'Check 40%时间',
                        checkRaise: '提升到20%',
                        reason: '让他Cbet，然后check-raise'
                    }
                }
            },

            // 场景3: SB/BB vs LAG BTN
            Blinds_vs_LAG_BTN: {
                problem: 'BTN松凶偷盲60%+',
                
                counterStrategy: {
                    increaseDefense: {
                        total: '60-65% (Call + 3-Bet)',
                        threeBet: '18-20%',
                        call: '40-45%',
                        reason: 'MDF要求+剥削他的宽range'
                    },
                    
                    threeBetPolarized: {
                        value: ['99+', 'ATs+', 'KJs+', 'AJo+'],
                        bluff: ['A2s-A6s', 'K8s-K5s', 'Q9s-Q6s', 'J9s-J6s', 'T9s-T6s', 'suited connectors'],
                        sizing: '3.5x from SB, 3.5x from BB',
                        reason: '他BTN range很宽，3-Bet能赢很多'
                    },
                    
                    callTrap: {
                        hands: ['JJ-88', '中Ax', 'suited hands'],
                        plan: 'Call 3-Bet，翻后check-raise',
                        reason: '设陷阱'
                    },
                    
                    postflop: {
                        checkRaise: '25% frequency',
                        donkBet: '12% frequency',
                        leadFlop: '破坏他的position优势',
                        profit: '+12 BB/100'
                    }
                }
            }
        }
    },

    // 翻后位置战
    postflopWarfare: {
        // 你有Position
        withPosition: {
            philosophy: '利用position = 控制pot，控制action',
            
            tactics: {
                floatMore: {
                    frequency: '提升30%',
                    reason: 'LAG会Cbet aggressive，你Float后turn偷',
                    execution: [
                        'Flop: Call他的Cbet（任何后门）',
                        'Turn: 他Check，你Bet 65-75% pot',
                        'Success rate: 70%+'
                    ],
                    profit: '+15 BB/100 vs LAG'
                },
                
                raiseFlop: {
                    frequency: '15-20%',
                    semiBluff: '强听牌+overs',
                    value: '两对+',
                    sizing: '2.5-3x his Cbet',
                    reason: '不让他继续barrel'
                },
                
                controlPotSize: {
                    withMedium: 'Call call call',
                    withStrong: 'Small raises to build pot',
                    withNuts: 'Let him bluff',
                    philosophy: '你控制pot size'
                },
                
                riverBluff: {
                    frequency: '50% 当他show weakness',
                    sizing: '75-100% pot',
                    story: '代表你翻牌float有牌',
                    successRate: '65%'
                }
            }
        },

        // 你OOP
        outOfPosition: {
            philosophy: 'OOP vs LAG = 防守为主，selective attack',
            
            tactics: {
                checkRaiseMore: {
                    frequency: '25-30%',
                    value: '两对+',
                    bluff: '强听牌 (15+ outs)',
                    sizing: '2.5-3x',
                    reason: '不让他免费看牌和Float',
                    profit: '+18 BB/100'
                },
                
                donkBet: {
                    frequency: '10-15%',
                    situations: [
                        '湿牌面你击中',
                        '你有坚果听牌',
                        '破坏他的position'
                    ],
                    sizing: '40-50% pot',
                    reason: 'LAG不expect donk，打乱节奏'
                },
                
                checkCallStrong: {
                    hands: ['顶对+', '强听牌'],
                    plan: 'Check-call flop/turn，river check-raise',
                    reason: '让他持续bluff'
                },
                
                giveUpEasier: {
                    principle: 'OOP miss了就放手',
                    avoid: '不要OOP多桶bluff',
                    reason: 'LAG不容易fold，你position劣势'
                }
            }
        }
    },

    // 特殊战术
    specialTactics: {
        // 1. 陷阱LAG玩家
        trapping: {
            limpReraise: {
                name: 'Limp-Reraise',
                hands: ['AA', 'KK', 'QQ', 'AK'],
                frequency: 'vs LAG who raises limps 80%+',
                execution: {
                    preflop: 'Limp from EP/MP',
                    whenLAGRaises: 'Reraise 3.5-4x',
                    ifHeCalls: 'Cbet aggressive翻后',
                    ifHeFolds: '+15BB profit'
                },
                successRate: '75%',
                profit: '+25BB per occurrence'
            },
            
            checkCallFlop_RaiseTurn: {
                name: 'Check-Call Flop, Raise Turn',
                situation: '你OOP，击中强牌',
                execution: {
                    flop: 'Check，他Cbet，你Call',
                    turn: 'Check，他Barrel，你Raise 2.5x',
                    reasoning: 'LAG会double barrel 60%+，你抓住'
                },
                hands: ['暗三', '两对', '顺子'],
                profit: '+30BB per trap'
            },
            
            slowPlayNuts: {
                name: '慢打坚果',
                frequency: '30% with nuts',
                execution: {
                    flop: 'Check nuts',
                    turn: 'Check-call或Check',
                    river: 'Check-raise all-in'
                },
                reason: 'LAG会持续bluff',
                risk: '低（你有nuts）',
                reward: '高（他全押栈）'
            }
        },

        // 2. 心理战
        psychologicalWarfare: {
            showBluff: {
                when: '成功3桶bluff vs LAG',
                action: 'Show the bluff',
                purpose: '让他tilt，变得更aggressive',
                followUp: '接下来用强牌设陷阱'
            },
            
            showNuts: {
                when: '陷阱成功抓到他bluff',
                action: 'Show the nuts',
                purpose: '让他怀疑自己，收紧',
                followUp: '他收紧后，你扩大bluff'
            },
            
            levelWar: {
                concept: 'LAG vs LAG = Level 3-4 thinking',
                example: [
                    'Level 1: 我有什么牌',
                    'Level 2: 他有什么牌',
                    'Level 3: 他认为我有什么牌',
                    'Level 4: 他认为我认为他有什么牌'
                ],
                implementation: '做出unexpected play'
            }
        },

        // 3. 桌面动态管理
        tableDynamics: {
            avoidHeadsUp: {
                principle: '不要经常单挑LAG玩家',
                reason: '高variance，即使+EV也波动大',
                strategy: '有第三方时才玩'
            },
            
            seatSelection: {
                ideal: 'LAG在你右手边',
                reason: '你在他们之后行动，有position',
                avoid: 'LAG在你左边（他们always 3-Bet你）'
            },
            
            tableLeavingCondition: {
                when: [
                    '2个以上强LAG在桌',
                    'LAG专门针对你',
                    '你连续被LAG抓bluff 3次+',
                    '你开始tilt vs LAG'
                ],
                action: '换桌',
                reason: '不要ego battle，找更profitable桌'
            }
        }
    },

    // LAG vs LAG 完整策略
    lagVsLagStrategy: {
        preflop: {
            generalPrinciple: '比标准收紧10-15%',
            avoidMargins: '不要玩边缘牌OOP',
            trapMore: '用强牌设陷阱',
            respectPosition: 'IP aggressive，OOP defensive'
        },
        
        postflop: {
            IP: {
                float: '+30% frequency',
                raiseFlop: '15-20%',
                controlPot: '用position控制',
                riverBluff: '50% when weakness'
            },
            OOP: {
                checkRaise: '25-30%',
                donkBet: '10-15%',
                checkCallStrong: '设陷阱',
                giveUpEasier: 'Miss就fold'
            }
        },
        
        psychology: {
            avoidEgo: '不要ego battle',
            pickSpots: '选择性对抗',
            tableDynamics: '桌面动态第一',
            variance: '接受高variance'
        },
        
        expectedOutcome: {
            vs_AverageLAG: '+3 to +8 BB/100',
            vs_StrongLAG: '0 to +3 BB/100',
            vs_EliteLAG: '-2 to +2 BB/100',
            note: '对抗LAG利润低但必须会'
        }
    },

    // 实战场景
    realScenarios: {
        scenario1: {
            setup: '你CO open AA，LAG BTN 3-Bet',
            wrongPlay: '4-Bet (predictable)',
            correctPlay: 'Call (trap)',
            reasoning: 'LAG会Cbet aggressive翻后，你check-raise',
            avgProfit: '+35BB'
        },
        
        scenario2: {
            setup: 'LAG CO open，你BTN flat 88',
            flop: 'K♠7♦2♣，他Cbet',
            wrongPlay: 'Fold (太弱)',
            correctPlay: 'Call (Float)',
            turn: '9♥，他Check',
            yourAction: 'Bet 65% pot',
            result: '他Fold 70%，+8BB'
        },
        
        scenario3: {
            setup: 'LAG BTN open，你BB 3-Bet A5s',
            heCall: 'True',
            flop: 'Q♠9♦4♣，你Cbet',
            heRaise: 'True',
            wrongPlay: 'Fold (给他太多credit)',
            correctPlay: '3-Bet all-in (他可能bluff)',
            reasoning: 'LAG会用任何牌Raise，你有equity',
            result: '他Fold 55%，你win；他Call你有35% equity'
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = positionalWarfare;
}

