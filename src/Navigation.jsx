import { useState } from 'react'

export function Navigation({ posts, onPostSelect, selectedPost }) {
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
    setIsNavCollapsed(!isNavCollapsed)
  }

  return (
    <nav className={`blog-navigation ${isNavCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <button className="nav-toggle" onClick={toggleNav}>
          {isNavCollapsed ? '→' : '←'}
        </button>
        {!isNavCollapsed && <span>目录</span>}
      </div>

      {!isNavCollapsed && (
        <div className="nav-content">
          {Object.entries(navigation).map(([category, data]) => (
            <div key={category} className="nav-category">
              <button
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                <span className={`category-icon ${collapsedCategories[category] ? 'collapsed' : ''}`}>
                  ▼
                </span>
                {category}
              </button>

              {!collapsedCategories[category] && (
                <div className="category-content">
                  {/* 直接在分类下的文章 */}
                  {data.posts.map(post => (
                    <button
                      key={post.id}
                      className={`nav-item ${selectedPost?.id === post.id ? 'active' : ''}`}
                      onClick={() => onPostSelect(post)}
                    >
                      {post.title}
                    </button>
                  ))}

                  {/* 子分类 */}
                  {Object.entries(data.subcategories).map(([subcategory, posts]) => (
                    <div key={subcategory} className="nav-subcategory">
                      <div className="subcategory-header">{subcategory}</div>
                      {posts.map(post => (
                        <button
                          key={post.id}
                          className={`nav-item subcategory-item ${selectedPost?.id === post.id ? 'active' : ''}`}
                          onClick={() => onPostSelect(post)}
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
    </nav>
  )
}