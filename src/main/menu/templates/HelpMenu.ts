import { MenuItem } from 'electron'
import EditMenuController from '@/main/menu/controllers/EditMenuController'
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
