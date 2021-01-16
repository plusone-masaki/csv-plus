export const FILE_LOADED = 'FILE_LOADED'
export const FILE_SAVE = 'FILE_SAVE'
export const FILE_SAVE_AS = 'FILE_SAVE_AS'
export const FILE_SAVE_COMPLETE = 'FILE_SAVE_COMPLETE'

export type FILE_LOADED = { path: string; data: number[][]|string[][] }
export type FILE_SAVE = { path: string; data: string }
export type FILE_SAVE_AS = FILE_SAVE
export type FILE_SAVE_COMPLETE = string
