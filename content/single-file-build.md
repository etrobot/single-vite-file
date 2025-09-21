---
title: "关于单文件构建"
date: "2025-01-20"
id: 2
category: "技术"
---

# 关于单文件构建

使用**vite-plugin-singlefile**插件，我们可以将整个React应用打包成一个单独的HTML文件，包含所有的CSS和JavaScript代码。

## 优势

1. **部署简单** - 只需要一个HTML文件
2. **无依赖** - 不需要服务器配置
3. **快速分享** - 可以直接通过邮件或网盘分享
4. **离线访问** - 完全离线可用
5. **文件管理** - 内容可以分文件管理

## 配置方法

```javascript
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
```

## 内容管理

现在所有的博客文章都可以作为独立的Markdown文件存储在 `content` 文件夹中，支持frontmatter元数据：

```yaml
---
title: "文章标题"
date: "2025-01-20"
id: 1
---
```

这样部署和分享就变得非常简单！