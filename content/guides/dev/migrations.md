---
title: 自定义数据表与迁移
description: 添加自定义数据表，存储用户专属设置或复杂数据结构
author: Sirzento and Emma
category: dev
thumbnail: migrations.jpeg
order: 5
---

[BlueprintExtensionLibrary](/docs/lib/methods#database) 的 `dbGet()` 和 `dbSet()` 可以便捷地存储扩展级数据。但对于用户专属设置或复杂数据集，需要更精细的控制，此时可以使用自定义数据表和迁移。

## 定义迁移

首先确定扩展需要存储的数据类型，然后创建迁移以管理数据库结构。迁移用于向面板数据库结构添加扩展专属数据表。

在 [`database.migrations` conf.yml 绑定](/docs/configs/confyml#databasemigrations)中指定迁移文件目录：

```yml [conf.yml]
database:
  migrations: 'migrations'
```

::card
这里需要指定目录，**而不是单个文件**。迁移具有版本顺序，并且每个迁移只执行一次；后续结构更新应通过新增迁移文件完成。
::

### 迁移文件结构

迁移文件必须遵循以下命名格式：
`YYYY_MM_DD_HHMMSS_migration_name.php`.

该格式可确保迁移按正确顺序执行。命名文件时请使用当前日期和时间。

以下示例创建一个存储用户专属数据的表：

```php [2025_04_23_163000_add_userdata_table.php]
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
    * 执行迁移。
    */
  public function up(): void
  {
    Schema::create('{identifier}_userdata', function (Blueprint $table) {
      $table->unsignedInteger('user_id');
      $table->foreign('user_id')->references('id')->on('users');
      $table->boolean('enabled')->default(0);
      $table->string('customName')->default("");
      $table->json('categories')->default("[]");
    });
  }

  /**
    * 回滚迁移。
    */
  public function down(): void
  {
    Schema::drop('{identifier}_userdata');
  }
};
```

每个迁移文件都包含 `up()` 和 `down()` 两个主要方法，用于定义迁移执行时的数据库更改及其撤销方式。

- 首次应用迁移时执行 `up()`，其中定义要对数据库结构进行的更改。上例创建了 `{identifier}_userdata` 表，其中包含：
  - 引用 `users` 表的外键 `user_id`；
  - 布尔字段 `enabled`（默认值为 `0`）；
  - 字符串字段 `customName`（默认为空字符串）；
  - JSON 字段 `categories`（默认为空数组 `[]`）。

- `down()` 与 `up()` 相反，用于定义如何**回滚**迁移。多数情况下只需使用 `Schema::dropIfExists('{identifier}_userdata')` 删除数据表。

这种结构让数据库迁移既可通过 `up()` 向前应用，也可通过 `down()` 撤销，便于长期维护数据库结构版本。

::card
更多信息请参阅 [Laravel 迁移文档](https://laravel.com/docs/10.x/migrations)。
::

## 从数据表读取数据

使用 Laravel 内置的 `DB` 门面读取数据。首先在控制器中导入：

```php
use Illuminate\Support\Facades\DB;
```

随后定义查询数据表的方法。以下示例读取当前用户的 `categories`：

```php
public function getCategories() {
  // 检查当前请求是否存在已认证用户
  $user = auth()->user();
  if ($user == null) {return response(null);}

  // 根据用户 ID 获取对应数据
  $data = DB::table('{identifier}_userdata')->where('user_id', $user->id)->first();
  // 检查数据是否存在
  if ($data == null) {return response(null);}

  // 返回所需数据
  return response($data->categories);
}
```

该方法先检查用户是否已认证，再使用用户 ID 查询数据表，并在找到记录时返回 `categories` 字段。

## 向数据表保存数据

保存逻辑与[管理页面配置指南](/guides/dev/adminconfiguration)中的实现类似。

```php
public function update({identifier}UserSettingsFormRequest $request) {
  $userId = auth()->user()->id;
  $valuesToUpdate = $request->normalize();

  DB::table('{identifier}_userdata')
    ->updateOrInsert(
      ['user_id' => $userId],
      $valuesToUpdate
    );

  return response()->json($valuesToUpdate);
}
```

该方法保存或更新自定义表中的用户记录。`updateOrInsert()` 会自动处理新增与更新。

## 输入验证

在控制器文件末尾定义自定义表单请求，以验证传入数据：

```php
class {identifier}UserSettingsFormRequest extends AdminFormRequest
{
  public function rules(): array
  {
    return [
      'enabled' => 'nullable|numeric|min:0|max:1',
      'customName' => 'nullable|string',
      'categories' => 'nullable|string',
    ];
  }

  public function attributes(): array
  {
    return [
      'enabled' => 'Enabled',
      'categories' => 'Categorie',
      'customName' => 'Custom Name',
    ];
  }
}
```

这可以确保传入数据符合预期格式，并防止向数据表写入无效内容。

完成后，扩展即可高效存储复杂数据或用户级数据。
