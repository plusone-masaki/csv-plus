import { FileData } from '@/@types/types'

// App
export const APP_WILL_CLOSE = 'APP_WILL_CLOSE'
export const APP_CLOSE = 'APP_CLOSE'

// Files
export const FILE_NEW = 'FILE_NEW'
export const FILE_OPEN = 'FILE_OPEN'
export const FILE_DROPPED = 'FILE_DROPPED'
export const FILE_LOADED = 'FILE_LOADED'
export const FILE_RELOAD = 'FILE_RELOAD'
export const FILE_SAVE = 'FILE_SAVE'
export const FILE_SAVE_AS = 'FILE_SAVE_AS'
export const FILE_SAVE_COMPLETE = 'FILE_SAVE_COMPLETE'
export const FILE_DESTROY_CONFIRM = 'FILE_DESTROY_CONFIRM'

export type FILE_RELOAD = []
export type FILE_LOADED = FileData|undefined
export type FILE_SAVE = { path: string; meta: string; data: string }
export type FILE_SAVE_AS = FILE_SAVE
export type FILE_SAVE_COMPLETE = string
export type FILE_DESTROY_CONFIRM = { name: string; path: string; meta: string; data: string }

// Tabs
export const TABS_SAVE = 'TABS_SAVE'
export const TABS_LOADED = 'TABS_LOADED'

export type TABS_SAVE = string
export type TABS_LOADED = string[]

// Menus
export const MENU_SELECT_ALL = 'MENU_SELECT_ALL'
export const MENU_UNDO = 'MENU_UNDO'
export const MENU_REDO = 'MENU_REDO'
export const MENU_PRINT = 'MENU_PRINT'
