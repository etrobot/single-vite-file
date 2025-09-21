import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { Menu } from 'lucide-react'
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

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const handleBackClick = () => {
    setSelectedPost(null)
  }

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleNavCollapse = (collapsed) => {
    setIsNavCollapsed(collapsed)
  }

  const getPostExcerpt = (content) => {
    const plainText = content.replace(/[#*`>\[\]]/g, '').replace(/\n+/g, ' ')
    return plainText.substring(0, 100)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation
        posts={blogPosts}
        onPostSelect={handlePostClick}
        selectedPost={selectedPost}
        onToggleDrawer={handleToggleDrawer}
        isMobile={isMobile}
        isDrawerOpen={isDrawerOpen}
        onNavCollapse={handleNavCollapse}
      />

      <div className="flex-1 p-8">
        <div className="max-w-4xl w-full mx-auto">
          {/* 移动端汉堡菜单按钮 - 只在列表视图显示 */}
          {isMobile && !selectedPost && (
            <div className="mb-4 md:hidden">
              <button
                className="bg-teal-600 dark:bg-teal-500 text-white border-none px-4 py-2 rounded cursor-pointer text-base transition-colors hover:bg-teal-700 dark:hover:bg-teal-600"
                onClick={handleToggleDrawer}
              >
                <Menu size={20} />
                <span className="ml-2">菜单</span>
              </button>
            </div>
          )}

          {selectedPost ? (
            <article className="bg-white dark:bg-gray-800 p-8 md:p-8 p-6 rounded-lg shadow-lg">
              <button
                className="bg-teal-600 dark:bg-teal-500 text-white border-none px-6 py-3 rounded cursor-pointer text-base mb-8 transition-colors hover:bg-teal-700 dark:hover:bg-teal-600"
                onClick={handleBackClick}
              >
                ← 返回文章列表
              </button>
              <h2 className="text-gray-800 dark:text-gray-100 text-3xl mb-2">{selectedPost.title}</h2>
              <div className="flex gap-4 mb-6 flex-wrap">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{selectedPost.date}</span>
                <span className="bg-teal-600 dark:bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">{selectedPost.category}</span>
                {selectedPost.subcategory && (
                  <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{selectedPost.subcategory}</span>
                )}
              </div>
              <div
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed markdown-content"
                dangerouslySetInnerHTML={{
                  __html: marked(selectedPost.content)
                }}
              />
            </article>
          ) : (
            <main>
              <h2 className="text-gray-800 dark:text-gray-100 mb-8 text-3xl">文章列表</h2>
              {blogPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 p-6 md:p-6 p-4 mb-6 rounded-lg cursor-pointer transition-all border-l-4 border-teal-600 dark:border-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => handlePostClick(post)}
                >
                  <h3 className="text-gray-800 dark:text-gray-100 mb-2 text-xl">{post.title}</h3>
                  <div className="flex gap-4 mb-4 flex-wrap">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{post.date}</span>
                    <span className="bg-teal-600 dark:bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">{post.category}</span>
                    {post.subcategory && (
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{post.subcategory}</span>
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

        <footer className="text-center mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
          <p>© 2025 我的博客 | 使用 React + Vite + Markdown 构建</p>
        </footer>
      </div>
    </div>
  )
}

export default App

