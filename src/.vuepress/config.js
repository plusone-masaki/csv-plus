const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'CSV+',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  base: '/csv-plus/',
  dest: 'docs',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['script', {
      'data-ad-client': 'ca-pub-9835503912749997',
      src:'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      async: true,
    }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/plusone-masaki/csv-plus',
    editLinks: false,
    docsDir: 'docs',
    docsBranch: 'docs',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'ダウンロード',
        link: '/download/',
      },
      {
        text: '使い方',
        link: '/guide/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: '使い方',
          collapsable: false,
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    ['@vuepress/google-analytics', { ga: 'UA-155750684-1' }],
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ],
}
