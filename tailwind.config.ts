import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#06070a',
        foreground: '#f1f5f9',
        cyan: {
          400: '#00f2fe',
        },
        purple: {
          500: '#a855f7',
        },
      },
    },
  },
  plugins: [],
}

export default config
