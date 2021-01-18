<template lang="pug">
Layout
  template(v-slot:header)
    navigation-tabs(
      v-model="state.files"
      v-model:tab="state.active"
      @add="addTab"
      @close="closeTab"
    )

  content(
    v-show="file.path === state.active"
    v-for="file in state.files"
    :file="file"
    :key="file.path"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { defineComponent, reactive, ref } from 'vue'
import HandsOnTable from 'handsontable'
import csvStringify from 'csv-stringify/lib/sync'
import { vueI18n } from '@/common/plugins/i18n'
import { FileData } from '@/renderer/types'
import Layout from '@/renderer/page/Layout.vue'
import Content from '@/renderer/page/Content.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import * as channels from '@/common/channels'

type State = {
  active: string;
  files: FileData[];
}

export default defineComponent({
  name: 'App',
  components: {
    Layout,
    Content,
    NavigationTabs,
  },
  setup () {
    const { t } = vueI18n

    const count = ref(0)

    const state: State = reactive({
      active: `newTab${count.value}`,
      files: [
        {
          label: t('tabs.new_tab'),
          path: `newTab${count.value++}`,
          dirty: false,
          data: HandsOnTable.helper.createEmptySpreadsheetData(10, 6),
          setting: {
            hasHeader: false,
            delimiter: ',',
            quoteChar: '"',
            escapeChar: '"',
          },
        },
      ],
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
          data: HandsOnTable.helper.createEmptySpreadsheetData(10, 6),
          setting: {
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
      const exists = state.files.find(fileData => fileData.path === file.path)
      if (exists) {
        state.active = exists.path
      } else {
        methods.addTab({
          label: file.path.split('/').pop() || '',
          path: file.path,
          dirty: false,
          data: file.data,
          setting: {
            hasHeader: false,
            delimiter: ',',
            quoteChar: '"',
            escapeChar: '"',
          },
        })
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

      ipcRenderer.once(channels.FILE_SAVE_COMPLETE, (e: IpcRendererEvent, path: channels.FILE_SAVE_COMPLETE) => {
        activeData.label = path.split('/').pop() || ''
        activeData.path = path
        activeData.dirty = false
      })
      ipcRenderer.send(channelName, file)
    }
    ipcRenderer.on(channels.FILE_SAVE, save(channels.FILE_SAVE))
    ipcRenderer.on(channels.FILE_SAVE_AS, save(channels.FILE_SAVE_AS))

    return {
      state,
      ...methods,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
