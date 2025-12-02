// 翻前范围数据完整性检查脚本
// 用于验证所有范围的逻辑性和完整性

const rangeChecker = {
    // 检查Open Raise范围
    checkOpenRaise: function() {
        console.log("=== 检查Open Raise范围 ===");
        const positions = ['UTG', 'UTG1', 'LJ', 'HJ', 'CO', 'BTN', 'SB'];
        const issues = [];
        
        positions.forEach(pos => {
            const data = lagRanges.openRaise[pos];
            if (!data || typeof data.range === 'string') {
                console.log(`✓ ${pos}: 防守位（正常）`);
                return;
            }
            
            // 检查范围是否为空
            if (!Array.isArray(data.range) || data.range.length === 0) {
                issues.push(`❌ ${pos}: 范围为空`);
                return;
            }
            
            // 检查是否包含基本强牌
            const mustHave = ['AA', 'KK', 'QQ', 'AKs', 'AKo'];
            const missing = mustHave.filter(h => !data.range.includes(h));
            if (missing.length > 0) {
                issues.push(`⚠️ ${pos}: 缺少强牌 ${missing.join(', ')}`);
            }
            
            console.log(`✓ ${pos}: ${data.range.length}个组合, ${data.percentage}`);
        });
        
        if (issues.length > 0) {
            console.error("发现问题：", issues);
        } else {
            console.log("✅ Open Raise范围全部正确");
        }
        return issues;
    },
    
    // 检查3-Bet范围
    check3Bet: function() {
        console.log("\n=== 检查3-Bet范围 ===");
        const positions = ['BTN', 'CO', 'HJ', 'LJ', 'SB', 'BB'];
        const vsPositions = {
            'BTN': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsSB'],
            'CO': ['vsUTG', 'vsLJ', 'vsHJ'],
            'HJ': ['vsUTG', 'vsLJ'],
            'LJ': ['vsUTG'],
            'SB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN'],
            'BB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN', 'vsSB']
        };
        
        const issues = [];
        let totalCombos = 0;
        
        positions.forEach(pos => {
            if (!lagRanges.threeBet[pos]) {
                issues.push(`❌ ${pos}: 完全缺失`);
                return;
            }
            
            const expected = vsPositions[pos] || [];
            const actual = Object.keys(lagRanges.threeBet[pos]);
            
            expected.forEach(vsPos => {
                if (!lagRanges.threeBet[pos][vsPos]) {
                    issues.push(`❌ ${pos} ${vsPos}: 缺失`);
                } else {
                    const range = lagRanges.threeBet[pos][vsPos].range;
                    if (!Array.isArray(range) || range.length === 0) {
                        issues.push(`❌ ${pos} ${vsPos}: 范围为空`);
                    } else {
                        totalCombos++;
                        console.log(`✓ ${pos} ${vsPos}: ${range.length}个组合, ${lagRanges.threeBet[pos][vsPos].percentage}`);
                    }
                }
            });
        });
        
        console.log(`总计：${totalCombos}个3-Bet组合`);
        
        if (issues.length > 0) {
            console.error("发现问题：", issues);
        } else {
            console.log("✅ 3-Bet范围全部完整");
        }
        return issues;
    },
    
    // 检查Call Open范围
    checkCallOpen: function() {
        console.log("\n=== 检查Call Open范围 ===");
        const positions = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'LJ'];
        const vsPositions = {
            'BB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN', 'vsSB'],
            'SB': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO', 'vsBTN'],
            'BTN': ['vsUTG', 'vsLJ', 'vsHJ', 'vsCO'],
            'CO': ['vsUTG', 'vsLJ', 'vsHJ'],
            'HJ': ['vsUTG', 'vsLJ'],
            'LJ': ['vsUTG']
        };
        
        const issues = [];
        let totalCombos = 0;
        
        positions.forEach(pos => {
            if (!lagRanges.callOpen[pos]) {
                issues.push(`❌ ${pos}: 完全缺失`);
                return;
            }
            
            const expected = vsPositions[pos] || [];
            
            expected.forEach(vsPos => {
                if (!lagRanges.callOpen[pos][vsPos]) {
                    issues.push(`❌ ${pos} ${vsPos}: 缺失`);
                } else {
                    const range = lagRanges.callOpen[pos][vsPos].range;
                    if (!Array.isArray(range) || range.length === 0) {
                        issues.push(`❌ ${pos} ${vsPos}: 范围为空`);
                    } else {
                        totalCombos++;
                        console.log(`✓ ${pos} ${vsPos}: ${range.length}个组合, ${lagRanges.callOpen[pos][vsPos].percentage}`);
                    }
                }
            });
        });
        
        console.log(`总计：${totalCombos}个Call Open组合`);
        
        if (issues.length > 0) {
            console.error("发现问题：", issues);
        } else {
            console.log("✅ Call Open范围全部完整");
        }
        return issues;
    },
    
    // 运行所有检查
    runAll: function() {
        console.log("🔍 开始完整性检查...\n");
        const issues1 = this.checkOpenRaise();
        const issues2 = this.check3Bet();
        const issues3 = this.checkCallOpen();
        
        const totalIssues = issues1.length + issues2.length + issues3.length;
        
        console.log("\n" + "=".repeat(50));
        if (totalIssues === 0) {
            console.log("🎉 所有范围数据100%完整！");
        } else {
            console.log(`⚠️ 发现 ${totalIssues} 个问题需要修复`);
        }
        console.log("=".repeat(50));
        
        return totalIssues === 0;
    }
};

// 在浏览器控制台运行：rangeChecker.runAll()

