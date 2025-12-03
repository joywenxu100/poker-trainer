// 📊 筹码深度适应系统 - 300BB到15BB完整过渡
// Stack Depth Adaptation System - Complete Transition from 300BB to 15BB

const stackDepthAdapter = {
    // ==================== 核心哲学 ====================
    philosophy: {
        concept: '不同筹码深度需要不同策略',
        reality: 'WSOP Day 1 (300BB) → Day 2 (100BB) → Day 3 (40BB) → 泡沫期 (25BB) → 决赛桌',
        problem: 'LAG训练器只训练300BB，WSOP训练器从40BB开始',
        solution: '本模块填补150BB, 100BB, 60BB的GAP，提供smooth transition'
    },

    // ==================== 筹码深度分类 ====================
    depthCategories: {
        SUPER_DEEP: {
            range: '250BB+',
            style: 'Full LAG',
            description: '完整松凶策略，最大化chip accumulation'
        },
        DEEP: {
            range: '150-250BB',
            style: 'LAG (80%)',
            description: '保持LAG但稍微收紧，风险管理'
        },
        COMFORTABLE: {
            range: '100-150BB',
            style: 'Semi-LAG / TAG+',
            description: '半松凶或激进TAG，平衡accumulation和风险'
        },
        STANDARD: {
            range: '60-100BB',
            style: 'TAG',
            description: '标准紧凶，稳定play'
        },
        MEDIUM: {
            range: '40-60BB',
            style: 'TAG (tight)',
            description: '偏紧的TAG，避免边缘spot'
        },
        SHORT: {
            range: '20-40BB',
            style: 'Short-stack Aggressive',
            description: '短筹码进攻，找机会双倍'
        },
        VERY_SHORT: {
            range: '10-20BB',
            style: 'Push/Fold',
            description: '推入/弃牌策略'
        },
        CRITICAL: {
            range: '<10BB',
            style: 'All-in or Fold',
            description: '危险区，等待premium all-in'
        }
    },

    // ==================== 筹码深度检测 ====================
    detectStackDepth: function(effectiveBB) {
        if (effectiveBB >= 250) return 'SUPER_DEEP';
        if (effectiveBB >= 150) return 'DEEP';
        if (effectiveBB >= 100) return 'COMFORTABLE';
        if (effectiveBB >= 60) return 'STANDARD';
        if (effectiveBB >= 40) return 'MEDIUM';
        if (effectiveBB >= 20) return 'SHORT';
        if (effectiveBB >= 10) return 'VERY_SHORT';
        return 'CRITICAL';
    },

    // ==================== 完整策略矩阵 ====================
    strategyMatrix: {
        SUPER_DEEP: {
            // 300BB+ 完整LAG
            style: 'LAG',
            VPIP: '32-38%',
            PFR: '28-34%',
            threeBet: '14-18%',
            cbetFreq: '70-75%',
            checkRaiseFreq: '20-25%',
            
            rangeSource: 'deep_stack_lag_trainer.js (完整范围)',
            
            defenseModules: {
                all: true,
                list: [
                    'targeted_detection',
                    'counter_targeting',
                    'balance_trainer',
                    'positional_warfare',
                    'leveled_thinking',
                    'image_management',
                    'gto_fallback',
                    'anti_lag_training'
                ]
            },
            
            focus: 'Chip Accumulation',
            riskTolerance: 'High',
            
            playStyle: {
                preflop: '使用完整LAG翻前范围',
                postflop: '完整7大翻后技能',
                bluffing: '高频率多桶诈唬',
                value: '薄价值3条街'
            },
            
            advice: [
                '最大化chip accumulation',
                '使用全部8大防守模块',
                'vs 弱玩家极度aggressive',
                'vs 强玩家保持balanced',
                '建立形象为后期steal做准备'
            ]
        },

        DEEP: {
            // 150-250BB Semi-LAG
            style: 'LAG (80%)',
            VPIP: '28-34%',  // 收紧4-8%
            PFR: '24-30%',
            threeBet: '12-16%',  // 收紧2-4%
            cbetFreq: '65-72%',  // 收紧3-5%
            checkRaiseFreq: '18-23%',
            
            adjustments: {
                fromSuperDeep: {
                    openRange: '收紧5%（移除最弱suited connectors）',
                    threeBetBluff: '减少20%',
                    postflopBluff: '更selective，避免triple barrel pure bluff',
                    note: '保持LAG形象但降低variance'
                }
            },
            
            defenseModules: {
                active: 7,  // 除了一个
                priority: [
                    'targeted_detection',
                    'counter_targeting',
                    'balance_trainer',
                    'positional_warfare',
                    'leveled_thinking',
                    'image_management',
                    'gto_fallback'
                ],
                optional: 'anti_lag_training (selective)'
            },
            
            focus: 'Chip Accumulation + Risk Management',
            riskTolerance: 'Medium-High',
            
            SPRmanagement: {
                target: '8-15',
                avoid: 'SPR < 6 without premium',
                note: '深度降低，更注意SPR'
            },
            
            advice: [
                '保持LAG但稍微收紧',
                '避免超大底池without nuts',
                '更多pot control with medium hands',
                'vs LAG玩家更保守',
                '继续积累但控制variance'
            ]
        },

        COMFORTABLE: {
            // 100-150BB TAG+
            style: 'TAG+ / Semi-LAG',
            VPIP: '24-30%',  // 进一步收紧
            PFR: '20-26%',
            threeBet: '10-14%',
            cbetFreq: '60-68%',
            checkRaiseFreq: '15-20%',
            
            keyTransition: {
                mentalShift: 'LAG → TAG',
                note: '这是关键过渡点，心态需要调整',
                challenge: 'LAG玩家容易在这里over-aggressive'
            },
            
            adjustments: {
                fromDeep: {
                    openRange: '再收紧5%（只玩solid hands）',
                    threeBetBluff: '减少40%（主要price值）',
                    postflop: '更多pot control',
                    bluffFreq: '减少30%',
                    note: '明显的策略转变点'
                }
            },
            
            defenseModules: {
                active: 5,
                priority: [
                    'targeted_detection',
                    'counter_targeting',
                    'balance_trainer (simplified)',
                    'gto_fallback',
                    'image_management'
                ]
            },
            
            focus: 'Balanced Play - Accumulation + Survival',
            riskTolerance: 'Medium',
            
            SPRmanagement: {
                target: '5-10',
                avoid: 'SPR < 4 without premium',
                commit: '只用strong hands commit'
            },
            
            playStyle: {
                preflop: '收紧到TAG范围',
                postflop: 'Selective aggression',
                bluffing: '只在good spots',
                value: '标准价值下注'
            },
            
            advice: [
                '从LAG切换到TAG心态',
                '不要因为习惯继续over-aggressive',
                '更多fold边缘spot',
                'Position更加重要',
                '避免fancy play'
            ]
        },

        STANDARD: {
            // 60-100BB TAG
            style: 'TAG',
            VPIP: '20-26%',
            PFR: '17-23%',
            threeBet: '8-12%',
            cbetFreq: '55-65%',
            checkRaiseFreq: '12-18%',
            
            defenseModules: {
                active: 4,
                priority: [
                    'targeted_detection (simplified)',
                    'gto_fallback',
                    'image_management',
                    'balance_trainer (core only)'
                ]
            },
            
            focus: 'Solid Play - Avoid Mistakes',
            riskTolerance: 'Medium-Low',
            
            SPRmanagement: {
                target: '3-7',
                commit: 'Top pair+ on safe boards',
                note: 'SPR低，更容易committed'
            },
            
            ICMconsideration: {
                applicable: true,
                note: '开始考虑ICM（如果接近钱圈）'
            },
            
            advice: [
                '标准TAG打法',
                '利用position',
                '避免边缘all-in',
                'Premium hands aggressive',
                '开始考虑ICM压力'
            ]
        },

        MEDIUM: {
            // 40-60BB Short-stack TAG
            style: 'Tight TAG',
            VPIP: '18-24%',
            PFR: '15-21%',
            threeBet: '10-14% (polarized)',
            cbetFreq: '50-60%',
            
            defenseModules: {
                active: 2,
                priority: [
                    'gto_fallback',
                    'ICM awareness'
                ]
            },
            
            focus: 'Survival + Double Up Opportunities',
            riskTolerance: 'Low',
            
            SPRmanagement: {
                target: '2-5',
                commit: 'Frequently with good hands',
                note: 'Low SPR，经常all-in或fold'
            },
            
            allinThreshold: '开始考虑all-in plays',
            
            advice: [
                '收紧范围',
                '等待good spots',
                '不要fancy play',
                'All-in with premium',
                'ICM优先于chip accumulation'
            ]
        },

        SHORT: {
            // 20-40BB Push/Fold Aggressive
            style: 'Aggressive Short-stack',
            VPIP: '16-22%',
            PFR: '14-20%',
            allinFreq: 'High',
            
            strategy: 'Push/Fold + Selective Play',
            
            pushRange: {
                earlyPos: '99+, AJs+, AQo+',
                latePos: '66+, A9s+, ATo+, KJs+, KQo',
                BTN: '22+, A2s+, A7o+, K9s+, KTo+, QJs',
                note: '基于Nash equilibrium调整'
            },
            
            focus: 'Double Up or Bust',
            riskTolerance: 'High (必须赌）',
            
            ICMpriority: 'Very High',
            
            advice: [
                'Push/Fold主要策略',
                '不要slowplay',
                '找机会双倍',
                'ICM极度重要',
                '避免race without edge'
            ]
        },

        VERY_SHORT: {
            // 10-20BB Pure Push/Fold
            style: 'Push/Fold',
            strategy: 'Nash equilibrium based',
            
            pushRange: 'See push/fold charts',
            
            focus: 'Survival',
            ICMpriority: 'Extreme',
            
            advice: [
                '严格Push/Fold',
                '等待premium',
                'ICM第一',
                '不要creative play'
            ]
        },

        CRITICAL: {
            // <10BB Emergency
            style: 'All-in or Fold',
            
            pushRange: 'Any premium (TT+, AQ+)',
            
            advice: [
                '等待任何premium all-in',
                'Steal from late position',
                '祈祷运气',
                '不要放弃'
            ]
        }
    },

    // ==================== 过渡训练系统 ====================
    transitionTraining: {
        // 关键过渡点
        criticalTransitions: {
            transition1: {
                from: 'SUPER_DEEP (300BB)',
                to: 'DEEP (180BB)',
                difficulty: 'Easy',
                challenge: '稍微收紧，降低bluff频率',
                training: '练习识别何时停止triple barrel bluff'
            },
            
            transition2: {
                from: 'DEEP (180BB)',
                to: 'COMFORTABLE (120BB)',
                difficulty: 'Medium',
                challenge: '明显收紧，减少fancy play',
                training: '练习TAG+范围，控制pot size'
            },
            
            transition3: {
                from: 'COMFORTABLE (120BB)',
                to: 'STANDARD (80BB)',
                difficulty: 'Hard ⭐',
                challenge: '从LAG心态切换到TAG心态',
                training: '最关键过渡！需要大量练习',
                note: 'LAG玩家最容易在这里over-aggressive'
            },
            
            transition4: {
                from: 'STANDARD (80BB)',
                to: 'MEDIUM (50BB)',
                difficulty: 'Medium',
                challenge: '开始考虑all-in，ICM压力增加',
                training: '练习short-stack ranges和ICM决策'
            },
            
            transition5: {
                from: 'MEDIUM (50BB)',
                to: 'SHORT (30BB)',
                difficulty: 'Easy',
                challenge: '切换到Push/Fold',
                training: '学习Push/Fold chart'
            }
        },
        
        // 训练场景
        scenarios: [
            {
                name: '300BB → 150BB过渡',
                situation: '你在Day 1，筹码从300BB降到150BB',
                wrongPlay: '继续300BB的aggressive play',
                correctPlay: '收紧5%，减少triple barrel',
                practice: '模拟50手transition period'
            },
            {
                name: '150BB → 100BB过渡',
                situation: '进入Day 2，筹码100BB',
                wrongPlay: '还想LAG',
                correctPlay: '切换到TAG+，更多pot control',
                practice: '心态调整训练'
            },
            {
                name: '100BB → 60BB过渡',
                situation: 'Day 2后期，筹码60BB',
                wrongPlay: '试图fancy play accumulate',
                correctPlay: 'Solid TAG，等待premium',
                practice: 'Fold边缘spot训练'
            }
        ]
    },

    // ==================== 实时策略推荐 ====================
    getStrategy: function(effectiveBB, gameMode = 'tournament', icmPressure = 0) {
        const depth = this.detectStackDepth(effectiveBB);
        const baseStrategy = this.strategyMatrix[depth];
        
        // 锦标赛调整
        if (gameMode === 'tournament') {
            if (icmPressure > 0.8) {
                // 高ICM压力 → 更保守
                return {
                    ...baseStrategy,
                    VPIP: this.adjustStat(baseStrategy.VPIP, -5),
                    threeBet: this.adjustStat(baseStrategy.threeBet, -3),
                    riskTolerance: 'Lower due to ICM',
                    note: '⚠️ 高ICM压力，极度保守'
                };
            } else if (icmPressure > 0.6) {
                // 中等ICM压力
                return {
                    ...baseStrategy,
                    VPIP: this.adjustStat(baseStrategy.VPIP, -2),
                    note: '⚠️ 中等ICM压力，稍微保守'
                };
            }
        }
        
        return baseStrategy;
    },
    
    adjustStat: function(statRange, adjustment) {
        // 调整统计范围
        const match = statRange.match(/(\d+)-(\d+)%/);
        if (match) {
            const low = parseInt(match[1]) + adjustment;
            const high = parseInt(match[2]) + adjustment;
            return `${low}-${high}%`;
        }
        return statRange;
    },

    // ==================== 决策引擎 ====================
    makeDecision: function(gameState) {
        const {
            effectiveBB,
            position,
            hand,
            action,  // 'open', 'call3bet', '4bet', etc.
            icmPressure = 0,
            opponents = []
        } = gameState;
        
        // 1. 检测筹码深度
        const depth = this.detectStackDepth(effectiveBB);
        
        // 2. 获取策略
        const strategy = this.getStrategy(effectiveBB, 'tournament', icmPressure);
        
        // 3. 生成具体决策
        return {
            depth: depth,
            recommendedStyle: strategy.style,
            VPIP: strategy.VPIP,
            specificAction: this.getSpecificAction(action, depth, strategy),
            warnings: this.getWarnings(depth, effectiveBB, icmPressure),
            trainingModule: this.getRelevantModule(depth)
        };
    },
    
    getSpecificAction: function(action, depth, strategy) {
        // 根据深度和策略返回具体action建议
        const actions = {
            'open': {
                SUPER_DEEP: '使用完整LAG Open范围',
                DEEP: '收紧5% LAG范围',
                COMFORTABLE: 'TAG+ Open范围',
                STANDARD: 'TAG Open范围',
                MEDIUM: 'Tight TAG范围',
                SHORT: 'Push/Fold',
                VERY_SHORT: 'Push premium only',
                CRITICAL: 'All-in with TT+, AQ+'
            },
            // More actions...
        };
        
        return actions[action][depth] || 'No specific recommendation';
    },
    
    getWarnings: function(depth, bb, icm) {
        const warnings = [];
        
        if (depth === 'COMFORTABLE' && bb < 120) {
            warnings.push('⚠️ 接近关键过渡点（120BB → 80BB），准备从LAG切换到TAG');
        }
        
        if (depth === 'MEDIUM' && icm > 0.7) {
            warnings.push('🚨 短筹码 + 高ICM = 极度保守！');
        }
        
        if (depth === 'SHORT') {
            warnings.push('⏰ Push/Fold模式，找机会双倍');
        }
        
        return warnings;
    },
    
    getRelevantModule: function(depth) {
        const modules = {
            SUPER_DEEP: 'deep_stack_lag_trainer.html',
            DEEP: 'deep_stack_lag_trainer.html (adjusted)',
            COMFORTABLE: 'stack_transition_trainer.html',
            STANDARD: 'standard_tag_trainer.html',
            MEDIUM: 'short_stack_trainer.html',
            SHORT: 'wsop_push_fold.html',
            VERY_SHORT: 'wsop_push_fold_pro.html',
            CRITICAL: 'emergency_strategy.html'
        };
        
        return modules[depth] || 'unified_training_hub.html';
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = stackDepthAdapter;
}

