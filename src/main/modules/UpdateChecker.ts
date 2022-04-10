import axios, { AxiosResponse } from 'axios'
import { app, BrowserWindow, dialog, MessageBoxOptions, shell } from 'electron'
import versions from 'compare-versions'

export default class UpdateChecker {
  public async checkUpdate (window?: BrowserWindow, isAuto = false) {
    const isWindows = process.platform === 'win32'

    const releases: AxiosResponse<GitHubRelease[]> = await axios.get('https://api.github.com/repos/plusone-masaki/csv-plus/releases')
    const latest = releases.data.filter(r => !r.draft)[0]
    const currentVersion = app.getVersion()
    const newVersion = latest.tag_name.slice(1)

    if (versions.compare(currentVersion, newVersion, '<')) {
      const DOWNLOAD_PAGE = isWindows ? 0 : 2
      const RELEASE_NOTE = 1
      const CANCEL = isWindows ? 2 : 0
      const buttons = [
        __('system.download_page'),
        __('system.release_note'),
        __('system.cancel'),
      ]
      const options: MessageBoxOptions = {
        title: __('system.update_version', { old: currentVersion, new: newVersion }),
        message: __('system.update_available'),
        buttons: isWindows ? buttons : buttons.reverse(),
        cancelId: CANCEL,
      }
      if (isAuto) options.checkboxLabel = __('system.dont_show_again')

      const pressed = window ? await dialog.showMessageBox(window!, options) : await dialog.showMessageBox(options)

      switch (pressed.response) {
        case DOWNLOAD_PAGE:
          shell.openExternal('https://www.plus-one.tech/csv-plus/download/')
          break
        case RELEASE_NOTE:
          shell.openExternal(latest.html_url)
          break
      }

      return pressed.checkboxChecked
    } else if (!isAuto) {
      dialog.showMessageBox({
        title: __('system.update_check'),
        message: __('system.update_unavailable'),
      })
    }
  }
}
