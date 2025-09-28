import React from 'react';
import { marked } from 'marked';
import { blogPosts } from 'virtual:posts';

// Configure marked for consistent rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

// 生成打印HTML的通用函数
export function generatePrintHTML({ title, subtitle, posts, processContent }) {
  const articlesHtml = posts.map((post, index) => {
    const processedContent = processContent ? processContent(post.content) : post.content;
    const htmlContent = marked(processedContent);
    const anchorId = `article-${post.id || index}`;
    
    return `
      <article id="${anchorId}" class="${index < posts.length - 1 ? 'page-break-after' : ''}">
        <header class="mb-6 border-b-2 border-zinc-500 pb-4">
          <h1 class="text-3xl font-bold text-zinc-900 mb-2">${post.title}</h1>
          ${post.date || post.category || post.subcategory ? `
            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
              ${post.date ? `<span>📅 ${post.date}</span>` : ''}
              ${post.category ? `<span>📂 ${post.category}</span>` : ''}
              ${post.subcategory ? `<span>📁 ${post.subcategory}</span>` : ''}
            </div>
          ` : ''}
        </header>
        <div class="post-content">${htmlContent}</div>
        ${index < posts.length - 1 ? `
          <div class="mt-12 mb-8 text-center text-gray-400">
            <div class="border-t border-gray-300"></div>
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

  const tocHtml = posts.map((post, index) => {
    const anchorId = `article-${post.id || index}`;
    return `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <a href="#${anchorId}" class="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors block">${post.title}</a>
          ${post.date || post.category || post.subcategory ? `
            <div class="flex gap-3 text-sm text-gray-600">
              ${post.date ? `<span>📅 ${post.date}</span>` : ''}
              ${post.category ? `<span>📂 ${post.category}</span>` : ''}
              ${post.subcategory ? `<span>📁 ${post.subcategory}</span>` : ''}
            </div>
          ` : ''}
        </div>
        <span class="text-sm text-gray-500 ml-4 flex-shrink-0">${index + 1}</span>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        html {
          scroll-behavior: smooth;
        }
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
        .post-content table { border-collapse: collapse; margin: 16px 0; width: 100%; }
        .post-content table th, .post-content table td { border: 1px solid #dfe2e5; padding: 6px 13px; }
        .post-content table th { background-color: #f6f8fa; font-weight: 600; }
        
        /* 悬浮目录样式 */
        .floating-toc {
          position: fixed;
          top: 20px;
          left: 0;
          width: 300px;
          max-height: 70vh;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: transform 0.3s ease;
          transform: translateX(-300px);
        }
        
        .floating-toc:hover {
          transform: translateX(0);
        }
        
        .floating-toc-icon {
          position: absolute;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: white;
          border: 1px solid #e5e7eb;
          border-left: none;
          border-radius: 0 8px 8px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        
        .floating-toc-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: default;
        }
        
        .floating-toc-content {
          max-height: calc(70vh - 50px);
          overflow-y: auto;
          padding: 12px;
        }
        
        .floating-toc-item {
          padding: 6px 12px;
          margin: 2px 0;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
        }
        
        .floating-toc-item:hover {
          background-color: #f3f4f6;
        }
        
        @media print {
          .floating-toc { display: none; }
        }
        
        @media (max-width: 768px) {
          .floating-toc {
            width: 250px;
            top: 10px;
            left: 0;
            transform: translateX(-250px);
          }
          .floating-toc:hover {
            transform: translateX(0);
          }
          .floating-toc-icon {
            right: -35px;
            width: 35px;
            height: 35px;
          }
        }
    </style>
</head>
<body>
    <div class="max-w-4xl mx-auto p-8 bg-white text-black print:p-0 print:max-w-none">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">${title}</h1>
        <p class="text-gray-600">${subtitle}</p>
      </div>
      
      <div class="mb-12 page-break-after">
        <div class="space-y-3">
          ${tocHtml}
        </div>
      </div>
      
      ${articlesHtml}
      
      <footer class="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500">
        <p>${title} - 生成于 ${new Date().toLocaleDateString('zh-CN')}</p>
      </footer>
    </div>
    
    <!-- 悬浮目录 -->
    <div class="floating-toc" id="floatingToc">
      <div class="floating-toc-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </div>
      <div class="floating-toc-header">
        <span style="font-weight: 600; font-size: 14px;">目录</span>
      </div>
      <div class="floating-toc-content">
        ${posts.map((post, index) => {
          const anchorId = `article-${post.id || index}`;
          return `
            <div class="floating-toc-item" onclick="scrollToSection('${anchorId}')">
              <div style="font-weight: 500;">${post.title}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    
    <script>
      function scrollToSection(anchorId) {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'instant',
            block: 'start'
          });
        }
      }
    </script>
</body>
</html>`;
}

// 通用的打印组件
export function PrintLayout({ title, subtitle, posts, processContent }) {
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
        .post-content table { border-collapse: collapse; margin: 16px 0; width: 100%; }
        .post-content table th, .post-content table td { border: 1px solid #dfe2e5; padding: 6px 13px; }
        .post-content table th { background-color: #f6f8fa; font-weight: 600; }
      `}</style>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Table of Contents */}
      <div className="mb-12 page-break-after">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 border-b-2 border-zinc-500 pb-2">目录</h2>
        <div className="space-y-3">
          {posts.map((post, index) => (
            <div key={post.id || index} className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                <div className="flex gap-3 text-sm text-gray-600">
                  {post.date && <span>📅 {post.date}</span>}
                  {post.category && <span>📂 {post.category}</span>}
                  {post.subcategory && <span>📁 {post.subcategory}</span>}
                  {post.filename && <span>📄 {post.filename}</span>}
                </div>
              </div>
              <span className="text-sm text-gray-500 ml-4 flex-shrink-0">第 {index + 1} 篇</span>
            </div>
          ))}
        </div>
      </div>

      {posts.map((post, index) => (
        <article key={post.id || index} className={index < posts.length - 1 ? "page-break-after" : ""}>
          <header className="mb-6 border-b-2 border-zinc-500 pb-4">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {post.date && <span>📅 {post.date}</span>}
              {post.category && <span>📂 {post.category}</span>}
              {post.subcategory && <span>📁 {post.subcategory}</span>}
              {post.filename && <span>📄 {post.filename}</span>}
            </div>
          </header>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ 
              __html: marked(processContent ? processContent(post.content) : post.content) 
            }}
          />

          {index < posts.length - 1 && (
            <div className="mt-12 mb-8 text-center text-gray-400">
              <div className="border-t border-gray-300"></div>
              <span className="inline-block px-4 bg-white text-xs uppercase tracking-wide mt-2">
                第 {index + 1} / {posts.length} 篇
              </span>
            </div>
          )}
        </article>
      ))}

      <footer className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500">
        <p>{title} - 生成于 {new Date().toLocaleDateString('zh-CN')}</p>
      </footer>
    </div>
  );
}

function PrintApp() {
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <PrintLayout
      title="博客文章合集"
      subtitle={`共 ${sortedPosts.length} 篇文章 · 按日期排序（最新在前）`}
      posts={sortedPosts}
    />
  );
}

export default PrintApp;