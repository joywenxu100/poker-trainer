// 被针对识别系统 - 实时检测对手是否在针对你
// Targeted Detection System - Real-time Detection of Being Exploited

const targetedDetection = {
    // 被针对的关键指标
    indicators: {
        // 1. 翻前指标
        preflop: {
            excessiveThreeBet: {
                name: '过度3-Bet',
                threshold: {
                    normal: '8-12%',
                    targeted: '18%+',
                    severe: '25%+'
                },
                detection: function(opponent3BetFreq, normalFreq = 0.10) {
                    if (opponent3BetFreq >= normalFreq * 2.5) {
                        return {
                            severity: 'severe',
                            alert: '🚨 严重警告！对手对你3-Bet频率是正常的2.5倍+',
                            action: '立即收紧Open范围20%'
                        };
                    } else if (opponent3BetFreq >= normalFreq * 1.8) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 警告！对手对你3-Bet频率是正常的1.8倍',
                            action: '收紧Open范围15%'
                        };
                    }
                    return { severity: 'none', alert: null };
                },
                profit_loss: '-15 to -25 BB/100 if not adjusted'
            },

            limpReraise: {
                name: 'Limp-Reraise陷阱',
                threshold: {
                    normal: '0-1% of hands',
                    targeted: '2%+',
                    severe: '3%+'
                },
                detection: function(limpReraises, totalHands) {
                    const freq = limpReraises / totalHands;
                    if (freq >= 0.03) {
                        return {
                            severity: 'severe',
                            alert: '🚨 对手频繁Limp-Reraise你（3%+）',
                            meaning: '他在用强牌设陷阱等你raise',
                            action: '停止孤立加注limper，尊重他们的limp'
                        };
                    } else if (freq >= 0.02) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 对手开始Limp-Reraise',
                            action: '谨慎对待limper'
                        };
                    }
                    return { severity: 'none' };
                },
                profit_loss: '-30 to -50 BB per occurrence'
            },

            coldCallTrap: {
                name: 'Cold Call陷阱',
                threshold: {
                    normal: 'Call你的3-Bet 50-60%',
                    targeted: 'Call你的3-Bet 70%+',
                    meaning: '他在用强牌慢打'
                },
                detection: function(callThreeBetFreq) {
                    if (callThreeBetFreq >= 0.70) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 对手用70%+范围Call你的3-Bet',
                            meaning: '他可能在慢打强牌，准备翻后陷阱',
                            action: '3-Bet后Cbet更谨慎，准备面对check-raise'
                        };
                    }
                    return { severity: 'none' };
                }
            }
        },

        // 2. 翻后指标
        postflop: {
            excessiveCheckRaise: {
                name: '过度Check-Raise',
                threshold: {
                    normal: '8-12%',
                    targeted: '18%+',
                    severe: '25%+'
                },
                detection: function(checkRaiseFreq) {
                    if (checkRaiseFreq >= 0.25) {
                        return {
                            severity: 'severe',
                            alert: '🚨 对手Check-Raise你的频率25%+',
                            meaning: '他不尊重你的Cbet，认为你在bluff',
                            action: [
                                '立即降低Cbet频率15-20%',
                                '增加check back频率',
                                '用强牌check-call设反陷阱'
                            ],
                            profit_loss: '-20 BB/100 if not adjusted'
                        };
                    } else if (checkRaiseFreq >= 0.18) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 对手Check-Raise频率18%+',
                            action: '降低Cbet频率10%，更多check back'
                        };
                    }
                    return { severity: 'none' };
                }
            },

            excessiveCallDown: {
                name: '过度Call Down',
                threshold: {
                    normal: 'River call你的频率 40-50%',
                    targeted: 'River call你的频率 60%+',
                    meaning: '他不相信你的river bet'
                },
                detection: function(riverCallFreq) {
                    if (riverCallFreq >= 0.65) {
                        return {
                            severity: 'severe',
                            alert: '🚨 对手River call你的频率65%+',
                            meaning: '他认为你经常river bluff',
                            action: [
                                '停止river诈唬',
                                '只用价值牌bet',
                                '薄价值下注（他会call弱牌）'
                            ],
                            profit_loss: '-15 BB/100 if keep bluffing'
                        };
                    } else if (riverCallFreq >= 0.60) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 对手River call频率60%+',
                            action: '减少river bluff，增加价值'
                        };
                    }
                    return { severity: 'none' };
                }
            },

            floatAndRaise: {
                name: 'Float后Turn Raise',
                threshold: {
                    normal: '你Float后被raise 10-15%',
                    targeted: '你Float后被raise 25%+',
                    meaning: '他识别你的Float玩法'
                },
                detection: function(floatRaisedFreq) {
                    if (floatRaisedFreq >= 0.30) {
                        return {
                            severity: 'severe',
                            alert: '🚨 你Float后被Turn Raise 30%+',
                            meaning: '对手完全识破你的Float策略',
                            action: [
                                '立即停止Float vs 此对手',
                                '翻牌有真牌才Call',
                                '考虑翻牌Raise取代Float'
                            ],
                            profit_loss: '-18 BB/100'
                        };
                    } else if (floatRaisedFreq >= 0.25) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ Float后被Raise频率高',
                            action: '减少Float频率50%'
                        };
                    }
                    return { severity: 'none' };
                }
            },

            donkBetAgainstYou: {
                name: 'Donk Bet针对',
                threshold: {
                    normal: 'Donk bet频率 5-8%',
                    targeted: 'Donk bet频率 15%+',
                    meaning: '打乱你的position优势'
                },
                detection: function(donkBetFreq) {
                    if (donkBetFreq >= 0.15) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 对手频繁Donk Bet vs 你（15%+）',
                            meaning: '他在破坏你的position优势',
                            action: [
                                'Donk bet后用强牌raise',
                                '弱牌直接fold',
                                '不要Float donk bet'
                            ]
                        };
                    }
                    return { severity: 'none' };
                }
            }
        },

        // 3. 心理战指标
        psychological: {
            suddenStyleChange: {
                name: '突然风格转变',
                detection: function(recentVPIP, previousVPIP) {
                    const change = Math.abs(recentVPIP - previousVPIP);
                    if (change >= 0.15 && recentVPIP > previousVPIP) {
                        return {
                            severity: 'moderate',
                            alert: '⚠️ 对手突然变得更激进（VPIP +15%+）',
                            meaning: '可能在针对你，或识别到你收紧了',
                            action: '观察2-3个orbit，重新评估对手'
                        };
                    }
                    return { severity: 'none' };
                }
            },

            isolatingYou: {
                name: '隔离你',
                detection: function(raiseAfterYouOpenFreq) {
                    if (raiseAfterYouOpenFreq >= 0.25) {
                        return {
                            severity: 'severe',
                            alert: '🚨 对手在你Open后Raise频率25%+',
                            meaning: '他专门隔离你，认为你Open太宽',
                            action: [
                                '收紧Open范围',
                                '停止从早位Open边缘牌',
                                '用强牌4-Bet反击'
                            ]
                        };
                    }
                    return { severity: 'none' };
                }
            }
        }
    },

    // 综合检测系统
    comprehensiveDetection: function(playerStats) {
        const {
            opponent3BetFreqVsYou,
            opponent3BetFreqVsOthers,
            opponentCheckRaiseFreqVsYou,
            opponentCheckRaiseFreqVsOthers,
            opponentRiverCallFreqVsYou,
            limpReraiseCount,
            totalHands,
            floatRaisedCount,
            yourFloatCount
        } = playerStats;

        const alerts = [];
        let totalSeverity = 0;

        // 检测3-Bet针对
        if (opponent3BetFreqVsYou && opponent3BetFreqVsOthers) {
            const ratio = opponent3BetFreqVsYou / opponent3BetFreqVsOthers;
            if (ratio >= 2.0) {
                alerts.push({
                    type: 'preflop_3bet',
                    severity: 'severe',
                    message: `🚨 对手对你3-Bet频率是对其他人的${ratio.toFixed(1)}倍`,
                    vsYou: `${(opponent3BetFreqVsYou * 100).toFixed(1)}%`,
                    vsOthers: `${(opponent3BetFreqVsOthers * 100).toFixed(1)}%`,
                    action: '立即收紧Open范围20%'
                });
                totalSeverity += 3;
            } else if (ratio >= 1.6) {
                alerts.push({
                    type: 'preflop_3bet',
                    severity: 'moderate',
                    message: `⚠️ 对手对你3-Bet频率明显更高`,
                    action: '收紧Open范围15%'
                });
                totalSeverity += 2;
            }
        }

        // 检测Check-Raise针对
        if (opponentCheckRaiseFreqVsYou && opponentCheckRaiseFreqVsOthers) {
            const ratio = opponentCheckRaiseFreqVsYou / opponentCheckRaiseFreqVsOthers;
            if (ratio >= 2.0) {
                alerts.push({
                    type: 'postflop_checkraise',
                    severity: 'severe',
                    message: `🚨 对手Check-Raise你的频率是其他人的${ratio.toFixed(1)}倍`,
                    vsYou: `${(opponentCheckRaiseFreqVsYou * 100).toFixed(1)}%`,
                    vsOthers: `${(opponentCheckRaiseFreqVsOthers * 100).toFixed(1)}%`,
                    action: '降低Cbet频率20%，用强牌check-call'
                });
                totalSeverity += 3;
            }
        }

        // 检测River Call Down
        if (opponentRiverCallFreqVsYou >= 0.65) {
            alerts.push({
                type: 'postflop_calldown',
                severity: 'severe',
                message: `🚨 对手River call你的频率${(opponentRiverCallFreqVsYou * 100).toFixed(1)}%`,
                meaning: '他不相信你的river bet',
                action: '停止river诈唬，只用价值牌'
            });
            totalSeverity += 2;
        }

        // 检测Limp-Reraise
        if (limpReraiseCount && totalHands) {
            const limpReraiseFreq = limpReraiseCount / totalHands;
            if (limpReraiseFreq >= 0.03) {
                alerts.push({
                    type: 'preflop_limprr',
                    severity: 'severe',
                    message: '🚨 对手频繁Limp-Reraise你',
                    action: '停止孤立加注limper'
                });
                totalSeverity += 2;
            }
        }

        // 检测Float被Raise
        if (floatRaisedCount && yourFloatCount) {
            const floatRaisedFreq = floatRaisedCount / yourFloatCount;
            if (floatRaisedFreq >= 0.30) {
                alerts.push({
                    type: 'postflop_float',
                    severity: 'severe',
                    message: '🚨 你的Float被识破（被Raise 30%+）',
                    action: '立即停止Float vs 此对手'
                });
                totalSeverity += 2;
            }
        }

        // 综合评估
        const targetedLevel = totalSeverity >= 6 ? 'severe' : 
                             totalSeverity >= 3 ? 'moderate' : 
                             totalSeverity >= 1 ? 'mild' : 'none';

        return {
            isTargeted: totalSeverity > 0,
            targetedLevel: targetedLevel,
            totalSeverity: totalSeverity,
            alerts: alerts,
            recommendation: this.getRecommendation(targetedLevel, alerts)
        };
    },

    // 获取建议
    getRecommendation: function(level, alerts) {
        if (level === 'severe') {
            return {
                urgency: '🚨 立即行动！',
                summary: '你被严重针对！必须立即调整策略',
                immediateActions: [
                    '1. 立即收紧Open范围20%',
                    '2. 停止3-Bet诈唬50%',
                    '3. 降低Cbet频率20%',
                    '4. 停止Float和多桶诈唬',
                    '5. 用强牌设反陷阱（慢打AA/KK）',
                    '6. 考虑退守GTO策略'
                ],
                expectedLoss: '-25 to -35 BB/100 if not adjusted',
                expectedGain: '+5 to +10 BB/100 after adjustment'
            };
        } else if (level === 'moderate') {
            return {
                urgency: '⚠️ 需要调整',
                summary: '对手开始针对你，需要适度调整',
                immediateActions: [
                    '1. 收紧Open范围10-15%',
                    '2. 减少3-Bet诈唬30%',
                    '3. 降低Cbet频率10%',
                    '4. 更谨慎地Float',
                    '5. 观察对手是否持续针对'
                ],
                expectedLoss: '-10 to -15 BB/100 if not adjusted',
                expectedGain: '+2 to +5 BB/100 after adjustment'
            };
        } else if (level === 'mild') {
            return {
                urgency: '💡 保持警惕',
                summary: '出现针对迹象，继续观察',
                immediateActions: [
                    '1. 密切观察对手行为',
                    '2. 稍微收紧策略5-10%',
                    '3. 准备随时调整'
                ]
            };
        } else {
            return {
                urgency: '✅ 安全',
                summary: '未检测到针对，继续执行标准LAG策略',
                immediateActions: []
            };
        }
    },

    // 实时监控界面数据
    createMonitoringHUD: function(playerName, detectionResult) {
        if (!detectionResult.isTargeted) {
            return {
                playerName: playerName,
                status: '✅ 安全',
                color: '#32CD32',
                message: '未被针对，继续标准策略'
            };
        }

        const colors = {
            'severe': '#DC143C',   // 深红
            'moderate': '#FF8C00', // 橙色
            'mild': '#FFD700'      // 金色
        };

        return {
            playerName: playerName,
            status: detectionResult.targetedLevel === 'severe' ? '🚨 严重针对' :
                   detectionResult.targetedLevel === 'moderate' ? '⚠️ 被针对' : '💡 警惕',
            color: colors[detectionResult.targetedLevel],
            severity: detectionResult.totalSeverity,
            alerts: detectionResult.alerts,
            recommendation: detectionResult.recommendation
        };
    },

    // 历史追踪
    trackHistory: function() {
        const history = [];
        
        return {
            addEvent: function(opponent, eventType, severity, timestamp) {
                history.push({
                    opponent: opponent,
                    eventType: eventType,
                    severity: severity,
                    timestamp: timestamp || new Date().toISOString()
                });
                
                // 保留最近50条记录
                if (history.length > 50) {
                    history.shift();
                }
            },
            
            getHistory: function(opponent) {
                return history.filter(h => h.opponent === opponent);
            },
            
            getRecentTargeting: function(minutes = 30) {
                const cutoff = Date.now() - minutes * 60 * 1000;
                return history.filter(h => new Date(h.timestamp) > cutoff);
            }
        };
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = targetedDetection;
}

