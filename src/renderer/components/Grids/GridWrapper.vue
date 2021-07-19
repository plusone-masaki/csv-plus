<template lang="pug">
section.content(:id="`grid-wrapper-${tab.id}`")
  div.content__overlay
    transition(name="slide-y-transition")
      search-box(
        v-if="tab && tab.table.options.search.enable"
        v-model="tab.table.options.search"
        :absolute="true"
        :top="true"
        :right="true"
        @search="onSearch"
        @replace="onReplace"
        @blur="clearBorder"
      )

  grid-table(
    v-if="tab"
    :tab="tab"
    @edit="onEdit"
  )

footer-nav(v-if="tab" v-model="tab")
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  watch,
} from 'vue'
import { Tab } from '@/@types/types'
import { REPLACE_ALL, REPLACE_SINGLE } from '@/renderer/models/Search'
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
    tab: { type: Object as PropType<Tab|undefined>, default: undefined },
  },
  setup: (props: { tab?: Tab }, context) => {
    watch(
      () => props.tab?.table.options.search.enable,
      show => show && props.tab?.table.instance?.deselectCell(),
    )

    return {
      clearBorder: () => props.tab?.table.borders?.clearBorders(),
      onSearch: (e?: KeyboardEvent) => props.tab?.table.search && props.tab.table.search(e?.shiftKey),
      onReplace: (all: boolean) => props.tab?.table.search && props.tab.table.search(false, true, all ? REPLACE_ALL : REPLACE_SINGLE),
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
