---
title: 扩展用户仪表盘包装器
description: 使用 Laravel Blade 包装器扩展 Pterodactyl 用户仪表盘
author: Emma
category: dev
thumbnail: dashboard.jpeg
order: 50
---

::card
仪表盘包装器不应作为扩展仪表盘的首选方案。其功能较为有限，也可能导致 React DOM 异常。如果扩展场景支持，请优先使用 [Components.yml](/docs/configs/componentsyml)。
::

## 简介

Falixer 的 `dashboard.wrapper` [conf.yml](/docs/configs/confyml#dashboardwrapper) 绑定可通过 `.blade.php` 视图扩展用户端仪表盘。本指南将添加一个用于演示的“翻滚页面”按钮。

## 创建基础仪表盘包装器

创建 `wrapper.blade.php` 文件，并在扩展的 [conf.yml](/docs/configs/confyml) 中将其绑定到 `dashboard.wrapper`。

```yaml [conf.yml]
dashboard:
  # 将 dashboard.wrapper 绑定到刚创建的
  # wrapper.blade.php 文件：
  wrapper: 'wrapper.blade.php'
```

在 `dashboard.wrapper` 中添加一个简单按钮，然后运行 `blueprint -build` 应用更改。

<!-- prettier-ignore -->
```html [wrapper.blade.php]
<button style="background: black;">
  示例按钮
</button>
```

在浏览器中访问 Pterodactyl 实例，页面效果应与下图类似：

![Pterodactyl 面板左下角显示“示例按钮”。](/img/guides/examplebutton.png)

## 实现页面翻滚

按钮已经创建，接下来修改按钮文字并为其添加唯一标识符。

::card
按钮的 `id=` 使用 `{identifier}` [占位符](/docs/concepts/placeholders#identifier)作为前缀，以免多个扩展为不同元素使用相同标识符而发生冲突。

例如，“foo”和“bar”扩展都拥有标识符为 `fizz` 的元素。当“foo”通过 JavaScript 修改自己的 `fizz` 元素时，也可能误改“bar”中的同名元素。

_简而言之：不要为元素使用过于通用的 ID。_
::

<!-- prettier-ignore -->
```html [wrapper.blade.php]
<button id="{identifier}-barrel" style="background: black;">
  翻滚页面！
</button>
```

### 点击按钮时运行方法

现在创建一个 JavaScript 方法，并让 `{identifier}-barrel` 按钮在点击时调用它。

::card
方法名也可能发生与 `id=` 相同的冲突。但在方法名中加入占位符可能破坏语法高亮，因此可以接受高亮异常，或改用足够独特的方法名。
::

<!-- prettier-ignore -->
```html [wrapper.blade.php]
<script>
function doBarrelRoll() {
  // 按钮已触发
  console.log("something happened!!")
}
</script>
```

<!-- prettier-ignore -->
```diff [wrapper.blade.php]
- <button id="{identifier}-barrel" style="background: black;">
+ <button id="{identifier}-barrel" onclick="doBarrelRoll()" style="background: black;">
```

### 添加动画

下面使用 CSS 动画旋转页面。与元素和脚本一样，也可以在 `dashboard.wrapper` 中添加样式。

::card
`dashboard.wrapper` 的 `<style />` 标签与 `dashboard.css` 略有不同：`dashboard.css` 会随 React 应用一起打包，而 `dashboard.wrapper` 不会。

为 `dashboard.wrapper` 创建的元素编写样式时，应直接使用 `dashboard.wrapper`；修改 React 应用中的元素时，应使用 `dashboard.css`。
::

<!-- prettier-ignore -->
```html [wrapper.blade.php]
<style>
@keyframes barrelRoll {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.barrel-roll {
  animation: barrelRoll 1s ease-in-out;
}
</style>
```

该 CSS 动画会旋转所有包含 `barrel-roll` 类的元素。点击 `{identifier}-barrel` 时，JavaScript 会把该类添加到 `body` 元素。

### 应用动画类

更新 JavaScript 方法，使 `doBarrelRoll()` 被调用时将 `barrel-roll` 类添加到 `body` 元素。

<!-- prettier-ignore -->
```html [wrapper.blade.php]
<script>
function doBarrelRoll() {
  const body = document.body;
  body.classList.add('barrel-roll');

  setTimeout(() => {
    body.classList.remove('barrel-roll');
  }, 1000);
}
</script>
```

## 最终效果

运行 `blueprint -build` 应用更改，然后在浏览器中访问面板。最终效果如下：

:prose-video-player{src='/img/guides/barrelroll.mp4'}
