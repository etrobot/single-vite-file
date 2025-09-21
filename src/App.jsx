import { useState } from 'react'
import { marked } from 'marked'
import { blogPosts } from 'virtual:posts'
import { Navigation } from './Navigation'
import './App.css'

function App() {
  const [selectedPost, setSelectedPost] = useState(null)

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const handleBackClick = () => {
    setSelectedPost(null)
  }

  const getPostExcerpt = (content) => {
    const plainText = content.replace(/[#*`>\[\]]/g, '').replace(/\n+/g, ' ')
    return plainText.substring(0, 100)
  }

  return (
    <div className="blog-container">
      <Navigation
        posts={blogPosts}
        onPostSelect={handlePostClick}
        selectedPost={selectedPost}
      />

      <div className="main-content">
        <header className="blog-header">
          <h1>我的静态博客</h1>
          <p>基于React + Vite的单文件博客，支持Markdown</p>
        </header>

        {selectedPost ? (
          <article className="blog-post">
            <button className="back-button" onClick={handleBackClick}>
              ← 返回文章列表
            </button>
            <h2>{selectedPost.title}</h2>
            <div className="post-meta">
              <span className="post-date">{selectedPost.date}</span>
              <span className="post-category">{selectedPost.category}</span>
              {selectedPost.subcategory && (
                <span className="post-subcategory">{selectedPost.subcategory}</span>
              )}
            </div>
            <div
              className="post-content markdown-content"
              dangerouslySetInnerHTML={{
                __html: marked(selectedPost.content)
              }}
            />
          </article>
        ) : (
          <main className="blog-list">
            <h2>文章列表</h2>
            {blogPosts.map(post => (
              <div
                key={post.id}
                className="post-preview"
                onClick={() => handlePostClick(post)}
              >
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                  <span className="post-category">{post.category}</span>
                  {post.subcategory && (
                    <span className="post-subcategory">{post.subcategory}</span>
                  )}
                </div>
                <p className="post-excerpt">
                  {getPostExcerpt(post.content)}...
                </p>
              </div>
            ))}
          </main>
        )}

        <footer className="blog-footer">
          <p>© 2025 我的博客 | 使用 React + Vite + Markdown 构建</p>
        </footer>
      </div>
    </div>
  )
}

export default App
