import { app } from 'electron'
import * as path from 'path'

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
}
