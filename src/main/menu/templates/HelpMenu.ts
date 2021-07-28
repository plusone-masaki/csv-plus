import { MenuItem } from 'electron'
import HelpMenuController from '@/main/menu/controllers/HelpMenuController'

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
      click: HelpMenuController.updateNotification,
    },
  ],
})
