---
title: 使用 Blueprint Docker 开发
description: 配置 Blueprint Docker 本地开发环境
author: Loki and Emma
category: dev
thumbnail: blueprintdockerdev.jpg
order: -1
---

::card
本指南专用于本地扩展开发。如果要在生产环境中使用 Blueprint Docker，请按照仓库 [README](https://github.com/BlueprintFramework/docker#readme) 中的说明操作。
::

## 创建目录并获取文件

首先创建 `/srv/pterodactyl` 目录并进入该目录，然后下载 Blueprint 的 `docker-compose.yml`。

```bash
# 创建 /srv/pterodactyl 目录并进入该目录
mkdir -p /srv/pterodactyl
cd /srv/pterodactyl

# 将 Blueprint 的 docker-compose.yml 下载到当前目录
wget https://docker.bpfw.io/docker-compose.yml
```

## 配置环境变量

启动服务栈前，需要创建并填写一些环境变量。完整列表可在 [GitHub 仓库](https://raw.githubusercontent.com/BlueprintFramework/docker/refs/heads/Master/.env)中查看，下面按类别逐项说明。

```bash
# 创建 .env 并使用 nano 打开
touch .env
nano .env
```

将下面列出的环境变量粘贴到文件中，默认值可直接用于本地开发。

### 应用

以下环境变量与 Pterodactyl Web 服务有关，可按需调整。

```bash [/srv/pterodactyl/.env]
# 基础目录，默认为 /srv/pterodactyl
BASE_DIR=/srv/pterodactyl

# 应用名称，将显示在面板和面板发出的邮件中
APP_NAME="Pterodactyl"

# 面板的完全限定域名（FQDN），即访问面板时经过的第一个地址。
# 如果通过代理访问，请填写代理入口；家庭托管时可填写公网 IP
# 或对应域名；仅在本机测试时通常使用 http://localhost
FQDN="http://localhost"

# 使用的时区。可用时区列表：
# http://php.net/manual/en/timezones.php
TIMEZONE=Europe/Amsterdam

# 应用环境，可设为 'production' 或 'testing'
APP_ENV=testing

# 面板监听端口。要使用其他端口，请先在 docker-compose.yml
# 中分配端口，再在此处填写。生产环境建议启用 HTTPS。
PANEL_PORT=80
```

### 验证码

设置是否启用验证码，并按需填写 API 密钥。

```bash [/srv/pterodactyl/.env]
# 是否启用 reCAPTCHA
RECAPTCHA_ENABLED=false

# reCAPTCHA API 密钥，可在以下地址生成站点密钥
# https://www.google.com/recaptcha/admin
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

### 邮件

配置面板邮件、SMTP 连接信息和发件域名。

```bash [/srv/pterodactyl/.env]
# 发件域名
DOMAIN=blueprint.local

# 邮件驱动。要停用邮件功能，请设为 'array' 而不是 'smtp'
MAIL_DRIVER=array

# SMTP 连接信息
SMTP_SERVER=
SMTP_PORT=
SMTP_ENCRYPTION=tls
SMTP_USERNAME=
SMTP_APIKEY=
```

### Wings

定义 Wings 及其 SFTP 服务使用的端口。

```bash
# 定义 $WINGS_PORT 和 $WINGS_SFTP_PORT，
# 这些变量将写入 .env 并在后续步骤中使用
export WINGS_PORT=8080
export WINGS_SFTP_PORT=2022

# 将环境变量写入 .env
echo -e "WINGS_PORT=$WINGS_PORT\nWINGS_SFTP_PORT=$WINGS_SFTP_PORT" >> .env
```

::card
完成 Wings 配置后，如果修改 `WINGS_PORT` 或 `WINGS_SFTP_PORT`，还必须同步修改面板界面和 `wings/config.yml` 中的值。
::

### 密钥

最后，为面板数据库和 Redis/Valkey 生成密钥。

```bash
echo "MARIADB_ROOT_PASS=\"$(openssl rand -base64 32)\"" >> .env
echo "MARIADB_USER_PASS=\"$(openssl rand -base64 32)\"" >> .env
echo "VALKEY_PASS=\"$(openssl rand -base64 32)\"" >> .env
echo "HASH_SALT=\"$(openssl rand -base64 32)\"" >> .env
```

## 启动服务栈

完成配置后，通过 Docker Compose 启动服务栈。

```bash
# 启动服务栈
docker compose up -d
```

面板容器启动后，扩展开发需要访问的 Web 根目录位于 `/var/lib/docker/volumes/pterodactyl_app/_data`。可以创建符号链接，为其提供更易记的路径：

```
ln -s /var/lib/docker/volumes/pterodactyl_app/_data /srv/pterodactyl/webroot
```

如需以非 root 用户运行面板，请参阅 https://github.com/BlueprintFramework/docker/blob/Master/README.md#if-logged-in-as-a-non-root-user 中的详细说明。

## 连接 Wings

在 Pterodactyl 中运行服务器前，需要先创建节点，本例中的节点即 Wings。创建节点前还需要先创建位置。

### 创建位置

以下命令会在面板中创建位置。可以调整 `--short` 和 `--long` 参数，使位置名称和描述更明确。

```bash
# 创建名为 'earth'、描述为
# 'Somewhere on planet earth' 的位置
docker compose exec panel php artisan p:location:make \
  --short=earth \
  --long="Somewhere on planet earth"
```

这是创建的第一个位置，因此其 ID 为 `1`。

### 创建节点

位置创建完成后，可以运行以下命令创建节点。

::card
本步骤使用之前定义的 `$WINGS_PORT` 和 `$WINGS_SFTP_PORT`。如果当前 Shell 环境中已经没有这些变量，请从 `.env` 读取对应端口，并替换下面命令中的变量。
::

```bash
# 定义 Wings 使用的 FQDN 和 URL 协议，
# 这些选项与之前为面板设置的值类似。
#
# 这是访问 Wings 节点时经过的第一个地址。
# 如果 Wings 位于代理后方，请使用代理域名。
export $WINGS_SCHEME="http" #Can be either http or https
export $WINGS_FQDN="localhost"

# 计算可分配的内存和磁盘空间。以下脚本会预留系统开销：
# 资源较多时分配可用资源的 80%，资源较少时分配 95%。
MEM_FREE=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
DISK_FREE=$(df -m . | awk 'NR==2 {print $4}')
[ "$MEM_FREE" -lt 5120 ] && MEM_PCT=95 || MEM_PCT=80
[ "$DISK_FREE" -lt 25600 ] && DISK_PCT=95 || DISK_PCT=80
MEM_FREE=$(( MEM_FREE * MEM_PCT / 100 ))
DISK_FREE=$(( DISK_FREE * DISK_PCT / 100 ))

# 在面板中创建节点
docker compose exec panel php artisan p:node:make \
  --name="Node" \
  --description="My awesome node" \
  --locationId=1 \
  --fqdn="$WINGS_FQDN" \
  --public=1 \
  --scheme="$WINGS_SCHEME" \
  --proxy=0 \
  --maintenance=0 \
  --maxMemory=$MEM_FREE \
  --overallocateMemory=0 \
  --maxDisk=$DISK_FREE \
  --overallocateDisk=0 \
  --uploadSize=100 \
  --daemonListeningPort=$WINGS_PORT \
  --daemonSFTPPort=$WINGS_SFTP_PORT \
  --daemonBase=/srv/pterodactyl/wings/pterodactyl
```

### 配置 Wings

节点创建后，面板会生成 Wings 配置。需要将该配置写入 `wings/config.yml`。

```bash
# 将节点 1 的 Wings 配置写入 wings/config.yml
docker compose exec panel php artisan p:node:configuration 1 > wings/config.yml

# 重启 Wings
docker compose restart wings
```

Wings 重启后，打开 `wings/config.yml`。其中包含多项配置，这里重点调整目录定义以适配 Docker 环境。请按以下差异修改路径。

```diff [/srv/pterodactyl/wings/config.yml]
system:
+ root_directory: /srv/pterodactyl
+ log_directory: /srv/pterodactyl/wings/logs
+ archive_directory: /srv/pterodactyl/archives
+ backup_directory: /srv/pterodactyl/backups
- root_directory: /var/lib/pterodactyl
- log_directory: /var/log/pterodactyl
- archive_directory: /var/lib/pterodactyl/archives
- backup_directory: /var/lib/pterodactyl/backups
```

## 为 Blueprint 命令创建别名

要在宿主机上直接运行 `blueprint` 命令，请创建 Shell 别名。

```bash
# 在 bashrc 中为 Blueprint 创建别名
echo 'alias blueprint="docker compose -f /srv/pterodactyl/docker-compose.yml exec panel blueprint"' >> ~/.bashrc

# 重新加载 .bashrc
source ~/.bashrc

# 测试 Blueprint 命令，应输出已安装的版本
blueprint -v
```

::card
Blueprint 命令正常工作后，可参阅[管理扩展指南](/guides/admin/extensions#安装扩展)了解如何安装扩展。
::

## 创建第一个用户

要使用面板，需要先创建用户。运行以下命令完成创建。

```bash
# 创建用户并输出密码
docker compose exec panel php artisan p:user:make \
  --email="user@example.com" \
  --username="your-awesome-username" \
  --name-first="Jane" \
  --name-last="Doe" \
  --admin=1
```

## 完成

Blueprint Docker 本地扩展开发环境已经配置完成。现在可以初始化扩展并开始开发。
