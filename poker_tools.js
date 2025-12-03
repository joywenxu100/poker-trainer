// 扑克工具集 - EV计算器、Equity计算器、SPR管理、组合计数
// Poker Tools - Calculators and Utilities

const pokerTools = {
    // 1. EV (Expected Value) 计算器
    evCalculator: {
        // 计算Call的EV
        calculateCallEV: function(potSize, betSize, winEquity) {
            // EV = (equity × totalPot) - ((1-equity) × callAmount)
            const totalPot = potSize + betSize;
            const ev = (winEquity * totalPot) - ((1 - winEquity) * betSize);
            
            const potOdds = betSize / (potSize + betSize);
            const needEquity = potOdds;
            
            return {
                ev: ev.toFixed(2),
                evBB: (ev / 2).toFixed(2), // 假设2BB为单位
                decision: ev > 0 ? 'CALL ✅' : 'FOLD ❌',
                potOdds: (potOdds * 100).toFixed(1) + '%',
                needEquity: (needEquity * 100).toFixed(1) + '%',
                yourEquity: (winEquity * 100).toFixed(1) + '%',
                profitMargin: ((winEquity - needEquity) * 100).toFixed(1) + '%'
            };
        },

        // 计算Bet/Raise的EV
        calculateBetEV: function(potSize, betSize, foldEquity, winEquityIfCalled) {
            // EV = (FE × pot) + ((1-FE) × [(equity × totalPot) - betSize])
            const immediateWin = foldEquity * potSize;
            const totalPotIfCalled = potSize + (betSize * 2);
            const calledScenario = (1 - foldEquity) * ((winEquityIfCalled * totalPotIfCalled) - betSize);
            const totalEV = immediateWin + calledScenario;
            
            return {
                ev: totalEV.toFixed(2),
                evBB: (totalEV / 2).toFixed(2),
                decision: totalEV > 0 ? 'BET ✅' : 'CHECK ⚠️',
                foldEquity: (foldEquity * 100).toFixed(1) + '%',
                winEquityIfCalled: (winEquityIfCalled * 100).toFixed(1) + '%',
                immediateWinEV: immediateWin.toFixed(2),
                calledScenarioEV: calledScenario.toFixed(2),
                breakdown: `立即赢: ${immediateWin.toFixed(1)} + 被Call: ${calledScenario.toFixed(1)} = ${totalEV.toFixed(1)}`
            };
        },

        // 计算最优Bet Sizing
        calculateOptimalSizing: function(potSize, equity, foldEquity) {
            // 简化版：基于几何sizing理论
            // 对于诈唬：sizing = pot × (equity / foldEquity)
            // 对于价值：sizing = pot × equity
            
            const bluffSizing = equity < 0.5 ? potSize * (equity / Math.max(foldEquity, 0.3)) : null;
            const valueSizing = equity >= 0.5 ? potSize * Math.min(equity * 1.5, 1) : null;
            
            return {
                recommendedSizing: valueSizing || bluffSizing,
                sizingPercent: ((valueSizing || bluffSizing) / potSize * 100).toFixed(0) + '%',
                type: valueSizing ? '价值下注' : '诈唬',
                reasoning: valueSizing 
                    ? '你有价值优势，bet大些获取最大价值' 
                    : '你在诈唬，bet需要合适的fold equity'
            };
        },

        // 示例场景
        exampleScenarios: [
            {
                name: '翻牌Call听牌',
                pot: 10,
                bet: 6,
                equity: 0.36,
                result: 'EV = +1.16BB, CALL',
                explanation: '同花听牌36% equity，需要27.3% equity即可call'
            },
            {
                name: '河牌诈唬',
                pot: 15,
                betSize: 10,
                foldEquity: 0.6,
                equity: 0.05,
                result: 'EV = +7.5BB, BET',
                explanation: '60% fold equity足够让诈唬盈利'
            }
        ]
    },

    // 2. Equity计算器 (简化版)
    equityCalculator: {
        // 常见对抗equity
        commonMatchups: {
            'AA vs KK': { AA: 0.82, KK: 0.18 },
            'AA vs AK': { AA: 0.87, AK: 0.13 },
            'KK vs AK': { KK: 0.66, AK: 0.34 },
            'QQ vs AK': { QQ: 0.54, AK: 0.46 },
            'JJ vs AQ': { JJ: 0.55, AQ: 0.45 },
            'TT vs AJ': { TT: 0.57, AJ: 0.43 },
            'AK vs AQ': { AK: 0.74, AQ: 0.26 },
            'AK vs QQ': { AK: 0.46, QQ: 0.54 },
            'AK vs 22': { AK: 0.52, '22': 0.48 },
            '对子 vs 两高牌': { pair: 0.55, overcards: 0.45 },
            '对子 vs 一高牌': { pair: 0.70, overcard: 0.30 },
            '大对子 vs 小对子': { bigPair: 0.82, smallPair: 0.18 }
        },

        // 翻牌后equity（基于outs）
        calculateEquityByOuts: function(outs, street) {
            // Rule of 2 and 4
            // Flop到River: outs × 4
            // Turn到River: outs × 2
            
            let equity;
            if (street === 'flop') {
                // 更精确的公式：1 - (1 - outs/47)^2
                equity = outs * 4 - (outs > 8 ? outs - 8 : 0);
            } else if (street === 'turn') {
                equity = outs * 2 + 2;
            } else {
                equity = 0;
            }
            
            return {
                equity: Math.min(equity, 100),
                equityDecimal: Math.min(equity / 100, 1),
                description: this.getOutsDescription(outs)
            };
        },

        getOutsDescription: function(outs) {
            const descriptions = {
                2: '两端顺子听牌（2张牌成顺）',
                4: '暗三听牌（击中set）',
                8: '两端顺子听牌',
                9: '同花听牌',
                12: '同花+inside顺子',
                14: '同花+overcard×2',
                15: '同花+两端顺子',
                21: '超级听牌（怪物听牌）'
            };
            return descriptions[outs] || `${outs} outs`;
        },

        // 常见outs查询
        commonDraws: {
            'gutshot': { outs: 4, equity: '16.5%', name: '内顺听牌' },
            'OESD': { outs: 8, equity: '31.5%', name: '两端顺子听牌' },
            'flush': { outs: 9, equity: '35%', name: '同花听牌' },
            'flushAndOESD': { outs: 15, equity: '54.1%', name: '同花+顺子听牌（怪物）' },
            'flushAndPair': { outs: 12, equity: '45%', name: '同花+对子' },
            'set': { outs: 4, equity: '16.5%', name: '暗三听牌' },
            'twoOvercards': { outs: 6, equity: '24%', name: '两张overcards' },
            'oneOvercard': { outs: 3, equity: '12.5%', name: '一张overcard' }
        }
    },

    // 3. SPR (Stack to Pot Ratio) 管理器
    sprManager: {
        calculateSPR: function(effectiveStack, potSize) {
            return (effectiveStack / potSize).toFixed(2);
        },

        getSPRStrategy: function(spr) {
            if (spr <= 1) {
                return {
                    range: '0-1 (极低)',
                    strategy: 'Pot Committed',
                    commitment: '任何对子+都应该全压',
                    advice: [
                        '顶对顶踢脚全压',
                        '强听牌全压',
                        '即使中对也可能是好牌',
                        '很少能弃牌'
                    ],
                    avoidHands: ['弱Ace', '完全miss'],
                    playHands: ['任何对子+', 'A高+']
                };
            } else if (spr <= 3) {
                return {
                    range: '1-3 (低)',
                    strategy: '顶对=全压',
                    commitment: '顶对及以上全压，中对谨慎',
                    advice: [
                        '顶对+立即全压',
                        '超对全压',
                        '中对看情况（对手范围）',
                        '听牌考虑半诈唬全压'
                    ],
                    avoidHands: ['第二对弱踢脚', '底对'],
                    playHands: ['顶对+', '超对', '强听牌']
                };
            } else if (spr <= 6) {
                return {
                    range: '3-6 (中)',
                    strategy: '两对=全压',
                    commitment: '两对+全压，顶对看牌面',
                    advice: [
                        '两对+立即全压',
                        '顶对顶踢脚可以全压',
                        '顶对弱踢脚控池',
                        '超对警惕可怕牌面',
                        '中对通常check-call'
                    ],
                    avoidHands: ['顶对弱踢脚on湿牌面'],
                    playHands: ['两对+', '顶对顶踢脚', '超对']
                };
            } else if (spr <= 13) {
                return {
                    range: '6-13 (理想)',
                    strategy: '松凶天堂',
                    commitment: '暗三/顺子/同花全压，两对看情况',
                    advice: [
                        '✅ 最适合松凶玩法的SPR',
                        '✅ 投机牌价值大（22-66, 同花连牌）',
                        '暗三/顺子/同花全压',
                        '两对通常全压',
                        '顶对谨慎（可能输给两对+）',
                        '灵活控池或全压'
                    ],
                    idealHands: ['22-66 (setmine)', '87s-54s (顺子/同花)'],
                    playHands: ['坚果类', '两对+']
                };
            } else {
                return {
                    range: '13+ (深)',
                    strategy: '只用坚果全压',
                    commitment: '极度谨慎，避免边缘堆叠',
                    advice: [
                        '⚠️ 只用坚果/接近坚果全压',
                        '⚠️ 两对可能输给暗三',
                        '⚠️ 顶对几乎从不全压',
                        '✅ 投机牌价值最大',
                        '多条街build pot（不要一次全压）',
                        '控池技巧很重要'
                    ],
                    avoidStacks: ['顶对', '两对（可疑情况）', '超对（湿牌面）'],
                    playHands: ['坚果同花', '坚果顺子', '葫芦+']
                };
            }
        },

        // SPR场景示例
        exampleScenarios: [
            {
                scenario: '翻前3-Bet pot',
                preflop: '2.5BB open → 7.5BB 3-bet → Call',
                pot: 16,
                stack: 300,
                spr: 18.75,
                strategy: '深SPR，只用坚果全压',
                note: '3-Bet pot通常SPR高，需谨慎'
            },
            {
                scenario: '翻前单挑pot',
                preflop: '2.5BB open → Call',
                pot: 5.5,
                stack: 300,
                spr: 54.5,
                strategy: '极深SPR，控池为主',
                note: '单挑小pot，SPR极深，灵活操作'
            },
            {
                scenario: 'Short stack推挤',
                preflop: '10BB all-in',
                pot: 13,
                stack: 10,
                spr: 0.77,
                strategy: 'Pot committed',
                note: '短筹码all-in，call只需30%+ equity'
            }
        ]
    },

    // 4. 组合计数器 (Combo Counter)
    comboCounter: {
        // 计算范围包含多少组合
        countCombos: function(range) {
            let total = 0;
            
            for (const hand of range) {
                total += this.getCombosForHand(hand);
            }
            
            return {
                totalCombos: total,
                rangeSize: range.length,
                percentage: (total / 1326 * 100).toFixed(2) + '%'
            };
        },

        getCombosForHand: function(hand) {
            if (hand.length === 2) {
                // 对子 (e.g., 'AA', 'KK')
                return 6;
            } else if (hand.length === 3) {
                if (hand[2] === 's') {
                    // 同花 (e.g., 'AKs')
                    return 4;
                } else if (hand[2] === 'o') {
                    // 非同花 (e.g., 'AKo')
                    return 12;
                }
            }
            return 0;
        },

        // 计算阻断效应
        calculateBlockers: function(yourHand, opponentRange) {
            // 简化版：计算你的牌阻断了对手多少组合
            const blockedCombos = {
                'AA': '你的A阻断对手AA 50%, AK 25%',
                'KK': '你的K阻断对手KK 50%, AK 25%',
                'AK': '你的A和K各阻断AA/KK 50%, AK 75%'
            };
            
            return blockedCombos[yourHand] || '阻断效应计算中...';
        },

        // 常见范围组合数
        commonRanges: {
            'Premium (QQ+, AK)': 34,
            'Broadway pairs (TT+)': 42,
            'All pairs (22+)': 78,
            'Suited broadways': 20,
            'All suited aces': 32,
            'All pocket pairs + AK': 84
        }
    },

    // 5. MDF (最小防守频率) 计算器
    mdfCalculator: {
        calculate: function(potBeforeBet, betSize) {
            // MDF = pot / (pot + bet)
            const mdf = potBeforeBet / (potBeforeBet + betSize);
            const foldFrequency = 1 - mdf;
            
            return {
                mdf: (mdf * 100).toFixed(1) + '%',
                foldFrequency: (foldFrequency * 100).toFixed(1) + '%',
                minDefendPercent: (mdf * 100).toFixed(1),
                interpretation: this.interpretMDF(mdf),
                potOdds: (betSize / (potBeforeBet + betSize) * 100).toFixed(1) + '%'
            };
        },

        interpretMDF: function(mdf) {
            if (mdf >= 0.67) {
                return '需要极宽防守（67%+）- 对手下注太小或pot太大';
            } else if (mdf >= 0.50) {
                return '需要宽防守（50-67%）- 典型半池bet';
            } else if (mdf >= 0.40) {
                return '需要适中防守（40-50%）- 典型3-Bet spot';
            } else {
                return '可以较紧防守（<40%）- 对手下注很大';
            }
        },

        commonSpots: {
            'vs Half Pot Cbet': {
                pot: 10,
                bet: 5,
                mdf: '66.7%',
                advice: '需要用2/3范围继续（call或raise）'
            },
            'vs 3-Bet (2.5x → 7.5x)': {
                pot: 4,
                bet: 5,
                mdf: '44.4%',
                advice: '需要用44%+ Open范围防守（4-Bet或Call）'
            },
            'vs Pot Bet': {
                pot: 10,
                bet: 10,
                mdf: '50%',
                advice: '需要用一半范围继续'
            },
            'vs Overbet (1.5x pot)': {
                pot: 10,
                bet: 15,
                mdf: '40%',
                advice: '可以fold较多，对手需要极强范围'
            }
        }
    },

    // 6. Pot Odds计算器
    potOddsCalculator: {
        calculate: function(potSize, callAmount) {
            const odds = callAmount / (potSize + callAmount);
            const ratio = `${callAmount}:${potSize + callAmount}`;
            
            return {
                potOdds: (odds * 100).toFixed(1) + '%',
                ratio: ratio,
                needEquity: (odds * 100).toFixed(1) + '%',
                decision: '如果你的equity ≥ ' + (odds * 100).toFixed(1) + '%, 则Call盈利'
            };
        },

        quickReference: {
            '1:2': '33.3% equity needed',
            '1:3': '25% equity needed',
            '1:4': '20% equity needed',
            '1:5': '16.7% equity needed',
            '2:5': '28.6% equity needed',
            '3:7': '30% equity needed'
        }
    },

    // 7. Bet Sizing建议
    betSizingGuide: {
        situations: {
            'Cbet干牌面': {
                sizing: '33-40% pot',
                reasoning: '对手难击中，小bet即可赢得底池',
                frequency: '85-95%'
            },
            'Cbet湿牌面': {
                sizing: '66-75% pot',
                reasoning: '需要保护，让听牌付出代价',
                frequency: '60-70%'
            },
            'Value薄价值': {
                sizing: '40-55% pot',
                reasoning: '小bet引诱弱牌call',
                frequency: '只在河牌 vs 弱玩家'
            },
            'Value强价值': {
                sizing: '66-100% pot',
                reasoning: '最大化价值，对手有强牌会call',
                frequency: '两对+ on安全牌面'
            },
            'Bluff河牌': {
                sizing: '75-100% pot',
                reasoning: '让对手面临困难决策',
                frequency: '有credible story时'
            },
            'Blocking Bet': {
                sizing: '20-33% pot',
                reasoning: '控制底池，获得便宜摊牌',
                frequency: '中等强度牌 IP'
            }
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pokerTools;
}

