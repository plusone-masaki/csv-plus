import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import os from 'os'

// テストディレクトリのセットアップ
const testDir = path.resolve(os.tmpdir(), 'test')
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true })
}
fs.mkdirSync(testDir)

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/mocks/index.ts'],
    include: ['tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
  resolve: {
    alias: [
      {
        find: '@@',
        replacement: resolve(__dirname, './')
      },
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      },
      {
        find: '~',
        replacement: resolve(__dirname, './src')
      },
      {
        find: '@tests',
        replacement: resolve(__dirname, './tests')
      }
    ]
  },
})
