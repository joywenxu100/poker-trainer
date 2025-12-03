@echo off
cd /d D:\user\Texas
git rebase --abort
git reset --soft HEAD~2
git commit -m "v7.0.0: Full code review and bug fixes - all versions unified to v7"
git push origin main --force
pause

