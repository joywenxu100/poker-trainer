// 德州扑克训练师 V2.0 - 完整版（基础+职业级）
// 保留原有26个基础问题 + 新增42个职业级问题 + 30个陷阱 + 20个GTO概念

// ==================== 基础7阶段26问（保持不变） ====================
const PHASES_BASIC = [
    {
        id: 1,
        title: "信息收集",
        time: "3-5秒",
        warning: false,
        level: "基础",
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
        level: "基础",
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
        level: "基础",
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
        level: "基础",
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
        level: "基础",
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
        level: "基础",
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
        level: "基础",
        questions: [
            { q: "这个决策符合我的整体策略吗？", a: "不要偏离既定策略，保持一致性" },
            { q: "这个决策长期来看是+EV的吗？", a: "短期输赢不重要，长期盈利才是目标" },
            { q: "我有没有漏掉关键信息？", a: "最后检查一遍，确保没有遗漏" }
        ]
    }
];

// ==================== 职业级7阶段42问（新增） ====================
const PHASES_PRO = [
    {
        id: 1,
        title: "信息收集·PRO",
        time: "5-8秒",
        warning: false,
        level: "职业级",
        questions: [
            { q: "这桌玩家的整体动态如何？", a: "🎯 桌面动态：鱼玩家数量？短筹码威胁？桌子松紧？位置优势？\n💡 鱼越多→打价值；reg越多→打平衡" },
            { q: "我在这手牌的历史形象是什么？", a: "🎯 形象管理：最近频繁弃牌（紧）？频繁下注（松）？刚展示诈唬/强牌？\n💡 利用对手的错误认知" },
            { q: "SPR对我的策略影响？", a: "🎯 SPR分析：<3全进；3-13中等牌可玩；>13需坚果\n💡 SPR决定承诺度" },
            { q: "对手筹码量对策略影响？", a: "🎯 对手筹码：短筹<40BB更宽call；深筹>100BB需更强牌\n💡 筹码深度决定玩法" },
            { q: "单挑底池还是多人底池？", a: "🎯 底池类型：单挑可激进；3人要小心；4+人只玩坚果\n💡 多人底池诈唬=送钱" },
            { q: "我的位置优势有多大？", a: "🎯 位置量化：IP vs OOP差异巨大；BTN vs BB双重优势\n💡 IP更激进，OOP更谨慎" }
        ]
    },
    {
        id: 2,
        title: "牌力评估·PRO",
        time: "3-5秒",
        warning: false,
        level: "职业级",
        questions: [
            { q: "我的牌有多少blocker效应？", a: "🎯 Blocker：持有A阻断AA/AK；持有K阻断KK/AK；同花阻断对手同花\n💡 Blocker让诈唬更有效" },
            { q: "我的范围优势如何？", a: "🎯 Range Advantage：低牌面(235)加注者优势；高牌面(AKQ)极大优势\n💡 范围优势时下大注" },
            { q: "是否有nut advantage？", a: "🎯 Nut Advantage：对手range缺坚果？我有更多坚果组合？\n💡 Nut advantage允许超池" },
            { q: "我的牌是capped还是uncapped？", a: "🎯 Range Cap：Capped=对手知道你最强牌；Uncapped=可能有任何强牌\n💡 Capped时不要大额诈唬" },
            { q: "Range是merge还是polarize？", a: "🎯 Range构成：Polarized(坚果+空气)；Merged(中等+强牌)；Linear(从强到弱)\n💡 不同构成对应不同sizing" },
            { q: "这张牌改变range优势了吗？", a: "🎯 动态评估：转牌/河牌改变优势？新听牌出现？对手range变强/弱？\n💡 每条街重新评估" }
        ]
    },
    {
        id: 3,
        title: "对手范围·PRO",
        time: "5-8秒",
        warning: false,
        level: "职业级",
        questions: [
            { q: "对手的3-bet范围？", a: "🎯 3-bet范围：紧手QQ+/AK(5-7%)；标准reg(8-12%)；激进(15-20%)\n💡 根据对手类型调整" },
            { q: "对手会慢打什么？", a: "🎯 Slowplay：湿牌面很少慢打；干牌面AA/KK/set可能；鱼爱慢打reg很少\n💡 不要高估慢打频率" },
            { q: "Bet sizing透露了什么？", a: "🎯 Sizing tell：小注(1/3)=弱/诈唬；标准注(1/2-2/3)=平衡；大注/超池=极化\n💡 Sizing patterns很重要" },
            { q: "对手有timing tell吗？", a: "🎯 时间tell：快速下注=强或纯诈唬；长考下注=边缘牌；快call=听牌\n💡 线上这个tell更准" },
            { q: "Range有明显漏洞吗？", a: "🎯 Range漏洞：只value不bluff→可fold；过度诈唬→call wider；从不fold中对→别诈唬\n💡 识别漏洞并剥削" },
            { q: "对手会用强牌加注吗？", a: "🎯 Raise频率：激进玩家会；被动玩家只用坚果加注\n💡 被动玩家的加注极度尊重" }
        ]
    },
    {
        id: 4,
        title: "赔率计算·PRO",
        time: "3-5秒",
        warning: false,
        level: "职业级",
        questions: [
            { q: "Fold equity是多少？", a: "🎯 FE计算：对手fold% × 底池 = fold equity\n💡 没有fold equity不要诈唬" },
            { q: "Equity实现率？", a: "🎯 实现率：IP实现率80-100%；OOP实现率60-80%\n💡 OOP需要更高equity才call" },
            { q: "反向隐含赔率？", a: "🎯 Reverse Implied：击中后仍输更多钱的风险；追小同花对手可能有大同花\n💡 新手常忽视反向赔率" },
            { q: "多街价值最大化？", a: "🎯 Multi-street：逐步build pot(翻牌小→转牌中→河牌大)\n💡 价值最大化≠单次最大注" },
            { q: "MDF是多少？", a: "🎯 MDF公式：底池/(底池+对手下注)；例如底池100对手下75，MDF=57%\n💡 defend足够频率防止被剥削" },
            { q: "精确EV计算？", a: "🎯 EV公式：(赢概率×赢金额)-(输概率×输金额)\n💡 边缘决策必须精确计算" }
        ]
    },
    {
        id: 5,
        title: "情绪自检·PRO",
        time: "2-3秒",
        warning: true,
        level: "职业级",
        questions: [
            { q: "是否处于A-game状态？", a: "⚠️ A-game检查：注意力100%？无干扰？身体良好？情绪稳定？\n💡 不是A-game就离桌" },
            { q: "是否在玩复仇扑克？", a: "⚠️ 复仇心理：针对某玩家？想证明什么？因被bluff生气？\n💡 复仇心理=灾难" },
            { q: "风险承受力是否正常？", a: "⚠️ 风险承受：不敢下注（过谨慎）？瞎下注（过激进）？all-in太随意？\n💡 正常=按概率决策" },
            { q: "是否在「证明自己」？", a: "⚠️ 自证陷阱：想展示自己？不想被认为弱？为面子而call？\n💡 职业只在乎+EV不在乎面子" },
            { q: "止损线是否还在？", a: "⚠️ 止损纪律：今天输了多少buy-in？超过预设？在想「回本」？\n💡 超过止损立即离桌" },
            { q: "是否在自动驾驶？", a: "⚠️ 自动驾驶：不经思考就行动？多任务？无聊疲劳？\n💡 自动驾驶=送钱，必须休息" }
        ]
    },
    {
        id: 6,
        title: "行动决策·PRO",
        time: "3-5秒",
        warning: false,
        level: "职业级",
        questions: [
            { q: "Betting line讲连贯的故事吗？", a: "🎯 故事一致性：每个action都要符合你想表达的range\n💡 故事不合理会被识破" },
            { q: "Sizing是否平衡？", a: "🎯 Sizing平衡：相同sizing既有value又有bluff；Value:Bluff=2:1或3:1\n💡 单一sizing会被剥削" },
            { q: "诈唬频率是否正确？", a: "🎯 Bluff频率：Pot bet需50%成功率；1/2 pot需33%；1/3 pot需25%\n💡 根据fold equity调整" },
            { q: "Check背后含义？", a: "🎯 Check策略：Check-call(中等牌)；Check-raise(陷阱/半诈唬)；Check-fold(放弃)\n💡 Check不是弱，是策略" },
            { q: "Range是否overfolding？", a: "🎯 Overfold检查：对手下注你fold>50%=被剥削；计算MDF确保defend够\n💡 被动=慢性死亡" },
            { q: "Thin value还是bluff？", a: "🎯 边界判断：Thin value=对手会用更差的call；Bluff=对手会fold更好的\n💡 对calling station少bluff多value" }
        ]
    },
    {
        id: 7,
        title: "二次确认·PRO",
        time: "2-3秒",
        warning: false,
        level: "职业级",
        questions: [
            { q: "在replayer中能defend吗？", a: "🎯 事后检验：逻辑清晰？基于正确假设？考虑所有因素？\n💡 能defend的决策才是好决策" },
            { q: "Level战中想多了吗？", a: "🎯 Level陷阱：Level 0(他有啥)；Level 1(我有啥)；Level 2(他认为我有啥)\n💡 对鱼停在Level 1" },
            { q: "后续可控吗？", a: "🎯 后续可控性：Call后转牌怎么办？Raise被3-bet？Check被下注？\n💡 不要做没有后续计划的action" },
            { q: "Table select正确吗？", a: "🎯 桌子选择：好桌=鱼多深筹码被动；差桌=全reg短筹码激进\n💡 选对桌子比打得好更重要" },
            { q: "Bankroll management健康吗？", a: "🎯 资金管理：Cash至少50个buy-in；MTT至少100个；现在级别适合你吗？\n💡 BRM是职业生涯生命线" },
            { q: "Session是否该结束？", a: "🎯 结束信号：达盈利目标？达止损？注意力下降？情绪波动？桌质量下降？\n💡 知道何时离桌最重要" }
        ]
    }
];

// ==================== 实战陷阱30个（新增） ====================
const TRAPS = [
    {
        category: "翻前陷阱",
        warning: true,
        questions: [
            { q: "陷阱：EP用同花连牌3-bet", a: "⚠️ 为什么错：EP 3-bet需能4-bet all-in的牌；Suited connector实现率低\n✅ 正确：EP 3-bet只用QQ+/AK" },
            { q: "陷阱：BB对SB limp过度防守", a: "⚠️ 为什么错：SB limp通常是中等牌不是垃圾；Position在flop后很重要\n✅ 正确：BB raise强牌，check-raise翻牌圈" },
            { q: "陷阱：多人底池用小对子call大3-bet", a: "⚠️ 为什么错：多人底池set value下降；3-bet pot太大miss失血过多\n✅ 正确：小对子对3-bet通常fold，除非深筹码单挑" },
            { q: "陷阱：CO/BTN对MP过度3-bet", a: "⚠️ 为什么错：MP开池range很强；3-bet太频会被4-bet；Position优势已够\n✅ 正确：用position flat call，flop后剥削" },
            { q: "陷阱：短筹码用投机牌", a: "⚠️ 为什么错：短筹码没implied odds；Suited connector/小对子价值为0\n✅ 正确：短筹码只玩premium hands和push/fold" }
        ]
    },
    {
        category: "翻牌圈陷阱",
        warning: true,
        questions: [
            { q: "陷阱：湿牌面用顶对慢打", a: "⚠️ 为什么错：太多听牌可能超越；给对手免费看牌=送钱；转牌scare card价值骤降\n✅ 正确：湿牌面快打，保护equity" },
            { q: "陷阱：多人底池c-bet空气", a: "⚠️ 为什么错：多人底池至少有人击中；Fold equity极低；烧钱式bluff\n✅ 正确：多人底池没击中就check-fold" },
            { q: "陷阱：用卡顺听牌call大注", a: "⚠️ 为什么错：只有4张outs(约8% equity)；需要12:1的赔率；大部分赔率不够\n✅ 正确：Gutshot只在有implied odds或加上backdoor时call" },
            { q: "陷阱：过度尊重check-raise", a: "⚠️ 为什么错：现代玩家check-raise很频繁；包含大量semi-bluff和空气\n✅ 正确：根据board texture和对手类型，该call就call" },
            { q: "陷阱：A高牌面用第二对继续", a: "⚠️ 为什么错：A高board对手通常有A；第二对几乎没改进潜力；在给对手送钱\n✅ 正确：A高board没A就check-fold或小pot控制" }
        ]
    },
    {
        category: "转牌圈陷阱",
        warning: true,
        questions: [
            { q: "陷阱：scare card出现仍大c-bet", a: "⚠️ 为什么错：Scare card改变range优势；对手可能刚好击中；bluff range太明显\n✅ 正确：重新评估，考虑check或小额bet" },
            { q: "陷阱：用弱听牌面对大注仍追", a: "⚠️ 为什么错：转牌只剩一张牌机会；Equity急剧下降；赔率几乎不够\n✅ 正确：转牌听牌面对大注通常fold，除非nut draw+blockers" },
            { q: "陷阱：转牌完成后下小注", a: "⚠️ 为什么错：给对手完美赔率call；错失榨取价值机会；对手可能河牌改进\n✅ 正确：转牌完成后下标准注或大注" },
            { q: "陷阱：极化spot下融合sizing", a: "⚠️ 为什么错：转牌经常是polarized spot；要么强要么bluff；Merge sizing暴露range\n✅ 正确：Polarized时下大注(70-150% pot)" },
            { q: "陷阱：忽视line突然改变", a: "⚠️ 为什么错：Check-check后突然转牌下注=通常很强；Line改变是重要信息\n✅ 正确：注意对手betting pattern变化" }
        ]
    },
    {
        category: "河牌圈陷阱",
        warning: true,
        questions: [
            { q: "陷阱：用bluff catcher hero call", a: "⚠️ 为什么错：对手range通常比你想象强；Hero call长期-EV；是ego call\n✅ 正确：Bluff catcher对大注默认fold，除非对手showdown超高" },
            { q: "陷阱：河牌用中等牌下注", a: "⚠️ 为什么错：更差的fold更好的call/raise；Way-ahead or way-behind情况\n✅ 正确：河牌中等牌通常check，走到showdown" },
            { q: "陷阱：obvious draw完成后bluff", a: "⚠️ 为什么错：对手知道draw完成了；bluff太明显；Fold equity极低\n✅ 正确：Obvious draw完成时要么有要么check" },
            { q: "陷阱：无blocker超池bluff", a: "⚠️ 为什么错：超池bluff需极高fold equity；没blockers对手call range太宽；风险收益比极差\n✅ 正确：超池bluff只在有关键blockers时做" },
            { q: "陷阱：对calling station薄价值", a: "⚠️ 为什么错：Calling station用任何对子call；thin value变送钱；对手类型决定策略\n✅ 正确：对calling station只bet nuts或near-nuts" },
            { q: "陷阱：因底池大就不得不call", a: "⚠️ 为什么错：Pot odds不是唯一因素；对手range分析更重要；Sunk cost fallacy\n✅ 正确：每个决策独立评估，不考虑之前投入" }
        ]
    },
    {
        category: "心理陷阱",
        warning: true,
        questions: [
            { q: "陷阱：想要赢回刚输的钱", a: "⚠️ 为什么错：每手牌独立；赢回心态=tilt开始；会做非理性决策\n✅ 正确：忘记上一手，只关注当前EV" },
            { q: "陷阱：用感觉而非数学决策", a: "⚠️ 为什么错：感觉不可靠；人类极差于估计概率；长期必输\n✅ 正确：每个决策基于equity和EV计算" },
            { q: "陷阱：结果导向而非过程导向", a: "⚠️ 为什么错：好决策可能输钱(variance)；坏决策可能赢钱(luck)；会学错东西\n✅ 正确：只评估决策质量，不评估结果" }
        ]
    }
];

// ==================== GTO概念20个（新增） ====================
const GTO_CONCEPTS = [
    {
        category: "GTO核心",
        level: "理论",
        questions: [
            { q: "什么是GTO？", a: "🧠 GTO定义：无法被剥削的策略；不是最盈利的（剥削才是）；防守型策略\n📊 GTO vs 剥削：GTO对未知对手；剥削对已知漏洞；顶级玩家80% GTO + 20% 剥削\n💡 先学GTO作baseline，再学剥削" },
            { q: "什么是MDF？", a: "🧠 MDF公式：底池/(底池+对手下注)\n📊 例子：底池100对手下50，MDF=100/(100+50)=67%\n📊 应用：对手下1/2 pot要defend 67%；下pot要defend 50%\n💡 GTO要求defend足够频率" },
            { q: "什么是Polarization？", a: "🧠 极化定义：Range只有极强牌和空气，没中等牌\n📊 何时极化：河牌大额下注(>70% pot)；3-bet/4-bet all-in；Check-raise河牌\n📊 vs Merged：Polarized(强+空气大注)；Merged(强+中+bluff中注)；Linear(强到弱小注)\n💡 Sizing决定range构成" },
            { q: "什么是Blocker？", a: "🧠 Blocker效应：你持有的牌对手不可能有\n📊 关键Blockers：A blocker阻断AA/AK/Ax；K blocker阻断KK/AK/Kx；同花blocker；顺子关键牌\n📊 应用：河牌bluff用blocker选择；Hero call时对手有A→bluff概率降低\n💡 Blocker让GTO更精细" },
            { q: "什么是Range Advantage？", a: "🧠 Range Advantage：一方range在该board上更强\n📊 典型例子：A高board PFR有优势；低牌面(235) PFR有优势；中连牌面(987) Caller有优势\n📊 应用：有range advantage可高频c-bet；无优势要check更多；动态变化每条街重评估\n💡 Range advantage比手牌强度更重要" },
            { q: "什么是Nut Advantage？", a: "🧠 Nut Advantage：一方range包含更多坚果组合\n📊 例子：PFR在AKQ有所有overpairs+两对+sets；Caller缺少AA/KK/QQ/AK\n📊 应用：有nut advantage可超池下注；无nut advantage不能bluff太大\n💡 Nut advantage允许下更大的注" }
        ]
    },
    {
        category: "GTO进阶",
        level: "理论",
        questions: [
            { q: "什么是Range Condensation？", a: "🧠 范围压缩：Range变扁平，都是中等强度牌，缺少nuts和空气\n📊 何时发生：Caller range经常condensed；Cold caller极度condensed；多次call后condensed\n📊 对抗策略：对condensed range下merge bet；不要极化；用中等牌下中等注\n💡 Condensed range害怕大注" },
            { q: "什么是Equity Realization？", a: "🧠 实现率：理论equity能实现多少\n📊 影响因素：Position(IP>OOP)；牌力类型(Set>Draw)；对手类型(vs被动>vs激进)\n📊 数值：IP实现率80-100%；OOP实现率60-80%\n📊 应用：OOP需更高equity才call；Speculative hands更适合IP；OOP打得更直接\n💡 不要高估OOP的牌" },
            { q: "什么是Board Coverage？", a: "🧠 Board Coverage：Range在多少种牌面都有强牌\n📊 好Coverage：PFR range在大部分board都有强牌；平衡3-bet range high+low都有\n📊 差Coverage：只玩high cards在low board很弱；只玩suited在rainbow board优势小\n💡 好的starting range决定好coverage" },
            { q: "什么是Delayed C-bet？", a: "🧠 延迟持续下注：Flop check → Turn bet\n📊 表示：Flop没击中但turn击中；Flop slowplay turn加速；Flop放弃bluff turn改主意\n📊 何时使用：Flop多人底池不适合c-bet；想在turn更便宜bluff；Flop board texture不适合\n⚠️ 风险：给对手免费看牌；Turn card可能帮对手\n💡 不是所有牌都要flop c-bet" },
            { q: "什么是Donk Bet？", a: "🧠 Donk Bet：OOP玩家主动下注（原本应check to PFR）\n📊 何时合理：Flop击中你但不击中PFR range；保护弱牌；混合策略防被读透\n📊 何时错误：随意donk（大部分新手）；Board有range advantage；没有清晰plan\n💡 现代理论有条件地使用donk bet" }
        ]
    },
    {
        category: "GTO实战",
        level: "理论",
        questions: [
            { q: "Pot Odds vs Implied Odds？", a: "🧠 Pot Odds：立即赔率，需投入/最终底池\n🧠 Implied Odds：隐含赔率，考虑未来可赢取的额外筹码\n📊 公式：Pot Odds = Call/(Pot+Call)；Implied考虑后续街道可榨取价值\n💡 听牌更依赖implied odds" },
            { q: "如何计算Break-even点？", a: "🧠 盈亏平衡公式：Risk / (Risk + Reward)\n📊 例子：投入100赢200，需要33%成功率；投入50赢150，需要25%成功率\n📊 应用：Bluff sizing决定需要多高fold %；Call决策需要多少equity\n💡 边缘决策必须精确计算" },
            { q: "什么是SPR策略？", a: "🧠 SPR公式：有效筹码/底池大小\n📊 SPR<3：顶对以上all-in，听牌fold\n📊 SPR 3-13：中等牌可玩但要控制\n📊 SPR>13：需坚果或强听牌才全投\n💡 SPR决定你的承诺度" },
            { q: "Value:Bluff比例？", a: "🧠 平衡比例：通常Value:Bluff = 2:1 或 3:1\n📊 原因：给对手正确pot odds call，但足够bluff让他们不能总fold\n📊 例子：河牌pot bet时，2个value combo配1个bluff combo\n💡 比例根据sizing调整" },
            { q: "如何对抗Over-bet？", a: "🧠 Over-bet定义：超过底池大小的下注\n📊 对抗策略：计算MDF；Over-bet你的MDF更小，可以fold更多；对手需极度极化\n📊 什么时候call：有nuts或nut-blocker；对手over-bet频率太高\n💡 Over-bet通常是极化范围" }
        ]
    }
];

// ==================== 成就系统 ====================
const ACHIEVEMENTS = [
    { id: 'first', title: '初次尝试', desc: '完成第1次训练', icon: '🎯', requirement: 1 },
    { id: 'beginner', title: '入门', desc: '完成10次训练', icon: '📚', requirement: 10 },
    { id: 'intermediate', title: '进阶', desc: '完成50次训练', icon: '🎓', requirement: 50 },
    { id: 'advanced', title: '熟练', desc: '完成100次训练', icon: '⭐', requirement: 100 },
    { id: 'expert', title: '专家', desc: '完成500次训练', icon: '💎', requirement: 500 },
    { id: 'master', title: '大师', desc: '完成1000次训练', icon: '🏆', requirement: 1000 },
    { id: 'professional', title: '职业级', desc: '完成2000次训练', icon: '👑', requirement: 2000 },
    { id: 'streak7', title: '连续7天', desc: '连续7天训练', icon: '🔥', requirement: 7, type: 'streak' },
    { id: 'streak30', title: '连续30天', desc: '连续30天训练', icon: '💪', requirement: 30, type: 'streak' }
];

// ==================== 全局状态 ====================
let trainingData = {
    totalCount: 0,
    todayCount: 0,
    lastTrainingDate: null,
    consecutiveDays: 0,
    phaseScores: [0, 0, 0, 0, 0, 0, 0], // 7个阶段熟练度
    totalTime: 0,
    achievements: [],
    // V2.0 新增
    basicCount: 0,    // 基础训练次数
    proCount: 0,      // 职业级训练次数
    trapsCount: 0,    // 陷阱训练次数
    gtoCount: 0       // GTO训练次数
};

let currentTraining = {
    mode: 'complete',
    trainingType: 'basic', // 'basic', 'pro', 'complete', 'traps', 'gto'
    currentPhase: 0,
    currentQuestion: 0,
    startTime: 0,
    timerInterval: null,
    questions: [],
    flipped: false,
    correctCount: 0,
    wrongCount: 0
};

// ==================== 初始化 ====================
function init() {
    loadData();
    updateHomePage();
    updateStatsPage();
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as PWA');
    }
}

// ==================== 数据持久化 ====================
function saveData() {
    localStorage.setItem('pokerTrainerData', JSON.stringify(trainingData));
}

function loadData() {
    const saved = localStorage.getItem('pokerTrainerData');
    if (saved) {
        trainingData = JSON.parse(saved);
        
        // V2.0兼容性：如果没有新字段，添加默认值
        if (!trainingData.basicCount) trainingData.basicCount = trainingData.totalCount || 0;
        if (!trainingData.proCount) trainingData.proCount = 0;
        if (!trainingData.trapsCount) trainingData.trapsCount = 0;
        if (!trainingData.gtoCount) trainingData.gtoCount = 0;
        
        const today = new Date().toDateString();
        if (trainingData.lastTrainingDate !== today) {
            if (trainingData.lastTrainingDate) {
                const lastDate = new Date(trainingData.lastTrainingDate);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    trainingData.consecutiveDays++;
                } else if (diffDays > 1) {
                    trainingData.consecutiveDays = 0;
                }
            } else {
                trainingData.consecutiveDays = 1;
            }
            
            trainingData.todayCount = 0;
        }
    }
}

// ==================== 页面切换 ====================
function switchPage(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName + 'Page').classList.add('active');
    
    if (pageName === 'home') {
        updateHomePage();
    } else if (pageName === 'stats') {
        updateStatsPage();
    } else if (pageName === 'settings') {
        updateSettingsPage();
    }
}

// ==================== 更新首页 ====================
function updateHomePage() {
    document.getElementById('totalTrainingCount').textContent = trainingData.totalCount;
    document.getElementById('todayTrainingCount').textContent = trainingData.todayCount;
    document.getElementById('consecutiveDays').textContent = trainingData.consecutiveDays;
    
    const mastery = Math.min(100, Math.floor((trainingData.totalCount / 2000) * 100)); // V2.0目标2000次
    document.getElementById('masteryLevel').textContent = mastery + '%';
    
    document.getElementById('progressPercent').textContent = mastery + '%';
    document.getElementById('progressBarFill').style.width = mastery + '%';
    document.getElementById('progressText').textContent = 
        `已完成 ${trainingData.totalCount} / 2000 次训练（基础${trainingData.basicCount} + 职业${trainingData.proCount}）`;
}

// ==================== 开始训练（V2.0升级） ====================
function startTraining(mode, trainingType = 'basic') {
    currentTraining.mode = mode;
    currentTraining.trainingType = trainingType;
    currentTraining.currentPhase = 0;
    currentTraining.currentQuestion = 0;
    currentTraining.startTime = Date.now();
    currentTraining.flipped = false;
    currentTraining.correctCount = 0;
    currentTraining.wrongCount = 0;
    
    // 准备问题列表
    currentTraining.questions = [];
    
    let sourcePhases = [];
    if (trainingType === 'basic') {
        sourcePhases = PHASES_BASIC;
    } else if (trainingType === 'pro') {
        sourcePhases = PHASES_PRO;
    } else if (trainingType === 'complete') {
        sourcePhases = [...PHASES_BASIC, ...PHASES_PRO];
    } else if (trainingType === 'all') {
        // 随机测试：包含所有问题（基础+职业+陷阱+GTO）
        sourcePhases = [...PHASES_BASIC, ...PHASES_PRO];
        // 添加陷阱问题
        TRAPS.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: true, level: "陷阱" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
        // 添加GTO概念
        GTO_CONCEPTS.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: false, level: "GTO" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (trainingType === 'traps') {
        // 陷阱训练
        TRAPS.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: true, level: "陷阱" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (trainingType === 'gto') {
        // GTO训练
        GTO_CONCEPTS.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: false, level: "GTO" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    }
    
    // 如果不是陷阱、GTO或all训练，从phase中提取问题
    if (trainingType !== 'traps' && trainingType !== 'gto' && trainingType !== 'all') {
        sourcePhases.forEach(phase => {
            phase.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: phase,
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (trainingType === 'all') {
        // all类型已经在上面处理了陷阱和GTO，这里只需要添加基础和职业问题
        sourcePhases.forEach(phase => {
            phase.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: phase,
                    question: q.q,
                    answer: q.a
                });
            });
        });
    }
    
    // 随机测试模式
    if (mode === 'test') {
        currentTraining.questions.sort(() => Math.random() - 0.5);
        currentTraining.questions = currentTraining.questions.slice(0, 10);
    }
    
    // 切换到训练页面
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('trainPage').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[1].classList.add('active');
    
    startTimer();
    showQuestion();
}

// ==================== 显示问题 ====================
function showQuestion() {
    if (currentTraining.currentQuestion >= currentTraining.questions.length) {
        finishTraining();
        return;
    }
    
    const current = currentTraining.questions[currentTraining.currentQuestion];
    const card = document.getElementById('trainingCard');
    
    card.classList.remove('flipped');
    currentTraining.flipped = false;
    
    const badge = document.getElementById('phaseBadge');
    const levelLabel = current.phase.level || "基础";
    badge.textContent = `${levelLabel} - ${current.phase.title}`;
    badge.className = current.phase.warning ? 'phase-badge warning' : 'phase-badge';
    
    document.getElementById('trainingProgress').textContent = 
        `问题 ${currentTraining.currentQuestion + 1} / ${currentTraining.questions.length}`;
    
    document.getElementById('cardQuestion').textContent = current.question;
    document.getElementById('cardAnswer').textContent = current.answer;
    document.getElementById('cardHint').textContent = '轻触卡片查看答案';
    
    document.getElementById('btnKnow').style.display = 'none';
    document.getElementById('btnForget').style.display = 'none';
}

// ==================== 翻转卡片 ====================
function flipCard() {
    if (currentTraining.flipped) return;
    
    const card = document.getElementById('trainingCard');
    card.classList.add('flipped');
    currentTraining.flipped = true;
    
    document.getElementById('btnKnow').style.display = 'block';
    document.getElementById('btnForget').style.display = 'block';
}

// ==================== 回答 ====================
function answerKnow() {
    if (!currentTraining.flipped) return;
    
    currentTraining.correctCount++;
    
    const phaseId = currentTraining.questions[currentTraining.currentQuestion].phase.id;
    if (phaseId > 0 && phaseId <= 7) {
        trainingData.phaseScores[phaseId - 1] = Math.min(100, trainingData.phaseScores[phaseId - 1] + 2);
    }
    
    nextQuestion();
}

function answerForget() {
    if (!currentTraining.flipped) return;
    
    currentTraining.wrongCount++;
    
    const phaseId = currentTraining.questions[currentTraining.currentQuestion].phase.id;
    if (phaseId > 0 && phaseId <= 7) {
        trainingData.phaseScores[phaseId - 1] = Math.max(0, trainingData.phaseScores[phaseId - 1] - 1);
    }
    
    nextQuestion();
}

function nextQuestion() {
    currentTraining.currentQuestion++;
    showQuestion();
}

// ==================== 完成训练 ====================
function finishTraining() {
    stopTimer();
    
    trainingData.totalCount++;
    trainingData.todayCount++;
    trainingData.lastTrainingDate = new Date().toDateString();
    
    // 统计不同类型训练次数
    if (currentTraining.trainingType === 'basic') {
        trainingData.basicCount++;
    } else if (currentTraining.trainingType === 'pro') {
        trainingData.proCount++;
    } else if (currentTraining.trainingType === 'complete') {
        trainingData.basicCount++;
        trainingData.proCount++;
    } else if (currentTraining.trainingType === 'traps') {
        trainingData.trapsCount++;
    } else if (currentTraining.trainingType === 'gto') {
        trainingData.gtoCount++;
    }
    
    const elapsed = Math.floor((Date.now() - currentTraining.startTime) / 1000);
    trainingData.totalTime += elapsed;
    
    checkAchievements();
    saveData();
    showCelebration();
}

// ==================== 显示庆祝 ====================
function showCelebration() {
    const count = trainingData.totalCount;
    let title = '太棒了！';
    let text = `完成第${count}次训练`;
    
    if (count === 1) {
        title = '🎉 开启训练之旅！';
        text = '第一次总是特别的，坚持下去！';
    } else if (count === 10) {
        title = '🎊 入门成功！';
        text = '完成10次训练，你已经入门了！';
    } else if (count === 50) {
        title = '🌟 进步显著！';
        text = '完成50次训练，感觉到进步了吗？';
    } else if (count === 100) {
        title = '💎 百次里程碑！';
        text = '100次训练！决策流程开始内化了！';
    } else if (count === 500) {
        title = '🏅 半程达成！';
        text = '500次训练！肌肉记忆正在形成！';
    } else if (count === 1000) {
        title = '🏆 基础大师！';
        text = '1000次训练！基础已完全掌握！';
    } else if (count === 2000) {
        title = '👑 职业级达成！';
        text = '2000次训练！你已经是职业玩家了！';
    }
    
    const accuracy = Math.round((currentTraining.correctCount / currentTraining.questions.length) * 100);
    text += `\n准确率：${accuracy}%`;
    
    // 显示训练类型
    const typeLabel = {
        'basic': '基础训练',
        'pro': '职业级训练',
        'complete': '完整训练',
        'traps': '陷阱识别',
        'gto': 'GTO概念'
    }[currentTraining.trainingType];
    text += `\n训练类型：${typeLabel}`;
    
    document.getElementById('celebrationTitle').textContent = title;
    document.getElementById('celebrationText').textContent = text;
    document.getElementById('celebration').classList.add('show');
}

function closeCelebration() {
    document.getElementById('celebration').classList.remove('show');
    switchPage('home');
}

// ==================== 检查成就 ====================
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (trainingData.achievements.includes(achievement.id)) return;
        
        if (achievement.type === 'streak') {
            if (trainingData.consecutiveDays >= achievement.requirement) {
                trainingData.achievements.push(achievement.id);
            }
        } else {
            if (trainingData.totalCount >= achievement.requirement) {
                trainingData.achievements.push(achievement.id);
            }
        }
    });
}

// ==================== 更新统计页面 ====================
function updateStatsPage() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    
    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = trainingData.achievements.includes(achievement.id);
        const div = document.createElement('div');
        div.className = 'achievement ' + (unlocked ? 'unlocked' : 'locked');
        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        achievementsList.appendChild(div);
    });
    
    const phaseList = document.getElementById('phaseList');
    phaseList.innerHTML = '';
    
    PHASES_BASIC.forEach((phase, index) => {
        const score = trainingData.phaseScores[index];
        const div = document.createElement('div');
        div.className = 'phase-item' + (phase.warning ? ' warning' : '');
        div.innerHTML = `
            <div class="phase-item-header">
                <div class="phase-item-title">阶段${phase.id}: ${phase.title}</div>
                <div class="phase-score">${score}%</div>
            </div>
            <div class="phase-progress-bar">
                <div class="phase-progress-fill" style="width: ${score}%"></div>
            </div>
        `;
        phaseList.appendChild(div);
    });
}

// ==================== 更新设置页面 ====================
function updateSettingsPage() {
    document.getElementById('settingsTotalCount').textContent = trainingData.totalCount;
    
    const minutes = Math.floor(trainingData.totalTime / 60);
    document.getElementById('totalTime').textContent = minutes + '分钟';
}

// ==================== 计时器 ====================
function startTimer() {
    currentTraining.startTime = Date.now();
    currentTraining.timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - currentTraining.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timerEl = document.getElementById('timer');
    timerEl.textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    
    if (elapsed > 30) {
        timerEl.classList.add('warning');
    } else {
        timerEl.classList.remove('warning');
    }
}

function stopTimer() {
    if (currentTraining.timerInterval) {
        clearInterval(currentTraining.timerInterval);
        currentTraining.timerInterval = null;
    }
}

// ==================== 退出训练 ====================
function exitTraining() {
    if (confirm('确定要退出训练吗？进度将不会保存。')) {
        stopTimer();
        switchPage('home');
    }
}

// ==================== 重置数据 ====================
function resetData() {
    if (confirm('⚠️ 警告：此操作将清除所有训练数据，无法恢复！\n\n确定要重置吗？')) {
        if (confirm('再次确认：真的要清除所有数据吗？')) {
            trainingData = {
                totalCount: 0,
                todayCount: 0,
                lastTrainingDate: null,
                consecutiveDays: 0,
                phaseScores: [0, 0, 0, 0, 0, 0, 0],
                totalTime: 0,
                achievements: [],
                basicCount: 0,
                proCount: 0,
                trapsCount: 0,
                gtoCount: 0
            };
            saveData();
            updateHomePage();
            updateStatsPage();
            updateSettingsPage();
            alert('数据已重置！');
        }
    }
}

// ==================== 页面加载 ====================
window.addEventListener('load', () => {
    init();
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => {
            console.log('Service Worker registered');
        }).catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});

window.addEventListener('beforeunload', (e) => {
    if (currentTraining.timerInterval) {
        e.preventDefault();
        e.returnValue = '';
    }
});


