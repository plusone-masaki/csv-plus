module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/assets/sass/_variables.scss"
        `,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      mainProcessFile: 'src/main/index.ts',
      rendererProcessFile: 'src/renderer/index.ts',
      nodeIntegration: true,
      builderOptions: {
        mac: {
          category: 'public.app-category.developer-tools',
          target: [
            'dmg',
          ],
          extendInfo: {
            CFBundleDocumentTypes: [
              {
                CFBundleTypeExtensions: ['csv', 'tsv'],
                // CFBundleTypeIconFile: 'My Awesome Application.icns',
              },
            ],
          },
        },
        linux: {
          target: [
            'deb',
          ],
        },
      },
    },
  },
}
