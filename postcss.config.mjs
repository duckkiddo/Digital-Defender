/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'color-function': true,
      },
    },
  },
}

export default config
