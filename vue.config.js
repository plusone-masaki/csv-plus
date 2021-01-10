module.exports = {
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist',
      mainProcessFile: 'src/main/index.ts',
      rendererProcessFile: 'src/renderer/index.ts',
      preload: 'src/plugins/ipcRenderer.ts',
    },
  },
}
