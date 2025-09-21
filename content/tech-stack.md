---
title: "技术栈介绍"
date: "2025-01-19"
id: 3
category: "技术"
---

# 技术栈介绍

这个博客使用的技术栈包括：

## 前端框架
- **React** - 用于构建用户界面
- **JavaScript** - 主要编程语言

## 构建工具
- **Vite** - 快速的构建工具
- **vite-plugin-singlefile** - 生成单文件输出

## Markdown支持
- **marked** - Markdown解析库
- **gray-matter** - Frontmatter解析

## 样式
- **CSS3** - 现代化样式
- **响应式设计** - 适配各种设备

## 内容管理
- **文件系统** - 基于文件的内容管理
- **Frontmatter** - YAML格式的元数据

整个应用轻量且快速，非常适合个人博客使用。

### 代码示例

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{
        __html: marked(post.content)
      }} />
    </article>
  )
}
```

### 文件结构

```
project/
├── content/          # Markdown文件
│   ├── welcome.md
│   ├── guide.md
│   └── tech-stack.md
├── src/
│   ├── App.jsx       # 主应用
│   └── App.css       # 样式
└── dist/
    └── index.html    # 单文件输出
```

**注意**：使用基于文件的内容管理系统，你可以轻松地添加、编辑和管理博客文章！