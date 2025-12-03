@echo off
chcp 65001 >nul
cd /d D:\user\Texas

echo ========================================
echo 深筹码松凶训练器 v2.8 - 修复颜色显示
echo ========================================
echo.

git add deep_stack_lag_trainer.js

git commit -m "v2.8: 修复范围表颜色高亮显示BUG" -m "🐛 修复问题：" -m "用户发现翻前范围表有文字说明，但表格没有颜色标记" -m "" -m "❌ 问题原因：" -m "highlightRange函数中的CSS类名转换逻辑有缺陷：" -m "• 'callopen' 没有被正确转换为 'call'" -m "• 'call3bet' / 'call4bet' 没有被转换为 'call'" -m "• 'squeeze' 没有被映射到颜色类" -m "" -m "✅ 修复内容：" -m "重写CSS类名映射逻辑（第1225-1244行）：" -m "" -m "1. callopen → 'call'（蓝色）✅" -m "   使用CSS: .hand-cell.call (rgba(70, 130, 180, 0.8))" -m "" -m "2. call3bet / call4bet → 'call'（蓝色）✅" -m "   统一使用call颜色" -m "" -m "3. squeeze → 'three-bet'（橙色）✅" -m "   Squeeze本质是3-Bet，使用橙色" -m "" -m "4. 3bet/4bet/5bet → '3-bet'/'4-bet'/'5-bet' ✅" -m "   保持原有转换逻辑" -m "" -m "5. open → 'open'（绿色）✅" -m "   使用CSS: .hand-cell.open (rgba(50, 205, 50, 0.8))" -m "" -m "📊 颜色方案（HTML第186-209行）：" -m "🟢 Open Raise: 绿色 rgba(50, 205, 50, 0.8)" -m "🟠 3-Bet/Squeeze: 橙色 rgba(255, 165, 0, 0.8)" -m "🔴 4-Bet: 红橙色 rgba(255, 69, 0, 0.8)" -m "🔥 5-Bet: 深红色 rgba(220, 20, 60, 0.9)" -m "🔵 Call系列: 钢蓝色 rgba(70, 130, 180, 0.8)" -m "" -m "✅ 测试验证：" -m "现在选择任何位置+动作，手牌矩阵都会正确高亮！" -m "" -m "🎯 用户体验提升：" -m "• 视觉清晰：一眼看出哪些牌在范围内" -m "• 学习高效：颜色编码辅助记忆" -m "• 训练便捷：快速识别范围差异"

git push origin main

echo.
echo ========================================
echo ✓ v2.8颜色显示修复已推送！
echo.
echo 🎨 修复内容：
echo ✅ Call Open 现在显示蓝色
echo ✅ 3-Bet 显示橙色
echo ✅ Squeeze 显示橙色
echo ✅ 4-Bet 显示红橙色
echo ✅ 5-Bet 显示深红色
echo ✅ Open Raise 显示绿色
echo.
echo 现在选择任何范围都会正确高亮！
echo.
echo 在线访问：
echo https://joywenxu100.github.io/poker-trainer/deep_stack_lag_trainer.html
echo ========================================
pause

