#!/bin/bash
# Пересборка сайта из /workspace/palwiki и публикация на GitHub Pages. ./build.sh --no-deploy — только сборка.
set -e; cd /workspace/palsite; export PATH=$HOME/.local/bin:$PATH
python3 sitecards.py && python3 prep.py
for f in static/*.js; do node --check $f || { echo "JS SYNTAX $f"; exit 1; }; done
node test_smart.js | tail -1
mkdocs build --strict 2>&1 | grep -E "WARNING|ERROR|built|Abort" | tee build.log
grep -q "Documentation built" build.log || { echo "BUILD FAILED"; exit 1; }
python3 check_leaks.py || { echo "LEAK CHECK FAILED"; exit 1; }
[ "$1" = "--no-deploy" ] && exit 0
git add -A && (git commit -qm "update $(date -u +%F_%H%M)" || true) && git push -q origin HEAD:main
mkdocs gh-deploy --force -q
