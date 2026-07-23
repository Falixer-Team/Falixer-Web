---
title: 创建第一个管理页面
description: 为扩展构建一个简单的管理页面
author: Emma
category: dev
thumbnail: adminpage.jpeg
order: 2
---

## 简介

每个扩展都有一个管理页面（更准确地说是管理视图）。管理员通常通过该页面配置扩展，并可从 Falixer 的扩展列表进入。

## 创建管理视图

在开发目录中创建 `view.blade.php` 文件，该文件的内容将显示在扩展管理页面中。

在 [conf.yml](/docs/configs/confyml#adminview-required) 中将其绑定到 `admin.view`。绑定用于告诉 Falixer 各文件或目录的用途。

```yaml [conf.yml]
admin:
  # 将 view.blade.php 文件绑定到 admin.view
  view: 'view.blade.php'
```

## 添加内容

现在可以打开刚创建的 `view.blade.php`，并向管理视图添加内容。

::card
`.blade.php` 文件本质上是支持运行 PHP 代码和 Blade 模板指令的 HTML。更多信息请参阅 Laravel 文档中的 [Blade 模板与指令](https://laravel.com/docs/10.x/blade#blade-directives)。
::

```html [view.blade.php]
<div style="background: black; padding: 5px;">
  <span style="color: white;"> 我的扩展名称是 {name} </span>
</div>
```

保存文件并运行 `blueprint -build` 应用更改。在 Pterodactyl 管理面板中打开 Falixer 扩展列表（管理 > 扩展），点击你的扩展即可查看效果。

![](/img/guides/simpleadminview.jpeg)

## 继续学习

基础管理页面已经完成。下一步可以添加配置选项，但在此之前需要先创建一个[管理控制器](/guides/dev/admincontroller)。
