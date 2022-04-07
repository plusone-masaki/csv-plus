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
      async: true,
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    domain: 'https://plus-one.tech/csv-plus',
    repo: 'https://github.com/plusone-masaki/csv-plus',
    editLinks: false,
    docsDir: 'docs',
    docsBranch: 'docs',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'トップページ',
        link: '/',
      },
      {
        text: 'ダウンロード',
        link: '/download/',
      },
      {
        text: '使い方',
        link: '/guide/',
      },
      {
        text: 'プライバシーポリシー',
        link: '/privacy/',
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: '使い方',
          collapsable: false,
          children: [
            '',
            'op_seat',
            'op_file',
          ],
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
    ['vuepress-plugin-seo', {
      description: ($page, $site) => $page.frontmatter.description || ($page.excerpt && $page.excerpt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")) || $site.description || "",
      title: ($page, $site) => $page.title || $site.title,
      image: ($page, $site) => `${$site.themeConfig.domain}/logo.png`,
    }],
  ],
}
