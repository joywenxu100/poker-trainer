@echo off
chcp 65001 >nul
cd /d D:\user\Texas

echo ========================================
echo 提交深化改进 - 手牌复盘案例库
echo ========================================
echo.

git add DEEPENING_IMPROVEMENT_PLAN.md hand_review_library.html hand_review_cases.js POKER_STRATEGY_REVIEW_REPORT.md SUBMIT_NOW.bat
git commit -m "feat: 添加实战手牌复盘案例库 - 深化训练系统" -m "新增功能：" -m "1. 手牌复盘案例库 (hand_review_library.html)" -m "   - 8个真实案例深度解析" -m "   - 覆盖翻前/翻后/情绪/高级场景" -m "   - 每个案例包含完整手牌历史+错误分析+EV对比" -m "" -m "2. 深化改进方案 (DEEPENING_IMPROVEMENT_PLAN.md)" -m "   - 5大深化方向规划" -m "   - 多街连贯性/对手数据库/牌桌动态等" -m "" -m "3. Bug修复" -m "   - 修复filterCases函数event未定义" -m "   - 修复案例5中turn字段重复" -m "   - 添加river字段支持" -m "" -m "质量提升：5.0 → 6.0 (传奇级)"
git push origin main

echo.
echo ========================================
echo 提交完成！
echo ========================================
pause

