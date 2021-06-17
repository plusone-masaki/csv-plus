module.exports = {
  pages: {
    index: 'src/renderer/pages/index.ts',
    settings: 'src/renderer/pages/settings.ts',
  },
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      mainProcessFile: 'src/main/index.ts',
      mainProcessWatch: ['src/main/**/*'],
      nodeIntegration: true,
      builderOptions: {
        appId: 'csv-plus',
        afterSign: 'scripts/notarize.js',
        productName: 'CSV+',
        extraResources: {
          from: 'public',
          to: 'public',
          filter: '**/*.png',
        },
        win: {
          target: ['msi'],
        },
        mac: {
          category: 'public.app-category.developer-tools',
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist",
          target: ['dmg'],
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
          category: 'Office',
          target: [
            'AppImage',
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
        publish: {
          provider: 'github',
        },
      },
    },
  },
}
