#!/bin/bash
# Пересборка сайта из /workspace/palwiki и публикация на GitHub Pages. ./build.sh --no-deploy — только сборка.
set -e; cd /workspace/palsite; export PATH=$HOME/.local/bin:$PATH
python3 sitecards.py && python3 prep.py
for f in static/*.js; do node --check $f || { echo "JS SYNTAX $f"; exit 1; }; done
node test_smart.js | tail -1
mkdocs build --strict 2>&1 | grep -E "WARNING|ERROR|built|Abort" | tee build.log
grep -q "Documentation built" build.log || { echo "BUILD FAILED"; exit 1; }
python3 art_alpha_check.py || { echo "OPAQUE ART"; exit 1; }
python3 wall_lint.py || { echo "WALL LINT FAILED"; exit 1; }
python3 check_leaks.py || { echo "LEAK CHECK FAILED"; exit 1; }
python3 grammar_lint.py || { echo "GRAMMAR LINT FAILED"; exit 1; }
python3 table_lint.py || { echo "TABLE LINT FAILED"; exit 1; }
python3 credits_lint.py || { echo "CREDITS LINT FAILED"; exit 1; }
python3 link_check.py || { echo "LINK CHECK FAILED"; exit 1; }
python3 hab_test.py || { echo "HABITAT TEST FAILED"; exit 1; }
# compat: transpile our JS to es2018/safari15, autoprefix CSS
for f in smart site features ui2 ui3; do tools/node_modules/.bin/esbuild site/assets/$f.js --target=es2018,safari15,firefox100,chrome90 --outfile=site/assets/$f.js --allow-overwrite --log-level=error || exit 1; done
(cd tools && npx postcss ../site/assets/extra.css --use autoprefixer --no-map -o ../site/assets/extra.css) || exit 1
python3 colormix_fallback.py site/assets/extra.css
# browser matrix on local copy
PORT=8901; (cd site && python3 -m http.server $PORT >/dev/null 2>&1 & echo $! > /tmp/srv.pid); sleep 1
timeout 900 python3 matrix.py http://localhost:$PORT/ | tee matrix.log; MX=${PIPESTATUS[0]}; timeout 300 python3 hm_test.py http://localhost:$PORT/ /workspace/palsite/shots/r9/ after > hm_test.log 2>&1 || MX=1; timeout 300 python3 map_test.py http://localhost:$PORT/ /workspace/palsite/shots/r9/ after > map_test.log 2>&1 || MX=1; tail -1 hm_test.log; tail -1 map_test.log; kill $(cat /tmp/srv.pid) 2>/dev/null || true
[ "$MX" = "0" ] || [ "$SKIP_MATRIX" = "1" ] || { echo "MATRIX FAILED"; exit 1; }
[ "$1" = "--no-deploy" ] && exit 0
git add -A && (git commit -qm "update $(date -u +%F_%H%M)" || true) && git push -q origin HEAD:main
mkdocs gh-deploy --force -q
