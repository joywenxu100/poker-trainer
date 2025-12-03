// 高级Sizing训练数据库
// Advanced Sizing Strategy Data
// 世界级下注尺寸理论

const SIZING_DATA = {
    // 几何Sizing
    geometric: {
        title: "📐 几何Sizing - 多街价值最大化",
        description: "几何Sizing是一种数学化的sizing策略，通过计算让河牌底池恰好达到目标大小，从而最大化从对手范围中的价值提取。核心思想：每条街的sizing成固定比例递增，最终在河牌形成理想的pot size。",
        formula: "Bet_size = Pot × sqrt(Target_River_Pot / Current_Pot) - 1",
        
        examples: [
            {
                title: "案例1: 标准3街几何Sizing",
                hand: "A♠ K♠ (顶两对)",
                board: "Flop: A♥ K♣ 9♦ → Turn: 5♠ → River: 3♣",
                pot: "翻牌7BB，目标河牌150BB",
                sizing: "33% → 50% → 75%",
                rationale: "目标：从对手的Ax/Kx范围中提取3街价值。\n\n计算过程：\n• 翻牌：Bet 33% (2.3BB) → 底池变11.6BB\n• 转牌：Bet 50% (5.8BB) → 底池变23.2BB\n• 河牌：Bet 75% (17.4BB) → 底池变58BB\n\n虽未达到150BB（需要对手全call），但这个sizing序列让对手舒服地继续，逐步陷入。关键：sizing逐渐增大符合'我在build pot'的story。",
                key_points: [
                    "小尺寸开始（33%）让弱Ax舒服call，不会早早fold",
                    "递增sizing（33% → 50% → 75%）符合价值提取pattern",
                    "到河牌时对手已投入很多，pot odds迫使继续",
                    "总提取：2.3 + 5.8 + 17.4 = 25.5BB（从7BB底池）"
                ],
                wrong_sizing: {
                    size: "66% → 75% → 100%",
                    why_wrong: "过大的sizing会在翻牌或转牌吓走大部分Ax。虽然你获得的单次价值可能更高，但对手的call频率降低，总体EV反而更低。几何sizing的精髓是'诱导性' - 让对手持续犯错（call dominated）。"
                }
            },
            {
                title: "案例2: 深筹码的几何调整",
                hand: "9♠ 9♣ (Set)",
                board: "Flop: K♠ 9♦ 4♣ → Turn: Q♥ → River: 7♦",
                pot: "翻牌10BB，有效筹码300BB",
                sizing: "40% → 55% → 85%",
                rationale: "深筹码调整：因为筹码深度300BB，有足够空间打多街。\n\n策略目标：\n• 从Kx/QQ范围提取最大价值\n• 转牌Q帮到对手（可能有QQ改进或KQ两对）\n• 使用略大sizing因为对手范围可能变强\n\n计算：\n• 翻牌：40% (4BB) → 底池18BB\n• 转牌：55% (10BB) → 底池38BB\n• 河牌：85% (32BB) → 底池102BB\n\n总投入：4 + 10 + 32 = 46BB，从10BB底池提取！",
                key_points: [
                    "深筹码允许更aggressive的sizing",
                    "转牌Q帮到对手range，sizing增大合理",
                    "河牌85% pot是大尺寸但仍可信（你代表KQ两对或better）",
                    "对手如果有Kx+已经太深陷入，难以fold"
                ]
            },
            {
                title: "案例3: 反向几何（缩小sizing）",
                hand: "A♣ Q♣ (顶对好kicker)",
                board: "Flop: A♠ 8♥ 3♦ → Turn: J♣ → River: 2♠",
                pot: "翻牌6BB",
                sizing: "50% → 40% → 33%",
                rationale: "反向几何策略：当你的相对牌力在weakening（牌面变危险或对手显示strength），使用缩小sizing。\n\n原因：\n• 翻牌A高你很强 → 50% pot合理\n• 转牌J可能帮到对手（AJ两对，JJ set）→ 降低sizing到40%\n• 河牌brick但对手call了2街 → 他range变强 → 小sizing 33%诱导bluff或获取薄价值\n\n这不是标准几何sizing，而是'adaptive sizing' - 根据情况调整。",
                key_points: [
                    "不是所有情况都用递增sizing",
                    "当牌面变危险或对手显示strength，要降低sizing",
                    "河牌小sizing既能从弱牌获取一点价值，又不会被better hands惩罚太多",
                    "灵活性 > 固定公式"
                ]
            }
        ],
        
        comparison: [
            { type: "微型 (1/4 pot)", size: "25%", effect: "极诱导，给对手极好pot odds，适合超强牌想让对手继续" },
            { type: "几何小 (1/3 pot)", size: "33%", effect: "标准几何sizing起点，平衡诱导性和build pot" },
            { type: "几何中 (1/2 pot)", size: "50%", effect: "转牌标准几何sizing，继续build" },
            { type: "几何大 (3/4 pot)", size: "75%", effect: "河牌几何sizing，接近pot size，大额价值" },
            { type: "超池 (>pot)", size: "125-150%", effect: "极化策略，只用nuts和air，不是几何sizing" }
        ],
        
        world_class_insight: "💡 世界级洞察：几何sizing的本质是'欺骗性的数学'。对手看到你bet 33% pot觉得'不贵，我call'，然后50%觉得'已经投入了，继续'，最后75%觉得'投入这么多了，必须call'。这就是'温水煮青蛙'策略。相比翻牌直接pot size bet把人吓跑，几何sizing总EV更高。关键：sizing要consistent和logical，让story可信。"
    },

    // 极化Sizing
    polarized: {
        title: "⚡ 极化Sizing - Nuts和Air的艺术",
        description: "极化sizing是高级策略，你的range只包含极强牌(nuts)和极弱牌(air)，没有中等牌力。通常使用大sizing（75-150%+ pot）迫使对手用bluff catchers做困难决策。核心：让对手无论call还是fold都感觉不舒服。",
        
        examples: [
            {
                title: "案例1: 河牌极化Overbet",
                hand: "8♦ 7♦ (错过同花听牌 - Air) 或 A♠ 9♠ (坚果同花 - Nuts)",
                board: "K♠ Q♠ 5♠ 8♣ 2♥",
                pot: "河牌前40BB",
                sizing: "河牌 125% pot (50BB)",
                opponent: "TAG玩家",
                rationale: "完美的极化spot：\n\n你的河牌range构成：\n• 35%：Nuts (A♠X坚果同花，KK/QQ sets)\n• 15%：Pure Air (错过的同花听牌如8♦7♦)\n• 50%：Check (所有中等牌力)\n\n为什么overbet：\n1. 对手的range多是bluff catchers（Kx, Qx单对）\n2. 你的nuts想要最大value，air想要最大fold equity\n3. Value:Bluff比例约2.3:1 (35%:15%) - balanced\n4. 对手需要37.5% equity才能盈亏平衡call，但他只有bluff catcher\n\n结果：对手极度痛苦，无论call还是fold都可能错。",
                key_points: [
                    "极化 = 只bet强牌和空气，check所有中等牌",
                    "Overbet让对手pot odds变差（需要更高equity）",
                    "必须保持balance：value和bluff比例约2:1到3:1",
                    "如果你从不bluff，对手会只call nuts；如果总是bluff，对手会宽call",
                    "对抗好玩家效果最佳（他们理解你必须balanced）"
                ],
                wrong_sizing: {
                    size: "50% pot (标准sizing)",
                    why_wrong: "中等sizing让对手舒服call with bluff catchers（他们有好的pot odds）。你的nuts获得的value更少，你的bluff成功率也更低。极化策略的威力来自'大sizing的压迫感'。"
                }
            },
            {
                title: "案例2: 转牌极化Raise",
                hand: "J♠ T♠ (坚果顺子) 或 A♠ 5♠ (错过同花听牌但有overcard)",
                board: "Flop: Q♠ 9♥ 7♣ → Turn: 8♦",
                pot: "转牌前20BB，对手bet 12BB",
                sizing: "Raise to 40BB (极化raise)",
                rationale: "面对对手的turn bet，你可以构建极化raising range：\n\nRaise range构成：\n• Nuts: JT (坚果顺子)，QQ/99/88/77 (sets)\n• Bluffs: A♠X (错过同花听牌，A blocker), K♠X同理\n\n为什么大raise（3.3x）：\n1. 你的nuts在这个动态牌面需要保护和build pot\n2. 大raise给对手极大压力\n3. 对手需要fold大部分range（除非他也有顺子或set）\n4. 即使对手call，你的nuts在river还能大注\n\n对手困境：他可能有两对、set，但面对你的大raise不确定是领先还是落后。",
                key_points: [
                    "转牌极化raise比river更少见，更有deceiving",
                    "动态牌面（多种顺子可能）支持大raise",
                    "对手如果call你的大raise，river你可以继续极化bet或check",
                    "这个play需要勇气和精确的range构建"
                ]
            },
            {
                title: "案例3: 极化sizing的陷阱避免",
                hand: "A♥ K♥ (顶对顶kicker - 中等牌力)",
                board: "A♠ Q♣ 5♦ 8♠ 2♥",
                pot: "河牌40BB",
                sizing: "Check (不bet) - ❌ 错误：Bet 125% pot",
                opponent: "LAG玩家",
                rationale: "常见错误：用中等牌力(AK)进行极化sizing。\n\n为什么错误：\n• AK是强顶对，但不是nuts（怕AQ两对，AA/QQ sets）\n• 如果你bet 125% pot，你的range应该是极化的\n• 但AK既不是nuts也不是air，是中等牌力\n• Bet huge sizing被call你可能落后；被raise你必须fold\n\n正确做法：\n• 用AK进行merged sizing (50-66% pot)或check\n• 把AK加入你的check range来protect它\n• 极化sizing要严格限制在nuts和air\n\n记住：不要用中等牌力overbet！",
                key_points: [
                    "极化sizing最常见错误：用中等牌力overbet",
                    "只有真正的nuts和pure air才能极化bet",
                    "如果你的牌'可能领先可能落后'，它不属于极化range",
                    "Check range也需要保护 - 加入一些强牌和中等牌"
                ],
                wrong_sizing: {
                    size: "用AK bet 125% pot",
                    why_wrong: "AK不够强来承受被raise，也不够弱来当pure bluff。中等牌力应该用merged sizing或check。Overbet会让你的range不balanced - 聪明对手会exploit。"
                }
            }
        ],
        
        world_class_insight: "💡 世界级洞察：极化sizing是GTO的精髓，也是最难掌握的。业余玩家的错误：1) 从不极化（总是merged bet所有牌），或 2) 极化但不balanced（只用nuts overbet，从不bluff）。世界级玩家的标志：精确的range construction - 知道哪些牌进入极化range，哪些进入check range，并保持数学上的balance。记住Janda的公式：Optimal bluff frequency = (Bet size) / (Pot + Bet size)。150% pot overbet应该有60%的时候是value，40%是bluff。"
    },

    // 融合Sizing
    merged: {
        title: "🎯 融合Sizing - 平衡的艺术",
        description: "融合(Merged)sizing是用相同的中等尺寸（通常50-66% pot）下注你的整个range - 包括强牌、中等牌和部分bluff。这种策略让对手难以判断你的具体牌力，因为你的range'merged'在一起。适合不确定局势或想保持range不透明时。",
        
        examples: [
            {
                title: "案例1: 翻牌标准Merged C-Bet",
                hand: "所有range - 从AA到air",
                board: "K♥ 9♠ 4♦ (干燥K高牌面)",
                pot: "7BB",
                sizing: "50% pot (3.5BB)",
                opponent: "未知对手",
                rationale: "标准merged c-bet策略：\n\n你的c-bet range包含：\n• 强牌：AA, KK, AK (15%)\n• 中等牌：QQ-TT, Kx (25%)\n• 听牌/Bluff：AQ, AJ, suited hands miss (30%)\n• Total c-bet频率：70%\n\n为什么50% pot：\n1. 不给对手太好的pot odds（需要33% equity）\n2. 也不会太大吓走所有边缘牌\n3. 所有range用相同sizing - 对手无法读出你的牌力\n4. 符合GTO模型的建议\n\n对手困境：他无法根据sizing判断你的强度，因为你的整个range都是50%。",
                key_points: [
                    "Merged sizing = range不透明",
                    "50-66% pot是最常见的merged sizing",
                    "适合翻牌和转牌",
                    "对抗未知对手的默认策略",
                    "GTO-oriented策略"
                ]
            },
            {
                title: "案例2: Merged vs Polarized的选择",
                hand: "J♥ T♥ (顶对)",
                board: "J♠ 7♣ 2♦ 4♠ 9♥",
                pot: "河牌35BB",
                sizing: "Merged 60% pot (21BB) vs Polarized 125% pot (44BB)?",
                rationale: "决策分析：什么时候用merged，什么时候用polarized？\n\nMerged (60% pot)的情况：\n• 你的JT是中等强度 - 不是nuts但也不弱\n• 对手range宽泛，包含很多中等牌\n• 你想从J7, J9, 77等获取价值\n• 不确定是否能承受raise\n\nPolarized (125% pot)的情况：\n• 你只在有JJ, 77, 22 (sets)或pure air时\n• 对手range narrow，主要是bluff catchers\n• 你想最大化nuts的value或bluff的fold equity\n\n本例选择：Merged 60% pot\n• JT是'太强而不能check，不够强overbet'的经典例子\n• Merged sizing既能获取价值，又不会被punish太惨",
                key_points: [
                    "Merged = 你的牌是中等强度",
                    "Polarized = 你的牌是极端（极强或极弱）",
                    "不确定时，选择merged更安全",
                    "Merged sizing错误较少，polarized sizing错误代价大"
                ]
            },
            {
                title: "案例3: IP vs OOP的Merged sizing差异",
                hand: "Q♠ J♠ (顶对弱kicker)",
                board: "Q♥ 8♦ 3♣ 5♠ A♠",
                pot: "河牌30BB",
                sizing: "IP: 55% pot | OOP: 33% pot (blocker bet)",
                rationale: "位置如何影响merged sizing：\n\nIn Position (IP):\n• 55% pot是标准merged sizing\n• 你有位置，可以control action\n• 从弱Qx获取价值\n• 如果对手raise，你可以更informed地决策\n\nOut of Position (OOP):\n• 33% pot是blocker bet（防守性小注）\n• 目标：从弱牌获取一点价值\n• 同时防止对手大注bluff\n• 如果对手raise，容易fold\n\n关键差异：\n• IP更aggressive sizing因为有信息优势\n• OOP更defensive sizing因为要face可能的raise\n• 位置价值直接体现在sizing选择上",
                key_points: [
                    "IP可以用标准merged sizing (50-66%)",
                    "OOP often用smaller sizing (33-50%)",
                    "OOP的blocker bet是高级merged sizing应用",
                    "位置直接影响sizing选择"
                ]
            }
        ],
        
        comparison: [
            { type: "IP Merged", size: "50-66%", effect: "标准sizing，balance所有range，有位置支持" },
            { type: "OOP Merged", size: "33-50%", effect: "较小sizing，防守性，避免被raise惩罚" },
            { type: "Blocker Bet", size: "25-33%", effect: "特殊merged sizing，防止对手bluff" },
            { type: "Donk Bet", size: "33-50%", effect: "OOP主动lead，unusual line" }
        ],
        
        world_class_insight: "💡 世界级洞察：Merged sizing是poker的'默认模式'。新手问'我应该bet多少？'答案90%的时间是'50-66% pot merged sizing'。但知道什么时候偏离merged才是高手标志：1) 极端牌力时用polarized，2) 深筹码特殊情况用geometric，3) OOP防守时用blocker bet。Merged是baseline，其他sizing是deviation for reason。记住Phil Galfond的话：'If you don't know what to do, do something close to 50% pot.'"
    },

    // 拒绝Sizing
    denial: {
        title: "🛡️ 拒绝Sizing - Equity Denial Strategy",
        description: "拒绝(Denial)sizing是一种防守性策略，通过大sizing（75-100%+ pot）让对手的听牌数学上无法继续。目标不是build pot，而是'拒绝对手实现他们的equity'。常用于湿润牌面，当你有强但非nuts的牌时。",
        
        examples: [
            {
                title: "案例1: 湿润翻牌的Equity Denial",
                hand: "A♠ A♣ (超对)",
                board: "K♠ Q♠ T♣ (极湿润 - 多种顺子/同花听牌)",
                pot: "10BB",
                sizing: "75% pot (7.5BB)",
                opponent: "LAG玩家（可能有很多draws）",
                rationale: "为什么大sizing（75% pot）：\n\nEquity计算：\n• 对手如果有同花听牌：9 outs = 18% turn equity\n• 对手需要pot odds：7.5 / (10+7.5+7.5) = 30%\n• 他只有18% equity但需要pay 30% → 数学上是-EV call\n\n策略目标：\n• 不是为了build pot（你的AA vulnerable）\n• 是为了让听牌fold或pay wrong price\n• 保护你的equity（AA在这个board只有约70% vs draws）\n\n对比小sizing：\n• 如果bet 40% pot (4BB)，对手需要：4/(10+4+4) = 22%\n• 同花听牌有18%，接近正确价格 → 他会call\n• 然后转牌他可能击中，你输大底池",
                key_points: [
                    "湿润牌面 = 需要大sizing保护",
                    "计算对手的outs和equity",
                    "确保你的sizing让他call是-EV",
                    "宁愿现在赢小底池，不要给机会输大底池",
                    "Equity denial > Value extraction（在vulnerable spots）"
                ],
                wrong_sizing: {
                    size: "33% pot (小sizing)",
                    why_wrong: "小sizing给对手完美的price继续。他的听牌call是+EV，你给了他'correct odds to draw'。结果：转牌/河牌你面临巨大的reverse implied odds - 他击中你输一堆，他miss你只赢一点。"
                }
            },
            {
                title: "案例2: 转牌的Equity Denial Double Barrel",
                hand: "K♥ K♦ (超对)",
                board: "Flop: 9♠ 7♠ 6♣ → Turn: 5♠ (完成同花！)",
                pot: "翻牌后15BB",
                sizing: "Turn: 100% pot (15BB)",
                rationale: "困难spot：转牌完成了同花，但你还是要denial bet。\n\n为什么继续大sizing：\n• 如果你check，显示weakness\n• 对手会bet所有同花 + 还会bluff\n• 你的KK变成bluff catcher，非常被动\n\n如果你bet大：\n• 对手没有同花会fold大部分range\n• 对手有同花会raise或call\n• 但至少你take initiative\n\n风险vs回报：\n• 如果他有同花你输15BB\n• 如果他没有你赢15BB（已在pot里）\n• 你需要50% fold equity to break even\n• 对抗LAG的range，你有>50% fold equity\n\n结论：即使转牌完成同花，continuation大注often correct。",
                key_points: [
                    "Equity denial不因为scare card停止",
                    "位置和initiative极其valuable",
                    "计算fold equity vs risk",
                    "对抗aggressive对手，不要轻易give up",
                    "这是'courageous play' - 需要经验判断"
                ]
            },
            {
                title: "案例3: 多街Equity Denial的sizing演变",
                hand: "A♦ K♦ (超对 on turn)",
                board: "Flop: K♠ 8♣ 4♠ → Turn: 9♠ (完成同花) → River: 2♥",
                pot: "翻牌后12BB",
                sizing: "Flop 66% → Turn 100% → River check",
                rationale: "三街的equity denial演变：\n\nFlop (66% pot = 8BB):\n• 半湿润牌面（同花听牌）\n• 中等denial sizing就够\n• Build pot + deny equity\n\nTurn (100% pot = 20BB):\n• 完成了同花 - 极度危险\n• 必须全力denial或give up\n• 选择继续denial（20BB投入）\n\nRiver (check):\n• 如果对手call了turn，他很可能有同花\n• 继续bet是送钱\n• Check决定cut loss\n\n总结：\n• Equity denial是有限度的\n• 当牌面太危险或对手show strength，要会放手\n• 已投入28BB但river check是正确 - 不要陷入sunk cost fallacy",
                key_points: [
                    "Equity denial有时间限制 - 不是无限开火",
                    "当对手call你的大denial bet，重新评估",
                    "河牌如果形势很差，check-fold是勇气",
                    "沉没成本不是成本 - 该放手就放手",
                    "高手知道什么时候停止denial"
                ]
            }
        ],
        
        world_class_insight: "💡 世界级洞察：Equity denial是'防守性aggression'的精髓。新手想'我有超对，我要build pot'（错误 - vulnerable spot）。中级玩家想'牌面危险，我check'（太被动）。世界级玩家想'我用大sizing让听牌pay wrong price，控制action'。关键是equity计算：Count outs → Calculate equity → Choose sizing让对手-EV。但也要知道何时停止 - 当对手call你的denial bet，他likely有牌。这时候river要能check或fold。Doug Polk的话：'Bet big to make draws wrong, then shut down if called.'"
    },

    // 剥削性Sizing
    exploitative: {
        title: "🎭 剥削性Sizing - 针对对手调整",
        description: "剥削性sizing偏离GTO标准，根据对手的specific tendencies调整。核心原则：对抗calling station用大sizing获取价值，对抗nit用任意sizing都能偷，对抗thinking player用balanced sizing避免被exploit。这是'人读'而非'牌读'。",
        
        examples: [
            {
                title: "案例1: 对抗Calling Station的Massive Value",
                hand: "A♥ K♥ (顶两对)",
                board: "A♠ K♣ 7♦ 3♠ 2♣",
                pot: "河牌40BB",
                sizing: "125% pot (50BB) - 剥削性overbet",
                opponent: "Calling Station (从不fold made hand)",
                rationale: "对抗Calling Station的sizing哲学：越大越好。\n\n为什么extreme sizing：\n• Calling station会用任何Ax call down\n• 他不会fold '我击中了'的牌\n• 他不care pot odds或equity\n• 他的思维：'我有对A，我必须看看你有什么'\n\n正常sizing vs 剥削sizing：\n• GTO: 60-75% pot获取balanced value\n• 剥削: 125-150% pot榨取最大价值\n• 额外profit: 50-75 BB!\n\nRisk：\n• 几乎没有 - calling station不会没牌call huge bet\n• 如果他fold，他本来也要fold smaller bet\n• 如果他call，你赚了更多\n\n结论：对calling station，value bet as much as possible。",
                key_points: [
                    "Calling station = 大sizing天堂",
                    "不要'fair' sizing - 榨取最大价值",
                    "他们的弱点是over-calling → 用大注惩罚",
                    "河牌可以bet 150-200% pot如果他们很sticky",
                    "Zero bluff vs calling station（他们不fold）"
                ],
                wrong_sizing: {
                    size: "50% pot (balanced sizing)",
                    why_wrong: "你在'leaving money on the table'。Calling station会call 50% pot也会call 150% pot，为什么不bet更大？这不是level或balance的问题 - 他们的fold button坏了，无限剥削他们的calling tendency。"
                }
            },
            {
                title: "案例2: 对抗Nit的任意Bluff",
                hand: "7♣ 6♣ (complete air)",
                board: "A♦ K♠ Q♥ 9♠ 4♣",
                pot: "河牌25BB",
                sizing: "40% pot (10BB) - 小bluff",
                opponent: "Nit (只用nuts call河牌大注)",
                rationale: "对抗Nit的sizing哲学：sizing无所谓，他们会fold。\n\n为什么小sizing够了：\n• Nit只会call如果他有极强牌（两对+）\n• 如果他有Ax/Kx/Qx（顶对），他会fold任何sizing\n• 所以10BB小注和50BB大注对他fold frequency一样\n• 选择小注 = 风险最小化，成功率一样\n\nSizing选择：\n• 33-50% pot就够\n• 不需要fancy overbet\n• Simple, cheap, effective\n\n反向思维：\n• 不要对nit bluff too much\n• 他们fold range极宽，但call range极强\n• 选择好spot（他们unlikely有强牌）\n• 然后bet小就够了",
                key_points: [
                    "Nit = 小sizing bluff天堂",
                    "他们fold button过度活跃 → 任何bet都work",
                    "不需要冒险大注 - 小注够了",
                    "选择spot > 选择sizing（vs nit）",
                    "但不要过度bluff - 他们call range很强"
                ]
            },
            {
                title: "案例3: 对抗LAG的Trapping Sizing",
                hand: "Q♠ Q♥ (超对)",
                board: "8♣ 7♦ 3♠ K♥ 5♣",
                pot: "河牌35BB",
                sizing: "33% pot (11BB) - 小sizing诱导",
                opponent: "LAG (经常bluff raise)",
                rationale: "对抗LAG的sizing调整：小sizing trap。\n\n策略原理：\n• LAG玩家看到小sizing会suspect weakness\n• 他们经常raise小sizing作为bluff\n• 你用强牌（QQ）bet小，诱导他raise\n• 然后你call或3-bet他的raise\n\n为什么这work：\n• LAG的思维：'他bet这么小，肯定是弱牌想便宜showdown'\n• 你的QQ看起来像AT，JJ等中等牌\n• 他会用Kx或air raise\n• 你call他的raise（或3-bet）获得巨大价值\n\n对比标准sizing：\n• 如果你bet 66% pot，LAG会fold大部分bluff\n• 小sizing诱导他犯错（bluff raise you）\n\nRisk：如果他没有raise就call，你只赢了小底池。但EV分析：\n• 30%他raise你赢35BB+ more\n• 70%他call你赢11BB\n• vs标准sizing 100%他fold你赢35BB\n• Trap EV更高！",
                key_points: [
                    "LAG = 诱导性sizing机会",
                    "小sizing让他们over-bluff",
                    "用强牌bet小，诱导bluff raise",
                    "要有再raise或call raise的plan",
                    "这是高级play - 需要准确read opponent tendency"
                ]
            },
            {
                title: "案例4: 对抗Thinking Player回归GTO",
                hand: "K♣ J♣ (顶对)",
                board: "K♠ 9♥ 4♦ 7♠ 2♣",
                pot: "河牌30BB",
                sizing: "55% pot (16.5BB) - GTO标准",
                opponent: "High-level reg",
                rationale: "对抗好玩家：不要fancy，回归GTO。\n\n为什么标准sizing：\n• 好玩家会注意你的sizing patterns\n• 如果你总是大sizing with value，他们会fold\n• 如果你总是小sizing with air，他们会call/raise\n• 任何exploitative sizing会被反exploit\n\n最佳策略：\n• 使用GTO标准sizing（50-66% pot）\n• 不给他们pattern读取\n• 让你的sizing range-based而非hand-based\n• 偶尔随机deviation防止被完全读透\n\nGame theory：\n• 对抗好玩家，谁更接近GTO谁赢\n• Exploitation会被counter-exploitation\n• 保持unpredictable和balanced\n• 你的profit来自他们的小mistakes，不是大exploit",
                key_points: [
                    "好玩家 = 回归GTO",
                    "不要over-adjust - 他们会counter",
                    "标准sizing + balanced range = unexploitable",
                    "小optimization > 大deviation",
                    "对好玩家，最小化自己的mistakes > 最大化exploit"
                ]
            }
        ],
        
        world_class_insight: "💡 世界级洞察：剥削性sizing的艺术是'知道什么时候偏离GTO'。口诀：对calling station往大调（150%+），对nit往小调（任意bluff），对LAG用trap sizing（诱导），对高手回归标准（50-66%）。但关键是'observation' - 你必须先确认对手的tendency（至少50+ hands），否则你的'exploit'可能是错误的assumption。记住：Bad exploitation < GTO < Good exploitation。如果不确定对手tendency，就用GTO sizing，不会错太多。"
    }
};

// Sizing计算器函数
function calculateSizing(pot, strength, stack, street, opponent) {
    let sizing_percent, sizing_bb, strategy_type, explanation, alternative;
    
    // 基础sizing计算
    if (strength >= 9) {
        // Nuts级别
        if (opponent === 'calling_station' || opponent === 'fish') {
            sizing_percent = street === 'river' ? 125 : (street === 'turn' ? 75 : 66);
            strategy_type = "剥削性大Sizing - 对手会pay off";
            explanation = `你有nuts级别的牌，对手是${opponent === 'fish' ? '鱼' : '跟注站'}。使用大sizing（${sizing_percent}% pot）榨取最大价值。他们的弱点是over-call，要无情剥削。`;
        } else if (opponent === 'nit') {
            sizing_percent = street === 'river' ? 50 : (street === 'turn' ? 55 : 50);
            strategy_type = "Merged Sizing - Nit不会付钱";
            explanation = `虽然你有nuts，但对手是Nit。大sizing会吓走他们。使用标准sizing（${sizing_percent}% pot）诱导他们用中等牌call。`;
        } else {
            sizing_percent = street === 'river' ? 75 : (street === 'turn' ? 66 : 50);
            strategy_type = "标准Value Sizing";
            explanation = `Nuts级别牌力使用标准value sizing（${sizing_percent}% pot）。${street === 'river' ? '河牌可以极化，用nuts和bluff一起overbet。' : '继续build pot为河牌做准备。'}`;
        }
    } else if (strength >= 7) {
        // 强牌
        if (opponent === 'lag') {
            sizing_percent = street === 'river' ? 33 : (street === 'turn' ? 50 : 55);
            strategy_type = "诱导性Sizing - Trap LAG";
            explanation = `你有强牌，对手是LAG。${street === 'river' ? '河牌使用小sizing（33% pot）诱导他bluff raise。' : `使用中等sizing（${sizing_percent}% pot）不吓走他，让他继续aggressive。`}`;
            alternative = `备选：如果LAG特别疯狂，可以用标准sizing（60% pot），他会用很宽的range继续。`;
        } else {
            sizing_percent = street === 'river' ? 66 : (street === 'turn' ? 60 : 50);
            strategy_type = "标准Value Sizing";
            explanation = `强牌使用几何sizing（${sizing_percent}% pot）build pot。${street === 'river' ? '河牌可以大注获取价值。' : '为后续街道做准备。'}`;
        }
    } else if (strength >= 5) {
        // 中等牌力
        sizing_percent = street === 'river' ? 50 : (street === 'turn' ? 50 : 50);
        strategy_type = "Merged Sizing - 中等牌力";
        explanation = `中等牌力使用merged sizing（50% pot）。不确定是否领先，标准sizing获取一些价值同时不over-commit。${street === 'river' ? '河牌考虑check或小bet。' : '后续街要根据对手reaction调整。'}`;
        alternative = `OOP时考虑check-call或blocker bet（33% pot）更安全。`;
    } else if (strength >= 3) {
        // 弱牌/听牌
        if (opponent === 'nit') {
            sizing_percent = 40;
            strategy_type = "Bluff Sizing - 对Nit任何sizing都work";
            explanation = `弱牌对抗Nit可以bluff。小sizing（40% pot）就够了，他们会fold大部分range。不需要冒险大注。`;
        } else {
            sizing_percent = street === 'river' ? 0 : 50;
            strategy_type = street === 'river' ? "Give Up - 河牌放弃" : "Semi-Bluff / Fold";
            explanation = street === 'river' ? 
                `河牌弱牌对抗${opponent}建议check-fold，除非有特别好的bluff story。` :
                `翻牌/转牌可以semi-bluff（50% pot）如果有equity。否则fold。`;
        }
    } else {
        // Air
        if (opponent === 'nit') {
            sizing_percent = 33;
            strategy_type = "Small Bluff vs Nit";
            explanation = `Complete air但对手是Nit。小sizing（33% pot）bluff，他们会fold大部分range。成功率高，风险低。`;
        } else if (opponent === 'calling_station' || opponent === 'fish') {
            sizing_percent = 0;
            strategy_type = "Give Up - 不要bluff calling station";
            explanation = `Air对抗calling station/鱼建议check-fold。他们不fold，bluff是亏损的。`;
        } else {
            sizing_percent = street === 'river' ? 66 : 0;
            strategy_type = street === 'river' ? "River Bluff Attempt" : "Fold";
            explanation = street === 'river' ?
                `河牌位置bluff attempt（66% pot）如果有credible story。需要good read和fold equity。` :
                `Complete air在翻牌/转牌建议fold，除非有position和range advantage。`;
        }
    }
    
    sizing_bb = (pot * sizing_percent / 100).toFixed(1);
    
    return {
        sizing_percent,
        sizing_bb,
        strategy_type,
        explanation,
        alternative
    };
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SIZING_DATA, calculateSizing };
} else {
    window.calculateSizing = calculateSizing;
}

