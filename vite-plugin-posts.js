import { loadMarkdownFiles } from './src/loadPosts.js'

export function generatePostsPlugin() {
  return {
    name: 'generate-posts',
    configureServer(server) {
      // For development, create a virtual module
      server.middlewares.use('/virtual:posts', (req, res) => {
        const posts = loadMarkdownFiles()
        res.setHeader('Content-Type', 'application/javascript')
        res.end(`export const blogPosts = ${JSON.stringify(posts, null, 2)};`)
      })
    },
    resolveId(id) {
      if (id === 'virtual:posts') {
        return id
      }
    },
    load(id) {
      if (id === 'virtual:posts') {
        const posts = loadMarkdownFiles()
        return `export const blogPosts = ${JSON.stringify(posts, null, 2)};`
      }
    }
  }
}