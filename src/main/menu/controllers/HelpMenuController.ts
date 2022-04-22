import * as path from 'path'
import { app, BrowserWindow, MenuItem } from 'electron'
import { menu } from '@/main/menu'
import { getModule } from '@/main/modules'

const config = getModule('config')
const updateChecker = getModule('updateChecker')

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  authors: ['Masaki Enomoto'],
  website: 'https://www.plus-one.tech',
  iconPath: app.isPackaged ? path.join(process.resourcesPath, 'public/icon.png') : path.join(__static, 'icon.png'),
})

export default class HelpMenuController {
  /**
   * [このアプリについて]
   */
  public static about () {
    app.showAboutPanel()
  }

  /**
   * 「更新通知を受け取る」
   */
  public static updateNotification (menuItem: MenuItem): void {
    const checkbox = menuItem.menu.getMenuItemById('update-notification')
    config.updateNotification = checkbox!.checked
  }

  /**
   * 「更新通知を受け取る」をオフにする
   */
  public static disableUpdateNotification () {
    const checkbox = menu.getMenuItemById('update-notification')
    checkbox!.checked = false
    config.updateNotification = checkbox!.checked
  }

  public static checkUpdate (menuItem: MenuItem, window?: BrowserWindow) {
    updateChecker.checkUpdate(window)
  }
}
