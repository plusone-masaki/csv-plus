import { MenuItem } from 'electron'
import EditMenuController from '@/main/menu/controllers/EditMenuController'

export default new MenuItem({
  label: '編集',
  submenu: [
    {
      label: '元に戻す',
      accelerator: 'CmdOrCtrl+Z',
      registerAccelerator: false,
      click: EditMenuController.undo,
    },
    {
      label: 'やり直し',
      accelerator: 'CmdOrCtrl+Shift+Z',
      registerAccelerator: false,
      click: EditMenuController.redo,
    },
    { type: 'separator' },
    {
      label: '全て選択',
      accelerator: 'CmdOrCtrl+A',
      click: EditMenuController.selectAll,
    },
  ],
})
