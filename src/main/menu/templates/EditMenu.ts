import { MenuItem } from 'electron'
import EditMenuController from '@/main/menu/controllers/EditMenuController'

export default new MenuItem({
  label: '編集',
  submenu: [
    {
      label: '元に戻す',
      accelerator: 'Ctrl+Z',
      click: EditMenuController.undo,
    },
    {
      label: 'やり直し',
      accelerator: 'Ctrl+Shift+Z',
      click: EditMenuController.redo,
    },
    { type: 'separator' },
    {
      label: '全て選択',
      accelerator: 'Ctrl+A',
      click: EditMenuController.selectAll,
    },
  ],
})
