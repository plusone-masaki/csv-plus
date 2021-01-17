<template lang="pug">
div.control-panel
  switch-button(v-model="settings.hasHeader") {{ t('setting.has_header') }}
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import SwitchButton from '@/renderer/components/Form/SwitchButton.vue'

type Setting = {
  hasHeader: boolean;
  delimiter: string;
  quoteChar: string;
  escapeChar: string;
}

export default defineComponent({
  name: 'ControlPanel',
  components: { SwitchButton },
  props: {
    modelValue: { type: Object as PropType<Setting> },
  },
  setup (props, { emit }) {
    const settings = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    return {
      t: vueI18n.t,
      settings,
    }
  },
})
</script>

<style lang="sass" scoped>
.control-panel
  background: #666666
  border-radius: 4px
  height: 120px
  margin: 8px 0 16px
  padding: 8px
</style>
