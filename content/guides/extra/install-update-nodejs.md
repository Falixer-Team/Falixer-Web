---
title: 在 Ubuntu/Debian 上安装 Node.js
description: 为 Pterodactyl 和 Falixer 安装、升级或降级 Node.js
author: Emma
category: extra
thumbnail: nodejs.jpeg
---

## 简介

[Node.js](https://nodejs.org) 是 JavaScript（ECMAScript）运行时，可在浏览器之外执行 JavaScript 代码，广泛应用于 Web 开发。

系统官方软件源通常不提供 Node.js，或其中的版本较旧。使用 [Fast Node Manager](https://github.com/Schniz/fnm)（fnm）通常更方便，因为它可以快速切换 Node.js 版本。

Node.js 官网也提供了[**官方安装指南**](https://nodejs.org/en/download)。

## 安装 Node.js

Falixer 要求 Node.js `v20.x` 或更高版本。长期使用时，建议选择最新 LTS 版本（本指南编写时为 `v24.x`）。

下面使用 [Fast Node Manager](https://github.com/Schniz/fnm)（fnm）快速安装 Node.js `v24.x`。

```bash
# 下载并安装 fnm
curl -o- https://fnm.vercel.app/install | bash

# 使用 fnm 下载并安装 Node.js v24.x
fnm install 24

# 查看 Node.js 版本
node -v
```

### 为 Pterodactyl 安装 `yarn`

Falixer 和 Pterodactyl 使用 `yarn` 管理 Node.js 模块，可通过以下命令安装：

```bash
# 安装 yarn
npm i yarn -g

# 查看 yarn 版本
yarn -v
```

现在可以使用 `yarn` 管理 Pterodactyl 的 Node.js 模块。

## 升级或降级 Node.js

可使用 fnm 切换当前启用的 Node.js 版本：

```bash
# 使用 Node.js v24.x
fnm use 24

# 使用 Node.js v22.x
fnm use 22
```

随后运行以下命令确认当前版本：

```bash
# 查看 Node.js 版本
node -v
```

## 移除 Node.js

还可以通过 fnm 移除不再需要的 Node.js 版本：

```bash
# 卸载 Node.js v24.x
fnm uninstall 24
```
