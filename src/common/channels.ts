import { FileData } from '@/renderer/types'

// Files
export const FILE_LOADED = 'FILE_LOADED'
export const FILE_SAVE = 'FILE_SAVE'
export const FILE_SAVE_AS = 'FILE_SAVE_AS'
export const FILE_SAVE_COMPLETE = 'FILE_SAVE_COMPLETE'

export type FILE_LOADED = FileData
export type FILE_SAVE = { path: string; data: string }
export type FILE_SAVE_AS = FILE_SAVE
export type FILE_SAVE_COMPLETE = string

// Menus
export const MENU_SELECT_ALL = 'MENU_SELECT_ALL'
export const MENU_UNDO = 'MENU_UNDO'
export const MENU_REDO = 'MENU_REDO'
