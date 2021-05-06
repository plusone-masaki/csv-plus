import { BrowserWindow, MenuItem } from 'electron'
import * as channels from '@/common/channels'

export default class EditMenu {
  /**
   * [全て選択]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} win
   */
  public static selectAll (menu: MenuItem, win: BrowserWindow) {
    win.webContents.send(channels.MENU_SELECT_ALL)
  }

  /**
   * [元に戻す]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} win
   */
  public static undo (menu: MenuItem, win: BrowserWindow) {
    win.webContents.send(channels.MENU_UNDO)
  }

  /**
   * [やり直し]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} win
   */
  public static redo (menu: MenuItem, win: BrowserWindow) {
    win.webContents.send(channels.MENU_REDO)
  }
}
