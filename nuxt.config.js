const webpack = require('webpack')

module.exports = {
  head: {
    titleTemplate: '%s - 3D Lawns',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '3D Lawns' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600|Roboto Mono' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Dosis:500&text=Vue.js' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css' }
    ]
  },
  css: [
    {
      src: '~/assets/app.scss',
      lang: 'scss'
    },
    {
      src: 'highlight.js/styles/atelier-cave-light.css',
      lang: 'css'
    }
  ],
  loading: { color: '#0be884' },
  apollo: {
    networkInterfaces: {
      default: '~/apollo/network-interfaces/default.js'
    }
  },
  plugins: [
    '~/plugins/filters.js',
    '~/plugins/mixins.js'
  ],
  modules: ['@nuxtjs/apollo'],
  build: {
    vendor: ['highlight.js', 'lang-detector'],
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery'
      })
    ],
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
