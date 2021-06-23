<template lang="pug">
footer.footer-nav
  template(v-if="tab")
    // 選択したセルの合計
    footer-nav-label(v-if="tab.calculation.selected.summary")
      | {{ $t('footer.summary') + tab.calculation.selected.summary }}

    // 改行コード
    footer-nav-label(v-model="menu.linefeed")
      | {{ tab.file.meta.linefeed }}
      footer-nav-menu(
        v-if="menu.linefeed"
        v-model="tab.file.meta.linefeed"
        :items="items.linefeed"
      )

    // 文字コード
    footer-nav-label(v-model="menu.encoding")
      | {{ tab.file.meta.encoding }}
      footer-nav-menu(
        v-if="menu.encoding"
        v-model="tab.file.meta.encoding"
        :items="items.encoding"
        @change="changeEncoding"
      )

    // BOMありなし
    chip-label(
      v-if="withBOM"
      v-model="tab.file.meta.bom"
      :title="$t(tab.file.meta.bom ? 'footer.bom_enable' : 'footer.bom_disable')"
      small
      @click="tab.file.meta.bom = !tab.file.meta.bom"
    )
      | {{ $t('footer.bom') }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Tab } from '@/common/types'
import ChipLabel from '@/renderer/components/Common/ChipLabel.vue'
import FooterNavLabel from '@/renderer/components/Footer/FooterNavLabel.vue'
import FooterNavMenu from '@/renderer/components/Footer/FooterNavMenu.vue'
import useMenu from '@/renderer/components/Footer/composables/useMenu'

export default defineComponent({
  name: 'FooterNav',
  components: {
    ChipLabel,
    FooterNavMenu,
    FooterNavLabel,
  },
  props: {
    modelValue: { type: Object as PropType<Tab|undefined>, default: undefined },
  },
  setup (props, context) {
    const menu = useMenu(props, context)

    return {
      ...menu,
    }
  },
})
</script>

<style lang="sass" scoped>
.footer-nav
  align-items: flex-end
  display: flex
  justify-content: flex-end
  padding: 0 8px
</style>
