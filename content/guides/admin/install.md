---
title: 安装 Falixer
description: 取得有效授权后，将 Falixer 安装到你的 Pterodactyl 面板
author: Falixer Team
category: admin
thumbnail: cli.jpeg
order: -1
---

## 开始前：选择授权

安装 Falixer 前，必须先取得与当前 Pterodactyl 面板绑定的有效授权。

- **个人免费授权：** 仅允许个人学习、自用及非营利用途，禁止任何商业用途；
- **商业授权：** 提供月付、季付、年付和永久方案，可用于商业项目及收费服务。

[前往 Falixer 授权价格页选择方案](/pricing)

> **授权须知：** 每份授权仅可绑定一个 Pterodactyl 面板。禁止共享、转售、破解、绕过授权验证或以任何方式公开 Falixer 的程序文件。免费授权一旦用于商业场景，授权将被撤销。

选择方案并完成授权后，请从授权中心下载 Falixer 安装包，并妥善保存授权凭据。购买入口上线前，请联系 Falixer 官方获取授权与安装包。

## 安装前准备

开始前请确认：

- 已安装并可正常使用原版 Pterodactyl 面板；
- 服务器系统为受支持的 Debian 或 Ubuntu 版本；
- 拥有服务器的 `root` 或 `sudo` 权限；
- 已取得与当前面板绑定的有效 Falixer 授权；
- 已备份 Pterodactyl 数据库和面板文件。

## 设置 Pterodactyl 目录

先设置 Pterodactyl 的安装目录，后续命令会使用该变量。默认目录为 `/var/www/pterodactyl`；如果你的面板位于其他位置，请修改路径。

```bash
# 设置 Pterodactyl 安装目录
export PTERODACTYL_DIRECTORY=/var/www/pterodactyl
```

可以通过以下命令确认目录是否正确：

```bash
ls -la "$PTERODACTYL_DIRECTORY"
```

目录中应能看到 Pterodactyl 的 `artisan`、`app`、`resources` 等文件或目录。

## 上传并解压安装包

将从 Falixer 授权中心获得的 `release.zip` 上传到 Pterodactyl 根目录，然后安装解压工具并解压安装包。

```bash
# 安装安装过程需要的基础工具
sudo apt update
sudo apt install -y curl wget unzip

# 进入 Pterodactyl 目录
cd "$PTERODACTYL_DIRECTORY"

# 解压 Falixer 安装包
unzip -o release.zip
```

> **安全提醒：** 仅使用从 Falixer 官方授权中心取得的安装包。第三方来源可能包含恶意代码、被篡改文件或无效的授权验证程序。

## 安装运行依赖

Falixer 与 Pterodactyl 一样，需要若干系统和前端构建依赖。运行以下命令进行安装：

```bash
# 安装系统依赖
sudo apt install -y ca-certificates curl git gnupg unzip wget zip

# 添加 Node.js 软件源
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

# 安装 Node.js
sudo apt update
sudo apt install -y nodejs

# 安装 Yarn 和面板前端依赖
cd "$PTERODACTYL_DIRECTORY"
sudo npm install -g yarn
yarn install
```

## 配置 Falixer

Falixer 需要通过 `.blueprintrc` 读取 Web 服务用户、文件所有者和 Shell 环境。文件名属于框架的底层兼容标识，请勿修改。

```bash
# 创建配置文件
touch "$PTERODACTYL_DIRECTORY/.blueprintrc"
```

Debian 和 Ubuntu 通常使用 `www-data` 运行 Web 服务。可使用以下默认配置：

```bash
# 写入 Falixer 运行配置
echo \
'WEBUSER="www-data";
OWNERSHIP="www-data:www-data";
USERSHELL="/bin/bash";' > "$PTERODACTYL_DIRECTORY/.blueprintrc"
```

如果你的 Web 服务使用其他用户，请根据实际环境修改 `WEBUSER` 和 `OWNERSHIP`，否则可能出现文件权限错误。

## 激活商业授权

打开安装包附带的授权配置说明，将购买后获得的授权凭据写入指定配置位置。授权必须与当前面板和服务器环境匹配。

请勿把授权密钥发送给他人、提交到 Git 仓库或粘贴到公开的日志与工单中。如果授权验证失败，请检查：

1. 授权是否仍在有效期内；
2. 授权绑定的面板是否为当前面板；
3. 服务器能否正常访问授权验证服务；
4. 系统时间和时区是否正确。

## 运行 Falixer 安装程序

安装脚本仍使用兼容文件名 `blueprint.sh`。为脚本添加执行权限后运行安装程序：

```bash
# 添加执行权限
chmod +x "$PTERODACTYL_DIRECTORY/blueprint.sh"

# 运行 Falixer 安装程序
bash "$PTERODACTYL_DIRECTORY/blueprint.sh"
```

安装程序会自动完成所需的文件处理、依赖检查和面板构建。请勿在执行过程中关闭终端。

## 验证安装

安装完成后：

1. 登录 Pterodactyl 管理后台；
2. 检查 Falixer 管理页面是否可以正常打开；
3. 确认授权状态显示为有效；
4. 清理浏览器缓存后检查用户端页面；
5. 在安装扩展前再次创建完整备份。

如需启用 Bash 自动补全，可以将以下内容添加到 `.bashrc`；使用 ZSH 时则添加到 `.zshrc`：

```bash
source blueprint
```

## 安装完成

Falixer 已安装到你的 Pterodactyl 面板。接下来可以[浏览扩展](/browse)，或返回[指南中心](/guides)了解扩展管理、更新和开发流程。
