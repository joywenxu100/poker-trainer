// 德州扑克训练师 V2.0 - 职业级深度强化
// 在原有基础上，新增职业级内容，不改动原有26个基础问题

// ==================== 原有基础内容（保持不变） ====================
const PHASES_BASIC = [
    {
        id: 1,
        title: "信息收集",
        time: "3-5秒",
        warning: false,
        questions: [
            { q: "我的位置是什么？", a: "BTN/CO/MP/EP/SB/BB - 位置决定你的行动范围和策略" },
            { q: "我的有效筹码是多少BB？", a: "筹码量决定你的策略，深筹码vs短筹码打法完全不同" },
            { q: "当前底池大小是多少？", a: "底池大小影响下注sizing和赔率计算" },
            { q: "对手是谁？", a: "识别对手类型：紧/松/激进/被动，针对性调整策略" }
        ]
    },
    {
        id: 2,
        title: "牌力评估",
        time: "2-3秒",
        warning: false,
        questions: [
            { q: "我的绝对牌力如何？", a: "坚果/强牌/中牌/弱牌 - 客观评估你的牌" },
            { q: "我的牌在对手范围中的相对强度？", a: "不是看牌面，而是看对手可能有什么" },
            { q: "我有多少改进潜力(outs)？", a: "计算能改进成强牌的张数，评估听牌价值" },
            { q: "公共牌面结构？", a: "干燥board vs 湿润board，coordinated还是rainbow" }
        ]
    },
    {
        id: 3,
        title: "对手范围分析",
        time: "3-5秒",
        warning: false,
        questions: [
            { q: "对手之前的行动表示什么范围？", a: "根据preflop和之前街道的action缩小范围" },
            { q: "对手可能的强牌/中等牌/诈唬比例？", a: "估算对手range的组成，不要只想一手牌" },
            { q: "对手会不会在这里诈唬？", a: "评估对手的诈唬频率和倾向" },
            { q: "对手会不会fold掉更好的牌？", a: "考虑fold equity，能否让对手弃掉中等牌" }
        ]
    },
    {
        id: 4,
        title: "赔率计算",
        time: "2-3秒",
        warning: false,
        questions: [
            { q: "底池赔率是多少？", a: "需要投入的筹码 vs 底池大小，例如call 100进300底池 = 25%胜率" },
            { q: "我需要多少胜率才能call？", a: "根据底池赔率计算盈亏平衡点" },
            { q: "我的实际胜率/equity是多少？", a: "对抗对手范围，我的牌能赢多少%" },
            { q: "隐含赔率是否足够？", a: "击中后能从对手那赢多少，是否值得追" }
        ]
    },
    {
        id: 5,
        title: "情绪自检",
        time: "1-2秒",
        warning: true,
        questions: [
            { q: "我现在是否冷静？", a: "情绪失控是输钱的头号原因，必须诚实自检" },
            { q: "刚才的结果是否影响我？", a: "不要带着上一手的情绪做决策，每手都是独立的" },
            { q: "我是基于逻辑还是情绪做决策？", a: "想报复？想追回损失？这都是情绪，不是逻辑" },
            { q: "如果是1小时前，我会做同样决策吗？", a: "用这个问题检验决策的理性程度" }
        ]
    },
    {
        id: 6,
        title: "行动决策",
        time: "2-3秒",
        warning: false,
        questions: [
            { q: "Fold的理由是什么？", a: "胜率不足以支撑call/raise，没有足够的fold equity" },
            { q: "Call的理由是什么？", a: "有足够的赔率，但raise的价值不大或风险高" },
            { q: "Raise的理由是什么？", a: "Value bet强牌、保护底池、诈唬、获取fold equity" },
            { q: "我的bet/raise大小合理吗？", a: "通常0.5-0.75pot，根据目的调整sizing" }
        ]
    },
    {
        id: 7,
        title: "二次确认",
        time: "1-2秒",
        warning: false,
        questions: [
            { q: "这个决策符合我的整体策略吗？", a: "不要偏离既定策略，保持一致性" },
            { q: "这个决策长期来看是+EV的吗？", a: "短期输赢不重要，长期盈利才是目标" },
            { q: "我有没有漏掉关键信息？", a: "最后检查一遍，确保没有遗漏" }
        ]
    }
];

// ==================== 新增：职业级深度问题 ====================
const PHASES_PRO = [
    {
        id: 1,
        title: "信息收集（职业级）",
        time: "5-8秒",
        warning: false,
        level: "PRO",
        questions: [
            { 
                q: "这桌玩家的整体动态如何？", 
                a: "🎯 桌面动态评估：\n• 是否有鱼玩家（跟注站/疯子）？\n• 是否有短筹码all-in威胁？\n• 桌子整体是紧还是松？\n• 是否有位置优势可利用？\n💡 关键：鱼越多，越要打价值；reg越多，越要平衡" 
            },
            { 
                q: "我在这手牌的历史形象是什么？", 
                a: "🎯 形象管理：\n• 最近是否连续弃牌（被认为紧）？\n• 最近是否频繁下注（被认为松）？\n• 是否刚展示过诈唬？\n• 是否刚展示过强牌？\n💡 关键：利用对手对你的错误认知" 
            },
            { 
                q: "SPR（筹码底池比）对我的策略影响？", 
                a: "🎯 SPR深度分析：\n• SPR < 3：顶对以上all-in，听牌fold\n• SPR 3-13：中等牌可以玩，但要控制\n• SPR > 13：需要坚果或强听牌才能投入全部\n💡 关键：SPR决定你的承诺度" 
            },
            { 
                q: "对手筹码量对我的策略影响？", 
                a: "🎯 对手筹码深度：\n• 短筹码（<40BB）：更宽范围call他all-in\n• 中筹码（40-100BB）：标准策略\n• 深筹码（>100BB）：需要更强牌力和位置\n💡 关键：不要用深筹码和短筹码玩边缘牌" 
            },
            { 
                q: "这是单挑底池还是多人底池？", 
                a: "🎯 底池类型策略：\n• 单挑：可以更激进，诈唬频率更高\n• 3人底池：中等牌要小心，听牌价值下降\n• 4+人底池：只玩坚果和坚果听牌\n💡 关键：多人底池诈唬是最大错误" 
            },
            { 
                q: "我的位置优势有多大？", 
                a: "🎯 位置优势量化：\n• IP vs OOP：你能看到对手行动再决策\n• BTN vs BB：位置+范围双重优势\n• BTN vs EP：位置优势但范围劣势\n💡 关键：IP时更激进，OOP时更谨慎" 
            }
        ]
    },
    {
        id: 2,
        title: "牌力评估（职业级）",
        time: "3-5秒",
        warning: false,
        level: "PRO",
        questions: [
            { 
                q: "我的牌有多少blockers效应？", 
                a: "🎯 Blocker分析：\n• 持有A阻断对手AA/AK\n• 持有K阻断对手KK/AK\n• 持有同花色阻断对手同花\n• 持有顺子关键牌阻断顺子\n💡 关键：Blocker让你的诈唬更有效" 
            },
            { 
                q: "我在这个牌面的范围优势如何？", 
                a: "🎯 Range Advantage：\n• 低牌面（235）：加注者范围优势\n• 中牌面（J87）：双方都击中\n• 高牌面（AKQ）：加注者极大优势\n💡 关键：范围优势时可以下大注，劣势时要控制" 
            },
            { 
                q: "我是否有nut advantage？", 
                a: "🎯 Nut Advantage：\n• 对手范围是否缺少坚果？\n• 我的范围是否包含坚果？\n• 对手是否会在这里慢打坚果？\n💡 关键：Nut advantage让你可以超池下注" 
            },
            { 
                q: "我的牌是capped还是uncapped？", 
                a: "🎯 Range Cap分析：\n• Capped：对手知道你最强只能有什么（如只call不raise）\n• Uncapped：你可能有任何强牌（如你是加注者）\n💡 关键：Capped时不要大额诈唬" 
            },
            { 
                q: "我的牌是merge还是polarize？", 
                a: "🎯 Range构成：\n• Polarized：要么坚果要么空气（河牌超池）\n• Merged：中等价值牌+部分强牌（翻牌圈）\n• Linear：从上往下的牌（小额value）\n💡 关键：不同构成对应不同sizing" 
            },
            { 
                q: "这张牌改变了range优势吗？", 
                a: "🎯 动态评估：\n• 转牌/河牌是否改变了range advantage？\n• 是否有新的听牌出现？\n• 对手range是否因此变强/变弱？\n💡 关键：每条街都要重新评估" 
            }
        ]
    },
    {
        id: 3,
        title: "对手范围分析（职业级）",
        time: "5-8秒",
        warning: false,
        level: "PRO",
        questions: [
            { 
                q: "对手的3-bet范围是什么？", 
                a: "🎯 3-bet范围解析：\n• 紧手：QQ+, AK（5-7%）\n• 标准reg：JJ+, AQ+, KQs, bluff（8-12%）\n• 激进玩家：宽范围3-bet（15-20%）\n💡 关键：根据对手类型调整4-bet/call/fold" 
            },
            { 
                q: "对手在这个位置会慢打什么？", 
                a: "🎯 Slowplay识别：\n• 湿润牌面：很少慢打（怕被超越）\n• 干燥牌面：AA/KK/set可能慢打\n• 对手类型：鱼更爱慢打，reg很少慢打\n💡 关键：不要高估对手慢打频率" 
            },
            { 
                q: "对手的bet sizing透露了什么？", 
                a: "🎯 Sizing tell：\n• 小注（1/3 pot）：通常是弱牌、诈唬或引诱\n• 标准注（1/2-2/3 pot）：平衡范围\n• 大注/超池：极化范围或不平衡玩家\n💡 关键：Sizing patterns很重要" 
            },
            { 
                q: "对手是否存在timing tell？", 
                a: "🎯 时间tell：\n• 快速下注：通常是强牌或纯诈唬\n• 长考后下注：通常是边缘牌\n• 快速call：通常是听牌\n• 长考后call：通常是边缘call\n💡 关键：线上这个tell更准" 
            },
            { 
                q: "对手range是否存在明显漏洞？", 
                a: "🎯 Range漏洞：\n• 是否只value bet不诈唬？→ 可以fold\n• 是否诈唬过度？→ 可以call wider\n• 是否从不fold中对？→ 不要诈唬\n• 是否太容易fold？→ 多诈唬\n💡 关键：识别漏洞并剥削" 
            },
            { 
                q: "对手是否会在这里用强牌加注？", 
                a: "🎯 Raise频率分析：\n• 激进玩家：会用强牌+诈唬加注\n• 被动玩家：只用坚果加注\n• 如果对手不加注：你的中等牌更安全\n💡 关键：被动玩家的加注要极度尊重" 
            }
        ]
    },
    {
        id: 4,
        title: "赔率计算（职业级）",
        time: "3-5秒",
        warning: false,
        level: "PRO",
        questions: [
            { 
                q: "我的fold equity是多少？", 
                a: "🎯 Fold Equity计算：\n• 对手fold频率 × 底池大小 = fold equity\n• 例如：对手fold 40%，底池100，FE=40\n• 你的bluff EV = FE - 下注成本×(1-fold%)\n💡 关键：没有fold equity不要诈唬" 
            },
            { 
                q: "我的equity实现率是多少？", 
                a: "🎯 Equity Realization：\n• IP equity实现率高（80-100%）\n• OOP equity实现率低（60-80%）\n• 例如：35% equity OOP，实际只能实现25%\n💡 关键：OOP需要更高equity才能call" 
            },
            { 
                q: "反向隐含赔率有多大？", 
                a: "🎯 Reverse Implied Odds：\n• 击中后仍会输更多钱的风险\n• 例如：追小同花，对手可能有大同花\n• 追低端顺子，对手可能有高端顺子\n💡 关键：新手常忽视反向隐含赔率" 
            },
            { 
                q: "多街价值如何最大化？", 
                a: "🎯 Multi-street Value：\n• 翻牌圈小注→转牌圈中注→河牌圈大注\n• 逐步build pot，让对手舒服地投入\n• 不要一次性吓跑对手\n💡 关键：价值最大化≠单次最大注" 
            },
            { 
                q: "我的MDF（最小防守频率）是多少？", 
                a: "🎯 MDF计算：\n• MDF = 底池 / (底池 + 对手下注)\n• 例如：底池100，对手下75，MDF=57%\n• 你需要defend 57%以上防止被剥削\n💡 关键：不要fold太多，也不要call太多" 
            },
            { 
                q: "EV期望值精确计算？", 
                a: "🎯 精确EV计算：\n• EV = (赢的概率×赢的金额) - (输的概率×输的金额)\n• 例如：50%赢100，50%输80，EV=+10\n• 边缘决策必须精确计算\n💡 关键：+EV就做，-EV就不做" 
            }
        ]
    },
    {
        id: 5,
        title: "情绪自检（职业级）",
        time: "2-3秒",
        warning: true,
        level: "PRO",
        questions: [
            { 
                q: "我是否处于A-game状态？", 
                a: "⚠️ A-game检查清单：\n• 注意力集中100%\n• 没有外界干扰\n• 身体状态良好（不饿不累）\n• 情绪稳定无波动\n💡 不是A-game就离桌！" 
            },
            { 
                q: "我是否在玩「复仇扑克」？", 
                a: "⚠️ 复仇心理识别：\n• 是否针对某个玩家？\n• 是否想证明什么？\n• 是否因为被bluff而生气？\n💡 复仇心理=灾难！立即停止" 
            },
            { 
                q: "我的风险承受力是否正常？", 
                a: "⚠️ 风险承受力check：\n• 是否不敢下注（过于谨慎）？\n• 是否瞎下注（过于激进）？\n• 是否all-in太随意（绝望）？\n💡 关键：正常状态=按概率决策" 
            },
            { 
                q: "我是否在「证明自己」？", 
                a: "⚠️ 自证心理陷阱：\n• 是否想展示自己是好玩家？\n• 是否不想被认为弱？\n• 是否为了面子而call？\n💡 职业玩家只在乎+EV，不在乎面子" 
            },
            { 
                q: "我的止损线是否还在？", 
                a: "⚠️ 止损纪律：\n• 今天已输多少buy-in？\n• 是否超过预设止损点？\n• 是否在想「回本」？\n💡 超过止损线立即离桌，明天再战" 
            },
            { 
                q: "我是否在「自动驾驶」模式？", 
                a: "⚠️ 自动驾驶危险：\n• 是否不经思考就行动？\n• 是否在多任务（看手机/视频）？\n• 是否感到无聊或疲劳？\n💡 自动驾驶=送钱，必须休息" 
            }
        ]
    },
    {
        id: 6,
        title: "行动决策（职业级）",
        time: "3-5秒",
        warning: false,
        level: "PRO",
        questions: [
            { 
                q: "我的betting line是否讲一个连贯的故事？", 
                a: "🎯 故事一致性：\n• Preflop raise→Flop c-bet→Turn bet = 强牌\n• Preflop call→Flop check→Turn donk = 听牌或陷阱\n• 故事不合理会被识破\n💡 关键：每个action都要符合你想表达的range" 
            },
            { 
                q: "这个sizing是平衡的吗？", 
                a: "🎯 Sizing平衡：\n• 相同sizing既要有value又要有bluff\n• Value:Bluff比例通常2:1或3:1\n• 不同sizing不同range构成\n💡 关键：单一sizing会被剥削" 
            },
            { 
                q: "我是否在正确频率下诈唬？", 
                a: "🎯 Bluff频率计算：\n• 下注越大，需要成功率越低\n• Pot bet需要50%成功率\n• 1/2 pot bet需要33%成功率\n• 1/3 pot bet需要25%成功率\n💡 关键：根据fold equity调整bluff频率" 
            },
            { 
                q: "Check背后的含义是什么？", 
                a: "🎯 Check策略：\n• Check-call：中等牌力，pot control\n• Check-raise：陷阱或半诈唬\n• Check-fold：放弃这手牌\n• Check-check：both放弃或slowplay\n💡 关键：Check不是弱，是策略" 
            },
            { 
                q: "我的range是否overfolding？", 
                a: "🎯 Overfold检查：\n• 如果对手下注你fold > 50%，你被剥削\n• 计算MDF，确保defend足够频率\n• 不要因为怕输而fold太多\n💡 关键：被动=慢性死亡" 
            },
            { 
                q: "这是thin value还是bluff？", 
                a: "🎯 Thin Value vs Bluff：\n• Thin value：认为对手会用更差的牌call\n• Bluff：认为对手会fold更好的牌\n• 边界很模糊，需要精确reads\n💡 关键：对抗calling station少bluff多value" 
            }
        ]
    },
    {
        id: 7,
        title: "二次确认（职业级）",
        time: "2-3秒",
        warning: false,
        level: "PRO",
        questions: [
            { 
                q: "这个决策是否能在replayer中defend？", 
                a: "🎯 事后检验标准：\n• 逻辑是否清晰？\n• 是否基于正确假设？\n• 是否考虑了所有因素？\n💡 关键：能defend的决策才是好决策" 
            },
            { 
                q: "我是否在level战中想多了？", 
                a: "🎯 Level战陷阱：\n• Level 0：他有什么牌？\n• Level 1：我有什么牌？\n• Level 2：他认为我有什么？\n• Level 3+：容易overthink\n💡 关键：对抗鱼停在Level 1" 
            },
            { 
                q: "这个决策的后续可控吗？", 
                a: "🎯 后续可控性：\n• Call后转牌怎么办？\n• Raise被3-bet怎么办？\n• Check被下注怎么办？\n💡 关键：不要做了没有后续计划的action" 
            },
            { 
                q: "我是否在table select而非seat select？", 
                a: "🎯 桌子选择：\n• 好的桌子：鱼多、深筹码、被动\n• 差的桌子：全是reg、短筹码、激进\n• 错误的桌子=负EV\n💡 关键：选对桌子比打得好更重要" 
            },
            { 
                q: "我的bankroll management是否健康？", 
                a: "🎯 资金管理：\n• Cash game：至少50个buy-in\n• MTT：至少100个buy-in\n• 现在的级别适合你吗？\n💡 关键：BRM是职业生涯的生命线" 
            },
            { 
                q: "这个session是否该结束了？", 
                a: "🎯 Session结束信号：\n• 已达盈利目标\n• 已达止损点\n• 注意力下降\n• 情绪波动\n• 桌子质量下降\n💡 关键：知道何时离桌是最重要的技能" 
            }
        ]
    }
];

// ==================== 新增：实战陷阱库 ====================
const TRAPS = [
    {
        category: "翻前陷阱",
        traps: [
            { 
                q: "陷阱：在EP用suited connector 3-bet", 
                a: "⚠️ 为什么错：\n• EP 3-bet需要能4-bet all-in的牌\n• Suited connector实现率低，不适合打膨胀底池\n• 被4-bet后进退两难\n✅ 正确：EP 3-bet只用QQ+/AK，suited connector fold或limp" 
            },
            { 
                q: "陷阱：在BB对SB limp过度防守", 
                a: "⚠️ 为什么错：\n• SB limp通常是中等牌，不是垃圾\n• BB不要用任意两张raise\n• Position在flop后很重要\n✅ 正确：BB raise强牌，check-raise翻牌圈" 
            },
            { 
                q: "陷阱：用小口袋对在多人底池call大额3-bet", 
                a: "⚠️ 为什么错：\n• 多人底池set value下降\n• 3-bet pot太大，miss后失血过多\n• Implied odds不够\n✅ 正确：小口袋对对抗3-bet通常fold，除非深筹码单挑" 
            },
            { 
                q: "陷阱：在CO/BTN对MP开池over-3bet", 
                a: "⚠️ 为什么错：\n• MP开池range很强\n• 3-bet太频繁会被4-bet\n• Position优势已经够，不需要过度3-bet\n✅ 正确：用position flat call，flop后剥削" 
            },
            { 
                q: "陷阱：短筹码（<30BB）用speculative hands", 
                a: "⚠️ 为什么错：\n• 短筹码没有implied odds\n• Suited connector/小对子价值为0\n• 应该玩all-in or fold策略\n✅ 正确：短筹码只玩premium hands和push/fold" 
            }
        ]
    },
    {
        category: "翻牌圈陷阱",
        traps: [
            { 
                q: "陷阱：在湿润牌面用顶对慢打", 
                a: "⚠️ 为什么错：\n• 太多听牌可能超越你\n• 给对手免费看牌=送钱\n• 转牌一张scare card你的牌价值骤降\n✅ 正确：湿润牌面快打，保护equity" 
            },
            { 
                q: "陷阱：在多人底池持续c-bet空气", 
                a: "⚠️ 为什么错：\n• 多人底池至少有人击中\n• Fold equity极低\n• 烧钱式bluff\n✅ 正确：多人底池没击中就check-fold" 
            },
            { 
                q: "陷阱：用卡顺听牌（gutshot）call大注", 
                a: "⚠️ 为什么错：\n• 只有4张outs（约8% equity）\n• 需要至少12:1的赔率\n• 大部分情况赔率不够\n✅ 正确：Gutshot只在有implied odds或加上backdoor时call" 
            },
            { 
                q: "陷阱：对check-raise过度尊重", 
                a: "⚠️ 为什么错：\n• 现代玩家check-raise很频繁\n• 包含大量semi-bluff和空气\n• 自动fold=被剥削\n✅ 正确：根据board texture和对手类型，该call就call" 
            },
            { 
                q: "陷阱：用第二对在A-high board继续投入", 
                a: "⚠️ 为什么错：\n• A-high board对手通常有A\n• 第二对几乎没有改进潜力\n• 你在给对手送钱\n✅ 正确：A-high board没A就check-fold或小pot控制" 
            }
        ]
    },
    {
        category: "转牌圈陷阱",
        traps: [
            { 
                q: "陷阱：转牌出scare card仍然大额c-bet", 
                a: "⚠️ 为什么错：\n• Scare card改变了range优势\n• 对手可能刚好击中\n• 你的bluff range太明显\n✅ 正确：Scare card出现要重新评估，考虑check或小额bet" 
            },
            { 
                q: "陷阱：用弱听牌面对大额bet仍然追", 
                a: "⚠️ 为什么错：\n• 转牌只剩一张牌机会\n• Equity急剧下降\n• 赔率几乎不可能够\n✅ 正确：转牌听牌面对大注通常fold，除非nut draw+blockers" 
            },
            { 
                q: "陷阱：转牌完成听牌后下小注", 
                a: "⚠️ 为什么错：\n• 给了对手完美的赔率call\n• 错失榨取价值的机会\n• 对手可能河牌改进\n✅ 正确：转牌完成后下标准注或大注" 
            },
            { 
                q: "陷阱：在polarized spot下merge sizing", 
                a: "⚠️ 为什么错：\n• 转牌经常是polarized spot\n• 你要么有很强的牌要么在bluff\n• Merge sizing暴露你的range\n✅ 正确：Polarized时下大注（70-150% pot）" 
            },
            { 
                q: "陷阱：忽视对手的line突然改变", 
                a: "⚠️ 为什么错：\n• Check-check后突然转牌下注=通常很强\n• 小注-小注后突然大注=极化\n• Line改变是重要信息\n✅ 正确：注意对手betting pattern变化" 
            }
        ]
    },
    {
        category: "河牌圈陷阱",
        traps: [
            { 
                q: "陷阱：用bluff catcher做hero call", 
                a: "⚠️ 为什么错：\n• 对手range通常比你想象的强\n• Hero call长期是-EV的\n• 除非有明确reads，否则是ego call\n✅ 正确：Bluff catcher对抗大注默认fold，除非对手showdown超高" 
            },
            { 
                q: "陷阱：河牌用中等牌下注", 
                a: "⚠️ 为什么错：\n• 更差的牌会fold\n• 更好的牌会call/raise\n• 这是way-ahead or way-behind情况\n✅ 正确：河牌中等牌通常check，走到showdown" 
            },
            { 
                q: "陷阱：河牌完成obvious draw后仍然bluff", 
                a: "⚠️ 为什么错：\n• 对手知道draw完成了\n• 你的bluff太明显\n• Fold equity极低\n✅ 正确：Obvious draw完成时要么有要么check" 
            },
            { 
                q: "陷阱：河牌超池bluff without blockers", 
                a: "⚠️ 为什么错：\n• 超池bluff需要极高fold equity\n• 没有blockers对手call range太宽\n• 风险收益比极差\n✅ 正确：超池bluff只在有关键blockers时做" 
            },
            { 
                q: "陷阱：河牌thin value bet对calling station", 
                a: "⚠️ 为什么错：\n• Calling station用任何对子call\n• 你的thin value变成了送钱\n• 对手类型决定betting strategy\n✅ 正确：对calling station只bet nuts或near-nuts" 
            },
            { 
                q: "陷阱：河牌因为pot大就「不得不call」", 
                a: "⚠️ 为什么错：\n• Pot odds不是唯一考虑因素\n• 对手range分析更重要\n• 「already invested」是sunk cost fallacy\n✅ 正确：每个决策独立评估，不考虑之前投入" 
            }
        ]
    },
    {
        category: "心理陷阱",
        traps: [
            { 
                q: "陷阱：想要「赢回」刚输掉的钱", 
                a: "⚠️ 为什么错：\n• 每手牌都是独立的\n• 「赢回」心态=tilt的开始\n• 会做出非理性决策\n✅ 正确：忘记上一手，只关注当前决策的EV" 
            },
            { 
                q: "陷阱：用「感觉」而非数学做决策", 
                a: "⚠️ 为什么错：\n• 感觉不可靠\n• 人类极差于估计概率\n• 长期必输\n✅ 正确：每个决策基于equity和EV计算" 
            },
            { 
                q: "陷阱：打「结果导向」而非「过程导向」", 
                a: "⚠️ 为什么错：\n• 好决策可能输钱（variance）\n• 坏决策可能赢钱（luck）\n• 结果导向会学错东西\n✅ 正确：只评估决策质量，不评估结果" 
            }
        ]
    }
];

// ==================== 新增：GTO概念深度解析 ====================
const GTO_CONCEPTS = [
    {
        category: "核心概念",
        concepts: [
            {
                q: "什么是GTO（Game Theory Optimal）？",
                a: "🧠 GTO定义：\n• 无法被剥削的策略\n• 不是最盈利的策略（剥削才是）\n• 是防守型策略，保护你不被聪明玩家剥削\n\n📊 GTO vs 剥削：\n• GTO：对抗未知对手\n• 剥削：对抗已知漏洞\n• 顶级玩家：80% GTO + 20% 剥削\n\n💡 关键：先学GTO作为baseline，再学剥削"
            },
            {
                q: "什么是MDF（Minimum Defense Frequency）？",
                a: "🧠 MDF公式：\n• MDF = 底池 / (底池 + 对手下注)\n• 例如：底池100，对手下50，MDF = 100/(100+50) = 67%\n\n📊 实战应用：\n• 对手下1/2 pot，你要defend 67%\n• 对手下pot，你要defend 50%\n• 对手下1/3 pot，你要defend 75%\n\n⚠️ 常见错误：\n• Overfold：defend < MDF → 被剥削\n• Overcall：defend > MDF → 输钱\n\n💡 关键：GTO要求你defend足够频率"
            },
            {
                q: "什么是Polarization（极化）？",
                a: "🧠 Polarization定义：\n• Range只包含极强牌和空气，没有中等牌\n• 例如：河牌超池下注=要么nuts要么bluff\n\n📊 何时极化：\n• 河牌大额下注（>70% pot）\n• 3-bet/4-bet all-in范围\n• Check-raise河牌\n\n📊 Polarized vs Merged：\n• Polarized：强+空气（大注）\n• Merged：强+中+部分bluff（中注）\n• Linear：从强到弱（小注）\n\n💡 关键：Sizing决定range构成"
            },
            {
                q: "什么是Blocker（阻断牌）？",
                a: "🧠 Blocker效应：\n• 你持有的牌，对手就不可能有\n• 例如：你有A♠，对手不可能有A♠A♥\n\n📊 关键Blockers：\n• A blocker：阻断AA/AK/Ax\n• K blocker：阻断KK/AK/Kx\n• 同花blocker：阻断同花\n• 顺子关键牌：阻断顺子\n\n🎯 应用场景：\n• 河牌bluff：用blocker选择bluff combos\n• Hero call：对手有A→他bluff概率下降\n• Fold：对手有K→他value range增加\n\n💡 关键：Blocker让GTO更精细"
            },
            {
                q: "什么是Range Advantage（范围优势）？",
                a: "🧠 Range Advantage定义：\n• 一方range在该board上更强\n• 能做出更多强牌组合\n\n📊 典型例子：\n• A-high board：PFR有range advantage\n• 低牌面（235）：PFR有range advantage  \n• 中连接牌面（987）：Caller有range advantage\n\n🎯 实战应用：\n• 有range advantage：可以高频c-bet\n• 无range advantage：要check更多\n• 动态变化：每条街重新评估\n\n💡 关键：Range advantage比手牌强度更重要"
            },
            {
                q: "什么是Nut Advantage（坚果优势）？",
                a: "🧠 Nut Advantage定义：\n• 一方range包含更多坚果组合\n• 即使整体range相似，nuts分布不同\n\n📊 典型例子：\n• PFR在AKQ：有所有overpairs+两对+sets\n• Caller在AKQ：缺少AA/KK/QQ/AK\n\n🎯 实战应用：\n• 有nut advantage：可以超池下注\n• 无nut advantage：不能bluff太大\n• River考虑：对手有nuts概率\n\n💡 关键：Nut advantage允许你下更大的注"
            }
        ]
    },
    {
        category: "进阶概念",
        concepts: [
            {
                q: "什么是Range Condensation（范围压缩）？",
                a: "🧠 Range Condensation：\n• 范围变得「扁平」，都是中等强度牌\n• 缺少nuts和空气\n\n📊 何时发生：\n• Caller range经常condensed\n• Cold caller range极度condensed\n• 多次call后range变condensed\n\n🎯 对抗策略：\n• 对condensed range下merge bet\n• 不要对condensed range极化\n• 用中等牌下中等注\n\n💡 关键：Condensed range害怕大注"
            },
            {
                q: "什么是Equity Realization（实现率）？",
                a: "🧠 Equity Realization：\n• 你的理论equity能实现多少\n• IP实现率高（80-100%）\n• OOP实现率低（60-80%）\n\n📊 影响因素：\n• Position：IP > OOP\n• 牌力类型：Set > Draw\n• 对手类型：vs被动 > vs激进\n\n🎯 实战应用：\n• OOP需要更高equity才能call\n• Speculative hands更适合IP\n• OOP要打得更直接\n\n💡 关键：不要高估OOP的牌"
            },
            {
                q: "什么是Board Coverage（牌面覆盖）？",
                a: "🧠 Board Coverage：\n• 你的range在多少种牌面都有强牌\n• Coverage越好，越难对付\n\n📊 好的Coverage：\n• PFR range：在大部分board都有强牌\n• 平衡的3-bet range：high+low都有\n\n📊 差的Coverage：\n• 只玩high cards：在low board很弱\n• 只玩suited：在rainbow board优势小\n\n💡 关键：好的starting range决定好的coverage"
            },
            {
                q: "什么是Delayed C-bet（延迟持续下注）？",
                a: "🧠 Delayed C-bet：\n• Flop check → Turn bet\n• 通常表示：\n  - Flop没击中但turn击中\n  - Flop slowplay，turn加速\n  - Flop放弃bluff，turn改变主意\n\n🎯 何时使用：\n• Flop多人底池，不适合c-bet\n• 想在turn更便宜地bluff\n• Flop board texture不适合\n\n⚠️ 风险：\n• 给对手免费看牌\n• Turn card可能帮助对手\n\n💡 关键：不是所有牌都要flop c-bet"
            },
            {
                q: "什么是Donk Bet（驴注）？",
                a: "🧠 Donk Bet定义：\n• OOP玩家主动下注（原本应该check to PFR）\n• 名字来源于「donkey play」\n\n📊 何时合理：\n• Flop击中你但不击中PFR range\n• 保护弱牌（防止被免费看牌）\n• 混合策略，防止被读透\n\n📊 何时错误：\n• 随意donk（大部分新手情况）\n• Board有range advantage\n• 没有清晰plan\n\n💡 关键：现代理论有条件地使用donk bet"
            }
        ]
    }
];

// 导出给主文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PHASES_BASIC,
        PHASES_PRO,
        TRAPS,
        GTO_CONCEPTS
    };
}

