R=/workspace/tools/re/realesrgan-ncnn-vulkan; M=/workspace/tools/re/models
cd /workspace/palsite/design2026/art_final/work; mkdir -p up_fandom
for s in 2 3 4; do $R -i fin_x$s -o up_fandom -n realesr-animevideov3 -s $s -m $M -f png >/dev/null 2>&1; echo x$s; done; echo ALLDONE
