import { BrowserWindow, MenuItem } from 'electron'
import * as channels from '@/common/channels'

export default class EditMenuController {
  /**
   * [全て選択]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static selectAll (menu: MenuItem, window: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_SELECT_ALL)
  }

  /**
   * [元に戻す]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static undo (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_UNDO)
  }

  /**
   * [やり直し]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public static redo (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_REDO)
  }
}
