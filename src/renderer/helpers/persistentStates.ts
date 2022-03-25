import { Tab } from '@/@types/types'
import * as channels from '@/assets/constants/channels'

/**
 * タブのファイルパスを記録に残す
 *
 * @param {Tab[]} tabs
 */
export const persistentTabs = (tabs: Tab[]) => {
  const tabMap = tabs
    .filter(tab => !/^newTab\d+$/.test(tab.file.path))
    .map(tab => tab.file.path)

  window.api[channels.TABS_SAVE](JSON.stringify(tabMap))
}
