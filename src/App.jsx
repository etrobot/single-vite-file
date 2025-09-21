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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation
        posts={blogPosts}
        onPostSelect={handlePostClick}
        selectedPost={selectedPost}
      />

      <div className="flex-1 p-8">
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

        <footer className="text-center mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
          <p>© 2025 我的博客 | 使用 React + Vite + Markdown 构建</p>
        </footer>
      </div>
    </div>
  )
}

export default App
