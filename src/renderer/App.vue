<template lang="pug">
.layout
  control-panel(v-model="options")
  navigation-tabs(
    v-model="state.files"
    v-model:active="state.active"
    @add="addTab"
    @close="closeTab"
  )
  content(
    v-show="file.path === state.active"
    v-for="file in state.files"
    :file="file"
    :active="file.path === state.active"
    :key="file.path"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { computed, defineComponent, nextTick, reactive, ref } from 'vue'
import HandsOnTable from 'handsontable'
import csvStringify from 'csv-stringify/lib/sync'
import { vueI18n } from '@/common/plugins/i18n'
import { FileData, Options } from '@/renderer/types'
import Content from '@/renderer/page/Content.vue'
import ControlPanel from '@/renderer/components/ControlPanel/ControlPanel.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import * as channels from '@/common/channels'

type State = {
  active: string;
  files: FileData[];
}

const defaultOptions = (): Options => ({
  hasHeader: false,
  delimiter: ',',
  quoteChar: '"',
  escapeChar: '"',
})

export default defineComponent({
  name: 'App',
  components: {
    ControlPanel,
    Content,
    NavigationTabs,
  },
  setup () {
    const { t } = vueI18n

    const count = ref(0)
    const newTab = `newTab${count.value++}`

    const state: State = reactive({
      active: newTab,
      files: [
        {
          label: t('tabs.new_tab'),
          path: newTab,
          dirty: false,
          data: HandsOnTable.helper.createEmptySpreadsheetData(100, 26),
          options: defaultOptions(),
        },
      ],
    })

    const options = computed({
      get: () => {
        const file = state.files.find(file => file.path === state.active)
        return file ? file.options : defaultOptions()
      },
      set: file => {
        const index = state.files.findIndex((f: FileData) => f.path === state.active)
        if (index !== -1) state.files[index].options = file
      },
    })

    const methods = {
      t,
      onEdit: () => {
        const fileData = state.files.find(t => t.path === state.active)
        if (fileData) fileData.dirty = true
      },
      addTab: (fileData?: FileData) => {
        fileData = fileData || {
          label: t('tabs.new_tab'),
          path: `newTab${count.value++}`,
          dirty: false,
          data: HandsOnTable.helper.createEmptySpreadsheetData(100, 26),
          options: {
            hasHeader: false,
            delimiter: ',',
            quoteChar: '"',
            escapeChar: '"',
          },
        }

        state.files.push(fileData)
        state.active = fileData.path
      },
      closeTab: (fileData: FileData) => {
        const index = state.files.findIndex(t => t === fileData)
        state.files.splice(index, 1)

        if (!state.files.length) return
        if (!state.files.find(t => t.path === state.active)) {
          state.active = state.files[index]?.path || state.files[0].path
        }
      },
    }

    // ファイルを開く
    ipcRenderer.on(channels.FILE_LOADED, (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
      // データ未操作の場合、初期表示のタブは削除
      const activeData = state.files.find(file => file.path === state.active)
      if (count.value === 1 && activeData && !activeData.dirty) methods.closeTab(activeData)

      const exists = state.files.find(fileData => fileData.path === file.path)
      if (exists) {
        state.active = exists.path
      } else {
        methods.addTab(file)
      }
    })

    // ファイルを保存
    const save = (channelName: string) => () => {
      const activeData = state.files.find(file => file.path === state.active)
      if (!activeData) return

      const file: channels.FILE_SAVE = {
        path: activeData.path,
        data: csvStringify(activeData.data),
      }

      ipcRenderer.once(channels.FILE_SAVE_COMPLETE, async (e: IpcRendererEvent, path: channels.FILE_SAVE_COMPLETE) => {
        // 既に同じファイルを開いていた場合は閉じる
        if (path !== state.active) {
          const sameFileIndex = state.files.findIndex(file => file.path === path)
          sameFileIndex === -1 || state.files.splice(sameFileIndex, 1)
          await nextTick()
        }

        activeData.label = path.split('/').pop() || ''
        activeData.path = path
        activeData.dirty = false
        state.active = path
      })
      ipcRenderer.send(channelName, file)
    }
    ipcRenderer.on(channels.FILE_SAVE, save(channels.FILE_SAVE))
    ipcRenderer.on(channels.FILE_SAVE_AS, save(channels.FILE_SAVE_AS))

    return {
      state,
      options,
      ...methods,
    }
  },
})
</script>

<style lang="sass">
@font-face
  font-family: SourceHansCodeJP
  src: url("../assets/fonts/SourceHanCodeJP-Regular.otf")

#app
  //font-family: SourceHansCodeJP, Avenir, Helvetica, Arial, sans-serif
  font-family: SourceHansCodeJP, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
</style>
