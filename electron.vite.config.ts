import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
//@ts-ignore
import flowbiteReact from 'flowbite-react/plugin/vite'
//@ts-ignore
import tailwindcss from '@tailwindcss/vite'
// import path from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@type': path.resolve(__dirname, 'src/types'),
        '@main': path.resolve(__dirname, 'src/main')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@type': resolve('src/types')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@type': path.resolve(__dirname, 'src/types'),
        '@renderer': resolve('src/renderer/src'),
        'tailwindcss/version.js': path.resolve(
          __dirname,
          'node_modules/tailwindcss/lib/version.js'
        ),
        '@tailwindcss/vite': path.resolve(__dirname, 'node_modules/@tailwindcss/vite'),
        '@utils': path.resolve(__dirname, 'utils')
      }
    },
    plugins: [react(), tailwindcss(), flowbiteReact()]
  }
})
