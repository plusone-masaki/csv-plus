module.exports = {
  pages: {
    index: 'src/renderer/index.ts',
    settings: 'src/renderer/settings.ts',
  },
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      mainProcessFile: 'src/main/index.ts',
      mainProcessWatch: ['src/main/**/*'],
      nodeIntegration: true,
      builderOptions: {
        appId: 'tech.plus-one.csv-plus',
        afterSign: 'scripts/notarize.js',
        productName: 'CSV+',
        extraResources: {
          from: 'public',
          to: 'public',
          filter: '**/*.png',
        },
        win: {
          target: ['zip', 'nsis'],
          fileAssociations: {
            ext: ['csv', 'tsv'],
          },
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          createDesktopShortcut: true,
          runAfterFinish: true,
          createStartMenuShortcut: true,
          shortcutName: 'CSV+',
          allowToChangeInstallationDirectory: true,
          installerLanguages: ['ja_JP'],
        },
        mac: {
          category: 'public.app-category.developer-tools',
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist',
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
