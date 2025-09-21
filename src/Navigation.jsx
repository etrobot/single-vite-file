import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Navigation({ posts, onPostSelect, selectedPost, onToggleDrawer, isMobile, isDrawerOpen, onNavCollapse }) {
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

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

  const toggleNav = () => {
    if (!isMobile) {
      const newCollapsedState = !isNavCollapsed
      setIsNavCollapsed(newCollapsedState)
      // 通知父组件侧边栏折叠状态变化
      if (typeof onNavCollapse === 'function') {
        onNavCollapse(newCollapsedState)
      }
    } else {
      onToggleDrawer()
    }
  }

  const handlePostClick = (post) => {
    onPostSelect(post)
    if (isMobile) {
      onToggleDrawer() // 移动端点击文章后关闭抽屉
    }
  }

  return (
    <nav className={`
      bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      sticky top-0 h-screen overflow-hidden transition-all duration-300 flex flex-col
      ${isMobile ? 'fixed z-50 w-72' : `min-w-[64px] ${isNavCollapsed ? 'w-16' : 'w-72'}`}
    `} style={isMobile && !isDrawerOpen ? { transform: 'translateX(-100%)' } : {}}>
      {/* 移动端 backdrop - 只在打开时显示 */}
      {isMobile && isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggleDrawer}
        />
      )}

      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button
          className="bg-teal-600 dark:bg-teal-500 text-white border-none rounded w-8 h-8 cursor-pointer flex items-center justify-center text-sm transition-colors hover:bg-teal-700 dark:hover:bg-teal-600"
          onClick={toggleNav}
        >
          {isMobile ? <Menu size={16} /> : (isNavCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)}
        </button>
        {!isNavCollapsed && !isMobile && <span className="ml-2 font-semibold text-gray-800 dark:text-gray-100">目录</span>}
      </div>

      {!isNavCollapsed && !isMobile && (
        <div className="py-4 flex-1 overflow-y-auto">
          {Object.entries(navigation).map(([category, data]) => (
            <div key={category} className="mb-2">
              <button
                className="w-full text-left bg-transparent border-none p-3 cursor-pointer flex items-center font-semibold text-gray-800 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
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
                          ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-500 dark:border-teal-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                      onClick={() => handlePostClick(post)}
                    >
                      {post.title}
                    </button>
                  ))}

                  {/* 子分类 */}
                  {Object.entries(data.subcategories).map(([subcategory, posts]) => (
                    <div key={subcategory} className="my-2">
                      <div className="py-2 px-4 text-sm text-gray-600 dark:text-gray-400 font-medium border-l-2 border-gray-200 dark:border-gray-600 ml-4">{subcategory}</div>
                      {posts.map(post => (
                        <button
                          key={post.id}
                          className={`w-full text-left bg-transparent border-none py-2 px-4 cursor-pointer transition-all border-l-4 text-xs ml-4 ${
                            selectedPost?.id === post.id
                              ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-500 dark:border-teal-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
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

      {/* 移动端内容 - 总是显示当打开时 */}
      {isMobile && (
        <div className="py-4 flex-1 overflow-y-auto">
          {Object.entries(navigation).map(([category, data]) => (
            <div key={category} className="mb-2">
              <button
                className="w-full text-left bg-transparent border-none p-3 cursor-pointer flex items-center font-semibold text-gray-800 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
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
                          ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-500 dark:border-teal-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                      onClick={() => handlePostClick(post)}
                    >
                      {post.title}
                    </button>
                  ))}

                  {/* 子分类 */}
                  {Object.entries(data.subcategories).map(([subcategory, posts]) => (
                    <div key={subcategory} className="my-2">
                      <div className="py-2 px-4 text-sm text-gray-600 dark:text-gray-400 font-medium border-l-2 border-gray-200 dark:border-gray-600 ml-4">{subcategory}</div>
                      {posts.map(post => (
                        <button
                          key={post.id}
                          className={`w-full text-left bg-transparent border-none py-2 px-4 cursor-pointer transition-all border-l-4 text-xs ml-4 ${
                            selectedPost?.id === post.id
                              ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-500 dark:border-teal-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
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

      {/* 主题切换按钮 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {isNavCollapsed ? (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        ) : (
          <ThemeToggle />
        )}
      </div>
    </nav>
  )
}