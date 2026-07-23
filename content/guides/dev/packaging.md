---
title: 导出扩展
description: 将扩展导出为可分发的“myextension.blueprint”文件
author: Emma
category: dev
thumbnail: files.jpeg
order: 99
---

## 简介

Falixer 扩展以 `{identifier}.blueprint` 文件的形式分发。用户可将文件上传到 Pterodactyl 目录，再通过 Blueprint CLI 安装扩展。

## 导出扩展

要将开发文件转换成可分发的 `{identifier}.blueprint` 文件，需要使用 Blueprint CLI 进行打包。

```bash
# 导出扩展，并保存到 Pterodactyl Web 服务目录
#（例如 /var/www/pterodactyl）
blueprint -export
```

### 可选：生成下载链接

Blueprint CLI 可以为扩展生成临时下载链接。添加 `expose` 参数即可生成链接。

```bash
# 导出扩展、保存到 Pterodactyl Web 服务目录，
# 并生成临时下载链接
blueprint -export expose
```

## 测试扩展

测试至关重要。特别是在使用导出脚本时，请确认扩展仍能按预期工作。应先重新安装扩展并在面板中测试，确认无误后再进行分发。

```bash
# 如果扩展已安装，请先将其移除
blueprint -remove myextension

# 重新安装已经导出到 Pterodactyl 目录的
# myextension.blueprint 文件
blueprint -install myextension
```

## 完成

现在可以分发 `{identifier}.blueprint` 文件。部分扩展市场为 Blueprint 扩展提供了专属分类或标签。如果扩展为开源项目，可以为仓库添加 [blueprint-extension](https://github.com/topics/blueprint-extension) 标签。
