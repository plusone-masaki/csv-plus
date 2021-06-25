import { Tab } from '@/common/types'
import { ipcRenderer } from 'electron'
import * as channels from '@/common/channels'

/**
 * タブのファイルパスを記録に残す
 *
 * @param tabs
 */
export const persistentTabs = (tabs: Tab[]) => {
  const tabMap = tabs
    .filter(tab => !/^newTab\d+$/.test(tab.file.path))
    .map(tab => tab.file.path)

  ipcRenderer.send(channels.TABS_SAVE, JSON.stringify(tabMap))
}
