## 15:10 Kaliningrad
- AI proxy SYS prompt hardened + deployed (ver 2a8e5c05), DAILY_REQ 50. Tested 2 direct requests: no SAN, exact passive names.
- ai.js: context now adds glossary terms (search_data.gl) + topical passives; prep strips "(SAN)" from FAQ.
- Next: ux50 preview owned by me; gate ITEMS26 in preview build; .inst fix for live.
## 15:30
- preview.sh created (ITEMS26 prep + ux50 build_preview --no-test --deploy). Preview published 15:15.
- CLS fixes in pp26 (tabs fixed height, :has() layout rules, pp-ready gating), items details reset, .inst hidden on pp26. Re-publish preview, then shots s1/.
- Live build still pending (AI ctx, SAN strip, .inst overlap fix).
## 15:40 deep audit received (/workspace/audit2026/deep). Preview republished 15:38 w/ CLS fixes. Gate: deep_audit.py --fail-on P0 before live.
## 15:50 cards regenerated w/ art_final renders (sitecards.py exec-patch of make_card), mini_tree from filled tiles, FAQ live, kbopen, WebKit fetch abort. Live build started w/ gate.
