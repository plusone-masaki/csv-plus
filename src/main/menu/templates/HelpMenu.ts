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
  ],
})
