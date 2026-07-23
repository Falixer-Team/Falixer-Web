---
title: 自定义管理页面控制器
description: 使用自定义控制器渲染扩展管理视图
author: Emma
category: dev
thumbnail: controller.jpeg
order: 3
---

## 简介

通过 `admin.controller` 的 [conf.yml 绑定](/docs/configs/confyml#admincontroller)，可以为 `admin.view` 添加渲染逻辑，并处理其他 HTTP 请求方法。

管理视图始终通过控制器渲染。如果扩展未提供自定义控制器，则会使用 Falixer 内置的默认控制器。

## 创建控制器

创建 `controller.php` 文件，并在 [conf.yml](/docs/configs/confyml#admincontroller) 中将其绑定到 `admin.controller`。

```yaml [conf.yml]
admin:
  controller: 'controller.php'
```

随后将以下代码添加到 `controller.php`。

```php [controller.php]
<?php

// 定义管理控制器所需的命名空间。
// 安装扩展时，{identifier} 会自动替换为扩展标识符。
namespace Pterodactyl\Http\Controllers\Admin\Extensions\{identifier};

// 导入控制器基类。
use Pterodactyl\Http\Controllers\Controller;

// 注册扩展专用控制器类。
class {identifier}ExtensionController extends Controller {
  // 收到 GET 请求时调用 index()。
  public function index() {
    // 返回纯文本响应。
    return "hello from {identifier}'s custom controller"
  }
}
```

打开扩展管理页面，此时应能看到纯文本响应。

![](/img/guides/hellocontroller.jpeg)

接下来让控制器渲染实际的管理视图。

## 渲染管理视图

在 `namespace` 定义之后，将以下类导入 `controller.php`，后续方法会使用它们。

```php [controller.php]
// 导入渲染视图所需的类。
use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;

// 导入 BlueprintExtensionLibrary，管理视图需要该类才能工作。
use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Admin\BlueprintAdminLibrary as BlueprintExtensionLibrary;
```

在控制器类中添加 `__construct()` 方法。实例化该类时会自动调用此方法。

```php [controller.php]
class {identifier}ExtensionController extends Controller {
  public function __construct(
    private ViewFactory $view,
    private BlueprintExtensionLibrary $blueprint,
  ) {}

  // 其他方法
}
```

### 更新 `index()` 方法

由于控制器将渲染视图，返回类型也应设为 `View`。该类型已在[上一步](#渲染管理视图)通过 `use Illuminate\View\View;` 导入。

```diff [controller.php]
- public function index() {
+ public function index(): View {
```

现在可以返回视图，而不是纯文本响应。

以下代码通过 ViewFactory 的 `$this->view->make` 创建视图，并向视图提供 `$root` 和 `$blueprint` 变量。

```diff [controller.php]
public function index(): View {
- return "hello from {identifier}'s custom controller"
+ return $this->view->make(
+   'admin.extensions.{identifier}.index', [
+     'root' => "/admin/extensions/{identifier}",
+     'blueprint' => $this->blueprint,
+   ]
+ );
}
```

保存更改并重新访问扩展管理页面，此时应显示管理视图，而非之前的纯文本响应。

## 向视图传递变量

通过 ViewFactory 的 `make()` 方法，可以定义管理视图中可用的变量。

以下代码向视图添加值为 `bar` 的 `$foo` 变量。

```diff [controller.php]
public function index(): View {
+ $foo = 'bar'
  return $this->view->make(
    'admin.extensions.{identifier}.index', [
      'root' => "/admin/extensions/{identifier}",
      'blueprint' => $this->blueprint,
+     'foo' => $foo,
    ]
  );
}
```

随后在管理视图（[conf.yml](/docs/configs/confyml#adminview-required) 中的 `admin.view`）中输出 `$foo` 变量。

此处假设 `admin.view` 文件名为 `view.blade.php`，实际文件名可以根据扩展配置调整。

<!-- prettier-ignore -->
```html [view.blade.php]
<p> {{ $foo }} </p>
```

保存更改并安装扩展，然后检查管理视图。页面中应出现内容为 `bar`（即 `$foo` 的值）的段落元素。

## 最终代码

下面是按照上述步骤组合而成的完整 `controller.php`。

可以直接复制该文件，但仍建议逐步完成前面的操作，以便理解每部分代码的作用。完整代码仅供对照。

```php [controller.php]
<?php

// 定义管理控制器所需的命名空间。
// 安装扩展时，{identifier} 会自动替换为扩展标识符。
namespace Pterodactyl\Http\Controllers\Admin\Extensions\{identifier};

// 导入渲染视图所需的类。
use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;
// 导入控制器基类。
use Pterodactyl\Http\Controllers\Controller;
// 导入 BlueprintExtensionLibrary，管理视图需要该类才能工作。
use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Admin\BlueprintAdminLibrary as BlueprintExtensionLibrary;

// 注册扩展专用控制器类。
class {identifier}ExtensionController extends Controller {
  public function __construct(private ViewFactory $view, private BlueprintExtensionLibrary $blueprint) {}

  // 渲染页面。当 /admin/extensions/{identifier}
  // 收到 GET 请求时调用 index()。
  public function index(): View {
    // 将 $foo 变量设为 'bar'。
    $foo = 'bar';
    // 渲染管理视图，并传入 URL 路径、BlueprintExtensionLibrary
    // 和 $foo 变量。这些变量可直接在视图中使用。
    return $this->view->make(
      'admin.extensions.{identifier}.index', [
        'root' => "/admin/extensions/{identifier}",
        'blueprint' => $this->blueprint,
        'foo' => $foo,
      ]
    );
  }
}
```

## 继续学习

控制器已经完成，但管理页面还没有配置选项。下一步继续构建[第二个管理页面](/guides/dev/adminconfiguration)。
