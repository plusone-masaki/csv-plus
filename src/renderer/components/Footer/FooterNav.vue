<template lang="pug">
footer.footer-nav
  template(v-if="tab")
    footer-nav-label(v-if="tab.calculation.selected.summary")
      | {{ $t('footer.summary') + tab.calculation.selected.summary }}

    footer-nav-label(v-model="menu.linefeed")
      | {{ tab.file.meta.linefeed }}
      footer-nav-menu(
        v-if="menu.linefeed"
        v-model="tab.file.meta.linefeed"
        :items="items.linefeed"
      )

    footer-nav-label(v-model="menu.encoding")
      | {{ tab.file.meta.encoding }}
      footer-nav-menu(
        v-if="menu.encoding"
        v-model="tab.file.meta.encoding"
        :items="items.encoding"
        @change="changeEncoding"
      )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Tab } from '@/common/types'
import FooterNavLabel from '@/renderer/components/Footer/FooterNavLabel.vue'
import FooterNavMenu from '@/renderer/components/Footer/FooterNavMenu.vue'
import useMenu from '@/renderer/components/Footer/composables/useMenu'

export default defineComponent({
  name: 'FooterNav',
  components: {
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
  display: flex
  height: 18px
  justify-content: flex-end
  padding: 0 4px
</style>
