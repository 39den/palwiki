#!/bin/bash
# Пересборка сайта из /workspace/palwiki и публикация на GitHub Pages. ./build.sh --no-deploy — только сборка.
# 21.10 live-hotfix worker: build phase under flock /tmp/palsite_build.lock (shared with preview.sh, both regenerate docs/);
# tested snapshot /workspace/hotfix/live_site is what gets deployed (ghp-import), not a fresh untested gh-deploy rebuild.
set -e; cd /workspace/palsite; export PATH=$HOME/.local/bin:$PATH
OUT=/workspace/hotfix/live_site
exec 9>/tmp/palsite_build.lock; echo "waiting for build lock"; flock 9; echo "lock taken $(date +%T)"
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
for f in smart site features ui2 ui3 ai; do tools/node_modules/.bin/esbuild site/assets/$f.js --target=es2018,safari15,firefox100,chrome90 --outfile=site/assets/$f.js --allow-overwrite --log-level=error || exit 1; done
(cd tools && npx postcss ../site/assets/extra.css --use autoprefixer --no-map -o ../site/assets/extra.css) || exit 1
python3 colormix_fallback.py site/assets/extra.css
rm -rf $OUT.new && cp -r site $OUT.new && rm -rf $OUT && mv $OUT.new $OUT
git add -A && (git commit -qm "update $(date -u +%F_%H%M)" || true)
flock -u 9; echo "lock released $(date +%T)"
# browser matrix on the snapshot
PORT=8901; pkill -f "http.server $PORT" 2>/dev/null || true; (cd $OUT && python3 -m http.server $PORT >/dev/null 2>&1 & echo $! > /tmp/srv.pid); sleep 1
MX=0
if [ -z "$SKIP_MATRIX" ]; then timeout 900 python3 matrix.py http://localhost:$PORT/ | tee matrix.log; MX=${PIPESTATUS[0]}; timeout 300 python3 hm_test.py http://localhost:$PORT/ /workspace/palsite/shots/r9/ after > hm_test.log 2>&1 || MX=1; timeout 300 python3 map_test.py http://localhost:$PORT/ /workspace/palsite/shots/r9/ after > map_test.log 2>&1 || MX=1; tail -1 hm_test.log; tail -1 map_test.log; fi
kill $(cat /tmp/srv.pid) 2>/dev/null || true
[ "$MX" = "0" ] || { echo "MATRIX FAILED"; exit 1; }
[ "$1" = "--no-deploy" ] && exit 0
if [ -z "$NO_GATE" ]; then (cd $OUT && python3 -m http.server 8931 >/dev/null 2>&1 & echo $! > /tmp/gate.pid); sleep 1; set +e; (cd /workspace/audit2026/deep && timeout 1500 python3 deep_audit.py --base http://localhost:8931/ --fail-on P0 --pages sample --concurrency 2 --serial --out /workspace/palsite/gate_out > /workspace/palsite/gate.log 2>&1); G=$?; set -e; kill $(cat /tmp/gate.pid) 2>/dev/null; tail -3 gate.log; [ "$G" = "0" ] || { echo "DEEP GATE FAILED"; exit 1; }; fi
git push -q origin HEAD:main
ghp-import -n -p -f -b gh-pages -r origin -m "Deployed $(git rev-parse --short HEAD) (live hotfix, tested snapshot)" $OUT
echo "DEPLOYED $(date +%T)"
