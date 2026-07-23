---
title: 反馈错误与问题
description: 在 Falixer 或扩展出现问题时获取支持
author: Emma
category: admin
thumbnail: glitch.jpeg
---

## 简介

Falixer 和扩展开发者收到的部分“错误报告”，实际上是由配置错误或不准确的 AI 指令导致的。
本指南将帮助你正确区分支持请求与错误报告，并前往合适的渠道反馈问题。

### 支持渠道

我们为 Falixer 及平台内扩展提供社区支持。如果问题仅涉及某个扩展，建议直接联系该扩展的开发者。

| 用途 | 渠道 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Falixer 与扩展的一般社区支持 | [Discord 社区](https://discord.com/servers/blueprint-1063548024825057451)中的 `#support`（可通过 [Answer Overflow](https://www.answeroverflow.com/c/1063548024825057451)检索）以及 [GitHub Discussions](https://github.com/orgs/BlueprintFramework/discussions) |
| 已确认且可复现的框架错误 | `blueprintframework/framework` 的 [GitHub Issues](https://github.com/BlueprintFramework/framework/issues/new?template=bug-report.yml) |
| 已确认且可复现的网站错误 | `blueprintframework/web` 的 [GitHub Issues](https://github.com/BlueprintFramework/web/issues/new) |

## 报告错误

为减少无效报告，提交前请确认满足以下全部条件：

- 可以稳定复现问题，并能提供清晰的复现步骤。
- 已在最新版 Falixer 中验证该问题。
- 未安装任何非 Falixer 修改。
- 仅使用[经过 Falixer 验证的扩展](/browse)。
- 该问题尚未被[其他人报告](https://github.com/BlueprintFramework/framework/issues)。

如果满足以上要求，请在[此处](https://github.com/BlueprintFramework/framework/issues/new?template=bug-report.yml)创建 Issue；否则请通过上述社区渠道请求支持。

## 请求支持

Falixer 或平台扩展出现问题时，可以获取社区支持。请前往 Discord 的 `#support` 频道（[Discord 社区](https://discord.com/servers/blueprint-1063548024825057451)、[Answer Overflow](https://www.answeroverflow.com/c/1063548024825057451)）或 [GitHub Discussions](https://github.com/orgs/BlueprintFramework/discussions)。

请求支持时，请提供日志、截图等足够的信息，以便社区准确定位问题。发布前务必遮盖不希望公开的敏感信息。

### 收集面板日志

可运行以下命令，将最近的面板日志上传至 pteropaste 并生成分享链接：

```bash
# Pterodactyl Web 服务目录
PTERODACTYL_DIRECTORY="/var/www/pterodactyl"

# 读取最近 99 行面板日志并发送至 pteropaste.com，
# 随后返回分享链接
tail -n 99 $PTERODACTYL_DIRECTORY/storage/logs/laravel-$(date +%F).log | nc pteropaste.com 99
```

命令会返回一个可在 Falixer 支持渠道中分享的链接。如果不希望使用 pteropaste，请移除命令中的 `| nc..` 部分，改为直接在终端输出最近的日志。

### 不要共享服务器访问权限

任何情况下都不要共享 Pterodactyl 面板凭据（账户、API 密钥）或 SSH 访问权限。网络上的陌生人并不都可信。如果有人提出此类要求，请[向工作组举报](/legal/conduct)。

### 在 Pterodactyl 社区请求支持

与 Falixer 无关的 Pterodactyl 常规问题，可以在 Pterodactyl 的支持渠道中咨询。如果正在使用 Falixer 且问题技术性较强，请优先通过我们的支持渠道咨询。

### Falixer 分支版本支持

我们不为 **Falixer 分支版本的用户**提供支持。请查找对应分支提供的支持方式，并向其维护者咨询。

## 联系扩展开发者

扩展开发者通常会为自己的扩展提供支持，但并非强制要求。如果某个扩展出现问题，或需要报告该扩展的错误，请查找开发者公开的联系方式。

> 除非开发者明确允许，否则不要通过 Discord 私信或其他即时通讯工具发送支持请求。许多开发者只通过电子邮件或工单系统提供支持，请尊重其指定的联系方式。
