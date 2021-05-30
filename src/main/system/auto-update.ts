import { app } from 'electron'
import * as log from 'electron-log'
import { AppUpdater, AppImageUpdater, MacUpdater, NsisUpdater } from 'electron-updater'

let autoUpdater: AppUpdater
if (process.platform === 'win32') {
  autoUpdater = new NsisUpdater()
} else if (process.platform === 'darwin') {
  autoUpdater = new MacUpdater()
} else {
  autoUpdater = new AppImageUpdater()
}

log.transports.file.level = 'info'
autoUpdater.logger = log

log.info('App starting...')
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-available', () => {
  log.info('Update available.')
})

autoUpdater.on('update-not-available', () => {
  log.info('Update not available.')
})

autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let message = 'Download speed: ' + progressObj.bytesPerSecond
  message += ' - Downloaded ' + progressObj.percent + '%'
  message += ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  log.info(message)
})

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded')
})

app.on('ready', async () => {
  autoUpdater.checkForUpdatesAndNotify()
})
