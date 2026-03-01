import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getBasePath() {
  if (!process.env.GITHUB_ACTIONS) {
    return '/'
  }

  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  if (!repo || repo.endsWith('.github.io')) {
    return '/'
  }
  return `/${repo}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: getBasePath(),
  plugins: [react()]
})
