<template lang="pug">
section.content
  grid-table(
    :data="content"
    :path="file.path"
    :headers="headers"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
} from 'vue'
import { FileData } from '@/renderer/types'
import GridTable from '@/renderer/components/Grids/GridTable.vue'

export default defineComponent({
  name: 'Content',
  components: {
    GridTable,
  },
  props: {
    file: { type: Object as PropType<FileData>, required: true },
  },
  setup: (props, { emit }) => ({
    headers: computed(() => props.file.options.hasHeader && props.file.data[0]),
    content: computed(() => props.file.data.slice(Number(props.file.options.hasHeader))),
    onEdit: () => emit('edit'),
  }),
})
</script>

<style lang="sass" scoped>
.content
  box-sizing: border-box
  height: 100%
  overflow: hidden
  width: 100vw
</style>
