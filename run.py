# -*- coding: utf-8 -*-
import sys
import os

# 设置工作目录为脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# 执行主脚本
exec(open('generate_poker_checklist.py', encoding='utf-8').read())

