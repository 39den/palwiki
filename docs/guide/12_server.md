# Свой сервер и игра с друзьями

## Где файлы (выделенный сервер, Steam «Palworld Dedicated Server»)
- Настройки: `PalServer/Pal/Saved/Config/WindowsServer/PalWorldSettings.ini` (на Linux — `LinuxServer`).
- Если файл пустой — скопируй содержимое `PalServer/DefaultPalWorldSettings.ini`.
- Сохранение мира: `PalServer/Pal/Saved/SaveGames/0/<ID мира>/`.
- Авто-бэкапы (если включено `bIsUseBackupSaveData=True`): там же в папке `backup`.
- **Перед любыми изменениями** (сброс статов, обновление игры, моды) — копируй папку `SaveGames` целиком.

## Порты
- Игра: **UDP 8211** (`PublicPort`). Открыть на роутере/фаерволе.
- RCON: TCP 25575 (`RCONPort`, если `RCONEnabled=True`).
- REST API: 8212 (`RESTAPIPort`).

## Что значат главные настройки (значения «по умолчанию» = 1.0 — обычно)

<div class="kvs" markdown="0"><div class="kv"><span class="kv-l">Difficulty</span><span class="kv-v">Сложность (—/Normal/Hard)</span></div><div class="kv"><span class="kv-l">DayTimeSpeedRate / NightTimeSpeedRate</span><span class="kv-v">Скорость дня/ночи</span></div><div class="kv"><span class="kv-l">ExpRate</span><span class="kv-v">Множитель опыта</span></div><div class="kv"><span class="kv-l">PalCaptureRate</span><span class="kv-v">Множитель шанса поимки</span></div><div class="kv"><span class="kv-l">PalSpawnNumRate</span><span class="kv-v">Сколько палов в мире</span></div><div class="kv"><span class="kv-l">PalDamageRateAttack / PalDamageRateDefense</span><span class="kv-v">Урон палов / получаемый палами урон</span></div><div class="kv"><span class="kv-l">PlayerDamageRateAttack / PlayerDamageRateDefense</span><span class="kv-v">То же для игрока</span></div><div class="kv"><span class="kv-l">PlayerStomachDecreaceRate / PalStomachDecreaceRate</span><span class="kv-v">Как быстро голодают</span></div><div class="kv"><span class="kv-l">PlayerStaminaDecreaceRate / PalStaminaDecreaceRate</span><span class="kv-v">Расход выносливости</span></div><div class="kv"><span class="kv-l">PlayerAutoHPRegeneRate / PalAutoHPRegeneRate</span><span class="kv-v">Самолечение</span></div><div class="kv"><span class="kv-l">BuildObjectDamageRate</span><span class="kv-v">Урон по постройкам</span></div><div class="kv"><span class="kv-l">BuildObjectDeteriorationDamageRate</span><span class="kv-v">Износ построек</span></div><div class="kv"><span class="kv-l">CollectionDropRate</span><span class="kv-v">Сколько дают деревья/камни</span></div><div class="kv"><span class="kv-l">CollectionObjectHpRate</span><span class="kv-v">«Прочность» деревьев/камней</span></div><div class="kv"><span class="kv-l">CollectionObjectRespawnSpeedRate</span><span class="kv-v">Как быстро вырастают обратно</span></div><div class="kv"><span class="kv-l">EnemyDropItemRate</span><span class="kv-v">Множитель дропа с врагов</span></div><div class="kv"><span class="kv-l">DeathPenalty</span><span class="kv-v">Что теряешь при смерти: — / Item / ItemAndEquipment / All</span></div><div class="kv"><span class="kv-l">bEnableInvaderEnemy</span><span class="kv-v">Налёты на базу</span></div><div class="kv"><span class="kv-l">bEnableFriendlyFire</span><span class="kv-v">Урон по своим</span></div><div class="kv"><span class="kv-l">PalEggDefaultHatchingTime</span><span class="kv-v">Время вылупления (часы)</span></div><div class="kv"><span class="kv-l">WorkSpeedRate</span><span class="kv-v">Скорость работы</span></div><div class="kv"><span class="kv-l">BaseCampMaxNum / BaseCampMaxNumInGuild</span><span class="kv-v">Лимит баз</span></div><div class="kv"><span class="kv-l">BaseCampWorkerMaxNum</span><span class="kv-v">Палов-работников на базе (по умолчанию 15)</span></div><div class="kv"><span class="kv-l">GuildPlayerMaxNum</span><span class="kv-v">Игроков в гильдии</span></div><div class="kv"><span class="kv-l">DropItemMaxNum</span><span class="kv-v">Сколько предметов лежит на земле</span></div><div class="kv"><span class="kv-l">SupplyDropSpan</span><span class="kv-v">Как часто ящики снабжения</span></div><div class="kv"><span class="kv-l">ServerPlayerMaxNum</span><span class="kv-v">Макс. игроков</span></div><div class="kv"><span class="kv-l">ServerPassword / AdminPassword</span><span class="kv-v">Пароли</span></div><div class="kv"><span class="kv-l">bIsUseBackupSaveData</span><span class="kv-v">Авто-бэкапы</span></div><div class="kv"><span class="kv-l">AutoSaveSpan</span><span class="kv-v">Как часто автосейв (сек)</span></div><div class="kv"><span class="kv-l">Ограничение построек на игрока (новое в 1.0.4)</span><span class="kv-v">Лимит построек [имя ключа — проверить]</span></div></div>

Точные значения по умолчанию — в `DefaultPalWorldSettings.ini` твоей версии.

## Админ-команды (в чате)
1. Сначала: `/AdminPassword <пароль>`.
- `/ShowPlayers` — кто в игре (ID).
- `/Info` — инфо о сервере.
- `/Save` — сохранить мир.
- `/Broadcast <текст>` — сообщение всем (без пробелов или с `_`).
- `/KickPlayer <ID>` · `/BanPlayer <ID>` · `/UnBanPlayer <ID>`.
- `/TeleportToPlayer <ID>` · `/TeleportToMe <ID>`.
- `/Shutdown <сек> <текст>` — выключить с таймером · `/DoExit` — выключить сразу.

## Кооп: как играть вчетвером удобно
- Все в **одной гильдии** → общие базы и палы на базе.
- Технологии каждый учит **сам** (очки у каждого свои).
- Сундуки базы общие для гильдии.
- Боссы башен: опыт/награда всем, кто рядом.
- Пропала связь/«version mismatch» — у всех и у сервера должна быть одна версия (в 1.0.4 ошибка показывает версию сервера).
