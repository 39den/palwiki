#!/bin/bash
# 21.10 redesign go-live (approved 16:22): ONE merged build = redesign (pp26 + ux50 layer + ITEMS26 items/food) + hotfix fixes in tree.
# build (under shared flock) -> lints -> ux50 overlay build (LIVE=1, site_url /palwiki/) -> snapshot -> deep gate P0 -> ghp-import to palwiki gh-pages.
set -e; cd /workspace/palsite; export PATH=$HOME/.local/bin:$PATH
OUT=/workspace/ux50/out_live
exec 9>/tmp/palsite_build.lock; echo "waiting lock"; flock 9; echo "lock $(date +%T)"
ITEMS26=1 python3 sitecards.py >/dev/null && ITEMS26=1 python3 prep.py > prep_live26.log 2>&1 || { echo "PREP FAILED"; tail -5 prep_live26.log; exit 1; }
[ "${WORKCALC:-0}" = 1 ] || sed -i 's#^  - Работа палов: 2_mehaniki/rabota.md#  \#WORKCALC off - Работа палов: 2_mehaniki/rabota.md#' mkdocs.yml
for f in static/*.js; do node --check $f || { echo "JS SYNTAX $f"; exit 1; }; done
mkdocs build --strict 2>&1 | grep -E "WARNING|ERROR|built|Abort" > build.log; grep -q "Documentation built" build.log || { echo "BUILD FAILED"; cat build.log | head; exit 1; }
for t in art_alpha_check wall_lint check_leaks grammar_lint table_lint credits_lint link_check hab_test; do python3 $t.py > lint_$t.log 2>&1 || { echo "LINT FAILED $t"; tail -3 lint_$t.log; exit 1; }; done
echo "lints ok"
(cd /workspace/ux50 && LIVE=1 ./build_live.sh) > build_live_ux.log 2>&1 || { echo "UX BUILD FAILED"; tail -5 build_live_ux.log; exit 1; }
[ "${WORKCALC:-0}" = 1 ] || python3 /workspace/palsite/workcalc_off.py $OUT || { echo "WORKCALC OFF FAILED"; exit 1; }
grep -q "palwiki-preview" $OUT/sitemap.xml 2>/dev/null && { echo "SITE_URL LEAK (preview) in live build"; exit 1; }
git add -A docs static partner26.py live_redesign.sh gate_allow.py overrides mkdocs.yml prep.py item_pages26.py sitecards.py && (git commit -qm "redesign go-live $(date -u +%F_%H%M)" || true)
flock -u 9; echo "unlock $(date +%T)"
[ "$1" = "--no-gate" ] || { rm -rf /workspace/palsite/gate_live; pkill -f "http.server 8931" 2>/dev/null || true; (mkdir -p /tmp/gateroot && ln -sfn $OUT /tmp/gateroot/palwiki && cd /tmp/gateroot && python3 -m http.server 8931 >/dev/null 2>&1 & echo $! > /tmp/gate.pid); sleep 1; set +e
 (cd /workspace/audit2026/deep && timeout 4000 python3 deep_audit.py --base http://localhost:8931/palwiki/ --fail-on P0 --pages sample --concurrency 2 --serial --out /workspace/palsite/gate_live > /workspace/palsite/gate_live.log 2>&1); G=$?; set -e
 python3 /workspace/palsite/theme_nav_test.py http://localhost:8931/palwiki/ > /workspace/palsite/gate_theme.log 2>&1; T=$?; python3 /workspace/fontaudit/font_audit.py --base http://localhost:8931/palwiki/ --gate > /workspace/palsite/gate_font.log 2>&1; F=$?
 kill $(cat /tmp/gate.pid) 2>/dev/null; [ $T = 0 ] || { echo "THEME TEST FAILED"; tail -2 gate_theme.log; exit 1; }; [ $F = 0 ] || { echo "FONT AUDIT FAILED"; tail -3 gate_font.log; exit 1; }; tail -3 gate_live.log; python3 /workspace/palsite/gate_allow.py /workspace/palsite/gate_live/issues_deep.json || { echo "GATE FAILED"; exit 1; }; }
[ "$1" = "--no-deploy" ] && exit 0
git push -q origin HEAD:main
ghp-import -n -p -f -b gh-pages -r origin -m "Redesign stage 1 + hotfix batch (gated snapshot)" $OUT
echo "DEPLOYED $(date +%T)"
