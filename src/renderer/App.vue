<template lang="pug">
Layout
  template(v-slot:nav)
    navigation-tabs(
      v-model="state.tabs"
      v-model:tab="state.tab"
    )

  template(v-slot:header)
    control-panel
    | {{ state.tabs }}

  grid-table(
    :data="state.data[state.tab]"
    :tab="state.tab"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { defineComponent, reactive } from 'vue'
import HandsOnTable from 'handsontable'
import { vueI18n } from '@/plugins/i18n'
import Layout from '@/renderer/layouts/Default.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import ControlPanel from '@/renderer/components/ControlPanel.vue'
import GridTable from '@/renderer/components/GridTable.vue'
import * as channels from '@/common/channels'

type State = {
  tab: string;
  tabs: Array<{ label?: string; key: string; dirty: boolean }>;
  data: { [key: string]: HandsOnTable.CellValue[][] | HandsOnTable.RowObject[] };
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

    const state: State = reactive({
      tab: 'newTab',
      tabs: [
        {
          label: t('tabs.new_tab'),
          key: 'newTab',
          dirty: false,
        },
      ],
      data: {
        newTab: HandsOnTable.helper.createEmptySpreadsheetData(10, 6),
      },
    })

    const methods = {
      t,
      onEdit: () => {
        const tab = state.tabs.find(t => t.key === state.tab)
        if (tab) tab.dirty = true
      },
    }

    ipcRenderer.on(channels.FILE_LOADED, (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
      state.tabs.push({
        label: file.path,
        key: file.path,
        dirty: false,
      })
      state.data[file.path] = file.data
      state.tab = file.path
    })

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
