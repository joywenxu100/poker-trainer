// 漏洞评估系统 - 精准定位你的问题
// 目标：0失误
// 版本: 1.0.0

// ==================== 评估题库 ====================
const ASSESSMENT_QUESTIONS = [
    // ========== 第一部分：翻前决策 ==========
    {
        id: 1,
        category: "翻前决策",
        subcategory: "位置意识",
        difficulty: "基础",
        scenario: "8人桌，有效筹码100BB。你在UTG，拿到AJo。",
        question: "你应该怎么做？",
        options: [
            { text: "Open raise 2.5BB", leakTag: null },
            { text: "Open raise 3BB", leakTag: null },
            { text: "Fold", leakTag: null },
            { text: "Limp", leakTag: "limp_utg" }
        ],
        correctIndex: 2,
        explanation: "🧠 AJo在UTG是边缘牌：\n\n• UTG需要最紧的范围（约15%）\n• AJo是dominated hand（被AK、AQ支配）\n• 被3bet后非常尴尬\n• 多人底池可玩性差\n\n✅ 正确：Fold\n\n⚠️ AJs可以open，但AJo在UTG太边缘",
        leakIfWrong: {
            0: { tag: "utg_too_loose", desc: "UTG打得太松", weight: 3 },
            1: { tag: "utg_too_loose", desc: "UTG打得太松", weight: 3 },
            3: { tag: "limp_utg", desc: "UTG limp是严重漏洞", weight: 5 }
        }
    },
    {
        id: 2,
        category: "翻前决策",
        subcategory: "3bet应对",
        difficulty: "中级",
        scenario: "你在CO open 2.5BB，BTN 3bet到8BB。你拿到77。有效筹码80BB。",
        question: "你应该怎么做？",
        options: [
            { text: "Call" },
            { text: "4bet to 20BB" },
            { text: "Fold" },
            { text: "All-in" }
        ],
        correctIndex: 2,
        explanation: "🧠 77面对3bet的决策：\n\n• 80BB有效筹码，SPR会很低\n• Set mining需要约15:1隐含赔率\n• 这里只有10:1（80/8），不够\n• 4bet没有意义（77不是4bet牌）\n\n✅ 正确：Fold\n\n💡 如果是150BB+深筹码，可以考虑call set mine",
        leakIfWrong: {
            0: { tag: "call_low_spr", desc: "不考虑SPR盲目call", weight: 4 },
            1: { tag: "4bet_small_pair", desc: "用小对子4bet", weight: 5 },
            3: { tag: "overplay_small_pair", desc: "过度高估小对子", weight: 5 }
        }
    },
    {
        id: 3,
        category: "翻前决策",
        subcategory: "squeeze识别",
        difficulty: "高级",
        scenario: "CO open 2.5BB，BTN call。你在SB拿到AQs。有效筹码100BB。",
        question: "你应该怎么做？",
        options: [
            { text: "Call" },
            { text: "3bet to 12BB (squeeze)" },
            { text: "Fold" },
            { text: "3bet to 8BB" }
        ],
        correctIndex: 1,
        explanation: "🧠 这是完美的squeeze spot：\n\n• AQs是强牌\n• CO open范围宽，BTN flat范围更宽\n• 你的3bet会让BTN很尴尬（他夹在中间）\n• 大sizing（12BB）增加fold equity\n\n✅ 正确：3bet to 12BB\n\n⚠️ 3bet太小（8BB）给对手好价格\n❌ Flat会让你OOP进入多人底池",
        leakIfWrong: {
            0: { tag: "miss_squeeze", desc: "错过squeeze机会", weight: 3 },
            2: { tag: "fold_strong_hand", desc: "用强牌fold", weight: 4 },
            3: { tag: "sizing_too_small", desc: "3bet sizing太小", weight: 2 }
        }
    },
    {
        id: 4,
        category: "翻前决策",
        subcategory: "盲注战",
        difficulty: "中级",
        scenario: "所有人fold到你，你在SB拿到K7o。BB是紧凶玩家（VPIP 18%）。",
        question: "你应该怎么做？",
        options: [
            { text: "Raise to 2.5BB" },
            { text: "Raise to 3BB" },
            { text: "Fold" },
            { text: "Limp" }
        ],
        correctIndex: 2,
        explanation: "🧠 vs 紧凶BB的SB策略：\n\n• 紧凶玩家会3bet或fold\n• K7o被3bet后必须fold\n• 即使他call，你OOP用弱K很难打\n• 这是-EV的steal尝试\n\n✅ 正确：Fold\n\n💡 vs 松被动BB可以偷，vs 紧凶需要更好的牌",
        leakIfWrong: {
            0: { tag: "sb_too_loose", desc: "SB偷盲范围太宽", weight: 2 },
            1: { tag: "sb_too_loose", desc: "SB偷盲范围太宽", weight: 2 },
            3: { tag: "limp_sb", desc: "SB limp是漏洞", weight: 3 }
        }
    },

    // ========== 第二部分：翻后决策 ==========
    {
        id: 5,
        category: "翻后决策",
        subcategory: "C-bet决策",
        difficulty: "中级",
        scenario: "你在CO open，只有BB call。\nFlop: J♥7♠2♣\n你拿到AKo（没击中）。BB check。",
        question: "你应该怎么做？",
        options: [
            { text: "Check" },
            { text: "Bet 33% pot" },
            { text: "Bet 66% pot" },
            { text: "Bet 100% pot" }
        ],
        correctIndex: 1,
        explanation: "🧠 Dry board c-bet策略：\n\n• Board干燥，对手错过很多\n• AK有6个overcard outs\n• 小bet就能达到目的\n• 高频小bet是现代策略\n\n✅ 正确：Bet 33% pot\n\n⚠️ 过大的bet在dry board是浪费\n❌ Check放弃了fold equity",
        leakIfWrong: {
            0: { tag: "miss_cbet", desc: "放弃有利c-bet机会", weight: 3 },
            2: { tag: "cbet_too_big", desc: "C-bet sizing太大", weight: 2 },
            3: { tag: "cbet_too_big", desc: "C-bet sizing太大", weight: 3 }
        }
    },
    {
        id: 6,
        category: "翻后决策",
        subcategory: "湿润牌面",
        difficulty: "高级",
        scenario: "你在BTN open，BB call。\nFlop: 9♥8♥7♠\n你拿到AA（红心）。BB check。Pot: 6BB。",
        question: "你应该怎么做？",
        options: [
            { text: "Check" },
            { text: "Bet 2BB (33%)" },
            { text: "Bet 5BB (80%)" },
            { text: "Bet 7BB (overbet)" }
        ],
        correctIndex: 2,
        explanation: "🧠 危险湿润board的AA：\n\n• 这个board对BB非常有利\n• 很多顺子、两对、听牌\n• AA必须保护，但也要接受被打败\n• 大bet让听牌付出代价\n\n✅ 正确：Bet 80% pot\n\n⚠️ 小bet让所有听牌便宜看牌\n❌ Check太被动，放弃底池控制",
        leakIfWrong: {
            0: { tag: "passive_strong_hand", desc: "强牌打得太被动", weight: 4 },
            1: { tag: "underbet_wet", desc: "湿润board下注太小", weight: 3 },
            3: { tag: "overbet_wrong_spot", desc: "错误使用overbet", weight: 2 }
        }
    },
    {
        id: 7,
        category: "翻后决策",
        subcategory: "转牌决策",
        difficulty: "高级",
        scenario: "翻牌你c-bet被call。\nBoard: K♠9♥4♣ → T♥ (转牌)\n你拿到QJo（空气牌，有顺子听牌）。对手check。Pot: 12BB。",
        question: "你应该怎么做？",
        options: [
            { text: "Check" },
            { text: "Bet 4BB (33%)" },
            { text: "Bet 9BB (75%)" },
            { text: "All-in" }
        ],
        correctIndex: 2,
        explanation: "🧠 半诈唬转牌barrel：\n\n• 你有8 outs顺子听牌（任何A或8）\n• 转牌T给你额外equity\n• 对手很多Kx会fold第二枪\n• 这是经典的semi-bluff spot\n\n✅ 正确：Bet 75% pot\n\n⚠️ Check放弃fold equity和build pot\n❌ 小bet没有足够压力",
        leakIfWrong: {
            0: { tag: "miss_barrel", desc: "错过半诈唬机会", weight: 3 },
            1: { tag: "barrel_too_small", desc: "诈唬sizing太小", weight: 2 },
            3: { tag: "overplay_draw", desc: "过度激进的听牌打法", weight: 3 }
        }
    },
    {
        id: 8,
        category: "翻后决策",
        subcategory: "河牌价值",
        difficulty: "中级",
        scenario: "河牌board: A♠K♥7♣4♦2♠\n你拿到AQo。对手全程check-call。Pot: 40BB。对手check。",
        question: "你应该下多少？",
        options: [
            { text: "Check back" },
            { text: "Bet 15BB (37%)" },
            { text: "Bet 30BB (75%)" },
            { text: "Bet 50BB (125%)" }
        ],
        correctIndex: 2,
        explanation: "🧠 河牌价值下注：\n\n• 你有顶对+好kicker\n• 对手check-call说明有牌（可能弱A、Kx）\n• 他的range能call的牌很多\n• 75% pot是标准value size\n\n✅ 正确：Bet 75% pot\n\n⚠️ Check back损失价值\n❌ Overbet可能吓跑中等牌",
        leakIfWrong: {
            0: { tag: "miss_value", desc: "错过价值下注机会", weight: 4 },
            1: { tag: "thin_value_small", desc: "价值bet sizing太小", weight: 2 },
            3: { tag: "overbet_value", desc: "价值bet过大吓跑对手", weight: 2 }
        }
    },
    {
        id: 9,
        category: "翻后决策",
        subcategory: "河牌诈唬",
        difficulty: "高级",
        scenario: "你3bet pot。\nBoard: K♠Q♥8♣5♦3♠\n你拿到A♠5♠（错过同花，只有弱对子）。Pot: 50BB。对手check。",
        question: "你应该怎么做？",
        options: [
            { text: "Check back（showdown value）" },
            { text: "Bet 15BB (30%)" },
            { text: "Bet 40BB (80%)" },
            { text: "All-in 80BB" }
        ],
        correctIndex: 0,
        explanation: "🧠 边缘牌的河牌决策：\n\n• 你有一个小对子（55）\n• 这个牌有showdown value\n• 下注会把自己变成bluff\n• 更差的牌fold，更好的牌call\n\n✅ 正确：Check back\n\n⚠️ 下注是\"自我价值切割\"的典型错误",
        leakIfWrong: {
            1: { tag: "turn_value_to_bluff", desc: "把showdown value变成bluff", weight: 4 },
            2: { tag: "turn_value_to_bluff", desc: "把showdown value变成bluff", weight: 4 },
            3: { tag: "turn_value_to_bluff", desc: "把showdown value变成bluff", weight: 5 }
        }
    },

    // ========== 第三部分：数学计算 ==========
    {
        id: 10,
        category: "数学计算",
        subcategory: "底池赔率",
        difficulty: "基础",
        scenario: "河牌。Pot: 100BB。对手bet 50BB。你有bluff catcher。",
        question: "你需要多少胜率才能盈利call？",
        options: [
            { text: "25%" },
            { text: "33%" },
            { text: "40%" },
            { text: "50%" }
        ],
        correctIndex: 0,
        explanation: "🧠 底池赔率计算：\n\n• Call 50BB 来赢 200BB (100+50+50)\n• 所需胜率 = 50 / 200 = 25%\n\n💡 公式：Call / (Pot + Bet + Call)\n\n✅ 正确：25%",
        leakIfWrong: {
            1: { tag: "pot_odds_error", desc: "底池赔率计算错误", weight: 4 },
            2: { tag: "pot_odds_error", desc: "底池赔率计算错误", weight: 4 },
            3: { tag: "pot_odds_error", desc: "底池赔率计算错误", weight: 4 }
        }
    },
    {
        id: 11,
        category: "数学计算",
        subcategory: "Outs计算",
        difficulty: "基础",
        scenario: "翻牌。你有A♥K♥。Board: Q♥7♥2♣。",
        question: "你有多少outs？翻牌到河牌大约多少胜率？",
        options: [
            { text: "9 outs，约35%" },
            { text: "12 outs，约45%" },
            { text: "15 outs，约54%" },
            { text: "6 outs，约24%" }
        ],
        correctIndex: 2,
        explanation: "🧠 Outs计算：\n\n• 同花：9 outs（剩余9张♥）\n• Overcard A：3 outs\n• Overcard K：3 outs\n• 总共：15 outs\n\n💡 快速估算：15 × 4 = 60%（实际约54%，rule of 4有误差）\n\n✅ 正确：15 outs，约54%",
        leakIfWrong: {
            0: { tag: "outs_undercount", desc: "Outs计算不完整", weight: 3 },
            1: { tag: "outs_undercount", desc: "Outs计算不完整", weight: 2 },
            3: { tag: "outs_undercount", desc: "Outs计算不完整", weight: 4 }
        }
    },
    {
        id: 12,
        category: "数学计算",
        subcategory: "MDF",
        difficulty: "中级",
        scenario: "河牌。对手bet pot (100BB into 100BB)。",
        question: "根据MDF，你应该defend多少范围？",
        options: [
            { text: "33%" },
            { text: "50%" },
            { text: "67%" },
            { text: "75%" }
        ],
        correctIndex: 1,
        explanation: "🧠 MDF计算：\n\n• MDF = 1 - Bet/(Pot+Bet)\n• MDF = 1 - 100/200 = 50%\n\n💡 意义：如果你fold超过50%，对手任何bluff都盈利\n\n✅ 正确：50%\n\n⚠️ 这是理论值，实战要根据对手调整",
        leakIfWrong: {
            0: { tag: "mdf_error", desc: "MDF计算错误", weight: 3 },
            2: { tag: "mdf_error", desc: "MDF计算错误", weight: 3 },
            3: { tag: "mdf_error", desc: "MDF计算错误", weight: 3 }
        }
    },
    {
        id: 13,
        category: "数学计算",
        subcategory: "Combo计数",
        difficulty: "高级",
        scenario: "Board: A♠K♥7♣。对手3bet范围是QQ+/AK。",
        question: "对手有多少个combo能打败你的AQ？",
        options: [
            { text: "12 combos (AA, KK, AK)" },
            { text: "15 combos (AA, KK, AK)" },
            { text: "18 combos (QQ, AA, KK, AK)" },
            { text: "21 combos (QQ+, AK)" }
        ],
        correctIndex: 1,
        explanation: "🧠 Combo计算：\n\n• AA：board有A♠，剩余3张A，3C2=3 combos\n• KK：board有K♥，剩余3张K，3C2=3 combos\n• AK：board有A♠K♥，剩余3A×3K=9 combos\n• QQ：不能打败AQ（你也有对A）\n\n总共：3+3+9=15 combos\n\n✅ 正确：15 combos",
        leakIfWrong: {
            0: { tag: "combo_error", desc: "Combo计算错误，忘记board blocker", weight: 3 },
            2: { tag: "combo_error", desc: "QQ不能打败对A", weight: 3 },
            3: { tag: "combo_error", desc: "没考虑board blocker", weight: 4 }
        }
    },

    // ========== 第四部分：对手分析 ==========
    {
        id: 14,
        category: "对手分析",
        subcategory: "类型识别",
        difficulty: "中级",
        scenario: "对手数据：VPIP 45%, PFR 8%, 3bet 2%",
        question: "这是什么类型的玩家？应该怎么调整？",
        options: [
            { text: "鱼/跟注站 - 多value bet，少bluff" },
            { text: "LAG - 设陷阱，多call down" },
            { text: "Nit - 多偷盲，避免大底池" },
            { text: "TAG - 按标准GTO打" }
        ],
        correctIndex: 0,
        explanation: "🧠 数据分析：\n\n• VPIP 45%：非常松（入池率高）\n• PFR 8%：非常被动（很少主动加注）\n• 3bet 2%：几乎只用坚果3bet\n\n🐟 这是典型的鱼/跟注站\n\n✅ 正确策略：\n• 多value bet（他们会用弱牌call）\n• 少bluff（他们不fold）\n• 扩大value范围",
        leakIfWrong: {
            1: { tag: "player_type_error", desc: "对手类型识别错误", weight: 3 },
            2: { tag: "player_type_error", desc: "对手类型识别错误", weight: 3 },
            3: { tag: "player_type_error", desc: "对手类型识别错误", weight: 3 }
        }
    },
    {
        id: 15,
        category: "对手分析",
        subcategory: "剥削调整",
        difficulty: "高级",
        scenario: "对手是Nit（VPIP 12%, Fold to 3bet 80%）。你在BTN，他在CO open。",
        question: "你拿到T9s，最佳策略是？",
        options: [
            { text: "Fold - T9s不够强" },
            { text: "Call - 有位置，可以打翻后" },
            { text: "3bet to 8BB - 剥削他的高fold率" },
            { text: "3bet all-in - 最大化fold equity" }
        ],
        correctIndex: 2,
        explanation: "🧠 vs Nit的剥削：\n\n• 他fold to 3bet 80%！\n• 这意味着你的3bet bluff几乎总是赢\n• T9s作为3bet bluff有很好的playability\n• 即使他call，你有位置+好牌\n\n✅ 正确：3bet to 8BB\n\n💡 这是印钞机般的spot，必须剥削",
        leakIfWrong: {
            0: { tag: "miss_exploit", desc: "错过明显剥削机会", weight: 4 },
            1: { tag: "miss_exploit", desc: "不敢3bet bluff", weight: 3 },
            3: { tag: "overaggressive_exploit", desc: "剥削时过度激进", weight: 3 }
        }
    },
    {
        id: 16,
        category: "对手分析",
        subcategory: "Tilt识别",
        difficulty: "中级",
        scenario: "对手刚刚被bad beat输了一个大底池。下一手他在UTG open 5BB（平常是2.5BB）。",
        question: "这说明什么？你应该怎么调整？",
        options: [
            { text: "他拿到好牌了，fold更多" },
            { text: "他可能tilt，用强牌trap他" },
            { text: "没什么，按正常打" },
            { text: "他bluff，用任何牌3bet" }
        ],
        correctIndex: 1,
        explanation: "🧠 Tilt信号分析：\n\n• Bad beat后立刻open大\n• 这是典型的tilt行为\n• 他可能用更宽的范围+更大的sizing\n• 目的是\"赢回来\"\n\n✅ 正确策略：\n• 等待强牌\n• 用强牌给他action\n• 不要bluff他（tilting player会call）\n• 让他把筹码送给你",
        leakIfWrong: {
            0: { tag: "miss_tilt_read", desc: "没识别出对手tilt", weight: 3 },
            2: { tag: "ignore_opponent_state", desc: "忽略对手状态变化", weight: 3 },
            3: { tag: "bluff_tilter", desc: "尝试bluff tilting玩家", weight: 4 }
        }
    },

    // ========== 第五部分：心态管理 ==========
    {
        id: 17,
        category: "心态管理",
        subcategory: "自我识别",
        difficulty: "基础",
        scenario: "你今天已经输了3个buy-in。你发现自己开始用更宽的范围call对手的3bet。",
        question: "你应该怎么做？",
        options: [
            { text: "继续打，用技术赢回来" },
            { text: "认识到自己在tilt，立即休息或下桌" },
            { text: "换到更低级别继续打" },
            { text: "提高激进度，用bluff赢回来" }
        ],
        correctIndex: 1,
        explanation: "🧠 Tilt自我识别：\n\n• 输钱后范围变宽是典型tilt症状\n• \"想赢回来\"的心态会导致更多损失\n• 继续打只会越输越多\n\n✅ 正确：立即休息或下桌\n\n💡 保护资金比单session输赢重要\n⚠️ 换低级别打也是错误（tilt在任何级别都会输）",
        leakIfWrong: {
            0: { tag: "tilt_unawareness", desc: "不认识自己的tilt状态", weight: 5 },
            2: { tag: "tilt_unawareness", desc: "以为换级别能解决tilt", weight: 4 },
            3: { tag: "tilt_revenge", desc: "想用激进打法\"赢回来\"", weight: 5 }
        }
    },
    {
        id: 18,
        category: "心态管理",
        subcategory: "session管理",
        difficulty: "中级",
        scenario: "你今天状态非常好，已经赢了5个buy-in。但你打了6小时，开始感到有点累。",
        question: "你应该怎么做？",
        options: [
            { text: "趁热打铁继续，今天运气好" },
            { text: "休息15分钟然后继续" },
            { text: "停止session，保护胜利果实" },
            { text: "再打1小时看情况" }
        ],
        correctIndex: 2,
        explanation: "🧠 Session管理原则：\n\n• 6小时已经很长，疲劳会影响决策\n• 赢5个buy-in是非常好的结果\n• 疲劳时继续打会把赢的钱还回去\n• \"运气好\"是赌徒心态\n\n✅ 正确：停止session\n\n💡 格言：在状态好时结束，而不是被迫结束",
        leakIfWrong: {
            0: { tag: "session_too_long", desc: "Session过长不知道停", weight: 4 },
            1: { tag: "session_too_long", desc: "低估疲劳影响", weight: 3 },
            3: { tag: "session_too_long", desc: "不尊重疲劳信号", weight: 3 }
        }
    },

    // ========== 第六部分：特殊情况 ==========
    {
        id: 19,
        category: "特殊情况",
        subcategory: "多人底池",
        difficulty: "高级",
        scenario: "你在CO open，BTN和BB都call。\nFlop: T♥7♣4♠\n你拿到KK。BB check。Pot: 9BB。",
        question: "你应该怎么做？",
        options: [
            { text: "Check（多人底池要谨慎）" },
            { text: "Bet 3BB (33%)" },
            { text: "Bet 7BB (75%)" },
            { text: "Bet 10BB (overbet)" }
        ],
        correctIndex: 1,
        explanation: "🧠 多人底池overpair策略：\n\n• KK是overpair，但多人底池要小心\n• 小bet可以获取value+保护\n• 大bet风险太高（可能已经被打败）\n• Check太被动，board会变危险\n\n✅ 正确：Bet 33%\n\n💡 多人底池=更紧的价值范围+更小的sizing",
        leakIfWrong: {
            0: { tag: "passive_multiway", desc: "多人底池过于被动", weight: 3 },
            2: { tag: "overbet_multiway", desc: "多人底池下注太大", weight: 3 },
            3: { tag: "overbet_multiway", desc: "多人底池下注太大", weight: 4 }
        }
    },
    {
        id: 20,
        category: "特殊情况",
        subcategory: "深筹码",
        difficulty: "高级",
        scenario: "有效筹码200BB。你在BTN open，BB（TAG）call。\nFlop: 6♠5♠4♣\n你拿到A♠A♥。BB check。Pot: 5BB。",
        question: "你应该怎么做？",
        options: [
            { text: "Check（board太危险）" },
            { text: "Bet 1.5BB (30%)" },
            { text: "Bet 4BB (80%)" },
            { text: "Bet 6BB (overbet)" }
        ],
        correctIndex: 2,
        explanation: "🧠 深筹码危险board的AA：\n\n• 这个board完成了很多顺子和听牌\n• AA仍然是最强的overpair\n• 深筹码意味着隐含赔率对两边都高\n• 你需要大bet保护+建立底池\n\n✅ 正确：Bet 80%\n\n💡 深筹码更要保护强牌，不要让对手便宜看牌\n⚠️ 但要准备好被raise时做决定",
        leakIfWrong: {
            0: { tag: "scared_money", desc: "拿强牌太害怕", weight: 4 },
            1: { tag: "underbet_danger", desc: "危险board下注太小", weight: 3 },
            3: { tag: "overbet_wrong", desc: "这里overbet不合适", weight: 2 }
        }
    }
];

// ==================== 漏洞分类定义 ====================
const LEAK_CATEGORIES = {
    preflop: {
        name: "翻前漏洞",
        leaks: {
            utg_too_loose: { name: "UTG太松", severity: "高", training: "mistakes" },
            limp_utg: { name: "UTG limp", severity: "严重", training: "mistakes" },
            call_low_spr: { name: "低SPR盲目call", severity: "高", training: "math" },
            "4bet_small_pair": { name: "小对子4bet", severity: "高", training: "mistakes" },
            overplay_small_pair: { name: "高估小对子", severity: "高", training: "mistakes" },
            miss_squeeze: { name: "错过squeeze", severity: "中", training: "planning" },
            fold_strong_hand: { name: "强牌过度fold", severity: "高", training: "mistakes" },
            sizing_too_small: { name: "3bet sizing太小", severity: "中", training: "sizing" },
            sb_too_loose: { name: "SB偷盲太宽", severity: "中", training: "mistakes" },
            limp_sb: { name: "SB limp", severity: "中", training: "mistakes" }
        }
    },
    postflop: {
        name: "翻后漏洞",
        leaks: {
            miss_cbet: { name: "放弃有利c-bet", severity: "中", training: "sizing" },
            cbet_too_big: { name: "C-bet太大", severity: "中", training: "sizing" },
            passive_strong_hand: { name: "强牌太被动", severity: "高", training: "mistakes" },
            underbet_wet: { name: "湿润board下注小", severity: "高", training: "sizing" },
            overbet_wrong_spot: { name: "错误overbet", severity: "中", training: "sizing" },
            miss_barrel: { name: "错过半诈唬", severity: "中", training: "planning" },
            barrel_too_small: { name: "诈唬sizing太小", severity: "中", training: "sizing" },
            overplay_draw: { name: "听牌过度激进", severity: "中", training: "mistakes" },
            miss_value: { name: "错过价值bet", severity: "高", training: "mistakes" },
            thin_value_small: { name: "薄价值sizing小", severity: "中", training: "sizing" },
            overbet_value: { name: "价值bet太大", severity: "中", training: "sizing" },
            turn_value_to_bluff: { name: "有牌变诈唬", severity: "严重", training: "mistakes" }
        }
    },
    math: {
        name: "数学漏洞",
        leaks: {
            pot_odds_error: { name: "底池赔率错误", severity: "严重", training: "math" },
            outs_undercount: { name: "Outs计算错误", severity: "高", training: "math" },
            mdf_error: { name: "MDF计算错误", severity: "高", training: "math" },
            combo_error: { name: "Combo计算错误", severity: "高", training: "math" }
        }
    },
    reads: {
        name: "读牌漏洞",
        leaks: {
            player_type_error: { name: "对手类型误判", severity: "高", training: "mistakes" },
            miss_exploit: { name: "错过剥削机会", severity: "高", training: "planning" },
            overaggressive_exploit: { name: "剥削过度激进", severity: "中", training: "mistakes" },
            miss_tilt_read: { name: "没读出tilt", severity: "中", training: "tilt" },
            ignore_opponent_state: { name: "忽略对手状态", severity: "中", training: "tilt" },
            bluff_tilter: { name: "诈唬tilter", severity: "高", training: "mistakes" }
        }
    },
    mental: {
        name: "心态漏洞",
        leaks: {
            tilt_unawareness: { name: "不识别自己tilt", severity: "严重", training: "tilt" },
            tilt_revenge: { name: "复仇心态", severity: "严重", training: "tilt" },
            session_too_long: { name: "session过长", severity: "高", training: "tilt" },
            scared_money: { name: "拿强牌怕", severity: "高", training: "mistakes" }
        }
    },
    special: {
        name: "特殊场景漏洞",
        leaks: {
            passive_multiway: { name: "多人底池被动", severity: "中", training: "planning" },
            overbet_multiway: { name: "多人底池bet大", severity: "高", training: "sizing" },
            underbet_danger: { name: "危险board bet小", severity: "高", training: "sizing" },
            overbet_wrong: { name: "错误overbet", severity: "中", training: "sizing" }
        }
    }
};

// ==================== 评估结果模板 ====================
const ASSESSMENT_LEVELS = [
    { minScore: 90, level: "🏆 世界顶级", desc: "几乎无漏洞，保持这个水平！", color: "#ffd700" },
    { minScore: 80, level: "💎 职业水准", desc: "漏洞较少，针对性修补即可", color: "#00d4ff" },
    { minScore: 70, level: "⭐ 进阶玩家", desc: "存在一些漏洞，需要系统训练", color: "#6bcb77" },
    { minScore: 60, level: "📈 有潜力", desc: "漏洞较多，但基础在", color: "#ffa41b" },
    { minScore: 0, level: "🎯 需要努力", desc: "漏洞明显，建议从基础开始", color: "#ff6b6b" }
];

// ==================== 全局评估状态 ====================
let assessmentState = {
    currentQuestion: 0,
    answers: [],
    leaksFound: {},
    startTime: null,
    endTime: null
};

// ==================== 评估函数 ====================

// 开始评估
function startAssessment() {
    assessmentState = {
        currentQuestion: 0,
        answers: [],
        leaksFound: {},
        startTime: Date.now(),
        endTime: null
    };
    return ASSESSMENT_QUESTIONS[0];
}

// 提交答案
function submitAnswer(questionId, selectedIndex) {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === questionId);
    const isCorrect = selectedIndex === question.correctIndex;
    
    assessmentState.answers.push({
        questionId,
        selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
        category: question.category
    });
    
    // 如果答错，记录漏洞
    if (!isCorrect && question.leakIfWrong && question.leakIfWrong[selectedIndex]) {
        const leak = question.leakIfWrong[selectedIndex];
        if (!assessmentState.leaksFound[leak.tag]) {
            assessmentState.leaksFound[leak.tag] = {
                count: 0,
                weight: 0,
                desc: leak.desc,
                questions: []
            };
        }
        assessmentState.leaksFound[leak.tag].count++;
        assessmentState.leaksFound[leak.tag].weight += leak.weight;
        assessmentState.leaksFound[leak.tag].questions.push(questionId);
    }
    
    assessmentState.currentQuestion++;
    
    if (assessmentState.currentQuestion >= ASSESSMENT_QUESTIONS.length) {
        assessmentState.endTime = Date.now();
        return { finished: true, result: generateReport() };
    }
    
    return { 
        finished: false, 
        nextQuestion: ASSESSMENT_QUESTIONS[assessmentState.currentQuestion],
        isCorrect,
        explanation: question.explanation
    };
}

// 生成评估报告
function generateReport() {
    const totalQuestions = ASSESSMENT_QUESTIONS.length;
    const correctCount = assessmentState.answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // 计算各维度得分
    const categoryScores = {};
    const categories = [...new Set(ASSESSMENT_QUESTIONS.map(q => q.category))];
    
    categories.forEach(cat => {
        const catQuestions = assessmentState.answers.filter(a => {
            const q = ASSESSMENT_QUESTIONS.find(x => x.id === a.questionId);
            return q.category === cat;
        });
        const catCorrect = catQuestions.filter(a => a.isCorrect).length;
        categoryScores[cat] = {
            total: catQuestions.length,
            correct: catCorrect,
            score: Math.round((catCorrect / catQuestions.length) * 100)
        };
    });
    
    // 整理漏洞列表
    const leaksList = Object.entries(assessmentState.leaksFound)
        .map(([tag, data]) => ({
            tag,
            ...data,
            ...findLeakInfo(tag)
        }))
        .sort((a, b) => b.weight - a.weight);
    
    // 确定等级
    const level = ASSESSMENT_LEVELS.find(l => score >= l.minScore);
    
    // 生成训练建议
    const trainingRecommendations = generateTrainingRecommendations(leaksList);
    
    return {
        score,
        correctCount,
        totalQuestions,
        level,
        categoryScores,
        leaksList,
        trainingRecommendations,
        duration: Math.round((assessmentState.endTime - assessmentState.startTime) / 1000)
    };
}

// 查找漏洞详细信息
function findLeakInfo(tag) {
    for (const category of Object.values(LEAK_CATEGORIES)) {
        if (category.leaks[tag]) {
            return {
                name: category.leaks[tag].name,
                severity: category.leaks[tag].severity,
                training: category.leaks[tag].training,
                categoryName: category.name
            };
        }
    }
    return { name: tag, severity: "未知", training: "mistakes", categoryName: "其他" };
}

// 生成训练建议
function generateTrainingRecommendations(leaksList) {
    const recommendations = [];
    const trainingModules = {};
    
    leaksList.forEach(leak => {
        if (!trainingModules[leak.training]) {
            trainingModules[leak.training] = [];
        }
        trainingModules[leak.training].push(leak);
    });
    
    // 按优先级排序
    const priority = ['mistakes', 'math', 'sizing', 'planning', 'tilt', 'review'];
    
    priority.forEach(module => {
        if (trainingModules[module] && trainingModules[module].length > 0) {
            const moduleLeaks = trainingModules[module];
            const severeCount = moduleLeaks.filter(l => l.severity === "严重").length;
            const highCount = moduleLeaks.filter(l => l.severity === "高").length;
            
            let urgency = "建议";
            if (severeCount > 0) urgency = "紧急";
            else if (highCount >= 2) urgency = "重要";
            
            recommendations.push({
                module,
                urgency,
                leaks: moduleLeaks,
                description: getModuleDescription(module)
            });
        }
    });
    
    return recommendations;
}

// 获取模块描述
function getModuleDescription(module) {
    const descriptions = {
        mistakes: "低级错误防范模块 - 纠正常见执行错误",
        math: "数学计算训练 - 强化底池赔率、MDF、Combo计算",
        sizing: "Sizing决策训练 - 优化下注尺度选择",
        planning: "多街规划训练 - 建立系统性思维",
        tilt: "Tilt管理 - 情绪控制和session管理",
        review: "复盘框架 - 系统化分析提升"
    };
    return descriptions[module] || module;
}

// 导出
console.log('漏洞评估系统加载完成');
console.log('总题目数:', ASSESSMENT_QUESTIONS.length);
console.log('覆盖维度:', [...new Set(ASSESSMENT_QUESTIONS.map(q => q.category))].join(', '));



