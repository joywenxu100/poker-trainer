// GTO退守模块 - 当情况不利时的安全策略
// GTO Fallback Module - Safe Strategy When Things Go Wrong

const gtoFallback = {
    // GTO退守哲学
    philosophy: {
        concept: 'GTO = Game Theory Optimal = Unexploitable strategy',
        purpose: '当你不知道该怎么打或被针对时的安全baseline',
        
        analogy: 'GTO就像保险 - 不是最大盈利，但避免大亏',
        
        whenToUse: [
            '✅ 被严重针对（targeted detection alert）',
            '✅ 对手未知（新对手，没有read）',
            '✅ 开始tilt（情绪化）',
            '✅ 连续bad beats',
            '✅ 不确定对手策略',
            '✅ 对手是GTO player',
            '✅ 多个强对手在桌'
        ],
        
        whenNotToUse: [
            '❌ 对手有明显weaknesses（应该exploit）',
            '❌ 对手是鱼/Nit/Calling Station',
            '❌ 你有clear edge'
        ]
    },

    // GTO Core Principles
    coreStrategies: {
        // 1. GTO翻前范围
        preflopGTO: {
            vpipTargets: {
                UTG: '12-14%',
                UTG1: '14-17%',
                LJ: '18-21%',
                HJ: '21-25%',
                CO: '27-32%',
                BTN: '38-45%',
                SB: '32-38% (vs BTN open)',
                BB: '38-45% (vs BTN open)'
            },
            
            ranges: {
                UTG: {
                    range: ['AA-77', 'AKs-ATs', 'KQs', 'AKo-AQo'],
                    percentage: '13%',
                    philosophy: '强牌+高牌力，避免投机'
                },
                
                HJ: {
                    range: ['AA-55', 'AKs-A9s', 'KQs-KTs', 'QJs-QTs', 'JTs', 'T9s', 'AKo-ATo', 'KQo'],
                    percentage: '23%',
                    philosophy: '加入投机牌，但仍balanced'
                },
                
                CO: {
                    range: ['AA-22', 'AKs-A2s', 'KQs-K9s', 'QJs-Q9s', 'JTs-J9s', 'T9s-T8s', '98s', '87s', '76s', 'AKo-A9o', 'KQo-KJo', 'QJo'],
                    percentage: '30%',
                    philosophy: '宽但不过度'
                },
                
                BTN: {
                    range: ['AA-22', 'AKs-A2s', 'KQs-K2s', 'Q9s+', 'J8s+', 'T8s+', '97s+', '87s', '76s', '65s', '54s', 'AKo-A7o', 'KQo-KTo', 'QJo-QTo', 'JTo'],
                    percentage: '42%',
                    philosophy: 'GTO BTN = 42%，不要58%（太宽）'
                }
            },
            
            threeBetGTO: {
                philosophy: '3-Bet需要平衡（价值:诈唬 = 1.5-2:1）',
                
                BTN_vs_CO: {
                    frequency: '12-14%',
                    value: ['JJ+', 'AQs+', 'AKo'],
                    bluff: ['A5s-A2s', 'K9s-K7s', 'Q9s', 'J9s', 'T9s', '98s'],
                    sizing: '3x'
                },
                
                BB_vs_BTN: {
                    frequency: '14-16%',
                    value: ['99+', 'ATs+', 'KQs', 'AJo+'],
                    bluff: ['A5s-A2s', 'K8s-K6s', 'Q9s-Q7s', 'J9s-J7s', '98s-96s', '87s-85s', '76s'],
                    sizing: '3.5x'
                }
            },
            
            vs3BetGTO: {
                call: '50-60%',
                fourBet: '8-12%',
                fold: '30-40%',
                
                callRange: ['TT-77', 'AJs-ATs', 'KQs', 'QJs', 'JTs', 'T9s', '98s', 'AQo'],
                fourBetRange: ['QQ+', 'AK', 'A5s-A2s (polarized)'],
                foldRange: ['所有其他牌']
            }
        },

        // 2. GTO翻后策略
        postflopGTO: {
            cbetFrequencies: {
                dryBoard: {
                    example: 'K♠7♦2♣',
                    frequency: '60-65%',
                    sizing: '33% pot',
                    composition: '65% value, 35% bluff'
                },
                
                wetBoard: {
                    example: 'J♠T♦9♣',
                    frequency: '50-55%',
                    sizing: '66% pot',
                    composition: '70% value, 30% bluff'
                },
                
                highCard: {
                    example: 'A♠K♦5♥',
                    frequency: '65-70%',
                    sizing: '33-50% pot (range bet)',
                    composition: '60% value, 40% bluff'
                }
            },
            
            checkRaiseGTO: {
                frequency: '20-25% when OOP',
                composition: {
                    value: '60% (两对+)',
                    bluff: '40% (强听牌, 12+ outs)',
                    ratio: '1.5:1'
                },
                sizing: '2.5-3x opponent Cbet'
            },
            
            checkCallGTO: {
                frequency: '40-50% when OOP',
                hands: ['中对', '弱顶对', '听牌', '后门听牌'],
                purpose: '防守range，不让对手无限Cbet'
            },
            
            checkFoldGTO: {
                frequency: '25-35% when OOP',
                hands: ['完全miss', 'A高无听牌', '弱后门'],
                principle: 'MDF达到后可以fold'
            }
        },

        // 3. GTO平衡概念
        balanceGTO: {
            principle: '每个action都包含价值和诈唬的mix',
            
            cbetBalance: {
                rule: 'Cbet range = 60% value + 40% bluff',
                check: 'Check range = 50% trap + 50% weak',
                result: '对手无法从action推断牌力'
            },
            
            sizingBalance: {
                rule: '相同sizing用于不同强度的牌',
                example: {
                    sizing: '50% pot bet on river',
                    range: ['两对+（价值）', 'A高（bluff）'],
                    effect: '对手无法从sizing判断'
                }
            },
            
            frequencyBalance: {
                MDF: {
                    concept: 'Minimum Defense Frequency',
                    formula: 'MDF = pot / (pot + bet)',
                    application: [
                        'vs Half pot bet: 防守67%',
                        'vs Full pot bet: 防守50%',
                        'vs 3-Bet: 防守44%+'
                    ]
                }
            }
        }
    },

    // GTO退守触发条件
    fallbackTriggers: {
        // 1. 被针对
        beingTargeted: {
            detection: '使用targeted_detection.js识别',
            threshold: 'Severity = moderate or severe',
            action: {
                immediate: '立即切换到GTO模式',
                duration: '至少30分钟',
                adjustments: [
                    '收紧Open范围到GTO baseline',
                    '降低3-Bet/4-Bet频率',
                    '停止Float和多桶bluff',
                    '提高Check-raise到25%',
                    '平衡所有action'
                ]
            },
            expectedResult: '从-25 BB/100恢复到-2~+2 BB/100'
        },

        // 2. Tilt迹象
        tiltDetection: {
            signs: [
                '连续bad beats 3+',
                '被suck out 2次+',
                '大底池输掉（100BB+）',
                '情绪激动',
                '想立即win back'
            ],
            
            action: {
                step1: '暂停5分钟（离开桌子）',
                step2: '深呼吸，喝水',
                step3: '回到桌子，切换到GTO',
                duration: '至少1小时或直到情绪恢复',
                rule: '绝不在tilt时用exploitative策略'
            },
            
            gtoProtection: {
                benefit: 'GTO策略不依赖read，减少情绪化决策',
                effect: '止损，避免tilt spew'
            }
        },

        // 3. 对手未知
        unknownOpponent: {
            situation: [
                '新对手坐下',
                '没有Stats',
                '前5-10手'
            ],
            
            strategy: {
                default: '使用GTO策略',
                observe: '观察对手倾向',
                duration: '10-15手',
                thenAdjust: '识别weaknesses后切换到exploit'
            },
            
            philosophy: 'GTO是对抗未知对手的最佳策略'
        },

        // 4. 多个强对手
        toughTable: {
            definition: '2个以上TAG/LAG/GTO玩家',
            
            strategy: {
                baseline: '使用GTO作为主要策略',
                selectiveExploit: '只exploit明显的weak players',
                avoidWars: '不跟强对手打ego battle',
                seatSelection: '换座位，避免强对手在左边'
            },
            
            expectedProfit: '+2-5 BB/100（低但稳定）'
        }
    },

    // GTO实施细节
    gtoImplementation: {
        // 翻前GTO checklist
        preflopChecklist: {
            beforeOpen: [
                '✅ 我的牌在GTO range内吗？',
                '✅ Position是什么？',
                '✅ Sizing是standard吗？（2.5BB）'
            ],
            
            facing3Bet: [
                '✅ 我应该Call/4-Bet/Fold的频率是多少？',
                '✅ 我的4-Bet range是polarized吗？',
                '✅ 我是否满足MDF？'
            ]
        },

        // 翻后GTO checklist
        postflopChecklist: {
            beforeCbet: [
                '✅ 我的Cbet frequency在60-65%吗？',
                '✅ 我的Cbet range包含价值和诈唬吗？',
                '✅ Sizing合理吗？（33-66% pot）'
            ],
            
            beforeCheckRaise: [
                '✅ 我的CR frequency在20-25%吗？',
                '✅ 我的CR range是价值:诈唬=1.5:1吗？',
                '✅ Sizing是2.5-3x吗？'
            ],
            
            beforeRiverBet: [
                '✅ 我的range是polarized还是merged？',
                '✅ 价值:诈唬比例合理吗？',
                '✅ Sizing对所有牌力一致吗？'
            ]
        }
    },

    // GTO vs Exploitative对比
    gtoVsExploitative: {
        comparison: {
            GTO: {
                profit: '+2-5 BB/100',
                variance: '低',
                exploitability: '最小',
                difficulty: '中等',
                whenBest: [
                    '对手未知',
                    '对手是GTO player',
                    '被针对时',
                    'Tilt时'
                ]
            },
            
            Exploitative: {
                profit: '+25-50 BB/100',
                variance: '高',
                exploitability: '高',
                difficulty: '高（需要read）',
                whenBest: [
                    '对手有明显weaknesses',
                    '对手是鱼/Nit/Calling Station',
                    '你有clear edge'
                ]
            }
        },
        
        optimalApproach: {
            framework: 'GTO baseline + Exploitative adjustments',
            
            strategy: [
                '1. 默认使用GTO（80%时间）',
                '2. 识别对手weaknesses',
                '3. 在安全spot做exploitative adjustments（20%时间）',
                '4. 被针对或不确定时，回到GTO'
            ],
            
            example: {
                baseline: 'GTO: Cbet 65%，Check 35%',
                vs_Nit: 'Exploit: Cbet 85%（他fold太多）',
                vs_CallingStation: 'Exploit: Cbet 40%（只价值）',
                vs_TAG: 'GTO: 保持65%（他平衡）',
                被针对: 'GTO: 回到65%'
            }
        }
    },

    // GTO训练计划
    trainingPlan: {
        week1: {
            focus: '学习GTO范围',
            practice: [
                '记住各位置GTO Open ranges',
                '记住GTO 3-Bet frequencies',
                '理解MDF概念'
            ],
            tool: '使用GTO solver或charts'
        },
        
        week2: {
            focus: '翻后GTO频率',
            practice: [
                'Cbet 60-65% all boards',
                'Check-raise 20-25% OOP',
                '平衡Check range'
            ]
        },
        
        week3: {
            focus: 'GTO vs Exploitative切换',
            practice: [
                '默认GTO',
                '识别对手weaknesses',
                'Exploitative adjustments',
                '被针对时回到GTO'
            ]
        },
        
        week4: {
            focus: '实战应用',
            practice: [
                '整session使用GTO作baseline',
                '记录何时偏离GTO',
                '评估结果'
            ]
        }
    },

    // GTO Solver使用
    solverUsage: {
        tools: [
            'PioSOLVER',
            'GTO+',
            'SimplePostflop',
            'MonkerSolver'
        ],
        
        howToUse: {
            step1: '输入spot（preflop ranges, board, pot size）',
            step2: 'Run solver',
            step3: '学习GTO策略（frequencies, sizings, ranges）',
            step4: '记忆核心principles',
            step5: '实战应用'
        },
        
        note: 'Solver给出理论最优，但需要理解原理，不是死记'
    },

    // GTO简化版（实战可用）
    simplifiedGTO: {
        concept: '100% accurate GTO太复杂，使用简化版85-90% accurate',
        
        easyRules: {
            preflop: {
                rule1: 'Open 前位紧，后位松（UTG 13%, BTN 42%）',
                rule2: '3-Bet 10-15%，价值:诈唬=1.5:1',
                rule3: 'Call 3-Bet 50-60%，4-Bet 10%'
            },
            
            postflop: {
                rule1: 'Cbet 60-65%，sizing 33-66% pot',
                rule2: 'Check-raise 20-25% OOP',
                rule3: 'Check包含强牌和弱牌',
                rule4: 'River bet价值:诈唬=2:1'
            }
        },
        
        accuracy: '85-90% of perfect GTO',
        benefit: '易于记忆和实战使用'
    },

    // 退守成功案例
    successStories: {
        case1: {
            situation: '被2个LAG玩家针对，-35 BB/100',
            action: '切换到GTO策略',
            duration: '1小时',
            result: '止损，-5 BB/100，然后+2 BB/100',
            lesson: 'GTO成功止损'
        },
        
        case2: {
            situation: '连续bad beats，开始tilt',
            action: '离开5分钟，回来后GTO',
            duration: '剩余session',
            result: '避免tilt spew，保持+3 BB/100',
            lesson: 'GTO是tilt的解药'
        },
        
        case3: {
            situation: '新桌，3个未知对手',
            action: '前20分钟GTO',
            observation: '识别1个Nit，1个Calling Station',
            adjustment: '对Nit bluff，对CS只价值',
            result: '+18 BB/100',
            lesson: 'GTO作为观察baseline，然后exploit'
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gtoFallback;
}

