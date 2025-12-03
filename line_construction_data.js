// 故事线构建训练数据库
// Line Construction Training Data
// 世界级Bluff和Value Line策略

const LINE_SCENARIOS = {
    // 错过的听牌
    missed_draw: {
        title: "案例: 错过同花听牌的多种story",
        situation: {
            structure: "8人桌 300BB",
            hand: "A♦ 5♦ (错过同花)",
            board: "Flop: K♠ 9♦ 4♦ → Turn: Q♣ → River: 7♥",
            pot: "河牌前50BB",
            context: "你BTN open 3BB, BB call。翻牌你有nut flush draw + wheel draw。转牌miss，河牌完全brick。"
        },
        challenge: "你完全miss了，只有A高。但你有range advantage和position。如何构建可信的bluff story赢下这个底池？",
        
        lines: [
            {
                name: "Line 1: Triple Barrel Standard",
                rating: 4,
                actions: {
                    flop: "Bet 50% pot (3.5BB)",
                    turn: "Bet 66% pot (约10BB)",
                    river: "Bet 75% pot (约37BB)"
                },
                credibility: 75,
                story: "你代表: KQ (两对), K9 (两对), 或QQ/99 (set在转牌hit)。这是最标准的'我有强牌想要3街价值'的story。",
                pros: [
                    "Story非常标准和可信",
                    "Sizing progressive (50% → 66% → 75%) 符合value betting pattern",
                    "适合对抗thinking players",
                    "即使被call，对手会尊重你的range"
                ],
                cons: [
                    "太标准 = 对手可能suspect",
                    "如果对手是calling station，会被call down",
                    "需要对手有fold equity (他没有强牌)"
                ],
                best_vs: ['intermediate', 'advanced'],
                best_vs_description: "最适合对抗中级到高级玩家，他们会尊重triple barrel，但不会over-think",
                success_rate: "对抗TAG: 55-60%"
            },
            {
                name: "Line 2: Delayed Aggression (Check Flop)",
                rating: 5,
                actions: {
                    flop: "Check (放弃c-bet)",
                    turn: "如果对手check，Bet 60% pot",
                    river: "Bet 85% pot (较大sizing)"
                },
                credibility: 85,
                story: "你代表: 88-JJ (中对希望控池，但转牌Q让你improve到顶对QQ)，或慢打的AA。Flop check显示'弱点'，转牌/河牌aggression更可信。",
                pros: [
                    "极高可信度 - flop check显示你不是强牌",
                    "转牌bet符合'我improve了'的story",
                    "对手更可能相信你击中了Q",
                    "河牌大sizing因为你'hit'显得合理"
                ],
                cons: [
                    "如果对手翻牌bet，你失去主动权",
                    "给了对手免费看牌的机会",
                    "如果转牌对手bet，你的line更复杂"
                ],
                best_vs: ['advanced', 'master'],
                best_vs_description: "最适合对抗高级玩家，他们会read into你的flop check，认为你是中等牌力后来improve",
                success_rate: "对抗高手: 65-70% (因为story太可信)"
            },
            {
                name: "Line 3: Small Triple Barrel (Inducing)",
                rating: 3,
                actions: {
                    flop: "Bet 33% pot (2.3BB)",
                    turn: "Bet 40% pot (约6BB)",
                    river: "Bet 50% pot (约25BB)"
                },
                credibility: 60,
                story: "你代表: 你有KK/QQ，用小sizing诱导对手继续，希望build pot但不吓跑他。",
                pros: [
                    "小sizing看起来像'我想你call'",
                    "可能诱导对手用边缘牌call或bluff raise",
                    "风险较低 - 即使失败损失也少"
                ],
                cons: [
                    "小sizing给对手好的pot odds",
                    "Calling stations会舒服地call down",
                    "总投入少 = 赢的也少",
                    "可能显得suspicious (为什么bet这么小？)"
                ],
                best_vs: ['intermediate'],
                best_vs_description: "适合对抗会over-think的中级玩家，他们可能suspect你的小bet并fold",
                success_rate: "对抗中级TAG: 45-50%"
            },
            {
                name: "Line 4: Overbet River (Polarized)",
                rating: 4,
                actions: {
                    flop: "Bet 50% pot",
                    turn: "Bet 60% pot",
                    river: "Bet 150% pot (超池下注)"
                },
                credibility: 70,
                story: "你代表: 你有nuts (set或两对)，河牌overbet是为了最大化value。这个sizing太极端，必须是nuts或pure bluff - 你选择pure bluff。",
                pros: [
                    "Overbet让对手面临巨大压力",
                    "Polarized sizing - 看起来像nuts",
                    "即使对手怀疑，pot odds很差(需要40%+ equity)",
                    "对抗好的players效果好(他们知道你必须balanced)"
                ],
                cons: [
                    "风险巨大 - 如果被call损失最大",
                    "需要对手能够fold decent hands",
                    "如果对手有顶对+，很可能call",
                    "太aggressive可能显得desperate"
                ],
                best_vs: ['advanced', 'master'],
                best_vs_description: "最适合对抗高级玩家，他们理解polarized betting，知道你的range包含nuts，更难call",
                success_rate: "对抗高手: 50-55% (高风险高回报)"
            },
            {
                name: "Line 5: Give Up (Optimal vs Certain Opponents)",
                rating: 5,
                actions: {
                    flop: "Bet 50% pot",
                    turn: "Bet 60% pot",
                    river: "Check-fold (放弃bluff)"
                },
                credibility: 90,
                story: "你代表: 你有顶对但kicker不好，或中对。你希望便宜showdown，不想再投入。",
                pros: [
                    "对抗calling stations这是唯一正确play",
                    "止损 - 已经投入13.5BB，不继续亏损",
                    "如果对手check behind，可能赢(他也错过)",
                    "保持平衡 - 不是所有miss都要triple barrel"
                ],
                cons: [
                    "放弃了赢下底池的机会",
                    "如果对手也在bluff，你本可以偷到"
                ],
                best_vs: ['beginner'],
                best_vs_description: "最适合对抗鱼和calling stations，他们不会fold，继续bluff是亏损的",
                success_rate: "对抗鱼: 95% (最小化损失)"
            }
        ],
        
        world_class_insight: "💡 世界级洞察: 同一手牌(A5错过同花)有5种完全不同的lines，每种针对不同对手。新手只会'我miss了就fold'。中级玩家知道'我可以bluff'。高手选择'哪种bluff line最适合这个对手'。这就是line construction的威力 - 不是'是否bluff'，而是'如何bluff'。"
    },

    // 中等对子
    medium_pair: {
        title: "案例: 顶对中等kicker的困境",
        situation: {
            structure: "8人桌 300BB",
            hand: "A♥ 9♣ (顶对中kicker)",
            board: "Flop: A♠ J♦ 5♣ → Turn: 8♥ → River: 3♦",
            pot: "河牌前45BB",
            context: "你CO open 3BB，BTN call。你击中顶对，但kicker一般。BTN是solid TAG。"
        },
        challenge: "你有顶对，但不是nuts。面对TAG，如何平衡'获取价值'和'控制底池'？不同line对应不同风险。",
        
        lines: [
            {
                name: "Line 1: Three Streets Value (Aggressive)",
                rating: 3,
                actions: {
                    flop: "Bet 66% pot (约4.5BB)",
                    turn: "Bet 66% pot (约11BB)",
                    river: "Bet 60% pot (约27BB)"
                },
                credibility: 70,
                story: "你代表: AK, AQ, AJ (强顶对或两对)。你认为你的A9是strong enough打3街value。",
                pros: [
                    "最大化从弱Ax获得的价值",
                    "不给对手免费看牌",
                    "主动权在你手上"
                ],
                cons: [
                    "风险巨大 - 如果对手有AK/AQ/AJ，你在给钱",
                    "总投入42.5BB，对抗TAG的3街call range你可能落后",
                    "深筹码reverse implied odds严重",
                    "对手的call range通常beat你"
                ],
                best_vs: ['beginner'],
                best_vs_description: "只适合对抗会用弱Ax call 3街的鱼，对TAG是灾难",
                success_rate: "对抗TAG: 30-35% (负EV)"
            },
            {
                name: "Line 2: Bet-Bet-Check (Cautious Value)",
                rating: 5,
                actions: {
                    flop: "Bet 50% pot (3.5BB)",
                    turn: "Bet 55% pot (约8BB)",
                    river: "Check (pot control + induce bluff)"
                },
                credibility: 90,
                story: "你代表: 中等强度顶对(AT, A9)，希望打2街价值但河牌控池。或你有set/两对在慢打。",
                pros: [
                    "最优化的平衡策略",
                    "从弱Ax获取2街价值",
                    "河牌check保护你不被better Ax打爆",
                    "可能诱导对手river bluff",
                    "深筹码下风险可控"
                ],
                cons: [
                    "河牌放弃了从极弱牌获取价值",
                    "如果对手check behind，可能错过value"
                ],
                best_vs: ['intermediate', 'advanced', 'master'],
                best_vs_description: "最适合对抗所有level的TAG/LAG玩家，平衡性最好",
                success_rate: "对抗TAG: 80-85% (最优策略)"
            },
            {
                name: "Line 3: Check-Call Down (Defensive)",
                rating: 4,
                actions: {
                    flop: "Check (pot control)",
                    turn: "Check-call if bet",
                    river: "Check-call small to medium bet"
                },
                credibility: 75,
                story: "你代表: 弱Ax或中对，想要便宜showdown。也可能是slow play强牌。",
                pros: [
                    "极小化损失对抗better Ax",
                    "如果对手也check，可能便宜showdown赢",
                    "诱导对手bluff",
                    "深筹码最安全策略"
                ],
                cons: [
                    "放弃主动权",
                    "可能让对手免费击中",
                    "损失从弱牌的价值",
                    "显得非常被动"
                ],
                best_vs: ['advanced', 'master'],
                best_vs_description: "适合对抗非常aggressive的高手，或当你不确定你的位置时",
                success_rate: "对抗LAG: 70-75% (安全但保守)"
            },
            {
                name: "Line 4: Bet-Check-Call (Mixed)",
                rating: 4,
                actions: {
                    flop: "Bet 50% pot (3.5BB)",
                    turn: "Check (assess)",
                    river: "Check-call或check-fold根据sizing"
                },
                credibility: 80,
                story: "你代表: 你翻牌有牌但不确定现在位置，转牌check是因为不想build大底池。",
                pros: [
                    "灵活性高 - 可根据对手调整",
                    "转牌check后可以评估对手强度",
                    "如果对手check turn，river更简单",
                    "控制底池大小"
                ],
                cons: [
                    "策略不够清晰 - 容易给对手信息",
                    "转牌check可能让对手在river剥削你"
                ],
                best_vs: ['intermediate'],
                best_vs_description: "适合对抗中级玩家，需要根据他们的action调整",
                success_rate: "对抗中级TAG: 65-70%"
            },
            {
                name: "Line 5: Blocker Bet River (Advanced)",
                rating: 4,
                actions: {
                    flop: "Bet 50% pot",
                    turn: "Check",
                    river: "Bet 25-33% pot (blocker bet)"
                },
                credibility: 85,
                story: "你代表: 弱到中等价值(AT, 99, JJ)，希望bet small获取价值，同时防止对手大注bluff。",
                pros: [
                    "高级策略 - 很多玩家不理解blocker bet",
                    "从弱牌获取一点价值",
                    "防止对手大注bluff",
                    "如果对手raise，容易fold"
                ],
                cons: [
                    "需要对手理解这个concept",
                    "对抗鱼不work (他们会raise你)",
                    "小sizing = 小profit"
                ],
                best_vs: ['advanced', 'master'],
                best_vs_description: "最适合对抗理解blocker bet concept的高手",
                success_rate: "对抗高手: 70-75%"
            }
        ],
        
        world_class_insight: "💡 世界级洞察: 中等牌力(顶对弱kicker)是深筹码最难打的牌。新手要么over-value (3街value送钱)，要么under-value (总是check-fold)。世界级玩家的标志是'bet-bet-check' line - 既获取价值又控制风险。这需要极强的自律：即使你有顶对，河牌也要能check，甚至fold to bet。"
    },

    // 怪兽牌
    monster: {
        title: "案例: Set的多种价值提取方式",
        situation: {
            structure: "8人桌 300BB",
            hand: "8♠ 8♣ (Set on flop)",
            board: "Flop: K♥ 8♦ 3♣ → Turn: Q♠ → River: 4♥",
            pot: "河牌前30BB",
            context: "你BTN call了CO的open。翻牌击中set (暗三)。CO是solid player。"
        },
        challenge: "你有极强牌(set)，如何构建不同lines来从不同对手手牌中提取最大价值？Fast play还是slow play？",
        
        lines: [
            {
                name: "Line 1: Fast Play (Immediate Aggression)",
                rating: 4,
                actions: {
                    flop: "Raise CO's c-bet to 3x",
                    turn: "Bet 75% pot",
                    river: "Bet 85% pot or overbet"
                },
                credibility: 80,
                story: "你代表: KK (set), K8 (两对), 或strong Kx想要保护。Fast play显示'我有非常强的牌'。",
                pros: [
                    "立即build pot - 不给对手免费看牌",
                    "保护equity对抗draws (如果board wet)",
                    "从Kx获取3街value",
                    "对手可能认为你在bluff raise"
                ],
                cons: [
                    "对手会fold大部分边缘牌",
                    "太aggressive可能只留下better hands",
                    "损失从对手可能improve的牌的价值"
                ],
                best_vs: ['beginner', 'intermediate'],
                best_vs_description: "适合对抗会pay off的鱼和中级玩家，他们可能用Kx call down",
                success_rate: "对抗会付钱的对手: 75-80%"
            },
            {
                name: "Line 2: Slow Play (Trap)",
                rating: 5,
                actions: {
                    flop: "Call CO's c-bet",
                    turn: "Check (让对手继续bet)",
                    river: "Check-raise huge或lead bet large"
                },
                credibility: 95,
                story: "你代表: 你在翻牌有弱Kx/QQ/JJ在控池，转牌Q帮到你（improve到两对QQ或K在慢打）。",
                pros: [
                    "极高的欺骗性 - 对手完全想不到你有set",
                    "让对手继续bluff或build pot",
                    "转牌Q可能帮到对手，他会投入更多",
                    "河牌check-raise毁灭性 - 对手已投入太多",
                    "对抗aggressive对手最赚钱"
                ],
                cons: [
                    "给了对手免费看牌",
                    "如果对手check turn和river，损失价值",
                    "如果board完成draws，可能被反超(小风险)"
                ],
                best_vs: ['intermediate', 'advanced', 'master'],
                best_vs_description: "最适合对抗aggressive TAG/LAG，他们会持续fire，你在trap",
                success_rate: "对抗LAG: 85-90% (最优策略vs aggressive)"
            },
            {
                name: "Line 3: Call-Call-Lead (Deceptive)",
                rating: 5,
                actions: {
                    flop: "Call CO's c-bet",
                    turn: "Call CO's barrel",
                    river: "Lead bet 75% pot (突然aggression)"
                },
                credibility: 90,
                story: "你代表: 你翻牌和转牌都在float或有弱牌，河牌brick后你决定bluff steal。或你有两对刚完成。",
                pros: [
                    "极具欺骗性的line",
                    "对手会困惑 - 你的river lead很unusual",
                    "可能诱导对手用顶对level themselves (认为你bluff)",
                    "对抗thinking players效果极佳"
                ],
                cons: [
                    "如果对手river check，你的lead看起来suspicious",
                    "需要对手会在river action",
                    "复杂line可能搞砸"
                ],
                best_vs: ['advanced', 'master'],
                best_vs_description: "最适合对抗高手，他们会over-think你的unusual line并pay you off",
                success_rate: "对抗高手: 80-85%"
            },
            {
                name: "Line 4: Check-Raise Flop (Semi-Fast)",
                rating: 4,
                actions: {
                    flop: "Check-raise CO's c-bet",
                    turn: "Bet 66% pot",
                    river: "Bet 75% pot"
                },
                credibility: 85,
                story: "你代表: KK, K8 (两对), 或strong draw在semi-bluff。",
                pros: [
                    "立即build pot",
                    "Semi-deceptive - 对手可能认为你在bluff",
                    "保持主动权",
                    "对手如果call flop check-raise，他被commit"
                ],
                cons: [
                    "可能吓走太多hands",
                    "对手可能会fold所有非-strong hands",
                    "Check-raise通常代表极强range"
                ],
                best_vs: ['intermediate'],
                best_vs_description: "适合对抗中级玩家，他们可能会call check-raise with Kx",
                success_rate: "对抗中级TAG: 70-75%"
            },
            {
                name: "Line 5: Small Bet Inducing (Advanced)",
                rating: 4,
                actions: {
                    flop: "Raise CO's c-bet small (2-2.2x)",
                    turn: "Bet 50% pot (small)",
                    river: "Bet 60% pot (medium)"
                },
                credibility: 80,
                story: "你代表: 你有Kx或QQ/JJ，用小raise和小bets希望对手继续。你想build pot但不想吓跑他。",
                pros: [
                    "小sizing诱导对手继续",
                    "从边缘牌(Jx, Qx, flush draws)获取更多价值",
                    "对手可能认为你在weak raise/bet并bluff raise你"
                ],
                cons: [
                    "小sizing = profit per street less",
                    "总提取可能低于大sizing from strong hands",
                    "对手可能suspect你的small sizing"
                ],
                best_vs: ['intermediate', 'advanced'],
                best_vs_description: "适合对抗会over-think small sizing的中高级玩家",
                success_rate: "对抗中高级: 75-80%"
            }
        ],
        
        world_class_insight: "💡 世界级洞察: 同样是set(暗三)，世界级玩家有5种完全不同的玩法。选择哪种基于'对手的倾向'。对抗passive player要fast play (他们不会持续投入)。对抗aggressive player要slow play/trap (让他们hang themselves)。对抗thinking player用deceptive lines (让他们over-think并犯错)。这就是'adaptive strategy' - 根据对手动态调整。"
    },

    // 完全空气
    air: {
        title: "案例: Complete Air的勇敢bluff",
        situation: {
            structure: "8人桌 300BB vs 高手",
            hand: "7♣ 6♣ (complete air by river)",
            board: "Flop: A♠ K♦ Q♠ → Turn: 3♥ → River: 9♣",
            pot: "河牌前55BB",
            context: "你CO open，高手BTN 3-bet，你call。翻牌miss所有，但你有position。高手是tight aggressive player。"
        },
        challenge: "你有complete air，而且对手3-bet了你。但牌面很scary，对手也可能miss。如何用position和range advantage构建bluff？",
        
        lines: [
            {
                name: "Line 1: Immediate Fold (Conservative)",
                rating: 2,
                actions: {
                    flop: "Fold to c-bet",
                    turn: "N/A",
                    river: "N/A"
                },
                credibility: 100,
                story: "你承认defeat，认为对手3-bet range在这个board太强。",
                pros: [
                    "止损 - 不继续投入",
                    "对抗有强牌的对手避免更大损失",
                    "保守策略永远不会错太多"
                ],
                cons: [
                    "放弃了赢底池的所有机会",
                    "对手会exploit你的over-folding",
                    "未利用position优势",
                    "7BB的pot就这样没了"
                ],
                best_vs: ['beginner'],
                best_vs_description: "只对抗你确定对手有牌时，否则太弱",
                success_rate: "N/A (保守选择)"
            },
            {
                name: "Line 2: Float Flop → Steal Turn (Position)",
                rating: 5,
                actions: {
                    flop: "Call c-bet (float with position)",
                    turn: "当对手check，Bet 65% pot (steal)",
                    river: "根据turn结果决定"
                },
                credibility: 90,
                story: "翻牌你代表: AQ, KQ, QJ (顶对或两对)在flat call。转牌对手check显示weakness，你代表'我有顶对或更好'。",
                pros: [
                    "利用position - 看到对手check才bet",
                    "高成功率 - 对手check turn通常代表弱",
                    "如果对手flop check，你可以steal更便宜",
                    "Turn bet有credibility (你call了c-bet)"
                ],
                cons: [
                    "如果对手double barrel turn，你必须fold",
                    "花费1个c-bet的钱来float"
                ],
                best_vs: ['intermediate', 'advanced'],
                best_vs_description: "最适合对抗solid TAG，他们如果没牌会在turn放慢",
                success_rate: "对抗TAG: 65-70%"
            },
            {
                name: "Line 3: Raise Flop C-Bet (Aggressive)",
                rating: 4,
                actions: {
                    flop: "Raise c-bet to 2.8-3x (aggression)",
                    turn: "If called, bet 60-70% pot",
                    river: "如果仍被call，大概率give up"
                },
                credibility: 75,
                story: "你代表: AK, AQ (顶两对或顶对顶kicker)，或AA/KK/QQ在re-raise for value/protection。",
                pros: [
                    "立即施加巨大压力",
                    "可能直接赢下底池",
                    "如果对手fold，profit最大",
                    "显示'strength'防止对手继续"
                ],
                cons: [
                    "高风险 - 投入很多with air",
                    "对手如果有真牌会call或re-raise",
                    "如果被call，你处境困难",
                    "对抗calling range你almost drawing dead"
                ],
                best_vs: ['intermediate'],
                best_vs_description: "适合对抗能fold的中级玩家，不适合对抗太tight或太loose的对手",
                success_rate: "对抗中级TAG: 50-55%"
            },
            {
                name: "Line 4: Triple Float → River Bluff (Patient)",
                rating: 4,
                actions: {
                    flop: "Call c-bet",
                    turn: "Call barrel (if any)",
                    river: "If checked to you, Bet 75% pot"
                },
                credibility: 85,
                story: "你代表: 你翻牌turn都在call with pair或draw，河牌brick后你认为你的pair good，或河牌帮到你。",
                pros: [
                    "最有耐心的line",
                    "河牌位置bluff最可信",
                    "对手如果check river，通常代表give up",
                    "你有整个hand的信息做决定"
                ],
                cons: [
                    "成本最高 - 要call 2条街",
                    "需要对手check river给你机会",
                    "如果对手3-barrel，损失巨大"
                ],
                best_vs: ['advanced', 'master'],
                best_vs_description: "适合对抗会放慢的高手，他们不会无脑3-barrel",
                success_rate: "对抗高手: 60-65%"
            },
            {
                name: "Line 5: Donk Bet Turn (Advanced Line)",
                rating: 3,
                actions: {
                    flop: "Call c-bet",
                    turn: "Lead bet (donk) 50% pot (unusual line)",
                    river: "根据turn结果决定"
                },
                credibility: 80,
                story: "你代表: 你翻牌call了with draw或弱对，转牌击中了某些东西(two pair? set?),所以lead bet而非check-call。",
                pros: [
                    "非常unusual line - 对手会confused",
                    "可能拿到fold from怀疑你真hit的对手",
                    "如果对手fold，你赢了",
                    "Advanced line显示skill"
                ],
                cons: [
                    "Donk bet通常看起来suspicious",
                    "对抗好玩家可能被call light",
                    "复杂line容易出错",
                    "需要对手会respect你的donk bet"
                ],
                best_vs: ['advanced'],
                best_vs_description: "只对抗会respect unusual lines的高级玩家",
                success_rate: "对抗高级玩家: 55-60%"
            }
        ],
        
        world_class_insight: "💡 世界级洞察: 用complete air bluff是poker最难的技能。关键不是'勇气'，而是'信息和时机'。Line 2 (Float → Steal Turn)是世界级标准 - 你利用position获取信息(对手check = weak)，然后在optimal timing出击。Triple barrel (line 3)看似aggressive，但实际上information less，成功率更低。记住: 好的bluff是'informed bluff'，不是'blind aggression'。"
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LINE_SCENARIOS };
}

