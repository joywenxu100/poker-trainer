// 对手分类系统 - 识别并剥削9种对手类型
// Opponent Classification System - Identify and Exploit 9 Player Types

const opponentClassifier = {
    // 9种对手类型及剥削策略
    playerTypes: {
        // 1. 紧弱玩家 (Nit / Rock)
        nit: {
            name: '紧弱玩家 (Nit)',
            emoji: '🪨',
            stats: {
                VPIP: '8-15%',
                PFR: '6-12%',
                threeBet: '1-3%',
                cBet: '50-65%',
                foldToCbet: '75-85%',
                aggression: '0.8-1.5'
            },
            characteristics: [
                '只玩超强牌（JJ+, AK）',
                '极少诈唬',
                '面对aggression立即弃牌',
                '只在坚果时多条街下注',
                '极少3-Bet诈唬'
            ],
            exploitStrategy: {
                preflop: {
                    openWider: '⬆️ 对他们偷盲提升到80%+ (BTN/CO)',
                    foldTo3Bet: '⬇️ 面对他们3-Bet用95%牌fold（他们有坚果）',
                    steal: '✅ 疯狂偷盲，他们极少防守',
                    note: '他们的3-Bet是AA/KK/QQ/AK，直接fold除非你有同等牌力'
                },
                postflop: {
                    cbetAlways: '✅ 任何牌面100% Cbet（他们75%+ fold）',
                    tripleBarrel: '✅ 3桶诈唬成功率90%+',
                    thinValue: '❌ 不要薄价值（他们不会用弱牌call）',
                    float: '✅ Float极有效（他们cbet后很少继续）',
                    checkRaise: '❌ 面对他们bet/raise都是坚果，立即fold'
                },
                specificTips: [
                    '💡 他们check-call = 有牌，stop barrel',
                    '💡 他们check-raise = 坚果，立即fold',
                    '💡 他们river bet = 两对+，fold顶对',
                    '💡 他们只在翻牌后有强牌时才投钱'
                ],
                profit: '+15-20 BB/100',
                difficulty: '⭐ 极易剥削'
            }
        },

        // 2. 松弱玩家 (Calling Station)
        callingStation: {
            name: '松弱玩家 (Calling Station)',
            emoji: '📞',
            stats: {
                VPIP: '35-50%',
                PFR: '5-15%',
                threeBet: '1-3%',
                cBet: '40-60%',
                foldToCbet: '20-35%',
                aggression: '0.5-1.2'
            },
            characteristics: [
                '玩太多手牌',
                '几乎不加注（只call）',
                '不爱弃牌（"我想看看你有什么"）',
                '追听牌到河牌',
                '用弱牌跟注到河牌'
            ],
            exploitStrategy: {
                preflop: {
                    openTighter: '⬇️ 收紧Open范围（他们总是call）',
                    stop3BetBluff: '❌ 停止3-Bet诈唬（他们会call）',
                    valueOnly: '✅ 只用价值牌3-Bet（JJ+, AQ+）',
                    note: '他们会用任何对子/Ax call，导致你多人底池OOP'
                },
                postflop: {
                    stopBluffing: '❌ 完全停止诈唬（他们不会fold）',
                    thinValue: '✅✅✅ 疯狂薄价值！他们用任何对子call',
                    valueBet3Streets: '✅ 价值下注3条街（顶对+）',
                    avoidSemiBluff: '❌ 不要semi-bluff（他们不fold，你equity不够）',
                    checkCall: '✅ 更多check-call（引诱他们诈唬）'
                },
                specificTips: [
                    '💰 他们是ATM机，用价值牌榨干他们',
                    '💰 河牌bet顶对弱踢脚（他们call中对）',
                    '💰 两对+多条街价值（他们call顶对）',
                    '🚫 永远不诈唬（浪费筹码）',
                    '💡 他们raise = 坚果，fold中等牌'
                ],
                profit: '+25-35 BB/100',
                difficulty: '⭐ 极易剥削（只要有耐心）'
            }
        },

        // 3. 松凶玩家 (LAG - Loose Aggressive)
        lag: {
            name: '松凶玩家 (LAG)',
            emoji: '🔥',
            stats: {
                VPIP: '28-40%',
                PFR: '22-35%',
                threeBet: '10-15%',
                cBet: '65-80%',
                foldToCbet: '40-55%',
                aggression: '2.5-4.0'
            },
            characteristics: [
                '玩很多手牌且激进',
                '频繁3-Bet和4-Bet',
                '大量诈唬',
                '施加持续压力',
                '难以读牌'
            ],
            exploitStrategy: {
                preflop: {
                    tightenUp: '⬇️ 收紧Open范围15-20%',
                    slowPlay: '✅ 慢打强牌（AA/KK call他们3-Bet）',
                    call3BetMore: '✅ 更多call 3-Bet（他们诈唬频繁）',
                    avoid4BetBluff: '❌ 减少4-Bet诈唬（他们会5-Bet）',
                    note: '他们的3-Bet范围很宽，不要过度尊重'
                },
                postflop: {
                    checkRaiseMore: '✅ 提高check-raise频率到15%+',
                    callDown: '✅ 更多call down（他们常诈唬）',
                    slowPlay: '✅ 慢打强牌（让他们继续诈唬）',
                    避免bluff: '⬇️ 减少诈唬（他们不轻易fold）',
                    donkBet: '✅ 偶尔donk bet（打乱他们节奏）'
                },
                specificTips: [
                    '💪 他们是强对手，需要调整',
                    '💪 不要跟他们硬刚（避免高波动）',
                    '🎯 用强牌设陷阱（他们会自己送钱）',
                    '🎯 他们river大bet可能是诈唬（考虑call）',
                    '⚠️ 多人底池避开他们（他们太aggressive）'
                ],
                profit: '+5-10 BB/100',
                difficulty: '⭐⭐⭐⭐ 难度高（需要勇气和读牌）'
            }
        },

        // 4. 紧凶玩家 (TAG - Tight Aggressive)
        tag: {
            name: '紧凶玩家 (TAG)',
            emoji: '🎯',
            stats: {
                VPIP: '18-25%',
                PFR: '15-22%',
                threeBet: '6-10%',
                cBet: '60-75%',
                foldToCbet: '55-70%',
                aggression: '2.0-3.0'
            },
            characteristics: [
                '只玩好牌',
                '激进但不失控',
                '平衡的价值/诈唬比',
                '理解范围',
                '难以剥削'
            ],
            exploitStrategy: {
                preflop: {
                    standard: '✅ 使用标准GTO策略',
                    avoid3BetBluff: '⬇️ 减少3-Bet诈唬（他们会4-Bet）',
                    respectedRaises: '✅ 尊重他们的raise（通常是价值）',
                    steal: '✅ 可以偷盲（但他们会防守合理）'
                },
                postflop: {
                    balanced: '✅ 平衡你的范围',
                    float: '✅ Float可行（他们不会无脑triple barrel）',
                    checkRaise: '✅ Check-raise平衡使用',
                    respect: '⚠️ 尊重他们的aggression（通常有牌）'
                },
                specificTips: [
                    '🤝 这是标准对手，打好基础',
                    '📚 用理论策略对抗',
                    '⚠️ 他们会punish你的错误',
                    '💡 寻找微小泄露（3-Bet太少/太多）',
                    '🎓 从他们身上学习'
                ],
                profit: '+2-5 BB/100',
                difficulty: '⭐⭐⭐ 中等难度（需要扎实基础）'
            }
        },

        // 5. 超紧玩家 (Ultra Tight / Nit+)
        ultraTight: {
            name: '超紧玩家 (Nit+)',
            emoji: '🐌',
            stats: {
                VPIP: '5-10%',
                PFR: '4-8%',
                threeBet: '0.5-2%',
                cBet: '40-55%',
                foldToCbet: '85-95%',
                aggression: '0.5-1.0'
            },
            characteristics: [
                '只玩AA/KK/QQ/AK',
                '几乎从不诈唬',
                '等待坚果',
                '极易read',
                '输光筹码离开'
            ],
            exploitStrategy: {
                preflop: {
                    steal90: '⬆️ 偷盲提升到90%+',
                    foldToAny3Bet: '✅ 面对任何3-Bet fold（他们是KK+）',
                    ignorePosition: '✅ 甚至可以从UTG偷他们盲注'
                },
                postflop: {
                    cbet100: '✅ 100% Cbet（他们95% fold）',
                    neverCall: '❌ 永远不要call他们的bet',
                    fold: '✅ 他们bet = 坚果，立即fold'
                },
                specificTips: [
                    '💸 免费钱，疯狂剥削',
                    '⚠️ 他们有牌时不要pay off',
                    '🚫 他们出现在底池 = 你fold'
                ],
                profit: '+18-25 BB/100',
                difficulty: '⭐ 极易（但他们很少出现）'
            }
        },

        // 6. 鱼玩家 (Fish / Recreational Player)
        fish: {
            name: '鱼玩家 (Fish)',
            emoji: '🐟',
            stats: {
                VPIP: '40-60%',
                PFR: '5-20%',
                threeBet: '0-3%',
                cBet: '30-70%',
                foldToCbet: '20-50%',
                aggression: '0.3-1.8'
            },
            characteristics: [
                '玩所有牌',
                '不理解概率',
                '追听牌到底',
                '过度call',
                '情绪化决策'
            ],
            exploitStrategy: {
                preflop: {
                    isolate: '✅✅✅ 隔离加注（3-Bet to 5x+）',
                    playInPosition: '✅ 确保有位置对抗他们',
                    valueOnly: '✅ 只用价值牌3-Bet',
                    avoidMultiway: '❌ 避免多人底池（他们运气好）'
                },
                postflop: {
                    valueBet: '✅✅✅ 疯狂价值下注',
                    largerSize: '⬆️ 大sizing（他们不在乎pot odds）',
                    noBluff: '❌ 永远不诈唬',
                    letThemHang: '✅ 让他们自己上吊（追听牌）'
                },
                specificTips: [
                    '💰💰💰 你的主要利润来源',
                    '👀 找到他们，跟着他们',
                    '❤️ 对他们友好（让他们stay）',
                    '📚 研究他们的泄露',
                    '⏰ 跟他们打的时间越长越好'
                ],
                profit: '+30-50 BB/100',
                difficulty: '⭐ 超易（他们送钱）'
            }
        },

        // 7. Maniac (疯狂激进)
        maniac: {
            name: 'Maniac (疯狂激进)',
            emoji: '🤪',
            stats: {
                VPIP: '50-80%',
                PFR: '40-70%',
                threeBet: '20-40%',
                cBet: '80-95%',
                foldToCbet: '10-30%',
                aggression: '5.0-10.0'
            },
            characteristics: [
                '玩所有牌且极度激进',
                '不停加注',
                '不考虑范围',
                '极高波动',
                '运气好时堆叠你'
            ],
            exploitStrategy: {
                preflop: {
                    tighten: '⬇️ 极度收紧（只玩顶级牌）',
                    callDown: '✅ 用强牌平call他们3-Bet/4-Bet',
                    trapThem: '✅ AA/KK慢打（让他们疯狂raise）',
                    avoid: '❌ 不要bluff（他们总是call）'
                },
                postflop: {
                    checkCall: '✅✅✅ 大量check-call（让他们诈唬）',
                    valueBet: '✅ 有牌时下注（他们会raise）',
                    neverBluff: '❌ 完全不诈唬',
                    letThemBluff: '✅ 让他们做所有的bluffing'
                },
                specificTips: [
                    '🎢 极高波动，需要大bankroll',
                    '😤 他们会让你tilt，保持冷静',
                    '💎 用坚果等他们',
                    '⚠️ 他们运气好时会赢光你',
                    '⏳ 长期你会赢（他们EV极负）'
                ],
                profit: '+20-40 BB/100（但波动巨大）',
                difficulty: '⭐⭐⭐ 中等（需要心理素质）'
            }
        },

        // 8. GTO玩家 (理论优化玩家)
        gtoPlayer: {
            name: 'GTO玩家',
            emoji: '🤖',
            stats: {
                VPIP: '23-28%',
                PFR: '18-25%',
                threeBet: '8-12%',
                cBet: '55-70%',
                foldToCbet: '60-67%',
                aggression: '2.5-3.5'
            },
            characteristics: [
                '平衡的范围',
                '理论正确的频率',
                '难以read',
                '不犯明显错误',
                '几乎不可剥削'
            ],
            exploitStrategy: {
                preflop: {
                    standard: '✅ 使用GTO策略',
                    avoid: '⚠️ 避免花哨play',
                    fundamental: '✅ 扎实基础'
                },
                postflop: {
                    balanced: '✅ 保持平衡',
                    avoid: '⚠️ 不要试图exploitative',
                    study: '📚 研究他们找微小leaks'
                },
                specificTips: [
                    '🤝 打好基础就行',
                    '💼 低盈利但稳定',
                    '📊 寻找理论偏差',
                    '⚠️ 不要过度尊重（他们也会犯错）'
                ],
                profit: '+1-3 BB/100',
                difficulty: '⭐⭐⭐⭐⭐ 极难'
            }
        },

        // 9. 位置虐待者 (Position Abuser)
        positionAbuser: {
            name: '位置虐待者',
            emoji: '📍',
            stats: {
                VPIP: '25-35%',
                PFR: '20-30%',
                threeBet: '8-14%',
                stealAttempt: '60-80%',
                foldToSteal: '50-70%',
                aggression: '2.5-4.0'
            },
            characteristics: [
                '后位极度激进',
                '疯狂偷盲',
                '前位极紧',
                '利用位置优势',
                '翻后操作强'
            ],
            exploitStrategy: {
                preflop: {
                    defend3BetMore: '⬆️ 提高3-Bet防守频率',
                    callWider: '✅ 更宽call他们的steal',
                    squeeze: '✅ 多使用squeeze',
                    adjustByPosition: '✅ 根据位置调整'
                },
                postflop: {
                    checkRaise: '✅ 提高check-raise频率',
                    donkBet: '✅ 使用donk bet',
                    leadFlop: '✅ 翻牌领先下注',
                    aggressive: '✅ OOP时更aggressive'
                },
                specificTips: [
                    '🎯 他们的弱点是前位',
                    '💪 在盲注位反击',
                    '🔥 他们后位在bluff，call down',
                    '⚠️ 不要让他们控制底池'
                ],
                profit: '+8-12 BB/100',
                difficulty: '⭐⭐⭐ 中等'
            }
        }
    },

    // 自动识别函数
    identifyOpponent: function(stats) {
        const { VPIP, PFR, threeBet, aggression, foldToCbet } = stats;

        // 识别逻辑
        if (VPIP < 12 && PFR < 10 && threeBet < 3) {
            return this.playerTypes.nit;
        }
        if (VPIP < 10 && PFR < 8) {
            return this.playerTypes.ultraTight;
        }
        if (VPIP > 40 && aggression < 1.5 && foldToCbet < 35) {
            return this.playerTypes.callingStation;
        }
        if (VPIP > 50 && aggression > 5 && threeBet > 20) {
            return this.playerTypes.maniac;
        }
        if (VPIP > 28 && PFR > 22 && threeBet > 10 && aggression > 2.5) {
            return this.playerTypes.lag;
        }
        if (VPIP > 40 && aggression < 2) {
            return this.playerTypes.fish;
        }
        if (VPIP >= 18 && VPIP <= 25 && PFR >= 15 && aggression >= 2 && aggression <= 3) {
            return this.playerTypes.tag;
        }
        if (VPIP >= 23 && VPIP <= 28 && Math.abs(foldToCbet - 67) < 5) {
            return this.playerTypes.gtoPlayer;
        }
        
        // 默认返回TAG
        return this.playerTypes.tag;
    },

    // 获取剥削建议
    getExploitAdvice: function(opponentType, situation) {
        const type = this.playerTypes[opponentType] || this.playerTypes.tag;
        
        if (situation === 'preflop') {
            return type.exploitStrategy.preflop;
        } else if (situation === 'postflop') {
            return type.exploitStrategy.postflop;
        } else {
            return {
                name: type.name,
                emoji: type.emoji,
                profit: type.exploitStrategy.profit,
                difficulty: type.exploitStrategy.difficulty,
                tips: type.exploitStrategy.specificTips
            };
        }
    },

    // 生成HUD显示
    generateHUD: function(playerName, stats) {
        const opponent = this.identifyOpponent(stats);
        return {
            name: playerName,
            type: opponent.name,
            emoji: opponent.emoji,
            stats: stats,
            expectedProfit: opponent.exploitStrategy.profit,
            keyStrategy: opponent.exploitStrategy.specificTips[0],
            color: this.getColorByType(opponent)
        };
    },

    // 根据类型获取颜色
    getColorByType: function(opponent) {
        const colors = {
            '紧弱玩家 (Nit)': '#32CD32',           // 绿色 (easy money)
            '松弱玩家 (Calling Station)': '#FFD700', // 金色 (huge profit)
            '松凶玩家 (LAG)': '#FF4500',            // 橙红 (danger)
            '紧凶玩家 (TAG)': '#4682B4',            // 钢蓝 (standard)
            '超紧玩家 (Nit+)': '#00FF00',           // 亮绿 (free money)
            '鱼玩家 (Fish)': '#00FFFF',             // 青色 (jackpot)
            'Maniac (疯狂激进)': '#DC143C',         // 深红 (volatile)
            'GTO玩家': '#808080',                   // 灰色 (neutral)
            '位置虐待者': '#FFA500'                 // 橙色 (adjustable)
        };
        return colors[opponent.name] || '#FFFFFF';
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = opponentClassifier;
}
