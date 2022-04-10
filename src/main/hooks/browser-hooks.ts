import { BrowserWindow } from 'electron'
import * as channels from '@/assets/constants/channels'
import HelpMenuController from '@/main/menu/controllers/HelpMenuController'

import { getModule } from '@/main/modules'

const config = getModule('config')
const updateChecker = getModule('updateChecker')

export default (window: BrowserWindow) => {
  window.webContents.on('dom-ready', async () => {
    if (!config.updateNotification) return
    const dontShowAgain = await updateChecker.checkUpdate(window, true)
    if (dontShowAgain) HelpMenuController.disableUpdateNotification()
  })

  // ウィンドウが閉じる前に保存確認の処理
  window.on('close', e => {
    e.preventDefault()
    window.webContents.send(channels.APP_WILL_CLOSE)
  })
}
