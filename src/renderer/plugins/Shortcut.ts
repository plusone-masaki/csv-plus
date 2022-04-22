import { KeyBind, ShortcutEvent } from '@/@types/types'
import * as shortcuts from '@/assets/constants/shortcuts'

const NAME = 0
const VALUE = 1

let events: ShortcutEvent[] = []
const keyMap: Map<string, KeyBind> = new Map()
const findKey = (keys: KeyBind): string|undefined => {
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

  public removeShortcutEvent (name: string) {
    const index = events.findIndex(e => e.name === name)
    if (index !== -1) events.splice(index, 1)
  }

  public removeAllShortcutEvents () {
    events = []
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

  public execute (name: string) {
    const event = events.find(e => e.name === name)
    if (event) event.callback()
  }

  public existsKeyBinding (keys: KeyBind) {
    return !!findKey(keys)
  }
}

const shortcut = new Shortcut()

// TODO: キーコンフィグ機能の実装後にこの処理を移す
const isMac = window.platform === 'darwin'
shortcut.addKeybinding(shortcuts.TAB_CLOSE, isMac ? { key: 'W', altKey: true } : { key: 'F4', ctrlKey: true })
shortcut.addKeybinding(shortcuts.NEXT_TAB, { key: 'PageUp', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.PREV_TAB, { key: 'PageDown', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.SELECT_ALL, { key: 'A', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.COPY, { key: 'C', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.CUT, { key: 'X', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.PASTE, { key: 'V', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.UNDO, { key: 'Z', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.REDO, { key: 'Z', ctrlKey: !isMac, metaKey: isMac, shiftKey: true })
shortcut.addKeybinding(shortcuts.JUMP_UP, { key: 'ArrowUp', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.JUMP_DOWN, { key: 'ArrowDown', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.JUMP_LEFT, { key: 'ArrowLeft', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.JUMP_RIGHT, { key: 'ArrowRight', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.FILL_UP, { key: 'ArrowUp', ctrlKey: !isMac, metaKey: isMac, shiftKey: true })
shortcut.addKeybinding(shortcuts.FILL_DOWN, { key: 'ArrowDown', ctrlKey: !isMac, metaKey: isMac, shiftKey: true })
shortcut.addKeybinding(shortcuts.FILL_LEFT, { key: 'ArrowLeft', ctrlKey: !isMac, metaKey: isMac, shiftKey: true })
shortcut.addKeybinding(shortcuts.FILL_RIGHT, { key: 'ArrowRight', ctrlKey: !isMac, metaKey: isMac, shiftKey: true })
shortcut.addKeybinding(shortcuts.SEARCH, { key: 'F3' })
shortcut.addKeybinding(shortcuts.SEARCH_REVERSE, { key: 'F3', shiftKey: true })
shortcut.addKeybinding(shortcuts.SEARCH_OPEN, { key: 'F', ctrlKey: !isMac, metaKey: isMac })
shortcut.addKeybinding(shortcuts.SEARCH_CLOSE, { key: 'ESCAPE' })
shortcut.addKeybinding(shortcuts.REPLACE_OPEN, { key: 'H', ctrlKey: !isMac, metaKey: isMac })

export default shortcut
