set -e
R=/workspace/tools/re/realesrgan-ncnn-vulkan; M=/workspace/tools/re/models
cd /workspace/palsite/design2026/art_final/work
for s in 2 3 4; do mkdir -p up_pal; $R -i in_pal_x$s -o up_pal -n realesr-animevideov3 -s $s -m $M -f png >/dev/null 2>&1; echo pal x$s done; done
mkdir -p up_icon1 up_icon; $R -i ../src/icons -o up_icon1 -n realesr-animevideov3 -s 4 -m $M -f png >/dev/null 2>&1; echo icon1
$R -i up_icon1 -o up_icon -n realesr-animevideov3 -s 2 -m $M -f png >/dev/null 2>&1; echo icon2
mkdir -p up_food; $R -i in_food -o up_food -n realesr-animevideov3 -s 3 -m $M -f png >/dev/null 2>&1; echo food
echo ALLDONE
