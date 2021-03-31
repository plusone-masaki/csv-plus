<template lang="pug">
section.content
  div.content__overlay
    transition(name="slide-y-transition")
      search-box(
        v-if="tab.options.search"
        v-model="keyword"
        :absolute="true"
        :top="true"
        :right="true"
      )

  grid-table(
    v-if="tab.id !== -1"
    v-bind="tab"
    :keyword="keyword"
    @edit="onEdit"
    @load="onLoad"
  )

footer-nav(v-model="tab")
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  Ref,
  ref,
  watch,
} from 'vue'
import HandsOnTable from 'handsontable'
import { Tab } from '@/common/types'
import GridTable from '@/renderer/components/Grids/GridTable.vue'
import SearchBox from '@/renderer/components/Form/SearchBox.vue'
import FooterNav from '@/renderer/components/Footer/FooterNav.vue'

export default defineComponent({
  name: 'GridWrapper',
  components: {
    GridTable,
    SearchBox,
    FooterNav,
  },
  emits: ['load', 'edit'],
  props: {
    tab: { type: Object as PropType<Tab>, required: true },
  },
  setup: (props, context) => {
    watch(
      () => props.tab.options.search,
      show => show && props.tab.table?.deselectCell(),
    )

    return {
      keyword: ref(''),
      onLoad: (table: Ref<HandsOnTable>) => context.emit('load', table),
      onEdit: () => context.emit('edit'),
    }
  },
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
