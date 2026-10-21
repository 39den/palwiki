#!/bin/bash
# Preview publish (owned by site worker since 15:05 21.10): regenerate docs with preview-only layouts (ITEMS26=1: item tiles, food v2),
# then build the ux50 overlay and publish to 39den/palwiki-preview. Live build (build.sh) never sets ITEMS26, so live stays on the old layout,
# and this script always regenerates the preview layout itself, so a live build in between cannot regress the preview.
set -e; cd /workspace/palsite; export PATH=$HOME/.local/bin:$PATH
# shared lock with live build.sh (both regenerate docs/), added 21.10 by live-hotfix worker
exec 9>/tmp/palsite_build.lock; flock 9
ITEMS26=1 python3 sitecards.py >/dev/null && ITEMS26=1 python3 prep.py > prep26.log 2>&1 || { echo "PREP26 FAILED"; tail -5 prep26.log; exit 1; }
for f in static/*.js; do node --check $f || { echo "JS SYNTAX $f"; exit 1; }; done
python3 grammar_lint.py | tail -1
cd /workspace/ux50 && ./build_preview.sh ${PREVIEW_TEST:---no-test} --deploy
