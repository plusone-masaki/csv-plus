import { KeyBind, ShortcutEvent } from '@/common/types'

const NAME = 0
const VALUE = 1

const events: ShortcutEvent[] = []
const keyMap: Map<string, KeyBind> = new Map()
const findKey = (keys: KeyBind) => {
  for (const k of keyMap.entries()) {
    if (
      k[VALUE].key === keys.key.toUpperCase() &&
      !!k[VALUE].shiftKey === keys.shiftKey &&
      !!k[VALUE].ctrlKey === keys.ctrlKey &&
      !!k[VALUE].altKey === keys.altKey &&
      !!k[VALUE].metaKey === keys.metaKey
    ) {
      return k[NAME]
    }
  }
}

document.addEventListener('keydown', (keyboard: KeyboardEvent) => {
  const name = findKey(keyboard)
  if (name) {
    const event = events.find(e => e.name === name)
    event && event.callback()
  }
})

class Shortcut {
  public addShortcutEvent (name: string, callback: () => void) {
    const index = events.findIndex(e => e.name === name)
    if (index === -1) {
      events.push({ name, callback })
    } else {
      events[index] = { name, callback }
    }
  }

  public addKeybinding (name: string, keys: KeyBind) {
    keys.key = keys.key.toUpperCase()
    keyMap.set(name, keys)
  }

  public removeKeyBinding (keys: KeyBind) {
    keys.key = keys.key.toUpperCase()
    const name = findKey(keys)
    if (name) keyMap.delete(name)
  }
}

const shortcut = new Shortcut()

// TODO: キーコンフィグ機能の実装後にこの処理を移す
shortcut.addKeybinding('tab_close', process.platform === 'darwin' ? { key: 'W', altKey: true } : { key: 'F4', ctrlKey: true })
shortcut.addKeybinding('select_all', { key: 'A', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })
shortcut.addKeybinding('copy', { key: 'C', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })
shortcut.addKeybinding('cut', { key: 'X', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })
shortcut.addKeybinding('paste', { key: 'V', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })
shortcut.addKeybinding('undo', { key: 'Z', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })
shortcut.addKeybinding('redo', { key: 'Z', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin', shiftKey: true })
shortcut.addKeybinding('search', { key: 'F3' })
shortcut.addKeybinding('search_reverse', { key: 'F3', shiftKey: true })
shortcut.addKeybinding('search_open', { key: 'F', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })
shortcut.addKeybinding('search_close', { key: 'ESCAPE' })
shortcut.addKeybinding('replace_open', { key: 'H', ctrlKey: process.platform !== 'darwin', metaKey: process.platform === 'darwin' })

export default shortcut
