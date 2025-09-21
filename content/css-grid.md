---
title: "CSS Grid布局详解"
date: "2025-01-17"
id: 5
category: "技术"
subcategory: "CSS"
---

# CSS Grid布局详解

CSS Grid是一个强大的二维布局系统，让我们能够创建复杂的网页布局。

## 基本概念

### Grid容器
```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
```

### Grid项目
```css
.item {
  grid-column: 1 / 3;
  grid-row: 2 / 4;
}
```

## 实用属性

- `grid-template-areas` - 定义网格区域
- `justify-items` - 水平对齐
- `align-items` - 垂直对齐
- `grid-auto-flow` - 自动放置算法

## 响应式Grid

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

CSS Grid让布局变得简单而强大！