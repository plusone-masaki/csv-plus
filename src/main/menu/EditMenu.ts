import { BrowserWindow, MenuItem } from 'electron'
import * as channels from '@/assets/constants/channels'

export default class EditMenu {
  public static createMenu () {
    const menu = new EditMenu()

    return new MenuItem({
      label: '編集',
      submenu: [
        {
          label: '元に戻す',
          accelerator: 'CmdOrCtrl+Z',
          registerAccelerator: false,
          click: menu.undo,
        },
        {
          label: 'やり直し',
          accelerator: 'CmdOrCtrl+Shift+Z',
          registerAccelerator: false,
          click: menu.redo,
        },
        { type: 'separator' },
        {
          label: '全て選択',
          accelerator: 'CmdOrCtrl+A',
          registerAccelerator: false,
          click: menu.selectAll,
        },
      ],
    })
  }

  /**
   * [全て選択]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public selectAll (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_SELECT_ALL)
  }

  /**
   * [元に戻す]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public undo (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_UNDO)
  }

  /**
   * [やり直し]
   *
   * @param {MenuItem} menu
   * @param {BrowserWindow} window
   */
  public redo (menu: MenuItem, window?: BrowserWindow) {
    if (!window) return
    window.webContents.send(channels.MENU_REDO)
  }
}
