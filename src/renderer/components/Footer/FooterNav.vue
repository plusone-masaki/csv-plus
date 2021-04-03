<template lang="pug">
footer.footer-nav
  template(v-if="tab")
    footer-nav-label {{ tab.calculation.selected.summary || '' }}
    footer-nav-label(v-model="menu.linefeed")
      | {{ tab.file.meta.linefeed }}
      footer-nav-menu(
        v-if="menu.linefeed"
        v-model="tab.file.meta.linefeed"
        :items="items.linefeed"
      )
    footer-nav-label {{ tab.file.meta.encoding }}
</template>

<script lang="ts">
import {
  defineComponent, onBeforeUnmount, onMounted,
  PropType,
  reactive,
  readonly,
  WritableComputedRef,
} from 'vue'
import { Tab } from '@/common/types'
import vModel from '@/renderer/utils/v-model'
import FooterNavLabel from '@/renderer/components/Footer/FooterNavLabel.vue'
import FooterNavMenu from '@/renderer/components/Footer/FooterNavMenu.vue'

interface Menu {
  [key: string]: boolean;
  linefeed: boolean;
  encoding: boolean;
}

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
    const tab = vModel('modelValue', props, context) as WritableComputedRef<Tab|undefined>

    const menu: Menu = reactive({
      linefeed: false,
      encoding: false,
    })

    const items = readonly({
      linefeed: [
        { label: 'LF (MacOS/Linux)', value: 'LF' },
        { label: 'CRLF (Windows)', value: 'CRLF' },
        { label: 'CR (旧MacOS)', value: 'CR' },
      ],
    })

    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement|null
      if (target && !(target.classList.contains('footer-nav-label') && target.classList.contains('--active'))) {
        Object.keys(menu).forEach(key => { menu[key] = false })
      }
    }

    // ドロップダウン制御
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown)
    })

    return {
      tab,
      menu,
      items,
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
