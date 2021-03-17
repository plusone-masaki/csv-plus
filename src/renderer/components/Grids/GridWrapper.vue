<template lang="pug">
section.content(v-show="active")
  div.content__overlay
    transition(name="slide-transitionY")
      search-box(
        v-show="tab.options.search"
        v-model="keyword"
        :absolute="true"
        :top="true"
        :right="true"
      )

  grid-table(
    v-bind="tab"
    :active="active"
    :keyword="keyword"
    @edit="onEdit"
    @load="onLoad"
  )

footer-nav(
  v-show="active"
  v-model="tab"
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
import { Tab } from '@/renderer/types'
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
