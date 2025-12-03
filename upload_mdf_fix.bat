@echo off
chcp 65001 >nul
cd /d D:\user\Texas

git commit -m "修正：MDF计算公式 v2.3 - 用户修正为正确的45%% MDF" -m "修正MDF理论计算（用户发现的错误）：" -m "" -m "错误值：71.4%% MDF" -m "正确值：约45%% MDF" -m "" -m "正确计算：" -m "Open 2.5BB, 对手3-Bet到7.5BB" -m "底池 = 4BB, 你需要Call = 5BB" -m "MDF = 4/(4+5) = 44%%" -m "" -m "实战：15%% 4-Bet + 30%% Call = 45%%防守"

git push origin main

echo.
echo ========================================
echo ✓ MDF修正已推送到GitHub
echo ========================================
echo.
pause

