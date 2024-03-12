/** @type { import('prettier').Config } */
const prettierConfig = {
  semi: false,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
}

module.exports = prettierConfig
