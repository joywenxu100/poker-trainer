// 🏆 锦标赛防守适配器 - 将8大防守模块适配到锦标赛
// Tournament Defense Adapter - Adapting 8 Defense Modules for Tournaments

const tournamentDefenseAdapter = {
    // ==================== 模块1: 被针对识别（锦标赛版）====================
    targetedDetectionTournament: {
        philosophy: 'MTT中被针对更危险（无法rebuy），必须更早识别和应对',
        
        indicators: {
            // 翻前指标
            preflop: {
                excessive3Bet: {
                    threshold: '对手对你3-Bet频率 > 18%（vs 标准12%）',
                    severity: 'HIGH',
                    tournamentNote: 'MTT中3-Bet更aggressive，阈值稍高'
                },
                excessive4Bet: {
                    threshold: '对手4-Bet iso你 > 12%（vs 标准7%）',
                    severity: 'CRITICAL',
                    tournamentNote: 'MTT中4-Bet代价更高（chip+ICM）'
                },
                steal3BetHigh: {
                    threshold: '你的steal被3-Bet > 60%',
                    severity: 'MEDIUM',
                    tournamentNote: '考虑盲注压力，部分是常规防守'
                }
            },
            
            // 翻后指标
            postflop: {
                excessiveCheckRaise: {
                    threshold: '对手Check-Raise你 > 22%（vs 标准12%）',
                    severity: 'HIGH',
                    tournamentNote: 'MTT中CR更常见但仍需警惕'
                },
                excessiveRiverCall: {
                    threshold: '对手River call你 > 70%',
                    severity: 'HIGH',
                    tournamentNote: '意味着对手不信任你的下注'
                },
                floatRaised: {
                    threshold: '你Float后被Turn raise > 35%',
                    severity: 'MEDIUM',
                    tournamentNote: '对手识破你的Float pattern'
                }
            },
            
            // 决赛桌特殊指标
            finalTable: {
                multiPlayerFocus: {
                    threshold: '2+玩家同时调整vs你',
                    severity: 'CRITICAL',
                    note: '决赛桌集体针对，极度危险'
                },
                tvAdjustment: {
                    threshold: '电视转播后对手策略明显变化',
                    severity: 'HIGH',
                    note: '对手可能通过你的body language读牌'
                }
            }
        },
        
        // 综合评估（锦标赛版）
        assessSeverity: function(indicators, stackDepth, icmPressure, blindLevel) {
            let baseSeverity = 0;
            let detectedIndicators = [];
            
            // 计算基础严重度
            for (let category in indicators) {
                for (let indicator in indicators[category]) {
                    if (indicators[category][indicator].detected) {
                        baseSeverity += indicators[category][indicator].severity === 'CRITICAL' ? 30 :
                                       indicators[category][indicator].severity === 'HIGH' ? 20 : 10;
                        detectedIndicators.push(`${category}.${indicator}`);
                    }
                }
            }
            
            // 锦标赛特殊调整因子
            const icmMultiplier = icmPressure > 0.8 ? 1.5 :    // 高ICM压力
                                 icmPressure > 0.6 ? 1.3 :    // 中等ICM压力
                                 1.0;                          // 低ICM压力
            
            const stackPenalty = stackDepth < 40 ? 1.4 :      // 短筹码被针对极危险
                                stackDepth < 80 ? 1.2 :       // 中筹码有风险
                                1.0;                           // 深筹码可应对
            
            const blindMultiplier = blindLevel > 15 ? 1.3 :   // 高盲注级别
                                   blindLevel > 10 ? 1.15 :   // 中等盲注
                                   1.0;                        // 早期盲注
            
            const finalSeverity = baseSeverity * icmMultiplier * stackPenalty * blindMultiplier;
            
            return {
                severity: finalSeverity,
                level: finalSeverity >= 80 ? 'CRITICAL' :
                       finalSeverity >= 50 ? 'SEVERE' :
                       finalSeverity >= 30 ? 'MODERATE' : 'LOW',
                indicators: detectedIndicators,
                recommendation: this.getRecommendation(finalSeverity, stackDepth, icmPressure)
            };
        },
        
        getRecommendation: function(severity, stack, icm) {
            if (severity >= 80) {
                return {
                    action: 'EMERGENCY DEFENSE',
                    steps: [
                        '立即切换到GTO模式',
                        '收紧范围25%+',
                        '停止所有诈唬',
                        '如果stack < 30BB考虑换桌（如允许）',
                        'ICM高压下考虑极度保守'
                    ]
                };
            } else if (severity >= 50) {
                return {
                    action: 'DEFENSIVE PHASE',
                    steps: [
                        '收紧Open范围15-20%',
                        '减少3-Bet诈唬50%',
                        '提高Check-Raise到25%',
                        '准备反针对陷阱',
                        '密切监控对手调整'
                    ]
                };
            } else if (severity >= 30) {
                return {
                    action: 'AWARENESS PHASE',
                    steps: [
                        '收紧Open范围10%',
                        '增加trap频率',
                        '保持警惕',
                        '记录针对模式'
                    ]
                };
            } else {
                return {
                    action: 'CONTINUE NORMAL',
                    steps: ['维持当前策略', '持续监控']
                };
            }
        }
    },

    // ==================== 模块2: 反针对策略（锦标赛版）====================
    counterTargetingTournament: {
        philosophy: 'MTT中反击需要考虑ICM和生存，比现金桌更保守',
        
        // Phase 1: 防守阶段
        defensivePhase: {
            adjustmentByStack: {
                deepStack_100BBplus: {
                    openTighten: '-15%',
                    threeBetBluff: '-40%',
                    cbetFreq: '-15%',
                    note: '保持LAG形象但降低风险',
                    expectedResult: '-25 BB/100 → -8 BB/100'
                },
                mediumStack_40_100BB: {
                    openTighten: '-20%',
                    threeBetBluff: '-60%',
                    cbetFreq: '-20%',
                    note: '切换到TAG模式',
                    expectedResult: '-25 BB/100 → -5 BB/100'
                },
                shortStack_under40BB: {
                    openTighten: '-25%',
                    threeBetBluff: '-80%',
                    strategy: 'Push/Fold oriented',
                    note: '生存第一，等待premium',
                    expectedResult: '止损，保持存活'
                }
            },
            
            icmAdjustment: {
                lowICM: {
                    threshold: 'ICM < 0.5',
                    strategy: '标准防守调整',
                    note: 'ICM压力低，可以稍微aggressive'
                },
                mediumICM: {
                    threshold: 'ICM 0.5-0.7',
                    strategy: '保守防守调整',
                    openTighten: '额外-5%',
                    note: '避免边缘spot'
                },
                highICM: {
                    threshold: 'ICM > 0.7',
                    strategy: '极度保守',
                    openTighten: '额外-10%',
                    avoidAllins: '除非nuts',
                    note: '泡沫期或钱圈边缘，生存>chip'
                }
            },
            
            duration: '至少30-45分钟或2-3个blind level'
        },
        
        // Phase 2: 陷阱阶段
        trapPhase: {
            whenToUse: {
                stackCondition: 'Stack > 60BB',
                icmCondition: 'ICM pressure < 0.6',
                tableCondition: '对手过度aggressive',
                note: 'MTT中trap风险更高，条件更严格'
            },
            
            traps: {
                slowPlayPremiums: {
                    hands: ['AA', 'KK'],  // 只用最强牌（vs现金桌QQ+）
                    frequency: '15%',      // 降低（vs现金桌30%）
                    execution: {
                        preflop: 'Call 3-Bet',
                        flop: 'Check',
                        turn: 'Check-call',
                        river: 'Check-raise or call'
                    },
                    riskNote: '输了可能短筹码甚至出局',
                    successRate: '75%',
                    avgProfit: '+40BB'
                },
                
                limpReraise: {
                    hands: ['AA', 'KK', 'AK'],
                    frequency: 'vs LAG who raises limps 85%+',
                    execution: 'Limp → Reraise 3.5-4x',
                    timing: '每2 orbits最多1次',
                    note: 'MTT中更rare，效果更好'
                },
                
                checkCallMonster: {
                    hands: ['暗三', '顺子', '同花'],  // 不包括两对（风险控制）
                    frequency: '20%',  // 降低（vs现金桌30%）
                    execution: 'Check-call flop/turn, river check-raise',
                    stackRequirement: '> 80BB',
                    note: '深筹码才使用'
                }
            }
        },
        
        // Phase 3: 反剥削阶段
        counterExploitPhase: {
            timing: '防守30-45分钟后 AND 对手over-adjusted',
            
            conditions: {
                mustHave: [
                    'Chip cushion（Top 40%）',
                    'ICM pressure < 0.7',
                    'Stack > 50BB',
                    '对手明显over-fold或over-call'
                ],
                note: 'MTT中反击更谨慎，需要更多条件'
            },
            
            tactics: {
                resumeAggression: {
                    openRange: '恢复+5%',
                    threeBetBluff: '恢复到25%',
                    cbetFreq: '恢复到65%',
                    gradual: true,
                    note: '逐步恢复，观察对手反应'
                },
                
                exploitTheirAdjustment: {
                    ifTheyOver3Bet: {
                        counter: '4-Bet frequency 提升到12%',
                        hands: 'JJ+, AQ+, A5s-A2s',
                        sizing: '2.2-2.5x',
                        icmLimit: 'Only if ICM < 0.6'
                    },
                    ifTheyOverFold: {
                        counter: 'Steal frequency提升到70%+',
                        sizing: '2.2BB（小）',
                        note: '小额steal减少风险'
                    },
                    ifTheyCallDownToo Much: {
                        counter: '停止River bluff',
                        strategy: '只用价值牌3条街',
                        note: '薄价值但不要过度'
                    }
                }
            }
        },
        
        // 决赛桌特殊反针对
        finalTableCounter: {
            multiOpponentFocus: {
                situation: '2+玩家同时针对你',
                response: {
                    immediate: '极度收紧（-30%）',
                    image: '展示1-2次强牌',
                    psychological: '假装被压制',
                    timing: '等待他们松懈',
                    trap: '用AA/KK设陷阱'
                },
                note: '决赛桌被集体针对需要极度耐心'
            },
            
            tvBroadcastAdjustment: {
                avoid: [
                    'Body language泄露',
                    '固定timing tell',
                    '情绪表露'
                ],
                maintain: '扑克脸 + 一致的动作',
                useToAdvantage: '故意制造false tell'
            }
        }
    },

    // ==================== 模块3-8: 其他模块锦标赛适配 ====================
    
    balanceTournament: {
        philosophy: 'MTT中平衡同样重要，但需要考虑筹码深度变化',
        
        adjustByStack: {
            deepStack_100BBplus: '使用完整平衡策略（vs现金桌相同）',
            mediumStack_40_100BB: '简化平衡（保留核心principles）',
            shortStack_20_40BB: '偏向价值（诈唬减少）',
            veryShort_under20BB: 'Push/Fold（不需要平衡）'
        },
        
        keyPrinciples: {
            cbetBalance: '深筹码期60-65%，中筹码50-55%',
            checkRaiseBalance: '深筹码期20-25%，中筹码15-18%',
            threeBetBalance: '价值:诈唬 = 1.5-2:1（vs现金桌1.2-1.8:1，更保守）'
        }
    },
    
    positionalWarfareTournament: {
        philosophy: 'MTT中位置战争更brutal，因为无法rebuy',
        
        vsLAGinMTT: {
            earlyStage: '标准positional warfare',
            middleStage: '更保守（ICM考虑）',
            lateStage: '极度位置依赖（短筹码）',
            finalTable: 'ICM > Position（特殊情况除外）'
        },
        
        specialTactics: {
            buttonVsBlindWar: {
                adjustment: 'MTT后期更aggressive（盲注压力）',
                steal: 'BTN steal可达75%+（vs现金桌60%）',
                defense: 'BB需要防守70%+满足MDF'
            }
        }
    },
    
    leveledThinkingTournament: {
        philosophy: 'MTT决赛桌需要Level 4-5思维',
        
        finalTableThinking: {
            level3: '欺骗与陷阱（前期积累筹码）',
            level4: '反向心理（vs 强对手）',
            level5: 'GTO + ICM混合（决赛桌）',
            
            note: 'MTT中需要在Level 3-5之间快速切换'
        }
    },
    
    imageManagementTournament: {
        philosophy: 'MTT中形象管理更复杂（多阶段+电视转播）',
        
        stageBasedImage: {
            earlyStage: {
                buildImage: 'Tight/Solid（为后期steal做准备）',
                duration: '2-4小时',
                showdowns: 'Show强牌1-2次'
            },
            middleStage: {
                switchImage: 'LAG/Aggressive（积累筹码）',
                exploit: '利用早期tight形象',
                duration: '直到被识破或进钱圈'
            },
            bubbleStage: {
                imageUse: '根据stack调整',
                bigStack: '用形象压迫小stack',
                mediumStack: '保持神秘',
                shortStack: '展示tight等待机会'
            },
            finalTable: {
                imageAdjustment: 'TV转播下更谨慎',
                avoid: 'Speech play过度（可能反效果）',
                maintain: '一致的扑克脸'
            }
        }
    },
    
    gtoFallbackTournament: {
        philosophy: 'MTT中GTO是安全baseline，特别是高ICM压力时',
        
        whenToFallback: [
            '被严重针对（severity > 70）',
            'ICM pressure > 0.8',
            '开始tilt',
            '连续bad beats',
            '决赛桌vs多个GTO player',
            '筹码少于20BB'
        ],
        
        gtoRanges: {
            adjustForMTT: {
                openRanges: '比现金桌稍紧（考虑后续压力）',
                threeBetRanges: '更polarized',
                callRanges: '更谨慎（无position时）'
            }
        }
    },
    
    antiLagTournamentSpecial: {
        philosophy: 'MTT中vs LAG需要考虑筹码深度和ICM',
        
        adjustments: {
            deepStack: '使用完整anti-LAG策略',
            mediumStack: '更保守的anti-LAG',
            shortStack: '避免vs LAG（等待vs弱玩家）',
            finalTable: 'ICM优先，selective battle vs LAG'
        }
    },

    // ==================== 整合决策引擎 ====================
    
    decisionEngine: function(gameState) {
        const {
            stackDepth,      // BB数
            icmPressure,     // 0-1
            blindLevel,      // 盲注级别
            playersLeft,     // 剩余玩家数
            tablePosition,   // 位置
            opponentProfile, // 对手类型
            targetingLevel   // 被针对程度
        } = gameState;
        
        // 1. 评估当前状态
        const stackCategory = this.categorizeStack(stackDepth);
        const icmCategory = this.categorizeICM(icmPressure);
        const stage = this.determineStage(playersLeft);
        
        // 2. 选择策略模式
        let strategyMode = 'STANDARD_MTT';
        
        if (targetingLevel === 'SEVERE' || targetingLevel === 'CRITICAL') {
            strategyMode = 'DEFENSIVE';
        } else if (icmPressure > 0.8) {
            strategyMode = 'ICM_PRIORITY';
        } else if (stackDepth < 20) {
            strategyMode = 'PUSH_FOLD';
        } else if (stage === 'FINAL_TABLE' && stackDepth > 40) {
            strategyMode = 'FINAL_TABLE_LAG';
        } else if (stackDepth > 100) {
            strategyMode = 'DEEP_STACK_LAG';
        }
        
        // 3. 获取具体策略
        return this.getStrategy(strategyMode, gameState);
    },
    
    categorizeStack: function(bb) {
        if (bb >= 100) return 'DEEP';
        if (bb >= 60) return 'COMFORTABLE';
        if (bb >= 40) return 'MEDIUM';
        if (bb >= 20) return 'SHORT';
        if (bb >= 10) return 'VERY_SHORT';
        return 'CRITICAL';
    },
    
    categorizeICM: function(pressure) {
        if (pressure >= 0.8) return 'EXTREME';
        if (pressure >= 0.6) return 'HIGH';
        if (pressure >= 0.4) return 'MEDIUM';
        return 'LOW';
    },
    
    determineStage: function(players) {
        if (players <= 9) return 'FINAL_TABLE';
        if (players <= 15) return 'NEAR_FINAL_TABLE';
        if (players <= 30) return 'LATE_STAGE';
        if (players <= 100) return 'MIDDLE_STAGE';
        return 'EARLY_STAGE';
    },
    
    getStrategy: function(mode, gameState) {
        const strategies = {
            'DEEP_STACK_LAG': {
                style: 'LAG with full defense modules',
                VPIP: '32-38%',
                threeBet: '14-18%',
                defenseModules: 'All 8 active',
                focus: 'Chip accumulation',
                note: '使用完整LAG训练器策略'
            },
            
            'FINAL_TABLE_LAG': {
                style: 'Selective LAG with ICM awareness',
                VPIP: '28-34%',
                threeBet: '12-16%',
                defenseModules: 'All 8 active + ICM layer',
                focus: 'Balance chip accumulation and survival',
                note: '决赛桌特殊调整'
            },
            
            'DEFENSIVE': {
                style: 'GTO Fallback',
                VPIP: '收紧20-25%',
                threeBet: '减少50%',
                defenseModules: 'targetedDetection + counterTargeting',
                focus: 'Stop bleeding chips',
                note: '被针对时的防守模式'
            },
            
            'ICM_PRIORITY': {
                style: 'ICM-first strategy',
                VPIP: '极紧（只premium）',
                threeBet: '只value',
                focus: '保级>chip',
                note: '泡沫期或高ICM压力'
            },
            
            'PUSH_FOLD': {
                style: 'Nash equilibrium based',
                strategy: 'Push/Fold chart',
                focus: 'Double up or bust',
                note: '短筹码生存模式'
            }
        };
        
        return strategies[mode] || strategies['STANDARD_MTT'];
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = tournamentDefenseAdapter;
}

