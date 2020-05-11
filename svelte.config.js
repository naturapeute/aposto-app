const { scss, globalStyle } = require('svelte-preprocess')

module.exports = (production) => ({
  // enable run-time checks when not in production
  dev: !production,
  // we'll extract any component CSS out into
  // a separate file - better for performance
  css: css => {
    css.write('public/build/bundle.css')
  },
  preprocess: [
    scss({
      includePaths: [
        './src/styles',
        './node_modules'
      ]
    }),
    globalStyle()
  ]
})
