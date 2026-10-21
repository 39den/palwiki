# Глубокий аудит «Палпедии»: нажатия, жесты, поиск, карта

Собрано 21.10.2026 16:11 (Калининград, UTC+2), за 22 мин. Адрес: http://localhost:8931/. Сайт только читался, ничего не менялось.

> **Промежуточный отчёт:** идёт этап «карта», готово блоков: 269. Файл обновляется по ходу проверки.

## Как проверяли
- Профили: iPhone (WebKit 390×844), Компьютер (Chromium 1440×900), Телефон (Chromium 390×844, жесты CDP), Firefox 1440×900 (смоук).
- Страниц в sitemap: 756. Мусор в тексте, перекрытия, обрезки, поля, ошибки JS и сети: 52 страниц (iPhone и компьютер).
- Нажата каждая кнопка, чип, вкладка, «?» и точка мини-карты на 52 страницах-образцах всех шаблонов: 0 нажатий.
- Поиск: каждое поле, 4 запроса (кириллица «Анубис», латиница «Anubis», «rfvjyjcrt» в чужой раскладке, две буквы «Ка»), плюс имитация открытой клавиатуры (экран 390×400).
- Карта: оба мира, 3 масштаба, анализ пикселей подложки (чёрные куски, швы), все слои, нажатия на значки и группы.
- Жесты: щипок двумя пальцами по каждой карте и мини-карте (Chromium через CDP-касания, здесь страница реально увеличивается, если её не остановить; WebKit через сенсорные события), свайпы, прокрутка над картой, время кадров.
- Ссылки: 0 внутренних адресов проверено запросом. Названий палов, боссов и пассивок в базе для проверки ссылок: (посчитаются в конце).

## Итог
- **P0 (сломано, блокирует выкладку): 1**
- **P1 (неудобно или некрасиво): 20**
- **P2 (полировка): 8**
- Всего 29 типов проблем и 315 отдельных случаев. Одна проблема на многих страницах идёт одной строкой.

## P0: сломано

1. **Чёрные квадраты (дыры) на мини-карте обитания** · `hab_black` · страниц: 3, случаев: 4 · desk, ios, ios+desk
   - `/4_spravochniki/paly/kelpsea_ignis/` (ios+desk): Мировое древо: 2 прямых краёв пустых квадратов
   - `/4_spravochniki/paly/elphidran_aqua/` (ios): Мировое древо: 1 прямых краёв пустых квадратов
   - `/4_spravochniki/paly/leezpunk_ignis/` (ios+desk): Мировое древо: 1 прямых краёв пустых квадратов
   - Скриншоты: `shots/ios/4_spravochniki_paly_kelpsea_ignis__hab_p.png`, `shots/ios/4_spravochniki_paly_elphidran_aqua__hab_p.png`, `shots/ios/4_spravochniki_paly_leezpunk_ignis__hab_p.png`

## P1: неудобно

1. **Нажатие ничего не делает (мёртвая кнопка)** · `dead` · страниц: 20, случаев: 47 · desk, ios, ios+desk
   - `/my/` (ios+desk): «Избранное 0» SUMMARY.
   - `/4_spravochniki/paly/kelpsea_ignis/` (ios): «» BUTTON.tabbed-button
   - `/4_spravochniki/paly/kelpsea_ignis/` (ios): «0» BUTTON. zero
   - Скриншоты: `shots/ios/my__dead_1.jpg`, `shots/ios/4_spravochniki_paly_kelpsea_ignis__dead_2.jpg`, `shots/ios/4_spravochniki_paly_kelpsea_ignis__dead_3.jpg`
2. **Сырой markdown (** или «- » в начале строки)** · `junk_md` · страниц: 11, случаев: 11 · ios+desk, ios+desk+ff
   - `/4_spravochniki/paly/anubis/` (ios+desk+ff): огий — 1 шт., 5%⏎Дроп альфы:⏎⏎- Деталь древней цивилизации — 5– | й цивилизации — 5–7 шт., 100%⏎- Ценные внутренности — 5–7 шт., 
   - `/4_spravochniki/paly/jetragon/` (ios+desk+ff): Пала — 1 шт., 1%⏎Дроп альфы:⏎⏎- Деталь древней цивилизации — 7– | й цивилизации — 7–9 шт., 100%⏎- Ценный драконий самоцвет — 7–9 
   - `/4_spravochniki/paly/kelpsea_ignis/` (ios+desk+ff): ан — 1 шт., 100%⏎Дроп альфы:⏎⏎- Деталь древней цивилизации — 1– | й цивилизации — 1–2 шт., 100%⏎- Ценные внутренности — 1–2 шт., 
   - Скриншоты: `shots/ios/4_spravochniki_paly_anubis__junk_md_1.jpg`, `shots/ios/4_spravochniki_paly_jetragon__junk_md_2.jpg`, `shots/ios/4_spravochniki_paly_kelpsea_ignis__junk_md_3.jpg`
3. **Внутренние английские имена (CamelCase/snake_case) в тексте** · `junk_eng` · страниц: 9, случаев: 9 · ios+desk
   - `/about/` (ios+desk): ir⏎Шрифты⏎Manrope, Unbounded, JetBrains Mono — SIL Open Font License⏎ | ir⏎Шрифты⏎Manrope, Unbounded, JetBrains Mono — SIL Open Font License⏎
   - `/2_mehaniki/aktivki/` (ios+desk): езарядка, с⏎🔥⏎Возгорание 100%⏎ru_Text⏎Стрелы тьмы⏎Тьма⏎120⏎сила⏎8⏎п | а⏎4⏎перезарядка, с⏎🌿⏎Путы 35%⏎ru_Text⏎Тёмный шар⏎Тьма⏎50⏎сила⏎2⏎пер | резарядка, с⏎💫⏎Оглушение 100%⏎ru_Text⏎Перекрёстная молния⏎Молния⏎ос
   - `/2_mehaniki/tehnologii/` (ios+desk): ч.)⏎Гексолит (предмет, 2 оч.)⏎ru_Text (постройка, 5 оч.)⏎Металлоиск |  возрождения (предмет, 3 оч.)⏎ru_Text (постройка, 4 оч.)⏎Седло Пала | ч.)⏎Гексолит (предмет, 2 оч.)⏎ru_Text (постройка, 5 оч.)⏎Металлоиск |  возрождения (предмет, 3 оч.)⏎
   - Скриншоты: `shots/ios/about__junk_eng_1.jpg`, `shots/ios/2_mehaniki_aktivki__junk_eng_2.jpg`, `shots/ios/2_mehaniki_tehnologii__junk_eng_3.jpg`
4. **Служебная метка ⓘ видна читателю** · `junk_unv` · страниц: 8, случаев: 8 · ios+desk, ios+desk+ff
   - `/4_spravochniki/paly/anubis/` (ios+desk+ff): ть⏎🔗 Ссылка⏎🤖 Открыть в боте⏎⏎ⓘ приблизительно⏎⏎← Дуалит Нокт | ить⏎🔗 Ссылка⏎🤖 Открыть в боте⏎ⓘ приблизительно⏎← Дуалит Нокт⏎
   - `/4_spravochniki/paly/jetragon/` (ios+desk+ff): ть⏎🔗 Ссылка⏎🤖 Открыть в боте⏎⏎ⓘ приблизительно⏎⏎← Нептилиус⏎П | ить⏎🔗 Ссылка⏎🤖 Открыть в боте⏎ⓘ приблизительно⏎← Нептилиус⏎Па
   - `/4_spravochniki/paly/kelpsea_ignis/` (ios+desk+ff): ть⏎🔗 Ссылка⏎🤖 Открыть в боте⏎⏎ⓘ приблизительно⏎⏎← Келпси⏎Рибб | ить⏎🔗 Ссылка⏎🤖 Открыть в боте⏎ⓘ приблизительно⏎← Келпси⏎Рибба
   - Скриншоты: `shots/ios/4_spravochniki_paly_anubis__junk_unv_1.jpg`, `shots/ios/4_spravochniki_paly_jetragon__junk_unv_2.jpg`, `shots/ios/4_spravochniki_paly_kelpsea_ignis__junk_unv_3.jpg`
5. **Элемент налезает на текст (вкладки, стрелки, бейджи)** · `occl` · страниц: 6, случаев: 126 · desk, desk+ff, ff, ios
   - `/compare/` (ios): «Анубис» закрыт button.cx-chg «Сравнить с другим» (top, 83,241)
   - `/compare/` (ios): «Джетрагон» закрыт button.cx-chg «Сравнить с другим» (top, 283,241)
   - `/compare/` (ios): «Анубис» закрыт button.cx-chg «Сравнить с другим» (bottom, 83,95)
   - Скриншоты: `shots/ios/compare__occl_1.jpg`, `shots/ios/compare__occl_2.jpg`, `shots/ios/compare__occl_3.jpg`
6. **Нет autocomplete="off" у поля поиска** · `inp_ac` · страниц: 5, случаев: 6 · ios+desk, ios+desk+ff
   - `/gallery/` (ios+desk+ff): #gq
   - `/my/` (ios+desk+ff): #nl
   - `/4_spravochniki/paly/` (ios+desk+ff): #gq
7. **На мини-карте обитания нет ни одной точки** · `hab_nodots` · страниц: 5, случаев: 5 · ios+desk
   - `/boss/alpha_anubis/` (ios+desk): 
   - `/4_spravochniki/paly/kelpsea_ignis/` (ios+desk): 
   - `/4_spravochniki/paly/elphidran_aqua/` (ios+desk): 
   - Скриншоты: `shots/ios/boss_alpha_anubis__hab_nodots_1.jpg`, `shots/ios/4_spravochniki_paly_kelpsea_ignis__hab_nodots_2.jpg`, `shots/ios/4_spravochniki_paly_elphidran_aqua__hab_nodots_3.jpg`
8. **Поиск не понимает неверную раскладку** · `search_layout` · страниц: 5, случаев: 7 · desk, ios, ios+desk, ios+ff
   - `/gallery/` (ios+ff): #gq «rfvjyjcrt»
   - `/4_spravochniki/paly/` (ios): #gq «rfvjyjcrt»
   - `/boss/` (ios+desk): #bq2 «rfvjyjcrt»
   - Скриншоты: `shots/ios/gallery__search_layout_1.jpg`, `shots/ios/4_spravochniki_paly__search_layout_2.jpg`, `shots/ios/boss__search_layout_3.jpg`
9. **Подсказка в поле обрезана** · `inp_ph` · страниц: 4, случаев: 4 · ios
   - `/my/` (ios): #nl «Новый список, например «Рейд»» 309px > 148px
   - `/2_mehaniki/aktivki/` (ios): [data-dz="i5863"] «Название или эффект» 206px > 152px
   - `/4_spravochniki/predmety/%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C_%D0%B4%D0%BB%D1%8F_%D1%81%D1%84%D0%B5%D1%80%D1%8B/` (ios): [data-dz="i150"] «Найти в разделе «Модуль для сферы»…» 372px > 300px
10. **Обрезанный текст (… или скрыт за краем)** · `clip` · страниц: 3, случаев: 3 · ios
   - `/compare/` (ios): «Джетрагон» в div.cx-head > div.cx-pal.cx-b > div.cx-nm > b ширина 88>83 высота 18>18
   - `/passivki/jump_count_increase_1/` (ios): «Дополнительный прыжок +2» в article.md-content__inner.md-typeset > nav.edges > a.edge.er > small ширина 193>121 высота 16>16
   - `/passivki/world_trees_bounty/` (ios): «Прыжок между измерениями» в article.md-content__inner.md-typeset > nav.edges > a.edge.el > small ширина 212>121 высота 16>16
   - Скриншоты: `shots/ios/compare__clip_1.jpg`, `shots/ios/passivki_jump_count_increase_1__clip_3.jpg`
11. **Два крестика «очистить» у поля** · `dup_clear` · страниц: 3, случаев: 4 · desk
   - `/` (desk): #hsq: своих × 1 + системный ×
   - `/map/` (desk): #hsq: своих × 1 + системный ×
   - `/map/` (desk): #mapq: своих × 1 + системный ×
   - Скриншоты: `shots/desk/home__dup_clear_1.jpg`, `shots/desk/map__dup_clear_2.jpg`
12. **Риск панели «Автозаполнить контакт» на iPhone (эвристика)** · `inp_autofill` · страниц: 2, случаев: 2 · ios
   - `/gallery/` (ios): #gq: слово «Имя» в подсказке/имени; нет autocorrect, autocapitalize, spellcheck
   - `/4_spravochniki/paly/` (ios): #gq: слово «Имя» в подсказке/имени; нет autocorrect, autocapitalize, spellcheck
13. **Двойная рамка у поля ввода** · `inp_dbl` · страниц: 2, случаев: 4 · desk, ios+desk, ios+desk+ff
   - `/my/` (ios+desk+ff): #nl внутри рамки div.gal-filters
   - `/4_spravochniki/paly_po_stihiyam_i_rabote/` (desk): #bgq внутри рамки div.gal-filters
   - `/my/` (ios+desk): #nl (в фокусе) внутри рамки div.gal-filters
   - Скриншоты: `shots/ios/my__inp_dbl_1.jpg`, `shots/desk/4_spravochniki_paly_po_stihiyam_i_rabote__inp_dbl_2.jpg`
14. **С открытой клавиатурой экран занят панелями** · `kb_cover` · страниц: 2, случаев: 2 · ios
   - `/` (ios): панели 66% (поле #hsq)
   - `/4_spravochniki/paly/anubis/` (ios): панели 66% (поле #hsq)
   - Скриншоты: `shots/ios/home__kb_cover_1.jpg`, `shots/ios/4_spravochniki_paly_anubis__kb_cover_2.jpg`
15. **Поиск не показывает результаты под строкой** · `search_empty` · страниц: 2, случаев: 2 · ios+desk
   - `/boss/` (ios+desk): #bq2 «Anubis»
   - `/4_spravochniki/bossy/` (ios+desk): #bq2 «Anubis»
   - Скриншоты: `shots/ios/boss__search_empty_1.jpg`, `shots/ios/4_spravochniki_bossy__search_empty_2.jpg`
16. **Большая пустая область внутри границ карты (нет подложки)** · `map_empty` · страниц: 2, случаев: 2 · ios
   - `/map/` (ios): мир p, шаг 0: подложкой покрыто 72% области карты
   - `/map/?pal=Anubis` (ios): мир p, шаг 0: подложкой покрыто 72% области карты
   - Скриншоты: `shots/ios/map_p_z0.png`, `shots/ios/map_pal_z0.png`
17. **Нажатие на группу значков не раскрывает её** · `cluster_dead` · страниц: 2, случаев: 6 · ios
   - `/map/` (ios): мир t, группа «7»
   - `/map/` (ios): мир t, группа «2»
   - `/map/` (ios): мир t, группа «3»
18. **Кнопка «?» не открывает подсказку** · `dead_help` · страниц: 1, случаев: 1 · desk
   - `/2_mehaniki/rabota/` (desk): «?» BUTTON.qm
   - Скриншоты: `shots/desk/2_mehaniki_rabota__dead_help_1.jpg`
19. **С открытой клавиатурой панели закрывают карту** · `kb_map` · страниц: 1, случаев: 1 · ios
   - `/map/` (ios): видно карты 41% экрана (поле #hsq)
   - Скриншоты: `shots/ios/map__kb_map_1.jpg`
20. **Поиск не находит ожидаемое** · `search_wrong` · страниц: 1, случаев: 3 · ios+desk
   - `/my/` (ios+desk): #nl «Анубис» → нет «Анубис» (есть: В бота)
   - `/my/` (ios+desk): #nl «Anubis» → нет «Анубис» (есть: В бота)
   - `/my/` (ios+desk): #nl «rfvjyjcrt» → нет «Камоноске» (есть: В бота)

## P2: полировка

1. **Нажатие открывает слой на весь экран** · `overlay` · страниц: 12, случаев: 12 · desk, ios, ios+desk
   - `/gallery/` (ios): «⚙️ Фильтры» → div.sheet-bg 100%
   - `/4_spravochniki/paly/` (ios): «⚙️ Фильтры» → div.sheet-bg 100%
   - `/4_spravochniki/paly/anubis/` (ios+desk): «Открыть карточку» → div.lbx 100%
   - Скриншоты: `shots/ios/gallery__overlay_1.jpg`, `shots/ios/4_spravochniki_paly__overlay_2.jpg`, `shots/ios/4_spravochniki_paly_anubis__overlay_3.jpg`
2. **Точка мини-карты не реагирует на нажатие** · `hab_dot_dead` · страниц: 8, случаев: 23 · desk, ios
   - `/4_spravochniki/paly/anubis/` (ios): canvas, точка 190,412
   - `/4_spravochniki/paly/anubis/` (ios): canvas, точка 177,437
   - `/4_spravochniki/paly/jetragon/` (ios): canvas, точка 129,396
3. **Английские названия вместо русских** · `junk_eng_words` · страниц: 6, случаев: 6 · ios+desk
   - `/about/` (ios+desk): bounded, JetBrains Mono — SIL Open Font License⏎⚠️ Сообщить об ошибке⏎К начал | bounded, JetBrains Mono — SIL Open Font License⏎⚠️ Сообщить об ошибке
   - `/5_lut_i_farm/gde_vzyat/` (ios+desk):  Сундук, Экспедиция, Рыбалка, Glistening Ancient Relic⏎Водяная граната — крафт⏎Возду |  Сундук, Экспедиция, Рыбалка, Glistening Ancient Relic⏎Водяная граната⏎ — крафт⏎Возд |  Сундук, Экспедиция, Рыбалка, Glistening Ancient Relic⏎Грубые патр
   - `/9_faq/faq/` (ios+desk): : Экспедиция, Нефтяная вышка, Glistening Ancient Relic, Glowing Ancient Relic, Рыбны | ка, Glistening Ancient Relic, Glowing Ancient Relic, Рыбный пруд на базе⏎Где взят
   - Скриншоты: `shots/ios/about__junk_eng_words_1.jpg`, `shots/ios/5_lut_i_farm_gde_vzyat__junk_eng_words_2.jpg`, `shots/ios/9_faq_faq__junk_eng_words_3.jpg`
4. **Риск панели «Автозаполнить контакт» на iPhone (эвристика)** · `inp_autofill` · страниц: 3, случаев: 4 · ios
   - `/my/` (ios): #nl: нет autocorrect, autocapitalize, spellcheck
   - `/2_mehaniki/rabota/` (ios): #ps: нет autocorrect, autocapitalize, spellcheck
   - `/2_mehaniki/rabota/` (ios): #wl: нет autocorrect, autocapitalize, spellcheck
5. **Значки на карте налезают друг на друга на стартовом масштабе** · `map_iconov` · страниц: 2, случаев: 2 · ios
   - `/map/` (ios): мир p: 12 пересечений
   - `/map/?pal=Anubis` (ios): мир p: 12 пересечений
   - Скриншоты: `shots/ios/map__map_iconov_1.jpg`, `shots/ios/map_pal_anubis__map_iconov_2.jpg`
6. **Слой карты пустой на стартовом масштабе** · `layer_empty` · страниц: 2, случаев: 2 · ios
   - `/map/` (ios): мир t, слой sealed
   - `/map/?pal=Anubis` (ios): мир t, слой sealed
7. **На мини-карте обитания нет ни одной точки** · `hab_nodots` · страниц: 1, случаев: 1 · ios+desk
   - `/boss/alpha_jetragon/` (ios+desk): 
8. **Список результатов не под строкой поиска** · `search_pos` · страниц: 1, случаев: 8 · desk, ios
   - `/my/` (ios): #nl «Анубис»: список -672–-623, поле 393–451
   - `/my/` (ios): #nl «Anubis»: список -672–-623, поле 393–451
   - `/my/` (ios): #nl «rfvjyjcrt»: список -672–-623, поле 393–451

## Запуск как проверки перед выкладкой

```
cd /workspace/audit2026/deep
python3 deep_audit.py --base https://39den.github.io/palwiki-preview/ --fail-on P0            # полный, ~1 ч
python3 deep_audit.py --base https://39den.github.io/palwiki-preview/ --fail-on P0 --pages sample   # быстрый, ~15 мин
```
Код выхода 1, если есть хотя бы одна проблема уровня P0 (или выше уровня из --fail-on). Отчёт и issues_deep.json перезаписываются в папке --out.
