import daisyui from 'daisyui'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
      },
      colors: {
        aaa: '#aaa',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    theme: ['dark'],
  },
}
export default config
