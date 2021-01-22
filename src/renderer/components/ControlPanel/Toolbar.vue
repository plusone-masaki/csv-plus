<template lang="pug">
div.toolbar
  slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toolbar',
})
</script>

<style lang="sass" scoped>
.toolbar
  border-bottom: 1px solid rgba(255, 255, 255, 0.08)
  border-left: 8px solid
  display: flex
  white-space: nowrap
</style>
