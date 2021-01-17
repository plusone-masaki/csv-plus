<template lang="pug">
Layout
  template(v-slot:header)
    navigation-tabs(
      v-model="state.tabs"
      v-model:tab="state.tab"
      @add="addTab"
      @close="closeTab"
    )

  template(v-for="tab in state.tabs" :key="tab.key")
    control-panel(v-model="tab.setting")
    grid-table(
      v-show="tab.key === state.tab"
      :data="tab.data"
      :path="tab.key"
      @edit="onEdit"
    )
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { defineComponent, reactive, ref } from 'vue'
import HandsOnTable from 'handsontable'
import csvStringify from 'csv-stringify/lib/sync'
import { vueI18n } from '@/common/plugins/i18n'
import Layout from '@/renderer/layouts/Default.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import ControlPanel from '@/renderer/components/ControlPanel.vue'
import GridTable from '@/renderer/components/GridTable.vue'
import * as channels from '@/common/channels'

type Tab = {
  label?: string;
  key: string;
  dirty: boolean;
  data: HandsOnTable.CellValue[][] | HandsOnTable.RowObject[];
  setting: {
    hasHeader: boolean;
    delimiter: string;
    quoteChar: string;
    escapeChar: string;
  };
}

type State = {
  tab: string;
  tabs: Array<Tab>;
}

export default defineComponent({
  name: 'App',
  components: {
    ControlPanel,
    Layout,
    GridTable,
    NavigationTabs,
  },
  setup () {
    const { t } = vueI18n

    const count = ref(0)

    const state: State = reactive({
      tab: `newTab${count.value}`,
      tabs: [
        {
          label: t('tabs.new_tab'),
          key: `newTab${count.value++}`,
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
        const tab = state.tabs.find(t => t.key === state.tab)
        if (tab) tab.dirty = true
      },
      addTab: (tab?: Tab) => {
        tab = tab || {
          label: t('tabs.new_tab'),
          key: `newTab${count.value++}`,
          dirty: false,
          data: HandsOnTable.helper.createEmptySpreadsheetData(10, 6),
          setting: {
            hasHeader: false,
            delimiter: ',',
            quoteChar: '"',
            escapeChar: '"',
          },
        }

        state.tabs.push(tab)
        state.tab = tab.key
      },
      closeTab: (tab: Tab) => {
        const index = state.tabs.findIndex(t => t === tab)
        state.tabs.splice(index, 1)

        if (!state.tabs.length) return
        if (!state.tabs.find(t => t.key === state.tab)) {
          state.tab = state.tabs[index]?.key || state.tabs[0].key
        }
      },
    }

    // ファイルを開く
    ipcRenderer.on(channels.FILE_LOADED, (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
      const exists = state.tabs.find(tab => tab.key === file.path)
      if (exists) {
        state.tab = exists.key
      } else {
        methods.addTab({
          label: file.path.split('/').pop(),
          key: file.path,
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
      const activeData = state.tabs.find(tab => tab.key === state.tab)
      if (!activeData) return

      const file: channels.FILE_SAVE = {
        path: activeData.key,
        data: csvStringify(activeData.data),
      }
      ipcRenderer.once(channels.FILE_SAVE_COMPLETE, (e: IpcRendererEvent, path: channels.FILE_SAVE_COMPLETE) => {
        activeData.label = path.split('/').pop()
        activeData.key = path
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
