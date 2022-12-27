import { app, Menu } from 'electron'
// import { i18next } from '@/plugins/i18n'
import AppMenu from '@/main/menu/AppMenu'
import FileMenu from '@/main/menu/FileMenu'
import EditMenu from '@/main/menu/EditMenu'
import HelpMenu from '@/main/menu/HelpMenu'

const isMac = process.platform === 'darwin'

export const menu = new Menu()

if (isMac) menu.append(AppMenu.createMenu())
menu.append(FileMenu.createMenu())
menu.append(EditMenu.createMenu())
menu.append(HelpMenu.createMenu())

app.whenReady().then(() => Menu.setApplicationMenu(menu))
