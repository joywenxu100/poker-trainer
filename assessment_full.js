// 完整版漏洞评估系统 - 50题全方位诊断
// 目标：找出每一个漏洞，实现0失误
// 版本: 2.0.0

// ==================== 完整评估题库 ====================
const FULL_ASSESSMENT = {
    // ==================== 第一部分：翻前决策 (10题) ====================
    preflop: [
        {
            id: "pre_1",
            category: "翻前决策",
            subcategory: "早位范围",
            scenario: "8人桌100BB有效。你在UTG拿到AJo。",
            question: "你应该怎么做？",
            options: ["Open 2.5BB", "Open 3BB", "Fold", "Limp"],
            correctIndex: 2,
            explanation: "🧠 UTG需要最紧范围(~15%)：\n• AJo是dominated hand\n• 被3bet后很尴尬\n• AJs可以open，AJo应该fold\n\n✅ Fold是正确选择",
            leakTag: "utg_too_loose",
            leakDesc: "UTG范围太松"
        },
        {
            id: "pre_2",
            category: "翻前决策",
            subcategory: "3bet sizing",
            scenario: "CO open到2.5BB，你在BTN拿到QQ。",
            question: "你的3bet应该多大？",
            options: ["7BB", "9BB", "12BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 IP 3bet sizing：\n• 标准是3-3.5x开池\n• 2.5 × 3.5 = 8.75 ≈ 9BB\n• 太小给对手好价格\n• 太大只被坚果call\n\n✅ 9BB是标准sizing",
            leakTag: "3bet_sizing_error",
            leakDesc: "3bet sizing不标准"
        },
        {
            id: "pre_3",
            category: "翻前决策",
            subcategory: "面对3bet",
            scenario: "你在CO open 2.5BB，BTN 3bet到9BB。你拿到AQo。100BB有效。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "4bet to 22BB", "All-in"],
            correctIndex: 1,
            explanation: "🧠 AQo面对3bet：\n• AQo不够强4bet（会被5bet all-in尴尬）\n• 不够弱fold（太多equity）\n• IP call是最佳选择\n• 可以打好翻后\n\n✅ Call是正确选择",
            leakTag: "vs_3bet_error",
            leakDesc: "面对3bet决策错误"
        },
        {
            id: "pre_4",
            category: "翻前决策",
            subcategory: "4bet",
            scenario: "你在BTN open，SB 3bet，你拿到JJ。对手是激进玩家(3bet 12%)。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "4bet small (22BB)", "4bet all-in"],
            correctIndex: 2,
            explanation: "🧠 vs高频3bet的JJ：\n• 对手3bet 12%太宽\n• JJ对抗宽3bet range很强\n• 4bet small给自己留后路\n• All-in太极端\n\n✅ 4bet to 22BB获取信息并施压",
            leakTag: "4bet_decision_error",
            leakDesc: "4bet决策错误"
        },
        {
            id: "pre_5",
            category: "翻前决策",
            subcategory: "Cold call",
            scenario: "UTG open 3BB，MP call。你在CO拿到88。100BB有效。",
            question: "你应该怎么做？",
            options: ["Fold", "Call (cold call)", "3bet to 12BB", "3bet to 15BB"],
            correctIndex: 1,
            explanation: "🧠 Cold call spot分析：\n• 88有足够隐含赔率set mine\n• 3bet会被UTG range碾压\n• BTN/SB可能squeeze\n• Call看翻牌是最佳\n\n✅ Cold call是正确选择",
            leakTag: "cold_call_error",
            leakDesc: "Cold call决策错误"
        },
        {
            id: "pre_6",
            category: "翻前决策",
            subcategory: "Squeeze",
            scenario: "CO open 2.5BB，BTN flat。你在SB拿到A5s。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 11BB (squeeze)", "3bet to 14BB"],
            correctIndex: 2,
            explanation: "🧠 完美squeeze spot：\n• CO open宽，BTN flat更宽\n• A5s有blocker+playability\n• 大sizing增加fold equity\n• 14BB太大，11BB足够\n\n✅ Squeeze to 11BB",
            leakTag: "squeeze_error",
            leakDesc: "Squeeze识别或sizing错误"
        },
        {
            id: "pre_7",
            category: "翻前决策",
            subcategory: "Ante调整",
            scenario: "8人桌有Ante(每人0.125BB)。你在CO，前面都fold。你拿到K9s。",
            question: "无Ante时这手牌是边缘open。有Ante你应该？",
            options: ["还是Fold", "Open 2BB", "Open 2.5BB", "Open 3BB"],
            correctIndex: 2,
            explanation: "🧠 Ante调整原理：\n• Ante增加了67%的死钱\n• 偷盲价值大增\n• K9s从边缘变成明确open\n• 保持标准sizing 2.5BB\n\n✅ Open 2.5BB是正确选择",
            leakTag: "ante_adjustment_error",
            leakDesc: "Ante调整不到位"
        },
        {
            id: "pre_8",
            category: "翻前决策",
            subcategory: "Deep stack翻前",
            scenario: "有效筹码250BB。你在BTN open，BB（TAG）3bet到12BB。你拿到76s。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "4bet", "All-in"],
            correctIndex: 1,
            explanation: "🧠 Deep stack 76s策略：\n• 250BB深度，隐含赔率巨大\n• 76s可以做很多nuts牌\n• IP对抗TAG可以打好翻后\n• 4bet毫无意义\n\n✅ Call利用深筹码",
            leakTag: "deep_stack_preflop_error",
            leakDesc: "深筹码翻前调整错误"
        },
        {
            id: "pre_9",
            category: "翻前决策",
            subcategory: "SB策略",
            scenario: "所有人fold到你。你在SB拿到Q4o。BB是紧凶玩家(VPIP 17%)。",
            question: "你应该怎么做？",
            options: ["Raise 2.5BB", "Raise 3BB", "Fold", "Limp"],
            correctIndex: 2,
            explanation: "🧠 vs紧凶BB的SB策略：\n• 紧凶会频繁3bet\n• Q4o被3bet必须fold\n• 即使call，OOP用弱Q打不好\n• 这是-EV操作\n\n✅ Fold是正确选择",
            leakTag: "sb_strategy_error",
            leakDesc: "SB策略错误"
        },
        {
            id: "pre_10",
            category: "翻前决策",
            subcategory: "Short stack",
            scenario: "你只有35BB。UTG（100BB）open到3BB。你在BTN拿到AJs。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "3bet to 9BB", "All-in"],
            correctIndex: 3,
            explanation: "🧠 Short stack AJs策略：\n• 35BB太浅，不能3bet小\n• 3bet小被4bet就尴尬\n• AJs对UTG range有足够equity\n• All-in是最清晰的打法\n\n✅ All-in避免翻后尴尬",
            leakTag: "short_stack_error",
            leakDesc: "短筹码策略错误"
        }
    ],

    // ==================== 第二部分：翻牌决策 (10题) ====================
    flop: [
        {
            id: "flop_1",
            category: "翻牌决策",
            subcategory: "C-bet干燥board",
            scenario: "你在CO open，BB call。Flop: A♠7♥2♣。你拿到KQo。BB check。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 25%", "Bet 50%", "Bet 75%"],
            correctIndex: 1,
            explanation: "🧠 Dry board c-bet策略：\n• Board干燥，对手大部分错过\n• 高频小bet是现代策略\n• 25% pot就能达到目的\n• 保持bluff便宜\n\n✅ Bet 25% pot",
            leakTag: "cbet_dry_error",
            leakDesc: "干燥board c-bet错误"
        },
        {
            id: "flop_2",
            category: "翻牌决策",
            subcategory: "C-bet湿润board",
            scenario: "你在BTN open，BB call。Flop: J♥T♠8♣。你拿到AA。BB check。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 33%", "Bet 66%", "Bet 100%"],
            correctIndex: 2,
            explanation: "🧠 Wet board AA策略：\n• 很多听牌和made hands\n• AA需要保护\n• 大bet让听牌付费\n• 66%是标准size\n\n✅ Bet 66% pot",
            leakTag: "cbet_wet_error",
            leakDesc: "湿润board c-bet错误"
        },
        {
            id: "flop_3",
            category: "翻牌决策",
            subcategory: "Check-raise",
            scenario: "BB vs BTN单挑。Flop: K♠7♥3♣。你（BB）有K7s（两对）。BTN c-bet 33%。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "Raise to 3x", "Raise to 4x"],
            correctIndex: 2,
            explanation: "🧠 两对check-raise策略：\n• K7是monster hand\n• Check-raise build pot\n• 3x是标准sizing\n• 太大吓跑对手\n\n✅ Raise to 3x c-bet",
            leakTag: "checkraise_error",
            leakDesc: "Check-raise决策错误"
        },
        {
            id: "flop_4",
            category: "翻牌决策",
            subcategory: "Float",
            scenario: "CO open，你在BTN call。Flop: Q♠8♥4♣。CO c-bet 50%。你拿到JTs。",
            question: "你应该怎么做？",
            options: ["Fold", "Call (float)", "Raise", "All-in"],
            correctIndex: 1,
            explanation: "🧠 Float策略：\n• JTs有后门听牌\n• 有位置可以float\n• 转牌很多好牌可以bluff\n• 对手可能放弃\n\n✅ Float call有位置操作",
            leakTag: "float_error",
            leakDesc: "Float决策错误"
        },
        {
            id: "flop_5",
            category: "翻牌决策",
            subcategory: "面对donk bet",
            scenario: "你在BTN open，BB call。Flop: 7♥6♥5♠。BB donk bet 75%。你拿到AA。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "Raise to 2.5x", "All-in"],
            correctIndex: 1,
            explanation: "🧠 面对donk bet的AA：\n• Donk bet通常表示draw或中等牌\n• AA仍然领先大部分range\n• Call让对手继续错误行动\n• Raise可能只被nuts call\n\n✅ Call控制底池获取信息",
            leakTag: "donk_response_error",
            leakDesc: "Donk bet应对错误"
        },
        {
            id: "flop_6",
            category: "翻牌决策",
            subcategory: "Range优势",
            scenario: "你在UTG open，BTN call。Flop: A♠K♥Q♣。你拿到JJ。",
            question: "你应该怎么做？",
            options: ["Check（没range优势）", "Bet 33%", "Bet 66%", "Bet 100%"],
            correctIndex: 0,
            explanation: "🧠 Range劣势分析：\n• 这board对BTN flat range有利\n• BTN有更多两对、顺子\n• JJ在这几乎没equity\n• Check是标准打法\n\n✅ Check因为range劣势",
            leakTag: "range_advantage_error",
            leakDesc: "Range优势判断错误"
        },
        {
            id: "flop_7",
            category: "翻牌决策",
            subcategory: "多人底池",
            scenario: "你在CO open，BTN和BB都call。Flop: T♥7♠4♣。你拿到AK。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 25%", "Bet 50%", "Bet 75%"],
            correctIndex: 0,
            explanation: "🧠 多人底池AK miss：\n• AK完全没击中\n• 多人底池需要更强牌\n• C-bet不会让2人都fold\n• Check等待好牌或放弃\n\n✅ Check是正确选择",
            leakTag: "multiway_flop_error",
            leakDesc: "多人底池翻牌决策错误"
        },
        {
            id: "flop_8",
            category: "翻牌决策",
            subcategory: "3bet pot",
            scenario: "你在BTN 3bet，BB call。Flop: 9♠6♥3♣。你拿到AKo。BB check。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 25%", "Bet 50%", "Bet 75%"],
            correctIndex: 1,
            explanation: "🧠 3bet pot c-bet策略：\n• 3bet pot你有range优势\n• 小bet维持压力\n• 保持高频c-bet\n• 25%就足够\n\n✅ Bet 25% pot",
            leakTag: "3bet_pot_flop_error",
            leakDesc: "3bet pot翻牌策略错误"
        },
        {
            id: "flop_9",
            category: "翻牌决策",
            subcategory: "Probe bet",
            scenario: "BTN open，你在BB call。Flop: K♠8♥3♣。BTN check。你拿到A8s。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 33%", "Bet 66%", "Bet 100%"],
            correctIndex: 1,
            explanation: "🧠 Probe bet机会：\n• 对手check back说明弱\n• A8有第二对+overcard\n• 小bet获取价值\n• 也可能让更好的K fold\n\n✅ Probe bet 33%",
            leakTag: "probe_bet_error",
            leakDesc: "Probe bet决策错误"
        },
        {
            id: "flop_10",
            category: "翻牌决策",
            subcategory: "Set慢打vs快打",
            scenario: "你在BTN open，BB call。Flop: A♥7♣2♠。你拿到77（set）。BB check。",
            question: "你应该怎么做？",
            options: ["Check（慢打trap）", "Bet 25%", "Bet 50%", "Bet 75%"],
            correctIndex: 1,
            explanation: "🧠 Set在干燥board：\n• Board太干燥，没有draw来pay off\n• 慢打可能免费亮牌\n• 小bet让Ax call\n• Build pot for later streets\n\n✅ 小bet开始build pot",
            leakTag: "set_play_error",
            leakDesc: "Set打法错误"
        }
    ],

    // ==================== 第三部分：转牌决策 (8题) ====================
    turn: [
        {
            id: "turn_1",
            category: "转牌决策",
            subcategory: "价值barrel",
            scenario: "翻牌你c-bet AA被call。Turn: 空白牌。对手check。",
            question: "你应该怎么做？",
            options: ["Check（控制底池）", "Bet 50%", "Bet 75%", "Bet 100%"],
            correctIndex: 2,
            explanation: "🧠 AA转牌价值：\n• AA几乎总是领先\n• 对手call range有很多worse\n• 75%是标准size\n• 不要check白白错过价值\n\n✅ Bet 75%继续价值",
            leakTag: "value_barrel_error",
            leakDesc: "价值barrel决策错误"
        },
        {
            id: "turn_2",
            category: "转牌决策",
            subcategory: "Bluff barrel",
            scenario: "翻牌c-bet QJs被call。Board: K♠8♥4♣→5♦。你没有击中。对手check。",
            question: "你应该怎么做？",
            options: ["Check（放弃）", "Bet 33%", "Bet 66%", "All-in"],
            correctIndex: 0,
            explanation: "🧠 无equity的barrel分析：\n• 你没有任何equity\n• 对手call说明有K或中对\n• 5是空白牌，不改变局面\n• 放弃是最佳选择\n\n✅ Check放弃",
            leakTag: "bluff_barrel_error",
            leakDesc: "Bluff barrel决策错误"
        },
        {
            id: "turn_3",
            category: "转牌决策",
            subcategory: "Semi-bluff",
            scenario: "翻牌float成功，转牌来了同花第三张。你有A♥作为blocker和♥♥听牌。对手check。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 33%", "Bet 75%", "All-in"],
            correctIndex: 2,
            explanation: "🧠 恐怖牌semi-bluff：\n• 转牌同花牌是恐怖牌\n• 你有nut flush blocker\n• 大bet代表made flush\n• 对手没flush会fold很多\n\n✅ 大bet利用恐怖牌",
            leakTag: "semibluff_turn_error",
            leakDesc: "转牌semi-bluff错误"
        },
        {
            id: "turn_4",
            category: "转牌决策",
            subcategory: "恐怖牌处理",
            scenario: "你翻牌c-bet顶对被call。Turn: 同花完成牌。对手check。",
            question: "你应该怎么做？",
            options: ["Check", "Bet 33%", "Bet 66%", "Bet 100%"],
            correctIndex: 0,
            explanation: "🧠 面对恐怖牌的顶对：\n• 同花完成是最糟糕的牌\n• 顶对变成bluff catcher\n• 下注只被更好的call\n• Check控制底池\n\n✅ Check是标准打法",
            leakTag: "scare_card_error",
            leakDesc: "恐怖牌处理错误"
        },
        {
            id: "turn_5",
            category: "转牌决策",
            subcategory: "Turn check-raise",
            scenario: "你在BB call BTN open。Flop check-check。Turn给你同花。你check，BTN bet 66%。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "Raise to 2.5x", "All-in"],
            correctIndex: 2,
            explanation: "🧠 Made hand check-raise：\n• 你有nuts(同花)\n• 对手bet说明有牌\n• Check-raise build pot\n• 2.5x是标准size\n\n✅ Raise获取最大价值",
            leakTag: "turn_checkraise_error",
            leakDesc: "转牌check-raise决策错误"
        },
        {
            id: "turn_6",
            category: "转牌决策",
            subcategory: "Two pair+策略",
            scenario: "你翻牌c-bet两对被call。Turn空白。对手check。Pot: 30BB。",
            question: "你应该下多少？",
            options: ["Check", "10BB (33%)", "20BB (66%)", "30BB (100%)"],
            correctIndex: 2,
            explanation: "🧠 两对价值下注：\n• 两对非常强\n• 需要build pot for river\n• 66%是标准size\n• 让对手pay with worse\n\n✅ 66% pot build底池",
            leakTag: "two_pair_turn_error",
            leakDesc: "两对+转牌策略错误"
        },
        {
            id: "turn_7",
            category: "转牌决策",
            subcategory: "面对turn bet",
            scenario: "你翻牌call了c-bet（有顺子听牌）。Turn空白。对手继续bet 75%。",
            question: "你有8 outs，Pot odds给你25%。你应该？",
            options: ["Fold（odds不够）", "Call（有隐含赔率）", "Raise bluff", "All-in"],
            correctIndex: 1,
            explanation: "🧠 Turn draw call分析：\n• 8 outs ≈ 17%直接odds\n• 但有隐含赔率！\n• 击中可以赢更多\n• Call是正确选择\n\n✅ Call利用隐含赔率",
            leakTag: "turn_draw_error",
            leakDesc: "Turn听牌决策错误"
        },
        {
            id: "turn_8",
            category: "转牌决策",
            subcategory: "Give up识别",
            scenario: "3bet pot。翻牌c-bet空气牌被call。转牌空白。你完全没equity。",
            question: "你应该怎么做？",
            options: ["Check（give up）", "Bet 33%", "Bet 66%", "All-in"],
            correctIndex: 0,
            explanation: "🧠 Give up判断：\n• 3bet pot SPR已经低\n• 对手call说明有牌\n• 你0 equity\n• 继续bluff是烧钱\n\n✅ 识别时机give up",
            leakTag: "give_up_error",
            leakDesc: "Give up时机判断错误"
        }
    ],

    // ==================== 第四部分：河牌决策 (8题) ====================
    river: [
        {
            id: "river_1",
            category: "河牌决策",
            subcategory: "Value bet sizing",
            scenario: "河牌你有nuts。对手是跟注站。Pot: 50BB。",
            question: "你应该下多少？",
            options: ["25BB (50%)", "40BB (80%)", "65BB (130%)", "All-in"],
            correctIndex: 2,
            explanation: "🧠 vs跟注站的nuts：\n• 跟注站不根据size调整\n• 他们要么call要么fold\n• 最大化单次value\n• Overbet是最佳选择\n\n✅ 130% overbet",
            leakTag: "river_value_sizing_error",
            leakDesc: "河牌value sizing错误"
        },
        {
            id: "river_2",
            category: "河牌决策",
            subcategory: "Thin value",
            scenario: "河牌你有顶对中等kicker(KT on K高board)。对手check。Pot: 40BB。",
            question: "你应该怎么做？",
            options: ["Check back", "Bet 15BB", "Bet 30BB", "Bet 50BB"],
            correctIndex: 1,
            explanation: "🧠 Thin value分析：\n• KT是中等强度\n• 对手可能有worse K或中对\n• 小bet让worse hands call\n• 大bet只被better K call\n\n✅ 小bet薄价值",
            leakTag: "thin_value_error",
            leakDesc: "Thin value决策错误"
        },
        {
            id: "river_3",
            category: "河牌决策",
            subcategory: "Bluff catch",
            scenario: "对手河牌bet 100%pot。你有bluff catcher(顶对弱kicker)。他是LAG。",
            question: "你应该怎么做？",
            options: ["Fold", "Call", "Raise", "Tank-fold"],
            correctIndex: 1,
            explanation: "🧠 vs LAG的bluff catch：\n• LAG会over-bluff\n• MDF说明你要defend 50%\n• 顶对在你的range顶端\n• 应该call\n\n✅ Call因为MDF+对手类型",
            leakTag: "bluff_catch_error",
            leakDesc: "Bluff catch决策错误"
        },
        {
            id: "river_4",
            category: "河牌决策",
            subcategory: "Bluff sizing",
            scenario: "河牌你有missed draw(空气)。对手check。他的range很weak。",
            question: "你应该下多大的bluff？",
            options: ["不bluff，check", "33% pot", "75% pot", "150% pot"],
            correctIndex: 2,
            explanation: "🧠 河牌bluff sizing：\n• 对手range weak\n• 需要足够大让他fold made hands\n• 75%是标准bluff size\n• 太小没有fold equity\n\n✅ 75% pot bluff",
            leakTag: "river_bluff_sizing_error",
            leakDesc: "河牌bluff sizing错误"
        },
        {
            id: "river_5",
            category: "河牌决策",
            subcategory: "Showdown value",
            scenario: "河牌你有中等牌(第二对)。对手check。你在IP。",
            question: "你应该怎么做？",
            options: ["Check back（有showdown value）", "Bet 33%", "Bet 66%", "Bet 100%"],
            correctIndex: 0,
            explanation: "🧠 Showdown value识别：\n• 第二对有showdown value\n• 下注=变成bluff\n• Worse fold, better call\n• Check back是正确选择\n\n✅ 保护showdown value",
            leakTag: "showdown_value_error",
            leakDesc: "Showdown value识别错误"
        },
        {
            id: "river_6",
            category: "河牌决策",
            subcategory: "River raise",
            scenario: "河牌你有nuts。对手bet 50%pot。Pot: 60BB，他bet 30BB。",
            question: "你应该怎么做？",
            options: ["Call（慢打）", "Raise to 80BB", "Raise to 120BB", "All-in（200BB effective）"],
            correctIndex: 2,
            explanation: "🧠 River raise sizing：\n• 你有nuts，必须raise\n• Call损失巨大价值\n• All-in可能吓跑\n• 120BB给他可call的size\n\n✅ Raise to 120BB",
            leakTag: "river_raise_error",
            leakDesc: "River raise决策错误"
        },
        {
            id: "river_7",
            category: "河牌决策",
            subcategory: "Blocking bet",
            scenario: "河牌你有中等牌，OOP。对手可能有更好的牌或bluff。Pot: 50BB。",
            question: "你应该怎么做？",
            options: ["Check（让他决定）", "Bet 10BB（blocking bet）", "Bet 25BB", "Bet 40BB"],
            correctIndex: 1,
            explanation: "🧠 Blocking bet策略：\n• 小bet阻止大bet/bluff\n• 控制底池大小\n• 给自己好价格看showdown\n• 也可能被raise需要fold\n\n✅ 10BB blocking bet",
            leakTag: "blocking_bet_error",
            leakDesc: "Blocking bet使用错误"
        },
        {
            id: "river_8",
            category: "河牌决策",
            subcategory: "Over-fold识别",
            scenario: "对手是Nit(只用value下大注)。河牌他overbet 150%pot。你有顶对。",
            question: "你应该怎么做？",
            options: ["Fold（他只有nuts）", "Call（不能总是fold）", "Raise bluff", "Tank-call"],
            correctIndex: 0,
            explanation: "🧠 vs Nit的over-fold：\n• Nit不会用这size bluff\n• 150% pot = 只有nuts\n• MDF不适用于Nit\n• Fold是正确选择\n\n✅ Over-fold vs Nit",
            leakTag: "overfold_error",
            leakDesc: "Over-fold识别错误"
        }
    ],

    // ==================== 第五部分：数学计算 (6题) ====================
    math: [
        {
            id: "math_1",
            category: "数学计算",
            subcategory: "底池赔率",
            scenario: "Pot: 80BB。对手bet 40BB。",
            question: "你需要多少胜率才能盈利call？",
            options: ["20%", "25%", "33%", "40%"],
            correctIndex: 1,
            explanation: "🧠 底池赔率公式：\n• Call/(Pot+Bet+Call)\n• 40/(80+40+40) = 40/160 = 25%\n\n✅ 需要25%胜率",
            leakTag: "pot_odds_error",
            leakDesc: "底池赔率计算错误"
        },
        {
            id: "math_2",
            category: "数学计算",
            subcategory: "Outs和胜率",
            scenario: "翻牌你有同花+顺子听牌(15 outs)。",
            question: "翻牌到河牌的胜率大约是？",
            options: ["35%", "45%", "54%", "60%"],
            correctIndex: 2,
            explanation: "🧠 Rule of 4：\n• 15 outs × 4 = 60%\n• 实际约54%（有重叠）\n• 非常强的听牌\n\n✅ 约54%",
            leakTag: "outs_calc_error",
            leakDesc: "Outs胜率计算错误"
        },
        {
            id: "math_3",
            category: "数学计算",
            subcategory: "MDF",
            scenario: "对手bet 75% pot。",
            question: "你的最小防守频率(MDF)是？",
            options: ["43%", "50%", "57%", "67%"],
            correctIndex: 2,
            explanation: "🧠 MDF公式：\n• MDF = 1 - Bet/(Pot+Bet)\n• 1 - 75/175 = 1 - 0.43 = 57%\n\n✅ MDF是57%",
            leakTag: "mdf_calc_error",
            leakDesc: "MDF计算错误"
        },
        {
            id: "math_4",
            category: "数学计算",
            subcategory: "Combo计数",
            scenario: "Board: K♠Q♥。对手range有AK和KQ。",
            question: "他有多少combos的两对或更好？",
            options: ["4 combos", "6 combos", "9 combos", "12 combos"],
            correctIndex: 2,
            explanation: "🧠 Combo计算：\n• KQ(两对)：剩余3K×3Q=9 combos\n• AK不是两对\n\n✅ 9 combos KQ两对",
            leakTag: "combo_calc_error",
            leakDesc: "Combo计算错误"
        },
        {
            id: "math_5",
            category: "数学计算",
            subcategory: "SPR决策",
            scenario: "翻牌Pot: 20BB，有效筹码: 80BB。你有overpair。",
            question: "SPR是多少？应该怎么考虑？",
            options: ["SPR=4，可以直接stack off", "SPR=4，需要谨慎", "SPR=2，必须stack off", "SPR=8，需要三街价值"],
            correctIndex: 0,
            explanation: "🧠 SPR分析：\n• SPR = Stack/Pot = 80/20 = 4\n• SPR<4 = overpair可以stack off\n• SPR≈4 = 边缘，但AA/KK可以\n\n✅ SPR=4，overpair可以commit",
            leakTag: "spr_decision_error",
            leakDesc: "SPR决策错误"
        },
        {
            id: "math_6",
            category: "数学计算",
            subcategory: "EV计算",
            scenario: "Pot: 100。你bet 50，对手fold 60%。如果call你有40%胜率。",
            question: "这个bet的EV是？",
            options: ["-10", "0", "+10", "+20"],
            correctIndex: 2,
            explanation: "🧠 EV计算：\n• Fold: 0.6 × 100 = +60\n• Call赢: 0.4 × 0.4 × 150 = +24\n• Call输: 0.4 × 0.6 × (-50) = -12\n• Total = 60+24-12 = +72\n• vs Check EV(40) = +32增量\n\n实际增量约+10-20之间",
            leakTag: "ev_calc_error",
            leakDesc: "EV计算错误"
        }
    ],

    // ==================== 第六部分：对手分析与剥削 (8题) ====================
    exploit: [
        {
            id: "exp_1",
            category: "对手分析",
            subcategory: "类型识别",
            scenario: "对手数据：VPIP 52%, PFR 6%, 3bet 2%, AF 0.8",
            question: "这是什么类型？最佳剥削策略？",
            options: [
                "鱼/跟注站 - 多value少bluff",
                "LAG - 设陷阱",
                "Nit - 多偷盲",
                "TAG - 标准打法"
            ],
            correctIndex: 0,
            explanation: "🧠 数据分析：\n• VPIP 52% = 极松\n• PFR 6% = 极被动\n• AF 0.8 = 被动\n\n🐟 典型鱼！多value，少bluff",
            leakTag: "fish_identify_error",
            leakDesc: "鱼识别错误"
        },
        {
            id: "exp_2",
            category: "对手分析",
            subcategory: "vs鱼策略",
            scenario: "你在河牌有顶对。对手是鱼(会call任何对子)。Pot: 50BB。",
            question: "你应该bet多少？",
            options: ["Check", "20BB (40%)", "40BB (80%)", "75BB (150%)"],
            correctIndex: 3,
            explanation: "🧠 vs鱼的value sizing：\n• 鱼不根据size决策\n• 他们要么call要么fold\n• 最大化value = overbet\n\n✅ 150% pot max value",
            leakTag: "vs_fish_sizing_error",
            leakDesc: "vs鱼sizing错误"
        },
        {
            id: "exp_3",
            category: "对手分析",
            subcategory: "vs Nit策略",
            scenario: "Nit(VPIP 10%, Fold to steal 85%)在BB。你在BTN拿到J4o。",
            question: "你应该怎么做？",
            options: ["Fold", "Raise 2.5BB", "Raise 2BB", "Limp"],
            correctIndex: 2,
            explanation: "🧠 vs Nit偷盲：\n• Fold to steal 85%！\n• 任何两张都可以偷\n• 小size节省被3bet的损失\n• 2BB足够\n\n✅ 小raise偷盲印钞机",
            leakTag: "vs_nit_steal_error",
            leakDesc: "vs Nit偷盲策略错误"
        },
        {
            id: "exp_4",
            category: "对手分析",
            subcategory: "vs LAG策略",
            scenario: "LAG(VPIP 35%, 3bet 14%)在你后面。你在CO拿到AQo。",
            question: "你应该怎么做？",
            options: ["Fold（避免被3bet）", "Open 2.5BB", "Open 3BB", "Open-fold计划"],
            correctIndex: 1,
            explanation: "🧠 vs LAG的策略：\n• AQo是强牌，不能怕3bet\n• 准备好call 3bet\n• 标准sizing 2.5BB\n• 不要因为LAG而改变\n\n✅ 标准open，准备应对3bet",
            leakTag: "vs_lag_preflop_error",
            leakDesc: "vs LAG翻前策略错误"
        },
        {
            id: "exp_5",
            category: "对手分析",
            subcategory: "Tilt识别",
            scenario: "对手刚输了大底池。下一手UTG open 5BB(平常2.5BB)。",
            question: "这说明什么？你应该怎么调整？",
            options: [
                "他有大牌，fold更多",
                "可能tilt，用强牌trap",
                "没什么特别的",
                "他在演，更要小心"
            ],
            correctIndex: 1,
            explanation: "🧠 Tilt信号：\n• 输钱后sizing变大是典型tilt\n• 想\"赢回来\"\n• 准备用强牌给他action\n• 不要bluff他\n\n✅ 识别tilt，trap他",
            leakTag: "tilt_read_error",
            leakDesc: "Tilt识别错误"
        },
        {
            id: "exp_6",
            category: "对手分析",
            subcategory: "动态调整",
            scenario: "你已经3bet这个对手3次了，他每次都fold。现在你又有位置。",
            question: "你应该怎么调整？",
            options: [
                "继续3bet更多",
                "回归标准频率",
                "他应该调整了，更少3bet",
                "All-in压力最大"
            ],
            correctIndex: 0,
            explanation: "🧠 动态剥削：\n• 他还没调整\n• 继续剥削直到他调整\n• 当他开始fight back再调整\n• 不要自己先怂\n\n✅ 继续剥削！",
            leakTag: "dynamic_adjust_error",
            leakDesc: "动态调整错误"
        },
        {
            id: "exp_7",
            category: "对手分析",
            subcategory: "剥削边界",
            scenario: "你已经对某个reg用了很多剥削策略。他开始调整。",
            question: "你应该怎么做？",
            options: [
                "继续剥削，不能怂",
                "立即回归GTO",
                "减少剥削幅度",
                "换桌避开他"
            ],
            correctIndex: 1,
            explanation: "🧠 剥削边界：\n• 被发现就要调整\n• GTO是安全退路\n• 过度剥削会被反剥削\n• 回归GTO等待新机会\n\n✅ 立即回归GTO",
            leakTag: "exploit_boundary_error",
            leakDesc: "剥削边界把握错误"
        },
        {
            id: "exp_8",
            category: "对手分析",
            subcategory: "HUD数据解读",
            scenario: "对手Fold to C-bet 70%, Fold to Turn bet 75%。",
            question: "你应该怎么调整c-bet策略？",
            options: [
                "减少c-bet（他fold太多）",
                "增加c-bet频率和barrel",
                "只用value c-bet",
                "随机c-bet"
            ],
            correctIndex: 1,
            explanation: "🧠 HUD数据剥削：\n• Fold to cbet 70% = 太高\n• 任何两张都可以c-bet\n• 转牌继续barrel\n• 他在送钱！\n\n✅ 高频c-bet+barrel",
            leakTag: "hud_read_error",
            leakDesc: "HUD数据解读错误"
        }
    ],

    // ==================== 第七部分：心态与Session管理 (5题) ====================
    mental: [
        {
            id: "mental_1",
            category: "心态管理",
            subcategory: "Loser's tilt",
            scenario: "你今天输了4个buy-in。你发现自己开始用更宽的range 3bet。",
            question: "你应该怎么做？",
            options: [
                "继续打，技术会赢回来",
                "立即下桌休息",
                "换到更低级别",
                "加大力度更激进"
            ],
            correctIndex: 1,
            explanation: "🧠 Tilt识别：\n• Range变宽是tilt症状\n• 想\"赢回来\"只会输更多\n• 必须立即停止\n\n✅ 下桌是唯一选择",
            leakTag: "loser_tilt_error",
            leakDesc: "Loser's tilt识别错误"
        },
        {
            id: "mental_2",
            category: "心态管理",
            subcategory: "Winner's tilt",
            scenario: "你今天赢了6个buy-in。你开始觉得\"今天运气好可以多浪一点\"。",
            question: "你应该怎么做？",
            options: [
                "趁热打铁继续浪",
                "识别winner's tilt，保持标准",
                "再打一会看情况",
                "加大下注因为有cushion"
            ],
            correctIndex: 1,
            explanation: "🧠 Winner's tilt同样危险：\n• 觉得运气好会让你放松标准\n• 可能把赢的全部还回去\n• 每一手都要按标准打\n\n✅ 保持标准，保护战果",
            leakTag: "winner_tilt_error",
            leakDesc: "Winner's tilt识别错误"
        },
        {
            id: "mental_3",
            category: "心态管理",
            subcategory: "Session管理",
            scenario: "你已经打了7小时。赢了2个buy-in。开始感觉有点累。",
            question: "你应该怎么做？",
            options: [
                "继续打，还在状态中",
                "再打1小时就停",
                "立即停止session",
                "休息15分钟继续"
            ],
            correctIndex: 2,
            explanation: "🧠 Session管理：\n• 7小时太长\n• 疲劳会严重影响决策\n• 赢着停比输着停好\n• 保护战果\n\n✅ 立即停止",
            leakTag: "session_length_error",
            leakDesc: "Session长度管理错误"
        },
        {
            id: "mental_4",
            category: "心态管理",
            subcategory: "资金管理",
            scenario: "你的bankroll是50个buy-in。你最近输了15个buy-in。",
            question: "你应该怎么做？",
            options: [
                "继续打同级别赢回来",
                "考虑降级",
                "打更高级别快速恢复",
                "休息一天继续"
            ],
            correctIndex: 1,
            explanation: "🧠 资金管理：\n• 35 buy-in已经不够safe\n• 可能是打法有问题\n• 降级减少压力\n• 恢复后再升级\n\n✅ 降级保护bankroll",
            leakTag: "bankroll_mgmt_error",
            leakDesc: "资金管理错误"
        },
        {
            id: "mental_5",
            category: "心态管理",
            subcategory: "桌选",
            scenario: "你发现当前桌的玩家都是reg，没有鱼。",
            question: "你应该怎么做？",
            options: [
                "继续打，练习vs reg",
                "等待，看有没有鱼来",
                "换桌找鱼",
                "加大力度剥削reg"
            ],
            correctIndex: 2,
            explanation: "🧠 桌选的重要性：\n• vs reg的EV远低于vs鱼\n• 不要用自己的时间\"练习\"\n• 找有鱼的桌才是正道\n\n✅ 换桌找鱼",
            leakTag: "table_selection_error",
            leakDesc: "桌选意识错误"
        }
    ],

    // ==================== 第八部分：高级概念 (5题) ====================
    advanced: [
        {
            id: "adv_1",
            category: "高级概念",
            subcategory: "Blocker运用",
            scenario: "河牌board: A♠K♥T♣7♦3♠。你拿到Q♠J♠(有A-high的顺子blocker)。对手check。",
            question: "你应该怎么做？",
            options: [
                "Check（没有showdown value）",
                "小bet bluff",
                "大bet bluff(有blocker)",
                "All-in"
            ],
            correctIndex: 2,
            explanation: "🧠 Blocker bluff：\n• 你block QJ顺子\n• 对手很难有nuts\n• 有利于bluff\n• 大bet代表nuts\n\n✅ 利用blocker大bet bluff",
            leakTag: "blocker_use_error",
            leakDesc: "Blocker运用错误"
        },
        {
            id: "adv_2",
            category: "高级概念",
            subcategory: "Polarization",
            scenario: "河牌你在IP，有medium strength hand。对手check。",
            question: "Polarized策略下你应该？",
            options: [
                "Bet（任何牌都要bet）",
                "Check（medium不属于polarized range）",
                "小bet",
                "overbet"
            ],
            correctIndex: 1,
            explanation: "🧠 Polarized范围：\n• Polarized = nuts或bluff\n• Medium不在betting range\n• Check获取showdown value\n\n✅ Medium hand不bet",
            leakTag: "polarization_error",
            leakDesc: "Polarization理解错误"
        },
        {
            id: "adv_3",
            category: "高级概念",
            subcategory: "GTO vs Exploit切换",
            scenario: "你面对一个unknown player。不确定他的风格。",
            question: "你应该怎么打？",
            options: [
                "激进剥削",
                "打GTO baseline",
                "非常紧",
                "试探他的风格"
            ],
            correctIndex: 1,
            explanation: "🧠 GTO vs Exploit：\n• vs Unknown用GTO\n• 收集信息后再剥削\n• GTO是安全默认\n\n✅ 从GTO开始",
            leakTag: "gto_exploit_switch_error",
            leakDesc: "GTO/Exploit切换错误"
        },
        {
            id: "adv_4",
            category: "高级概念",
            subcategory: "Range构建",
            scenario: "你在河牌想要bluff。你的range里已经有很多value hands。",
            question: "你应该怎么考虑bluff频率？",
            options: [
                "不需要bluff",
                "按value:bluff 2:1比例",
                "随机决定",
                "看心情"
            ],
            correctIndex: 1,
            explanation: "🧠 Range构建：\n• Value多时需要bluff平衡\n• 通常value:bluff = 2:1\n• 让对手无法剥削\n\n✅ 按比例构建range",
            leakTag: "range_construction_error",
            leakDesc: "Range构建错误"
        },
        {
            id: "adv_5",
            category: "高级概念",
            subcategory: "Equity realization",
            scenario: "你在BB面对BTN open。你拿到K9o。",
            question: "考虑equity realization，你应该？",
            options: [
                "3bet（有equity）",
                "Call",
                "Fold（equity realization低）",
                "All-in"
            ],
            correctIndex: 2,
            explanation: "🧠 Equity Realization：\n• K9o在BB vs BTN有equity\n• 但OOP equity realization差\n• 实际能赢的比例低\n• Fold比call好\n\n✅ 考虑EQR后fold",
            leakTag: "eq_realization_error",
            leakDesc: "Equity realization理解错误"
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
    "pot_odds_error": { severity: "严重", category: "数学", training: "math" },
    "mdf_calc_error": { severity: "严重", category: "数学", training: "math" },
    "loser_tilt_error": { severity: "严重", category: "心态", training: "tilt" },
    "showdown_value_error": { severity: "严重", category: "河牌", training: "mistakes" },
    
    // 高漏洞
    "utg_too_loose": { severity: "高", category: "翻前", training: "mistakes" },
    "vs_3bet_error": { severity: "高", category: "翻前", training: "mistakes" },
    "4bet_decision_error": { severity: "高", category: "翻前", training: "planning" },
    "cbet_wet_error": { severity: "高", category: "翻牌", training: "sizing" },
    "value_barrel_error": { severity: "高", category: "转牌", training: "sizing" },
    "river_value_sizing_error": { severity: "高", category: "河牌", training: "sizing" },
    "bluff_catch_error": { severity: "高", category: "河牌", training: "math" },
    "fish_identify_error": { severity: "高", category: "读牌", training: "mistakes" },
    "session_length_error": { severity: "高", category: "心态", training: "tilt" },
    "bankroll_mgmt_error": { severity: "高", category: "心态", training: "tilt" },
    
    // 中等漏洞
    "3bet_sizing_error": { severity: "中", category: "翻前", training: "sizing" },
    "cold_call_error": { severity: "中", category: "翻前", training: "planning" },
    "squeeze_error": { severity: "中", category: "翻前", training: "planning" },
    "ante_adjustment_error": { severity: "中", category: "翻前", training: "planning" },
    "cbet_dry_error": { severity: "中", category: "翻牌", training: "sizing" },
    "float_error": { severity: "中", category: "翻牌", training: "planning" },
    "semibluff_turn_error": { severity: "中", category: "转牌", training: "planning" },
    "scare_card_error": { severity: "中", category: "转牌", training: "mistakes" },
    "thin_value_error": { severity: "中", category: "河牌", training: "sizing" },
    "vs_fish_sizing_error": { severity: "中", category: "剥削", training: "sizing" },
    "vs_nit_steal_error": { severity: "中", category: "剥削", training: "planning" },
    "tilt_read_error": { severity: "中", category: "读牌", training: "tilt" },
    "winner_tilt_error": { severity: "中", category: "心态", training: "tilt" },
    "blocker_use_error": { severity: "中", category: "高级", training: "planning" }
};

// ==================== 导出 ====================
console.log('完整版评估系统加载完成');
console.log('总题数:', getTotalQuestions());
console.log('维度:', Object.keys(FULL_ASSESSMENT).join(', '));

