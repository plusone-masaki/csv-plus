<template lang="pug">
footer.footer-nav
  footer-nav-item {{ tab.file.meta.encoding }}
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  WritableComputedRef,
} from 'vue'
import { Tab } from '@/renderer/types'
import vModel from '@/renderer/utils/v-model'
import FooterNavItem from '@/renderer/components/Footer/FooterNavItem.vue'

export default defineComponent({
  name: 'FooterNav',
  components: {
    FooterNavItem,
  },
  props: {
    modelValue: { type: Object as PropType<Tab>, required: true },
  },
  setup (props, context) {
    const tab = vModel('modelValue', props, context) as WritableComputedRef<Tab>
    const tableInfo = reactive({
      selected: {
        cols: 0,
        rows: 0,
        summary: NaN,
      },
    })

    // if (props.table) {
    //   // 選択中のセルに関する情報を返す
    //   HandsOnTable.hooks.add('afterSelection', (startRow: number, startCol: number, endRow: number, endCol: number) => {
    //     tableInfo.selected.rows = endRow - startRow + 1
    //     tableInfo.selected.cols = endCol - startCol + 1
    //
    //     const ranges = props.table?.getSelectedRange() || []
    //     const data = props.table?.getData() || [[]]
    //     let summary = 0
    //     ranges.forEach(range => {
    //       const fromCell = range.from
    //       const toCell = range.to
    //       for (let row = fromCell.row; row <= toCell.row; row++) {
    //         for (let col = fromCell.col; col <= toCell.col; col++) {
    //           summary += data[row][col]
    //           if (isNaN(summary)) {
    //             tableInfo.selected.summary = NaN
    //             return
    //           }
    //         }
    //       }
    //     })
    //
    //     tableInfo.selected.summary = summary
    //   }, props.table)
    // }

    return {
      tab,
      tableInfo,
    }
  },
})
</script>

<style lang="sass" scoped>
.footer-nav
  display: flex
  height: 18px
  justify-content: flex-end
  overflow-x: hidden
  padding: 0 4px
</style>
