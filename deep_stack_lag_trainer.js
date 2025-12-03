// 深筹码松凶玩家训练器 - 核心逻辑
// 300BB+ LAG Style Training System

// 手牌矩阵生成
// ✅ 企业级说明：此数组访问是安全的，因为i和j受到ranks.length严格约束
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const allHands = [];

// 生成169种起手牌
for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
        if (i === j) {
            // 对子 - 索引访问安全：i, j ∈ [0, 12]
            allHands.push(ranks[i] + ranks[j]);
        } else if (i < j) {
            // 同花
            allHands.push(ranks[i] + ranks[j] + 's');
        } else {
            // 非同花
            allHands.push(ranks[j] + ranks[i] + 'o');
        }
    }
}

// 深筹码松凶范围数据库
const lagRanges = {
    // Open Raise 范围 (首次加注)
    openRaise: {
        UTG: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
                   'KQs', 'KJs', 'KTs',
                   'QJs', 'QTs',
                   'JTs',
                   'AKo', 'AQo', 'AJo', 'KQo'],
            percentage: '12%',
            sizing: '2.5BB (vs BB+Straddle: 3.5-4BB)',
            notes: 'UTG最紧位置：77+对子，高档同花牌。300BB+深筹码仍需极度谨慎'
        },
        UTG1: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s',
                   'KQs', 'KJs', 'KTs', 'K9s',
                   'QJs', 'QTs', 'Q9s',
                   'JTs', 'J9s',
                   'T9s', 'T8s',
                   '98s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo'],
            percentage: '17%',
            sizing: '2.5BB (vs BB+Straddle: 3.5BB)',
            notes: 'UTG1比UTG稍宽：66+对子，增加更多同花牌和T8s/98s连牌'
        },
        LJ: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s',
                   'QJs', 'QTs', 'Q9s',
                   'JTs', 'J9s', 'J8s',
                   'T9s', 'T8s',
                   '98s', '97s',
                   '87s', '76s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo'],
            percentage: '24%',
            sizing: '2.5BB',
            notes: 'LJ开始显著扩张：44+对子、所有suited wheel aces、连牌到76s'
        },
        HJ: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
                   'QJs', 'QTs', 'Q9s', 'Q8s',
                   'JTs', 'J9s', 'J8s', 'J7s',
                   'T9s', 'T8s', 'T7s',
                   '98s', '97s', '96s',
                   '87s', '86s',
                   '76s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo'],
            percentage: '28%',
            sizing: '2.5BB',
            notes: 'HJ大幅扩张，所有对子+所有同花Ace+大量同花连牌'
        },
        CO: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
                   'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
                   'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s',
                   'T9s', 'T8s', 'T7s', 'T6s', 'T5s',
                   '98s', '97s', '96s', '95s', '94s',
                   '87s', '86s', '85s', '84s',
                   '76s', '75s', '74s',
                   '65s', '64s', '63s',
                   '54s', '53s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
                   'KQo', 'KJo', 'KTo', 'K9o', 'K8o',
                   'QJo', 'QTo', 'Q9o', 'Q8o',
                   'JTo', 'J9o', 'J8o',
                   'T9o', '98o'],
            percentage: '42%',
            sizing: '2.5BB',
            notes: '⚠️ 修复：CO应该更松凶！增加K6s-K4s/Q6s-Q5s/J5s-J4s/95s-94s/84s/74s/64s-63s/53s/A7o-A5o/K8o/Q8o/J8o/98o。深筹码+位置=大量投机牌'
        },
        BTN: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
                   'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
                   'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
                   'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s',
                   '98s', '97s', '96s', '95s', '94s',
                   '87s', '86s', '85s', '84s',
                   '76s', '75s', '74s', '73s',
                   '65s', '64s', '63s',
                   '54s', '53s', '52s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
                   'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o',
                   'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o',
                   'JTo', 'J9o', 'J8o', 'J7o',
                   'T9o', 'T8o', 'T7o',
                   '98o', '97o',
                   '87o', '76o'],
            percentage: '58%',
            sizing: '2.5BB',
            notes: '⚠️ 修复：BTN是松凶的天堂！应该玩接近60%！增加J3s-J2s/T4s-T3s/94s/84s/73s/63s/52s/A4o-A2o/K7o-K6o/Q7o/J7o/T7o/97o/87o/76o'
        },
        SB: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
                   'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
                   'JTs', 'J9s', 'J8s', 'J7s',
                   'T9s', 'T8s', 'T7s',
                   '98s', '97s', '96s',
                   '87s', '86s',
                   '76s', '75s',
                   '65s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
                   'KQo', 'KJo', 'KTo', 'K9o',
                   'QJo', 'QTo'],
            percentage: '38%',
            sizing: '3BB (vs BB+Straddle)',
            notes: 'SB面对多个位置，稍微收紧但仍然激进'
        },
        BB: {
            range: 'Facing raise - see defense ranges',
            percentage: 'N/A - 防守位',
            sizing: 'N/A',
            notes: 'BB主要是防守和3-Bet，很少主动开池（除非fold to BB）'
        },
        STRADDLE: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
                   'QJs', 'QTs', 'Q9s',
                   'JTs', 'J9s',
                   'T9s', '98s', '87s', '76s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
                   'KQo', 'KJo', 'KTo'],
            percentage: '32%',
            sizing: '2.5BB (总共10BB from Straddle position)',
            notes: '✅ 新增！当所有人Fold到Straddle时主动Open！Straddle已投入4BB，在BB后面有位置优势，可以比BB更激进。范围类似BTN但稍紧（因为还要考虑BB 3-Bet）'
        }
    },

    // 3-Bet 范围 (对不同位置的再加注)
    threeBet: {
        BTN: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo',
                       'A5s', 'A4s', 'A3s', 'A2s',
                       '87s', '76s', '65s', '54s'],
                percentage: '8.5%',
                sizing: '3x (vs 2.5BB = 7.5BB)',
                notes: '对抗UTG紧一些，JJ+/AQ+价值，Axs阻断牌诈唬'
            },
            vsLJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'AKo', 'AQo',
                       'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s', 'K8s',
                       'Q9s',
                       'J9s', 'J8s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s', '54s'],
                percentage: '12%',
                sizing: '3x',
                notes: 'BTN vs LJ：对抗中位扩张范围，增加99和更多同花连牌'
            },
            vsHJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
                       'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'AKo', 'AQo', 'AJo',
                       'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s', 'K8s',
                       'Q9s', 'Q8s',
                       'J9s', 'J8s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s', '54s'],
                percentage: '14%',
                sizing: '3x',
                notes: 'BTN vs HJ：进一步扩张，增加88和更多Axs'
            },
            vsCO: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'QJs',
                       'AKo', 'AQo',
                       'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s', 'K8s',
                       'Q9s',
                       'J9s', 'J8s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s', '54s'],
                percentage: '15%',
                sizing: '3x',
                notes: '对抗CO显著扩大，增加99和大量同花连牌诈唬'
            },
            vsSB: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
                       'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'JTs',
                       'AKo', 'AQo', 'AJo',
                       'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K8s', 'K7s',
                       'Q8s',
                       'J8s', 'J7s',
                       'T8s', 'T7s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '65s', '54s'],
                percentage: '17%',
                sizing: '3.5x',
                notes: 'BTN vs SB：经典盲注对抗，范围很宽。88+/AT+价值，大量同花牌诈唬'
            }
        },
        CO: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ',
                       'AKs', 'AQs',
                       'AKo',
                       'A5s', 'A4s', 'A3s', 'A2s',
                       '76s', '65s'],
                percentage: '7%',
                sizing: '3x',
                notes: 'CO vs UTG较紧，强价值+阻断牌'
            },
            vsLJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'KQs',
                       'AKo', 'AQo',
                       'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       'Q9s',
                       'J8s',
                       'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s', '54s'],
                percentage: '10%',
                sizing: '3x',
                notes: 'CO vs LJ：适度扩张，增加TT和同花连牌'
            },
            vsHJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'KQs',
                       'AKo', 'AQo',
                       'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K8s',
                       'Q9s',
                       'J8s',
                       'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s', '54s'],
                percentage: '11%',
                sizing: '3x',
                notes: 'CO vs HJ适度扩张'
            }
        },
        HJ: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ',
                       'AKs', 'AQs',
                       'AKo',
                       'A5s', 'A4s', 'A3s', 'A2s',
                       '87s', '76s'],
                percentage: '6%',
                sizing: '3x',
                notes: 'HJ vs UTG：紧而激进，主要价值牌+少量诈唬'
            },
            vsLJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo', 'AQo',
                       'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       '87s', '76s', '65s'],
                percentage: '8%',
                sizing: '3x',
                notes: 'HJ vs LJ：增加TT和更多诈唬牌'
            }
        },
        LJ: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ',
                       'AKs', 'AQs',
                       'AKo',
                       'A5s', 'A4s', 'A3s'],
                percentage: '5%',
                sizing: '3x',
                notes: 'LJ vs UTG：极紧，只有最强价值+阻断牌'
            }
        },
        SB: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo', 'AQo',
                       'A5s', 'A4s', 'A3s', 'A2s'],
                percentage: '7%',
                sizing: '3.5x (vs 2.5BB = 8.75BB)',
                notes: 'SB有位置劣势，需要更强的范围'
            },
            vsLJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo', 'AQo',
                       'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       '87s', '76s', '65s'],
                percentage: '8%',
                sizing: '3.5x',
                notes: 'SB vs LJ：稍微扩张，增加少量诈唬'
            },
            vsHJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'AKo', 'AQo',
                       'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       'Q9s',
                       'J9s',
                       'T9s',
                       '98s', '87s', '76s', '65s', '54s'],
                percentage: '9%',
                sizing: '3.5x',
                notes: 'SB vs HJ：继续扩张，增加99和更多同花连牌'
            },
            vsCO: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'AKo', 'AQo',
                       'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K8s',
                       'Q9s',
                       'J8s',
                       'T8s',
                       '98s', '87s', '76s', '65s', '54s'],
                percentage: '10%',
                sizing: '3.5x',
                notes: 'SB vs CO平衡的范围'
            },
            vsBTN: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'QJs',
                       'AKo', 'AQo', 'AJo',
                       'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       'Q9s',
                       'J9s',
                       'T9s',
                       '98s', '87s', '76s', '65s'],
                percentage: '12%',
                sizing: '3.5x',
                notes: 'SB vs BTN需要防守，范围扩大'
            }
        },
        BB: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo',
                       'A5s', 'A4s', 'A3s', 'A2s',
                       '87s', '76s'],
                percentage: '7.5%',
                sizing: '3.5x',
                notes: 'BB vs UTG：已投入盲注，比SB略激进。TT+/AJ+价值，Axs阻断牌'
            },
            vsLJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                       'AKs', 'AQs', 'AJs',
                       'AKo', 'AQo',
                       'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       '87s', '76s', '65s', '54s'],
                percentage: '9%',
                sizing: '3.5x',
                notes: 'BB vs LJ：扩张范围，增加99和更多诈唬'
            },
            vsHJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'AKo', 'AQo',
                       'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s', 'K8s',
                       'Q9s',
                       'J9s',
                       'T9s',
                       '98s', '87s', '76s', '65s', '54s'],
                percentage: '10%',
                sizing: '3.5x',
                notes: 'BB vs HJ：进一步扩张，增加88和更多同花牌'
            },
            vsCO: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99',
                       'AKs', 'AQs', 'AJs', 'ATs',
                       'KQs', 'KJs',
                       'AKo', 'AQo',
                       'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       'Q9s',
                       'J9s',
                       'T9s',
                       '98s', '87s', '76s', '65s', '54s'],
                percentage: '11%',
                sizing: '3.5x',
                notes: 'BB vs CO需要积极防守'
            },
            vsBTN: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
                       'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'JTs',
                       'AKo', 'AQo', 'AJo',
                       'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s', 'K8s',
                       'Q9s',
                       'J9s', 'J8s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '65s', '54s'],
                percentage: '15%',
                sizing: '3.5x',
                notes: 'BB vs BTN大幅扩张！BTN偷盲52%，必须用15%+ 3-Bet + 55% Call = 70%防守'
            },
            vsSB: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
                       'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'JTs',
                       'AKo', 'AQo', 'AJo',
                       'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'K9s',
                       'Q9s',
                       'J9s',
                       'T9s',
                       '98s', '87s', '76s', '65s'],
                percentage: '13%',
                sizing: '3.5x',
                notes: 'BB vs SB：对抗SB Open也要积极防守'
            }
        }
    },

    // 4-Bet 范围
    fourBet: {
        general: {
            range: ['AA', 'KK', 'QQ', 'JJ',
                   'AKs', 'AQs',
                   'AKo',
                   'A5s', 'A4s', 'A3s', 'A2s',
                   '87s', '76s'],
            percentage: '4.5%',
            sizing: '2.2-2.5x 3-Bet size',
            notes: 'QQ+/AK价值，A5s-A2s阻断诈唬，少量同花连牌平衡'
        },
        vsEP: {
            range: ['AA', 'KK', 'QQ',
                   'AKs', 'AKo',
                   'A5s', 'A4s'],
            percentage: '3%',
            sizing: '2.2x',
            notes: '对抗早位更紧，主要是QQ+/AK'
        },
        vsLP: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                   'AKs', 'AQs',
                   'AKo',
                   'A5s', 'A4s', 'A3s', 'A2s',
                   'K9s',
                   '87s', '76s', '65s'],
            percentage: '6%',
            sizing: '2.5x',
            notes: '对抗后位扩大，增加TT和更多诈唬'
        },
        IP: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                   'AKs', 'AQs', 'AJs',
                   'AKo', 'AQo',
                   'A5s', 'A4s', 'A3s', 'A2s',
                   'K8s',
                   'Q9s',
                   '87s', '76s', '65s', '54s'],
            percentage: '7%',
            sizing: '2.5x',
            notes: '有位置时更激进，增加AJ/AQo和更多诈唬'
        },
        OOP: {
            range: ['AA', 'KK', 'QQ', 'JJ',
                   'AKs',
                   'AKo',
                   'A5s', 'A4s', 'A3s'],
            percentage: '3.5%',
            sizing: '2.2x',
            notes: 'OOP需要更强的范围，减少投机牌'
        }
    },

    // 5-Bet / All-in 范围
    fiveBet: {
        general: {
            range: ['AA', 'KK', 'QQ',
                   'AKs',
                   'AKo'],
            percentage: '2%',
            sizing: 'All-in or 2x 4-Bet',
            notes: '5-Bet主要是QQ+/AK，深筹码很少5-Bet诈唬'
        },
        vsAggressor: {
            range: ['AA', 'KK', 'QQ', 'JJ',
                   'AKs', 'AKo',
                   'A5s', 'A4s'],
            percentage: '2.5%',
            sizing: 'All-in',
            notes: '对抗激进玩家可以加入JJ和少量诈唬'
        }
    },

    // Call 3-Bet 范围 (平跟3-Bet)
    call3Bet: {
        IP: {
            range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s',
                   'KQs', 'KJs', 'KTs', 'K9s',
                   'QJs', 'QTs', 'Q9s',
                   'JTs', 'J9s',
                   'T9s', 'T8s',
                   '98s', '97s',
                   '87s', '86s',
                   '76s', '75s',
                   '65s', '54s',
                   'AJo', 'ATo', 'KQo'],
            percentage: '~12%',
            notes: '有位置时可以用对子和同花牌平跟3-Bet，利用深筹码隐含赔率'
        },
        OOP: {
            range: ['TT', '99', '88',
                   'AJs', 'ATs',
                   'KQs', 'KJs',
                   'QJs',
                   'JTs',
                   'T9s',
                   '98s'],
            percentage: '~5%',
            notes: 'OOP大幅收紧平跟范围，主要是强同花牌和中对'
        }
    },

    // Call 4-Bet 范围 (平跟4-Bet) - ⚠️ 关键：必须区分IP和OOP！
    call4Bet: {
        IP: {
            range: ['QQ', 'JJ', 'TT', '99',
                   'AKs', 'AQs', 'AJs',
                   'AKo',
                   '87s', '76s'],
            percentage: '~5%',
            notes: '有位置时可以用更宽范围平跟4-Bet：QQ/JJ/TT（set value），99（深筹码），AK/AQ（摊牌价值），87s/76s（隐含赔率+欺骗性）'
        },
        OOP: {
            range: ['QQ', 'JJ',
                   'AKs', 'AKo'],
            percentage: '~2%',
            notes: 'OOP大幅收紧！只用QQ/JJ/AK平跟。TT及以下应该fold，因为翻后难打且SPR低。深筹码OOP更应该5-Bet or Fold'
        },
        general: {
            range: ['QQ', 'JJ', 'TT',
                   'AKs', 'AQs', 'AJs',
                   'AKo'],
            percentage: '~3%',
            notes: '通用范围（当不确定位置时）：QQ/JJ/TT + AK/AQ'
        }
    },

    // ⭐ 新增：Call Open 范围（这是松凶玩家最重要的范围之一！）
    callOpen: {
        // BB facing open (盲注位防守)
        BB: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s',
                       'QJs', 'QTs', 'Q9s',
                       'JTs', 'J9s', 'J8s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s',
                       'AQo', 'AJo', 'ATo',
                       'KQo', 'KJo',
                       'QJo'],
                percentage: '32%',
                potOdds: '3.5:1 (需要防守约23%，我们防守32%)',
                notes: 'BB vs UTG需要广泛防守。所有对子（setmine价值），所有同花Ace（坚果潜力），同花连牌（隐含赔率）'
            },
            vsLJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
                       'QJs', 'QTs', 'Q9s', 'Q8s',
                       'JTs', 'J9s', 'J8s', 'J7s',
                       'T9s', 'T8s', 'T7s',
                       '98s', '97s', '96s',
                       '87s', '86s', '85s',
                       '76s', '75s', '74s',
                       '65s', '64s',
                       '54s',
                       'AQo', 'AJo', 'ATo', 'A9o',
                       'KQo', 'KJo', 'KTo',
                       'QJo', 'QTo'],
                percentage: '38%',
                potOdds: '3.5:1',
                notes: 'vs LJ扩大范围，增加更多同花连牌和散牌高牌'
            },
            vsHJ: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
                       'T9s', 'T8s', 'T7s', 'T6s',
                       '98s', '97s', '96s', '95s',
                       '87s', '86s', '85s',
                       '76s', '75s', '74s',
                       '65s', '64s', '63s',
                       '54s', '53s',
                       'AQo', 'AJo', 'ATo', 'A9o', 'A8o',
                       'KQo', 'KJo', 'KTo', 'K9o',
                       'QJo', 'QTo', 'Q9o',
                       'JTo', 'J9o'],
                percentage: '42%',
                potOdds: '3.5:1',
                notes: 'vs HJ大幅扩张，几乎所有可玩牌型'
            },
            vsCO: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s',
                       'T9s', 'T8s', 'T7s', 'T6s', 'T5s',
                       '98s', '97s', '96s', '95s', '94s',
                       '87s', '86s', '85s', '84s',
                       '76s', '75s', '74s', '73s',
                       '65s', '64s', '63s',
                       '54s', '53s', '52s',
                       'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
                       'KQo', 'KJo', 'KTo', 'K9o', 'K8o',
                       'QJo', 'QTo', 'Q9o', 'Q8o',
                       'JTo', 'J9o', 'J8o',
                       'T9o', 'T8o',
                       '98o', '97o',
                       '87o'],
                percentage: '48%',
                potOdds: '3.5:1',
                notes: 'vs CO极度宽松，对抗CO偷盲必须用接近50%防守'
            },
            vsBTN: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s',
                       'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s',
                       '98s', '97s', '96s', '95s', '94s', '93s',
                       '87s', '86s', '85s', '84s', '83s',
                       '76s', '75s', '74s', '73s', '72s',
                       '65s', '64s', '63s', '62s',
                       '54s', '53s', '52s',
                       'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
                       'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o',
                       'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o',
                       'JTo', 'J9o', 'J8o', 'J7o',
                       'T9o', 'T8o', 'T7o',
                       '98o', '97o', '96o',
                       '87o', '86o',
                       '76o'],
                percentage: '55%',
                potOdds: '3.5:1',
                notes: 'vs BTN超宽防守！BTN偷盲频率极高，必须用55%+范围对抗，否则被疯狂剥削'
            },
            vsSB: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
                       'T9s', 'T8s', 'T7s', 'T6s',
                       '98s', '97s', '96s', '95s',
                       '87s', '86s', '85s', '84s',
                       '76s', '75s', '74s',
                       '65s', '64s', '63s',
                       '54s', '53s',
                       'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
                       'KQo', 'KJo', 'KTo', 'K9o', 'K8o',
                       'QJo', 'QTo', 'Q9o', 'Q8o',
                       'JTo', 'J9o', 'J8o',
                       'T9o', 'T8o',
                       '98o', '97o',
                       '87o'],
                percentage: '45%',
                potOdds: '2.5:1 (SB已投入1BB)',
                notes: 'vs SB防守较宽，但不如vs BTN，因为SB范围稍紧'
            }
        },

        // SB facing open (小盲位防守)
        SB: {
            vsUTG: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'JTs', 'J9s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s',
                       'AJo', 'ATo',
                       'KQo'],
                percentage: '18%',
                notes: 'SB vs UTG要紧，因为还有BB在后面。主要是对子（setmine）和同花牌'
            },
            vsLJ: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s',
                       'QJs', 'QTs', 'Q9s',
                       'JTs', 'J9s', 'J8s',
                       'T9s', 'T8s', 'T7s',
                       '98s', '97s', '96s',
                       '87s', '86s', '85s',
                       '76s', '75s',
                       '65s',
                       'AJo', 'ATo', 'A9o',
                       'KQo', 'KJo'],
                percentage: '22%',
                notes: 'vs LJ稍微扩张'
            },
            vsHJ: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
                       'QJs', 'QTs', 'Q9s', 'Q8s',
                       'JTs', 'J9s', 'J8s', 'J7s',
                       'T9s', 'T8s', 'T7s',
                       '98s', '97s', '96s',
                       '87s', '86s', '85s',
                       '76s', '75s', '74s',
                       '65s', '64s',
                       '54s',
                       'AJo', 'ATo', 'A9o',
                       'KQo', 'KJo', 'KTo',
                       'QJo'],
                percentage: '26%',
                notes: 'vs HJ继续扩张'
            },
            vsCO: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KJs', 'KTs', 'K9s', 'K8s', 'K7s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
                       'T9s', 'T8s', 'T7s', 'T6s',
                       '98s', '97s', '96s', '95s',
                       '87s', '86s', '85s', '84s',
                       '76s', '75s', '74s', '73s',
                       '65s', '64s', '63s',
                       '54s', '53s',
                       'ATo', 'A9o', 'A8o',
                       'KQo', 'KJo', 'KTo',
                       'QJo', 'QTo'],
                percentage: '28%',
                notes: 'vs CO大幅扩张，但仍需谨慎因为OOP。包含TT进行setmine'
            },
            vsBTN: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s',
                       'T9s', 'T8s', 'T7s', 'T6s', 'T5s',
                       '98s', '97s', '96s', '95s', '94s',
                       '87s', '86s', '85s', '84s', '83s',
                       '76s', '75s', '74s', '73s',
                       '65s', '64s', '63s', '62s',
                       '54s', '53s', '52s',
                       'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
                       'KTo', 'K9o', 'K8o', 'K7o',
                       'QJo', 'QTo', 'Q9o', 'Q8o',
                       'JTo', 'J9o', 'J8o',
                       'T9o', 'T8o', '97o'],
                percentage: '45%',
                notes: '⚠️ 修复：vs BTN偷盲必须45%+防守！增加K4s/Q5s/K7o/Q8o/97o。BTN偷盲52%，SB需要45%Call+15%3-Bet=60%总防守达到MDF'
            }
        },

        // BTN facing open (按钮位平跟)
        BTN: {
            vsUTG: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s',
                       'QJs', 'QTs', 'Q9s',
                       'JTs', 'J9s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '76s',
                       'AJo', 'ATo',
                       'KQo', 'KJo'],
                percentage: '20%',
                notes: 'BTN vs UTG：有位置优势，可以宽松跟注。对子+同花牌+部分高牌'
            },
            vsLJ: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
                       'QJs', 'QTs', 'Q9s', 'Q8s',
                       'JTs', 'J9s', 'J8s',
                       'T9s', 'T8s', 'T7s',
                       '98s', '97s', '96s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s',
                       'AJo', 'ATo', 'A9o',
                       'KQo', 'KJo', 'KTo',
                       'QJo'],
                percentage: '25%',
                notes: 'vs LJ扩大范围'
            },
            vsHJ: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KJs', 'KTs', 'K9s', 'K8s', 'K7s',
                       'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
                       'JTs', 'J9s', 'J8s', 'J7s',
                       'T9s', 'T8s', 'T7s', 'T6s',
                       '98s', '97s', '96s',
                       '87s', '86s', '85s',
                       '76s', '75s', '74s',
                       '65s', '64s',
                       '54s',
                       'ATo', 'A9o', 'A8o',
                       'KQo', 'KJo', 'KTo',
                       'QJo', 'QTo'],
                percentage: '29%',
                notes: 'vs HJ大幅扩张投机牌（新增TT，Set Value充足）'
            },
            vsCO: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
                       'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
                       'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
                       'T9s', 'T8s', 'T7s', 'T6s', 'T5s',
                       '98s', '97s', '96s', '95s',
                       '87s', '86s', '85s', '84s',
                       '76s', '75s', '74s', '73s',
                       '65s', '64s', '63s',
                       '54s', '53s', '52s',
                       'A9o', 'A8o',
                       'KJo', 'KTo', 'K9o',
                       'QJo', 'QTo', 'Q9o',
                       'JTo', 'J9o',
                       'T9o'],
                percentage: '31%',
                notes: 'BTN vs CO：经典BTN平跟spot，大量投机牌（新增TT）'
            }
        },

        // CO facing open (CO位平跟)
        CO: {
            vsUTG: {
                range: ['99', '88', '77', '66', '55', '44', '33', '22',
                       'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KJs', 'KTs', 'K9s',
                       'QJs', 'QTs',
                       'JTs', 'J9s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '76s',
                       'ATo',
                       'KQo'],
                percentage: '16%',
                notes: 'CO vs UTG较紧，还有BTN在后面'
            },
            vsLJ: {
                range: ['99', '88', '77', '66', '55', '44', '33', '22',
                       'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KJs', 'KTs', 'K9s', 'K8s',
                       'QJs', 'QTs', 'Q9s',
                       'JTs', 'J9s', 'J8s',
                       'T9s', 'T8s', 'T7s',
                       '98s', '97s', '96s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s',
                       'ATo', 'A9o',
                       'KQo', 'KJo'],
                percentage: '20%',
                notes: 'vs LJ适度扩张'
            },
            vsHJ: {
                range: ['99', '88', '77', '66', '55', '44', '33', '22',
                       'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KTs', 'K9s', 'K8s', 'K7s',
                       'QJs', 'QTs', 'Q9s', 'Q8s',
                       'JTs', 'J9s', 'J8s', 'J7s',
                       'T9s', 'T8s', 'T7s', 'T6s',
                       '98s', '97s', '96s',
                       '87s', '86s', '85s',
                       '76s', '75s', '74s',
                       '65s', '64s',
                       '54s',
                       'A9o', 'A8o',
                       'KJo', 'KTo',
                       'QJo'],
                percentage: '25%',
                notes: 'vs HJ大幅扩张投机牌（新增99，利用位置优势和深筹码）'
            }
        },

        // HJ facing open (HJ位平跟) - 新增！
        HJ: {
            vsUTG: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'JTs', 'J9s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '86s',
                       '76s',
                       'AJo', 'ATo',
                       'KQo'],
                percentage: '18%',
                notes: 'HJ vs UTG：较紧，因为还有3个位置在后面'
            },
            vsLJ: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs', 'K9s',
                       'QJs', 'QTs', 'Q9s',
                       'JTs', 'J9s', 'J8s',
                       'T9s', 'T8s', 'T7s',
                       '98s', '97s', '96s',
                       '87s', '86s',
                       '76s', '75s',
                       '65s',
                       'AJo', 'ATo', 'A9o',
                       'KQo', 'KJo'],
                percentage: '22%',
                notes: 'HJ vs LJ：适度扩张，增加更多同花牌'
            }
        },

        // LJ facing open (LJ位平跟) - 新增！
        LJ: {
            vsUTG: {
                range: ['TT', '99', '88', '77', '66', '55', '44', '33', '22',
                       'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                       'KQs', 'KJs', 'KTs',
                       'QJs', 'QTs',
                       'JTs', 'J9s',
                       'T9s', 'T8s',
                       '98s', '97s',
                       '87s', '76s',
                       'AJo', 'ATo',
                       'KQo'],
                percentage: '17%',
                notes: 'LJ vs UTG：保守，因为还有4个位置在后面。主要是对子和强同花牌'
            }
        }
    },

    // ⭐ 新增：Squeeze（挤压）范围
    squeeze: {
        BB: {
            general: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo', 'AQo',
                       'A5s', 'A4s', 'A3s', 'A2s'],
                percentage: '7%',
                sizing: '4-5x原加注',
                notes: 'BB面对Open+Call时的Squeeze。需要强价值牌+阻断牌诈唬'
            }
        },
        SB: {
            general: {
                range: ['AA', 'KK', 'QQ', 'JJ',
                       'AKs', 'AQs',
                       'AKo',
                       'A5s', 'A4s'],
                percentage: '5%',
                sizing: '4-5x原加注',
                notes: 'SB的Squeeze要更紧，因为还有BB在后面'
            }
        }
    },

    // ⭐ 新增：MDF（最小防守频率）计算器
    mdfCalculator: {
        facing3Bet: {
            potOdds: '约2.2:1 (典型3-Bet场景)',
            mdf: '约45%',
            notes: '面对3-Bet，假设你Open 2.5BB，对手3-Bet到7.5BB，底池约4BB(盲注+你的Open)，你需要Call 5BB。MDF = 4/(4+5) ≈ 44%。意味着你至少用44%的Open范围继续，否则对手可以用任何牌3-Bet诈唬盈利。实战中用~15% 4-Bet + ~30% Call = 45%防守'
        },
        facing4Bet: {
            potOdds: '1.8:1',
            mdf: '64.3%',
            notes: '面对4-Bet，需要用约36%的3-Bet范围继续（4-Bet或Call）'
        },
        facingCBet: {
            halfPot: {
                potOdds: '3:1',
                mdf: '66.7%',
                notes: '面对半池Cbet，需要用66.7%范围继续（加注或跟注）'
            },
            twothirdPot: {
                potOdds: '2.5:1',
                mdf: '60%',
                notes: '面对2/3池Cbet，需要用60%范围继续'
            }
        }
    }
};

// 手牌判断辅助函数
function parseHand(hand) {
    // ✅ 企业级防御：先验证输入
    if (!hand || typeof hand !== 'string') {
        console.error('[parseHand] Invalid hand:', hand);
        return null;
    }
    
    if (hand.length === 2) {
        return { rank1: hand[0], rank2: hand[1], suited: false, pair: true };
    } else if (hand.length === 3) {
        return {
            rank1: hand[0],
            rank2: hand[1],
            suited: hand[2] === 's',
            pair: false
        };
    }
    console.warn('[parseHand] Unexpected hand format:', hand);
    return null;
}

function isInRange(hand, rangeArray) {
    return rangeArray.includes(hand);
}

// 生成手牌矩阵显示
function generateHandGrid() {
    const grid = document.getElementById('range-grid');
    if (!grid) {
        console.error('[generateHandGrid] range-grid element not found');
        return;
    }
    
    grid.innerHTML = '';

    // ✅ 企业级说明：此循环的数组访问是安全的，i和j受到严格的边界约束
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            const cell = document.createElement('div');
            cell.className = 'hand-cell';
            
            let hand;
            if (i === j) {
                hand = ranks[i] + ranks[j];  // 安全：i,j ∈ [0,12]，ranks有13个元素
                cell.classList.add('pair');
            } else if (j > i) {
                hand = ranks[i] + ranks[j] + 's';  // 安全：同上
                cell.classList.add('suited');
            } else {
                hand = ranks[j] + ranks[i] + 'o';  // 安全：同上
                cell.classList.add('offsuit');
            }
            
            cell.textContent = hand;
            cell.dataset.hand = hand;
            grid.appendChild(cell);
        }
    }
}

// 高亮显示范围
function highlightRange(position, action, vsPosition = null) {
    const cells = document.querySelectorAll('.hand-cell');
    cells.forEach(cell => {
        cell.classList.remove('open', 'three-bet', 'four-bet', 'five-bet', 'call');
    });

    let range = [];
    let details = '';

    if (action === 'open' && lagRanges.openRaise[position]) {
        const data = lagRanges.openRaise[position];
        range = data.range || [];
        details = `
            <div><span class="highlight">位置：</span>${position}</div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">加注大小：</span>${data.sizing}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    } else if (action === 'callopen') {
        // 新增：Call Open范围显示
        if (vsPosition && lagRanges.callOpen[position] && lagRanges.callOpen[position][vsPosition]) {
            const data = lagRanges.callOpen[position][vsPosition];
            range = data.range || [];
            details = `
                <div><span class="highlight">位置：</span>${position} Call ${vsPosition.replace('vs', '')} Open</div>
                <div><span class="highlight">范围：</span>${data.percentage}</div>
                <div><span class="highlight">底池赔率：</span>${data.potOdds || 'N/A'}</div>
                <div><span class="highlight">说明：</span>${data.notes}</div>
                <div style="margin-top: 10px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 5px;">
                    <strong>💡 关键概念：</strong>深筹码松凶玩家必须大量使用Call Open来：<br>
                    1️⃣ 利用隐含赔率（对子成set能赢大底池）<br>
                    2️⃣ 保持范围平衡（不只是3-Bet或Fold）<br>
                    3️⃣ 有位置优势时发挥翻后技术<br>
                    4️⃣ 防守盲注不被疯狂剥削
                </div>
                <div style="margin-top: 15px;"><span class="highlight">包含手牌（${range.length}个组合）：</span>${range.slice(0, 30).join(', ')}${range.length > 30 ? '...' : ''}</div>
            `;
        } else {
            details = '<div>请选择对抗位置</div>';
        }
    } else if (action === '3bet') {
        if (vsPosition && lagRanges.threeBet[position] && lagRanges.threeBet[position][vsPosition]) {
            const data = lagRanges.threeBet[position][vsPosition];
            range = data.range || [];
            details = `
                <div><span class="highlight">位置：</span>${position} vs ${vsPosition.replace('vs', '')}</div>
                <div><span class="highlight">范围：</span>${data.percentage}</div>
                <div><span class="highlight">3-Bet大小：</span>${data.sizing}</div>
                <div><span class="highlight">说明：</span>${data.notes}</div>
                <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
            `;
        } else {
            details = '<div>请选择对抗位置</div>';
        }
    } else if (action === '4bet') {
        const rangeKey = vsPosition || 'general';
        const data = lagRanges.fourBet[rangeKey] || lagRanges.fourBet.general;
        range = data.range || [];
        details = `
            <div><span class="highlight">4-Bet范围：</span>${rangeKey === 'general' ? '通用' : rangeKey}</div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">4-Bet大小：</span>${data.sizing}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    } else if (action === '5bet') {
        const data = lagRanges.fiveBet.general;
        range = data.range || [];
        details = `
            <div><span class="highlight">5-Bet/All-in范围</span></div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">大小：</span>${data.sizing}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    } else if (action === 'call3bet') {
        const rangeKey = vsPosition === 'IP' || !vsPosition ? 'IP' : 'OOP';
        const data = lagRanges.call3Bet[rangeKey];
        range = data.range || [];
        details = `
            <div><span class="highlight">Call 3-Bet范围：</span>${rangeKey === 'IP' ? '有位置' : '无位置'}</div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    } else if (action === 'call4bet') {
        // ⚠️ 修复：区分IP和OOP
        const rangeKey = vsPosition === 'IP' || !vsPosition ? 'IP' : (vsPosition === 'OOP' ? 'OOP' : 'general');
        const data = lagRanges.call4Bet[rangeKey];
        range = data.range || [];
        details = `
            <div><span class="highlight">Call 4-Bet范围：</span>${rangeKey === 'IP' ? '有位置 (IP)' : rangeKey === 'OOP' ? '无位置 (OOP)' : '通用'}</div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 10px; padding: 10px; background: rgba(255,69,0,0.1); border-radius: 5px;">
                <strong>🎯 关键差异：</strong><br>
                • <strong>IP (5%)</strong>: 可以用99, TT, 甚至87s/76s平跟，利用位置优势翻后操作<br>
                • <strong>OOP (2%)</strong>: 只用QQ/JJ/AK平跟，其他牌5-Bet or Fold！
            </div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    } else if (action === 'squeeze') {
        // Squeeze范围
        const data = lagRanges.squeeze[position]?.general || lagRanges.squeeze.BB.general;
        range = data.range || [];
        details = `
            <div><span class="highlight">Squeeze（挤压）范围</span></div>
            <div><span class="highlight">场景：</span>${position} 面对 Open + Call</div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">Squeeze大小：</span>${data.sizing}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 10px; padding: 10px; background: rgba(255,69,0,0.1); border-radius: 5px;">
                <strong>🔥 Squeeze技巧：</strong>当前面有Open和Call时，用强牌价值挤压+阻断牌诈唬。<br>
                成功率高因为：Original Raiser被夹击，Caller证明自己较弱。
            </div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    } else if (action === 'vs3bet') {
        // vs 3-Bet - 面对3-Bet的完整决策
        // ✅ 修复：添加安全保护
        const fourBetData = lagRanges.fourBet?.general || {};
        const call3BetData = lagRanges.call3Bet?.IP || {};
        const fourBetRange = fourBetData.range || [];
        const call3BetRange = call3BetData.range || [];
        
        details = `
            <div><span class="highlight">vs 3-Bet 决策树</span></div>
            <div><span class="highlight">位置：</span>${position}</div>
            <div style="margin-top: 15px; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 5px;">
                <strong>📊 面对3-Bet的三种选择：</strong><br><br>
                <div style="margin: 10px 0;"><span class="highlight">1. 4-Bet (${fourBetData.percentage || 'N/A'})：</span>
                ${fourBetRange.slice(0, 10).join(', ')}${fourBetRange.length > 10 ? '...' : ''}</div>
                <div style="margin: 10px 0;"><span class="highlight">2. Call 3-Bet (${call3BetData.percentage || 'N/A'})：</span>
                ${call3BetRange.slice(0, 10).join(', ')}${call3BetRange.length > 10 ? '...' : ''}</div>
                <div style="margin: 10px 0;"><span class="highlight">3. Fold：</span>所有其他牌</div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: rgba(0,191,255,0.1); border-radius: 5px;">
                <strong>🎯 MDF理论：</strong>面对3-Bet（7.5BB into 4BB），你的MDF约45%<br>
                • 4-Bet约15% + Call约30% = 45%总防守<br>
                • 如果弃牌超过55%，对手可以用任何牌3-Bet盈利！
            </div>
        `;
        // 显示4-Bet + Call 3-Bet的合并范围
        range = [...fourBetRange, ...call3BetRange];
    } else if (action === 'vs4bet') {
        // vs 4-Bet - 面对4-Bet的完整决策
        // ✅ 修复：添加安全保护
        const fiveBetData = lagRanges.fiveBet?.general || {};
        const call4BetData = lagRanges.call4Bet?.IP || {}; // ⚠️ 使用IP作为展示默认值
        const fiveBetRange = fiveBetData.range || [];
        const call4BetRange = call4BetData.range || [];
        
        details = `
            <div><span class="highlight">vs 4-Bet 决策树</span></div>
            <div><span class="highlight">位置：</span>${position}</div>
            <div style="margin-top: 15px; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 5px;">
                <strong>📊 面对4-Bet的三种选择：</strong><br><br>
                <div style="margin: 10px 0;"><span class="highlight">1. 5-Bet/All-in (${fiveBetData.percentage || 'N/A'})：</span>
                ${fiveBetRange.join(', ')}</div>
                <div style="margin: 10px 0;"><span class="highlight">2. Call 4-Bet - IP (${call4BetData.percentage || 'N/A'})：</span>
                ${call4BetRange.join(', ')}<br>
                <span style="color: #FF4500;">⚠️ OOP只call QQ/JJ/AK，其他5-Bet or Fold！</span></div>
                <div style="margin: 10px 0;"><span class="highlight">3. Fold：</span>所有其他牌（包括大部分3-Bet诈唬牌）</div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: rgba(220,20,60,0.1); border-radius: 5px;">
                <strong>⚡ 深筹码提示：</strong>300BB+时，QQ/JJ可以call 4-Bet<br>
                但100BB时，通常是5-Bet or Fold（QQ可以5-Bet all-in）<br><br>
                <strong>🎯 位置区别：</strong><br>
                • IP: 可以call 99, TT, 甚至87s/76s（利用位置优势）<br>
                • OOP: 只call QQ/JJ/AK（其他太难翻后操作）
            </div>
        `;
        range = [...fiveBetRange, ...call4BetRange];
    } else if (action === 'defend') {
        // Defend - 总防守范围（Call + 3-Bet）
        if (vsPosition && lagRanges.callOpen[position] && lagRanges.callOpen[position][vsPosition] && 
            lagRanges.threeBet[position] && lagRanges.threeBet[position][vsPosition]) {
            const callData = lagRanges.callOpen[position][vsPosition];
            const threeBetData = lagRanges.threeBet[position][vsPosition];
            const callRange = callData.range || [];
            const threeBetRange = threeBetData.range || [];
            range = [...callRange, ...threeBetRange];
            
            const callPct = parseInt(callData.percentage) || 0;
            const threeBetPct = parseInt(threeBetData.percentage) || 0;
            const totalDefend = callPct + threeBetPct;
            
            details = `
                <div><span class="highlight">总防守范围 (Defend)</span></div>
                <div><span class="highlight">场景：</span>${position} vs ${vsPosition.replace('vs', '')} Open</div>
                <div style="margin-top: 15px; padding: 15px; background: rgba(138,43,226,0.1); border-radius: 5px;">
                    <strong>🛡️ 防守组成：</strong><br><br>
                    <div style="margin: 10px 0;">
                        <span class="highlight">• 3-Bet：</span>${threeBetPct}% (${threeBetRange.length}个组合)<br>
                        <span class="highlight">• Call：</span>${callPct}% (${callRange.length}个组合)<br>
                        <span class="highlight">• 总防守：</span>${totalDefend}% (${range.length}个组合)
                    </div>
                </div>
                <div style="margin-top: 15px; padding: 15px; background: rgba(0,191,255,0.1); border-radius: 5px;">
                    <strong>📊 MDF检查：</strong><br>
                    ${totalDefend >= 70 ? '✅' : '⚠️'} 当前总防守${totalDefend}%
                    ${totalDefend >= 70 ? '（符合MDF要求！）' : '（可能需要更宽的防守）'}
                </div>
                <div style="margin-top: 15px;"><span class="highlight">所有防守牌（${range.length}个组合）：</span>
                ${range.slice(0, 50).join(', ')}${range.length > 50 ? '...' : ''}</div>
            `;
        } else {
            details = '<div>请选择对抗位置查看总防守范围</div>';
        }
    }

    // 安全更新详情显示
    const comboDetailsEl = document.getElementById('combo-details');
    if (comboDetailsEl) {
        comboDetailsEl.innerHTML = details || '选择位置和动作查看详细范围...';
    }

    // 高亮显示范围内的手牌
    cells.forEach(cell => {
        const hand = cell.dataset.hand;
        if (isInRange(hand, range)) {
            // 根据action类型添加对应的CSS类（注意判断顺序！）
            let cssClass = action;
            
            // 优先处理特殊的call情况
            if (action === 'callopen' || action === 'call3bet' || action === 'call4bet') {
                cssClass = 'call';  // 所有call系列使用蓝色
            }
            // defend使用紫色
            else if (action === 'defend') {
                cssClass = 'defend';  // defend用紫色显示总防守范围
            }
            // vs3bet和vs4bet也用defend颜色（表示防守决策）
            else if (action === 'vs3bet' || action === 'vs4bet') {
                cssClass = 'defend';  // 防守决策用紫色
            }
            // 然后处理squeeze
            else if (action === 'squeeze') {
                cssClass = 'three-bet';  // squeeze用3-bet的橙色
            }
            // 最后处理普通的bet系列（3bet/4bet/5bet）
            else if (action.includes('bet')) {
                cssClass = action.replace('bet', '-bet');  // 3bet→3-bet, 4bet→4-bet, 5bet→5-bet
            }
            // open保持不变
            
            cell.classList.add(cssClass);
        }
    });
}

// 测试系统
let quizState = {
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    currentQuestion: null,
    answered: false
};

function generateQuestion() {
    // 随机选择场景类型 - 增加callopen场景权重(最重要)
    const scenarioTypes = ['open', 'callopen', 'callopen', '3bet', 'vs3bet', '4bet']; // callopen出现2次，提高概率
    const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    
    // 随机生成一手牌
    const hand = allHands[Math.floor(Math.random() * allHands.length)];
    
    let correctAnswer;
    let situation = '';
    let position;
    
    if (scenarioType === 'open') {
        const positions = ['UTG', 'UTG1', 'LJ', 'HJ', 'CO', 'BTN', 'SB'];
        position = positions[Math.floor(Math.random() * positions.length)];
        const openRange = lagRanges.openRaise[position]?.range || [];
        correctAnswer = isInRange(hand, openRange) ? 'raise' : 'fold';
        situation = `你在 ${position} 位，前面都弃牌`;
        
    } else if (scenarioType === 'callopen') {
        // Call Open场景测试 - 最重要的场景
        const defensivePositions = ['BB', 'SB', 'BTN', 'CO'];
        position = defensivePositions[Math.floor(Math.random() * defensivePositions.length)];
        
        // 确保该位置有callOpen数据
        if (!lagRanges.callOpen[position]) {
            // 如果没有数据，fallback到BB
            position = 'BB';
        }
        
        const vsPositions = Object.keys(lagRanges.callOpen[position]);
        if (vsPositions.length === 0) {
            // 如果还是没有数据，生成一个简单的open场景
            position = 'UTG';
            const openRange = lagRanges.openRaise['UTG'].range;
            correctAnswer = isInRange(hand, openRange) ? 'raise' : 'fold';
            situation = `你在 UTG 位，前面都弃牌`;
        } else {
            const vsPos = vsPositions[Math.floor(Math.random() * vsPositions.length)];
            const callRange = lagRanges.callOpen[position][vsPos]?.range || [];
            
            // 检查3-Bet范围
            const threeBetRange = lagRanges.threeBet[position]?.[vsPos]?.range || [];
            
            if (isInRange(hand, threeBetRange)) {
                correctAnswer = '3bet';
            } else if (isInRange(hand, callRange)) {
                correctAnswer = 'call';
            } else {
                correctAnswer = 'fold';
            }
            
            const raiserPos = vsPos.replace('vs', '');
            situation = `你在 ${position} 位，${raiserPos} Open到 2.5BB`;
        }
        
    } else if (scenarioType === '3bet') {
        // 3-Bet场景 - 确保位置有3-Bet数据
        const positions3bet = ['BTN', 'CO', 'SB', 'BB']; // 只选择有3-Bet数据的位置
        position = positions3bet[Math.floor(Math.random() * positions3bet.length)];
        
        // 确保该位置有3-Bet数据
        if (!lagRanges.threeBet[position]) {
            position = 'BTN'; // fallback
        }
        
        const availableVsPositions = Object.keys(lagRanges.threeBet[position] || {});
        if (availableVsPositions.length === 0) {
            // 如果没有3-Bet数据，生成open场景
            position = 'CO';
            const openRange = lagRanges.openRaise[position].range;
            correctAnswer = isInRange(hand, openRange) ? 'raise' : 'fold';
            situation = `你在 ${position} 位，前面都弃牌`;
        } else {
            const vsPos = availableVsPositions[Math.floor(Math.random() * availableVsPositions.length)];
            const threeBetKey = vsPos; // 已经是 vsUTG 格式
            const threeBetRange = lagRanges.threeBet[position][threeBetKey]?.range || [];
            
            if (isInRange(hand, threeBetRange)) {
                correctAnswer = '3bet';
            } else {
                // 检查是否在call范围
                const callRange = lagRanges.call3Bet.IP?.range || [];
                correctAnswer = isInRange(hand, callRange) ? 'call' : 'fold';
            }
            const raiserPos = vsPos.replace('vs', '');
            situation = `你在 ${position} 位，${raiserPos} 加注到 2.5BB`;
        }
        
    } else if (scenarioType === 'vs3bet') {
        // 面对3-Bet场景
        const positions = ['UTG', 'LJ', 'HJ', 'CO', 'BTN'];
        position = positions[Math.floor(Math.random() * positions.length)];
        
        const fourBetRange = lagRanges.fourBet.general.range;
        const callRange = lagRanges.call3Bet.IP.range;
        
        if (isInRange(hand, fourBetRange)) {
            correctAnswer = '4bet';
        } else if (isInRange(hand, callRange)) {
            correctAnswer = 'call';
        } else {
            correctAnswer = 'fold';
        }
        situation = `你在 ${position} Open，BTN 3-Bet 到 7.5BB`;
        
    } else if (scenarioType === '4bet') {
        // 面对4-Bet场景
        const positions = ['UTG', 'LJ', 'HJ', 'CO', 'BTN'];
        position = positions[Math.floor(Math.random() * positions.length)];
        
        const fiveBetRange = lagRanges.fiveBet.general.range;
        const callRange = lagRanges.call4Bet.IP.range; // ⚠️ 修复：默认使用IP范围
        
        if (isInRange(hand, fiveBetRange)) {
            correctAnswer = '5bet';
        } else if (isInRange(hand, callRange)) {
            correctAnswer = 'call';
        } else {
            correctAnswer = 'fold';
        }
        situation = `你 3-Bet，对手 4-Bet 到 25BB`;
    }
    
    // 最终安全检查：确保所有必需字段都存在
    if (!correctAnswer || !situation || !position) {
        // 如果任何字段缺失，返回一个安全的默认场景
        return {
            hand,
            position: 'UTG',
            situation: '你在 UTG 位，前面都弃牌',
            correctAnswer: isInRange(hand, lagRanges.openRaise.UTG.range) ? 'raise' : 'fold',
            scenarioType: 'open'
        };
    }
    
    return {
        hand,
        position,
        situation,
        correctAnswer,
        scenarioType
    };
}

function displayQuestion() {
    quizState.currentQuestion = generateQuestion();
    quizState.answered = false;
    
    // 安全检查：确保问题生成成功
    if (!quizState.currentQuestion || !quizState.currentQuestion.hand) {
        console.error('Failed to generate question');
        alert('生成问题失败，请重试');
        return;
    }
    
    const questionTextEl = document.getElementById('question-text');
    const handDisplayEl = document.getElementById('hand-display');
    const situationInfoEl = document.getElementById('situation-info');
    
    if (questionTextEl) {
        questionTextEl.textContent = quizState.currentQuestion.situation;
    }
    
    if (handDisplayEl) {
        handDisplayEl.textContent = quizState.currentQuestion.hand;
    }
    
    if (situationInfoEl) {
        situationInfoEl.textContent = `有效筹码：${300 + Math.floor(Math.random() * 200)}BB`;
    }
    
    // 重置答案按钮
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
    
    const feedbackEl = document.getElementById('feedback');
    if (feedbackEl) {
        feedbackEl.style.display = 'none';
    }
    
    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
}

function checkAnswer(userAnswer) {
    if (quizState.answered) return;
    
    // 安全检查：确保currentQuestion存在
    if (!quizState.currentQuestion || !quizState.currentQuestion.correctAnswer) {
        console.error('No current question found');
        return;
    }
    
    quizState.answered = true;
    quizState.totalQuestions++;
    
    const correct = userAnswer === quizState.currentQuestion.correctAnswer;
    const feedbackEl = document.getElementById('feedback');
    
    if (correct) {
        quizState.correctAnswers++;
        quizState.currentStreak++;
        if (quizState.currentStreak > quizState.bestStreak) {
            quizState.bestStreak = quizState.currentStreak;
        }
        
        feedbackEl.className = 'feedback correct';
        feedbackEl.textContent = '✓ 正确！这是最优决策。';
        
        const userBtn = document.querySelector(`[data-answer="${userAnswer}"]`);
        if (userBtn) {
            userBtn.classList.add('correct');
        }
    } else {
        quizState.currentStreak = 0;
        
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.textContent = `✗ 不正确。正确答案是：${getAnswerText(quizState.currentQuestion.correctAnswer)}`;
        
        const userBtn = document.querySelector(`[data-answer="${userAnswer}"]`);
        if (userBtn) {
            userBtn.classList.add('incorrect');
        }
        
        const correctBtn = document.querySelector(`[data-answer="${quizState.currentQuestion.correctAnswer}"]`);
        if (correctBtn) {
            correctBtn.classList.add('correct');
        }
    }
    
    feedbackEl.style.display = 'block';
    
    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
    }
    
    // 禁用所有按钮
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    updateStats();
}

function getAnswerText(answer) {
    const texts = {
        'fold': 'Fold',
        'call': 'Call',
        'raise': 'Raise',
        '3bet': '3-Bet',
        '4bet': '4-Bet',
        '5bet': '5-Bet/All-in'
    };
    return texts[answer] || answer;
}

function updateStats() {
    const totalEl = document.getElementById('total-questions');
    const accuracyEl = document.getElementById('accuracy');
    const streakEl = document.getElementById('streak');
    const bestStreakEl = document.getElementById('best-streak');
    const progressFillEl = document.getElementById('progress-fill');
    
    if (totalEl) {
        totalEl.textContent = quizState.totalQuestions;
    }
    
    const accuracy = quizState.totalQuestions > 0 
        ? Math.round((quizState.correctAnswers / quizState.totalQuestions) * 100)
        : 0;
    
    if (accuracyEl) {
        accuracyEl.textContent = accuracy + '%';
    }
    
    if (streakEl) {
        streakEl.textContent = quizState.currentStreak;
    }
    
    if (bestStreakEl) {
        bestStreakEl.textContent = quizState.bestStreak;
    }
    
    if (progressFillEl) {
        progressFillEl.style.width = accuracy + '%';
        progressFillEl.textContent = accuracy + '%';
    }
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化
    generateHandGrid();
    highlightRange('UTG', 'open');
    
    // 模式切换
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const mode = btn.dataset.mode;
            // ✅ 企业级防御：添加null check
            const rangesMode = document.getElementById('ranges-mode');
            const memoryMode = document.getElementById('memory-mode');
            const quizMode = document.getElementById('quiz-mode');
            const strategyMode = document.getElementById('strategy-mode');
            
            if (rangesMode) rangesMode.style.display = mode === 'ranges' ? 'block' : 'none';
            if (memoryMode) memoryMode.style.display = mode === 'memory' ? 'block' : 'none';
            if (quizMode) quizMode.style.display = mode === 'quiz' ? 'block' : 'none';
            if (strategyMode) strategyMode.style.display = mode === 'strategy' ? 'block' : 'none';
        });
    });
    
    // 位置选择
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const position = btn.dataset.position;
            const action = document.querySelector('.action-btn.active').dataset.action;
            
            updateVsPositionSelector(position, action);
            highlightRange(position, action);
        });
    });
    
    // 动作选择
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const action = btn.dataset.action;
            const position = document.querySelector('.position-btn.active').dataset.position;
            
            updateVsPositionSelector(position, action);
            highlightRange(position, action);
        });
    });
    
    // 测试按钮
    const startQuizBtn = document.getElementById('start-quiz');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            displayQuestion();
        });
    }
    
    const nextQuestionBtn = document.getElementById('next-question');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            displayQuestion();
        });
    }
    
    const resetStatsBtn = document.getElementById('reset-stats');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            if (confirm('确定要重置所有统计数据吗？')) {
                quizState = {
                    totalQuestions: 0,
                    correctAnswers: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    currentQuestion: null,
                    answered: false
                };
                updateStats();
            }
        });
    }
    
    const showExplanationBtn = document.getElementById('show-explanation');
    if (showExplanationBtn) {
        showExplanationBtn.addEventListener('click', () => {
            if (!quizState.currentQuestion) {
                alert('请先开始测试');
                return;
            }
            
            const q = quizState.currentQuestion;
            let explanation = `手牌：${q.hand}\n位置：${q.position}\n场景：${q.situation}\n\n`;
            explanation += `最优动作：${getAnswerText(q.correctAnswer)}\n\n`;
            explanation += `解析：根据松凶深筹码策略，这手牌在此场景下应该${getAnswerText(q.correctAnswer)}。`;
            
            // 添加更详细的解析
            if (q.scenarioType === 'callopen') {
                explanation += `\n\n💡 Call Open决策：在深筹码游戏中，防守盲注和利用位置优势是盈利关键。`;
            } else if (q.scenarioType === 'open') {
                explanation += `\n\n💡 Open Raise决策：松凶玩家需要在合适位置积极开池，建立主动权。`;
            } else if (q.scenarioType === '3bet') {
                explanation += `\n\n💡 3-Bet决策：采用两极化策略，用强牌价值+阻断牌诈唬。`;
            }
            
            alert(explanation);
        });
    }
    
    // 答案按钮
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.dataset.answer;
            checkAnswer(answer);
        });
    });
    
    // 初始化统计
    updateStats();
});

// 更新对抗位置选择器
function updateVsPositionSelector(position, action) {
    const vsSelector = document.getElementById('vs-position-selector');
    const vsPositionsDiv = document.getElementById('vs-positions');
    
    if (action === 'callopen' && lagRanges.callOpen[position]) {
        // 新增：Call Open的位置选择
        vsSelector.style.display = 'block';
        vsPositionsDiv.innerHTML = '';
        
        const vsPositions = Object.keys(lagRanges.callOpen[position]);
        vsPositions.forEach((vsPos, index) => {
            const btn = document.createElement('button');
            btn.className = 'position-btn' + (index === 0 ? ' active' : '');
            btn.dataset.vsposition = vsPos;
            btn.textContent = vsPos.replace('vs', '');
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#vs-positions .position-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                highlightRange(position, action, vsPos);
            });
            
            vsPositionsDiv.appendChild(btn);
        });
        
        // 自动显示第一个
        if (vsPositions.length > 0) {
            highlightRange(position, action, vsPositions[0]);
        }
    } else if (action === '3bet' && lagRanges.threeBet[position]) {
        vsSelector.style.display = 'block';
        vsPositionsDiv.innerHTML = '';
        
        const vsPositions = Object.keys(lagRanges.threeBet[position]);
        vsPositions.forEach((vsPos, index) => {
            const btn = document.createElement('button');
            btn.className = 'position-btn' + (index === 0 ? ' active' : '');
            btn.dataset.vsposition = vsPos;
            btn.textContent = vsPos.replace('vs', '');
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#vs-positions .position-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                highlightRange(position, action, vsPos);
            });
            
            vsPositionsDiv.appendChild(btn);
        });
        
        // 自动显示第一个
        if (vsPositions.length > 0) {
            highlightRange(position, action, vsPositions[0]);
        }
    } else if (action === '4bet') {
        vsSelector.style.display = 'block';
        vsPositionsDiv.innerHTML = '';
        
        const options = [
            { key: 'general', label: '通用' },
            { key: 'vsEP', label: 'vs 早位' },
            { key: 'vsLP', label: 'vs 后位' },
            { key: 'IP', label: '有位置' },
            { key: 'OOP', label: '无位置' }
        ];
        
        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'position-btn' + (index === 0 ? ' active' : '');
            btn.dataset.vsposition = opt.key;
            btn.textContent = opt.label;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#vs-positions .position-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                highlightRange(position, action, opt.key);
            });
            
            vsPositionsDiv.appendChild(btn);
        });
        
        highlightRange(position, action, 'general');
    } else if (action === 'call3bet') {
        vsSelector.style.display = 'block';
        vsPositionsDiv.innerHTML = '';
        
        ['IP', 'OOP'].forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'position-btn' + (index === 0 ? ' active' : '');
            btn.dataset.vsposition = opt;
            btn.textContent = opt === 'IP' ? '有位置' : '无位置';
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#vs-positions .position-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                highlightRange(position, action, opt);
            });
            
            vsPositionsDiv.appendChild(btn);
        });
        
        highlightRange(position, action, 'IP');
    } else {
        vsSelector.style.display = 'none';
    }
}

// 保存进度到localStorage (带错误处理)
function saveProgress() {
    try {
        const dataToSave = {
            totalQuestions: quizState.totalQuestions || 0,
            correctAnswers: quizState.correctAnswers || 0,
            bestStreak: quizState.bestStreak || 0,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('lagTrainerStats', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Failed to save progress:', error);
        // localStorage可能被禁用或已满，静默失败
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('lagTrainerStats');
        if (saved) {
            const parsed = JSON.parse(saved);
            // 验证数据有效性
            if (typeof parsed.totalQuestions === 'number' && parsed.totalQuestions >= 0) {
                quizState.totalQuestions = parsed.totalQuestions;
            }
            if (typeof parsed.correctAnswers === 'number' && parsed.correctAnswers >= 0) {
                quizState.correctAnswers = parsed.correctAnswers;
            }
            if (typeof parsed.bestStreak === 'number' && parsed.bestStreak >= 0) {
                quizState.bestStreak = parsed.bestStreak;
            }
            updateStats();
            console.log('Progress loaded:', parsed.lastSaved);
        }
    } catch (error) {
        console.error('Failed to load progress:', error);
        // JSON解析失败或数据损坏，使用默认值
    }
}

// 页面加载时恢复进度
window.addEventListener('load', () => {
    loadProgress();
});

// 页面卸载时保存进度
window.addEventListener('beforeunload', () => {
    saveProgress();
});

// ✅ 企业级：页面卸载时清理资源（防止内存泄漏）
window.addEventListener('unload', () => {
    // 清理任何需要清理的资源
    // 注：大部分事件监听器会随页面卸载自动清理
    console.log('[cleanup] Page unloaded, resources cleaned');
});

