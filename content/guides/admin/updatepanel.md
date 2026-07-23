---
title: 更新 Pterodactyl
description: 将 Pterodactyl 和 Falixer 更新到最新版本
author: Emma
category: admin
thumbnail: pterodactyldocs.jpeg
---

## 进入维护模式

更新 Pterodactyl 前，请务必进入维护模式。否则用户可能在更新期间遇到异常，也可能提前访问尚未完成部署的新功能。

```bash
# 进入 Pterodactyl 目录
cd /var/www/pterodactyl

# 将面板切换到维护模式
php artisan down
```

## 下载最新 Pterodactyl 版本

首先，从 GitHub 下载 Pterodactyl 的最新版本。

```bash
# 下载并解压 Pterodactyl 最新版本
curl -L https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz | tar -xzv

# 设置缓存和存储目录的正确权限
chmod -R 755 storage/* bootstrap/cache
```

## 更新 Pterodactyl 依赖

下载新文件后，需要升级面板的核心依赖。运行以下命令，并按终端提示完成操作。

```bash
# 更新 Pterodactyl 核心依赖
composer install --no-dev --optimize-autoloader
```

## 更新数据库

执行以下命令以更新数据库结构和默认 Egg。请注意：如果修改过 Pterodactyl 的核心 Egg，这些更改将被覆盖。

```bash
# 更新 Pterodactyl 数据库结构
php artisan migrate --seed --force
```

## 更新 Falixer

::card
更多信息请参阅[更新 Falixer 指南](/guides/admin/updateblueprint)。
::

运行 `blueprint -upgrade` 将最新 Falixer 稳定版应用到面板。该命令也会恢复在 Pterodactyl 更新过程中被覆盖的 Falixer 修改。

```bash
# 将 Falixer 更新到最新稳定版
blueprint -upgrade
```

## 退出维护模式

最后，运行以下命令退出维护模式。

```bash
# 将面板恢复到生产模式
php artisan up
```
