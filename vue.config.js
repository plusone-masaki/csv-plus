module.exports = {
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      mainProcessFile: 'src/main/index.ts',
      rendererProcessFile: 'src/renderer/index.ts',
      nodeIntegration: true,
      builderOptions: {
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
        ],
      },
    },
  },
}
