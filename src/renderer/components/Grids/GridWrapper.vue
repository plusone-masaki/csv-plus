<template lang="pug">
section.content
  grid-table(
    v-bind="file"
    :active="active"
    :keyword="keyword"
    @load="onLoad"
    @edit="onEdit"
  )
  div.content__overlay
    search-box(
      v-show="file.options.enableSearch"
      v-model="keyword"
      absolute
      top
      right
    )
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  Ref,
  ref,
} from 'vue'
import HandsOnTable from 'handsontable'
import { FileData } from '@/renderer/types'
import GridTable from '@/renderer/components/Grids/GridTable.vue'
import SearchBox from '@/renderer/components/Form/SearchBox.vue'

export default defineComponent({
  name: 'Wrapper',
  components: {
    GridTable,
    SearchBox,
  },
  props: {
    file: { type: Object as PropType<FileData>, required: true },
    active: { type: Boolean as PropType<boolean>, required: true },
  },
  setup: (props, context) => ({
    keyword: ref(''),
    onLoad: (table: Ref<HandsOnTable>) => context.emit('load', table),
    onEdit: () => context.emit('edit'),
  }),
})
</script>

<style lang="sass" scoped>
.content
  box-sizing: border-box
  height: 100%
  overflow: hidden
  position: relative
  width: 100vw

  &__overlay
    position: absolute
    pointer-events: none
    top: 0
    left: 0
    height: 100vh
    width: 100vw
    z-index: 200
</style>
