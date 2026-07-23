---
title: 快速开始
description: 创建你的第一个 Falixer 扩展
author: Emma
category: dev
thumbnail: code.jpeg
order: 1
---

::card
运行[开发者命令](/docs/cli/commands#developer)前，必须先在管理面板中启用开发者模式。前往 `/admin/extensions`，选择“Falixer”，将 `developer` 设置为 `true`。此操作只需执行一次。
::

## 初始化扩展

运行 `blueprint -init` 创建新扩展。该命令可使用预设模板、填写扩展信息并自动生成类型。

```bash
# 创建新扩展
blueprint -init
```

大多数扩展信息都可以在之后轻松修改。

## 完成第一次修改

Falixer 会在 Pterodactyl 目录下的 `.blueprint/dev` 中创建扩展。Pterodactyl 目录通常为 `/var/www/pterodactyl`，因此完整路径一般是 `/var/www/pterodactyl/.blueprint/dev`。

```sh
# 进入 Falixer 开发目录
cd /var/www/pterodactyl/.blueprint/dev
```

### 修改描述

打开 `.blueprint/dev/conf.yml` 文件，修改 `info.description` 的值以更新扩展描述。

```diff
info:
- description: "这是旧的扩展描述 :c"
+ description: "这是新的扩展描述 :)"
```

## 应用更改

最后，运行 `blueprint -build` 应用更改。每次修改后都可以运行该命令，在面板中查看最新效果。

```sh
# 应用扩展更改
blueprint -build
```

## 接下来做什么？

以下资源可帮助你继续学习扩展开发：

- 查看更多[扩展开发指南](/guides/category/dev)。
- 阅读[开发文档](/docs)，深入了解 Falixer。
- 在 [Discord 社区](https://discord.com/servers/blueprint-1063548024825057451)与其他扩展开发者交流。
- 在 [GitHub Discussions](https://github.com/orgs/BlueprintFramework/discussions) 展示扩展或获取支持。
