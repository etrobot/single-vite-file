import React from 'react';
import { marked } from 'marked';
import { blogPosts } from 'virtual:posts';

// Configure marked for consistent rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

function PrintApp() {
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-0 print:max-w-none">
      <style>{`
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
          .page-break-after { page-break-after: always; }
          .no-print { display: none; }
        }
        .post-content h1 { font-size: 1.875rem; font-weight: bold; margin: 1.5rem 0 1rem 0; }
        .post-content h2 { font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0; }
        .post-content h3 { font-size: 1.25rem; font-weight: bold; margin: 1rem 0 0.5rem 0; }
        .post-content p { margin: 0.75rem 0; line-height: 1.6; }
        .post-content ul, .post-content ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .post-content li { margin: 0.25rem 0; }
        .post-content blockquote { border-left: 4px solid #14b8a6; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
        .post-content code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
        .post-content pre { background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
        .post-content pre code { background: none; padding: 0; }
        .post-content a { color: #0891b2; text-decoration: underline; }
        .post-content img { max-width: 100%; height: auto; margin: 1rem 0; }
      `}</style>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">博客文章合集</h1>
        <p className="text-gray-600">共 {sortedPosts.length} 篇文章</p>
        <p className="text-sm text-gray-500 mt-2">按日期排序（最新在前）</p>
      </div>

      {/* Table of Contents */}
      <div className="mb-12 page-break-after">
        <h2 className="text-2xl font-bold mb-6 text-teal-900 border-b-2 border-teal-500 pb-2">目录</h2>
        <div className="space-y-3">
          {sortedPosts.map((post, index) => (
            <div key={post.id} className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                <div className="flex gap-3 text-sm text-gray-600">
                  <span>📅 {post.date}</span>
                  <span>📂 {post.category}</span>
                  {post.subcategory && <span>📁 {post.subcategory}</span>}
                </div>
              </div>
              <span className="text-sm text-gray-500 ml-4 flex-shrink-0">第 {index + 1} 篇</span>
            </div>
          ))}
        </div>
      </div>

      {sortedPosts.map((post, index) => (
        <article key={post.id} className={index < sortedPosts.length - 1 ? "page-break-after" : ""}>
          <header className="mb-6 border-b-2 border-teal-500 pb-4">
            <h1 className="text-3xl font-bold text-teal-900 mb-2">{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>📅 {post.date}</span>
              <span>📂 {post.category}</span>
              {post.subcategory && <span>📁 {post.subcategory}</span>}
            </div>
          </header>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          />

          {index < sortedPosts.length - 1 && (
            <div className="mt-12 mb-8 text-center text-gray-400">
              <div className="border-t border-gray-300"></div>
              <span className="inline-block px-4 bg-white text-xs uppercase tracking-wide mt-2">
                第 {index + 1} / {sortedPosts.length} 篇
              </span>
            </div>
          )}
        </article>
      ))}

      <footer className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500">
        <p>博客文章合集 - 生成于 {new Date().toLocaleDateString('zh-CN')}</p>
      </footer>
    </div>
  );
}

export default PrintApp;