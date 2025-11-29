// 高阶训练师 - 世界顶级水准专用
// 针对100万手牌以上经验玩家
// 版本: 1.0.0

// ==================== 低级错误防范模块 ====================
const COMMON_MISTAKES = [
    {
        id: 1,
        category: "翻前错误",
        title: "位置意识丢失",
        icon: "🎯",
        mistakes: [
            {
                q: "UTG open后，MP 3bet，你在CO拿到AQo，该怎么做？",
                wrong: "Call或4bet",
                correct: "Fold",
                why: "🧠 关键点：\n• UTG range很强\n• MP cold 3bet更强（通常QQ+, AK）\n• AQo对抗两个强range是dominated\n• 你还有2个位置在后面\n\n❌ 常见错误：看到AQo就兴奋\n✅ 正确思维：对手range > 我的牌力",
                frequency: "高频错误 - 每session平均2-3次"
            },
            {
                q: "SB vs BB单挑，你在SB拿到K2o，该怎么做？",
                wrong: "Open raise",
                correct: "Fold（标准策略）或Limp（特定策略）",
                why: "🧠 关键点：\n• K2o是陷阱牌\n• 击中K会输给更好的K\n• 击中2毫无价值\n• OOP可玩性极差\n\n❌ 常见错误：SB就是要偷盲\n✅ 正确思维：有些牌即使在SB也该fold",
                frequency: "中频错误 - 特别是疲劳时"
            },
            {
                q: "你在BTN open 2.5BB，BB 3bet到10BB，你拿到JTs。Fold还是Call？",
                wrong: "总是Call因为有位置",
                correct: "取决于对手和筹码深度",
                why: "🧠 决策框架：\n• 有效筹码<60BB → Fold（SPR太低）\n• 有效筹码60-100BB → Call如果对手会付钱\n• 有效筹码>100BB → Call有足够隐含赔率\n\n❌ 常见错误：不考虑筹码深度\n✅ 正确思维：SPR决定投机牌价值",
                frequency: "高频错误 - 思维捷径"
            }
        ]
    },
    {
        id: 2,
        category: "翻牌错误",
        title: "C-bet决策失误",
        icon: "🃏",
        mistakes: [
            {
                q: "你在CO open，BB call。Flop: J♥7♣2♦。你拿到AKo（没击中），该怎么做？",
                wrong: "自动C-bet因为我是进攻者",
                correct: "根据对手类型决定",
                why: "🧠 C-bet决策框架：\n\nvs 跟注站：Check（他们不fold）\nvs Nit：Bet 1/3 pot（他们fold太多）\nvs TAG：Bet 1/3-1/2（标准）\nvs LAG：Check-fold或Check-call（他们会bluff）\n\n❌ 常见错误：机械化c-bet\n✅ 正确思维：c-bet目的是什么？",
                frequency: "极高频错误 - 自动驾驶"
            },
            {
                q: "你在BTN 3bet pot，BB call。Flop: A♠K♥Q♣。你拿到99，该怎么做？",
                wrong: "C-bet因为我3bet了",
                correct: "Check",
                why: "🧠 Range分析：\n• 这个board严重有利于3bet range\n• 但99在这个board几乎没有equity\n• 任何A、K、Q、J、T都领先你\n• C-bet只会被更好的牌call或raise\n\n❌ 常见错误：我3bet了就要c-bet\n✅ 正确思维：我的具体牌在这个board怎样？",
                frequency: "高频错误 - 不看board texture"
            },
            {
                q: "多人底池，你在CO open，BTN和BB都call。Flop: 8♣7♣5♠。你拿到AA，该怎么做？",
                wrong: "大额C-bet保护手牌",
                correct: "小额bet 25-33% pot 或 Check",
                why: "🧠 多人底池原则：\n• 多人底池需要更强牌力才能value bet\n• AA在这个board非常脆弱\n• 89、67、56、同花听牌都有很多\n• 小bet可以控制底池，也可以获取信息\n\n❌ 常见错误：AA就是要下大\n✅ 正确思维：多人底池 = 更谨慎",
                frequency: "中频错误 - 过度保护"
            }
        ]
    },
    {
        id: 3,
        category: "转牌错误",
        title: "第二枪失误",
        icon: "🎲",
        mistakes: [
            {
                q: "你在翻牌C-bet被call。转牌是一张完全空白牌。你拿到空气牌，该怎么做？",
                wrong: "继续bluff或总是放弃",
                correct: "取决于翻牌board和对手",
                why: "🧠 转牌barrel决策：\n\n✅ 应该继续bluff如果：\n• 翻牌board潮湿（他可能在float）\n• 对手fold to turn bet高\n• 你有blocker（如Ace blocker）\n\n❌ 不应该继续bluff如果：\n• 翻牌board干燥（他有牌）\n• 对手是跟注站\n• 你没有任何equity\n\n💡 原则：不是每个bluff都需要3barrel",
                frequency: "高频错误 - 无计划bluff"
            },
            {
                q: "你翻牌下注被call，转牌来了同花第三张。你拿到顶对顶kicker，该怎么做？",
                wrong: "继续下注保护手牌",
                correct: "通常Check",
                why: "🧠 恐怖牌分析：\n• 同花完成是最常见的恐怖牌\n• 顶对在这里变成了bluff catcher\n• 继续下注只会被更好的牌call\n• Check可以控制底池，也可以诱导bluff\n\n❌ 常见错误：我领先要保护\n✅ 正确思维：恐怖牌出现 = 重新评估",
                frequency: "高频错误 - 不根据board变化调整"
            }
        ]
    },
    {
        id: 4,
        category: "河牌错误",
        title: "价值与诈唬失衡",
        icon: "💰",
        mistakes: [
            {
                q: "河牌你拿到中等强度牌（如第二对），对手Check给你，该怎么做？",
                wrong: "下注获取薄价值",
                correct: "通常Check back",
                why: "🧠 河牌薄价值陷阱：\n• 中等牌下注 = 把自己变成bluff\n• 更差的牌fold，更好的牌call/raise\n• 这叫\"自我价值切割\"\n\n✅ 薄value的条件：\n• 对手range有足够worse hands会call\n• 对手不会check-raise bluff\n• 你的牌beat他的call range\n\n❌ 常见错误：我领先就要下注\n✅ 正确思维：他会用什么call？",
                frequency: "极高频错误 - 过度薄价值"
            },
            {
                q: "河牌大额下注你应该怎么思考？",
                wrong: "看自己的牌力决定",
                correct: "计算对手的value/bluff比例",
                why: "🧠 河牌大注分析框架：\n\n1️⃣ 他的value hands有哪些？\n2️⃣ 他的bluff hands有哪些？\n3️⃣ Value:Bluff比例是多少？\n4️⃣ 我需要多少胜率才能call？\n\n💡 计算示例：\n• Pot = 100, Bet = 100\n• 你需要 100/(100+100+100) = 33%胜率\n• 如果他value:bluff = 2:1, 你胜率 = 33%\n• 刚好够call\n\n❌ 常见错误：我有顶对就call\n✅ 正确思维：基于range和数学决策",
                frequency: "高频错误 - 不做数学计算"
            }
        ]
    },
    {
        id: 5,
        category: "心态错误",
        title: "Tilt和情绪管理",
        icon: "🧠",
        mistakes: [
            {
                q: "你刚刚被bad beat输了一个大底池，下一手你拿到边缘牌，该怎么做？",
                wrong: "立刻入池想赢回来",
                correct: "深呼吸，按正常range决策",
                why: "🧠 Bad Beat后的正确反应：\n\n1️⃣ 暂停5秒（物理性暂停）\n2️⃣ 深呼吸3次\n3️⃣ 自问：如果这是session第一手，我会怎么做？\n4️⃣ 按那个答案执行\n\n⚠️ Tilt信号：\n• 想\"赢回来\"\n• 觉得\"运气不好要补偿\"\n• 感到愤怒或沮丧\n\n✅ 正确心态：\n• 每一手都是独立的\n• 我控制决策，不控制结果\n• 长期EV是唯一重要的",
                frequency: "根据个人 - session关键错误"
            },
            {
                q: "你连续赢了几个大底池，感觉今天运气很好，该怎么做？",
                wrong: "放松标准，多打一些边缘牌",
                correct: "保持标准，不因为赢钱而改变",
                why: "🧠 Winner's Tilt也是Tilt：\n\n❌ 常见症状：\n• 觉得\"今天运气好可以浪\"\n• 开始玩更多边缘牌\n• 不尊重对手的raise\n• 觉得自己打得特别好\n\n✅ 正确心态：\n• 运气会回归均值\n• 每一手都按GTO/剥削标准打\n• 不因为stack size改变决策\n• 好的session更要保护\n\n💡 格言：Scared money don't make money, but tilted money loses faster",
                frequency: "中频错误 - 特别是大赢时"
            }
        ]
    }
];

// ==================== 数学计算训练模块 ====================
const MATH_TRAINING = [
    {
        id: 1,
        category: "底池赔率",
        title: "快速底池赔率计算",
        icon: "🔢",
        problems: [
            {
                q: "底池100，对手下注50，你需要多少胜率才能盈利call？",
                a: "25%",
                calculation: "你需要投入50来赢150（100+50）\n50/150 = 33.3%...错！\n\n正确计算：50/(100+50+50) = 50/200 = 25%\n\n💡 公式：Call / (Pot + Bet + Call) = 所需胜率",
                tips: "常用比例记忆：\n• 1/4 pot bet → 需要16.7%\n• 1/3 pot bet → 需要20%\n• 1/2 pot bet → 需要25%\n• 2/3 pot bet → 需要28.6%\n• 1x pot bet → 需要33.3%\n• 2x pot bet → 需要40%"
            },
            {
                q: "你有9 outs（同花听牌），翻牌到河牌的胜率大约是多少？",
                a: "约35%",
                calculation: "翻牌到转牌：9/47 ≈ 19%\n转牌到河牌：9/46 ≈ 20%\n至少命中一次：1 - (0.81 × 0.80) ≈ 35%\n\n💡 快速估算：outs × 4 = 翻牌到河牌%\n9 × 4 = 36% ≈ 35%",
                tips: "常用outs记忆：\n• 同花听牌：9 outs → 翻到河35%\n• 顺子听牌：8 outs → 翻到河32%\n• 两头顺+同花：15 outs → 翻到河54%\n• Overcard：6 outs → 翻到河24%"
            }
        ]
    },
    {
        id: 2,
        category: "MDF计算",
        title: "最小防守频率",
        icon: "🛡️",
        problems: [
            {
                q: "对手下注2/3 pot，你的MDF是多少？",
                a: "60%",
                calculation: "MDF = 1 - (Bet / (Pot + Bet))\n= 1 - (66.7 / 166.7)\n= 1 - 0.4\n= 60%\n\n💡 理解：如果你fold超过40%，对手的任何bluff都有利可图",
                tips: "常用MDF记忆：\n• 1/3 pot → MDF 75%\n• 1/2 pot → MDF 67%\n• 2/3 pot → MDF 60%\n• 1x pot → MDF 50%\n• 2x pot → MDF 33%\n\n⚠️ 注意：MDF是理论最大值，实战中需要根据对手调整"
            },
            {
                q: "为什么MDF不是绝对的？什么情况下可以over-fold？",
                a: "当对手under-bluff时",
                calculation: "MDF假设对手用正确的bluff频率\n\n如果对手只用value bet这个sizing：\n• 他的bluff = 0%\n• 你应该fold 100%的bluff catchers\n\n如果对手over-bluff：\n• 你应该call更多\n• 甚至用bluff catchers call",
                tips: "实战应用：\n• vs Nit大注 → over-fold\n• vs Maniac大注 → over-call\n• vs Unknown → 接近MDF\n\n💡 核心：MDF是baseline，剥削是adjustment"
            }
        ]
    },
    {
        id: 3,
        category: "EV计算",
        title: "期望值决策",
        icon: "💵",
        problems: [
            {
                q: "底池100，你有50%胜率。你下注50，对手会call 60%、fold 40%。Bet的EV比Check多多少？",
                a: "+20",
                calculation: "📊 Check的EV：\n• 50%赢100 + 50%赢0 = +50\n\n📊 Bet 50的EV：\n• 对手Fold (40%): 赢100 → 0.4 × 100 = +40\n• 对手Call且你赢 (60% × 50% = 30%): 赢150 → 0.3 × 150 = +45\n• 对手Call且你输 (60% × 50% = 30%): 输50 → 0.3 × (-50) = -15\n\nBet EV = 40 + 45 - 15 = +70\n\n📊 增量EV = Bet EV - Check EV = 70 - 50 = +20\n\n✅ 结论：下注比过牌多赢20",
                tips: "💡 EV计算框架：\n\n1️⃣ 分别计算每个选项的EV\n2️⃣ Check EV = 胜率 × 底池\n3️⃣ Bet EV = Σ(概率 × 结果)\n4️⃣ 比较哪个EV更高\n\n⚠️ 常见错误：\n• 忘记算fold的价值\n• 把概率搞混\n• 不算增量EV"
            }
        ]
    },
    {
        id: 4,
        category: "组合计数",
        title: "Combos计算",
        icon: "🎴",
        problems: [
            {
                q: "对手的3bet range是QQ+和AK，有多少combos？",
                a: "34 combos",
                calculation: "对子计算：4C2 = 6 combos每对\n• QQ = 6\n• KK = 6\n• AA = 6\n\n非对子计算：4 × 4 = 16 combos\n• AKs = 4\n• AKo = 12\n\n总共：6 + 6 + 6 + 4 + 12 = 34 combos",
                tips: "常用组合记忆：\n• 每个对子：6 combos\n• 同花非对子：4 combos\n• 非同花非对子：12 combos\n• 总非对子：16 combos\n\n💡 应用：\n• Board有一张A → AA只剩3 combos\n• 你拿着一张A → AK只剩12 combos\n• Blocker效应很重要！"
            },
            {
                q: "翻牌是A♠K♥7♣，对手3bet范围是QQ+/AK。他有多少combos能打败你的77 set？",
                a: "AA: 3, KK: 3, AK: 9 = 共15个危险combos",
                calculation: "🎴 你的77 set输给：\n\nAA (set over set)：\n• Board有A♠，剩余A: A♥A♦A♣\n• AA combos = 3C2 = 3 combos\n\nKK (set over set)：\n• Board有K♥，剩余K: K♠K♦K♣\n• KK combos = 3C2 = 3 combos\n\nAK (两对)：\n• Board有A♠K♥\n• 剩余A: 3张，剩余K: 3张\n• AK combos = 3 × 3 = 9 combos\n\n📊 总危险combos = 3 + 3 + 9 = 15\n\n💡 QQ不危险（你的set赢）",
                tips: "Combo分析用于：\n• 判断对手range中有多少combos打败你\n• Board上的牌会减少对手的combos（Blocker效应）\n• 例：A在board上，AA只剩3 combos而不是6\n\n⚠️ 关键：永远算board已用掉的牌"
            }
        ]
    }
];

// ==================== Sizing决策训练模块 ====================
const SIZING_TRAINING = [
    {
        id: 1,
        category: "C-bet Sizing",
        title: "翻牌圈下注尺度",
        icon: "📏",
        scenarios: [
            {
                board: "A♠7♥2♣ (Dry rainbow)",
                situation: "你在CO open，BB call",
                sizing_options: ["25-33% pot", "50% pot", "75% pot", "Check"],
                correct: "25-33% pot",
                why: "🧠 Dry Board策略：\n\n• Board干燥 = 没有听牌\n• 对手range大部分错过\n• 小bet就能达到目的\n• 让对手用worse hands call\n\n💡 小bet的好处：\n• 风险小，收益相同\n• 让对手犯错（用weak call）\n• 保持平衡（bluff便宜）"
            },
            {
                board: "J♥T♠9♣ (Wet connected)",
                situation: "你在BTN open，BB call",
                sizing_options: ["25-33% pot", "50% pot", "75-100% pot", "Check"],
                correct: "75-100% pot",
                why: "🧠 Wet Board策略：\n\n• Board潮湿 = 很多听牌\n• 你需要让听牌付费\n• 你需要保护你的range\n• 对手错过的话不会call anyway\n\n💡 大bet的好处：\n• 让听牌付出最大代价\n• 建立更大的底池（如果你有牌）\n• 减少对手实现equity的机会"
            },
            {
                board: "K♠Q♥J♣ (Broadway heavy)",
                situation: "你在CO 3bet，BTN call",
                sizing_options: ["25-33% pot", "50% pot", "75% pot", "Check more"],
                correct: "Check more",
                why: "🧠 对手有利Board：\n\n• 这个board对caller有利\n• Caller的range有更多KQ, KJ, QJ\n• 你的3bet range虽然有AA, KK\n• 但AA不想在这build pot\n\n💡 Check的好处：\n• 控制底池大小\n• 保护你的check range\n• 让对手bluff\n• 避免被check-raise尴尬"
            }
        ]
    },
    {
        id: 2,
        category: "Value Sizing",
        title: "价值下注尺度",
        icon: "💎",
        scenarios: [
            {
                situation: "你有nuts，对手是跟注站",
                sizing_options: ["50% pot", "75% pot", "100% pot", "150%+ pot"],
                correct: "150%+ pot",
                why: "🧠 vs 跟注站策略：\n\n• 他们不根据size调整\n• 他们call/fold是二元的\n• 最大化单次value\n\n💡 典型sizing：\n• 有nuts → 尽量大（150%+）\n• 顶对 → 大（他们用second pair call）\n• 中等牌 → 可能check（他们不会fold）"
            },
            {
                situation: "你有strong hand，对手是TAG",
                sizing_options: ["50% pot", "66% pot", "100% pot", "Check-raise"],
                correct: "66% pot",
                why: "🧠 vs TAG策略：\n\n• TAG会根据size思考\n• 太大他们会fold\n• 太小损失value\n• 需要找平衡点\n\n💡 思考方式：\n• 他会用什么牌call？\n• 什么size让他觉得可以call？\n• 不要吓跑他的bluff catching range"
            },
            {
                situation: "河牌你有bluff，对手check",
                sizing_options: ["33% pot", "66% pot", "100% pot", "150%+ pot"],
                correct: "取决于你需要他fold什么",
                why: "🧠 Bluff Sizing逻辑：\n\n小bluff (33-50%)：\n• 让他fold空气\n• 风险小\n• 适合对手会hero fold的人\n\n大bluff (100%+)：\n• 让他fold made hands\n• 风险大但逼迫他做艰难决定\n• 适合对手较紧的人\n\n💡 核心问题：\n他的call range是什么？\n什么size能击穿这个range？"
            }
        ]
    }
];

// ==================== 多街规划训练模块 ====================
const MULTISTREET_PLANNING = [
    {
        id: 1,
        title: "翻牌圈就规划河牌",
        icon: "🗺️",
        scenario: {
            setup: "你在BTN open，BB call。Pot: 6BB\n你拿到: A♠K♥\nFlop: K♣7♥3♠\nBB check",
            plans: [
                {
                    turn_card: "任意空白牌（2♦等）",
                    your_plan: "Bet-Bet-Bet（三条街价值）",
                    sizing: "翻牌33%, 转牌66%, 河牌75-100%",
                    reasoning: "顶对顶kicker，三条街value大部分情况"
                },
                {
                    turn_card: "同花第三张出现（如4♠）",
                    your_plan: "Bet-Check-根据河牌决定",
                    sizing: "翻牌bet后，转牌check控池",
                    reasoning: "同花可能完成，顶对变成bluff catcher，check控制底池"
                },
                {
                    turn_card: "A来了（A♦）",
                    your_plan: "Bet-Bet-根据河牌决定",
                    sizing: "转牌可以加大size因为两对",
                    reasoning: "提升到两对，可以承受更多value"
                }
            ]
        }
    },
    {
        id: 2,
        title: "Bluff的多街规划",
        icon: "🎭",
        scenario: {
            setup: "你在CO 3bet，BTN call。Pot: 20BB\n你拿到: A♥5♥\nFlop: K♠8♦3♣\nBTN check",
            plans: [
                {
                    turn_card: "转牌来A或5（击中）",
                    your_plan: "翻牌Check → 转牌大bet",
                    sizing: "翻牌check，转牌70-80% pot",
                    reasoning: "翻牌没equity先保留，击中后变value bet"
                },
                {
                    turn_card: "转牌空白牌",
                    your_plan: "翻牌小C-bet → 转牌放弃",
                    sizing: "翻牌33% pot作为probe",
                    reasoning: "用Ace blocker试探，被call说明他有牌，放弃"
                },
                {
                    turn_card: "对手两条街都check",
                    your_plan: "河牌bluff",
                    sizing: "河牌60-75% pot",
                    reasoning: "他两条街check说明range很弱，河牌攻击"
                }
            ]
        }
    }
];

// ==================== Tilt管理模块 ====================
const TILT_MANAGEMENT = [
    {
        id: 1,
        title: "Tilt识别检查表",
        icon: "🚨",
        warning_signs: [
            "🔴 开始用边缘牌call大注",
            "🔴 想\"赢回来\"",
            "🔴 对某个玩家有情绪",
            "🔴 打得比平常快",
            "🔴 不再考虑对手range",
            "🔴 觉得运气欠我的",
            "🟡 开始感到疲劳",
            "🟡 分心看手机/其他",
            "🟡 忘记对手的历史",
            "🟡 不想下桌因为在输"
        ],
        action_protocol: [
            "1️⃣ 发现1-2个黄色信号 → 休息5分钟",
            "2️⃣ 发现任何红色信号 → 休息15分钟",
            "3️⃣ 发现3+信号 → 考虑结束session",
            "4️⃣ 连续2个session有问题 → 休息1天"
        ]
    },
    {
        id: 2,
        title: "Bad Beat后的5秒规则",
        icon: "⏱️",
        protocol: [
            "第1秒：承认\"这很痛苦\"",
            "第2秒：深呼吸",
            "第3秒：提醒自己\"这只是一手牌\"",
            "第4秒：看看对手，他可能也在想事情",
            "第5秒：专注于下一手，就像新session开始"
        ],
        mantras: [
            "\"我控制决策，不控制结果\"",
            "\"长期EV是唯一重要的\"",
            "\"这正是让我长期盈利的原因\"",
            "\"他的错误终将让他破产\"",
            "\"下一手是新的机会\""
        ]
    }
];

// ==================== 复盘框架模块 ====================
const REVIEW_FRAMEWORK = [
    {
        id: 1,
        title: "手牌复盘5步法",
        icon: "📝",
        steps: [
            {
                step: 1,
                title: "情境回顾",
                questions: [
                    "有效筹码是多少？",
                    "位置关系是什么？",
                    "对手类型是什么？",
                    "之前有什么历史？"
                ]
            },
            {
                step: 2,
                title: "Range分析",
                questions: [
                    "对手的range是什么？",
                    "我的range在对手眼中是什么？",
                    "这个board对谁有利？",
                    "有哪些blocker在起作用？"
                ]
            },
            {
                step: 3,
                title: "决策点分析",
                questions: [
                    "我的选项有哪些？（Bet/Check/Raise/Fold）",
                    "每个选项的EV大概是多少？",
                    "我选择了什么？为什么？",
                    "我是否考虑了所有信息？"
                ]
            },
            {
                step: 4,
                title: "结果分离",
                questions: [
                    "结果是什么？",
                    "结果是运气还是技术决定的？",
                    "如果重来100次，这个决策是+EV吗？",
                    "不要被结果影响对决策的评估"
                ]
            },
            {
                step: 5,
                title: "改进记录",
                questions: [
                    "这手牌暴露了什么漏洞？",
                    "下次遇到类似情况怎么做？",
                    "需要增加什么知识或技能？",
                    "记录到漏洞本上"
                ]
            }
        ]
    }
];

// ==================== 全局状态 ====================
let advancedData = {
    mistakesCompleted: [],
    mathCompleted: [],
    sizingCompleted: [],
    planningCompleted: [],
    tiltChecks: 0,
    reviewsDone: 0,
    lastSession: null,
    totalTime: 0
};

// ==================== 导出模块 ====================
const ADVANCED_MODULES = {
    mistakes: COMMON_MISTAKES,
    math: MATH_TRAINING,
    sizing: SIZING_TRAINING,
    planning: MULTISTREET_PLANNING,
    tilt: TILT_MANAGEMENT,
    review: REVIEW_FRAMEWORK
};

// 计算总题目数
function getTotalQuestions() {
    let total = 0;
    COMMON_MISTAKES.forEach(cat => total += cat.mistakes.length);
    MATH_TRAINING.forEach(cat => total += cat.problems.length);
    SIZING_TRAINING.forEach(cat => total += cat.scenarios.length);
    total += MULTISTREET_PLANNING.length;
    return total;
}

console.log('高阶训练模块加载完成');
console.log('低级错误防范:', COMMON_MISTAKES.reduce((acc, c) => acc + c.mistakes.length, 0), '题');
console.log('数学计算训练:', MATH_TRAINING.reduce((acc, c) => acc + c.problems.length, 0), '题');
console.log('Sizing决策训练:', SIZING_TRAINING.reduce((acc, c) => acc + c.scenarios.length, 0), '题');
console.log('多街规划训练:', MULTISTREET_PLANNING.length, '题');

