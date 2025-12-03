@echo off
chcp 65001 >nul
cd /d D:\user\Texas

echo 正在提交MDF修正...
git add deep_stack_lag_trainer.js
git commit -m "修正MDF计算v2.3:正确值45%% (用户修正)" -m "Open 2.5BB vs 3-Bet 7.5BB, 底池4BB, Call 5BB, MDF=4/9=44%%"
git push origin main

echo.
echo ========================================
echo ✓ MDF修正v2.3已推送到GitHub！
echo.
echo 访问链接：
echo https://github.com/joywenxu100/poker-trainer
echo.
echo 训练器链接：
echo https://joywenxu100.github.io/poker-trainer/deep_stack_lag_trainer.html
echo ========================================
pause

