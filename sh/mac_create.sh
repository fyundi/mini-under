#!/usr/bin/env bash

cd `dirname $0`   # 当前目录
cd ..

python3 assets/base/resConfigTool.py ./assets/resources ./assets/script/plugin/ResourcesPath.js emo1 emo2
