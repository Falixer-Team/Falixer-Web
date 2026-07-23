---
title: 移除 Falixer
description: 从服务器中卸载 Falixer
author: Emma
category: admin
thumbnail: old_man_yells_at_blueprint.jpg
---

::card
开始前请务必备份 `.env` 文件。如果丢失其中保存的 `APP_KEY`，**面板中的全部数据都将无法恢复**。
::

## 进入维护模式

移除 Falixer 前，应先将面板切换到维护模式。

```bash
# 进入 Pterodactyl 目录
cd /var/www/pterodactyl

# 将面板切换到维护模式
php artisan down
```

## 移除文件

Falixer 及其扩展会修改 Pterodactyl 文件。要彻底移除这些修改，需要清理 Pterodactyl Web 服务目录。

```bash
# 移除 Pterodactyl Web 服务目录中的所有非隐藏文件
rm -r [!.]*

# 移除遗留的 Falixer 文件和目录
rm -r .blueprint .blueprintrc /usr/local/bin/blueprint
```

## 恢复 Pterodactyl

从“Download the Update”步骤开始，按照 [Pterodactyl 面板更新指南](https://pterodactyl.io/panel/1.0/updating.html#download-the-update)重新部署面板文件。
