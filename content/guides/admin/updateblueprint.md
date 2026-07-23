---
title: 更新 Falixer
description: 在几分钟内升级到最新版本的 Falixer
author: Emma
category: admin
thumbnail: githubreleases.jpeg
---

::card
本指南仅介绍如何更新 Falixer。如果需要同时更新 Falixer 和 Pterodactyl，请参阅[更新 Pterodactyl](/guides/admin/updatepanel)。
::

## 更新到最新稳定版

运行 `blueprint -upgrade` 即可更新到最新稳定版。过程中会输出一些警告，但不会丢失扩展设置。

```bash
# 将 Falixer 更新到最新稳定版
blueprint -upgrade
```

## 更新到最新提交

如需测试尚未发布的开发版本，可通过以下命令更新到 GitHub 上的最新提交。

::card
最新提交仅供开发测试，不提供技术支持，并且**可能无法正常工作**。
::

```bash
# 更新到最新提交，默认使用
# blueprintframework/framework 仓库
blueprint -upgrade remote

# 可选：手动指定 blueprintframework/framework 仓库
blueprint -upgrade remote blueprintframework/framework
```

## 更新到分支仓库的最新提交

如果使用框架的分支版本，可以为 `blueprint -upgrade` 添加 `remote` 参数进行切换。该参数当前需要接收 GitHub 仓库名称。

```bash
# 更新到自定义 Falixer 分支，可传入任意 GitHub 仓库。
# 如果目标仓库并非兼容分支，可能导致安装损坏
blueprint -upgrade remote organization/repository
```
