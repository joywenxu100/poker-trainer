// 实战行动指南 V3.0 - 100%不犯错
// 核心功能：快速场景+自定义+全屏警告+个人错误提醒

let state = {
    position: 'ip',
    street: 'turn',
    hand: 'top-two',
    action: 'check',
    villain: 'unknown',
    danger: 'dangerous'
};

// 初始化按钮事件
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-position],[data-street],[data-hand],[data-action],[data-villain],[data-danger]').forEach(btn => {
        btn.addEventListener('click', function() {
            const group = btn.closest('.btn-grid');
            group.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if(btn.dataset.position) state.position = btn.dataset.position;
            if(btn.dataset.street) state.street = btn.dataset.street;
            if(btn.dataset.hand) state.hand = btn.dataset.hand;
            if(btn.dataset.action) state.action = btn.dataset.action;
            if(btn.dataset.villain) state.villain = btn.dataset.villain;
            if(btn.dataset.danger) state.danger = btn.dataset.danger;
        });
    });
});

// 切换自定义模式
function toggleCustomMode() {
    const el = document.getElementById('customMode');
    el.classList.toggle('show');
}

// 切换设置面板
function toggleSettings() {
    const el = document.getElementById('settingsPanel');
    el.classList.toggle('show');
}

// 快速场景
function quickScenario(scenario) {
    const pot = 50;
    let result = { cards: [], warning: null, fullscreen: false };
    
    if (scenario === 'strong-check') {
        result.cards = [{
            type: 'success',
            title: '🎯 【行动】下注 2/3底池（约33BB）',
            content: `【原因】
• 你有强牌，对手过牌显示弱势
• 下注拿价值，不给免费牌

【如果对手加注】
• 你有坚果/暗三 → 全下
• 你有两对 → 谨慎跟注，河牌危险牌弃牌

🚨【绝不要做】
❌ 过牌慢打 → 给免费牌
❌ 小额下注 < 1/2pot → 浪费价值`
        }];
    }
    
    else if (scenario === 'strong-danger') {
        result.cards = [{
            type: 'warning',
            title: '🎯 【行动】下注 1/2底池（约25BB）控制底池',
            content: `【原因】
• 你有强牌，但牌面危险
• 下注保护，但不要投入太多
• 河牌出现危险牌要能弃掉

【如果对手加注】
• 小加注 → 跟注看河牌
• 大加注(≥pot) → 弃牌！

🚨【绝不要做】
❌ 大额下注 > 2/3pot（投入太多河牌弃不掉）
❌ 跟注大额加注（你可能已经输了）

💡【河牌预警】
• 完成同花 + 对手下注 → 弃掉你的两对/暗三
• 完成顺子 + 对手下注 → 弃掉你的两对/暗三`
        }];
    }
    
    else if (scenario === 'river-nuts-bet') {
        result.fullscreen = true;
        result.warning = {
            title: '停！你的强牌已经输了！',
            text: '河牌完成了同花/顺子\n对手大额下注 = 99%有坚果',
            action: '【弃牌】是正确答案',
            dont: '❌ 不要跟注\n❌ 不要Hero Call\n❌ 不要想"他可能诈唬"'
        };
        result.cards = [{
            type: 'critical',
            title: '🚨 【行动】弃牌！',
            content: `【情况分析】
• 河牌完成了同花/顺子
• 对手大额下注
• 你的暗三/两对已经不是好牌了

💀【对手99%有坚果】
• 被动玩家河牌大额下注 = 100%有牌
• 你跟注只会输更多

【职业vs业余分水岭】
• 业余：舍不得弃暗三 → 输50-200BB
• 职业：完成听牌秒弃 → 省50-200BB

💡【核心原则】
河牌完成听牌 + 对手大额下注 = 弃牌
今天不要犯这个错误！`
        }];
    }
    
    else if (scenario === 'drawing') {
        result.cards = [{
            type: 'warning',
            title: '🎯 【行动】计算赔率决定！',
            content: `【听牌胜率】
• 同花听牌(9outs) = 约18%（转牌单张）/ 36%（转到河）
• 两头顺(8outs) = 约16%（转牌单张）/ 32%（转到河）
• 卡顺(4outs) = 约8%（转牌单张）/ 16%（转到河）

【赔率计算】
跟注金额 ÷ (底池 + 对手下注 + 跟注金额) = 需要胜率

【决策】
• 你的胜率 > 需要胜率 → 跟注
• 你的胜率 < 需要胜率 → 弃牌

🚨【绝不要做】
❌ 不计算赔率就跟注大额下注
❌ "感觉会中" → 情绪化跟注

💡【记住】
• 对手下注pot → 你需要33%胜率
• 同花听18%胜率 < 33% → 弃牌`
        }];
    }
    
    displayResult(result);
}

// 自定义分析
function analyze() {
    let pot = parseFloat(document.getElementById('potSize').value) || 50;
    if (pot <= 0) pot = 50; // 防止负数或零
    const bet = {
        third: Math.round(pot * 0.33),
        half: Math.round(pot * 0.5),
        twoThird: Math.round(pot * 0.67),
        pot: pot
    };
    
    let result = { cards: [], warning: null, fullscreen: false, personal: [] };
    const { position, street, hand, action, villain, danger } = state;
    
    // 检查个人常犯错误
    const mistakes = {
        m1: document.getElementById('m1')?.checked,
        m2: document.getElementById('m2')?.checked,
        m3: document.getElementById('m3')?.checked,
        m4: document.getElementById('m4')?.checked,
        m5: document.getElementById('m5')?.checked
    };
    
    // ========== 核心场景：需要全屏警告的情况 ==========
    
    // 场景1：河牌完成听牌 + 对手大额下注 + 你不是坚果
    if (street === 'river' && danger === 'completed' && 
        (action === 'bet-big' || action === 'all-in') &&
        (hand === 'set' || hand === 'top-two' || hand === 'overpair' || hand === 'top-pair')) {
        
        result.fullscreen = true;
        result.warning = {
            title: `停！你的${getHandName(hand)}已经输了！`,
            text: '河牌完成了同花/顺子\n对手大额下注 = 99%有坚果',
            action: '【弃牌】是正确答案',
            dont: '❌ 不要跟注\n❌ 不要Hero Call\n❌ 不要想"他可能诈唬"'
        };
        
        if (mistakes.m2) {
            result.personal.push('🚨 你标记过：河牌完成听牌舍不得弃暗三');
        }
        
        result.cards.push({
            type: 'critical',
            title: '🚨 【行动】弃牌！',
            content: `【情况分析】
• 河牌完成了听牌（同花/顺子）
• 对手大额下注
• 你的${getHandName(hand)}已经被超越

💀【对手99%有坚果】
${villain === 'fish' ? '• 被动鱼大额下注 = 100%有牌！' : '• 河牌大额下注通常是强牌'}

【职业玩家的选择】
弃牌！省下50-200BB`
        });
    }
    
    // 场景2：被动鱼大额下注
    else if (villain === 'fish' && (action === 'bet-big' || action === 'all-in') && hand !== 'nuts') {
        result.fullscreen = true;
        result.warning = {
            title: '被动鱼大额下注！',
            text: '被动鱼大额下注 = 100%有强牌\n他不会诈唬',
            action: '【弃牌】除非你有坚果',
            dont: '❌ 不要跟注\n❌ 不要想"他可能在诈唬"'
        };
        
        if (mistakes.m3) {
            result.personal.push('🚨 你标记过：被动鱼大额下注还跟注');
        }
        
        result.cards.push({
            type: 'critical',
            title: '🚨 【行动】弃牌！',
            content: `【关键信息】
• 对手是被动鱼
• 被动玩家大额下注 = 100%有牌
• 他们不懂诈唬，只在有货时下注

💀【你的${getHandName(hand)}打不赢】
弃牌是唯一正确选择`
        });
    }
    
    // ========== 转牌圈逻辑 ==========
    else if (street === 'turn') {
        
        // 坚果
        if (hand === 'nuts') {
            result.cards.push({
                type: 'success',
                title: `🎯 【行动】下注 ${bet.twoThird}BB（2/3底池）`,
                content: `【原因】你有坚果，价值最大化

【如果对手加注】直接全下！

🚨【绝不要做】
❌ 过牌慢打 → 给免费牌
❌ 小额下注 → 浪费价值`
            });
        }
        
        // 暗三
        else if (hand === 'set') {
            if (danger === 'dangerous' || danger === 'completed') {
                result.cards.push({
                    type: 'warning',
                    title: `🎯 【行动】下注 ${bet.twoThird}BB（2/3底池·保护）`,
                    content: `【原因】
• 你有暗三，但牌面危险
• 必须下注保护，不给听牌便宜抽

【如果对手加注】
• 牌面安全 → 全下
• 牌面有3张同花/4顺子 → 谨慎跟注

💡【河牌预警】
• 完成同花 + 对手大额下注 → 弃暗三！
• 完成顺子 + 对手大额下注 → 弃暗三！`
                });
                
                if (mistakes.m4) {
                    result.personal.push('🚨 你标记过：转牌给听牌免费抽牌机会');
                }
            } else {
                result.cards.push({
                    type: 'success',
                    title: `🎯 【行动】下注 ${bet.twoThird}BB（2/3底池）`,
                    content: `【原因】牌面安全，你有暗三，价值最大化

【如果对手加注】全下！`
                });
            }
        }
        
        // 顶两对
        else if (hand === 'top-two') {
            if (danger === 'dangerous' || danger === 'completed') {
                if (action === 'bet-big' || action === 'all-in') {
                    result.cards.push({
                        type: 'critical',
                        title: `🚨 【行动】弃牌或小额跟注`,
                        content: `【情况分析】
• 你有顶两对，牌面危险
• 对手大额下注
• 你可能已经输了

【决策】
• 对手是紧凶TAG → 弃牌
• 对手是松凶LAG → 可以跟注（他可能诈唬）
• 对手是被动鱼 → 绝对弃牌！`
                    });
                    
                    if (mistakes.m1) {
                        result.personal.push('🚨 你标记过：转牌顶对/两对跟注大额加注');
                    }
                } else {
                    result.cards.push({
                        type: 'warning',
                        title: `🎯 【行动】下注 ${bet.half}BB（1/2底池·控制）`,
                        content: `【原因】
• 牌面危险，控制底池
• 投入少，河牌出危险牌能弃掉

【如果对手加注】
• 小加注 → 跟注
• 大加注(≥pot) → 弃牌！

🚨【绝不要做】
❌ 大额下注 ≥ ${bet.twoThird}BB → 投入太多河牌弃不掉

💡【河牌预警】
完成听牌 + 对手下注 → 弃掉两对！`
                    });
                }
            } else {
                result.cards.push({
                    type: 'success',
                    title: `🎯 【行动】下注 ${bet.twoThird}BB（2/3底池）`,
                    content: `【原因】牌面安全，顶两对价值下注

【如果对手加注】谨慎评估（可能有暗三）`
                });
            }
        }
        
        // 超对/顶对
        else if (hand === 'overpair' || hand === 'top-pair') {
            if (danger === 'dangerous' || danger === 'completed') {
                if (action === 'bet-big' || action === 'all-in') {
                    result.cards.push({
                        type: 'critical',
                        title: '🚨 【行动】弃牌',
                        content: `【情况分析】
• 你只有一对
• 牌面危险 + 对手大额下注
• 你很可能已经输了

💀 弃牌是正确选择`
                    });
                } else {
                    result.cards.push({
                        type: 'warning',
                        title: `🎯 【行动】过牌 或 下注 ${bet.third}BB`,
                        content: `【原因】
• 一对牌 + 牌面危险 = 控制底池
• 不要投入太多

【如果对手下注】
• 小额 < 1/3pot → 可跟注
• 大额 ≥ 1/2pot → 弃牌

🚨【绝不要做】
❌ 大额下注
❌ 对手加注还跟注`
                    });
                }
            } else {
                result.cards.push({
                    type: 'success',
                    title: `🎯 【行动】下注 ${bet.half}BB（1/2底池）`,
                    content: `【原因】牌面安全，保护+薄价值

【如果对手加注≥pot】弃牌`
                });
            }
        }
        
        // Nuts听牌
        else if (hand === 'nuts-draw') {
            if (action === 'check') {
                result.cards.push({
                    type: 'success',
                    title: `🎯 【行动】下注 ${bet.half}BB（半诈唬）`,
                    content: `【原因】
• 对手过牌 → 你可以半诈唬
• 对手弃牌 → 你赢
• 对手跟注 → 你还有约36%胜率

【如果对手加注】计算赔率决定`
                });
            } else if (action === 'bet-big' || action === 'all-in') {
                result.cards.push({
                    type: 'critical',
                    title: '🚨 【行动】弃牌（赔率不够）',
                    content: `【计算】
• 对手下注pot → 赔率约33%
• 同花听牌胜率约18%（单张）
• 胜率 < 赔率 → 弃牌

🚨【绝不要做】
❌ "感觉会中" → 情绪化跟注`
                });
                
                if (mistakes.m5) {
                    result.personal.push('🚨 你标记过：不计算赔率就追听牌');
                }
            } else {
                result.cards.push({
                    type: 'warning',
                    title: '🎯 【行动】计算赔率决定',
                    content: `【同花听牌】约18%胜率（转牌单张）

【计算赔率】
跟注金额 ÷ 总底池 = 需要胜率

• 胜率 > 需要胜率 → 跟注
• 胜率 < 需要胜率 → 弃牌`
                });
            }
        }
        
        // 普通听牌
        else if (hand === 'draw') {
            result.cards.push({
                type: 'warning',
                title: '🎯 【行动】计算赔率决定',
                content: `【听牌胜率】
• 两头顺(8outs)≈16%
• 卡顺(4outs)≈8%

【决策】
• 对手过牌 → 免费看河牌
• 对手小额下注 → 计算赔率
• 对手大额下注 → 弃牌`
            });
        }
        
        // 空气
        else if (hand === 'nothing' || hand === 'mid-pair') {
            result.cards.push({
                type: 'critical',
                title: '🚨 【行动】过牌-弃牌',
                content: `【原因】
• 牌太弱，没有价值
• 不要诈唬（转牌诈唬成功率低）

💡 及时止损 = 职业玩家标志`
            });
        }
    }
    
    // ========== 河牌圈逻辑 ==========
    else if (street === 'river') {
        
        // 坚果
        if (hand === 'nuts') {
            if (action === 'check') {
                result.cards.push({
                    type: 'success',
                    title: `🎯 【行动】下注 ${bet.pot}BB（Pot）`,
                    content: `【原因】你有坚果，最大化价值

【对手加注】全下！`
                });
            } else {
                result.cards.push({
                    type: 'success',
                    title: '🎯 【行动】加注或全下',
                    content: `【原因】你有坚果，对手下注了

• 对手小额下注 → 加注3x
• 对手大额下注 → 全下`
                });
            }
        }
        
        // 暗三/两对
        else if (hand === 'set' || hand === 'top-two') {
            // 牌面安全
            if (danger === 'safe' || danger === 'normal') {
                if (action === 'check') {
                    result.cards.push({
                        type: 'success',
                        title: `🎯 【行动】下注 ${bet.twoThird}BB（价值）`,
                        content: `【原因】牌面安全，对手过牌，价值下注

【对手加注】谨慎（可能慢打坚果）`
                    });
                } else {
                    result.cards.push({
                        type: 'warning',
                        title: '🎯 【行动】跟注或弃牌',
                        content: `【决策】
• 对手小额下注 → 跟注
• 对手大额下注 → 评估是否被超越`
                    });
                }
            }
            // 牌面危险但对手没有大额下注
            else if (danger === 'dangerous' || danger === 'completed') {
                if (action === 'check') {
                    result.cards.push({
                        type: 'warning',
                        title: `🎯 【行动】下注 ${bet.half}BB（薄价值/探底）`,
                        content: `【原因】
• 牌面危险，但对手过牌显示弱势
• 小额下注探底

【如果对手加注】
• 小加注 → 跟注
• 大加注 → 考虑弃牌（他可能有坚果在慢打）`
                    });
                } else if (action === 'bet-small') {
                    result.cards.push({
                        type: 'warning',
                        title: '🎯 【行动】跟注',
                        content: `【原因】
• 对手小额下注
• 你有${getHandName(hand)}，可以跟注抓诈唬

【注意】如果对手后续大额下注 → 考虑弃牌`
                    });
                } else {
                    // bet-big或all-in已经在前面处理过了
                    result.cards.push({
                        type: 'critical',
                        title: '🚨 【行动】谨慎弃牌',
                        content: `【情况】
• 牌面危险/完成听牌
• 对手大额下注
• 你的${getHandName(hand)}可能已经输了

💡 保守弃牌是正确选择`
                    });
                }
            }
        }
        
        // 一对牌
        else if (hand === 'overpair' || hand === 'top-pair' || hand === 'mid-pair') {
            if (action === 'bet-big' || action === 'all-in') {
                result.cards.push({
                    type: 'critical',
                    title: '🚨 【行动】弃牌',
                    content: `【原因】
• 河牌对手大额下注
• 你只有一对
• 打不赢任何价值牌

❌ 不要Hero Call`
                });
            } else if (action === 'check') {
                if (danger === 'safe' || danger === 'normal') {
                    result.cards.push({
                        type: 'success',
                        title: `🎯 【行动】下注 ${bet.half}BB（薄价值）`,
                        content: `【原因】对手过牌，牌面安全

【对手加注】弃牌`
                    });
                } else {
                    result.cards.push({
                        type: 'warning',
                        title: '🎯 【行动】过牌（摊牌）',
                        content: `【原因】牌面危险，不要下注

过牌看摊牌`
                    });
                }
            } else {
                result.cards.push({
                    type: 'warning',
                    title: '🎯 【行动】弃牌或跟注',
                    content: `【决策】
• 顶对好踢脚 + 牌面安全 → 可跟
• 其他情况 → 弃牌`
                });
            }
        }
        
        // 听牌没中
        else if (hand === 'nuts-draw' || hand === 'draw' || hand === 'nothing') {
            if (action === 'check') {
                result.cards.push({
                    type: 'warning',
                    title: `🎯 【行动】诈唬 ${bet.twoThird}BB 或 放弃`,
                    content: `【选项】
• 对手范围弱 → 诈唬下注${bet.twoThird}BB
• 对手可能陷阱 → 过牌放弃`
                });
            } else {
                result.cards.push({
                    type: 'critical',
                    title: '🚨 【行动】弃牌',
                    content: `【原因】听牌没中 + 对手下注

直接弃牌，不要诈唬加注`
                });
            }
        }
    }
    
    // ========== 翻牌圈逻辑 ==========
    else if (street === 'flop') {
        if (hand === 'nuts' || hand === 'set') {
            result.cards.push({
                type: 'success',
                title: `🎯 【行动】下注 ${bet.half}BB - ${bet.twoThird}BB`,
                content: `【原因】强牌，建立底池

• 干燥牌面 → ${bet.half}BB
• 湿润牌面 → ${bet.twoThird}BB`
            });
        } else if (hand === 'top-two' || hand === 'overpair' || hand === 'top-pair') {
            result.cards.push({
                type: 'success',
                title: `🎯 【行动】下注 ${bet.half}BB`,
                content: `【原因】持续下注，保护+价值

【对手加注】评估决定`
            });
        } else if (hand === 'nuts-draw' || hand === 'draw') {
            result.cards.push({
                type: 'success',
                title: `🎯 【行动】下注 ${bet.half}BB 或 过牌`,
                content: `【选项】
• 下注${bet.half}BB半诈唬
• 过牌免费看转牌

【对手下注】计算赔率决定`
            });
        } else {
            result.cards.push({
                type: 'warning',
                title: '🎯 【行动】过牌',
                content: `【原因】弱牌，不要投入

对手下注 → 弃牌`
            });
        }
    }
    
    // 显示连续模式提示
    if (street === 'turn') {
        document.getElementById('continueMode').style.display = 'block';
    }
    
    displayResult(result);
}

// 获取牌型名称
function getHandName(hand) {
    const names = {
        'nuts': '坚果',
        'set': '暗三',
        'top-two': '顶两对',
        'overpair': '超对',
        'top-pair': '顶对',
        'mid-pair': '中对',
        'nuts-draw': 'Nuts听牌',
        'draw': '听牌',
        'nothing': '空气'
    };
    return names[hand] || hand;
}

// 显示结果
function displayResult(result) {
    // 全屏警告
    if (result.fullscreen && result.warning) {
        document.getElementById('warningTitle').textContent = result.warning.title;
        document.getElementById('warningText').textContent = result.warning.text;
        document.getElementById('warningAction').textContent = result.warning.action;
        document.getElementById('warningDont').textContent = result.warning.dont;
        document.getElementById('fullscreenWarning').classList.add('show');
    }
    
    // 个人错误提醒
    const personalEl = document.getElementById('personalWarning');
    if (result.personal && result.personal.length > 0) {
        personalEl.innerHTML = result.personal.map(p => 
            `<div class="personal-warning">
                <div class="personal-warning-title">⚠️ 你的常犯错误</div>
                <div class="personal-warning-text">${p}</div>
            </div>`
        ).join('');
    } else {
        personalEl.innerHTML = '';
    }
    
    // 结果卡片
    const container = document.getElementById('resultContainer');
    container.innerHTML = result.cards.map(card => 
        `<div class="result-card result-${card.type}">
            <div class="result-title">${card.title}</div>
            <div class="result-content">${card.content}</div>
        </div>`
    ).join('');
    
    document.getElementById('resultSection').classList.add('show');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// 确认弃牌
function confirmFold() {
    document.getElementById('fullscreenWarning').classList.remove('show');
}

// 关闭警告
function closeWarning() {
    document.getElementById('fullscreenWarning').classList.remove('show');
}

// 重置
function resetAll() {
    document.getElementById('potSize').value = '50';
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-position="ip"]').classList.add('active');
    document.querySelector('[data-street="turn"]').classList.add('active');
    document.querySelector('[data-hand="top-two"]').classList.add('active');
    document.querySelector('[data-action="check"]').classList.add('active');
    document.querySelector('[data-villain="unknown"]').classList.add('active');
    document.querySelector('[data-danger="dangerous"]').classList.add('active');
    
    document.getElementById('resultSection').classList.remove('show');
    document.getElementById('continueMode').style.display = 'none';
    document.getElementById('personalWarning').innerHTML = '';
    document.getElementById('resultContainer').innerHTML = '';
    document.getElementById('fullscreenWarning').classList.remove('show'); // 关闭全屏警告
    
    state = {
        position: 'ip',
        street: 'turn',
        hand: 'top-two',
        action: 'check',
        villain: 'unknown',
        danger: 'dangerous'
    };
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
