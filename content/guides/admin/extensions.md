---
title: 管理扩展
description: 安装、移除和配置 Falixer 扩展
author: Emma
category: admin
thumbnail: adminblueprint.jpeg
---

## 安装扩展

::card
如果使用 Blueprint Docker，请将扩展放入 `/srv/pterodactyl/extensions` 目录。
::

安装 Falixer 扩展时，先将 `identifier.blueprint` 文件移动到 Pterodactyl Web 服务目录（通常为 `/var/www/pterodactyl`），再运行以下命令：

```bash
blueprint -install identifier           # 可省略文件扩展名
blueprint -install identifier.blueprint # 也可以使用完整文件名
```

## 移除扩展

卸载扩展非常简单，只需通过 CLI 指定要移除的扩展：

```bash
blueprint -remove identifier           # 使用扩展标识符
blueprint -remove identifier.blueprint # 或使用完整文件名
```

## 配置扩展

扩展安装完成后，前往管理面板中的 Falixer“扩展”页面，然后点击需要管理的扩展。每个扩展都有独立的管理页面，具体是否提供可配置项取决于扩展本身。

![](/img/guides/extensions.jpeg)

扩展管理页面中还提供 Falixer 设置面板，可用于配置每个扩展的权限。

![](/img/guides/permissions.jpeg)
