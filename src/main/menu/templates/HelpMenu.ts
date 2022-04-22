import { MenuItem, MenuItemConstructorOptions } from 'electron'
import HelpMenuController from '@/main/menu/controllers/HelpMenuController'
import { getModule } from '@/main/modules'

const isMac = process.platform === 'darwin'
const config = getModule('config')

const about: MenuItemConstructorOptions[] = isMac
  ? []
  : [{
      label: 'このソフトについて',
      role: 'about',
      click: HelpMenuController.about,
    }]

export default new MenuItem({
  label: 'ヘルプ',
  role: 'help',
  submenu: [
    ...about,
    {
      id: 'update-notification',
      label: '更新通知を受け取る',
      type: 'checkbox',
      checked: config.updateNotification,
      click: HelpMenuController.updateNotification,
    },
    {
      id: 'check-update',
      label: 'アップデートを確認する',
      click: HelpMenuController.checkUpdate,
    },
  ],
})
