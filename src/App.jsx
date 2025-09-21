import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { Menu, PanelLeftOpen, PanelLeftClose,ListIcon } from 'lucide-react'
import { blogPosts } from 'virtual:posts'
import { Navigation } from './Navigation'
import './App.css'

function App() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && selectedPost) {
      setIsDrawerOpen(false) // 选中文章时关闭抽屉
    }
  }, [selectedPost, isMobile])

  // 移动端抽屉打开时，禁止背景滚动
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isDrawerOpen ? 'hidden' : ''
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isMobile, isDrawerOpen])

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const handleBackClick = () => {
    setSelectedPost(null)
  }

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const getPostExcerpt = (content) => {
    const plainText = content.replace(/[#*`>\[\]]/g, '').replace(/\n+/g, ' ')
    return plainText.substring(0, 100)
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation
        posts={blogPosts}
        onPostSelect={handlePostClick}
        selectedPost={selectedPost}
        onToggleDrawer={handleToggleDrawer}
        isMobile={isMobile}
        isDrawerOpen={isDrawerOpen}
        isNavCollapsed={isNavCollapsed}
      />
      {isMobile && isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleToggleDrawer}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header 现在仅在正文区域 */}
        <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className={`${(!isMobile && isNavCollapsed) ? '' : 'max-w-7xl mx-auto'} w-full h-12 flex items-center justify-between relative`}>
            <button
              className={`ml-2 border-none rounded w-9 h-9 cursor-pointer flex items-center justify-center text-sm transition-colors bg-zinc-300 bg-opacity-10 hover:bg-zinc-400 dark:text-white ${(!isMobile && isNavCollapsed) ? 'absolute top-1/2 -translate-y-1/2' : ''}`}
            style={!isMobile && isNavCollapsed ? { left: 0 } : undefined}
              onClick={isMobile ? handleToggleDrawer : () => setIsNavCollapsed(!isNavCollapsed)}
              aria-label={isMobile ? '打开菜单' : (isNavCollapsed ? '展开侧栏' : '收起侧栏')}
            >
              {isMobile ? <PanelLeftOpen size={20} /> : (isNavCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />)}
            </button>

            <button
              onClick={handleBackClick}
              className="absolute left-1/2 -translate-x-1/2 border-none px-5 py-1 rounded cursor-pointer text-base transition-colors bg-zinc-300 bg-opacity-10 hover:bg-zinc-400 dark:text-white"
            >
              <ListIcon />
            </button>

            <a
              href="https://github.com/etrobot/single-vite-file"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-1/2 -translate-y-1/2 border-none rounded w-9 h-9 cursor-pointer flex items-center justify-center text-sm transition-colors bg-zinc-300 bg-opacity-10 hover:bg-zinc-400 dark:text-white"
              aria-label="GitHub 仓库"
              title="打开 GitHub 仓库"
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </a>
          </div>
        </header>

        <div className="md:p-8 flex-1 min-w-0 flex flex-col box-border">
          <div className="max-w-4xl w-full mx-auto p-2 min-w-0 box-border">
            {selectedPost ? (
              <article className="w-full max-w-full min-w-0 box-border bg-white dark:bg-zinc-800 md:p-8 p-6 rounded-lg shadow-lg">
                <h2 className="text-gray-800 dark:text-gray-100 text-3xl mb-2">{selectedPost.title}</h2>
                <div className="flex gap-4 mb-6 flex-wrap">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{selectedPost.date}</span>
                  <span className="bg-zinc-600 dark:bg-zinc-500 text-white px-3 py-1 rounded-full text-xs font-medium">{selectedPost.category}</span>
                  {selectedPost.subcategory && (
                    <span className="bg-zinc-200 dark:bg-zinc-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{selectedPost.subcategory}</span>
                  )}
                </div>
                <div
                  className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed markdown-content overflow-x-auto"
                  dangerouslySetInnerHTML={{
                    __html: marked(selectedPost.content)
                  }}
                />
              </article>
            ) : (
              <main>
                {blogPosts.map(post => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-zinc-900 p-6 md:p-6 p-4 mb-6 rounded-lg cursor-pointer transition-all border-l-4 border-zinc-600 dark:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => handlePostClick(post)}
                  >
                    <h3 className="text-gray-800 dark:text-gray-100 mb-2 text-xl">{post.title}</h3>
                    <div className="flex gap-4 mb-4 flex-wrap">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{post.date}</span>
                      <span className="bg-zinc-600 dark:bg-zinc-500 text-white px-3 py-1 rounded-full text-xs font-medium">{post.category}</span>
                      {post.subcategory && (
                        <span className="bg-zinc-200 dark:bg-zinc-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{post.subcategory}</span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 m-0">
                      {getPostExcerpt(post.content)}...
                    </p>
                  </div>
                ))}
              </main>
            )}
          </div>

          <footer className="text-center mt-auto m-6 text-gray-600 dark:text-gray-400">
            <p>© 2025 Frank Lin</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App

