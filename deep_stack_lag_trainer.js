// 深筹码松凶玩家训练器 - 核心逻辑
// 300BB+ LAG Style Training System

// 手牌矩阵生成
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const allHands = [];

// 生成169种起手牌
for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
        if (i === j) {
            // 对子
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
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
                   'KQs', 'KJs', 'KTs',
                   'QJs', 'QTs',
                   'JTs', 'J9s',
                   'T9s',
                   'AKo', 'AQo', 'AJo', 'KQo'],
            percentage: '15%',
            sizing: '2.5BB (vs BB+Straddle: 3.5-4BB)',
            notes: 'UTG仍需保持纪律，但比标准TAG稍宽，增加了A9s和部分同花连牌'
        },
        UTG1: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s',
                   'KQs', 'KJs', 'KTs', 'K9s',
                   'QJs', 'QTs', 'Q9s',
                   'JTs', 'J9s',
                   'T9s', 'T8s',
                   '98s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo'],
            percentage: '18%',
            sizing: '2.5BB (vs BB+Straddle: 3.5BB)',
            notes: '增加小对子和更多同花牌'
        },
        LJ: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A5s', 'A4s',
                   'KQs', 'KJs', 'KTs', 'K9s',
                   'QJs', 'QTs', 'Q9s',
                   'JTs', 'J9s', 'J8s',
                   'T9s', 'T8s',
                   '98s', '97s',
                   '87s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo'],
            percentage: '22%',
            sizing: '2.5BB',
            notes: 'LJ开始显著扩张，增加suited wheel aces和更多连牌'
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
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s',
                   'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
                   'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
                   'T9s', 'T8s', 'T7s', 'T6s',
                   '98s', '97s', '96s',
                   '87s', '86s', '85s',
                   '76s', '75s',
                   '65s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o',
                   'KQo', 'KJo', 'KTo', 'K9o',
                   'QJo', 'QTo', 'Q9o',
                   'JTo', 'J9o'],
            percentage: '37%',
            sizing: '2.5BB',
            notes: 'CO非常激进，几乎所有同花牌+强散牌组合'
        },
        BTN: {
            range: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
                   'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                   'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
                   'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
                   'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s',
                   'T9s', 'T8s', 'T7s', 'T6s', 'T5s',
                   '98s', '97s', '96s', '95s',
                   '87s', '86s', '85s',
                   '76s', '75s', '74s',
                   '65s', '64s',
                   '54s', '53s',
                   'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
                   'KQo', 'KJo', 'KTo', 'K9o', 'K8o',
                   'QJo', 'QTo', 'Q9o', 'Q8o',
                   'JTo', 'J9o', 'J8o',
                   'T9o', 'T8o',
                   '98o'],
            percentage: '52%',
            sizing: '2.5BB',
            notes: 'BTN极度激进，超过50%的手牌！几乎所有同花牌+大量散牌'
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
            range: 'Facing raise - see defense ranges',
            percentage: 'N/A - 防守位',
            sizing: 'N/A',
            notes: 'Straddle位是盲注，只能在其他人加注后行动'
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
                percentage: '16%',
                sizing: '3x',
                notes: 'BTN vs SB是经典spot，范围很宽'
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
            }
        },
        BB: {
            vsUTG: {
                range: ['AA', 'KK', 'QQ', 'JJ', 'TT',
                       'AKs', 'AQs', 'AJs',
                       'AKo',
                       'A5s', 'A4s', 'A3s', 'A2s',
                       '87s', '76s'],
                percentage: '6.5%',
                sizing: '3.5x',
                notes: 'BB vs UTG紧而激进'
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
                percentage: '14%',
                sizing: '3.5x',
                notes: 'BB vs BTN大幅扩张，必须防守偷盲'
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

    // Call 4-Bet 范围 (平跟4-Bet)
    call4Bet: {
        general: {
            range: ['QQ', 'JJ', 'TT',
                   'AKs', 'AQs', 'AJs',
                   'AKo'],
            percentage: '~3%',
            notes: '面对4-Bet通常是QQ+/AK 4-Bet或fold，只有少数情况平跟（主要是QQ/JJ不确定是否领先）'
        },
        deep: {
            range: ['QQ', 'JJ', 'TT', '99',
                   'AKs', 'AQs', 'AJs',
                   'AKo',
                   '87s', '76s'],
            percentage: '~4%',
            notes: '400BB+超深筹码时，可以考虑用更多牌平跟4-Bet'
        }
    }
};

// 手牌判断辅助函数
function parseHand(hand) {
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
    return null;
}

function isInRange(hand, rangeArray) {
    return rangeArray.includes(hand);
}

// 生成手牌矩阵显示
function generateHandGrid() {
    const grid = document.getElementById('range-grid');
    grid.innerHTML = '';

    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            const cell = document.createElement('div');
            cell.className = 'hand-cell';
            
            let hand;
            if (i === j) {
                hand = ranks[i] + ranks[j];
                cell.classList.add('pair');
            } else if (j > i) {
                hand = ranks[i] + ranks[j] + 's';
                cell.classList.add('suited');
            } else {
                hand = ranks[j] + ranks[i] + 'o';
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
        const data = lagRanges.call4Bet.general;
        range = data.range || [];
        details = `
            <div><span class="highlight">Call 4-Bet范围</span></div>
            <div><span class="highlight">范围：</span>${data.percentage}</div>
            <div><span class="highlight">说明：</span>${data.notes}</div>
            <div style="margin-top: 15px;"><span class="highlight">包含手牌：</span>${range.join(', ')}</div>
        `;
    }

    document.getElementById('combo-details').innerHTML = details || '选择位置和动作查看详细范围...';

    cells.forEach(cell => {
        const hand = cell.dataset.hand;
        if (isInRange(hand, range)) {
            cell.classList.add(action.replace('bet', '-bet'));
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
    const positions = ['UTG', 'UTG1', 'LJ', 'HJ', 'CO', 'BTN', 'SB'];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    // 随机选择场景类型
    const scenarioTypes = ['open', '3bet', 'vs3bet', '4bet'];
    const scenarioType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
    
    // 随机生成一手牌
    const hand = allHands[Math.floor(Math.random() * allHands.length)];
    
    let correctAnswer;
    let situation = '';
    
    if (scenarioType === 'open') {
        const openRange = lagRanges.openRaise[position]?.range || [];
        correctAnswer = isInRange(hand, openRange) ? 'raise' : 'fold';
        situation = `你在 ${position} 位，前面都弃牌`;
    } else if (scenarioType === '3bet') {
        const vsPositions = ['UTG', 'LJ', 'HJ', 'CO'];
        const vsPos = vsPositions[Math.floor(Math.random() * vsPositions.length)];
        const threeBetKey = `vs${vsPos}`;
        const threeBetRange = lagRanges.threeBet[position]?.[threeBetKey]?.range || [];
        
        if (isInRange(hand, threeBetRange)) {
            correctAnswer = '3bet';
        } else {
            // 检查是否在call范围
            const callRange = lagRanges.call3Bet.IP?.range || [];
            correctAnswer = isInRange(hand, callRange) ? 'call' : 'fold';
        }
        situation = `你在 ${position} 位，${vsPos} 加注到 2.5BB`;
    } else if (scenarioType === 'vs3bet') {
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
        const fiveBetRange = lagRanges.fiveBet.general.range;
        const callRange = lagRanges.call4Bet.general.range;
        
        if (isInRange(hand, fiveBetRange)) {
            correctAnswer = '5bet';
        } else if (isInRange(hand, callRange)) {
            correctAnswer = 'call';
        } else {
            correctAnswer = 'fold';
        }
        situation = `你 3-Bet，对手 4-Bet 到 25BB`;
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
    
    document.getElementById('question-text').textContent = quizState.currentQuestion.situation;
    document.getElementById('hand-display').textContent = quizState.currentQuestion.hand;
    document.getElementById('situation-info').textContent = `有效筹码：${300 + Math.floor(Math.random() * 200)}BB`;
    
    // 重置答案按钮
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
    
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-question').style.display = 'none';
}

function checkAnswer(userAnswer) {
    if (quizState.answered) return;
    
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
        
        document.querySelector(`[data-answer="${userAnswer}"]`).classList.add('correct');
    } else {
        quizState.currentStreak = 0;
        
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.textContent = `✗ 不正确。正确答案是：${getAnswerText(quizState.currentQuestion.correctAnswer)}`;
        
        document.querySelector(`[data-answer="${userAnswer}"]`).classList.add('incorrect');
        document.querySelector(`[data-answer="${quizState.currentQuestion.correctAnswer}"]`).classList.add('correct');
    }
    
    feedbackEl.style.display = 'block';
    document.getElementById('next-question').style.display = 'inline-block';
    
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
    document.getElementById('total-questions').textContent = quizState.totalQuestions;
    const accuracy = quizState.totalQuestions > 0 
        ? Math.round((quizState.correctAnswers / quizState.totalQuestions) * 100)
        : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('streak').textContent = quizState.currentStreak;
    document.getElementById('best-streak').textContent = quizState.bestStreak;
    
    const progress = accuracy;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-fill').textContent = progress + '%';
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
            document.getElementById('ranges-mode').style.display = mode === 'ranges' ? 'block' : 'none';
            document.getElementById('memory-mode').style.display = mode === 'memory' ? 'block' : 'none';
            document.getElementById('quiz-mode').style.display = mode === 'quiz' ? 'block' : 'none';
            document.getElementById('strategy-mode').style.display = mode === 'strategy' ? 'block' : 'none';
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
    document.getElementById('start-quiz').addEventListener('click', () => {
        displayQuestion();
    });
    
    document.getElementById('next-question').addEventListener('click', () => {
        displayQuestion();
    });
    
    document.getElementById('reset-stats').addEventListener('click', () => {
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
    
    document.getElementById('show-explanation').addEventListener('click', () => {
        if (!quizState.currentQuestion) {
            alert('请先开始测试');
            return;
        }
        
        const q = quizState.currentQuestion;
        let explanation = `手牌：${q.hand}\n位置：${q.position}\n场景：${q.situation}\n\n`;
        explanation += `最优动作：${getAnswerText(q.correctAnswer)}\n\n`;
        explanation += `解析：根据松凶深筹码策略，这手牌在此场景下应该${getAnswerText(q.correctAnswer)}。`;
        
        alert(explanation);
    });
    
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
    
    if (action === '3bet' && lagRanges.threeBet[position]) {
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

// 保存进度到localStorage
function saveProgress() {
    localStorage.setItem('lagTrainerStats', JSON.stringify(quizState));
}

function loadProgress() {
    const saved = localStorage.getItem('lagTrainerStats');
    if (saved) {
        const parsed = JSON.parse(saved);
        quizState.totalQuestions = parsed.totalQuestions || 0;
        quizState.correctAnswers = parsed.correctAnswers || 0;
        quizState.bestStreak = parsed.bestStreak || 0;
        updateStats();
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

