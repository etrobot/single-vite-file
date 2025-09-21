# 单文件静态博客

这是一个使用 React 和 Vite 构建的单文件静态博客项目。整个应用（包括所有博客内容）会编译成一个独立的 HTML 文件，可以部署到任何地方，无需额外依赖。

## 项目特点

- **单文件输出**：所有 JS、CSS 和 Markdown 内容内联到一个 HTML 文件中，实现零依赖部署。
- **Markdown 博客**：博客文章存储在 `content/` 目录的 Markdown 文件中，支持 YAML 前言（title、date、id、category）。
- **响应式设计**：支持桌面和移动端，带有可折叠侧边栏导航。
- **暗黑模式**：通过 React Context 和 localStorage 实现主题切换，支持系统偏好检测。
- **分类导航**：自动按 category 和 subcategory 组织文章，支持展开/折叠。
- **打印优化**：支持生成打印友好版本的 HTML（用于 PDF 转换）。

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动开发服务器，通常在 `http://localhost:5173` 上运行。

### 构建生产版本

```bash
npm run build
```

生成单文件 HTML 输出到 `dist/index.html`。

### 构建打印版本

```bash
npm run build:print
```

生成打印优化的单文件 HTML 输出到 `dist-print/print.html`（基于 `print.html` 输入）。
可以通过浏览器的打印到pdf功能生成pdf

### 代码检查

```bash
npm run lint
```

运行 ESLint 检查代码风格。

### 预览生产构建

```bash
npm run preview
```

在本地预览生产版本。

## 内容管理

1. 在 `content/` 目录添加新的 `.md` 文件。
2. 在文件开头添加 YAML 前言，例如：
   ```yaml
   ---
   title: "文章标题"
   date: "2025-01-21"
   id: 1
   category: "技术"
   subcategory: "前端"  # 可选
   ---
   正文内容...
   ```
3. 运行 `npm run build` 自动发现并嵌入所有文章。

## 构建架构

- **自定义 Vite 插件**：使用 `vite-plugin-posts.js` 创建虚拟模块 `virtual:posts`，在构建时读取 Markdown 文件。
- **内容加载**：`src/loadPosts.js` 使用 `gray-matter` 解析 YAML 和 Markdown。
- **单文件打包**：`vite-plugin-singlefile` 将所有资源内联到单个 HTML 文件。
- **样式**：基于 Tailwind CSS，支持暗黑模式（`darkMode: 'class'`）。

## 部署

只需上传 `dist/index.html` 到任何静态托管服务（如 GitHub Pages、Netlify）。打印版本可用于生成 PDF。

## 开发注意事项

- 确保自定义插件 `generatePostsPlugin()` 在插件数组中位于 `viteSingleFile()` 之前。
- 主题切换需在 `main.jsx` 中包裹 `<ThemeProvider>`。
- 更多细节见 [CLAUDE.md](CLAUDE.md)（Claude Code 专用指导）。

如有问题，参考 [Vite 文档](https://vitejs.dev/) 或 [React 文档](https://react.dev/)。