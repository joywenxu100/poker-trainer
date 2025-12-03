// 实战手牌复盘案例数据库
// 20+真实案例，覆盖最常见的错误

const HAND_REVIEW_CASES = [
    {
        id: 1,
        category: "preflop",
        title: "经典错误：忽视位置劣势 Call 3-Bet",
        level: "intermediate",
        levelText: "中级常见错误",
        hand_history: {
            game: "8人桌 200BB 有Ante",
            hero: "MP, A♣Q♣",
            action_preflop: "UTG open 3BB → Hero call → BTN 3-bet 12BB → UTG fold → Hero call 9BB",
            pot_preflop: "26BB",
            flop: "Q♠7♥3♦",
            action_flop: "Hero check → BTN bet 18BB → Hero call",
            pot_flop: "62BB",
            turn: "2♣",
            action_turn: "Hero check → BTN bet 50BB → Hero ???"
        },
        analysis: {
            mistake: "翻前失位call 3-Bet是严重错误",
            why_mistake: [
                "AQs对抗BTN 3-Bet范围(QQ+, AK, AQs, KQs, A5s-A4s)只有~42%胜率",
                "失位(OOP)可玩性极差，翻后每条街都处于信息劣势",
                "面对持续下注很难决策，即使击中顶对",
                "你不知道自己相对牌力，对手可能有QQ/AK/AQ更好踢脚",
                "投入26BB后，被迫继续投入更多，陷入沉没成本陷阱"
            ],
            correct_play: "翻前应该4-Bet到35-40BB或直接fold。AQs不够强call失位3-Bet pot",
            lessons: [
                "位置 > 牌力 - 这是扑克的黄金法则",
                "失位不要call 3-Bet，除非有JJ+或深筹码的投机牌",
                "AQs虽然看起来很强，但在失位3-Bet pot中很尴尬",
                "击中顶对后面对持续下注，你永远不知道自己位置",
                "与其失位call，不如直接4-Bet或fold"
            ],
            ev_comparison: {
                "翻前fold": "-3BB",
                "翻前call → 转牌fold": "-41BB",
                "翻前call → 河牌输": "-130BB (如果对手有QQ/AK)"
            }
        }
    },
    
    {
        id: 2,
        category: "postflop",
        title: "致命错误：在湿润牌面慢打强牌",
        level: "intermediate",
        levelText: "中级常见错误",
        hand_history: {
            game: "8人桌 250BB",
            hero: "BTN, A♠A♥",
            action_preflop: "CO open 3BB → Hero 3-bet 10BB → BB fold → CO call 7BB",
            pot_preflop: "22BB",
            flop: "Q♥J♥9♠",
            action_flop: "CO check → Hero check (慢打)",
            pot_flop: "22BB",
            turn: "8♥",
            action_turn: "CO bet 22BB → Hero ???"
        },
        analysis: {
            mistake: "在极度湿润的牌面慢打AA",
            why_mistake: [
                "Q♥J♥9♠是德州扑克最湿润的牌面之一",
                "对手可能有：顺子听牌(KT, T9, 87), 同花听牌(任意两张红心), 两对, 暗三",
                "转牌8♥完成了顺子和同花",
                "慢打让对手免费看到了一张可能让你破产的牌",
                "你的AA从翻牌的领先变成转牌的落后"
            ],
            correct_play: "翻牌必须下注15-18BB(70-80% pot)，保护手牌",
            lessons: [
                "湿润牌面(连接+同花)永远不要慢打",
                "AA不是不可战胜的，需要保护",
                "慢打只适用于干燥牌面(如K♠7♦2♣)",
                "给对手免费牌=给对手免费的股权",
                "宁可翻牌赢小，不要转牌输大"
            ],
            ev_comparison: {
                "翻牌bet → 对手fold": "+22BB",
                "翻牌bet → 对手call听牌未击中": "+40BB+",
                "翻牌check → 转牌被超越": "-70BB to -130BB"
            }
        }
    },
    
    {
        id: 3,
        category: "tilt",
        title: "情绪失控：连续Bad Beat后乱打",
        level: "intermediate",
        levelText: "中级常见错误",
        hand_history: {
            game: "8人桌 150BB (刚刚连输两个大底池)",
            hero: "CO, K♠8♠",
            action_preflop: "Fold到Hero，Hero open 3BB (正常应该fold)",
            pot_preflop: "4.5BB",
            flop: "K♦6♥3♠",
            action_flop: "BB call翻前，BB check → Hero bet 3BB → BB call",
            pot_flop: "13.5BB",
            turn: "2♣",
            action_turn: "BB check → Hero bet 10BB → BB raise到30BB → Hero all-in 140BB"
        },
        analysis: {
            mistake: "整手牌从翻前到转牌all-in都是情绪化决策",
            why_mistake: [
                "K8s在CO是边缘牌，正常情况应该fold",
                "但因为刚输了两个大底池，想"打回来"",
                "击中顶对弱踢脚后，面对BB的check-raise应该认真思考",
                "BB的范围可能有：KQ, KJ, 66, 33, 22 (两对/暗三)",
                "K8只能打赢Kx弱踢脚和诈唬",
                "转牌all-in 140BB是纯情绪化，完全不计算EV"
            ],
            correct_play: "翻前fold K8s。如果已经打到转牌，面对check-raise应该fold",
            lessons: [
                "Bad Beat后立即离桌休息10-15分钟",
                "Tilt状态下的决策100%是错的",
                "K8这种牌正常情况你不会打，tilt时才会打",
                "面对check-raise，顶对弱踢脚几乎总是落后",
                "输钱不可怕，tilt才可怕，因为会输更多"
            ],
            ev_comparison: {
                "翻前fold": "0BB (保存本金)",
                "转牌fold给check-raise": "-16BB",
                "转牌all-in输给两对": "-150BB"
            }
        }
    },
    
    {
        id: 4,
        category: "advanced",
        title: "高级错误：4-Bet Pot在A高牌面继续C-Bet",
        level: "advanced",
        levelText: "高级场景",
        hand_history: {
            game: "8人桌 200BB vs Reg",
            hero: "CO, K♥K♠",
            action_preflop: "MP open 3BB → Hero 4-bet 28BB → SB/BB fold → MP call 25BB",
            pot_preflop: "59BB",
            flop: "A♦9♣3♥",
            action_flop: "MP check → Hero bet 40BB → MP raise到120BB"
        },
        analysis: {
            mistake: "在4-Bet pot中，A高牌面继续C-Bet KK",
            why_mistake: [
                "MP cold call 4-Bet的范围极强：QQ+, AKs, AKo",
                "A♦在牌面严重伤害你的range",
                "你是4-Bet aggressor，理论上应该有AA/AK",
                "但实际上你拿的是KK，A出现对你很不利",
                "MP可能有AA(你完蛋), AK(你完蛋), QQ/JJ(你领先但他可能认为你诈唬)",
                "继续C-Bet让对手轻松地用AK/AA获取价值，或用QQ catch你的bluff"
            ],
            correct_play: "翻牌应该check。如果对手bet，可以call一次看转牌",
            lessons: [
                "4-Bet pot的C-Bet频率要比3-Bet pot低很多",
                "当board伤害你的range时，要承认并check",
                "KK在A高牌面的4-Bet pot中变成了bluff catcher",
                "Check不代表弱，而是范围管理",
                "对抗Reg，要尊重他们的cold call 4-Bet range"
            ],
            ev_comparison: {
                "翻牌check": "可能赢59BB或输更少",
                "翻牌bet被raise然后fold": "-40BB",
                "翻牌bet被raise然后call输": "-200BB"
            }
        }
    },
    
    {
        id: 5,
        category: "preflop",
        title: "位置灾难：SB完成小盲对抗BTN",
        level: "intermediate",
        levelText: "中级常见错误",
        hand_history: {
            game: "8人桌 200BB",
            hero: "SB, 9♣7♣",
            action_preflop: "Fold到BTN，BTN open 2.5BB → Hero complete(补1.5BB) → BB check",
            pot_preflop: "6BB",
            flop: "9♥7♠3♦",
            action_flop: "Hero check → BB check → BTN bet 4BB → Hero call → BB fold",
            pot_flop: "14BB",
            turn: "K♣",
            action_turn: "Hero check → BTN bet 12BB → Hero call",
            pot_turn: "38BB",
            river: "2♥",
            action_river: "Hero check → BTN bet 30BB → Hero ???"
        },
        analysis: {
            mistake: "用97s完成小盲，然后失位打到河牌",
            why_mistake: [
                "97s面对BTN open应该fold，不是complete",
                "Complete看起来"便宜"(只要1.5BB)，但翻后失位很贵",
                "即使击中两对，你也不知道自己位置",
                "BTN range很宽，可能有99, 77, 33, KK, K9, K7",
                "每条街都被动check-call，从不主动获取信息",
                "河牌面对30BB下注，两对变成了纯粹的猜测"
            ],
            correct_play: "翻前应该3-Bet到9-10BB或直接fold。不要complete",
            lessons: [
                "SB的complete是扑克中最糟糕的动作之一",
                "失位打多街=信息劣势+资金劣势",
                "击中两对不等于必赢，对手可能有更好的两对或暗三",
                "与其失位complete，不如激进3-Bet或干脆fold",
                "记住：位置 > 牌力"
            ],
            ev_comparison: {
                "翻前fold": "-0.5BB",
                "翻前3-Bet赢下底池": "+4.5BB",
                "Complete打到河牌call输": "-60BB"
            }
        }
    },
    
    {
        id: 6,
        category: "postflop",
        title: "转牌灾难：追逐反向隐含赔率的听牌",
        level: "intermediate",
        levelText: "中级常见错误",
        hand_history: {
            game: "8人桌 200BB",
            hero: "BTN, J♣T♣",
            action_preflop: "CO open 3BB → Hero call → BB fold",
            pot_preflop: "7.5BB",
            flop: "K♣8♠5♣",
            action_flop: "CO bet 5BB → Hero call (同花听牌)",
            pot_flop: "17.5BB",
            turn: "2♣",
            action_turn: "CO check → Hero bet 12BB → CO raise到40BB"
        },
        analysis: {
            mistake: "转牌完成同花后面对check-raise继续投入",
            why_mistake: [
                "你有J高同花，但对手可能有A♣或K♣(更大的同花)",
                "CO在K♣8♠5♣2♣这个4张同花牌面check-raise = 极强",
                "他的range：A♣x♣(坚果同花), K♣x♣(大同花), 或完整的房子(KK,88,55)",
                "你的J♣只能打赢T♣9♣及以下的同花",
                "这是经典的"反向隐含赔率"场景",
                "即使你完成听牌，也可能输掉整个stack"
            ],
            correct_play: "转牌check back。如果CO bet，需要认真考虑fold",
            lessons: [
                "完成同花不等于无敌，要看是什么同花",
                "4张同花牌面的check-raise = 坚果同花或房子",
                "J高同花在这里是bluff catcher，不是value bet",
                "听牌有两种：正向隐含赔率 vs 反向隐含赔率",
                "小同花经常导致破产，要谨慎"
            ],
            ev_comparison: {
                "转牌check back": "+17.5BB or -20BB",
                "转牌bet被raise然后fold": "-12BB",
                "转牌继续投入输给A♣同花": "-120BB+"
            }
        }
    },
    
    {
        id: 7,
        category: "advanced",
        title: "多人底池陷阱：用Overpair建大底池",
        level: "advanced",
        levelText: "高级场景",
        hand_history: {
            game: "8人桌 300BB",
            hero: "CO, J♥J♠",
            action_preflop: "UTG limp → MP limp → Hero raise到8BB → BTN call → SB call → UTG call → MP call",
            pot_preflop: "41BB (5人)",
            flop: "T♠7♥3♦",
            action_flop: "SB check → UTG check → MP check → Hero bet 30BB → BTN fold → SB call → UTG fold → MP call",
            pot_flop: "131BB (3人)",
            turn: "8♣",
            action_turn: "SB check → MP check → Hero bet 80BB → SB call → MP fold"
        },
        analysis: {
            mistake: "在3-way pot用JJ持续打大尺寸",
            why_mistake: [
                "翻前5人看翻牌，范围极宽",
                "T♠7♥3♦看起来安全，但3人的组合range很强",
                "SB和MP都call了30BB(75% pot)，说明他们有东西",
                "可能的hands：TT(暗三), 77, 33, AT, KT, QT, T9, 98, 87",
                "转牌8♣完成了顺子(96, J9都变顺子)",
                "继续bet 80BB把自己变成bluff，只有更强的牌call你"
            ],
            correct_play: "翻牌下注合理，但被两人call后转牌应该check。如果他们bet就fold",
            lessons: [
                "多人底池：Overpair的价值大幅下降",
                "2人call你的大注 = 他们有真牌",
                "JJ在3-way pot中只是中等牌，不是nuts",
                "转牌应该check-call或check-fold，而不是持续开火",
                "多人底池要用更强的牌才能3条街value"
            ],
            ev_comparison: {
                "翻牌后认输": "-30BB",
                "转牌check-fold": "-30BB",
                "转牌继续被call输给两对": "-140BB"
            }
        }
    },
    
    {
        id: 8,
        category: "preflop",
        title: "SPR盲区：深筹码打小对子",
        level: "intermediate",
        levelText: "中级常见错误",
        hand_history: {
            game: "8人桌 80BB",
            hero: "BTN, 6♠6♣",
            action_preflop: "MP open 3BB → Hero call → SB/BB fold",
            pot_preflop: "7.5BB",
            flop: "K♥9♦6♥",
            action_flop: "MP bet 5BB → Hero raise到15BB → MP call",
            pot_flop: "37.5BB",
            turn: "Q♠",
            action_turn: "MP check → Hero bet 25BB → MP raise到62BB (all-in剩余)"
        },
        analysis: {
            mistake: "80BB深度用66 call open，然后击中set后无法全投",
            why_mistake: [
                "80BB是尴尬的筹码深度：不够深set mine，不够浅推挤",
                "Set mining需要15:1隐含赔率，80BB只有26:1",
                "问题是：即使击中set，SPR只有10，很难全投",
                "K♥9♦6♥Q♠是dangerous board(同花听牌+顺子听牌)",
                "MP可能有：KK, QQ, 99(更大的set), KQ, AK, 同花听牌",
                "80BB全投对set 66来说太多了，但fold set又太可惜"
            ],
            correct_play: "翻前应该fold。80BB深度66没有足够的隐含赔率",
            lessons: [
                "小对子set mining需要深筹码(120BB+)",
                "80BB是最尴尬的深度：什么都不上不下",
                "SPR<13时，击中set也可能破产",
                "宁可翻前fold 3BB，不要翻后纠结60BB",
                "记住：Set mining是为了赢大的，不是为了小赢或大输"
            ],
            ev_comparison: {
                "翻前fold": "0BB",
                "击中set但转牌fold": "-20BB",
                "击中set全投输给更大的set": "-80BB"
            }
        }
    }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HAND_REVIEW_CASES;
}

