// 💰 实战工具集 - EV计算器 & Equity计算器
// Poker Calculators & Utility Tools

// EV计算器（期望值）
class EVCalculator {
    constructor() {
        this.scenarios = [];
    }
    
    // 计算简单EV: EV = (赢的概率 × 赢的金额) - (输的概率 × 输的金额)
    calculateSimpleEV(winProb, winAmount, loseProb, loseAmount) {
        const ev = (winProb * winAmount) - (loseProb * loseAmount);
        return {
            ev: ev.toFixed(2),
            winProb: (winProb * 100).toFixed(1) + '%',
            loseProb: (loseProb * 100).toFixed(1) + '%',
            expected: ev > 0 ? '✅ 正EV (应该call)' : '❌ 负EV (应该fold)'
        };
    }
    
    // 计算Call的EV
    calculateCallEV(pot, betSize, equity) {
        // equity = 你赢的概率（0-1）
        // pot = 当前底池
        // betSize = 你需要跟注的数量
        
        const totalPot = pot + betSize;
        const winAmount = totalPot;
        const loseAmount = betSize;
        
        const ev = (equity * winAmount) - ((1 - equity) * loseAmount);
        const potOdds = betSize / (pot + betSize);
        const needEquity = (potOdds * 100).toFixed(1);
        const hasEquity = (equity * 100).toFixed(1);
        
        return {
            ev: ev.toFixed(2),
            potOdds: `${(1/potOdds).toFixed(1)}:1`,
            needEquity: needEquity + '%',
            hasEquity: hasEquity + '%',
            decision: equity > potOdds ? 
                `✅ CALL (你有${hasEquity}%，只需${needEquity}%)` :
                `❌ FOLD (你只有${hasEquity}%，需要${needEquity}%)`,
            evPerBB: (ev / 2).toFixed(2) + ' BB'
        };
    }
    
    // 计算3-Bet的EV
    calculate3BetEV(openSize, foldEquity, callEquity, reraiseEquity, pot) {
        // foldEquity = 对手弃牌概率
        // callEquity = 对手跟注时你的胜率
        // reraiseEquity = 对手4-Bet时你的决策
        
        const threeBetSize = openSize * 3;
        
        // 对手Fold: 你赢得底池
        const foldEV = foldEquity * pot;
        
        // 对手Call: 进入翻后
        const callPot = pot + openSize + threeBetSize;
        const callEV = callEquity * callPot - (1 - callEquity) * threeBetSize;
        const totalCallEV = (1 - foldEquity) * 0.7 * callEV;  // 假设70%概率被call
        
        // 对手4-Bet: 你通常fold
        const reraiseEV = (1 - foldEquity) * 0.3 * (-threeBetSize);  // 30%被4-Bet，你fold损失
        
        const totalEV = foldEV + totalCallEV + reraiseEV;
        
        return {
            ev: totalEV.toFixed(2),
            foldEV: foldEV.toFixed(2),
            callEV: totalCallEV.toFixed(2),
            reraiseEV: reraiseEV.toFixed(2),
            decision: totalEV > 0 ?
                `✅ 3-BET (EV: +${totalEV.toFixed(2)}BB)` :
                `❌ FOLD or CALL (EV: ${totalEV.toFixed(2)}BB)`,
            breakdown: `Fold: ${(foldEquity * 100).toFixed(0)}% → +${foldEV.toFixed(1)}BB\n` +
                      `Call: ${((1-foldEquity) * 70).toFixed(0)}% → ${totalCallEV.toFixed(1)}BB\n` +
                      `4-Bet: ${((1-foldEquity) * 30).toFixed(0)}% → ${reraiseEV.toFixed(1)}BB`
        };
    }
    
    // 计算Cbet的EV
    calculateCBetEV(pot, betSize, foldEquity, callEquity) {
        // foldEquity = 对手弃牌概率
        // callEquity = 对手跟注时你的胜率
        
        // 对手Fold
        const foldEV = foldEquity * pot;
        
        // 对手Call
        const newPot = pot + betSize * 2;
        const callEV = callEquity * newPot - (1 - callEquity) * betSize;
        const totalCallEV = (1 - foldEquity) * callEV;
        
        const totalEV = foldEV + totalCallEV;
        
        return {
            ev: totalEV.toFixed(2),
            foldEV: foldEV.toFixed(2),
            callEV: totalCallEV.toFixed(2),
            decision: totalEV > 0 ?
                `✅ CBET (EV: +${totalEV.toFixed(2)}BB)` :
                `❌ CHECK (EV: ${totalEV.toFixed(2)}BB)`,
            profitability: totalEV > betSize * 0.5 ? '🔥 高盈利Cbet' : totalEV > 0 ? '✅ 盈利Cbet' : '❌ 亏损Cbet'
        };
    }
}

// Equity计算器（简化版 - 基于Monte Carlo模拟）
class EquityCalculator {
    constructor() {
        this.deck = this.createDeck();
    }
    
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        const deck = [];
        
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(rank + suit);
            }
        }
        
        return deck;
    }
    
    // 计算手牌 vs 范围的Equity
    calculateHandVsRange(heroHand, villainRange, board = []) {
        // heroHand: ['A♠', 'K♠']
        // villainRange: ['AA', 'KK', 'QQ', 'AK'] - 手牌组合列表
        // board: ['Q♥', 'J♠', '7♦']
        
        // 简化计算：使用预定义的equity表
        const equity = this.estimateEquity(heroHand, villainRange, board);
        
        return {
            equity: (equity * 100).toFixed(1) + '%',
            winProb: equity.toFixed(3),
            recommendation: equity > 0.5 ? '✅ 领先' : equity > 0.4 ? '⚠️ 接近' : '❌ 落后',
            outs: this.calculateOuts(heroHand, board),
            needsImprovement: equity < 0.45
        };
    }
    
    // 简化的equity估算
    estimateEquity(heroHand, villainRange, board) {
        // 这是简化版本，实际应该进行Monte Carlo模拟
        // 这里使用启发式规则
        
        if (board.length === 0) {
            // 翻前equity估算
            return this.preflopEquityEstimate(heroHand, villainRange);
        } else {
            // 翻后equity估算
            return this.postflopEquityEstimate(heroHand, villainRange, board);
        }
    }
    
    preflopEquityEstimate(heroHand, villainRange) {
        // 简化的翻前equity表
        const hero = heroHand.join('').replace(/[♠♥♦♣]/g, '');
        
        // AA vs 任何牌 ≈ 80-85%
        if (hero === 'AA' || hero === 'AA') return 0.82;
        
        // KK vs 非AA范围 ≈ 70-75%
        if (hero === 'KK') {
            return villainRange.includes('AA') ? 0.18 : 0.73;
        }
        
        // QQ vs 非AA/KK ≈ 65-70%
        if (hero === 'QQ') return 0.67;
        
        // AK vs 低对 ≈ 45-50%
        if (hero.includes('AK')) return 0.47;
        
        // 默认估算
        return 0.50;
    }
    
    postflopEquityEstimate(heroHand, villainRange, board) {
        // 简化的翻后equity估算
        const handStrength = this.evaluateHandStrength(heroHand, board);
        
        // 基于手牌强度返回大致equity
        if (handStrength.made === 'straight_flush') return 0.99;
        if (handStrength.made === 'four_of_kind') return 0.95;
        if (handStrength.made === 'full_house') return 0.92;
        if (handStrength.made === 'flush') return 0.85;
        if (handStrength.made === 'straight') return 0.75;
        if (handStrength.made === 'three_of_kind') return 0.70;
        if (handStrength.made === 'two_pair') return 0.60;
        if (handStrength.made === 'one_pair') return 0.45;
        
        // 听牌equity
        if (handStrength.draw === 'nut_flush_draw') return 0.35;
        if (handStrength.draw === 'flush_draw') return 0.33;
        if (handStrength.draw === 'oesd') return 0.32;
        if (handStrength.draw === 'gutshot') return 0.17;
        
        return 0.25;  // High card
    }
    
    evaluateHandStrength(hand, board) {
        // 简化的手牌强度评估
        // 实际应该实现完整的poker hand evaluator
        
        return {
            made: 'one_pair',  // 简化：假设一对
            draw: null
        };
    }
    
    calculateOuts(heroHand, board) {
        // 计算改进牌（outs）
        // 简化版本
        
        if (board.length === 0) {
            return { outs: 0, description: '翻前无outs' };
        }
        
        // 这里应该实现完整的outs计算
        // 简化返回
        return {
            outs: 9,  // 假设同花听牌
            description: '同花听牌 (9 outs)',
            turnEquity: '19.1%',
            riverEquity: '19.6%',
            totalEquity: '35%'
        };
    }
    
    // 快速底池赔率计算
    calculatePotOdds(pot, betSize) {
        const total = pot + betSize;
        const odds = betSize / total;
        const ratio = (1 / odds).toFixed(1);
        const percentage = (odds * 100).toFixed(1);
        
        return {
            odds: `${ratio}:1`,
            percentage: percentage + '%',
            needEquity: percentage + '%',
            example: `底池${pot}BB，对手下注${betSize}BB，你需要${percentage}%胜率才能盈利call`
        };
    }
    
    // 隐含赔率计算
    calculateImpliedOdds(pot, betSize, effectiveStack, impliedMultiplier = 2) {
        // impliedMultiplier = 如果击中，预期能从对手赢得多少倍的当前下注
        
        const directPot = pot + betSize;
        const impliedPot = directPot + (betSize * impliedMultiplier);
        
        const directOdds = (betSize / directPot * 100).toFixed(1);
        const impliedOdds = (betSize / impliedPot * 100).toFixed(1);
        
        return {
            directOdds: directOdds + '%',
            impliedOdds: impliedOdds + '%',
            improvement: `隐含赔率降低需求 ${(directOdds - impliedOdds).toFixed(1)}%`,
            canAfford: effectiveStack > (betSize * (impliedMultiplier + 1)),
            recommendation: effectiveStack > (betSize * 5) ?
                '✅ 深筹码，隐含赔率巨大' :
                '⚠️ 浅筹码，隐含赔率有限'
        };
    }
}

// MDF计算器（最小防守频率）
class MDFCalculator {
    // MDF = 底池 / (底池 + 对手下注)
    calculateMDF(pot, betSize) {
        const mdf = pot / (pot + betSize);
        const foldPercent = (1 - mdf) * 100;
        const defendPercent = mdf * 100;
        
        return {
            mdf: (mdf * 100).toFixed(1) + '%',
            defendFrequency: defendPercent.toFixed(1) + '%',
            maxFoldFrequency: foldPercent.toFixed(1) + '%',
            explanation: `你最多只能弃牌${foldPercent.toFixed(0)}%，否则对手用任何牌下注都盈利`,
            example: pot === 10 && betSize === 6 ?
                '例如：10BB底池，对手下注6BB，你需要防守62.5%（可以fold 37.5%）' :
                `底池${pot}BB，对手下注${betSize}BB，你需要至少防守${defendPercent.toFixed(0)}%`
        };
    }
    
    // 计算理想诈唬频率
    calculateOptimalBluffFrequency(betSize, pot) {
        // 最优诈唬频率 = 对手需要call的比例
        const opponentOdds = betSize / (pot + betSize);
        const bluffFrequency = 1 - opponentOdds;
        
        const valueBets = bluffFrequency;
        const bluffs = 1 - valueBets;
        
        return {
            bluffFrequency: (bluffs * 100).toFixed(1) + '%',
            valueFrequency: (valueBets * 100).toFixed(1) + '%',
            ratio: `${valueBets.toFixed(1)} : ${bluffs.toFixed(1)}`,
            explanation: `你的下注应该包含${(valueBets * 100).toFixed(0)}%价值牌和${(bluffs * 100).toFixed(0)}%诈唬`,
            example: betSize === 10 && pot === 10 ?
                '半池下注 → 67%价值 : 33%诈唬 (2:1比例)' :
                betSize === 20 && pot === 10 ?
                'Over-bet → 75%价值 : 25%诈唬 (3:1比例)' :
                `当前ratio: ${(valueBets/bluffs).toFixed(1)}:1`
        };
    }
}

// 组合计数器
class ComboCounter {
    // 计算某个range有多少组合
    countCombos(range) {
        // range: ['AA', 'KK', 'AKs', 'AKo']
        let totalCombos = 0;
        
        for (const hand of range) {
            if (hand.length === 2 && hand[0] === hand[1]) {
                // 对子：6种组合 (♠♥, ♠♦, ♠♣, ♥♦, ♥♣, ♦♣)
                totalCombos += 6;
            } else if (hand.length === 3 && hand[2] === 's') {
                // 同花：4种组合
                totalCombos += 4;
            } else if (hand.length === 3 && hand[2] === 'o') {
                // 非同花：12种组合
                totalCombos += 12;
            } else if (hand.length === 2) {
                // AK这种写法：16种组合（4种同花 + 12种非同花）
                totalCombos += 16;
            }
        }
        
        return {
            totalCombos,
            rangeSize: range.length,
            avgCombosPerHand: (totalCombos / range.length).toFixed(1),
            breakdown: `${range.length}种手牌 = ${totalCombos}个组合`
        };
    }
    
    // 计算阻断效果
    calculateBlockerEffect(heroHand, villainRange) {
        // heroHand: 'A♠K♠'
        // villainRange: ['AA', 'KK', 'AK']
        
        const heroRanks = [heroHand[0], heroHand[2]];  // ['A', 'K']
        
        let totalCombos = 0;
        let blockedCombos = 0;
        let remainingCombos = 0;
        
        for (const hand of villainRange) {
            const baseCombos = this.countCombos([hand]).totalCombos;
            totalCombos += baseCombos;
            
            // 检查是否被阻断
            if (hand[0] === heroRanks[0] || hand[0] === heroRanks[1] ||
                hand[1] === heroRanks[0] || hand[1] === heroRanks[1]) {
                // 被阻断：减少组合数
                if (hand[0] === hand[1]) {
                    // 对子：从6减少到3
                    blockedCombos += 3;
                    remainingCombos += 3;
                } else {
                    // AK类：从16减少到约9
                    const blocked = hand[2] === 's' ? 1 : 4;
                    blockedCombos += blocked;
                    remainingCombos += (baseCombos - blocked);
                }
            } else {
                remainingCombos += baseCombos;
            }
        }
        
        return {
            originalCombos: totalCombos,
            blockedCombos,
            remainingCombos,
            blockingEffect: ((blockedCombos / totalCombos) * 100).toFixed(1) + '%',
            explanation: `你手中的${heroRanks.join('')}阻断了对手${blockedCombos}/${totalCombos}个组合`,
            recommendation: blockedCombos > totalCombos * 0.2 ?
                '✅ 强阻断效果，适合诈唬' :
                '⚠️ 弱阻断效果'
        };
    }
}

// 创建全局实例
const evCalc = new EVCalculator();
const equityCalc = new EquityCalculator();
const mdfCalc = new MDFCalculator();
const comboCounter = new ComboCounter();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EVCalculator,
        EquityCalculator,
        MDFCalculator,
        ComboCounter,
        evCalc,
        equityCalc,
        mdfCalc,
        comboCounter
    };
}

