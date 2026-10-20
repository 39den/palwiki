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
| Настройка | Что делает |
|---|---|
| Difficulty | Сложность (None/Normal/Hard) |
| DayTimeSpeedRate / NightTimeSpeedRate | Скорость дня/ночи |
| ExpRate | Множитель опыта |
| PalCaptureRate | Множитель шанса поимки |
| PalSpawnNumRate | Сколько палов в мире |
| PalDamageRateAttack / PalDamageRateDefense | Урон палов / получаемый палами урон |
| PlayerDamageRateAttack / PlayerDamageRateDefense | То же для игрока |
| PlayerStomachDecreaceRate / PalStomachDecreaceRate | Как быстро голодают |
| PlayerStaminaDecreaceRate / PalStaminaDecreaceRate | Расход выносливости |
| PlayerAutoHPRegeneRate / PalAutoHPRegeneRate | Самолечение |
| BuildObjectDamageRate | Урон по постройкам |
| BuildObjectDeteriorationDamageRate | Износ построек |
| CollectionDropRate | Сколько дают деревья/камни |
| CollectionObjectHpRate | «Прочность» деревьев/камней |
| CollectionObjectRespawnSpeedRate | Как быстро вырастают обратно |
| EnemyDropItemRate | Множитель дропа с врагов |
| DeathPenalty | Что теряешь при смерти: None / Item / ItemAndEquipment / All |
| bEnableInvaderEnemy | Налёты на базу |
| bEnableFriendlyFire | Урон по своим |
| PalEggDefaultHatchingTime | Время вылупления (часы) |
| WorkSpeedRate | Скорость работы |
| BaseCampMaxNum / BaseCampMaxNumInGuild | Лимит баз |
| BaseCampWorkerMaxNum | Палов-работников на базе (по умолчанию 15) |
| GuildPlayerMaxNum | Игроков в гильдии |
| DropItemMaxNum | Сколько предметов лежит на земле |
| SupplyDropSpan | Как часто ящики снабжения |
| ServerPlayerMaxNum | Макс. игроков |
| ServerPassword / AdminPassword | Пароли |
| bIsUseBackupSaveData | Авто-бэкапы |
| AutoSaveSpan | Как часто автосейв (сек) |
| Ограничение построек на игрока (новое в 1.0.4) | Лимит построек [имя ключа — проверить] |
Точные значения по умолчанию — в `DefaultPalWorldSettings.ini` твоей версии [патч].

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
- Боссы башен: опыт/награда всем, кто рядом [проверить].
- Пропала связь/«version mismatch» — у всех и у сервера должна быть одна версия (в 1.0.4 ошибка показывает версию сервера).
