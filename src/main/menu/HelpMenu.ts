import { app } from 'electron'

export default class HelpMenu {
  /**
   * [このアプリについて]
   */
  public static about () {
    app.setAboutPanelOptions({
      applicationName: app.getName(),
      applicationVersion: app.getVersion(),
      authors: ['Masaki Enomoto'],
      website: 'https://www.plus-one.tech',
    })
    app.showAboutPanel()
  }
}
