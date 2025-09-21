import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react'
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
              {isMobile ? <Menu size={18} /> : (isNavCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)}
            </button>

            <button
              onClick={handleBackClick}
              className="absolute left-1/2 -translate-x-1/2 border-none px-5 py-2 rounded cursor-pointer text-base transition-colors bg-zinc-300 bg-opacity-10 hover:bg-zinc-400 dark:text-white"
            >
              HOME
            </button>

            <div className={`${(!isMobile && isNavCollapsed) ? 'w-0' : 'w-9'}`} />
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
                    className="bg-white dark:bg-zinc-800 p-6 md:p-6 p-4 mb-6 rounded-lg cursor-pointer transition-all border-l-4 border-zinc-600 dark:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:-translate-y-1 hover:shadow-lg"
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

