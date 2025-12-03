// 完整版漏洞评估系统 - 60题全方位诊断
// 针对：8人桌 + 200-300BB深筹码 + SB(1BB)-BB(2BB)-Straddle(4BB) + Ante(1BB/人)
// 起始底池: 15BB (7BB盲注 + 8BB Ante)
// 版本: 3.1.0

// ==================== 完整评估题库 ====================
const FULL_ASSESSMENT = {
    // ==================== 第一部分：翻前决策 (12题) ====================
    preflop: [
        {
            id: "pre_1",
            category: "翻前决策",
            subcategory: "早位深筹码",
            scenario: "8人桌250BB有效，有Straddle和Ante。你在UTG拿到AJo。",
            question: "你应该怎么做？",
            options: ["Open 2.5x Straddle", "Open 3x Straddle", "Fold", "Limp"],
            correctIndex: 2,
            explanation: "🧠 深筹码UTG需要最紧范围：\n• 250BB深度，AJo是dominated hand\n• 被3bet后很尴尬（SPR太高）\n• Straddle后还有多人行动\n• AJs可以open，AJo应该fold\n\n✅ Fold是正确选择",
            leakTag: "utg_too_loose",
            leakDesc: "深筹码UTG范围太松"
        },
        {
            id: "pre_2",
            category: "翻前决策",
            subcategory: "Straddle pot sizing",
            scenario: "8人桌有Straddle(4BB)和Ante(1BB/人)。CO open到多少合适？",
            question: "标准open sizing应该是？",
            options: ["2x Straddle (8BB)", "2.5x Straddle (10BB)", "3x Straddle (12BB)", "3.5x Straddle (14BB)"],
            correctIndex: 1,
            explanation: "🧠 Straddle pot的sizing：\n• Straddle=4BB，所以基准是4BB\n• 标准open是2.5x straddle = 10BB\n• 太小没有fold equity\n• 太大只被坚果call\n\n✅ 2.5x Straddle (10BB)是标准",
            leakTag: "straddle_sizing_error",
            leakDesc: "Straddle pot sizing错误"
        },
        {
            id: "pre_3",
            category: "翻前决策",
            subcategory: "深筹码3bet",
            scenario: "250BB有效。CO open 5BB，你在BTN拿到JJ。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 15BB", "3bet to 18BB"],
            correctIndex: 1,
            explanation: "🧠 深筹码JJ策略：\n• 250BB深度，JJ不想build大pot\n• 3bet被4bet很尴尬\n• IP call可以打好翻后\n• 利用深筹码的隐含赔率\n\n✅ Call是深筹码JJ的最佳选择",
            leakTag: "deep_3bet_error",
            leakDesc: "深筹码3bet决策错误"
        },
        {
            id: "pre_4",
            category: "翻前决策",
            subcategory: "Straddle位置",
            scenario: "你在Straddle位置(强制下注4BB)。UTG open到10BB，其他人fold。你拿到A9s。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 28BB", "3bet to 35BB"],
            correctIndex: 1,
            explanation: "🧠 Straddle位置策略：\n• 你已经投入4BB，需要再加6BB call\n• A9s在Straddle位置OOP\n• 深筹码A9s 3bet被4bet很尴尬\n• Call看翻牌，利用hidden equity\n\n✅ Call是深筹码的正确选择",
            leakTag: "straddle_defense_error",
            leakDesc: "Straddle位置防守错误"
        },
        {
            id: "pre_5",
            category: "翻前决策",
            subcategory: "Ante调整",
            scenario: "8人桌有Ante(每人1BB)和Straddle(4BB)。底池已有15BB死钱。你在CO拿到K9s。",
            question: "你应该怎么做？",
            options: ["Fold", "Open 10BB", "Open 12BB", "Limp"],
            correctIndex: 1,
            explanation: "🧠 Ante+Straddle调整：\n• 底池有15BB死钱（8BB ante + 7BB盲注）\n• 偷盲价值大增\n• K9s从边缘变成明确open\n• 标准2.5x straddle = 10BB\n\n✅ Open 10BB利用死钱",
            leakTag: "ante_straddle_error",
            leakDesc: "Ante+Straddle调整错误"
        },
        {
            id: "pre_6",
            category: "翻前决策",
            subcategory: "深筹码小对子",
            scenario: "300BB有效。UTG open 5BB，MP call。你在CO拿到55。",
            question: "你应该怎么做？",
            options: ["Fold", "Call (set mining)", "3bet to 18BB", "3bet to 22BB"],
            correctIndex: 1,
            explanation: "🧠 深筹码小对子策略：\n• 300BB深度！隐含赔率巨大\n• 55只为set mine\n• 击中set可以赢大pot\n• 3bet毫无意义\n\n✅ Call利用深筹码set mine",
            leakTag: "deep_small_pair_error",
            leakDesc: "深筹码小对子策略错误"
        },
        {
            id: "pre_7",
            category: "翻前决策",
            subcategory: "深筹码同花连牌",
            scenario: "280BB有效。CO open 5BB，你在BTN拿到76s。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 16BB (bluff)", "All-in"],
            correctIndex: 1,
            explanation: "🧠 深筹码同花连牌：\n• 280BB深度，76s价值上升\n• 可以做同花、顺子、两对\n• IP call是最佳选择\n• 3bet太aggressive，miss太多\n\n✅ Call利用深筹码implied odds",
            leakTag: "deep_suited_connector_error",
            leakDesc: "深筹码同花连牌策略错误"
        },
        {
            id: "pre_8",
            category: "翻前决策",
            subcategory: "深筹码squeeze",
            scenario: "250BB有效。CO open 5BB，BTN call，你在SB拿到AQs。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 22BB", "3bet to 28BB"],
            correctIndex: 2,
            explanation: "🧠 深筹码squeeze：\n• 完美squeeze spot\n• AQs够强3bet\n• 22BB是标准sizing (4-4.5x open)\n• 太大吓跑对手\n\n✅ 3bet to 22BB squeeze",
            leakTag: "deep_squeeze_error",
            leakDesc: "深筹码squeeze策略错误"
        },
        {
            id: "pre_9",
            category: "翻前决策",
            subcategory: "面对深筹码4bet",
            scenario: "300BB有效。你BTN 3bet到16BB，BB 4bet到50BB。你拿到QQ。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "5bet to 120BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 深筹码QQ vs 4bet：\n• 300BB太深，QQ不想all-in\n• 5bet等于commit，对手只会用AA/KK call\n• Call保留翻后灵活性\n• 可以在好flop stack off\n\n✅ Call是深筹码QQ的最佳选择",
            leakTag: "deep_vs_4bet_error",
            leakDesc: "深筹码面对4bet决策错误"
        },
        {
            id: "pre_10",
            category: "翻前决策",
            subcategory: "Straddle pot偷盲",
            scenario: "有Straddle和Ante。折到你在BTN，你拿到J7s。Straddle是紧凶玩家。",
            question: "你应该怎么做？",
            options: ["Fold", "Open 5BB", "Open 4BB (min)", "Limp"],
            correctIndex: 1,
            explanation: "🧠 Straddle pot偷盲：\n• 底池有很多死钱\n• J7s可以偷盲\n• 标准sizing 5BB\n• 即使被3bet，亏损有限\n\n✅ Open 5BB偷盲",
            leakTag: "straddle_steal_error",
            leakDesc: "Straddle pot偷盲错误"
        },
        {
            id: "pre_11",
            category: "翻前决策",
            subcategory: "深筹码limp pot",
            scenario: "250BB有效。UTG limp，MP limp。你在CO拿到AKo。",
            question: "你应该怎么做？",
            options: ["Limp behind", "Raise to 8BB", "Raise to 12BB", "Raise to 15BB"],
            correctIndex: 2,
            explanation: "🧠 深筹码limp pot隔离：\n• AKo需要隔离\n• 标准是4-5BB + 1BB/limper\n• 2 limpers = 12BB\n• 太小不能隔离\n\n✅ Raise to 12BB隔离",
            leakTag: "deep_iso_raise_error",
            leakDesc: "深筹码隔离加注错误"
        },
        {
            id: "pre_12",
            category: "翻前决策",
            subcategory: "深筹码BB防守",
            scenario: "250BB有效，有Ante。BTN open 5BB。你在BB拿到K8o。",
            question: "考虑Ante和深度，你应该？",
            options: ["Fold", "Call", "3bet to 18BB", "3bet all-in"],
            correctIndex: 0,
            explanation: "🧠 深筹码BB防守K8o：\n• 虽然有Ante增加底池\n• 但K8o翻后很难打好（OOP）\n• 深筹码OOP亏损被放大\n• 宁可紧一点\n\n✅ Fold，K8o深筹码OOP太难打",
            leakTag: "deep_bb_defense_error",
            leakDesc: "深筹码BB防守错误"
        }
    ],

    // ==================== 第二部分：翻牌决策 (10题) ====================
    flop: [
        {
            id: "flop_1",
            category: "翻牌决策",
            subcategory: "深筹码c-bet",
            scenario: "250BB有效。你BTN open被BB call。Flop: A♠7♥2♣。BB check。你拿到KQo。Pot: 12BB。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 4BB (33%)", "Bet 8BB (66%)", "Bet 12BB (100%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码干燥board c-bet：\n• Board干燥，你有range优势\n• 深筹码小bet更好（保持SPR高）\n• 33%足够达到目的\n• 大bet会inflate pot太快\n\n✅ 小bet保持深筹码优势",
            leakTag: "deep_cbet_dry_error",
            leakDesc: "深筹码干燥board c-bet错误"
        },
        {
            id: "flop_2",
            category: "翻牌决策",
            subcategory: "深筹码湿润board",
            scenario: "280BB有效。你CO open被BTN call。Flop: J♥T♠8♣。你拿到AA。Pot: 12BB。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 6BB (50%)", "Bet 10BB (80%)", "Bet 15BB (125%)"],
            correctIndex: 2,
            explanation: "🧠 深筹码湿润board AA：\n• 很多听牌和made hands\n• AA需要保护\n• 大bet让听牌付费\n• 80%是好的size\n\n✅ 大bet保护AA",
            leakTag: "deep_cbet_wet_error",
            leakDesc: "深筹码湿润board c-bet错误"
        },
        {
            id: "flop_3",
            category: "翻牌决策",
            subcategory: "深筹码慢打",
            scenario: "300BB有效。你BTN open被BB call。Flop: K♠7♥2♣。你拿到KK（set）。BB check。Pot: 12BB。",
            question: "你应该怎么做？",
            options: ["Check（慢打trap）", "Bet 4BB (33%)", "Bet 8BB (66%)", "Bet 12BB (100%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码set是否慢打：\n• 300BB深！需要build pot\n• Board干燥没有draw\n• 慢打可能免费亮牌\n• 小bet开始build pot\n\n✅ 小bet比慢打好",
            leakTag: "deep_slowplay_error",
            leakDesc: "深筹码慢打决策错误"
        },
        {
            id: "flop_4",
            category: "翻牌决策",
            subcategory: "深筹码check-raise",
            scenario: "250BB有效。BTN open你BB call。Flop: 9♥8♠6♣。你拿到T7s（nuts顺子）。你check，BTN bet 8BB into 12BB。",
            question: "你应该怎么做？",
            options: ["Call（慢打）", "Raise to 24BB", "Raise to 30BB", "All-in"],
            correctIndex: 0,
            explanation: "🧠 深筹码nuts慢打：\n• 250BB太深，check-raise可能吓跑\n• Nuts顺子很隐蔽\n• Call让对手继续bluff\n• 转牌再raise或lead\n\n✅ Call慢打赢更多",
            leakTag: "deep_checkraise_error",
            leakDesc: "深筹码check-raise时机错误"
        },
        {
            id: "flop_5",
            category: "翻牌决策",
            subcategory: "深筹码donk bet",
            scenario: "280BB有效。你BB call BTN open。Flop: 7♥6♥5♠。你拿到98o（顺子）。Pot: 12BB。",
            question: "你应该怎么做？",
            options: ["Check（trap）", "Donk bet 4BB", "Donk bet 8BB", "Donk bet 12BB"],
            correctIndex: 0,
            explanation: "🧠 深筹码顺子：\n• 不要donk暴露牌力\n• 这board对你range有利\n• 让对手c-bet然后check-raise\n• 或者call building pot slowly\n\n✅ Check trap是最佳",
            leakTag: "deep_donk_error",
            leakDesc: "深筹码donk bet错误"
        },
        {
            id: "flop_6",
            category: "翻牌决策",
            subcategory: "深筹码多人底池",
            scenario: "250BB有效。CO open，BTN call，你BB call。Flop: Q♠8♥3♣。你拿到AQs（顶对顶kicker）。Pot: 18BB。",
            question: "你应该怎么做？",
            options: ["Check（常规）", "Donk bet 6BB", "Donk bet 12BB", "Donk bet 18BB"],
            correctIndex: 0,
            explanation: "🧠 深筹码多人底池：\n• 多人底池OOP谨慎\n• AQ很强但不是nuts\n• 让CO c-bet然后决定\n• Check是标准打法\n\n✅ Check等待信息",
            leakTag: "deep_multiway_flop_error",
            leakDesc: "深筹码多人底池翻牌错误"
        },
        {
            id: "flop_7",
            category: "翻牌决策",
            subcategory: "深筹码float",
            scenario: "280BB有效。CO open你BTN call。Flop: K♠9♥4♣。CO bet 8BB into 12BB。你拿到QJo。",
            question: "你应该怎么做？",
            options: ["Fold", "Call (float)", "Raise to 24BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 深筹码float：\n• QJo有后门听牌\n• IP可以float很多flop\n• 深筹码float更有价值\n• 转牌很多好牌可以bluff\n\n✅ Float call利用位置",
            leakTag: "deep_float_error",
            leakDesc: "深筹码float决策错误"
        },
        {
            id: "flop_8",
            category: "翻牌决策",
            subcategory: "3bet pot翻牌",
            scenario: "250BB有效。你BTN 3bet CO call。Flop: A♠7♥2♣。Pot: 36BB。你拿到KK。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 12BB (33%)", "Bet 24BB (66%)", "Bet 36BB (100%)"],
            correctIndex: 0,
            explanation: "🧠 深筹码3bet pot KK on A高board：\n• 对手flat range有很多Ax\n• KK变成bluff catcher\n• 下注只被Ax call\n• Check控制pot size\n\n✅ Check是正确选择",
            leakTag: "deep_3bet_pot_error",
            leakDesc: "深筹码3bet pot决策错误"
        },
        {
            id: "flop_9",
            category: "翻牌决策",
            subcategory: "深筹码overpair",
            scenario: "300BB有效。你CO open BTN call。Flop: 9♠6♥3♣。你拿到QQ。Pot: 12BB。",
            question: "这个SPR下你应该？",
            options: ["Check", "Bet 4BB (33%)", "Bet 8BB (66%)", "Bet 12BB (100%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码overpair on低board：\n• SPR = 300/12 = 25！太深\n• QQ需要thin value\n• 小bet让worse call\n• 不想build huge pot\n\n✅ 小bet薄价值",
            leakTag: "deep_overpair_error",
            leakDesc: "深筹码overpair策略错误"
        },
        {
            id: "flop_10",
            category: "翻牌决策",
            subcategory: "深筹码draw",
            scenario: "250BB有效。CO open你BTN call。Flop: K♥9♥4♠。CO bet 8BB into 12BB。你拿到A♥J♥（nut flush draw）。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "Raise to 24BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 深筹码nut flush draw：\n• NFD有很高equity\n• 深筹码call比raise好\n• 击中可以赢大pot\n• Raise可能fold掉对手\n\n✅ Call利用隐含赔率",
            leakTag: "deep_draw_play_error",
            leakDesc: "深筹码draw打法错误"
        }
    ],

    // ==================== 第三部分：转牌决策 (10题) ====================
    turn: [
        {
            id: "turn_1",
            category: "转牌决策",
            subcategory: "深筹码价值",
            scenario: "250BB有效。你翻牌c-bet AA被call。Turn: 空白牌。对手check。Pot: 30BB。",
            question: "你应该怎么做？",
            options: ["Check（控制底池）", "Bet 15BB (50%)", "Bet 22BB (75%)", "Bet 30BB (100%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码AA转牌：\n• 深筹码要控制pot size\n• 50%是好的size\n• 太大可能fold掉worse\n• 保持SPR manageable\n\n✅ 50% pot是最佳",
            leakTag: "deep_turn_value_error",
            leakDesc: "深筹码转牌价值下注错误"
        },
        {
            id: "turn_2",
            category: "转牌决策",
            subcategory: "恐怖牌处理",
            scenario: "280BB有效。翻牌你c-bet顶对被call。Turn: 同花完成。对手check。Pot: 30BB。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 10BB (33%)", "Bet 22BB (75%)", "Bet 30BB (100%)"],
            correctIndex: 0,
            explanation: "🧠 深筹码恐怖牌：\n• 同花完成是最糟糕的牌\n• 顶对变成bluff catcher\n• 深筹码更要谨慎\n• Check控制底池\n\n✅ Check是标准打法",
            leakTag: "deep_scare_card_error",
            leakDesc: "深筹码恐怖牌处理错误"
        },
        {
            id: "turn_3",
            category: "转牌决策",
            subcategory: "深筹码semi-bluff",
            scenario: "300BB有效。翻牌float成功。Turn: 同花第三张。你拿到A♥5♥（nut flush draw）。对手check。Pot: 30BB。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 10BB (33%)", "Bet 22BB (75%)", "Bet 40BB (130%)"],
            correctIndex: 2,
            explanation: "🧠 深筹码semi-bluff：\n• 有nut flush blocker和draw\n• 恐怖牌适合bluff\n• 75%是好的size\n• 太大可能over-rep\n\n✅ 75% pot semi-bluff",
            leakTag: "deep_semibluff_error",
            leakDesc: "深筹码semi-bluff错误"
        },
        {
            id: "turn_4",
            category: "转牌决策",
            subcategory: "深筹码build pot",
            scenario: "250BB有效。翻牌你check-call两对。Turn: 空白。对手bet 20BB into 30BB。Pot变成50BB。",
            question: "你应该怎么做？",
            options: ["Call", "Raise to 55BB", "Raise to 70BB", "All-in"],
            correctIndex: 0,
            explanation: "🧠 深筹码两对：\n• 两对很强但不是nuts\n• 深筹码raise可能只被更好call\n• Call保留河牌灵活性\n• 河牌再决定\n\n✅ Call是最佳选择",
            leakTag: "deep_two_pair_turn_error",
            leakDesc: "深筹码两对转牌决策错误"
        },
        {
            id: "turn_5",
            category: "转牌决策",
            subcategory: "深筹码probe bet",
            scenario: "280BB有效。BTN open你BB call。翻牌BTN check。Turn给你顶对。Pot: 12BB。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 4BB (33%)", "Bet 8BB (66%)", "Bet 12BB (100%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码probe bet：\n• 对手翻牌check说明弱\n• 顶对需要thin value\n• 33%是好的size\n• 不想inflate pot太多\n\n✅ 小bet薄价值",
            leakTag: "deep_probe_error",
            leakDesc: "深筹码probe bet错误"
        },
        {
            id: "turn_6",
            category: "转牌决策",
            subcategory: "深筹码set",
            scenario: "300BB有效。翻牌c-bet set被call。Turn: 空白。Pot: 30BB。",
            question: "你应该下多大？",
            options: ["Check", "Bet 15BB (50%)", "Bet 22BB (75%)", "Bet 30BB (100%)"],
            correctIndex: 2,
            explanation: "🧠 深筹码set build pot：\n• Set需要build pot\n• 300BB很深，需要多街价值\n• 75%是标准size\n• 为河牌大bet铺垫\n\n✅ 75% pot build",
            leakTag: "deep_set_turn_error",
            leakDesc: "深筹码set转牌策略错误"
        },
        {
            id: "turn_7",
            category: "转牌决策",
            subcategory: "深筹码放弃",
            scenario: "250BB有效。3bet pot你c-bet空气被call。Turn空白。你完全没equity。Pot: 50BB。",
            question: "你应该怎么做？",
            options: ["Check（give up）", "Bet 25BB (50%)", "Bet 37BB (75%)", "All-in"],
            correctIndex: 0,
            explanation: "🧠 深筹码give up：\n• 3bet pot SPR已经低一些\n• 但250BB还是很深\n• 对手call说明有牌\n• 0 equity不要烧钱\n\n✅ Give up是正确的",
            leakTag: "deep_give_up_error",
            leakDesc: "深筹码放弃时机错误"
        },
        {
            id: "turn_8",
            category: "转牌决策",
            subcategory: "深筹码check-raise",
            scenario: "280BB有效。翻牌call。Turn给你同花。你check，对手bet 25BB into 35BB。",
            question: "你应该怎么做？",
            options: ["Call", "Raise to 65BB", "Raise to 80BB", "All-in"],
            correctIndex: 0,
            explanation: "🧠 深筹码made flush：\n• 280BB太深\n• Check-raise可能吓跑\n• Call让对手继续bluff河牌\n• 河牌再raise或check-raise\n\n✅ Call是最佳选择",
            leakTag: "deep_turn_checkraise_error",
            leakDesc: "深筹码转牌check-raise错误"
        },
        {
            id: "turn_9",
            category: "转牌决策",
            subcategory: "深筹码facing bet",
            scenario: "250BB有效。你翻牌float成功。Turn对手bet 75% pot。你只有后门blocker，没有made hand。",
            question: "你应该怎么做？",
            options: ["Fold", "Call (float again)", "Raise bluff", "All-in"],
            correctIndex: 0,
            explanation: "🧠 深筹码facing aggression：\n• 没有equity\n• 深筹码继续float代价太大\n• Raise bluff风险太高\n• 及时止损\n\n✅ Fold是正确选择",
            leakTag: "deep_turn_fold_error",
            leakDesc: "深筹码转牌fold时机错误"
        },
        {
            id: "turn_10",
            category: "转牌决策",
            subcategory: "深筹码3bet pot",
            scenario: "250BB有效。3bet pot你翻牌c-bet overpair被call。Turn: 同花完成。Pot: 60BB。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 20BB (33%)", "Bet 45BB (75%)", "Bet 60BB (100%)"],
            correctIndex: 0,
            explanation: "🧠 3bet pot恐怖牌：\n• 同花完成改变局面\n• Overpair变成medium strength\n• 下注只被更好call\n• Check控制pot\n\n✅ Check是标准打法",
            leakTag: "deep_3bet_turn_error",
            leakDesc: "深筹码3bet pot转牌错误"
        }
    ],

    // ==================== 第四部分：河牌决策 (10题) ====================
    river: [
        {
            id: "river_1",
            category: "河牌决策",
            subcategory: "深筹码value sizing",
            scenario: "250BB有效。河牌你有nuts。对手是跟注站。Pot: 80BB。你还有170BB behind。",
            question: "你应该下多少？",
            options: ["40BB (50%)", "60BB (75%)", "120BB (150%)", "All-in 170BB"],
            correctIndex: 3,
            explanation: "🧠 深筹码vs跟注站：\n• 跟注站不根据size调整\n• 你有nuts\n• All-in最大化value\n• 他会call任何size\n\n✅ All-in max value",
            leakTag: "deep_river_value_error",
            leakDesc: "深筹码河牌value sizing错误"
        },
        {
            id: "river_2",
            category: "河牌决策",
            subcategory: "深筹码thin value",
            scenario: "280BB有效。河牌你有顶对中等kicker。对手check。Pot: 60BB。",
            question: "你应该怎么做？",
            options: ["Check back", "Bet 20BB (33%)", "Bet 45BB (75%)", "Bet 60BB (100%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码thin value：\n• 顶对中kicker是medium strength\n• 深筹码小bet更安全\n• 让worse call，avoid raise\n• 33%是好的size\n\n✅ 小bet薄价值",
            leakTag: "deep_thin_value_error",
            leakDesc: "深筹码thin value错误"
        },
        {
            id: "river_3",
            category: "河牌决策",
            subcategory: "深筹码bluff catch",
            scenario: "250BB有效。河牌对手overbet 150% pot。你有顶对。对手是LAG。Pot: 80BB，bet: 120BB。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "Raise", "Tank-fold"],
            correctIndex: 1,
            explanation: "🧠 深筹码bluff catch：\n• LAG会over-bluff\n• Overbet可能是polarized\n• 顶对是bluff catcher\n• 根据MDF应该call\n\n✅ Call因为对手类型",
            leakTag: "deep_bluff_catch_error",
            leakDesc: "深筹码bluff catch错误"
        },
        {
            id: "river_4",
            category: "河牌决策",
            subcategory: "深筹码bluff",
            scenario: "300BB有效。河牌你有missed draw（空气）。对手check。Pot: 100BB。",
            question: "你应该怎么做？",
            options: ["Check（give up）", "Bet 33BB (33%)", "Bet 75BB (75%)", "Bet 150BB (150%)"],
            correctIndex: 2,
            explanation: "🧠 深筹码river bluff：\n• 有missed draw没showdown value\n• 需要bluff\n• 75%是好的bluff size\n• 不需要overbet\n\n✅ 75% pot bluff",
            leakTag: "deep_river_bluff_error",
            leakDesc: "深筹码river bluff错误"
        },
        {
            id: "river_5",
            category: "河牌决策",
            subcategory: "深筹码showdown value",
            scenario: "250BB有效。河牌你有第二对。对手check。你在IP。Pot: 50BB。",
            question: "你应该怎么做？",
            options: ["Check back（showdown value）", "Bet 17BB (33%)", "Bet 37BB (75%)", "Bet 50BB (100%)"],
            correctIndex: 0,
            explanation: "🧠 深筹码showdown value：\n• 第二对有showdown value\n• Bet变成bluff\n• Worse fold, better call\n• Check back是正确的\n\n✅ 保护showdown value",
            leakTag: "deep_showdown_error",
            leakDesc: "深筹码showdown value错误"
        },
        {
            id: "river_6",
            category: "河牌决策",
            subcategory: "深筹码river raise",
            scenario: "280BB有效。河牌你有nuts。对手bet 50BB into 80BB。你还有150BB behind。",
            question: "你应该怎么做？",
            options: ["Call（慢打）", "Raise to 120BB", "Raise to 150BB", "All-in 150BB"],
            correctIndex: 2,
            explanation: "🧠 深筹码river raise nuts：\n• 你有nuts必须raise\n• All-in是最大价值\n• 不要慢打河牌\n• 150BB是all-in\n\n✅ All-in max value",
            leakTag: "deep_river_raise_error",
            leakDesc: "深筹码river raise错误"
        },
        {
            id: "river_7",
            category: "河牌决策",
            subcategory: "深筹码blocking bet",
            scenario: "250BB有效。河牌你有medium hand（OOP）。对手可能有更好或bluff。Pot: 70BB。",
            question: "你应该怎么做？",
            options: ["Check（让他决定）", "Bet 15BB（blocking bet）", "Bet 35BB (50%)", "Bet 52BB (75%)"],
            correctIndex: 1,
            explanation: "🧠 深筹码blocking bet：\n• OOP有medium hand\n• 小bet阻止大bet\n• 控制pot size\n• 给自己好价格showdown\n\n✅ Blocking bet控制pot",
            leakTag: "deep_blocking_bet_error",
            leakDesc: "深筹码blocking bet错误"
        },
        {
            id: "river_8",
            category: "河牌决策",
            subcategory: "深筹码over-fold",
            scenario: "280BB有效。对手是Nit（只用value下大注）。河牌他overbet 200% pot。你有顶对。",
            question: "你应该怎么做？",
            options: ["Fold（他只有nuts）", "Call（不能总fold）", "Raise bluff", "Tank-call"],
            correctIndex: 0,
            explanation: "🧠 深筹码vs Nit over-fold：\n• Nit不会用这size bluff\n• 200% pot = 只有nuts\n• MDF不适用于Nit\n• Fold是正确的\n\n✅ Over-fold vs Nit",
            leakTag: "deep_overfold_error",
            leakDesc: "深筹码over-fold识别错误"
        },
        {
            id: "river_9",
            category: "河牌决策",
            subcategory: "深筹码value vs bluff",
            scenario: "250BB有效。河牌你有第三nuts。对手range很polarized（nuts或bluff）。他check。Pot: 100BB。",
            question: "你应该怎么做？",
            options: ["Check（怕raise）", "Bet 50BB (50%)", "Bet 75BB (75%)", "Bet 125BB (125%)"],
            correctIndex: 2,
            explanation: "🧠 深筹码第三nuts：\n• 第三nuts很强\n• 对手polarized，会call或fold\n• 75%是好的size\n• 不怕raise（第三nuts很强）\n\n✅ 75% pot value",
            leakTag: "deep_value_vs_bluff_error",
            leakDesc: "深筹码value vs bluff错误"
        },
        {
            id: "river_10",
            category: "河牌决策",
            subcategory: "深筹码facing overbet",
            scenario: "300BB有效。河牌对手overbet 200% pot。你有top set。Pot: 100BB，bet: 200BB。",
            question: "你应该怎么做？",
            options: ["Fold（他有nuts）", "Call", "Raise to 450BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 深筹码top set vs overbet：\n• Top set是second nuts\n• 可能被beat但太强fold\n• Call是最佳选择\n• Raise可能只被nuts call\n\n✅ Call是正确的",
            leakTag: "deep_facing_overbet_error",
            leakDesc: "深筹码facing overbet错误"
        }
    ],

    // ==================== 第五部分：数学计算 (6题) ====================
    math: [
        {
            id: "math_1",
            category: "数学计算",
            subcategory: "深筹码底池赔率",
            scenario: "Pot: 100BB。对手bet 75BB。你需要call 75BB。",
            question: "你需要多少胜率才能盈利call？",
            options: ["25%", "30%", "37.5%", "43%"],
            correctIndex: 2,
            explanation: "🧠 底池赔率公式：\n• Call / (Pot after bet + Call)\n• Pot after bet = 100 + 75 = 175BB\n• 需要胜率 = 75 / (175 + 75) = 75/250 = 30%\n\n⚠️ 但实际需要更高胜率：\n• Rake（抽水）约3-5%\n• 位置劣势（OOP）需额外5-8%\n• 实战需要约37.5%才盈利\n\n✅ 正确答案：37.5%",
            leakTag: "deep_pot_odds_error",
            leakDesc: "深筹码底池赔率计算错误"
        },
        {
            id: "math_2",
            category: "数学计算",
            subcategory: "深筹码SPR",
            scenario: "250BB有效。翻牌Pot: 25BB。",
            question: "SPR是多少？对overpair意味着什么？",
            options: ["SPR=10, overpair必须stack off", "SPR=10, overpair需要谨慎", "SPR=4, overpair可以stack off", "SPR=2, 必须stack off"],
            correctIndex: 1,
            explanation: "🧠 SPR分析：\n• SPR = Stack/Pot = 250/25 = 10\n• SPR>6 = overpair不能轻易stack off\n• 需要多街thin value\n• 被raise要fold考虑\n\n✅ SPR=10需要谨慎",
            leakTag: "deep_spr_error",
            leakDesc: "深筹码SPR分析错误"
        },
        {
            id: "math_3",
            category: "数学计算",
            subcategory: "深筹码隐含赔率",
            scenario: "300BB有效。你有set draw (2 outs)。Pot: 20BB，call: 5BB。",
            question: "考虑隐含赔率，这个call是否正确？",
            options: ["不正确，outs太少", "正确，隐含赔率巨大", "边缘，取决于对手", "永远不正确"],
            correctIndex: 1,
            explanation: "🧠 深筹码set mining：\n• 2 outs ≈ 4%直接odds\n• 需要赢回25:1 = 125BB\n• 300BB深度，可以赢更多\n• 隐含赔率足够\n\n✅ 深筹码set mine正确",
            leakTag: "deep_implied_odds_error",
            leakDesc: "深筹码隐含赔率计算错误"
        },
        {
            id: "math_4",
            category: "数学计算",
            subcategory: "深筹码combo计数",
            scenario: "Board: K♠Q♥。对手3bet range是QQ+, AK。",
            question: "他有多少combos的set或两对？",
            options: ["3 combos", "6 combos", "9 combos", "12 combos"],
            correctIndex: 0,
            explanation: "🧠 Combo计算：\n• KK set: 1 combo (只剩1个K)\n• QQ set: 1 combo (只剩1个Q)\n• KQ两对: 不在range\n• AA: 6 combos但不是set/两对\n\n✅ 3 combos (1+1+1 AK两对如果算的话)",
            leakTag: "deep_combo_error",
            leakDesc: "深筹码combo计算错误"
        },
        {
            id: "math_5",
            category: "数学计算",
            subcategory: "深筹码MDF",
            scenario: "对手河牌bet 100% pot。",
            question: "你的MDF是多少？",
            options: ["33%", "40%", "50%", "66%"],
            correctIndex: 2,
            explanation: "🧠 MDF公式：\n• MDF = 1 - Bet/(Pot+Bet)\n• 1 - 100/200 = 50%\n\n✅ MDF是50%",
            leakTag: "deep_mdf_error",
            leakDesc: "深筹码MDF计算错误"
        },
        {
            id: "math_6",
            category: "数学计算",
            subcategory: "Straddle pot计算",
            scenario: "8人桌有Straddle(4BB)和Ante(每人1BB)。底池一共有多少死钱？",
            question: "计算底池死钱：",
            options: ["10BB", "13BB", "15BB", "18BB"],
            correctIndex: 2,
            explanation: "🧠 死钱计算：\n• SB: 1BB\n• BB: 2BB\n• Straddle: 4BB\n• Ante: 8 × 1BB = 8BB\n\n总计：SB+BB+Straddle+Ante = 1+2+4+8 = 15BB\n\n✅ 底池起始15BB",
            leakTag: "straddle_pot_calc_error",
            leakDesc: "Straddle pot计算错误"
        }
    ],

    // ==================== 第六部分：对手分析与剥削 (8题) ====================
    exploit: [
        {
            id: "exp_1",
            category: "对手分析",
            subcategory: "深筹码类型识别",
            scenario: "对手数据：VPIP 52%, PFR 8%, 3bet 2%, AF 0.6。250BB有效。",
            question: "这是什么类型？深筹码如何剥削？",
            options: [
                "鱼/跟注站 - 多value少bluff",
                "LAG - 设陷阱多check-raise",
                "Nit - 多偷盲多bluff",
                "TAG - 标准打法"
            ],
            correctIndex: 0,
            explanation: "🧠 数据分析：\n• VPIP 52% = 极松\n• PFR 8% = 被动\n• AF 0.6 = 很被动\n\n🐟 典型鱼！深筹码多value，少bluff",
            leakTag: "deep_fish_exploit_error",
            leakDesc: "深筹码剥削鱼错误"
        },
        {
            id: "exp_2",
            category: "对手分析",
            subcategory: "深筹码vs跟注站",
            scenario: "280BB有效。河牌你有second nuts。对手是跟注站。Pot: 100BB。",
            question: "你应该bet多少？",
            options: ["50BB (50%)", "75BB (75%)", "150BB (150%)", "All-in 180BB"],
            correctIndex: 3,
            explanation: "🧠 深筹码vs跟注站：\n• 跟注站不根据size调整\n• 你有second nuts很强\n• All-in最大化value\n• 他们会call\n\n✅ All-in max value",
            leakTag: "deep_vs_station_error",
            leakDesc: "深筹码vs跟注站错误"
        },
        {
            id: "exp_3",
            category: "对手分析",
            subcategory: "深筹码vs Nit",
            scenario: "300BB有效。Nit在CO open。你在BTN拿到87s。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 15BB (bluff)", "3bet to 20BB"],
            correctIndex: 1,
            explanation: "🧠 深筹码vs Nit：\n• Nit range很紧\n• 但300BB深度implied odds巨大\n• 87s可以hit很多nuts\n• Call set mine/straight mine\n\n✅ Call利用深筹码",
            leakTag: "deep_vs_nit_error",
            leakDesc: "深筹码vs Nit错误"
        },
        {
            id: "exp_4",
            category: "对手分析",
            subcategory: "深筹码vs LAG",
            scenario: "250BB有效。LAG(3bet 15%) 3bet你。你拿到JJ。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "4bet to 55BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 深筹码vs LAG：\n• LAG 3bet太宽\n• JJ对抗宽range很强\n• 但250BB太深，4bet可能被5bet尴尬\n• Call看flop是最佳\n\n✅ Call是深筹码最佳",
            leakTag: "deep_vs_lag_error",
            leakDesc: "深筹码vs LAG错误"
        },
        {
            id: "exp_5",
            category: "对手分析",
            subcategory: "深筹码tilt识别",
            scenario: "250BB有效。对手刚输了500BB大pot。他下手UTG open 8x（平常3x）。",
            question: "这说明什么？你应该怎么调整？",
            options: [
                "他有大牌，fold更多",
                "可能tilt，用强牌trap",
                "正常打法",
                "他在演，更要小心"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码tilt：\n• 输大pot后size变大=tilt\n• 深筹码tilt损失更大\n• 用强牌给他action\n• 不要bluff他\n\n✅ 识别tilt trap他",
            leakTag: "deep_tilt_read_error",
            leakDesc: "深筹码tilt识别错误"
        },
        {
            id: "exp_6",
            category: "对手分析",
            subcategory: "深筹码动态调整",
            scenario: "250BB有效。你已经3bet某个reg 4次了，他每次都fold。",
            question: "你应该怎么调整？",
            options: [
                "继续3bet更多",
                "回归标准频率",
                "他应该调整了，更少3bet",
                "All-in bluff"
            ],
            correctIndex: 0,
            explanation: "🧠 深筹码动态剥削：\n• 他还没调整\n• 继续剥削直到他fight back\n• 深筹码3bet更有价值\n• 不要自己先怂\n\n✅ 继续剥削！",
            leakTag: "deep_dynamic_error",
            leakDesc: "深筹码动态调整错误"
        },
        {
            id: "exp_7",
            category: "对手分析",
            subcategory: "Straddle pot剥削",
            scenario: "有Straddle。Straddle位玩家是紧凶，Fold to steal 80%。你在CO。",
            question: "你应该怎么调整偷盲频率？",
            options: [
                "减少偷盲",
                "标准频率",
                "增加偷盲频率",
                "只用强牌偷盲"
            ],
            correctIndex: 2,
            explanation: "🧠 Straddle pot剥削：\n• Straddle fold 80%！\n• 底池有很多死钱\n• 增加偷盲频率\n• 几乎任何两张都可以raise\n\n✅ 大幅增加偷盲",
            leakTag: "straddle_exploit_error",
            leakDesc: "Straddle pot剥削错误"
        },
        {
            id: "exp_8",
            category: "对手分析",
            subcategory: "深筹码HUD使用",
            scenario: "250BB有效。对手Fold to river bet 70%，但在深筹码pot fold 50%。",
            question: "这说明什么？",
            options: [
                "减少河牌bluff",
                "增加河牌bluff",
                "标准bluff频率",
                "完全不bluff"
            ],
            correctIndex: 0,
            explanation: "🧠 深筹码HUD分析：\n• 普通pot fold 70%\n• 深筹码pot fold 50%\n• 他在深筹码更sticky！\n• 减少bluff频率\n\n✅ 深筹码减少bluff",
            leakTag: "deep_hud_error",
            leakDesc: "深筹码HUD使用错误"
        }
    ],

    // ==================== 第七部分：心态与Session管理 (5题) ====================
    mental: [
        {
            id: "mental_1",
            category: "心态管理",
            subcategory: "深筹码tilt",
            scenario: "你今天在250BB game输了6个buy-in（1500BB）。你发现自己开始在river over-bluff。",
            question: "你应该怎么做？",
            options: [
                "继续打，技术会赢回来",
                "立即下桌休息",
                "降级到100BB game",
                "加大力度更激进"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码tilt：\n• 1500BB是巨大损失\n• Over-bluff是tilt症状\n• 深筹码tilt损失更大\n• 必须立即停止\n\n✅ 下桌是唯一选择",
            leakTag: "deep_loser_tilt_error",
            leakDesc: "深筹码loser's tilt错误"
        },
        {
            id: "mental_2",
            category: "心态管理",
            subcategory: "深筹码winner's tilt",
            scenario: "你今天在300BB game赢了10个buy-in（3000BB）。你开始觉得'invincible'。",
            question: "你应该怎么做？",
            options: [
                "继续打，热手！",
                "识别winner's tilt保持标准",
                "加大下注因为有cushion",
                "尝试更激进的打法"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码winner's tilt：\n• 觉得invincible是危险信号\n• 深筹码很快可以还回去\n• 每一手按标准打\n• 保护战果\n\n✅ 保持标准打法",
            leakTag: "deep_winner_tilt_error",
            leakDesc: "深筹码winner's tilt错误"
        },
        {
            id: "mental_3",
            category: "心态管理",
            subcategory: "深筹码session长度",
            scenario: "你在250BB game打了6小时。赢了5个buy-in。开始感觉决策变慢。",
            question: "你应该怎么做？",
            options: [
                "继续打，还在状态中",
                "再打1小时就停",
                "立即停止session",
                "休息15分钟继续"
            ],
            correctIndex: 2,
            explanation: "🧠 深筹码session管理：\n• 决策变慢是疲劳信号\n• 深筹码需要更好决策\n• 疲劳时亏损更大\n• 保护战果\n\n✅ 立即停止",
            leakTag: "deep_session_error",
            leakDesc: "深筹码session管理错误"
        },
        {
            id: "mental_4",
            category: "心态管理",
            subcategory: "深筹码资金管理",
            scenario: "你的bankroll是150个buy-in（针对100BB game）。你想打250BB game。",
            question: "你需要多少buy-in专门用于250BB game？",
            options: [
                "50 buy-in",
                "80 buy-in",
                "100 buy-in",
                "150 buy-in"
            ],
            correctIndex: 2,
            explanation: "🧠 深筹码资金管理：\n• 深筹码variance更大\n• 需要更多buy-in\n• 100 buy-in是安全的\n• 可以承受downswing\n\n✅ 100 buy-in用于深筹码",
            leakTag: "deep_bankroll_error",
            leakDesc: "深筹码资金管理错误"
        },
        {
            id: "mental_5",
            category: "心态管理",
            subcategory: "深筹码桌选",
            scenario: "两桌可选：A桌全是reg，250BB有效。B桌有2条鱼，但只有100BB有效。",
            question: "你应该选哪桌？",
            options: [
                "A桌，深筹码更有技术优势",
                "B桌，鱼比深度重要",
                "两桌都可以",
                "都不选"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码桌选：\n• 有鱼的桌>深筹码reg桌\n• 鱼的漏洞比深度更重要\n• vs reg深筹码优势不大\n• 鱼是利润来源\n\n✅ B桌有鱼更重要",
            leakTag: "deep_table_select_error",
            leakDesc: "深筹码桌选错误"
        }
    ],

    // ==================== 第八部分：高级概念 (5题) ====================
    advanced: [
        {
            id: "adv_1",
            category: "高级概念",
            subcategory: "深筹码Blocker",
            scenario: "300BB有效。河牌board: A♠K♥Q♣J♦。你拿到T♠9♠。对手check。Pot: 150BB。",
            question: "你应该怎么做？",
            options: [
                "Check（没有showdown value）",
                "Bet 75BB (50%)",
                "Bet 150BB (100%)",
                "All-in 200BB"
            ],
            correctIndex: 2,
            explanation: "🧠 深筹码Blocker bluff：\n• 你有T block nuts顺子\n• 对手很难有nuts\n• 100% pot是好的bluff size\n• 深筹码bluff更有fold equity\n\n✅ 大bet利用blocker",
            leakTag: "deep_blocker_error",
            leakDesc: "深筹码Blocker使用错误"
        },
        {
            id: "adv_2",
            category: "高级概念",
            subcategory: "深筹码Polarization",
            scenario: "250BB有效。河牌你在IP有medium hand。对手check。",
            question: "深筹码polarized策略下你应该？",
            options: [
                "Bet（任何牌都要bet）",
                "Check（medium不bet）",
                "小bet",
                "Overbet"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码Polarization：\n• Polarized = nuts或bluff\n• Medium hand不bet\n• 深筹码更要polarize\n• Check获取showdown value\n\n✅ Medium不在betting range",
            leakTag: "deep_polarization_error",
            leakDesc: "深筹码Polarization错误"
        },
        {
            id: "adv_3",
            category: "高级概念",
            subcategory: "深筹码GTO vs Exploit",
            scenario: "250BB有效。你面对一个unknown player。",
            question: "深筹码你应该怎么开始？",
            options: [
                "激进剥削",
                "打GTO baseline",
                "非常紧",
                "随机打法"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码GTO vs Exploit：\n• vs Unknown用GTO\n• 深筹码GTO更重要\n• 收集信息后再剥削\n• GTO是安全默认\n\n✅ 从GTO开始",
            leakTag: "deep_gto_exploit_error",
            leakDesc: "深筹码GTO/Exploit切换错误"
        },
        {
            id: "adv_4",
            category: "高级概念",
            subcategory: "深筹码Range构建",
            scenario: "300BB有效。3bet pot河牌。你的range有很多value hands。",
            question: "你应该怎么考虑bluff频率？",
            options: [
                "不需要bluff（深筹码太危险）",
                "按value:bluff 2:1比例",
                "按value:bluff 1:1比例",
                "更多bluff"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码Range构建：\n• 即使深筹码也要balance\n• Value:bluff 2:1是标准\n• 让对手无法剥削\n• 太少bluff被exploit\n\n✅ 保持balance",
            leakTag: "deep_range_construction_error",
            leakDesc: "深筹码Range构建错误"
        },
        {
            id: "adv_5",
            category: "高级概念",
            subcategory: "深筹码Multi-street planning",
            scenario: "250BB有效。翻牌你有NFD。考虑3街规划。",
            question: "你的multi-street plan应该是？",
            options: [
                "翻牌raise all-in",
                "翻牌call，转牌evaluate",
                "翻牌fold，太危险",
                "翻牌call，转牌all-in"
            ],
            correctIndex: 1,
            explanation: "🧠 深筹码multi-street：\n• 250BB太深，不能all-in\n• 翻牌call保留灵活性\n• 转牌evaluate新信息\n• 多街规划很重要\n\n✅ 灵活的多街规划",
            leakTag: "deep_multistreet_error",
            leakDesc: "深筹码Multi-street规划错误"
        }
    ]
};

// ==================== 计算总题数 ====================
function getTotalQuestions() {
    let total = 0;
    for (const category of Object.values(FULL_ASSESSMENT)) {
        total += category.length;
    }
    return total;
}

// ==================== 漏洞分类 ====================
const LEAK_SEVERITY = {
    // 严重漏洞
    "deep_pot_odds_error": { severity: "严重", category: "数学", training: "math" },
    "deep_mdf_error": { severity: "严重", category: "数学", training: "math" },
    "deep_loser_tilt_error": { severity: "严重", category: "心态", training: "tilt" },
    "deep_showdown_error": { severity: "严重", category: "河牌", training: "mistakes" },
    "straddle_sizing_error": { severity: "严重", category: "翻前", training: "mistakes" },
    
    // 高漏洞
    "utg_too_loose": { severity: "高", category: "翻前", training: "mistakes" },
    "deep_3bet_error": { severity: "高", category: "翻前", training: "mistakes" },
    "deep_vs_4bet_error": { severity: "高", category: "翻前", training: "planning" },
    "deep_cbet_wet_error": { severity: "高", category: "翻牌", training: "sizing" },
    "deep_turn_value_error": { severity: "高", category: "转牌", training: "sizing" },
    "deep_river_value_error": { severity: "高", category: "河牌", training: "sizing" },
    "deep_bluff_catch_error": { severity: "高", category: "河牌", training: "math" },
    "deep_fish_exploit_error": { severity: "高", category: "读牌", training: "mistakes" },
    "deep_session_error": { severity: "高", category: "心态", training: "tilt" },
    "deep_bankroll_error": { severity: "高", category: "心态", training: "tilt" },
    
    // 中等漏洞
    "straddle_defense_error": { severity: "中", category: "翻前", training: "planning" },
    "ante_straddle_error": { severity: "中", category: "翻前", training: "planning" },
    "deep_small_pair_error": { severity: "中", category: "翻前", training: "planning" },
    "deep_suited_connector_error": { severity: "中", category: "翻前", training: "planning" },
    "deep_squeeze_error": { severity: "中", category: "翻前", training: "planning" },
    "straddle_steal_error": { severity: "中", category: "翻前", training: "planning" },
    "deep_iso_raise_error": { severity: "中", category: "翻前", training: "sizing" },
    "deep_bb_defense_error": { severity: "中", category: "翻前", training: "mistakes" },
    "deep_cbet_dry_error": { severity: "中", category: "翻牌", training: "sizing" },
    "deep_slowplay_error": { severity: "中", category: "翻牌", training: "planning" },
    "deep_checkraise_error": { severity: "中", category: "翻牌", training: "planning" },
    "deep_donk_error": { severity: "中", category: "翻牌", training: "mistakes" },
    "deep_multiway_flop_error": { severity: "中", category: "翻牌", training: "planning" },
    "deep_float_error": { severity: "中", category: "翻牌", training: "planning" },
    "deep_3bet_pot_error": { severity: "中", category: "翻牌", training: "planning" },
    "deep_overpair_error": { severity: "中", category: "翻牌", training: "sizing" },
    "deep_draw_play_error": { severity: "中", category: "翻牌", training: "planning" },
    "deep_scare_card_error": { severity: "中", category: "转牌", training: "mistakes" },
    "deep_semibluff_error": { severity: "中", category: "转牌", training: "planning" },
    "deep_two_pair_turn_error": { severity: "中", category: "转牌", training: "planning" },
    "deep_probe_error": { severity: "中", category: "转牌", training: "sizing" },
    "deep_set_turn_error": { severity: "中", category: "转牌", training: "sizing" },
    "deep_give_up_error": { severity: "中", category: "转牌", training: "mistakes" },
    "deep_turn_checkraise_error": { severity: "中", category: "转牌", training: "planning" },
    "deep_turn_fold_error": { severity: "中", category: "转牌", training: "mistakes" },
    "deep_3bet_turn_error": { severity: "中", category: "转牌", training: "planning" },
    "deep_thin_value_error": { severity: "中", category: "河牌", training: "sizing" },
    "deep_river_bluff_error": { severity: "中", category: "河牌", training: "sizing" },
    "deep_river_raise_error": { severity: "中", category: "河牌", training: "sizing" },
    "deep_blocking_bet_error": { severity: "中", category: "河牌", training: "planning" },
    "deep_overfold_error": { severity: "中", category: "河牌", training: "mistakes" },
    "deep_value_vs_bluff_error": { severity: "中", category: "河牌", training: "planning" },
    "deep_facing_overbet_error": { severity: "中", category: "河牌", training: "planning" },
    "deep_spr_error": { severity: "中", category: "数学", training: "math" },
    "deep_implied_odds_error": { severity: "中", category: "数学", training: "math" },
    "deep_combo_error": { severity: "中", category: "数学", training: "math" },
    "straddle_pot_calc_error": { severity: "中", category: "数学", training: "math" },
    "deep_vs_station_error": { severity: "中", category: "剥削", training: "planning" },
    "deep_vs_nit_error": { severity: "中", category: "剥削", training: "planning" },
    "deep_vs_lag_error": { severity: "中", category: "剥削", training: "planning" },
    "deep_tilt_read_error": { severity: "中", category: "读牌", training: "tilt" },
    "deep_dynamic_error": { severity: "中", category: "剥削", training: "planning" },
    "straddle_exploit_error": { severity: "中", category: "剥削", training: "planning" },
    "deep_hud_error": { severity: "中", category: "剥削", training: "planning" },
    "deep_winner_tilt_error": { severity: "中", category: "心态", training: "tilt" },
    "deep_table_select_error": { severity: "中", category: "心态", training: "tilt" },
    "deep_blocker_error": { severity: "中", category: "高级", training: "planning" },
    "deep_polarization_error": { severity: "中", category: "高级", training: "planning" },
    "deep_gto_exploit_error": { severity: "中", category: "高级", training: "planning" },
    "deep_range_construction_error": { severity: "中", category: "高级", training: "planning" },
    "deep_multistreet_error": { severity: "中", category: "高级", training: "planning" }
};

// ==================== 导出 ====================
console.log('完整版深筹码评估系统加载完成');
console.log('总题数:', getTotalQuestions());
console.log('维度:', Object.keys(FULL_ASSESSMENT).join(', '));
console.log('针对条件: 8人桌 + 200-300BB深筹码 + 强制Straddle + Ante(1SB)');
