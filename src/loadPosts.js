import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function loadMarkdownFiles() {
  const contentDir = path.join(process.cwd(), 'content')

  if (!fs.existsSync(contentDir)) {
    return []
  }

  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter(file => file.endsWith('.md'))

  const posts = markdownFiles.map(file => {
    const filePath = path.join(contentDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      id: data.id || file.replace('.md', ''),
      title: data.title || file.replace('.md', ''),
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || '未分类',
      subcategory: data.subcategory || null,
      content: content.trim(),
      filename: file
    }
  })

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}