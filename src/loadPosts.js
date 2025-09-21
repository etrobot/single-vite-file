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

const imageRegex = /!\[([^\]]*?)]\s*\(([^)\s]+?)(?:\s+\"([^\"]*)\")?\)/g;

let processedContent = content.replace(imageRegex, (match, alt, src, title) => {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
    return match;
  }
  const imagePath = path.resolve(path.dirname(filePath), src);
  if (!fs.existsSync(imagePath)) {
    console.warn(`Image not found: ${imagePath}`);
    return match;
  }
  const ext = path.extname(imagePath).toLowerCase();
  let mimeType = '';
  if (ext === '.png') mimeType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
  else if (ext === '.gif') mimeType = 'image/gif';
  else if (ext === '.svg') mimeType = 'image/svg+xml';
  else if (ext === '.webp') mimeType = 'image/webp';
  else return match;
  const buffer = fs.readFileSync(imagePath);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;
  let newImage = `![${alt}](${dataUrl})`;
  if (title) newImage += ` \"${title}\"`;
  return newImage;
});

    return {
      id: data.id || file.replace('.md', ''),
      title: data.title || file.replace('.md', ''),
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || '未分类',
      subcategory: data.subcategory || null,
      content: processedContent.trim(),
      filename: file
    }
  })

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}