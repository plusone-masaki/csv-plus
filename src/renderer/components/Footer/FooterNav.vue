<template lang="pug">
footer.footer-nav
  template(v-if="tab")
    // 選択したセルの合計
    footer-nav-label(
      v-show="tab.calculation.selected.summary"
      :label="$t('footer.summary') + tab.calculation.selected.summary"
    )

    footer-nav-label(
      :value="menu.delimiter"
      :label="$t('footer.delimiter', { delimiter: tab.file.meta.delimiter })"
      @click="showMenu('delimiter')"
    )
      footer-nav-menu(
        v-model="tab.file.meta.delimiter"
        :items="items.delimiter"
        @change="confirmReload('delimiter')"
      )

    // 改行コード
    footer-nav-label(
      :value="menu.linefeed"
      :label="tab.file.meta.linefeed"
      @click="showMenu('linefeed')"
    )
      footer-nav-menu(
        v-model="tab.file.meta.linefeed"
        :items="items.linefeed"
        @change="modelValue.dirty = true"
      )

    // 文字コード
    footer-nav-label(
      :value="menu.encoding"
      :label="tab.file.meta.encoding"
      @click="showMenu('encoding')"
    )
      footer-nav-menu(
        v-model="tab.file.meta.encoding"
        :items="items.encoding"
        @change="confirmReload"
      )

    // BOMありなし
    chip-label(
      v-show="withBOM"
      v-model="tab.file.meta.bom"
      :title="$t(tab.file.meta.bom ? 'footer.bom_enable' : 'footer.bom_disable')"
      small
      @click="changeBOM"
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
