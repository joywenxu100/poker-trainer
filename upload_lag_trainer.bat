@echo off
chcp 65001 >nul
echo ========================================
echo 深筹码松凶训练器 - 上传到GitHub
echo ========================================
echo.

cd /d D:\user\Texas

echo [1/4] 添加文件到Git...
git add deep_stack_lag_trainer.html
git add deep_stack_lag_trainer.js
git add index.html

echo.
echo [2/4] 提交更改...
git commit -m "新增：深筹码松凶玩家训练器 - 300BB+ LAG完整体系

- 新增 deep_stack_lag_trainer.html - 松凶玩家训练器主页面
- 新增 deep_stack_lag_trainer.js - 完整范围数据和训练逻辑
- 更新 index.html - 添加新训练器到导航（核心训练区）

功能特点：
✓ 完整的松凶翻前范围体系（Open/3B/4B/5B）
✓ 针对300BB+深筹码 + Straddle 4BB + Anti 1BB
✓ 4大训练模式：范围学习、记忆辅助、实战测试、策略指南
✓ 专业级记忆法和快速决策训练
✓ 对手类型调整和保险功能考虑

目标：训练世界级松凶玩家，最大化百手盈率"

echo.
echo [3/4] 推送到GitHub...
git push origin main

echo.
echo [4/4] 完成！
echo ========================================
echo ✓ 深筹码松凶训练器已成功上传到GitHub
echo ========================================
echo.
pause

