// vs LAG专项训练 - 专门对抗松凶玩家
// Anti-LAG Training - Specialized Training to Counter LAG Players

const antiLagTraining = {
    // 识别LAG玩家
    lagIdentification: {
        stats: {
            VPIP: '28-50%',
            PFR: '22-40%',
            threeBet: '10-20%',
            fourBet: '3-8%',
            aggression: '2.5-5.0',
            cBet: '65-90%',
            foldToCbet: '30-50%'
        },
        
        behavioralSigns: [
            '✅ 频繁从后位偷盲',
            '✅ 经常3-Bet你的Open',
            '✅ 翻后aggressive（多桶诈唬）',
            '✅ Float你的Cbet',
            '✅ 不轻易fold',
            '✅ Showdown可能有任何牌',
            '✅ 施加持续压力'
        ],
        
        danger_level: '🚨 HIGH - 这是你最难对付的对手类型',
        
        reality_check: '作为松凶玩家，你最大的威胁是其他松凶玩家'
    },

    // 完整反LAG系统
    antiLagSystem: {
        // Phase 1: 识别（5-10手）
        phase1_identify: {
            duration: '5-10 hands',
            goal: '确认对手是LAG',
            
            checklist: [
                '☑️ VPIP > 28%',
                '☑️ 3-Bet频率 > 10%',
                '☑️ Cbet频率 > 65%',
                '☑️ Aggression > 2.5'
            ],
            
            confirmation: '如果满足3项+，确认LAG'
        },

        // Phase 2: 初步调整（10-20手）
        phase2_adjust: {
            duration: '10-20 hands',
            goal: '立即调整避免被压制',
            
            adjustments: {
                preflop: {
                    tighten: '收紧Open范围10-15%',
                    from: 'CO 42%, BTN 58%',
                    to: 'CO 36%, BTN 50%',
                    reason: '减少被3-Bet机会'
                },
                
                call3BetMore: {
                    frequency: '从40% → 55%',
                    hands: ['TT-88', 'AJ', 'KQ', 'suited connectors'],
                    reason: '他3-Bet宽，你call设陷阱'
                },
                
                fourBetPolarized: {
                    frequency: '从8% → 12%',
                    value: ['QQ+', 'AK'],
                    bluff: ['A5s-A2s', 'K9s-K7s', 'suited connectors'],
                    reason: '他3-Bet宽，你4-Bet fold equity高'
                },
                
                postflop: {
                    checkRaiseMore: '从15% → 25%',
                    checkCallMore: '从35% → 45%',
                    respectLess: '降低对他aggression的尊重50%',
                    reason: 'LAG会持续施压，你需要反击'
                }
            }
        },

        // Phase 3: 设置陷阱（20-40手）
        phase3_trap: {
            duration: '20-40 hands',
            goal: '用对手的aggressive反击他',
            
            traps: {
                slowPlayPremiums: {
                    hands: ['AA', 'KK', 'QQ'],
                    execution: {
                        preflop: 'Call他的3-Bet（不4-Bet）',
                        flop: 'Check（不Cbet）',
                        turn: 'Check-call或Check',
                        river: 'Check-raise all-in'
                    },
                    reason: 'LAG会持续bluff',
                    successRate: '80%',
                    avgProfit: '+65BB per trap'
                },
                
                limpReraise: {
                    hands: ['QQ+', 'AK'],
                    execution: {
                        preflop: 'Limp from EP/MP',
                        ifLAGRaises: 'Reraise 3.5-4x',
                        reason: 'LAG会raise 80%+ limps'
                    },
                    successRate: '75%',
                    avgProfit: '+25BB'
                },
                
                checkCallFlop_raiseTurn: {
                    hands: ['暗三', '两对', '顺子'],
                    execution: {
                        flop: 'Check-call他的Cbet',
                        turn: 'Check，他Barrel，你Raise 2.5x',
                        reason: 'LAG double barrel 60%+'
                    },
                    avgProfit: '+40BB per trap'
                }
            }
        },

        // Phase 4: 持续剥削（40手+）
        phase4_exploit: {
            duration: 'Rest of session',
            goal: '持续获利',
            
            strategies: {
                callDownMore: {
                    frequency: 'River call他60%时间',
                    reason: 'LAG river bluff频率50%+',
                    hands: '中对+, A高, 甚至K高',
                    profit: '+15 BB/100'
                },
                
                checkRaiseBluff: {
                    frequency: '25% OOP',
                    hands: '强听牌, 后门听牌',
                    reason: 'LAG Cbet太频繁',
                    profit: '+12 BB/100'
                },
                
                fourBetLight: {
                    frequency: '12-15%',
                    hands: ['JJ+', 'AQ+', 'A5s-A2s', 'K9s+', 'suited connectors'],
                    reason: '他3-Bet太宽',
                    profit: '+18 BB/100'
                },
                
                floatThenRaise: {
                    execution: {
                        flop: 'Call他的Cbet',
                        turn: '他Check，你Bet',
                        or: '他Bet，你Raise'
                    },
                    reason: 'LAG不会总是有牌',
                    profit: '+10 BB/100'
                }
            }
        }
    },

    // 翻前vs LAG策略
    preflopVsLag: {
        // 你在IP
        whenIP: {
            facingOpen: {
                call: '35-45%',
                callHands: ['TT-22', 'AJ-A9', 'KQ-KT', 'QJ-QT', 'JT', 'T9', 'suited connectors'],
                threeBet: '18-22%',
                threeBetHands: ['JJ+', 'AQ+', 'A5s-A2s', 'K9s+', 'Q9s+', 'suited connectors'],
                fold: '35-40%',
                philosophy: 'IP可以call宽，翻后操作'
            },
            
            facing3Bet: {
                call: '55-60%',
                callHands: ['TT-77', 'AJ', 'KQ', 'QJ', 'JT', 'suited connectors'],
                fourBet: '12-15%',
                fourBetHands: ['QQ+', 'AK', 'A5s-A2s', 'K9s-K7s'],
                fold: '25-30%',
                philosophy: 'IP优势大，可以call设陷阱'
            }
        },

        // 你在OOP
        whenOOP: {
            facingOpen: {
                call: '20-25%',
                callHands: ['中对', '同花牌', '计划check-raise'],
                threeBet: '18-20%',
                threeBetHands: ['99+', 'ATs+', 'KJs+', 'AJo+', 'A2s-A6s (bluff)', 'suited connectors'],
                fold: '55-60%',
                philosophy: 'OOP要紧，避免边缘spot'
            },
            
            facing3Bet: {
                call: '40-45%',
                callHands: ['JJ-88', 'AJ', 'KQ', '准备翻后check-raise'],
                fourBet: '10-12%',
                fourBetHands: ['QQ+', 'AK', 'A5s-A2s'],
                fold: '45-50%',
                philosophy: 'OOP 3-Bet pot很难打，要谨慎'
            }
        },

        // 作为Blinds防守vs LAG BTN
        blindsVsLagBTN: {
            problem: 'LAG BTN偷盲55-65%',
            
            solution: {
                totalDefense: '60-65%',
                threeBet: '18-20%',
                call: '40-45%',
                fold: '35-40%'
            },
            
            threeBetRange: {
                value: ['99+', 'ATs+', 'KJs+', 'AJo+'],
                bluff: ['A2s-A7s', 'K8s-K5s', 'Q9s-Q6s', 'J9s-J6s', 'T9s-T6s', 'suited connectors'],
                sizing: '3.5x',
                philosophy: '他BTN很宽，3-Bet赢很多'
            },
            
            callRange: {
                hands: ['88-22', 'A9s-A2s', 'K9s-K6s', 'Q9s-Q6s', 'J9s-J6s', 'suited connectors', 'A9o-A7o', 'K9o-K8o'],
                plan: '翻后check-raise或check-call',
                philosophy: '设陷阱'
            },
            
            postflopVsLagBTN: {
                checkRaise: '25-30%',
                donkBet: '12-15%',
                checkCall: '40%',
                checkFold: '15-20%',
                profit: '+12 BB/100'
            }
        }
    },

    // 翻后vs LAG策略
    postflopVsLag: {
        // 你有Position
        IP_vs_LAG: {
            facingCbet: {
                float: '35-40%',
                floatHands: ['任何后门', '弱对', 'A高'],
                raise: '18-22%',
                raiseHands: ['强听牌', '两对+', 'semi-bluff'],
                fold: '40-45%',
                philosophy: 'IP可以Float，转牌偷'
            },
            
            facingCheck: {
                bet: '75-80%',
                betHands: ['任何两张牌'],
                check: '20-25%',
                checkHands: ['慢打强牌', '完全miss'],
                philosophy: '他Check = 弱，你attack'
            },
            
            turnAfterFloat: {
                ifHeChecks: {
                    bet: '80%',
                    sizing: '65-75% pot',
                    successRate: '75%'
                },
                ifHeBets: {
                    call: '40%',
                    raise: '15%',
                    fold: '45%',
                    reasoning: '他可能double barrel bluff'
                }
            }
        },

        // 你OOP
        OOP_vs_LAG: {
            facingCbet: {
                checkRaise: '25-30%',
                checkRaiseHands: ['两对+', '强听牌 (15+ outs)'],
                checkCall: '45-50%',
                checkCallHands: ['顶对', '中对', '听牌', '后门'],
                checkFold: '20-25%',
                philosophy: 'OOP必须aggressive防守'
            },
            
            donkBet: {
                frequency: '12-15%',
                situations: ['湿牌面击中', '坚果听牌', '破坏他的position'],
                sizing: '40-50% pot',
                reason: 'LAG不expect，打乱节奏'
            },
            
            checkCallFlop_attackTurn: {
                strategy: 'Check-call flop，Turn donk或check-raise',
                execution: {
                    flop: 'Check-call with 顶对, 强听牌',
                    turn: {
                        option1: 'Donk bet 65%',
                        option2: 'Check-raise 2.5x',
                        reason: '他以为你弱，你attack'
                    }
                }
            }
        },

        // River vs LAG
        riverVsLag: {
            facingBet: {
                call: '55-65%',
                callHands: ['中对+', 'A高', '甚至K高 bluff catcher'],
                raise: '5-8%',
                raiseHands: ['坚果', '空气（polarized）'],
                fold: '30-40%',
                philosophy: 'LAG river bluff 45-55%，多call'
            },
            
            facingCheck: {
                bet: '60-70%',
                betHands: ['价值牌', '诈唬'],
                check: '30-40%',
                checkHands: ['Bluff catcher', '强牌trap'],
                philosophy: '他Check可能弱，bet偷'
            }
        }
    },

    // 心理战vs LAG
    psychologicalWarfare: {
        // 1. 展示陷阱
        showTrap: {
            when: '成功trap他一次',
            action: 'Show the trap hand',
            purpose: '让他怀疑自己，收紧',
            followUp: '他收紧后，你扩大bluff',
            profit: '+20BB over next hour'
        },

        // 2. Show call down
        showCallDown: {
            when: '用弱牌call down他的bluff',
            action: 'Show the bluff catcher',
            purpose: '让他知道你会call down',
            followUp: '他减少bluff，你减少defense',
            effect: '他变得更predictable'
        },

        // 3. 不给information
        muckWins: {
            strategy: 'Muck大多数winning hands',
            purpose: '保持神秘感',
            effect: '他无法categorize你'
        },

        // 4. Speech play
        speechPlay: {
            afterTrap: {
                say: '什么都不说',
                reason: '保持冷静职业形象'
            },
            afterBadBeat: {
                say: '"Nice hand" or "wp"',
                reason: '不显示frustration'
            },
            avoid: [
                '❌ 不要说"I knew you were bluffing"',
                '❌ 不要批评他的play',
                '❌ 不要ego battle'
            ]
        }
    },

    // 特殊战术
    specialTactics: {
        // 1. Limp-Reraise陷阱
        limpReraisePlay: {
            frequency: 'vs LAG who raises limps 80%+',
            hands: ['AA', 'KK', 'QQ', 'AK'],
            execution: {
                preflop: 'Limp from EP/MP',
                ifLAGRaises: 'Reraise 3.5-4x',
                ifHeCalls: 'Cbet aggressive',
                ifHeFolds: '+15BB profit'
            },
            successRate: '75%',
            note: '每orbit最多1次，否则太obvious'
        },

        // 2. Check-Call Flop, Raise Turn
        checkCallRaiseTurn: {
            situation: 'OOP，你有强牌',
            execution: {
                flop: 'Check，他Cbet，你Call',
                turn: 'Check，他Barrel，你Raise 2.5-3x',
                reason: 'LAG double barrel 60%+，你抓住'
            },
            hands: ['暗三', '两对', '强顶对'],
            avgProfit: '+35BB'
        },

        // 3. Float Back
        floatBack: {
            situation: 'IP，LAG Cbet，你Float',
            execution: {
                flop: 'Call他的Cbet（Float）',
                turn: {
                    ifHeChecks: 'Bet 65%',
                    ifHeBets: 'Raise 2.5x',
                    reason: '他Cbet后Check = 弱'
                }
            },
            successRate: '70%'
        },

        // 4. River Check-Raise Bluff
        riverCheckRaiseBluff: {
            situation: 'OOP，River你miss',
            execution: {
                river: 'Check',
                ifHeBets: 'Check-raise all-in',
                frequency: '10-15% of time',
                reason: 'LAG river bet可能是bluff'
            },
            bestSpots: [
                '牌面scary（三张同花/四张顺子）',
                '你的line可信（flop/turn call）',
                '他的line不一致'
            ],
            successRate: '55-65%'
        }
    },

    // 完整战术组合
    tacticalCombinations: {
        earlySession: {
            goal: '建立形象和观察',
            tactics: [
                '标准GTO baseline',
                '少量trap（1-2次）',
                'Call down 1次show',
                '让LAG认为你会防守'
            ]
        },
        
        midSession: {
            goal: '开始剥削',
            tactics: [
                '提高check-raise到25%',
                'Call down更频繁',
                '4-Bet light 12%',
                'Float then raise turn'
            ]
        },
        
        lateSession: {
            goal: '最大化profit',
            tactics: [
                'Limp-reraise 1次',
                'River check-raise bluff',
                'Triple barrel vs他的weakness',
                '继续call down'
            ]
        }
    },

    // 错误避免
    commonMistakes: {
        mistake1: {
            error: '过度尊重LAG的aggression',
            correction: 'LAG很多时候在bluff，降低尊重50%',
            cost: '-15 BB/100'
        },
        
        mistake2: {
            error: 'Ego battle（想证明你也aggressive）',
            correction: '用trap和defense打败他们，不是out-aggressive',
            cost: '-25 BB/100'
        },
        
        mistake3: {
            error: '不调整防守频率',
            correction: 'Check-raise提升到25%，call down提升到60%',
            cost: '-12 BB/100'
        },
        
        mistake4: {
            error: 'OOP打太多边缘牌',
            correction: 'OOP vs LAG要紧10-15%',
            cost: '-10 BB/100'
        },
        
        mistake5: {
            error: '被tilt',
            correction: 'LAG会run you over，保持冷静，stick to strategy',
            cost: '-30 BB/100'
        }
    },

    // 训练计划
    trainingPlan: {
        week1: {
            focus: '识别LAG玩家',
            practice: '标注所有LAG玩家stats',
            goal: '5手内识别'
        },
        
        week2: {
            focus: 'Defense adjustments',
            practice: [
                'Check-raise提升到25%',
                'Call 3-Bet 提升到55%',
                '4-Bet提升到12%'
            ],
            goal: '正确执行frequency'
        },
        
        week3: {
            focus: 'Trapping',
            practice: [
                'Slow-play premiums 3次',
                'Limp-reraise 1次',
                'Check-call flop, raise turn 2次'
            ],
            goal: '成功trap 70%+'
        },
        
        week4: {
            focus: 'Call down和心理战',
            practice: [
                'River call他60%',
                'Show 1-2次successful trap',
                'Keep track of他的adjustments'
            ],
            goal: '+8-12 BB/100 vs LAG'
        }
    },

    // 预期结果
    expectedResults: {
        vsBadLAG: {
            description: 'Maniac类型（VPIP 45%+）',
            profit: '+15-25 BB/100',
            strategy: 'Pure value，trap，call down'
        },
        
        vsAverageLAG: {
            description: '标准LAG（VPIP 30-40%）',
            profit: '+5-12 BB/100',
            strategy: 'Balanced defense + traps'
        },
        
        vsGoodLAG: {
            description: '强LAG（平衡+调整快）',
            profit: '+1-5 BB/100',
            strategy: 'GTO baseline + selective traps'
        },
        
        vsEliteLAG: {
            description: '世界级LAG',
            profit: '-1 to +2 BB/100',
            strategy: 'Pure GTO，避免被exploit'
        }
    },

    // 实战案例
    realWorldCases: {
        case1: {
            opponent: 'LAG (VPIP 38%, 3-Bet 14%)',
            yourHand: 'AA',
            action: 'CO open，LAG BTN 3-Bet',
            yourPlay: 'Call (trap)',
            flop: 'K♠9♦4♣',
            flopAction: 'Check，他Cbet，你Call',
            turn: '7♥',
            turnAction: 'Check，他Bet 75%，你Call',
            river: 'A♠',
            riverAction: 'Check，他Bet 100%，你Check-raise all-in',
            result: '他call with KQ，你win 180BB pot',
            lesson: 'Slow-play vs LAG极profitable'
        },
        
        case2: {
            opponent: 'LAG (Float经常)',
            yourHand: 'A♠K♣',
            flop: 'A♦7♠3♥',
            flopAction: 'LAG call你的Cbet',
            turn: '2♦',
            turnAction: 'Check，LAG bet 65%',
            yourPlay: 'Raise 2.5x',
            result: 'LAG fold',
            lesson: 'LAG float后bet，你raise他fold'
        },
        
        case3: {
            opponent: 'LAG BTN偷盲60%',
            yourHand: 'A♥5♥ in BB',
            action: 'LAG BTN open，你3-Bet',
            result: 'LAG fold',
            profit: '+12BB',
            lesson: '3-Bet vs wide stealer有高fold equity'
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = antiLagTraining;
}

