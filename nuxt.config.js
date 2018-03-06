module.exports = {
  head: {
    titleTemplate: '%s - 3D Lawns',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '3D Lawns' }
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
    }
  ],
  loading: { color: '#0be884' },
  apollo: {
    clientConfigs: {
      default: '~/apollo/network-interfaces/default.js'
    }
  },
  plugins: [
    '~/plugins/filters.js',
    '~/plugins/mixins.js'
  ],
  modules: ['@nuxtjs/apollo'],
  build: {
    maxChunkSize: 300000,
    extend (config) {
      if (process.client) {
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
