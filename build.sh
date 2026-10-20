#!/bin/bash
set -e; cd /workspace/palsite; export PATH=$HOME/.local/bin:$PATH
python3 prep.py
mkdocs build --strict 2>&1 | tee build.log || { echo "strict failed, normal build"; mkdocs build 2>&1 | tail -3; }
# deploy
git add -A && (git commit -qm "update $(date -u +%F_%H%M)" || true) && git push -q origin HEAD:main
mkdocs gh-deploy --force -q
