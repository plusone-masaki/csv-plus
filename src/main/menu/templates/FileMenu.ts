import { Menu, MenuItem, MenuItemConstructorOptions } from 'electron'
import FileMenuController from '@/main/menu/controllers/FileMenuController'
import { getModule } from '@/main/modules'

const isMac = process.platform === 'darwin'
const history = getModule('history')

const recentDocumentsMenu: MenuItemConstructorOptions = {
  id: 'recentDocuments',
  label: '最近開いたファイル',
}

const getRecentDocuments = () => {
  const menu = new Menu()
  history.recentDocuments.forEach(doc => menu.append(new MenuItem({
    label: doc.path,
    click: FileMenuController.openRecent,
  })))
  menu.append(new MenuItem({
    label: '履歴を消去',
    click: FileMenuController.clearRecent,
  }))
  return menu
}

if (isMac) {
  Object.assign(recentDocumentsMenu, {
    role: 'recentDocuments',
    submenu: [{
      label: '履歴を消去',
      role: 'clearRecentDocuments',
    }],
  })
} else {
  recentDocumentsMenu.submenu = getRecentDocuments()
}

export default new MenuItem({
  label: 'ファイル',
  submenu: [
    {
      label: '新規作成',
      accelerator: 'CmdOrCtrl+N',
      click: FileMenuController.newFile,
    },
    { type: 'separator' },
    {
      label: 'ファイルを開く',
      accelerator: 'CmdOrCtrl+O',
      click: FileMenuController.open,
    },
    recentDocumentsMenu,
    { type: 'separator' },
    {
      label: '上書き保存',
      accelerator: 'CmdOrCtrl+S',
      click: FileMenuController.save,
    },
    {
      label: '名前を付けて保存',
      accelerator: 'CmdOrCtrl+Shift+S',
      click: FileMenuController.saveAs,
    },
    {
      label: '印刷',
      accelerator: 'CmdOrCtrl+Shift+P',
      click: FileMenuController.print,
    },
  ],
})
