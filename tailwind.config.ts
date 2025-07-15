// tailwind.config.ts
import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

const config: Config = {
  darkMode: 'class', // ✅ Must be 'class'
  content: [
    './src/renderer/src/**/*.{ts,tsx}',
    './node_modules/flowbite-react/**/*.js',
    './node_modules/flowbite/**/*.js',
  ],
  theme: { extend: {} },
  plugins: [flowbitePlugin],
}

export default config;
