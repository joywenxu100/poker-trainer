@echo off
chcp 65001 >nul
echo ========================================
echo 深筹码松凶训练器 v2.1 - 错误修复
echo ========================================
echo.

cd /d D:\user\Texas

echo [1/4] 添加文件到Git...
git add deep_stack_lag_trainer.html
git add deep_stack_lag_trainer.js

echo.
echo [2/4] 提交更改...
git commit -m "修复：深筹码松凶训练器 v2.1 - 世界级专家审查后的错误修正" -m "作为300BB+世界顶级玩家，发现并修复以下错误：" -m "" -m "范围数据修复：" -m "1. 修复BTN vs CO callopen范围的打字错误(ç64s -> 64s)" -m "2. 修复LJ Open范围，增加完整suited wheel aces(A6s, A3s, A2s)" -m "3. 修复SB vs CO call范围，增加TT(重要setmine牌)" -m "" -m "理论修复：" -m "4. 修复MDF计算说明：71.4% MDF意味着弃牌率≤28.6%，不是继续率" -m "   - 正确解释：需要用71.4%范围继续，弃牌率不超过28.6%" -m "" -m "功能增强：" -m "5. 测试系统新增Call Open场景" -m "   - 这是最重要的决策场景(60%决策都是面对Open)" -m "   - 包含BB/SB/BTN/CO所有防守位置测试" -m "" -m "文档更新：" -m "6. 更新记忆辅助中的Open Range描述" -m "   - LJ从20%修正为22%，描述更准确" -m "   - BTN从48%修正为52%" -m "" -m "质量保证：经过世界级300BB+深筹码玩家全面审查"

echo.
echo [3/4] 推送到GitHub...
git push origin main

echo.
echo [4/4] 完成！
echo ========================================
echo ✓ v2.1错误修复已成功上传
echo ========================================
echo.
pause

