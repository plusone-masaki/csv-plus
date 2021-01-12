<template lang="pug">
div.tag(
  :class="{ active }"
  @click.stop="onClick"
)
  | {{ isDirty ? '*' : '' }} {{ label || t('tabs.new_tab') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavigationTab',
  props: {
    active: { type: Boolean, default: false },
    label: { type: String, required: true },
    isDirty: { type: Boolean, default: false },
  },
  setup (props, { emit }) {
    return {
      onClick: () => emit('click'),
    }
  },
})
</script>

<style lang="sass" scoped>
.tag
  color: aliceblue
  background: transparent

  &:hover
    background: rgba(255, 255, 255, 0.08)
</style>
