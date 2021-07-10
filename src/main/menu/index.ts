import { app, Menu } from 'electron'
// import { i18next } from '@/plugins/i18n'
import AppMenu from '@/main/menu/templates/AppMenu'
import FileMenu from '@/main/menu/templates/FileMenu'
import EditMenu from '@/main/menu/templates/EditMenu'
import HelpMenu from '@/main/menu/templates/HelpMenu'

const isMac = process.platform === 'darwin'

export const menu = new Menu()

if (isMac) menu.append(AppMenu)
menu.append(FileMenu)
menu.append(EditMenu)
if (!isMac) menu.append(HelpMenu)

app.whenReady().then(() => Menu.setApplicationMenu(menu))
