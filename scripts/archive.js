/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

/**
 * Windowsインストーラのzip圧縮
 *
 * @param {object} buildResult
 * @returns {Promise<string[]>}
 */
module.exports = async buildResult => {
  const winInstaller = buildResult.artifactPaths.find(filePath => /setup.*\.exe$/i.test(filePath))
  if (winInstaller) {
    const filepath = winInstaller.replace('exe', 'zip')
    const output = fs.createWriteStream(filepath)
    const archive = archiver('zip')

    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`)
      console.log('archiver has been finalized and the output file descriptor has closed.')
    })

    output.on('end', () => {
      console.log('Data has been drained')
      // TODO: 将来的には元exeをアップロード対象から外す
    })

    archive.on('warning', err => {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err
      }
    })

    archive.on('error', err => {
      throw err
    })

    archive.pipe(output)
    archive.file(winInstaller, { name: winInstaller.split(path.sep).pop() }).finalize()
    return [filepath]
  }
}
