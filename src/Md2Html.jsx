import { useState, useRef } from 'react'
import { marked } from 'marked'
import { Upload, Download, FileText, X, ArrowLeft } from 'lucide-react'
import { generatePrintHTML } from './PrintApp'

export function Md2Html({ onBack }) {
  const [markdownFiles, setMarkdownFiles] = useState([])
  const [images, setImages] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('Markdown 文档合集')
  const [documentSubtitle, setDocumentSubtitle] = useState('')
  const fileInputRef = useRef(null)

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
    if (markdownFiles.length === 0) return '';
    
    // 按文件名排序
    const sortedFiles = [...markdownFiles].sort((a, b) => a.name.localeCompare(b.name));
    
    // 转换为 generatePrintHTML 需要的格式
    const posts = sortedFiles.map((file, index) => ({
      id: file.id,
      title: file.name.replace('.md', '').replace(/[-_]/g, ' '), // 使用文件名生成标题
      content: file.content,
      filename: file.name
    }));
    
    // 使用通用的 generatePrintHTML 函数
    return generatePrintHTML({
      title: documentTitle,
      subtitle: documentSubtitle,
      posts: posts,
      processContent: processMarkdownWithImages
    });
  }

  const downloadHtml = () => {
    const html = generateHtml()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${documentTitle || 'document'}.html`
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Markdown to HTML 转换器
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：输入区域 */}
          <div className="lg:col-span-1 space-y-6">
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
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex  mx-auto biaoitems-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Upload size={16} />
                选择文件
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,image/*"
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
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
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
          </div>

          {/* 右侧：预览和导出 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 预览区域 */}
            <div className="bg-white rounded-lg shadow-lg" style={{ height: '80vh' }}>
              <div className="dark:text-white dark:bg-zinc-800 rounded-md p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    HTML预览
                  </h3>
                  <button
                    onClick={downloadHtml}
                    disabled={markdownFiles.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <Download size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                     标题:
                    </label>
                    <input
                      type="text"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="输入文档标题"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      副标题:
                    </label>
                    <input
                      type="text"
                      value={documentSubtitle}
                      onChange={(e) => setDocumentSubtitle(e.target.value)}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="输入文档副标题（可选）"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 overflow-y-auto" style={{ height: 'calc(80vh - 120px)' }}>
                {markdownFiles.length > 0 ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {/* 文档标题 */}
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold mb-2">{documentTitle}</h1>
                      {documentSubtitle && (
                        <p className="text-gray-600">{documentSubtitle}</p>
                      )}
                    </div>
                    
                    {/* 目录 */}
                    <div className="mb-8 border-b pb-6">
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">目录</h2>
                      <div className="space-y-2">
                        {markdownFiles.map((file, index) => {
                          const title = file.name.replace('.md', '').replace(/[-_]/g, ' ');
                          return (
                            <div key={file.id} className="flex justify-between items-start">
                              <div className="flex-1">
                                <span className="font-medium">{title}</span>
                              </div>
                              <span className="text-sm text-gray-500 ml-4">{index + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* 文章内容 */}
                    {markdownFiles.map((file, index) => {
                      const title = file.name.replace('.md', '').replace(/[-_]/g, ' ');
                      return (
                        <div key={file.id}>
                          <header className="mb-6 border-b-2 border-gray-500 pb-4">
                            <h1 className="text-2xl font-bold mb-2">{title}</h1>
                          </header>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: marked(processMarkdownWithImages(file.content))
                            }}
                          />
                          {index < markdownFiles.length - 1 && (
                            <div className="my-8 text-center text-gray-400">
                              <hr className="border-gray-300" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    预览将在您添加 Markdown 文件后显示...
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}