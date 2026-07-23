---
title: 创建第二个管理页面
description: 为扩展管理页面添加配置选项
author: Sirzento and Emma
category: dev
thumbnail: adminconfiguration.jpeg
order: 4
---

## 简介

本指南介绍如何通过 [BlueprintExtensionLibrary](/docs/lib/methods) 数据库方法，在管理控制器中加载和保存扩展配置；同时还会创建迁移以初始化默认值，并使用自定义表单请求验证输入。

## 控制器

### 设置控制器

创建[自定义控制器](/guides/dev/admincontroller)后，可以继续添加加载和保存配置值的功能。

首先在 `admin.controller` 中导入所需的类：

```php [controller.php]
namespace Pterodactyl\Http\Controllers\Admin\Extensions\{identifier};

use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;
use Illuminate\Http\RedirectResponse;

use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Admin\BlueprintAdminLibrary as BlueprintExtensionLibrary;
```

大多数类已经在[自定义控制器](/guides/dev/admincontroller)中介绍过。

新增的类包括：

- `AdminFormRequest`：处理表单输入验证。
- `RedirectResponse`：保存更改后将用户重定向回管理页面。

在控制器构造函数中注入 `SettingsRepositoryInterface`：

```php [controller.php]
public function __construct(
  private ViewFactory $view,
  private BlueprintExtensionLibrary $blueprint,
  private SettingsRepositoryInterface $settings,
) {}
```

### 加载配置

扩展 `index()` 方法以读取当前配置值。

本例添加 `theme`、`customName` 和 `count` 三项配置：

```php [controller.php]
public function index(): View
{
  $theme = $this->blueprint->dbGet('{identifier}', 'theme');
  $customName = $this->blueprint->dbGet('{identifier}', 'customName');
  $count = $this->blueprint->dbGet('{identifier}', 'count');

  return $this->view->make(
    'admin.extensions.{identifier}.index', [
      'theme' => $theme,
      'customName' => $customName,
      'count' => $count,
      'root' => "/admin/extensions/{identifier}",
      'blueprint' => $this->blueprint,
  ]
);
```

`$blueprint->dbGet()` 用于从数据库读取值。方法末尾会返回 Blade 视图及配置值。

::card
有关 Falixer 数据库方法的更多信息，请参阅 [BlueprintExtensionLibrary 文档](/docs/lib/methods)。
::

### 保存配置

在控制器中添加 `update()` 方法以保存配置。当用户通过 `PATCH` 请求提交管理表单时会调用该方法。

```php [controller.php]
public function update({identifier}SettingsFormRequest $request): RedirectResponse
{
  foreach ($request->normalize() as $key => $value) {
    $this->blueprint->dbSet("{identifier}", $key, $value);
  }

  return redirect()->route('admin.extensions.{identifier}.index');
}

```

`update()` 接收已经验证的表单请求，并通过 [BlueprintExtensionLibrary](/docs/lib/methods#set-a-record-in-the-database) 的 `dbSet()` 保存每项设置。完成后会重定向到 `index()`，刷新管理页面中的数据。

### 输入验证

最后，在控制器类外部、文件底部创建表单请求类，用于验证传入数据：

```php [controller.php]
class {identifier}SettingsFormRequest extends AdminFormRequest
{
  public function rules(): array
  {
    return [
      'theme' => ['string', 'in:1,2,3'],
      'customName' => ['string'],
      'count' => ['numeric'],
    ];
  }

  public function attributes(): array
  {
    return [
      'theme' => 'Theme',
      'customName' => 'Custom Name',
      'count' => 'Count',
    ];
  }
}

```

- `rules()` 定义每个输入字段的验证规则。
- `attributes()` 提供用于验证错误消息的易读字段名。

::card
更多验证规则请参阅 [Laravel 验证文档](https://laravel.com/docs/10.x/validation#available-validation-rules)。
::

## 使用迁移定义默认配置

::card
本节仅介绍迁移的基础用法。要深入了解如何在 Falixer 中定义迁移，请先阅读[自定义数据表与迁移](/guides/dev/migrations)。
::

可以使用数据库迁移定义扩展配置结构并注册默认值，确保安装扩展时正确初始化设置。

[创建迁移文件](/guides/dev/migrations)，并添加以下逻辑：

```php
<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;
use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Admin\BlueprintAdminLibrary as BlueprintExtensionLibrary;

return new class extends Migration
{
  public function up(): void
  {
    $blueprint = app(BlueprintExtensionLibrary::class);

    $blueprint->dbSetMany("{identifier}", [
      'theme' => '0',
      'customName' => 'superuser',
      'count' => 10,
    ]);
  }

  public function down(): void
  {
    DB::table('settings')->where('key', 'like', '{identifier}::%')->delete();
  }
};
```

- `up` 通过 [BlueprintExtensionLibrary 的 `dbSetMany()` 方法](/docs/lib/methods#set-multiple-records-in-the-database)插入默认键值对。
- `down` 删除所有匹配扩展键前缀的设置，以撤销这些更改。

## 视图

### 表单结构

```php
<form id="config-form" action="" method="POST">
  ...
  {{ csrf_field() }}
  <button type="submit" name="_method" value="PATCH" class="btn btn-primary">Save Changes</button>
</form>
```

这是可在视图中使用的基础表单结构。表单使用 `POST` 而不是 `PATCH`，因为 [HTML 表单不直接支持 PATCH 请求](https://laravel.com/docs/10.x/routing#form-method-spoofing)。因此，提交按钮通过 `name="_method"` 和 `value="PATCH"` 指定实际请求方法。

`{{ csrf_field() }}` 会在表单中插入隐藏的 CSRF 令牌，Laravel 使用它防止跨站请求伪造（CSRF）攻击，并确认提交来自已认证的可信来源。

### 表单字段

按照当前示例，在表单中为 `customName` 添加文本输入框，为 `theme` 添加下拉框，并为 `count` 添加数字输入框：

```html [view.blade.php]
<form id="config-form" action="" method="POST">
  <input
    type="text"
    name="customName"
    id="customName"
    value="{{ $customName }}"
    placeholder="在此输入"
    class="form-control"
  />
  <select class="form-control" name="theme">
    <option value="0" @if($theme="" ="0" ) selected @endif>Theme 1</option>
    <option value="1" @if($theme="" ="1" ) selected @endif>Theme 2</option>
    <option value="2" @if($theme="" ="2" ) selected @endif>Theme 3</option>
  </select>

  <input
    type="number"
    name="count"
    id="count"
    value="{{ $count }}"
    placeholder="10"
    class="form-control"
  />

  {{ csrf_field() }}
  <button type="submit" name="_method" value="PATCH" class="btn btn-primary">
    保存更改
  </button>
</form>
```

至此配置页面已经完成，现在应能正常加载并保存管理配置。
