import { useState } from 'react'
import { ChevronDown, FileText } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Navigation({ posts, onPostSelect, selectedPost, onToggleDrawer, isMobile, isDrawerOpen, isNavCollapsed, onMd2HtmlClick }) {
  const [collapsedCategories, setCollapsedCategories] = useState({})

  // 组织文章数据为导航结构
  const navigation = posts.reduce((nav, post) => {
    const category = post.category
    const subcategory = post.subcategory

    if (!nav[category]) {
      nav[category] = {
        posts: [],
        subcategories: {}
      }
    }

    if (subcategory) {
      if (!nav[category].subcategories[subcategory]) {
        nav[category].subcategories[subcategory] = []
      }
      nav[category].subcategories[subcategory].push(post)
    } else {
      nav[category].posts.push(post)
    }

    return nav
  }, {})

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handlePostClick = (post) => {
    onPostSelect(post)
    if (isMobile) {
      onToggleDrawer() // 移动端点击文章后关闭抽屉
    }
  }

  return (
    <nav className={`
      bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
      transition-all duration-300 flex flex-col
      ${isMobile
        ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl'
        : `sticky top-0 h-screen ${isNavCollapsed ? 'w-0 min-w-0 border-r-0 pointer-events-none' : 'w-72 min-w-[16rem] pointer-events-auto'}`
      }
    `}
      style={isMobile && !isDrawerOpen ? { transform: 'translateX(-100%)' } : {}}
      aria-hidden={!isMobile && isNavCollapsed}
      tabIndex={!isMobile && isNavCollapsed ? -1 : 0}
    >
      {/* 桌面端：未折叠时显示；移动端：抽屉打开时显示 */}
      {((!isMobile && !isNavCollapsed) || (isMobile && isDrawerOpen)) && (
        <div className="flex-1 overflow-y-auto">
          {Object.entries(navigation).map(([category, data]) => (
            <div key={category} className="mb-2">
              <button
                className="w-full text-left bg-transparent border-none p-3 cursor-pointer flex items-center font-semibold text-gray-800 dark:text-gray-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => toggleCategory(category)}
              >
                <span className={`mr-2 text-xs transition-transform text-gray-600 dark:text-gray-400 ${collapsedCategories[category] ? 'rotate-[-90deg]' : ''}`}>
                  <ChevronDown size={12} />
                </span>
                {category}
              </button>

              {!collapsedCategories[category] && (
                <div className="pl-2">
                  {/* 直接在分类下的文章 */}
                  {data.posts.map(post => (
                    <button
                      key={post.id}
                      className={`w-full text-left bg-transparent border-none py-2 px-4 cursor-pointer transition-all border-l-4 text-sm ${
                        selectedPost?.id === post.id
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-500 dark:border-zinc-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                      onClick={() => handlePostClick(post)}
                    >
                      {post.title}
                    </button>
                  ))}

                  {/* 子分类 */}
                  {Object.entries(data.subcategories).map(([subcategory, posts]) => (
                    <div key={subcategory} className="my-2">
                      <div className="py-2 px-4 text-sm text-gray-600 dark:text-gray-400 font-medium border-l-2 border-zinc-200 dark:border-zinc-700 ml-4">{subcategory}</div>
                      {posts.map(post => (
                        <button
                          key={post.id}
                          className={`w-full text-left bg-transparent border-none py-2 px-4 cursor-pointer transition-all border-l-4 text-xs ml-4 ${
                            selectedPost?.id === post.id
                              ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-500 dark:border-zinc-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                          onClick={() => handlePostClick(post)}
                        >
                          {post.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 工具按钮和主题切换：桌面端折叠时隐藏；其他情况下固定在底部 */}
      {(!isMobile && isNavCollapsed) ? null : (
        <div className="mt-auto p-4 space-y-3">
          <button
            onClick={onMd2HtmlClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <FileText size={16} />
            MD2HTML
          </button>
          <ThemeToggle />
        </div>
      )}
    </nav>
  )
}
