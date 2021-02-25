module.exports = {
  pages: {
    index: {
      entry: 'src/renderer/pages/index.ts',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'app', 'index'],
    },
    settings: {
      entry: 'src/renderer/pages/settings.ts',
      template: 'public/index.html',
      filename: 'settings.html',
      chunks: ['chunk-vendors', 'chunk-common', 'settings'],
    },
  },
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      mainProcessFile: 'src/main/index.ts',
      rendererProcessFile: 'src/renderer/pages/index.ts',
      mainProcessWatch: ['src/main/**/*'],
      nodeIntegration: true,
      builderOptions: {
        appId: 'csv-plus',
        productName: 'CSV+',
        nsis: {
          oneClick: false,
          perMachine: true,
        },
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
          category: 'Development',
          target: [
            'deb',
          ],
          mimeTypes: [
            'text/csv',
          ],
        },
        fileAssociations: [
          {
            ext: 'csv',
            role: 'Editor',
            name: 'Comma separated values',
          },
          {
            ext: 'tsv',
            role: 'Editor',
            name: 'Tab separated values',
          },
        ],
      },
    },
  },
}
