import { useState, useRef } from 'react'
import { marked } from 'marked'
import { Upload, Download, FileText, Image, X, ArrowLeft } from 'lucide-react'

export function Md2Html({ onBack }) {
  const [markdownFiles, setMarkdownFiles] = useState([])
  const [images, setImages] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        handleImageFile(file)
      } else if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        handleMarkdownFile(file)
      }
    })
  }

  const handleMarkdownFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newFile = {
        name: file.name,
        content: e.target.result,
        id: Date.now() + Math.random() // 生成唯一ID
      }
      setMarkdownFiles(prev => [...prev, newFile])
    }
    reader.readAsText(file)
  }

  const handleImageFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      setImages(prev => ({
        ...prev,
        [file.name]: base64
      }))
    }
    reader.readAsDataURL(file)
  }

  const processMarkdownWithImages = (markdown) => {
    let processedMarkdown = markdown
    
    // 使用类似 loadPosts.js 的图片处理逻辑
    const imageRegex = /!\[([^\]]*?)\]\s*\(([^)\s]+?)(?:\s+\"([^\"]*)\")?\)/g;
    
    processedMarkdown = processedMarkdown.replace(imageRegex, (match, alt, src, title) => {
      // 如果是网络图片，保持不变
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
        return match;
      }
      
      // 查找匹配的本地图片
      const filename = src.split('/').pop(); // 获取文件名
      if (images[filename]) {
        let newImage = `![${alt}](${images[filename]})`;
        if (title) newImage = `![${alt}](${images[filename]} "${title}")`;
        return newImage;
      }
      
      // 如果没找到对应图片，尝试直接匹配src
      const matchingImage = Object.entries(images).find(([imgName]) => 
        src.includes(imgName) || imgName.includes(src)
      );
      
      if (matchingImage) {
        let newImage = `![${alt}](${matchingImage[1]})`;
        if (title) newImage = `![${alt}](${matchingImage[1]} "${title}")`;
        return newImage;
      }
      
      console.warn(`Image not found: ${src}`);
      return match;
    });
    
    return processedMarkdown
  }

  const combineMarkdownFiles = () => {
    if (markdownFiles.length === 0) return '';
    
    // 按文件名排序
    const sortedFiles = [...markdownFiles].sort((a, b) => a.name.localeCompare(b.name));
    
    // 合并所有文件内容
    return sortedFiles.map((file, index) => {
      let content = file.content;
      
      // 为每个文件添加标题（除了第一个文件，如果它已经有h1标题）
      if (index > 0 || !content.trim().startsWith('#')) {
        const title = file.name.replace('.md', '').replace(/[-_]/g, ' ');
        content = `# ${title}\n\n${content}`;
      }
      
      return content;
    }).join('\n\n---\n\n'); // 用分隔线分开不同文件
  }

  const generateHtml = () => {
    const combinedMarkdown = combineMarkdownFiles()
    const processedMarkdown = processMarkdownWithImages(combinedMarkdown)
    const htmlContent = marked(processedMarkdown)
    
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown转换结果</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
        p { margin-bottom: 16px; }
        code {
            background-color: rgba(27,31,35,.05);
            border-radius: 3px;
            font-size: 85%;
            margin: 0;
            padding: .2em .4em;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
        }
        pre code {
            background-color: transparent;
            border: 0;
            display: inline;
            line-height: inherit;
            margin: 0;
            overflow: visible;
            padding: 0;
            word-wrap: normal;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            margin: 0;
            padding: 0 16px;
            color: #6a737d;
        }
        table {
            border-collapse: collapse;
            margin: 16px 0;
            width: 100%;
        }
        table th, table td {
            border: 1px solid #dfe2e5;
            padding: 6px 13px;
        }
        table th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        ul, ol {
            padding-left: 30px;
        }
        li {
            margin-bottom: 4px;
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`
    
    return fullHtml
  }

  const downloadHtml = () => {
    const html = generateHtml()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const removeImage = (filename) => {
    setImages(prev => {
      const newImages = { ...prev }
      delete newImages[filename]
      return newImages
    })
  }

  const removeMarkdownFile = (fileId) => {
    setMarkdownFiles(prev => prev.filter(file => file.id !== fileId))
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            返回
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Markdown to HTML 转换器
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            {/* 文件拖拽区域 */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                拖拽 Markdown 文件和图片到这里，或点击选择文件
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FileText size={16} />
                  选择 MD 文件
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Image size={16} />
                  选择图片
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Markdown 文件管理 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  Markdown 文件 ({markdownFiles.length})
                </h3>
              </div>
              <div className="p-4">
                {markdownFiles.length > 0 ? (
                  <div className="space-y-3">
                    {markdownFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-700 rounded-t-lg">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-blue-500" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeMarkdownFile(file.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="p-3 max-h-48 overflow-y-auto">
                          <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                            {file.content.length > 500 
                              ? file.content.substring(0, 500) + '...' 
                              : file.content
                            }
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>还没有 Markdown 文件</p>
                    <p className="text-sm">拖拽或点击上方按钮添加文件</p>
                  </div>
                )}
              </div>
            </div>

            {/* 图片管理 */}
            {Object.keys(images).length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    已上传的图片
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {Object.entries(images).map(([filename, base64]) => (
                    <div key={filename} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-700 rounded">
                      <div className="flex items-center gap-3">
                        <img src={base64} alt={filename} className="w-10 h-10 object-cover rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{filename}</span>
                      </div>
                      <button
                        onClick={() => removeImage(filename)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：预览和导出 */}
          <div className="space-y-6">
            {/* 预览区域 */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  HTML 预览
                </h3>
                <button
                  onClick={downloadHtml}
                  disabled={markdownFiles.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  下载 HTML
                </button>
              </div>
              <div className="p-4 h-96 overflow-y-auto">
                {markdownFiles.length > 0 ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: marked(processMarkdownWithImages(combineMarkdownFiles()))
                    }}
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    预览将在您添加 Markdown 文件后显示...
                  </p>
                )}
              </div>
            </div>

            {/* 使用说明 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  使用说明
                </h3>
              </div>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>• 支持拖拽或选择多个 .md 文件，自动合并为单一 HTML</p>
                <p>• 支持拖拽或选择图片文件，自动转换为 base64 格式</p>
                <p>• 多个文件按文件名排序，自动添加标题和分隔线</p>
                <p>• 在 Markdown 中使用图片文件名引用图片</p>
                <p>• 生成的 HTML 文件包含所有样式和图片，可独立使用</p>
                <p>• 所有处理都在浏览器中完成，无需服务器</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}