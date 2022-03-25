import { app, BrowserWindow, dialog, shell } from 'electron'
import axios, { AxiosResponse } from 'axios'
import versions from 'compare-versions'
import * as channels from '@/assets/constants/channels'
import HelpMenuController from '@/main/menu/controllers/HelpMenuController'
import ConfigFile from '@/main/modules/Config'

const isWindows = process.platform === 'win32'

export default (window: BrowserWindow) => {
  window.webContents.on('dom-ready', async () => {
    if (!ConfigFile.updateNotification) return

    const releases: AxiosResponse<GitHubRelease[]> = await axios.get('https://api.github.com/repos/plusone-masaki/csv-plus/releases')
    const latest = releases.data.filter(r => !r.draft)[0]
    const currentVersion = app.getVersion()
    const newVersion = latest.tag_name.slice(1)

    const DOWNLOAD_PAGE = isWindows ? 0 : 2
    const RELEASE_NOTE = 1
    const CANCEL = isWindows ? 2 : 0
    const buttons = [
      __('system.download_page'),
      __('system.release_note'),
      __('system.cancel'),
    ]

    if (versions.compare(currentVersion, newVersion, '<')) {
      const pressed = await dialog.showMessageBox(window, {
        title: __('system.update_version', { old: currentVersion, new: newVersion }),
        message: __('system.update_available'),
        buttons: isWindows ? buttons : buttons.reverse(),
        checkboxLabel: __('system.dont_show_again'),
        cancelId: CANCEL,
      })

      if (pressed.checkboxChecked) HelpMenuController.disableUpdateNotification()

      switch (pressed.response) {
        case DOWNLOAD_PAGE:
          shell.openExternal('https://www.plus-one.tech/csv-plus/download/')
          break
        case RELEASE_NOTE:
          shell.openExternal(latest.html_url)
          break
      }
    }
  })

  // ウィンドウが閉じる前に保存確認の処理
  window.on('close', e => {
    e.preventDefault()
    window.webContents.send(channels.APP_WILL_CLOSE)
  })
}
