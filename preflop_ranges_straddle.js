// 8人桌 Straddle+Ante 翻前范围数据库
// 游戏结构: SB(1BB) - BB(2BB) - Straddle(4BB), 每人Ante 1BB
// 底池起始: 15BB (7BB盲注 + 8BB Ante)

const POKER_HANDS = [
    ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
    ['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
    ['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
    ['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
    ['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
    ['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
    ['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
    ['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
    ['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
    ['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
    ['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
    ['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
    ['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22']
];

// 核心范围数据库 - 针对Straddle+Ante结构优化
const RANGES = {
    // 按钮位 (BTN) - 最激进的偷盲位置
    BTN: {
        open: {
            unknown: {
                hands: 'AA-22,AKo-A2o,KQo-K5o,QJo-Q9o,JTo-J9o,T9o,AKs-A2s,KQs-K2s,QJs-Q5s,JTs-J7s,T9s-T7s,98s-97s,87s-86s,76s-75s,65s-64s,54s',
                vpip: 48,
                notes: [
                    '按钮位是偷盲的黄金位置，有Ante后底池已有15BB，偷盲价值极高',
                    '面对紧手可以扩展到48%的范围，包括大量同花连子和弱Ax',
                    '重点：利用位置优势+底池Ante，提高弃牌率来盈利',
                    '尺度建议：3-3.5BB (相对于Straddle的4BB)',
                    '目标：让BB和Straddle弃牌，避免多人底池'
                ]
            },
            tight: {
                hands: 'AA-22,AKo-A2o,KQo-K2o,QJo-Q7o,JTo-J8o,T9o-T8o,98o,AKs-A2s,KQs-K2s,QJs-Q2s,JTs-J5s,T9s-T5s,98s-95s,87s-85s,76s-75s,65s-64s,54s',
                vpip: 55,
                notes: [
                    '对抗紧手（弃牌率高），大幅扩展范围到55%',
                    '所有Ax、Kx同花都可以开池，利用弃牌股权',
                    '紧手在盲注位通常只防守15-20%，你的偷盲成功率极高',
                    '尺度：2.5-3BB即可，小尺度高频偷盲',
                    '如果被3-Bet，通常弃掉弱牌，只用顶端范围继续'
                ]
            },
            loose: {
                hands: 'AA-77,AKo-A9o,KQo-KTo,QJo-QTo,JTo,AKs-A5s,KQs-K9s,QJs-QTs,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s',
                vpip: 28,
                notes: [
                    '对抗松手（防守宽），收紧到28%的价值导向范围',
                    '避免弱同花连子，因为松手会跟注/3-Bet，你将失去位置或面对多人底池',
                    '重点转向用强牌价值下注，而非纯偷盲',
                    '尺度：3.5-4BB，用大尺度惩罚松手的弱跟注范围',
                    '准备好应对3-Bet，用QQ+/AK进行4-Bet'
                ]
            },
            passive: {
                hands: 'AA-22,AKo-A2o,KQo-K3o,QJo-Q8o,JTo-J9o,T9o,AKs-A2s,KQs-K2s,QJs-Q4s,JTs-J6s,T9s-T6s,98s-96s,87s-86s,76s-75s,65s-64s,54s-53s',
                vpip: 52,
                notes: [
                    '对抗被动鱼（爱跟注不爱加注），开池范围52%',
                    '包含大量投机牌（同花连子、小对子），因为鱼会用弱牌跟注',
                    '策略：用价值牌薄价值下注，用投机牌看翻后',
                    '尺度：3-3.5BB，鱼通常会跟任何尺度',
                    '翻后计划：在有利面打价值，在不利面控池或弃牌'
                ]
            },
            maniac: {
                hands: 'AA-99,AKo-ATo,KQo-KJo,QJo,AKs-A9s,KQs-KJs,QJs-QTs,JTs,T9s',
                vpip: 18,
                notes: [
                    '对抗疯子（超高3-Bet率），收紧到18%的陷阱范围',
                    '主要用强牌等待疯子3-Bet，然后进行4-Bet或trap',
                    '避免中等强度牌，因为面对3-Bet进退两难',
                    '尺度：3-3.5BB，诱导疯子3-Bet',
                    '4-Bet策略：QQ+/AK必然4-Bet，JJ/AQs可以平跟陷阱'
                ]
            }
        },
        vs_open: {
            unknown: {
                hands: 'AA-JJ,AKo-AQo,AKs-AJs,KQs',
                vpip: 6.5,
                notes: [
                    '面对前位开池，3-Bet范围收紧到6.5%（价值导向）',
                    '在按钮位3-Bet有位置优势，但筹码深时需谨慎',
                    '尺度：12-15BB（相对于Straddle），给对手压力',
                    '目标：用QQ+/AK拿下底池或建立主动权进入翻后',
                    '对抗4-Bet：只用AA-QQ/AK继续（Call或5-Bet）'
                ]
            }
        },
        squeeze: {
            unknown: {
                hands: 'AA-TT,AKo-AJo,AKs-ATs,KQs',
                vpip: 8,
                notes: [
                    'Squeeze场景：前位开池+有人跟注，你在BTN进行隔离加注',
                    '有Ante后，底池已经很大，Squeeze价值高',
                    '范围比普通3-Bet稍宽（8%），因为跟注者通常较弱',
                    '尺度：18-22BB，要大到让前位开池者和跟注者都难受',
                    '成功率：即使只有30-40%弃牌率，考虑底池Ante后依然盈利'
                ]
            }
        }
    },

    // 关煞位 (CO) - 第二偷盲位
    CO: {
        open: {
            unknown: {
                hands: 'AA-22,AKo-A9o,KQo-KTo,QJo-QTo,JTo,AKs-A5s,KQs-K8s,QJs-Q9s,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s',
                vpip: 35,
                notes: [
                    '关煞位需要考虑按钮位玩家，开池范围35%（比BTN保守）',
                    '依然是偷盲位置，但需要防范BTN的3-Bet',
                    '尺度：3-3.5BB',
                    '对抗3-Bet：用强牌（QQ+/AK）4-Bet，中等牌（JJ-99/AQ）平跟或弃牌',
                    '目标：偷走盲注或建立位置优势进入翻后'
                ]
            },
            tight: {
                hands: 'AA-22,AKo-A8o,KQo-K9o,QJo-Q9o,JTo-J9o,T9o,AKs-A4s,KQs-K7s,QJs-Q8s,JTs-J8s,T9s-T7s,98s-96s,87s-86s,76s-75s,65s-64s,54s',
                vpip: 42,
                notes: [
                    '对抗紧手，扩展到42%',
                    '如果BTN也是紧手，偷盲成功率极高',
                    '尺度：2.5-3BB，小尺度高频',
                    '对抗3-Bet：紧手3-Bet通常是AA-QQ/AK，你只用最强牌继续'
                ]
            }
        }
    },

    // 中间位置 (MP)
    MP: {
        open: {
            unknown: {
                hands: 'AA-77,AKo-ATo,KQo-KJo,QJo,AKs-A9s,KQs-KTs,QJs-QTs,JTs-J9s,T9s,98s',
                vpip: 22,
                notes: [
                    '中间位置需要考虑后面3个玩家，范围收紧到22%',
                    '重点转向价值牌，减少投机牌',
                    '尺度：3.5-4BB',
                    '面对3-Bet：只用QQ+/AK进行4-Bet，其他弃牌或偶尔平跟',
                    '筹码深时，小对子(77-99)可以为了set mining而开池'
                ]
            }
        }
    },

    // 枪口+1 (UTG+1)
    UTG1: {
        open: {
            unknown: {
                hands: 'AA-88,AKo-AQo,KQo,AKs-ATs,KQs-KJs,QJs,JTs',
                vpip: 15,
                notes: [
                    '枪口+1位置，面对5个后位玩家，范围15%（强牌为主）',
                    '尺度：3.5-4BB',
                    '避免投机牌，因为位置差且容易面对多人底池',
                    '面对3-Bet：QQ+/AK进行4-Bet或平跟，其他弃牌',
                    '深筹码时88-TT可以为了set mining开池'
                ]
            }
        }
    },

    // 枪口 (UTG)
    UTG: {
        open: {
            unknown: {
                hands: 'AA-99,AKo-AQo,AKs-AJs,KQs',
                vpip: 11,
                notes: [
                    '枪口位置最紧，面对6个后位玩家，范围11%',
                    '只用强价值牌开池',
                    '尺度：3.5-4.5BB',
                    '面对3-Bet：只用AA-QQ/AK进行4-Bet，其他谨慎处理',
                    '在深筹码环境，99+依然有set mining价值'
                ]
            }
        }
    },

    // Straddle位 - 特殊位置，最后一个行动
    Straddle: {
        defend_straddle: {
            unknown: {
                hands: 'AA-22,AKo-A2o,KQo-K7o,QJo-Q9o,JTo-J9o,T9o,AKs-A2s,KQs-K5s,QJs-Q7s,JTs-J8s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s-64s,54s',
                vpip: 45,
                notes: [
                    'Straddle位防守关键：你已经投入4BB，底池至少19BB（15BB起始 + 4BB开池）',
                    '你有位置优势（最后行动），可以宽防守45%',
                    '防守计算：需要4BB跟注进入19BB的底池 = 约17%胜率即可盈利',
                    '策略：用强牌（QQ+/AK）进行3-Bet，其他跟注看翻后',
                    '3-Bet尺度：15-18BB（不要太大，因为你已经投入4BB）',
                    '重点：利用位置优势，在翻后实现手牌价值'
                ]
            },
            tight: {
                hands: 'AA-22,AKo-A2o,KQo-K5o,QJo-Q8o,JTo-J9o,T9o,AKs-A2s,KQs-K2s,QJs-Q5s,JTs-J7s,T9s-T7s,98s-96s,87s-86s,76s-75s,65s-64s,54s-53s',
                vpip: 52,
                notes: [
                    '对抗紧手，扩展到52%',
                    '紧手通常只在强牌时开池，被3-Bet会更多弃牌',
                    '策略：用更多手牌3-Bet bluff（A5s-A2s, 同花连子）',
                    '如果只是跟注，准备在翻后用激进的打法偷池'
                ]
            }
        },
        vs_open: {
            unknown: {
                hands: 'AA-QQ,AKo-AQo,AKs-AQs,KQs',
                vpip: 5,
                notes: [
                    '如果前面有人开池，你3-Bet范围要收紧（5%）',
                    '尺度：15-20BB',
                    '你有位置优势，但要谨慎不要over-bluff',
                    '主要用价值牌3-Bet，减少bluff'
                ]
            }
        }
    },

    // 大盲位 (BB)
    BB: {
        defend_bb: {
            unknown: {
                hands: 'AA-22,AKo-A2o,KQo-K6o,QJo-Q8o,JTo-J9o,T9o,AKs-A2s,KQs-K4s,QJs-Q6s,JTs-J7s,T9s-T7s,98s-96s,87s-86s,76s-75s,65s',
                vpip: 42,
                notes: [
                    '大盲位防守：你已经投入2BB，面对4BB开池（相对于Straddle），需要再投2BB',
                    '底池至少19BB（15BB起始 + 4BB开池），你需要2BB = 约10%胜率盈利',
                    '问题：你没有位置（Straddle在你后面），防守范围需要收紧到42%',
                    '策略：用强牌（JJ+/AK）3-Bet，中等牌跟注，弱牌弃牌',
                    '3-Bet尺度：12-15BB（重点隔离，不希望Straddle跟进）',
                    '弃牌损失：每次弃牌损失2BB+1BB(Ante) = 3BB，要避免过度弃牌'
                ]
            },
            tight: {
                hands: 'AA-22,AKo-A2o,KQo-K5o,QJo-Q7o,JTo-J9o,T9o-T8o,AKs-A2s,KQs-K3s,QJs-Q5s,JTs-J6s,T9s-T6s,98s-95s,87s-85s,76s-74s,65s-64s,54s',
                vpip: 48,
                notes: [
                    '对抗紧手，扩展到48%',
                    '紧手开池通常较强，但弃牌率也高',
                    '用更宽的范围3-Bet bluff，尺度10-12BB',
                    '如果Straddle是紧手，你可以更激进地3-Bet隔离'
                ]
            }
        },
        vs_open: {
            unknown: {
                hands: 'AA-QQ,AKo-AQo,AKs-AQs,KQs',
                vpip: 5,
                notes: [
                    '前位开池，你在BB 3-Bet范围5%（强牌为主）',
                    '尺度：12-15BB',
                    '问题：Straddle在你后面，可能会4-Bet或冷跟',
                    '主要用JJ+/AK，避免bluff'
                ]
            }
        }
    },

    // 小盲位 (SB) - 最差位置
    SB: {
        open: {
            unknown: {
                hands: 'AA-88,AKo-AJo,KQo,AKs-ATs,KQs-KJs,QJs,JTs',
                vpip: 14,
                notes: [
                    '小盲位开池（limping）：最差的位置，后面有BB和Straddle',
                    '策略1 - 隔离加注（Iso-raise）：用强牌加注到12-15BB，目标是隔离出BB和Straddle',
                    '策略2 - Limp：用投机牌（小对子、同花连子）limp 1BB（补齐到2BB），看翻后',
                    '弃牌损失：每次弃牌损失1BB+1BB(Ante) = 2BB，但位置太差，不能过度防守',
                    'Limp范围：22-77,A9s-A2s,KTs-K9s,QTs-Q9s,JTs-J9s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s-64s,54s（约25%）'
                ]
            }
        },
        vs_open: {
            unknown: {
                hands: 'AA-JJ,AKo-AQo,AKs-AJs',
                vpip: 4,
                notes: [
                    '小盲位面对开池，3-Bet范围极紧（4%）',
                    '你位置最差，只用最强的牌3-Bet',
                    '尺度：15-18BB',
                    '很多时候直接弃牌是正确的，损失2BB（1BB盲注+1BB Ante）'
                ]
            }
        }
    }
};

// 策略建议数据库
const STRATEGY_TIPS = {
    BTN: {
        open: '按钮位是偷盲的最佳位置，有Ante使得底池起始就有15BB，偷盲价值极高。关键是根据对手类型调整范围宽度。',
        vs_open: '在按钮位3-Bet有位置优势，但深筹码时要谨慎。主要用强价值牌，避免over-bluffing。',
        squeeze: 'Squeeze是利用底池Ante的绝佳策略。底池大时，即使弃牌率不高也能盈利。'
    },
    CO: {
        open: '关煞位是第二偷盲位，但需要考虑BTN的3-Bet。平衡偷盲与价值之间的关系。'
    },
    MP: {
        open: '中间位置要收紧，重点转向价值牌。深筹码时小对子依然有set mining价值。'
    },
    UTG1: {
        open: '枪口+1要进一步收紧，避免投机牌。位置差时，宁可弃牌等待更好的spot。'
    },
    UTG: {
        open: '枪口位最紧，只用强价值牌开池。避免进入多人底池的不利局面。'
    },
    Straddle: {
        defend_straddle: 'Straddle位是关键防守位，你已投入4BB且有位置优势。宽防守但要有翻后计划。',
        vs_open: '前位开池时要收紧3-Bet范围，因为后面还有BB和SB可能介入。'
    },
    BB: {
        defend_bb: '大盲防守的核心矛盾：pot odds很好但没有位置。要平衡防守宽度与翻后可玩性。',
        vs_open: '前位开池时，大盲3-Bet要考虑Straddle的存在，收紧范围主要用价值牌。'
    },
    SB: {
        open: '小盲位最差，开池要么用强牌隔离加注，要么用投机牌limp。避免中等强度牌的尴尬处境。',
        vs_open: '面对开池，小盲位通常直接弃牌是最佳选择。只用最强的牌3-Bet。'
    }
};

// 初始化范围网格
function initRangeGrid() {
    const grid = document.getElementById('rangeGrid');
    grid.innerHTML = '';
    
    POKER_HANDS.forEach(row => {
        row.forEach(hand => {
            const cell = document.createElement('div');
            cell.className = 'hand-cell';
            cell.textContent = hand;
            cell.dataset.hand = hand;
            
            // 设置手牌类型样式
            if (hand.includes('o')) {
                cell.classList.add('offsuit');
            } else if (hand.includes('s') && hand.length === 3) {
                cell.classList.add('suited');
            } else {
                cell.classList.add('pair');
            }
            
            cell.addEventListener('click', () => highlightHand(hand));
            grid.appendChild(cell);
        });
    });
}

// 高亮选中的手牌
function highlightHand(hand) {
    const cells = document.querySelectorAll('.hand-cell');
    cells.forEach(cell => {
        if (cell.dataset.hand === hand) {
            cell.classList.toggle('highlighted');
        }
    });
}

// 解析范围字符串
function parseRange(rangeString) {
    const hands = new Set();
    const parts = rangeString.split(',');
    
    parts.forEach(part => {
        part = part.trim();
        
        if (part.includes('-')) {
            // 处理范围（如AA-TT, AKo-ATo）
            const [start, end] = part.split('-');
            const expanded = expandRange(start, end);
            expanded.forEach(h => hands.add(h));
        } else {
            // 单个手牌
            hands.add(part);
        }
    });
    
    return hands;
}

// 扩展范围
function expandRange(start, end) {
    const hands = [];
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    // 对子范围（如AA-TT）
    if (start.length === 2 && end.length === 2 && start[0] === start[1]) {
        const startIdx = ranks.indexOf(start[0]);
        const endIdx = ranks.indexOf(end[0]);
        for (let i = startIdx; i <= endIdx; i++) {
            hands.push(ranks[i] + ranks[i]);
        }
        return hands;
    }
    
    // Suited/Offsuit范围（如AKs-A9s, KQo-KTo）
    const isSuited = start.includes('s');
    const isOffsuit = start.includes('o');
    const suffix = isSuited ? 's' : (isOffsuit ? 'o' : '');
    
    const startRank1 = start[0];
    const startRank2 = start[1];
    const endRank2 = end[1];
    
    const rank1Idx = ranks.indexOf(startRank1);
    const startRank2Idx = ranks.indexOf(startRank2);
    const endRank2Idx = ranks.indexOf(endRank2);
    
    for (let i = startRank2Idx; i <= endRank2Idx; i++) {
        hands.push(startRank1 + ranks[i] + suffix);
    }
    
    return hands;
}

// 更新显示
function updateDisplay() {
    const position = document.getElementById('position').value;
    const action = document.getElementById('action').value;
    const opponent = document.getElementById('opponent').value;
    
    // 获取范围数据
    const positionData = RANGES[position];
    if (!positionData || !positionData[action]) {
        showError('暂无此组合的范围数据');
        return;
    }
    
    const actionData = positionData[action];
    const rangeData = actionData[opponent] || actionData['unknown'];
    
    // 更新标题和信息
    const positionNames = {
        'BTN': '按钮位 (BTN)',
        'CO': '关煞位 (CO)',
        'MP': '中间位置 (MP)',
        'UTG1': '枪口+1 (UTG+1)',
        'UTG': '枪口 (UTG)',
        'Straddle': 'Straddle位',
        'BB': '大盲 (BB)',
        'SB': '小盲 (SB)'
    };
    
    const actionNames = {
        'open': '开池',
        'vs_open': '对抗开池 (3-Bet)',
        'vs_3bet': '对抗3-Bet (4-Bet)',
        'squeeze': 'Squeeze',
        'defend_bb': '大盲防守',
        'defend_straddle': 'Straddle防守'
    };
    
    const opponentNames = {
        'unknown': '未知/标准',
        'tight': '紧凶 (TAG)',
        'loose': '松凶 (LAG)',
        'passive': '被动鱼 (Fish)',
        'maniac': '疯子 (Maniac)'
    };
    
    document.getElementById('rangeTitle').textContent = 
        `${positionNames[position]} - ${actionNames[action]} vs ${opponentNames[opponent]}`;
    
    document.getElementById('vpipValue').textContent = `${rangeData.vpip}%`;
    
    // 解析并显示范围
    const handsInRange = parseRange(rangeData.hands);
    const combos = calculateCombos(handsInRange);
    document.getElementById('combosValue').textContent = combos;
    
    // 更新网格显示
    const cells = document.querySelectorAll('.hand-cell');
    cells.forEach(cell => {
        const hand = cell.dataset.hand;
        if (handsInRange.has(hand)) {
            cell.classList.remove('not-in-range');
        } else {
            cell.classList.add('not-in-range');
        }
    });
    
    // 更新策略建议
    const notesHtml = rangeData.notes.map(note => `<li>${note}</li>`).join('');
    const strategyTip = STRATEGY_TIPS[position] && STRATEGY_TIPS[position][action] 
        ? `<p style="color: #ffd700; margin-bottom: 15px; font-style: italic;">💡 ${STRATEGY_TIPS[position][action]}</p>` 
        : '';
    
    document.getElementById('strategyNotes').innerHTML = `
        <h3>📋 策略要点</h3>
        ${strategyTip}
        <ul>${notesHtml}</ul>
    `;
}

// 计算组合数
function calculateCombos(hands) {
    let total = 0;
    hands.forEach(hand => {
        if (hand.length === 2) {
            // 对子：6种组合
            total += 6;
        } else if (hand.includes('s')) {
            // 同花：4种组合
            total += 4;
        } else {
            // 不同花：12种组合
            total += 12;
        }
    });
    return total;
}

// 显示错误
function showError(message) {
    document.getElementById('rangeTitle').textContent = message;
    document.getElementById('vpipValue').textContent = '--%';
    document.getElementById('combosValue').textContent = '--';
    document.getElementById('strategyNotes').innerHTML = `
        <h3>⚠️ 提示</h3>
        <p>请选择其他组合或等待数据更新。</p>
    `;
}

// 事件监听器
document.getElementById('position').addEventListener('change', updateDisplay);
document.getElementById('action').addEventListener('change', updateDisplay);
document.getElementById('opponent').addEventListener('change', updateDisplay);

// 初始化
initRangeGrid();
updateDisplay();

