// 形象管理系统 - 控制对手对你的认知
// Image Management System - Control How Opponents Perceive You

const imageManagement = {
    // 桌面形象的威力
    powerOfImage: {
        concept: '对手对你的认知 > 你的实际牌力',
        impact: '形象可以让同样的action产生完全不同的结果',
        
        example: {
            tightImage: {
                yourAction: '3-Bet',
                opponentThinks: '他有QQ+/AK',
                opponentFolds: '85%',
                profit: '高fold equity'
            },
            looseImage: {
                yourAction: '3-Bet',
                opponentThinks: '他又在bluff',
                opponentFolds: '40%',
                opponentCalls: '或者4-Bet light',
                profit: '低fold equity，但value bet获利高'
            }
        },
        
        goldenRule: '形象是工具，要主动管理，不要被动形成'
    },

    // 4种核心形象
    imageTypes: {
        // 1. 紧凶形象 (Tight-Aggressive Image)
        tightImage: {
            name: '紧凶形象（Solid/Rock）',
            characteristics: [
                'VPIP显示15-22%',
                '很少Showdown bluff',
                '只用强牌3-Bet/4-Bet',
                'Bet通常是价值',
                '很少Float或多桶bluff'
            ],
            
            advantages: {
                bluffSuccess: '诈唬成功率极高（85%+）',
                foldEquity: '对手尊重你的aggression',
                trapSuccess: '用强牌容易全押栈',
                safeImage: '不容易被targeted'
            },
            
            disadvantages: {
                lowAction: '拿不到action（对手fold多）',
                predictable: '强牌时对手警惕',
                lowValue: '价值牌难榨取max value'
            },
            
            howToBuild: {
                duration: '30-60分钟',
                actions: [
                    '只玩premium牌（TT+, AQ+）',
                    'Fold边缘spot',
                    'Showdown时show强牌2-3次',
                    '不Bluff或Bluff极少',
                    '很少3-Bet'
                ],
                verification: '对手开始给你credit'
            },
            
            howToExploit: {
                timing: '形象建立后30-60分钟',
                tactics: [
                    '开始疯狂bluff（85%+ success）',
                    '3-Bet/4-Bet frequency提升到18%',
                    'Steal blinds 80%+',
                    '对手fold太多，收割'
                ],
                duration: '持续到被catch 1-2次bluff',
                profit: '+25 BB/100 during exploit phase'
            }
        },

        // 2. 松凶形象 (LAG Image)
        lagImage: {
            name: '松凶形象（LAG/Maniac）',
            characteristics: [
                'VPIP显示30-45%',
                '频繁Showdown bluff',
                '经常3-Bet/4-Bet',
                '多桶诈唬',
                'Float和aggressive plays'
            ],
            
            advantages: {
                maxValue: '价值牌获得max action',
                unpredictable: '对手难以read',
                controTable: '控制桌面节奏',
                fear: '对手害怕被run over'
            },
            
            disadvantages: {
                lowBluffSuccess: '诈唬成功率低（40-50%）',
                targeted: '容易被针对',
                calledDown: '对手更多call down',
                highVariance: '波动大'
            },
            
            howToBuild: {
                duration: '20-40分钟',
                actions: [
                    '扩大VPIP到35%+',
                    'Showdown 2-3次bluff',
                    '频繁3-Bet（15%+）',
                    '多桶诈唬',
                    'Float和aggressive plays'
                ],
                verification: '对手开始call你更多'
            },
            
            howToExploit: {
                timing: '形象建立后',
                tactics: [
                    '停止bluff，只用价值牌',
                    '薄价值3条街',
                    '对手会call弱牌',
                    '用强牌设陷阱（他们会pay off）'
                ],
                profit: '+30 BB/100 with value hands'
            }
        },

        // 3. 平衡形象 (Balanced Image)
        balancedImage: {
            name: '平衡形象（Mystery Player）',
            characteristics: [
                'VPIP 22-28%',
                'Showdown mix（有时强牌，有时bluff）',
                '难以categorize',
                '没有clear pattern'
            ],
            
            advantages: {
                unexploitable: '对手无法exploit',
                flexible: '可以根据情况调整',
                longTermOptimal: '长期最优'
            },
            
            disadvantages: {
                noMaxExploit: '无法max exploit对手弱点',
                complex: '需要高技术水平'
            },
            
            howToBuild: {
                approach: 'GTO策略 + 有意识的mix',
                actions: [
                    '50% Showdown show强牌',
                    '50% Showdown show bluff',
                    '平衡所有action',
                    'No predictable pattern'
                ]
            }
        },

        // 4. 变色龙形象 (Chameleon Image)
        chameleonImage: {
            name: '变色龙形象（Image Shifter）',
            concept: '根据需要快速切换形象',
            
            mastery: '形象管理的最高境界',
            
            implementation: {
                phase1: 'Start tight (30分钟)',
                phase2: 'Switch to LAG (1小时)',
                phase3: 'Back to tight (30分钟)',
                phase4: 'Switch to LAG again',
                cycle: '持续切换，对手无法适应'
            },
            
            advantages: {
                maxExploit: '每个阶段都max exploit',
                confusion: '对手完全confused',
                adaptability: '适应任何桌面'
            },
            
            difficulty: '⭐⭐⭐⭐⭐ 最难',
            profit: '+35-45 BB/100'
        }
    },

    // 形象建立策略
    imageBuilding: {
        // 快速建立紧形象
        buildTightImage: {
            step1: {
                time: '前15分钟',
                actions: [
                    'Fold 90%+ 的牌',
                    '只Open TT+, AK, AQ',
                    'Fold面对任何3-Bet',
                    'No bluff at all'
                ],
                goal: '让对手认为你是Nit'
            },
            
            step2: {
                time: '15-30分钟',
                actions: [
                    'Showdown 1-2次强牌（AA, KK, AK）',
                    '故意Show fold（fold到对手的big bet）',
                    'Say "nice hand"',
                    'Look frustrated'
                ],
                goal: '强化Nit形象'
            },
            
            step3: {
                time: '30分钟后',
                actions: ['形象建立完成，开始exploit'],
                verification: '对手给你extreme respect'
            }
        },

        // 快速建立松形象
        buildLooseImage: {
            step1: {
                time: '前10分钟',
                actions: [
                    'Play 40%+ hands',
                    '3-Bet 15%',
                    'Showdown 1-2次bluff',
                    '多桶诈唬1次'
                ],
                goal: '让对手认为你是Maniac'
            },
            
            step2: {
                time: '10-20分钟',
                actions: [
                    '故意Show bluff（成功的）',
                    'Float几次',
                    'Triple barrel 1次',
                    'Say "I thought you were bluffing"'
                ],
                goal: '强化LAG/Maniac形象'
            },
            
            step3: {
                time: '20分钟后',
                actions: ['形象建立完成，开始用价值牌收割'],
                verification: '对手开始call你更多'
            }
        }
    },

    // Showdown管理
    showdownManagement: {
        concept: 'Showdown是建立形象最强的工具',
        
        showStrength: {
            when: [
                '你想建立紧形象',
                '你之后准备bluff',
                '你想让对手fold更多'
            ],
            what: '强牌（AA, KK, Set, 顺子, 同花）',
            how: '故意show牌，或慢慢muck（让对手看到）',
            effect: '对手更respect你'
        },
        
        showBluff: {
            when: [
                '你想建立松形象',
                '你之后准备用价值牌',
                '你想让对手call更多'
            ],
            what: 'Bluff（尤其是成功的triple barrel）',
            how: '故意show bluff，或说"Got lucky"',
            effect: '对手更call你'
        },
        
        showMixed: {
            when: '你想保持平衡形象',
            strategy: '50% show强牌，50% show bluff',
            effect: '对手无法categorize你'
        },
        
        muckStrategy: {
            when: [
                '不想给信息',
                '不想被针对',
                '保持神秘感'
            ],
            how: 'Always muck',
            effect: '对手难以read，但也难以exploit你的形象'
        },
        
        advancedTactic: {
            name: '选择性Show',
            implementation: {
                showToSpecificPlayer: '只给某个对手看牌',
                reason: '针对性建立形象',
                example: 'Show bluff给左边的TAG，他会3-Bet你更多，你可以trap'
            }
        }
    },

    // Speech Play（言语游戏）
    speechPlay: {
        warning: '⚠️ 使用需谨慎，不要overdone',
        
        techniques: {
            afterWinning: {
                tight_image: {
                    say: '"Nice hand" or "You played that well"',
                    tone: '尊重的',
                    effect: '强化你的solid形象'
                },
                loose_image: {
                    say: '"I got lucky" or "Can\'t believe you folded"',
                    tone: '轻松的',
                    effect: '强化你的loose形象'
                }
            },
            
            afterLosing: {
                tight_image: {
                    say: '什么都不说，或"wp"',
                    tone: '职业的',
                    effect: '保持solid形象'
                },
                loose_image: {
                    say: '"How did you know?" or "Sick call"',
                    tone: '惊讶的',
                    effect: '暗示你在bluff'
                }
            },
            
            duringHand: {
                bluffing: {
                    say: '"I think I have the best hand"',
                    effect: '反向心理（他们认为你有牌）'
                },
                valueHand: {
                    say: '"I don\'t know if I should call"',
                    effect: '显示弱，引诱bet'
                }
            }
        },
        
        goldenRule: 'Speech要与形象一致',
        
        example: {
            scenario: '你建立了tight形象，现在在bluff',
            wrongSpeech: '"I don\'t think you have it"（太aggressive）',
            correctSpeech: '什么都不说，或"This is tough"（符合tight image）'
        }
    },

    // 时间Tell（Timing）
    timingTells: {
        concept: '行动时间也传递信息',
        
        manipulation: {
            quickAction: {
                normalMeaning: 'Weak hand or bluff（常见认知）',
                yourUse: '用强牌快速action',
                effect: '对手认为你weak，call/raise更多',
                profit: '+15BB per trap'
            },
            
            slowAction: {
                normalMeaning: 'Strong hand，在思考sizing',
                yourUse: '用bluff慢慢action',
                effect: '对手认为你strong，fold更多',
                profit: '+10BB per bluff'
            },
            
            balanced: {
                approach: '不要让时间pattern太明显',
                method: '随机化时间（有时快，有时慢）',
                effect: '对手无法read你的timing'
            }
        }
    },

    // 形象切换策略
    imageSwitching: {
        concept: '形象不是固定的，要根据需要切换',
        
        cycle: {
            phase1_tight: {
                duration: '30-45分钟',
                actions: ['建立紧形象'],
                profit: '小亏或break even'
            },
            
            phase2_exploit_bluff: {
                duration: '45-90分钟',
                actions: ['用紧形象疯狂bluff'],
                profit: '+25 BB/100'
            },
            
            phase3_switch_to_loose: {
                trigger: '被catch bluff 2次',
                duration: '30-45分钟',
                actions: ['Showdown更多bluff，建立松形象'],
                profit: '小亏或break even'
            },
            
            phase4_exploit_value: {
                duration: '45-90分钟',
                actions: ['用松形象薄价值3条街'],
                profit: '+30 BB/100'
            },
            
            phase5_repeat: {
                action: '回到Phase 1',
                cycle: '持续循环'
            },
            
            totalProfit: '+20-30 BB/100 长期'
        },
        
        triggers: {
            switchToTight: [
                '被catch bluff 2-3次',
                '对手开始call down太多',
                '你需要重建credibility'
            ],
            
            switchToLoose: [
                '对手给你太多respect',
                '你的bluff成功率90%+',
                '你想为价值牌buildup形象'
            ]
        }
    },

    // 针对不同对手的形象选择
    imageVsOpponentType: {
        vsNit: {
            bestImage: 'Loose/Maniac',
            reason: '他们会fold更多',
            exploit: '疯狂bluff'
        },
        
        vsCallingStation: {
            bestImage: 'Tight/Solid',
            reason: '他们会call任何形象的value',
            exploit: '只用价值牌，停止bluff'
        },
        
        vsTAG: {
            bestImage: 'Balanced',
            reason: '他们能识别形象',
            exploit: '保持神秘，mix strategies'
        },
        
        vsLAG: {
            bestImage: 'Tight → Trap',
            reason: '他们aggressive，走入陷阱',
            exploit: '慢打强牌'
        }
    },

    // 形象追踪
    imageTracking: {
        selfAssessment: {
            questions: [
                '1. 对手现在认为我是什么类型？',
                '2. 我最近Showdown了什么牌？',
                '3. 对手是否开始调整vs我？',
                '4. 我的bluff成功率是多少？（太高=tight image）',
                '5. 我的value bet被call频率？（太高=loose image）'
            ]
        },
        
        metrics: {
            tight_indicators: [
                'Bluff成功率 > 80%',
                'Value bet被call < 60%',
                '对手fold to你的3-Bet > 75%'
            ],
            
            loose_indicators: [
                'Bluff成功率 < 55%',
                'Value bet被call > 75%',
                '对手call down你 > 65%'
            ],
            
            balanced: [
                'Bluff成功率 65-75%',
                'Value bet被call 65-70%',
                '对手无clear adjustment'
            ]
        }
    },

    // 实战例子
    realExamples: {
        example1: {
            title: '紧形象 → Bluff收割',
            timeline: {
                '0-30min': '只玩AA/KK/AK，Show 2次强牌',
                '30-90min': '3-Bet频率提升到20%，全是bluff，成功率85%',
                'profit': '+45BB in 1 hour'
            }
        },
        
        example2: {
            title: '松形象 → 价值收割',
            timeline: {
                '0-20min': 'VPIP 45%，Show 3次bluff',
                '20-80min': '只用价值牌3条街，对手call弱牌',
                'profit': '+60BB in 1 hour'
            }
        },
        
        example3: {
            title: '变色龙策略',
            timeline: {
                '0-30min': 'Tight形象',
                '30-70min': 'Bluff收割 (+30BB)',
                '70-90min': 'Switch to Loose',
                '90-150min': '价值收割 (+45BB)',
                '150-180min': 'Back to Tight',
                'total': '+80BB in 3 hours'
            }
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = imageManagement;
}

