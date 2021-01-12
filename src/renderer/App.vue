<template lang="pug">
Layout
  template(v-slot:header)
    | {{ data }}
  grid-table(v-model="data")
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { computed, defineComponent, reactive } from 'vue'
import { vueI18n } from '@/plugins/i18n'
import Layout from '@/renderer/layouts/Default.vue'
import GridTable from '@/renderer/components/GridTable.vue'
import * as channels from '@/common/channels'

type State = {
  tab: string;
  tabs: Array<{ label: string; key: string }>;
  data: { [key: string]: number[][]|string[][] };
}

export default defineComponent({
  name: 'App',
  components: {
    Layout,
    GridTable,
  },
  setup () {
    const { t } = vueI18n

    const state: State = reactive({
      tab: 'newTab',
      tabs: [
        {
          label: t('tabs.new_tab'),
          key: 'newTab',
        },
      ],
      data: {
        newTab: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
      },
    })

    ipcRenderer.on(channels.FILE_LOADED, (e: IpcRendererEvent, file: channels.FILE_LOADED) => {
      state.tabs.push({
        label: file.path,
        key: file.path,
      })
      state.data[file.path] = file.data
      state.tab = file.path
    })

    const data = computed<number[][]|string[][]>({
      get: () => state.data[state.tab],
      set: data => {
        state.data[state.tab] = data
      },
    })

    return {
      t,
      state,
      data,
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
