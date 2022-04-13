import { MenuItem } from 'electron'
import HelpMenuController from '@/main/menu/controllers/HelpMenuController'
import { getModule } from '@/main/modules'

const config = getModule('config')

export default new MenuItem({
  label: 'ヘルプ',
  role: 'help',
  submenu: [
    {
      label: 'このソフトについて',
      role: 'about',
      click: HelpMenuController.about,
    },
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
