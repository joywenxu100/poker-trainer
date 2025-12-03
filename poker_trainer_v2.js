// 德州扑克训练师 V2.4 - 完整版（基础+职业级+数据+深筹码+桌型选择+翻前策略）
// 保留原有26个基础问题 + 新增42个职业级问题 + 30个陷阱 + 20个GTO概念 + 92个必背数据 + 48个深筹码 + 54个8人桌 + 106个8人桌翻前策略

// ==================== 桌型选择 ====================
let currentTableType = localStorage.getItem('tableType') || '6max'; // '6max' 或 'ring'

function setTableType(type) {
    currentTableType = type;
    localStorage.setItem('tableType', type);
    updateHomePage();
    alert(`已切换至${type === '6max' ? '6人桌' : '8人桌'}模式！`);
}

function getTableType() {
    return currentTableType;
}

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
            { q: "底池赔率是多少？", a: "需要call的筹码 / (当前底池 + call的筹码)，例如call 100进入300的底池 = 100/(300+100) = 25%胜率即可盈利" },
            { q: "我需要多少胜率才能call？", a: "根据底池赔率计算盈亏平衡点：Call / (Pot + Call)" },
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
    
    // 更新桌型显示
    const tableTypeElement = document.getElementById('currentTableType');
    if (tableTypeElement) {
        tableTypeElement.textContent = currentTableType === '6max' ? '6人桌' : '8人桌';
        tableTypeElement.style.color = currentTableType === '6max' ? '#00d4ff' : '#ff9d50';
    }
    
    // 根据桌型切换训练模式卡片
    const deepStackCard = document.getElementById('deepStackCard');
    const fullRingCard = document.getElementById('fullRingCard');
    const preflopRingCard = document.getElementById('preflopRingCard');
    
    if (deepStackCard && fullRingCard && preflopRingCard) {
        if (currentTableType === '6max') {
            deepStackCard.style.display = 'block';
            fullRingCard.style.display = 'none';
            preflopRingCard.style.display = 'none';
        } else {
            deepStackCard.style.display = 'none';
            fullRingCard.style.display = 'block';
            preflopRingCard.style.display = 'block';
        }
    }
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
    } else if (trainingType === 'data') {
        // 必背数据训练
        DATA_MEMORY.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: false, level: "数据" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (trainingType === 'deep') {
        // 深筹码训练
        DEEP_STACK.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: false, level: "深筹码" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (trainingType === 'ring') {
        // 8人桌训练
        FULL_RING.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: false, level: "8人桌" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    } else if (trainingType === 'preflop') {
        // 8人桌翻前策略训练
        PREFLOP_RING.forEach(category => {
            category.questions.forEach(q => {
                currentTraining.questions.push({
                    phase: { id: 0, title: category.category, warning: false, level: "翻前策略" },
                    question: q.q,
                    answer: q.a
                });
            });
        });
    }

    // 如果不是陷阱、GTO、all、data、deep、ring或preflop训练，从phase中提取问题
    if (trainingType !== 'traps' && trainingType !== 'gto' && trainingType !== 'all' && trainingType !== 'data' && trainingType !== 'deep' && trainingType !== 'ring' && trainingType !== 'preflop') {
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

// ==================== 8人桌翻前策略训练模块 (Preflop Ranges) ====================
const PREFLOP_RING = [
    {
        category: "UTG位置策略（5-8%范围）",
        questions: [
            { q: "UTG Open范围核心牌？", a: "AA-99（所有对子99+）, AKo-AQo, AKs-AJs（强Ax同花）" },
            { q: "UTG是否应该打AQo？", a: "可打可不打，取决于对手。标准GTO：打。对抗紧手：不打" },
            { q: "UTG是否应该打88-77？", a: "88必打（set mining），77看桌况（深筹码可打）" },
            { q: "UTG是否应该打KQs？", a: "标准不打（易被支配），激进玩家可偶尔打" },
            { q: "UTG Open后，面对MP 3-bet应该如何？", a: "4-bet: AA-KK, AKs | Call: QQ-JJ, AKo | Fold: 其他所有" },
            { q: "UTG Open后，面对BTN 3-bet应该如何？", a: "4-bet: AA-QQ, AKs | Call: JJ-99, AKo, AQs | Fold: 其他" },
            { q: "UTG Open后，被3-bet，何时5-bet全压？", a: "仅AA-KK，且筹码<100BB时" },
            { q: "UTG Open尺寸？", a: "2.5-3BB（最大，保护极紧范围）" },
            { q: "UTG是否可以Limp？", a: "严格不建议（除非桌上3+Limper，可用22-66 Limp）" },
            { q: "UTG Open后，SB/BB都弃牌，CO Cold Call，应该如何？", a: "C-bet 70%+（CO范围弱，你极强）" },
            { q: "UTG用AA-KK是否应该Limp？", a: "绝不！必须Open，失去价值太多" },
            { q: "UTG Open后，被Squeeze（3-bet），应该如何？", a: "与正常3-bet相同处理（4-bet强牌，Call中等，Fold弱牌）" }
        ]
    },
    {
        category: "UTG+1位置策略（8-11%范围）",
        questions: [
            { q: "UTG+1 Open范围vs UTG增加了什么？", a: "增加88-77, AJs, KQs（轻微放宽）" },
            { q: "UTG+1是否应该打AJo？", a: "不建议（易被支配），AJs可打" },
            { q: "UTG+1 Open后，面对CO 3-bet应该如何？", a: "4-bet: AA-QQ, AKs | Call: JJ-99, AKo, AQs | Fold: 其他" },
            { q: "UTG+1 Open后，面对BTN 3-bet应该如何？", a: "4-bet: AA-KK, AKs | Call: QQ-99, AKo, AQs, AJs | Fold: 其他" },
            { q: "UTG Open后，UTG+1应该如何？", a: "3-bet: AA-KK, AKs（极紧） | Call: QQ-77, AKo, AQs（set mining）| Fold: 其他" },
            { q: "UTG+1 Open尺寸？", a: "2.5-3BB（与UTG相同）" },
            { q: "UTG+1是否可以打66-55？", a: "深筹码（150BB+）可打，浅筹码弃牌" },
            { q: "UTG+1 vs UTG Open，是否应该3-bet AKo？", a: "不建议（UTG范围极强，Call更好）" },
            { q: "UTG Limp后，UTG+1应该如何？", a: "Iso-raise: JJ+, AK（5-6BB） | Limp behind: 77-22, AJs（看免费牌）" }
        ]
    },
    {
        category: "MP位置策略（12-16%范围）",
        questions: [
            { q: "MP Open范围vs UTG+1增加了什么？", a: "增加66-22, ATs, KJs, QJs, JTs（小对子+同花连牌）" },
            { q: "MP是否应该打ATo？", a: "不建议（易被支配），边缘牌，弃牌更安全" },
            { q: "MP Open后，面对CO 3-bet应该如何？", a: "4-bet: AA-KK, AKs | Call: QQ-77, AKo, AQs-ATs | Fold: 其他" },
            { q: "MP Open后，面对BTN 3-bet应该如何？", a: "4-bet: AA-KK | Call: QQ-66, AK, AQs-AJs | Fold: 其他（BTN范围宽）" },
            { q: "EP Open后，MP应该如何？", a: "3-bet: AA-QQ, AKs（极少诈唬） | Call: JJ-66, AKo, AQs（set mining） | Fold: 其他" },
            { q: "MP 3-bet尺寸vs EP Open？", a: "3.5-4x原加注（保护范围，防止多人跟注）" },
            { q: "MP是否应该打KQo？", a: "不建议（易被AK/AQ支配），KQs可打" },
            { q: "MP Open后，被Squeeze，应该如何？", a: "4-bet: AA-KK | Call: QQ-TT, AK | Fold: 其他" },
            { q: "EP Limp后，MP应该如何？", a: "Iso-raise: TT+, AQ+（5-6BB）| Limp: 99-22, AJs-ATs" },
            { q: "MP用小对子22-66的策略？", a: "仅看翻牌追暗三（11.8%概率），未中立即弃牌" },
            { q: "MP是否可以打同花连牌（如T9s, 98s）？", a: "深筹码（200BB+）可打，浅筹码不建议" }
        ]
    },
    {
        category: "CO位置策略（18-24%范围）",
        questions: [
            { q: "CO Open范围vs MP增加了什么？", a: "增加A9s-A2s（所有Ax同花）, KTs, QTs, JTs, T9s, 98s, 87s（同花连牌）" },
            { q: "CO Open尺寸？", a: "2.2-2.5BB（可略小，偷盲开始）" },
            { q: "CO Open后，面对BTN 3-bet应该如何？", a: "4-bet: AA-JJ, AKs（价值+诈唬A5s-A2s偶尔） | Call: TT-77, AK, AQs-AJs | Fold: 其他" },
            { q: "CO Open后，面对SB/BB 3-bet应该如何？", a: "4-bet: AA-JJ, AK（盲注范围宽）| Call: TT-66, AQs-ATs | Fold: 弱牌" },
            { q: "EP/MP Open后，CO 3-bet范围？", a: "价值: AA-QQ, AKs | 诈唬: A5s-A2s（阻断AA）, KQs偶尔 | 8-12%总频率" },
            { q: "CO 3-bet尺寸vs EP/MP？", a: "3-3.5x原加注" },
            { q: "CO是否应该打Kxs（K9s-K2s）？", a: "不建议（易被更大K支配），KTs+可打" },
            { q: "CO vs BTN 3-bet，何时5-bet？", a: "仅AA-KK，且筹码<100BB" },
            { q: "CO是否可以打杂色Ax（A9o-A2o）？", a: "不建议（逆向隐含赔率高），同花Ax才打" },
            { q: "EP/MP Limp后，CO应该如何？", a: "Iso-raise: 99+, AJ+（4-5BB） | Limp: 小对子, 同花连牌" }
        ]
    },
    {
        category: "BTN位置策略（25-35%范围）",
        questions: [
            { q: "BTN Open范围vs CO增加了什么？", a: "增加所有对子, 所有Ax, Kxs, Qxs, 所有同花连牌（极宽）" },
            { q: "BTN Open尺寸？", a: "2-2.2BB（最小，偷盲最优）" },
            { q: "BTN Open后，面对SB 3-bet应该如何？", a: "4-bet: AA-TT, AK, AQs（价值+诈唬A5s-A2s, KQs）| Call: 99-77, AQo, AJs-ATs | Fold: 弱牌" },
            { q: "BTN Open后，面对BB 3-bet应该如何？", a: "4-bet: AA-TT, AK（BB范围更宽）| Call: 99-22, AQ, AJs-A9s | Fold: 最弱牌" },
            { q: "前位Open后，BTN 3-bet范围？", a: "价值: AA-JJ, AK | 诈唬: A5s-A2s, KQs, QJs, 小对子偶尔 | 12-18%总频率" },
            { q: "BTN 3-bet尺寸vs EP？", a: "2.5-3x（范围强，小尺寸即可）" },
            { q: "BTN 3-bet尺寸vs CO？", a: "3-3.5x（范围宽，需稍大保护）" },
            { q: "BTN是否应该打所有同花牌？", a: "可以（位置最佳），但最弱的（如72s, 83s）仍应弃牌" },
            { q: "BTN vs SB 3-bet，何时5-bet？", a: "价值: AA-QQ, AKs | 诈唬: A5s-A3s偶尔 | 筹码<100BB可全压" },
            { q: "BTN是否可以打杂色连牌（如QJo, JTo）？", a: "可以（QJo必打，JTo可打，T9o边缘）" },
            { q: "Fold to BTN（前面全弃牌），BTN应该打多少牌？", a: "40-50%（极宽偷盲，几乎所有有价值的牌）" },
            { q: "EP/MP Limp后，BTN应该如何？", a: "Iso-raise: 88+, AT+（3-4BB）| Limp: 所有小对子, 同花牌" }
        ]
    },
    {
        category: "SB位置策略（最难位置）",
        questions: [
            { q: "Fold to SB（前面全弃牌），SB Open范围？", a: "25-35%（与BTN相近，但尺寸更大）" },
            { q: "Fold to SB，SB Open尺寸？", a: "2.5-3BB（OOP需保护）" },
            { q: "前位Open后，SB应该如何？", a: "3-bet: 10-15%（AA-JJ, AK, AQs, 诈唬A5s-A2s, KQs）| Call: 很少 | Fold: 大部分" },
            { q: "SB 3-bet尺寸vs EP/MP？", a: "3.5-4x（OOP最差，需大尺寸保护）" },
            { q: "SB 3-bet尺寸vs CO/BTN？", a: "3-4x" },
            { q: "SB vs BTN Open，应该如何？", a: "3-bet: 12-18%（价值+诈唬）| Call: 8-12%（强听牌型）| Fold: 70%+" },
            { q: "SB Complete（补齐盲注）策略？", a: "20-30%范围（小对子, 同花Ax, 同花连牌）当前面全弃牌" },
            { q: "SB Complete后，BB Check，SB翻后策略？", a: "OOP极难，谨慎投入，优先控制底池" },
            { q: "SB vs BB 3-bet（SB Open后被BB 3-bet），应该如何？", a: "4-bet: AA-QQ, AKs | Call: JJ-99, AKo, AQs | Fold: 其他" },
            { q: "SB是否应该用弱牌Complete？", a: "不建议（OOP难打），弃牌或3-bet" },
            { q: "EP Limp后，SB应该如何？", a: "Iso-raise: TT+, AQ+（5-6BB）| Complete: 99-22, Axs" }
        ]
    },
    {
        category: "BB位置防守策略",
        questions: [
            { q: "BB vs UTG Open，防守范围？", a: "25-30%（QQ-22, AK-A9s, A9o+, KQs-KTs, QJs, JTs, T9s, 98s）" },
            { q: "BB vs UTG+1 Open，防守范围？", a: "30-35%（增加弱Ax, 更多同花连牌）" },
            { q: "BB vs MP Open，防守范围？", a: "35-40%（继续放宽）" },
            { q: "BB vs CO Open，防守范围？", a: "40-45%" },
            { q: "BB vs BTN Open，防守范围？", a: "45-55%（最宽，BTN范围极宽）" },
            { q: "BB vs SB Open，防守范围？", a: "50-60%（最宽，SB范围宽+底池赔率极好）" },
            { q: "BB vs UTG Open，3-bet范围？", a: "6-8%（AA-QQ, AKs, 诈唬A5s-A4s偶尔）" },
            { q: "BB vs MP Open，3-bet范围？", a: "8-12%（增加JJ, AKo, AQs, 诈唬KQs, A5s-A2s）" },
            { q: "BB vs BTN Open，3-bet范围？", a: "12-18%（价值+大量诈唬）" },
            { q: "BB vs SB Open，3-bet范围？", a: "15-20%（最宽，SB范围极宽）" },
            { q: "BB 3-bet尺寸？", a: "3-4x原加注（已投入1BB，相对便宜）" },
            { q: "BB防守需要多少胜率？", a: "vs 2.5BB Open = 28%（底池赔率好，必须广泛防守）" },
            { q: "BB是否应该用弱牌3-bet诈唬？", a: "vs LP（CO/BTN/SB）应该，vs EP不建议" }
        ]
    },
    {
        category: "Squeeze Play（挤压打法）",
        questions: [
            { q: "什么是Squeeze？", a: "面对1个Open + 1个或多个Call，用强牌或空气3-bet孤立" },
            { q: "Squeeze的理想条件？", a: "EP Open + MP Call（双方范围上限明确，容易弃牌）" },
            { q: "Squeeze范围？", a: "价值: AA-JJ, AK | 诈唬: A5s-A2s, KQs, QJs（阻断强牌）| 8-12%总频率" },
            { q: "Squeeze尺寸？", a: "4-5x原Open + 每个Caller额外+1BB" },
            { q: "Squeeze成功率需要多少？", a: "50-60%（比普通3-bet更容易成功）" },
            { q: "何时不应该Squeeze？", a: "对手是Calling Station（不会弃牌）或已有2+个Caller" },
            { q: "SB/BB Squeeze的优势？", a: "死钱多（盲注+多个Caller），成功率高" },
            { q: "Squeeze后被Call，翻后策略？", a: "C-bet 60-70%（对手范围上限低，你代表极强）" }
        ]
    },
    {
        category: "4-Bet策略",
        questions: [
            { q: "IP 4-bet尺寸？", a: "2.2-2.5x 3-bet（有位置，可小一些）" },
            { q: "OOP 4-bet尺寸？", a: "2.5-3x 3-bet（无位置，需保护）" },
            { q: "4-bet价值范围？", a: "AA-QQ, AKs（核心价值）" },
            { q: "4-bet诈唬范围？", a: "A5s-A3s（阻断AA/AK）, KQs偶尔（阻断KK/AK）" },
            { q: "何时4-bet全压？", a: "筹码<40BB时，4-bet = 全压（避免尴尬SPR）" },
            { q: "面对4-bet，何时5-bet？", a: "仅AA-KK，且确信对手会Call" },
            { q: "面对4-bet，何时Call？", a: "QQ-JJ（深筹码），看翻牌决策" },
            { q: "面对4-bet，何时Fold？", a: "所有诈唬牌、边缘价值牌（如AQs）" },
            { q: "EP vs LP 4-bet策略差异？", a: "EP 4-bet极紧（仅AA-KK），LP 4-bet可略宽" }
        ]
    },
    {
        category: "对抗Limp策略",
        questions: [
            { q: "面对1个EP Limper，应该如何？", a: "Iso-raise: TT+, AJ+（5-6BB）| Limp: 99-22, Axs, 同花连牌 | Fold: 弱牌" },
            { q: "面对2个Limper，应该如何？", a: "Iso-raise: JJ+, AQ+（6-7BB）| Limp: 所有小对子, 同花牌 | Fold: 弱牌" },
            { q: "面对3+个Limper，应该如何？", a: "几乎不Iso-raise（会形成多人底池）| Limp: 所有小对子, 同花连牌（隐含赔率极高）" },
            { q: "Limp behind（跟随Limp）的牌？", a: "22-77（set mining）, Axs, 同花连牌（可玩性高）" },
            { q: "Over-Limp后，翻后策略？", a: "仅用强成牌投入，放弃诈唬" },
            { q: "SB面对多个Limper，应该如何？", a: "Complete: 所有小对子, 同花牌 | Iso-raise: QQ+, AK | Fold: 弱牌" },
            { q: "BB面对多个Limper，应该如何？", a: "Check看免费牌（已投入1BB，赔率极好）" },
            { q: "对抗Limp-Reraise（先Limp再3-bet）策略？", a: "警惕！通常是AA-KK，仅用AA-QQ继续投入" }
        ]
    },
    {
        category: "实战范围微调",
        questions: [
            { q: "对抗极紧Nit（VPIP<10%），如何调整？", a: "仅用超强牌对抗（AA-QQ, AK），其他全弃" },
            { q: "对抗极松鱼（VPIP>40%），如何调整？", a: "放宽价值范围（增加Ax, Kx价值下注），减少诈唬" },
            { q: "对抗激进3-bet狂人，如何调整？", a: "增加4-bet频率（价值+诈唬），Call更多中等对子" },
            { q: "深筹码（300BB+）如何调整翻前范围？", a: "Open尺寸减小（2-2.2BB），增加小对子/同花连牌（隐含赔率高）" },
            { q: "浅筹码（30-50BB）如何调整翻前范围？", a: "减少投机牌（小对子, 同花连牌），增加全压频率" },
            { q: "对抗Calling Station（跟注站），如何调整？", a: "减少诈唬，增加薄价值下注，用强牌榨取" },
            { q: "湿润桌况（多人Limp），如何调整？", a: "减少Iso-raise，增加Over-Limp看翻牌" },
            { q: "紧桌况（频繁弃牌到BTN），如何调整？", a: "LP大幅放宽偷盲范围（BTN可打50%+）" },
            { q: "对抗不懂弃牌的鱼，如何调整3-bet？", a: "仅用价值牌3-bet（AA-JJ, AK），放弃所有诈唬" },
            { q: "自己Table Image紧（形象很紧），如何利用？", a: "增加偷盲/诈唬频率，对手会尊重你的3-bet" }
        ]
    }
];

// ==================== 8人桌训练模块 (Full Ring) ====================
const FULL_RING = [
    {
        category: "8人桌核心原则",
        questions: [
            { q: "8人桌vs 6人桌，最核心的差异是什么？", a: "位置更重要，范围更紧，价值下注>诈唬" },
            { q: "8人桌平均入池人数是多少？", a: "2.5-3.5人（6人桌1.5-2.5人）" },
            { q: "8人桌翻前加注频率应该是多少？", a: "12-18%（6人桌18-25%）" },
            { q: "8人桌为什么要更紧？", a: "更多对手在后面，被3-bet/squeeze概率更高" },
            { q: "8人桌位置价值有多重要？", a: "极其重要，EP/MP基本弃牌，LP才是主战场" },
            { q: "8人桌对抗多人底池的核心策略？", a: "只用强成牌价值下注，放弃诈唬" },
            { q: "8人桌偷盲成功率vs 6人桌？", a: "低30-40%（更多玩家防守）" },
            { q: "8人桌什么时候应该更激进？", a: "LP位置对抗Limp或单个弱手" },
            { q: "8人桌AA/KK应该如何打？", a: "必须加注，绝不Limp（多人底池易被追上）" },
            { q: "8人桌小对子价值如何？", a: "价值极高（多人底池+高隐含赔率）" }
        ]
    },
    {
        category: "8人桌翻前位置策略",
        questions: [
            { q: "8人桌UTG（枪口）应该打多少牌？", a: "5-8%（仅AA-99, AK, AQs）" },
            { q: "8人桌UTG+1（枪口+1）应该打多少牌？", a: "8-11%（增加88-77, AJs, KQs）" },
            { q: "8人桌MP（中位）应该打多少牌？", a: "12-16%（增加66-22, ATs+, KJs+, QJs）" },
            { q: "8人桌CO（关位）应该打多少牌？", a: "18-24%（增加同花连牌、弱Ax）" },
            { q: "8人桌BTN（按钮）应该打多少牌？", a: "25-35%（可广泛偷盲）" },
            { q: "8人桌SB（小盲）应该打多少牌？", a: "Limp 20-30%（位置最差），3-bet 8-12%" },
            { q: "8人桌BB（大盲）防守频率vs 6人桌？", a: "降低10-15%（对手范围更强）" },
            { q: "8人桌UTG Open后，MP应该如何应对？", a: "仅用QQ+/AK 3-bet，其他弃牌（除小对子set mining）" },
            { q: "8人桌面对EP加注，什么时候Cold Call？", a: "小对子（22-TT）set mining，需15:1+隐含赔率" },
            { q: "8人桌BTN面对MP Open，3-bet范围？", a: "8-12%（JJ+, AK, AQs, KQs，偶尔诈唬）" }
        ]
    },
    {
        category: "8人桌翻前尺寸调整",
        questions: [
            { q: "8人桌EP Open标准尺寸？", a: "2.5-3BB（比6人桌稍大，保护范围）" },
            { q: "8人桌LP Open标准尺寸？", a: "2.2-2.5BB（偷盲时可更小）" },
            { q: "8人桌对抗Limp的Iso-raise尺寸？", a: "4-5BB + 每个Limper +1BB" },
            { q: "8人桌3-bet标准尺寸？", a: "3.5-4x原加注（比6人桌稍大）" },
            { q: "8人桌为什么3-bet要稍大？", a: "保护范围，防止多人跟注形成多人底池" },
            { q: "8人桌面对多个Limper应该如何？", a: "Iso-raise更大（5-7BB），或用强牌Limp behind" }
        ]
    },
    {
        category: "8人桌翻后核心调整",
        questions: [
            { q: "8人桌单挑底池vs多人底池比例？", a: "单挑40%，多人60%（6人桌相反）" },
            { q: "8人桌多人底池C-bet频率？", a: "30-40%（仅强成牌，几乎不诈唬）" },
            { q: "8人桌单挑底池C-bet频率？", a: "60-70%（比6人桌低10%）" },
            { q: "8人桌多人底池拿顶对如何打？", a: "小额价值下注（30-50% pot），谨慎投入" },
            { q: "8人桌多人底池拿暗三如何打？", a: "标准价值下注（60-75% pot），榨取价值" },
            { q: "8人桌面对多人底池，什么时候诈唬？", a: "几乎不诈唬（至少2人跟注概率高）" },
            { q: "8人桌转牌多人底池拿两对如何打？", a: "谨慎价值下注，警惕暗三/同花/顺子" },
            { q: "8人桌河牌多人底池，对手下注意味着？", a: "极强牌力（诈唬极少），边缘牌应弃牌" },
            { q: "8人桌什么时候应该Check-Raise？", a: "单挑底池拿暗三+，或湿润牌面半诈唬" },
            { q: "8人桌同花听牌在多人底池如何打？", a: "Check-call为主（底池赔率好），少主动下注" }
        ]
    },
    {
        category: "8人桌价值下注策略",
        questions: [
            { q: "8人桌vs 6人桌，价值下注频率差异？", a: "提升20-30%（对手跟注范围更强）" },
            { q: "8人桌多人底池什么牌应该价值下注？", a: "顶两对+（顶对需谨慎）" },
            { q: "8人桌河牌拿坚果，多人底池如何下注？", a: "60-80% pot（榨取价值，避免吓跑对手）" },
            { q: "8人桌薄价值下注（Thin Value）应该减少吗？", a: "是的，减少30-40%（对手跟注范围更强）" },
            { q: "8人桌顶对好踢脚在单挑底池如何打？", a: "标准价值下注（50-60% pot），多街投入" },
            { q: "8人桌暗三在干燥牌面如何打？", a: "小额慢打或标准下注（诱导追听牌或诈唬）" }
        ]
    },
    {
        category: "8人桌Limp策略",
        questions: [
            { q: "8人桌什么时候可以Limp？", a: "小对子（22-55）多人底池set mining" },
            { q: "8人桌EP位置Limp AA/KK可行吗？", a: "不建议（易形成多人小底池，失去价值）" },
            { q: "8人桌面对1-2个Limper，应该如何？", a: "Iso-raise强牌（JJ+, AK），Limp小对子" },
            { q: "8人桌面对3+个Limper，应该如何？", a: "Limp小对子/同花连牌（隐含赔率极高）" },
            { q: "8人桌BB位置面对多个Limper？", a: "Check看免费牌（已投入盲注，赔率好）" },
            { q: "8人桌SB位置面对Limper应该如何？", a: "Complete小对子/同花连牌，弃弱牌" }
        ]
    },
    {
        category: "8人桌对抗Nit（紧手）",
        questions: [
            { q: "8人桌Nit通常在哪些位置？", a: "EP/MP（占比30-40%，远高于6人桌）" },
            { q: "8人桌如何识别Nit？", a: "VPIP <12%, PFR <10%, 只玩EP/MP" },
            { q: "8人桌Nit加注后，应该如何应对？", a: "仅用QQ+/AK对抗，其他弃牌" },
            { q: "8人桌Nit Limp意味着什么？", a: "通常是中等对子（77-JJ）或AQ" },
            { q: "8人桌Nit在LP加注后，应该如何？", a: "可正常应对（范围相对正常）" },
            { q: "8人桌如何利用Nit？", a: "他们弃牌后，在LP位置广泛偷盲" }
        ]
    },
    {
        category: "8人桌常见错误",
        questions: [
            { q: "8人桌最常见的错误是什么？", a: "玩太多EP/MP牌，范围过宽" },
            { q: "8人桌为什么不能用6人桌范围？", a: "会被频繁3-bet，或翻后被统治" },
            { q: "8人桌EP用AJo Open的问题？", a: "易被3-bet或翻后被AK/AQ统治" },
            { q: "8人桌多人底池过度诈唬的问题？", a: "成功率<30%，长期亏损" },
            { q: "8人桌用小对子3-bet的问题？", a: "无位置难打，SPR不理想，易输大底池" },
            { q: "8人桌LP偷盲频率过高的问题？", a: "被BB/SB 3-bet或看穿，反被剥削" },
            { q: "8人桌顶对在多人底池多街投入的问题？", a: "极易被暗三/两对/同花统治" },
            { q: "8人桌过度Limp的问题？", a: "被Iso-raise剥削，或形成小底池无利可图" }
        ]
    },
    {
        category: "8人桌高级概念",
        questions: [
            { q: "8人桌Squeeze Play（挤压打法）是什么？", a: "面对1个Open+1个Call，用强牌或空气3-bet孤立" },
            { q: "8人桌Squeeze需要多少成功率？", a: "50-60%（比6人桌更容易成功）" },
            { q: "8人桌什么是Isolation Raise（孤立加注）？", a: "对抗Limper大额加注，逼弃其他人，单挑弱手" },
            { q: "8人桌Over-Limp（跟随Limp）策略？", a: "多人Limp后，用小对子/同花连牌跟进" },
            { q: "8人桌如何利用多人底池的死钱？", a: "用强听牌半诈唬（底池赔率极好）" },
            { q: "8人桌EP vs LP的范围对抗？", a: "EP极强（5-8%），LP对抗时需谨慎" }
        ]
    }
];

// ==================== 深筹码训练模块 (300BB+) ====================
const DEEP_STACK = [
    {
        category: "深筹码核心原则",
        questions: [
            { q: "300BB深筹码时，SPR通常是多少？", a: "SPR 40-50+（极深筹码，需要坚果牌才能全压）" },
            { q: "深筹码最重要的技能是什么？", a: "控制底池（Pot Control）+ 翻后统治（Postflop Domination）" },
            { q: "深筹码vs浅筹码，位置价值有何不同？", a: "位置价值成倍放大，IP优势从10%提升至20%+" },
            { q: "深筹码什么牌可以全压？", a: "只有暗三以上、坚果同花、坚果顺子才考虑全压" },
            { q: "深筹码为什么要减小翻前下注尺寸？", a: "保持低SPR灵活性，避免被套牢（Committed）" },
            { q: "什么是逆向隐含赔率（Reverse Implied Odds）？", a: "你命中了却输大底池的风险，深筹码中极其致命" },
            { q: "深筹码顶对顶踢脚应该如何打？", a: "小额价值下注或check-call，绝不全压（易被统治）" },
            { q: "深筹码Set Mining的价值如何？", a: "价值极高（50:1隐含赔率），小对子可广泛跟注" },
            { q: "深筹码什么时候应该放弃顶对？", a: "面对多街大额下注，或湿润牌面对手展现极强牌力时" },
            { q: "深筹码河牌两极化策略是什么？", a: "要么坚果超额下注（150%+ pot），要么小额诱导或check" }
        ]
    },
    {
        category: "深筹码翻前调整",
        questions: [
            { q: "深筹码翻前Open标准尺寸？", a: "2-2.2BB（比浅筹码更小，避免底池膨胀）" },
            { q: "深筹码IP位置3-bet尺寸？", a: "2-2.5x原加注（更小，保持灵活性）" },
            { q: "深筹码OOP位置3-bet尺寸？", a: "2.5-3x（OOP仍需保护，但不宜过大）" },
            { q: "深筹码哪些牌可以Cold Call 3-bet？", a: "同花连牌、小对子、同花Ax（隐含赔率高）" },
            { q: "深筹码4-bet应该用什么range？", a: "极紧（仅AA/KK/AK），避免尴尬投入" },
            { q: "深筹码什么时候应该Flat Call AA？", a: "IP位置对抗弱手，诱导翻后投入更多筹码" },
            { q: "深筹码防守BB时，哪些牌价值提升？", a: "小对子、同花连牌（隐含赔率高）" },
            { q: "深筹码对抗Limp，应该如何调整？", a: "Iso-raise更小（3-4BB），避免底池失控" }
        ]
    },
    {
        category: "深筹码翻后核心策略",
        questions: [
            { q: "深筹码C-bet频率应该如何调整？", a: "降低频率（50-60%），但增加小尺寸下注（25-33% pot）" },
            { q: "深筹码什么时候用小额下注（1/4 pot）？", a: "干燥牌面持续施压，或坚果牌诱导跟注" },
            { q: "深筹码转牌标准下注尺寸？", a: "40-60% pot（比浅筹码更小，保持灵活性）" },
            { q: "深筹码河牌Overbet（150%+ pot）什么时候用？", a: "两极化场景：坚果牌榨取价值，或纯诈唬逼弃" },
            { q: "深筹码什么是延迟C-bet（Delayed C-bet）？", a: "翻牌check，转牌下注，利用对手放松警惕" },
            { q: "深筹码多街诈唬需要什么条件？", a: "故事一致性 + 阻断对手坚果牌 + 对手可能弃牌" },
            { q: "深筹码什么时候应该Check-Raise？", a: "暗三/顶两对+听牌，或纯诈唬赶走边缘牌" },
            { q: "深筹码浮跟（Float）策略是什么？", a: "IP位置跟注C-bet，转牌对手check后偷池" },
            { q: "深筹码河牌诱导（River Inducing）如何操作？", a: "转牌check，诱导对手河牌诈唬，然后check-raise" },
            { q: "深筹码什么时候慢打（Slowplay）坚果？", a: "湿润牌面对手可能追听牌，或对手激进容易自己投入" },
            { q: "深筹码顶两对如何打？", a: "小额价值下注（40-60% pot），避免全压被坚果吃掉" },
            { q: "深筹码同花听牌如何打？", a: "半诈唬下注（50% pot），或check-call保持底池可控" }
        ]
    },
    {
        category: "深筹码控制底池技巧",
        questions: [
            { q: "什么是控制底池（Pot Control）？", a: "用中等强度牌（顶对/两对）限制底池大小，避免全压" },
            { q: "深筹码顶对什么时候应该Check？", a: "OOP位置湿润牌面，或对手展现强牌力" },
            { q: "深筹码Over Pair在湿润牌面如何打？", a: "小额下注或check-call，绝不多街大额投入" },
            { q: "深筹码面对大额下注，什么牌应该弃牌？", a: "顶对、两对（易被暗三/顺子/同花统治）" },
            { q: "深筹码河牌拿顶两对，对手全压如何决策？", a: "通常弃牌（深筹码河牌全压极少诈唬）" },
            { q: "深筹码什么是薄价值下注（Thin Value）？", a: "用中等牌力（如第二对好踢脚）小额下注榨取价值" },
            { q: "深筹码如何避免被套牢（Committed）？", a: "翻前和翻牌圈控制投入，不超过筹码的20%" },
            { q: "深筹码转牌拿顶对，面对超额下注？", a: "通常弃牌（对手极少用听牌超额下注）" }
        ]
    },
    {
        category: "深筹码常见陷阱与错误",
        questions: [
            { q: "深筹码最常见的致命错误是什么？", a: "用顶对/两对全压，被暗三/坚果统治" },
            { q: "为什么深筹码不能过度价值下注两对？", a: "逆向隐含赔率极高，容易遇到暗三/满堂/同花" },
            { q: "深筹码用AK在K高牌面全压，错在哪？", a: "只打败诈唬，输给KQ/KJ/暗三/两对（统治风险）" },
            { q: "深筹码翻前4-bet太多会怎样？", a: "底池过大，SPR降低，失去翻后优势" },
            { q: "深筹码为什么不能用顶对Call多街大注？", a: "逆向隐含赔率极差，深筹码大注极少诈唬" },
            { q: "深筹码用同花听牌全压的风险？", a: "对手可能拿更大同花听牌或已成牌（统治）" },
            { q: "深筹码河牌对手全压，你拿顶两对，应该？", a: "通常弃牌（深筹码河牌全压=坚果，极少诈唬）" },
            { q: "深筹码翻前投入过多的后果？", a: "SPR降低，失去翻后灵活性，被迫全压劣势牌" },
            { q: "深筹码为什么不能慢打太多？", a: "给对手免费牌改进，失去榨取价值机会" },
            { q: "深筹码什么情况容易陷入逆向隐含赔率？", a: "拿非坚果同花/两端顺子/顶两对面对激进下注" }
        ]
    },
    {
        category: "深筹码高级概念",
        questions: [
            { q: "深筹码范围优势（Range Advantage）如何利用？", a: "干燥高牌面（K/A高）持续施压，小额多街下注" },
            { q: "深筹码坚果优势（Nut Advantage）如何利用？", a: "湿润牌面用大尺寸两极化下注（75-150% pot）" },
            { q: "深筹码什么是阻断下注（Blocking Bet）？", a: "河牌用弱牌小额下注（20-30% pot），防止对手大额下注" },
            { q: "深筹码多街诈唬的成功率需要多少？", a: "通常需要40%+成功率才有利可图（投入更多）" },
            { q: "深筹码河牌如何平衡range？", a: "坚果牌和空气牌用相同尺寸，中等牌小额或check" },
            { q: "深筹码什么是Merge Range？", a: "用中等牌力（顶对好踢脚）小额下注，既防守又价值" }
        ]
    }
];

// ==================== 必背数据模块 ====================
const DATA_MEMORY = [
    {
        category: "翻前对抗胜率",
        questions: [
            { q: "AA vs KK 的胜率对比？", a: "82% vs 18%（AA压倒性优势）" },
            { q: "AA vs AK同花 的胜率对比？", a: "87% vs 13%（AA大幅领先）" },
            { q: "AA vs AK杂色 的胜率对比？", a: "93% vs 7%（AA几乎必胜）" },
            { q: "AK vs QQ 的胜率对比？", a: "43% vs 57%（QQ小幅领先）" },
            { q: "AK vs 22 的胜率对比？", a: "50% vs 50%（硬币翻转Coin Flip）" },
            { q: "77 vs AK 的胜率对比？", a: "55% vs 45%（小对子领先）" },
            { q: "AK vs AQ 的胜率对比？", a: "74% vs 26%（支配关系Domination）" },
            { q: "JJ vs AK 的胜率对比？", a: "55% vs 45%（JJ小幅领先）" },
            { q: "KK vs AK 的胜率对比？", a: "70% vs 30%（KK大幅领先）" },
            { q: "QQ vs AK 和 77 vs AK 谁更有优势？", a: "QQ 57% > 77 55%（高对子优势更大）" },
            { q: "两个小对子对抗，如 88 vs 22？", a: "约 82% vs 18%（类似AA vs KK）" },
            { q: "同花AK vs 杂色AK 胜率差多少？", a: "差约2-3%（同花略好，但不显著）" },
            { q: "什么叫硬币翻转（Coin Flip）？", a: "胜率接近50-50的对抗，如AK vs 小对子" },
            { q: "什么叫支配关系（Domination）？", a: "共享高牌但踢脚更好，如AK vs AQ（74% vs 26%）" },
            { q: "翻前全压，什么情况你是最大劣势？", a: "被更大对子支配，如KK vs AA（18%）或被dominate如AQ vs AK（26%）" }
        ]
    },
    {
        category: "Outs与命中率",
        questions: [
            { q: "什么是Outs？", a: "能让你的牌改进成最好牌的剩余张数" },
            { q: "2个outs（如追满堂）转牌命中率？", a: "约4%（50:1）" },
            { q: "2个outs 转+河命中率？", a: "约8%（12:1）" },
            { q: "4个outs（内听顺子）转牌命中率？", a: "约9%（11:1）" },
            { q: "4个outs 转+河命中率？", a: "约16%（6:1）" },
            { q: "8个outs（两高张overcards）转+河命中率？", a: "约32%（3:1）" },
            { q: "9个outs（同花听牌）转牌命中率？", a: "约19%（5:1）" },
            { q: "9个outs（同花听牌）转+河命中率？", a: "约35%（2:1）记忆：约1/3" },
            { q: "12个outs（同花+内听顺）转+河命中率？", a: "约45%（接近一半）" },
            { q: "15个outs（同花+两高张）转+河命中率？", a: "约54%（超过一半）" },
            { q: "Rule of 2: 如何快速计算转牌命中率？", a: "Outs × 2 + 2%（如9 outs = 9×2+2 = 20%）" },
            { q: "Rule of 4: 如何快速计算转+河命中率？", a: "Outs × 4 - 4%（如9 outs = 9×4-4 = 32%）" },
            { q: "开放式顺听（OESD）有几个outs？", a: "8个outs（如你拿56，牌面478）" },
            { q: "内听顺子（Gutshot）有几个outs？", a: "4个outs（如你拿56，牌面489）" },
            { q: "两头顺听+同花听（Monster Draw）有几个outs？", a: "15个outs（8+9-2重复=15）" },
            { q: "翻牌圈暗三追满堂，转+河命中率？", a: "约33%（10个outs: 7张不重复+3张对公共牌）" }
        ]
    },
    {
        category: "翻牌后牌型对抗",
        questions: [
            { q: "顶对 vs 同花听牌 胜率？", a: "65% vs 35%（顶对领先）" },
            { q: "顶对 vs 开放式顺听 胜率？", a: "69% vs 31%（顶对更安全）" },
            { q: "顶对 vs 内听顺子 胜率？", a: "82% vs 18%（顶对压倒性优势）" },
            { q: "顶对 vs 同花+顺听组合 胜率？", a: "54% vs 46%（几乎硬币翻转）" },
            { q: "三条 vs 顶两对 胜率？", a: "88% vs 12%（三条压倒性优势）" },
            { q: "顺子 vs 两对 胜率？", a: "约80% vs 20%（顺子大幅领先）" },
            { q: "暗三 vs 明三（对手有对A）胜率？", a: "88% vs 12%（暗三优势巨大）" },
            { q: "Overpair vs Underpair（翻牌后无听牌）如QQ vs 77？", a: "82% vs 18%（高对子压倒性优势）" },
            { q: "小暗三 vs AA（翻牌后）胜率？", a: "约91% vs 9%（暗三完成翻转）" },
            { q: "坚果同花 vs 满堂（河牌前）胜率？", a: "满堂100%（同花没有outs）" }
        ]
    },
    {
        category: "SPR决策表",
        questions: [
            { q: "什么是SPR？", a: "Stack-to-Pot Ratio = 有效筹码量 ÷ 底池大小" },
            { q: "SPR 0-3时推荐打法？", a: "全压思维，低技术含量，任何顶对+都应全压" },
            { q: "SPR 4-6时推荐打法？", a: "标准打法，顶对好踢脚以上可全压" },
            { q: "SPR 7-13时推荐打法？", a: "深筹码打法，需两对以上才考虑全压" },
            { q: "SPR 14+时推荐打法？", a: "超深筹码，只有暗三/坚果才全压" },
            { q: "100BB筹码，翻前底池6BB，SPR是多少？", a: "SPR = 100÷6 ≈ 16.7（超深筹码）" },
            { q: "30BB短筹码，翻前底池7BB，SPR是多少？", a: "SPR = 30÷7 ≈ 4.3（标准打法）" },
            { q: "SPR越大，你需要什么样的牌才能全压？", a: "越强的牌（SPR高需要坚果，SPR低顶对就够）" }
        ]
    },
    {
        category: "MDF最小防守频率",
        questions: [
            { q: "什么是MDF？", a: "Minimum Defense Frequency，防止对手无限诈唬的最小防守频率" },
            { q: "MDF计算公式？", a: "MDF = 底池 ÷ (底池 + 下注额)，即你需要防守的最小频率" },
            { q: "对手下注50% pot，你的MDF是多少？", a: "100/(100+50) = 67%，你需要防守67%（最多弃33%）" },
            { q: "对手下注75% pot，你的MDF是多少？", a: "100/(100+75) = 57%，你需要防守57%（最多弃43%）" },
            { q: "对手下注100% pot（pot-sized bet），你的MDF？", a: "100/(100+100) = 50%，你需要防守50%（最多弃50%）" },
            { q: "对手Overbet 150% pot，你的MDF？", a: "100/(100+150) = 40%，你只需防守40%（可弃60%）" },
            { q: "下注越大，你可以弃牌越多还是越少？", a: "越多（大额下注给你更好的fold价格）" },
            { q: "对手下注33% pot（小额下注），你的MDF？", a: "33/(100+33) = 25%，你需要防守75%（必须广泛防守）" }
        ]
    },
    {
        category: "底池赔率",
        questions: [
            { q: "底池赔率计算公式？", a: "需要胜率 = 跟注额 ÷ (底池 + 跟注额)" },
            { q: "底池$100，需要跟注$50，你需要多少胜率？", a: "50/(100+50) = 33%（2:1赔率）" },
            { q: "底池$60，需要跟注$20，你需要多少胜率？", a: "20/(60+20) = 25%（3:1赔率）" },
            { q: "底池$100，需要跟注$100，你需要多少胜率？", a: "100/(100+100) = 50%（1:1赔率）" },
            { q: "底池$50，需要跟注$25，你需要多少胜率？", a: "25/(50+25) = 33%（2:1赔率）" },
            { q: "你有9个outs（35%胜率），底池$100要跟$50，该跟吗？", a: "应该跟（35% > 33%需要胜率，有利可图）" },
            { q: "你有4个outs（16%胜率），底池$60要跟$20，该跟吗？", a: "不应该跟（16% < 25%需要胜率，长期亏损）" },
            { q: "3:1的底池赔率，需要多少胜率？", a: "25%（记忆：1÷4 = 25%）" },
            { q: "2:1的底池赔率，需要多少胜率？", a: "33%（记忆：1÷3 = 33%）" }
        ]
    },
    {
        category: "阻断牌效应",
        questions: [
            { q: "什么是阻断牌（Blocker）？", a: "你持有的牌减少了对手拿到某些组合的可能性" },
            { q: "你持有A♠，对手做坚果同花的概率降低多少？", a: "减少约33%（对手少一张A可组合）" },
            { q: "你持有K，对手拿到顶对KK的组合减少多少？", a: "减少约25%（6种组合变3种）" },
            { q: "你持有Ax面对3-bet，对手AA/AK组合减少多少？", a: "减少约50%（你占据一张A）" },
            { q: "什么时候用有阻断的牌诈唬最好？", a: "当你阻断对手的坚果牌时（如A高阻断坚果同花）" },
            { q: "什么时候用无阻断的牌跟注最好？", a: "当你不阻断对手的诈唬牌时（让对手有更多诈唬组合）" }
        ]
    },
    {
        category: "C-Bet频率",
        questions: [
            { q: "什么是C-Bet？", a: "Continuation Bet，翻前加注者在翻牌圈的持续下注" },
            { q: "干燥牌面（如K72r）建议C-bet频率？", a: "75-85%（高频率）" },
            { q: "湿润牌面（如J♥T♥8♠）建议C-bet频率？", a: "30-50%（低频率，选择性下注）" },
            { q: "A高牌面建议C-bet频率？", a: "60-70%（中等频率，小尺寸）" },
            { q: "低连牌（如765）你没命中时C-bet频率？", a: "30-40%（谨慎，对手容易命中）" },
            { q: "干燥牌面C-bet后，转牌持续率（2nd barrel）？", a: "55-65%（继续施压）" },
            { q: "湿润牌面C-bet后，转牌持续率？", a: "仅坚果/强听牌（20-30%）" }
        ]
    },
    {
        category: "3-Bet与4-Bet尺寸",
        questions: [
            { q: "IP（有位置）3-Bet标准尺寸？", a: "2.5-3x原加注" },
            { q: "OOP（无位置）3-Bet标准尺寸？", a: "3-4x原加注（更大保护）" },
            { q: "对抗Limp的3-Bet尺寸？", a: "4-5BB + 每个Limper额外+1BB" },
            { q: "IP（有位置）4-Bet标准尺寸？", a: "2.2-2.5x 3-bet" },
            { q: "OOP（无位置）4-Bet标准尺寸？", a: "2.5-3x 3-bet" },
            { q: "短筹码（<40BB）4-Bet应该用什么尺寸？", a: "直接全压（避免尴尬SPR）" }
        ]
    },
    {
        category: "防守盲注",
        questions: [
            { q: "BB vs BTN偷盲，推荐防守频率？", a: "40-50%（BB位置差但赔率好）" },
            { q: "BB vs CO偷盲，推荐防守频率？", a: "35-45%（CO范围稍紧）" },
            { q: "BB vs SB加注，推荐防守频率？", a: "50-65%（SB范围最宽，底池赔率好）" },
            { q: "SB vs BTN偷盲，推荐防守频率？", a: "35-40%（SB位置最差）" },
            { q: "BB跟注需要多少胜率（对抗BTN 2.5x）？", a: "约28%（赔率好，需要广泛防守）" }
        ]
    },
    {
        category: "Set Mining追暗三",
        questions: [
            { q: "什么是Set Mining？", a: "用小对子跟注，希望翻牌中暗三条赢大底池" },
            { q: "Set Mining需要多少隐含赔率？", a: "至少15:1（对手筹码≥15x你的跟注额）" },
            { q: "小对子翻牌圈中暗三的概率？", a: "约11.8%（8.5:1，约1/8.5）" },
            { q: "翻牌miss后，转牌再中暗三的概率？", a: "约4.3%（23:1）" }
        ]
    },
    {
        category: "牌面结构分类",
        questions: [
            { q: "什么是Static静态牌面？", a: "K72r这种干燥牌面，河牌很难逆转" },
            { q: "什么是Dynamic动态牌面？", a: "J♥T♥8♠这种湿润牌面，每张牌都能改变局势" },
            { q: "什么是Draw-heavy听牌密集牌面？", a: "9♠8♠7♥这种牌面，大量听牌组合存在" },
            { q: "静态牌面应该如何调整策略？", a: "可以放心价值下注，诈唬也有效（对手难改进）" },
            { q: "动态牌面应该如何调整策略？", a: "谨慎投入，控制底池，保护好听牌" }
        ]
    },
    {
        category: "标准下注尺寸",
        questions: [
            { q: "现代翻前Open标准尺寸？", a: "2.2-2.5BB（趋势越来越小）" },
            { q: "翻牌圈标准C-bet尺寸？", a: "33-50% pot（小尺寸为主）" },
            { q: "转牌圈标准下注尺寸？", a: "50-75% pot" },
            { q: "河牌圈标准下注尺寸？", a: "50-100% pot（两极化：价值或诈唬）" },
            { q: "什么时候用Overbet（>100% pot）？", a: "河牌两极化场景：坚果或纯诈唬" }
        ]
    }
];

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


