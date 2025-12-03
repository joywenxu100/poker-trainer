// 范围互动训练数据库
// Range Interaction Training Scenarios
// 世界级深筹码策略

const RANGE_SCENARIOS = {
    // 基础范围互动
    beginner: [
        {
            title: "场景1: 基础3-Bet Pot范围分析",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "BTN open 3BB → BB 3-bet 10BB → BTN call",
                flop: "K♠ 7♥ 3♦",
                pot: "21BB"
            },
            ranges: {
                hero: "BTN范围: QQ-22, AK-AJ, KQ-KJ, QJ-QT, JTs-98s, 87s-76s, suited Ax (A5s-A2s)",
                villain: "BB 3-Bet范围: AA-TT, AK-AQ, KQs, AJs-ATs, QJs, JTs"
            },
            analysis: {
                range_advantage: "BB有明显范围优势 - 在K高牌面有更多强牌(AA, KK, AK)",
                nut_advantage: "BB有坚果优势 - KK sets, AA overpair都在BB范围内",
                board_texture: "干燥牌面(Dry board) - K高，没有听牌，静态牌面",
                equity: "BB平均胜率约55%, BTN约45%"
            },
            question: "作为BB，你应该如何利用范围优势？C-Bet频率和sizing应该是多少？",
            answer: {
                strategy: "BB应该高频C-Bet (75-80%)，使用中等sizing (50-60% pot)。虽然BTN也可能有KK/77/33的sets，但BB的范围在这个K高干燥牌面有压倒性优势。",
                multistreet_plan: {
                    flop: [
                        { frequency: "75%", action: "C-Bet 50-60% pot - 包括所有强牌(AA, KK, AK)和部分bluff(AQ, AJ, QJs)" },
                        { frequency: "25%", action: "Check - 用中等牌力控池(TT, JJ, ATs)" }
                    ],
                    turn: [
                        { frequency: "65%", action: "如果翻牌C-Bet被call，转牌继续double barrel (60-75% pot)" },
                        { frequency: "35%", action: "Check - 用bluff hands放弃或控池" }
                    ],
                    river: [
                        { frequency: "取决于转牌", action: "如果打了2条街，河牌要么大额value (75-100% pot) 要么check" }
                    ]
                },
                key_points: [
                    "范围优势 = 可以高频下注，对手难以反击",
                    "干燥牌面 = 很少draw，bluff容易成功",
                    "中等sizing = 既能build pot，又能保护bluff range",
                    "BTN如果没有K，很难继续3条街"
                ]
            },
            insight: "💡 世界级洞察: 范围优势不是100%，而是概率优势。即使你在75%的组合中领先，也要用25%的时间check来保持平衡。这样对手无法exploit你的'强牌总是bet'的pattern。"
        },
        {
            title: "场景2: 位置不利的范围劣势",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "BTN open 3BB → BB call",
                flop: "9♠ 8♥ 7♣",
                pot: "7BB"
            },
            ranges: {
                hero: "BB防守范围: 22-TT, AK-A2, K9s+, Q9s+, J9s+, T8s+, 97s+, 86s+, 75s+, 所有suited connectors",
                villain: "BTN open范围: 22-AA, AK-A2, KQ-K7, Q9s+, J8s+, T8s+, 97s+, 所有suited connectors"
            },
            analysis: {
                range_advantage: "BTN有轻微范围优势，但不明显",
                nut_advantage: "范围互有优势 - BB可能有更多TT/99/88/77 sets，BTN有更多overpairs",
                board_texture: "极湿润牌面 - 连续3张，大量顺子可能，高度动态",
                equity: "非常接近 50-50，equity分布均匀"
            },
            question: "作为BB（失位），面对BTN可能的C-Bet，你应该如何防守？哪些牌应该check-raise？",
            answer: {
                strategy: "在湿润牌面，BB虽然失位但有很多强成手牌(sets, 两对, 顺子)。应该采用混合策略: 主要check-call + 少量check-raise来保护range。",
                multistreet_plan: {
                    flop: [
                        { frequency: "55-60%", action: "Check-call - 用所有中等强度和听牌(一对+听牌, 顺子听牌, 中对)" },
                        { frequency: "15-20%", action: "Check-raise - 用强牌(sets, 两对, 成顺)和强听牌(OESD+pair)" },
                        { frequency: "20-25%", action: "Check-fold - 用完全miss的牌(AK, AQ high)" }
                    ],
                    turn: "根据翻牌行动调整，如果check-called flop，转牌要评估是否improve",
                    river: "如果打到河牌，要基于最终牌面和对手sizing决定call/fold"
                },
                key_points: [
                    "湿润牌面 = 双方都有很多强牌和听牌",
                    "失位 = 需要更谨慎，不能过度激进",
                    "Check-raise用来保护range - 如果总是check-call，对手会肆无忌惮bluff",
                    "这个牌面equity实现率低(OOP) - 很多牌在转牌/河牌会变得困难"
                ]
            },
            insight: "💡 世界级洞察: 在高度动态的牌面，'范围优势'不如'位置优势'重要。BTN即使range相近，因为有位置，可以看到你的action再决策，equity实现率比你高20%+。所以OOP要更保守。"
        },
        {
            title: "场景3: 4-Bet Pot的范围极化",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "CO open 3BB → BTN 3-bet 10BB → CO 4-bet 28BB → BTN call",
                flop: "A♠ Q♦ 5♣",
                pot: "57BB"
            },
            ranges: {
                hero: "CO 4-Bet范围: AA-QQ, AK (极紧，很少bluff)",
                villain: "BTN call 4-bet范围: QQ-JJ, AK, AQ (defend 4-bet，不想5-bet全压)"
            },
            analysis: {
                range_advantage: "CO有巨大范围优势 - 几乎所有hands都击中或是overpair",
                nut_advantage: "CO有绝对坚果优势 - AA, AK在A高牌面无敌",
                board_texture: "A高牌面，相对静态，但有少量听牌(backdoor flush)",
                equity: "CO约65%, BTN约35%"
            },
            question: "作为CO，你应该如何在这个A高牌面继续施压？Bet sizing和频率？",
            answer: {
                strategy: "CO应该接近100% C-Bet，但sizing要小 (30-40% pot)。因为range极强，小sizing已经足够让对手困难，同时build pot更有效率。",
                multistreet_plan: {
                    flop: [
                        { frequency: "95%", action: "C-Bet 33-40% pot - 几何sizing，为多街价值做准备" },
                        { frequency: "5%", action: "Check - 偶尔用AA trap" }
                    ],
                    turn: [
                        { frequency: "80%", action: "继续bet 50-60% pot - 对手如果没有A很难call" },
                        { frequency: "20%", action: "Check - 用KK/QQ控池，或AA继续slow play" }
                    ],
                    river: [
                        { frequency: "根据turn", action: "如果打了2街，河牌极化 - 要么大额value (75%+ pot) 要么check" }
                    ]
                },
                key_points: [
                    "4-Bet pot的范围都很强，但CO更强",
                    "小sizing利用range advantage - 对手无论如何都很难受",
                    "几何sizing (33% → 50% → 75%) 让底池在河牌恰好1个pot size",
                    "BTN如果没有A，只有QQ/JJ很难call 3条街"
                ]
            },
            insight: "💡 世界级洞察: 当你有绝对范围优势时，不要用大sizing吓跑对手。小sizing让对手'感觉'可以call，但实际上他们在持续亏损。这就是'慢性榨取'策略 - 比一次性大注更赚钱。"
        }
    ],

    // 中级牌面分析
    intermediate: [
        {
            title: "场景4: 彩虹牌面 vs 同花牌面",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "BTN open 3BB → BB call",
                flop: "J♠ T♥ 4♦ (彩虹)",
                pot: "7BB"
            },
            ranges: {
                hero: "BTN范围: 所有pairs, 所有Broadway, suited connectors, suited Ax",
                villain: "BB范围: 类似但稍宽"
            },
            analysis: {
                range_advantage: "BTN有明显优势 - 更多overpairs (AA-QQ) 和强JT组合",
                nut_advantage: "BTN略有优势 - 更多强顶对组合(AJ, KJ)",
                board_texture: "半湿润 - 有顺子听牌(KQ, Q9, 98) 但无同花听牌",
                equity: "BTN 52%, BB 48%"
            },
            question: "彩虹牌面如何影响你的策略？对比如果是J♠ T♠ 4♠ 同花牌面，策略有何不同？",
            answer: {
                strategy: "彩虹牌面: C-Bet频率70%, sizing 50-60% pot。可以更激进value bet，因为对手听牌少。\n\n如果是同花牌面: C-Bet频率降低到55-60%, sizing增加到66-75% pot。需要更谨慎，因为对手可能有大量flush draws。",
                multistreet_plan: {
                    flop: "彩虹: 高频中等sizing | 同花: 中频大sizing (保护equity)",
                    turn: "彩虹: 如果blank继续fire | 同花: 如果第4张同花，要慢下来评估",
                    river: "彩虹: 相对简单 | 同花: 如果完成同花，范围dramatically改变"
                },
                key_points: [
                    "彩虹牌面 = 静态，容易规划多街",
                    "同花牌面 = 动态，每条街都可能reversed",
                    "同花牌面需要larger sizing保护equity",
                    "彩虹牌面你的bluff更有credibility"
                ]
            },
            insight: "💡 世界级洞察: 牌面纹理直接决定sizing。湿润牌面(同花/连续)需要大sizing拒绝对手equity，干燥牌面用小sizing更高效。很多业余玩家sizing一成不变，这是巨大漏洞。"
        },
        {
            title: "场景5: 低牌面的范围反转",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "UTG open 3BB → BB call",
                flop: "6♣ 5♠ 2♦",
                pot: "7BB"
            },
            ranges: {
                hero: "UTG范围: 99-AA, AK-AJ, KQ, suited Broadway (极紧的EP range)",
                villain: "BB范围: 所有pairs, suited connectors, suited Ax, 所有低牌连接"
            },
            analysis: {
                range_advantage: "UTG有overpair优势，但BB有更多直接击中的组合(65s, 54s, A2-A6)",
                nut_advantage: "BB有坚果优势! - 可能有sets (66, 55, 22) 和顺子(A4, 43, 34)",
                board_texture: "低且连续 - 对BB的speculative hands极友好",
                equity: "意外地接近 - BB 51%, UTG 49%"
            },
            question: "为什么UTG即使有很多overpairs，在这个低牌面却没有明显优势？应该如何调整？",
            answer: {
                strategy: "UTG应该降低C-Bet频率到50-55%。虽然有overpairs，但这个牌面对BB的投机牌太友好。使用中小sizing (40-50% pot)，准备好面对check-raise时要弃牌。",
                multistreet_plan: {
                    flop: [
                        { frequency: "50-55%", action: "C-Bet 40-50% pot - 用overpairs和AK high" },
                        { frequency: "45-50%", action: "Check - 用所有overpairs的一部分，防止被exploit" }
                    ],
                    turn: [
                        { frequency: "如果C-Bet被call", action: "要重新评估 - BB很可能有pair或更强" },
                        { frequency: "如果转牌是7-J", action: "可以继续，如果是A/K要小心" }
                    ],
                    river: "非常依赖runout - 低牌面很容易被追上"
                },
                key_points: [
                    "低牌面 ≠ 对EP有利 (这是常见误区)",
                    "BB defend range包含所有低牌连接，在这里很强",
                    "即使你有QQ+，对手可能有你不在range里的nuts",
                    "要尊重对手在低牌面的range优势"
                ]
            },
            insight: "💡 世界级洞察: 这是'范围反转'的经典例子。翻前UTG range更强，但在特定board(低且连续)上，BB的弱翻前range反而更强。顶级玩家会根据board动态调整，而不是死守'我翻前range强所以我领先'的错误思维。"
        },
        {
            title: "场景6: 配对牌面的复杂性",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "CO open 3BB → BTN 3-bet 10BB → CO call",
                flop: "K♠ K♦ 7♣",
                pot: "21BB"
            },
            ranges: {
                hero: "BTN 3-Bet范围: AA-TT, AK, AQ, KQs, AJs",
                villain: "CO call 3-bet范围: JJ-88, AK, KQ, QJ, suited connectors"
            },
            analysis: {
                range_advantage: "BTN有明显优势 - 更多AK和高对",
                nut_advantage: "BTN有绝对优势 - 更多AK (trips), AA (overpair)",
                board_texture: "配对高牌 - 极度静态，很少人击中",
                equity: "BTN 58%, CO 42%"
            },
            question: "配对牌面为何特殊？作为BTN，你应该如何利用范围优势？",
            answer: {
                strategy: "配对牌面最适合'延迟C-Bet'策略。BTN应该高频check flop (70%+)，因为：1) 很少人击中 2) 对手也会miss 3) 转牌/河牌更容易偷。但也要用一些强牌(AA, AK) C-Bet来保持平衡。",
                multistreet_plan: {
                    flop: [
                        { frequency: "70-75%", action: "Check - 包括所有overpairs (AA, QQ, JJ) 和AQ, AJ" },
                        { frequency: "25-30%", action: "C-Bet 33% pot - 用部分AK (trips) 和部分air (AQ, AJ)" }
                    ],
                    turn: [
                        { frequency: "如果flop check", action: "转牌如果对手check，高频bet (60-70%) 偷池" },
                        { frequency: "如果flop C-Bet被call", action: "对手很可能有Kx或强对，要慎重" }
                    ],
                    river: [
                        { frequency: "延迟到河牌", action: "如果都check到河牌，大注bluff或value" }
                    ]
                },
                key_points: [
                    "配对牌面 = 很少人击中，适合delayed aggression",
                    "立即C-Bet反而suspicious (你真有K吗？)",
                    "Flop check → Turn bet 的line更有credibility",
                    "对手如果call flop C-Bet，他range变窄变强"
                ]
            },
            insight: "💡 世界级洞察: 配对牌面打破了'强range要快速bet'的常规。因为双方都很少击中，立即下注反而suspicious。Check flop然后利用turn/river的fold equity更高效。这是'timing'的艺术 - 不是'是否下注'，而是'何时下注'。"
        }
    ],

    // 高级多街规划
    advanced: [
        {
            title: "场景7: 三街价值提取的艺术",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "BTN open 3BB → BB call",
                flop: "A♠ K♣ 9♦",
                pot: "7BB",
                your_hand: "你持有 A♥ K♥ (两对)"
            },
            ranges: {
                hero: "BTN范围: 包括AK (顶两对)",
                villain: "BB可能有: Ax (顶对), Kx (第二对), 99 (set), draws"
            },
            analysis: {
                range_advantage: "你有nuts级别的牌",
                nut_advantage: "只怕99 set和AK (chop)",
                board_texture: "高牌面，相对干燥",
                equity: "你对大部分range约85%+"
            },
            question: "你有顶两对，如何规划3条街来最大化价值？sizing应该如何演变？",
            answer: {
                strategy: "目标: 河牌底池达到150-200BB，让对手的Ax/Kx打到河牌并支付。使用递增geometric sizing。",
                multistreet_plan: {
                    flop: [
                        { frequency: "100%", action: "Bet 40% pot (2.8BB) - 小sizing，让所有Ax, Kx舒服地call" }
                    ],
                    turn: [
                        { frequency: "如果call", action: "Bet 60% pot (约6BB) - 持续build，sizing增加" },
                        { frequency: "转牌如果是A/K", action: "Bet更大 (75% pot) - 你improve到葫芦" },
                        { frequency: "转牌如果是9", action: "Check-call或小bet - 可能被99反超" }
                    ],
                    river: [
                        { frequency: "如果2条街call", action: "Bet 75-100% pot - 对手已经投入很多，难fold" },
                        { frequency: "sizing", action: "底池此时约30-35BB，bet 25-30BB" }
                    ]
                },
                key_points: [
                    "Geometric sizing: 40% → 60% → 75-100%，逐街增加",
                    "小sizing让弱牌(Ax)继续，而不是早早fold",
                    "到河牌时，对手已invested，pot odds迫使他call",
                    "如果任何街对手raise，要评估是否遇到99 set",
                    "这个sizing序列总提取: 2.8 + 6 + 27 = 35.8BB (从7BB底池)"
                ]
            },
            insight: "💡 世界级洞察: 三街价值提取的关键是'诱导性sizing'。初级玩家会翻牌pot size bet吓走所有人。高手用小sizing让对手继续，逐步增大，最终在河牌'陷入太深无法fold'。这比一次大注赚更多。"
        },
        {
            title: "场景8: 多街Bluff的故事构建",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "BTN open 3BB → BB call",
                flop: "Q♠ 9♥ 4♣",
                pot: "7BB",
                your_hand: "你持有 A♦ 5♦ (complete air, 但有A blocker)"
            },
            ranges: {
                hero: "BTN范围: 对手认为你可能有Qx, overpairs, AK",
                villain: "BB可能有: 弱Qx, 9x, 听牌, 小对"
            },
            analysis: {
                range_advantage: "你有range advantage (更多Qx和overpairs)",
                nut_advantage: "你没有坚果，但对手不知道",
                board_texture: "Q高，相对干燥",
                equity: "你只有约25-30% equity (air)"
            },
            question: "你完全miss，但想triple barrel bluff。如何构建可信的story？每条街sizing？",
            answer: {
                strategy: "目标: 代表QJ, QT, 或JJ-KK。使用标准sizing让story可信，不要overbet (会suspicious)。",
                multistreet_plan: {
                    flop: [
                        { frequency: "Bluff", action: "C-Bet 50% pot (3.5BB) - 标准sizing，代表你有Q或overpair" }
                    ],
                    turn: [
                        { frequency: "如果call", action: "Bet 66% pot (约9BB) - double barrel，持续story" },
                        { frequency: "转牌card", action: "如果是A/K，你story更强 (可以代表AQ/KQ)" },
                        { frequency: "如果是low card", action: "继续bluff，对手如果没Q很难call" }
                    ],
                    river: [
                        { frequency: "如果2条街call", action: "评估: 对手可能有Qx，要放弃bluff" },
                        { frequency: "如果river是A", action: "可以大注bluff (75% pot) - 代表你击中AQ" },
                        { frequency: "如果river是brick", action: "中等bet (50-60% pot) 或 give up" }
                    ]
                },
                key_points: [
                    "你的story是: QJ/QT/overpair想要3街价值",
                    "Sizing要标准，不要突然oversized (会不可信)",
                    "A blocker很重要 - 减少对手有AQ的组合",
                    "如果对手call 2条街，他很可能有Q - 河牌要谨慎",
                    "成功率约40-50% vs thinking player"
                ]
            },
            insight: "💡 世界级洞察: 好的bluff是'讲一个完整的故事'。每条街sizing和action都要consistent。如果你flop小bet, turn小bet, river突然overbet，对手会怀疑。Triple barrel bluff需要勇气，但更需要logic。"
        },
        {
            title: "场景9: 范围极化的河牌决策",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "CO open 3BB → BTN call",
                flop: "J♣ 8♠ 3♦ → CO bet 4BB → BTN call",
                turn: "5♥ → CO bet 9BB → BTN call",
                river: "2♠",
                pot: "33BB"
            },
            ranges: {
                hero: "CO到河牌range: 极化 - 要么JJ+/两对+ (strong), 要么missed draws (air)",
                villain: "BTN到河牌range: 多是bluff catchers - Jx, 88-TT, 可能有些两对"
            },
            analysis: {
                range_advantage: "CO可以极化 - 有更多nuts和air",
                nut_advantage: "CO有更多overpairs (AA, KK, QQ)",
                board_texture: "River完全brick，没有完成任何draw",
                equity: "Range vs range约55-45"
            },
            question: "你是CO，河牌应该如何构建极化range？多大比例value vs bluff？Sizing？",
            answer: {
                strategy: "河牌极化策略: 用nuts和air来overbet (125-150% pot)。目标: nuts获取最大value，air迫使bluff catchers fold。比例应该约为value:bluff = 2:1 或 65%:35%。",
                multistreet_plan: {
                    river: [
                        { frequency: "35%", action: "Bet 125-150% pot (~40-50BB) - 用所有sets+, 两对+" },
                        { frequency: "15%", action: "Bet 125-150% pot - 用missed AQ, AK high (pure bluff)" },
                        { frequency: "50%", action: "Check - 用所有中等牌力(overpairs JJ-QQ, top pair)" }
                    ]
                },
                key_points: [
                    "极化 = 只bet极强或极弱，check中等牌力",
                    "Overbet sizing迫使对手做困难决策",
                    "对手只能用bluff catchers call，很痛苦",
                    "Value:Bluff比例要balanced，否则被exploit",
                    "如果你总是nuts，对手会fold；如果总是bluff，对手会call",
                    "2:1比例让对手indifferent (无论call或fold期望值相近)"
                ]
            },
            insight: "💡 世界级洞察: 河牌极化是GTO的核心。你不能用所有牌bet，那样范围太透明。Merge betting (所有牌都bet中等size)在river通常是错误的。要么极化(大注)，要么linear (小注)，中等注只在特殊情况用。"
        }
    ],

    // 大师级实战
    master: [
        {
            title: "场景10: 对抗高手的多层次思维",
            game_info: {
                structure: "8人桌 300BB 对抗已知高手",
                stack: "300BB",
                preflop_action: "你BTN open 3BB → 高手BB 3-bet 10BB → 你call",
                flop: "A♠ J♣ 7♦",
                pot: "21BB",
                your_hand: "你持有 K♠ Q♠ (complete miss, 但有gutshot和2 overcards)"
            },
            ranges: {
                hero: "你的call 3-bet range: QQ-88, AK-AJ, KQs-KJs, QJs-JTs",
                villain: "高手的3-Bet range: AA-TT, AK-AT, KQ, suited Broadway"
            },
            analysis: {
                range_advantage: "高手在A高牌面有优势",
                nut_advantage: "高手有更多Ax和AA",
                board_texture: "A高半湿润 - 有部分draw",
                equity: "你的KQs约30% equity"
            },
            question: "高手C-Bet 50% pot (10.5BB)。你知道他知道这个牌面对他有利。你应该如何进行'leveling war'？",
            answer: {
                strategy: "这是level 3思维: \n\nLevel 1: 我miss了，应该fold (too straightforward)\n\nLevel 2: 但他也经常在bluff，我可以float (他预期你这么想)\n\nLevel 3: 他知道你会这么想，所以他会c-bet更多value (你应该respect)\n\n最佳策略: 混合 - 用有equity的牌(KQ = gutshot + overcards)约25-30%频率float，其他fold。",
                multistreet_plan: {
                    flop: [
                        { frequency: "30%", action: "Call - 你的KQs有backdoor straight，2 overcards" },
                        { frequency: "70%", action: "Fold - 如果是pure air (72o)" }
                    ],
                    turn: [
                        { frequency: "如果call flop", action: "如果转牌是K/Q/T，你improve - 可以继续" },
                        { frequency: "如果turn blank", action: "如果对手再bet，通常要fold" },
                        { frequency: "如果对手check", action: "可以bet as bluff (50% pot) - 代表Ax慢打" }
                    ],
                    river: [
                        { frequency: "非常复杂", action: "取决于整个story和对手的pattern" }
                    ]
                },
                key_points: [
                    "对抗高手不能总是level 1 (太predictable)",
                    "但也不能过度leveling (他可能就是有牌)",
                    "用有equity的牌float是平衡策略",
                    "观察对手的pattern - 他是否over-c-bet这个spot?",
                    "心理战: 偶尔要show down一些Hero calls建立形象",
                    "然后你可以更多fold，他会误以为你还会call"
                ]
            },
            insight: "💡 世界级洞察: 对抗高手的核心是'unpredictability'。如果你的strategy太transparent (总是fold miss或总是float)，他会adjust并exploit你。混合策略让你unexploitable。记住: 对抗高手，赢在'他无法exploit你'，而不是'你exploit他'。"
        },
        {
            title: "场景11: 深筹码的隐含赔率陷阱",
            game_info: {
                structure: "8人桌 300BB",
                stack: "300BB",
                preflop_action: "你MP open 3BB → 高手CO call",
                flop: "K♦ Q♠ 9♣ → 你bet 4BB → 高手call",
                turn: "6♥",
                pot: "15BB",
                your_hand: "你持有 A♠ A♣ (overpair)"
            },
            ranges: {
                hero: "你的range: overpairs, Kx, Qx",
                villain: "高手的range: Kx, Qx, JT (顺子), 可能在听牌"
            },
            analysis: {
                range_advantage: "你仍然领先大部分range",
                nut_advantage: "对手可能有JT (坚果顺子)",
                board_texture: "有顺子完成 (JT)，但你不确定",
                equity: "如果对手有JT你是0%, 如果没有你是80%+"
            },
            question: "转牌你应该bet多大？如果对手raise，你应该call吗？如何平衡'获取价值'和'避免被set up'？",
            answer: {
                strategy: "这是深筹码的经典困境。你有强牌但不是nuts。策略: Bet medium size (60% pot = 9BB)。如果对手raise，要非常谨慎 - 深筹码reverse implied odds极高。",
                multistreet_plan: {
                    turn: [
                        { frequency: "100%", action: "Bet 60% pot (9BB) - 中等sizing，既build pot又不over-commit" }
                    ],
                    if_raised: [
                        { frequency: "评估", action: "对手raise到30BB+，你只投入了12BB，剩余285BB" },
                        { frequency: "决策", action: "对抗高手的turn raise，AA可能只有30-40% equity" },
                        { frequency: "建议", action: "Fold或call一次看河牌，但不要3-bet全压" }
                    ],
                    river: [
                        { frequency: "如果call turn", action: "河牌如果对手大注(100BB+)，要能fold AA" },
                        { frequency: "如果对手check", action: "可以小bet(30-40% pot)诱导bluff-catch" }
                    ]
                },
                key_points: [
                    "深筹码: 不要用非nuts过度投入",
                    "AA在KQ9T6牌面可能只是bluff-catcher",
                    "已投入12BB vs 可能输285BB - pot odds不对",
                    "Reverse implied odds: 你call可能输全stack，对手call只输小pot",
                    "这就是为什么深筹码要更谨慎",
                    "职业玩家能fold AA如果story不对"
                ]
            },
            insight: "💡 世界级洞察: 深筹码最大的陷阱是'commitment'。新手想'我都投入这么多了，必须call到底'。高手思考的是'如果我继续，我的期望值是多少？'。沉没成本不是成本。能fold AA是深筹码高手的标志。"
        },
        {
            title: "场景12: 动态平衡调整 - Meta Game",
            game_info: {
                structure: "8人桌 300BB，已和对手打了200+ hands",
                stack: "300BB",
                observation: "你发现：对手对你的flop c-bet fold率高达75% (应该是55-60%)",
                current_hand: "你BTN open 3BB → 对手BB call → 翻牌 8♠ 7♥ 3♦",
                pot: "7BB"
            },
            ranges: {
                hero: "你的range: 标准BTN open range",
                villain: "对手的range: 标准BB defend range"
            },
            analysis: {
                range_advantage: "相对均衡的牌面",
                nut_advantage: "双方都可能有各种强牌",
                board_texture: "中低连续牌面",
                meta_info: "对手over-folding to c-bet"
            },
            question: "你发现对手over-folding。你应该如何调整？但要避免过度调整被他反exploit。",
            answer: {
                strategy: "识别到对手over-folding后，应该提高c-bet频率到85-90% (从标准65%)，用更多air。但要准备好他开始调整，然后你要反调整。",
                multistreet_plan: {
                    immediate_exploit: [
                        { frequency: "85-90%", action: "C-Bet所有boards，包括用complete air" },
                        { frequency: "Sizing", action: "保持50-60% pot - 不要因为是bluff就bet小" },
                        { frequency: "Duration", action: "持续50-100 hands或直到他adjust" }
                    ],
                    watch_for_adjustment: [
                        { frequency: "观察", action: "如果他开始float更多 (call rate上升)" },
                        { frequency: "观察", action: "如果他开始check-raise更多" },
                        { frequency: "观察", action: "如果你的bluff被catch增加" }
                    ],
                    counter_adjustment: [
                        { frequency: "他调整后", action: "降低c-bet频率回到70%" },
                        { frequency: "同时", action: "增加value bet的比例" },
                        { frequency: "Advanced", action: "偶尔check强牌，因为他预期你高频c-bet" }
                    ]
                },
                key_points: [
                    "Exploitation: 识别漏洞 → 针对性调整",
                    "但要监控对手是否counter-adjust",
                    "如果他调整，你要立即反调整",
                    "这就是'Meta Game' - 调整与反调整的博弈",
                    "最高层次: 提前预测他的调整，提前反调整",
                    "vs 高手: 不要over-exploit，保持接近GTO"
                ]
            },
            insight: "💡 世界级洞察: 真正的高手玩的是'meta game'。不是'他现在怎么打'，而是'他知道我知道他怎么打，所以他会怎么调整'。这是level 4-5思维。要在脑中模拟对手的思维过程，比他先走一步。但永远保持退回GTO的能力，当不确定时。"
        }
    ]
};

// 导出供HTML使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RANGE_SCENARIOS };
}

