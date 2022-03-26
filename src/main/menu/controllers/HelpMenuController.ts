import * as path from 'path'
import { app, MenuItem } from 'electron'
import { menu } from '@/main/menu'
import ConfigFile from '@/main/modules/Config'

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
    ConfigFile.updateNotification = checkbox!.checked
  }

  /**
   * 「更新通知を受け取る」をオフにする
   */
  public static disableUpdateNotification () {
    const checkbox = menu.getMenuItemById('update-notification')
    checkbox!.checked = false
    ConfigFile.updateNotification = checkbox!.checked
  }
}
