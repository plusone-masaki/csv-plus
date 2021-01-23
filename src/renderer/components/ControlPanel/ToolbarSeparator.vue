<template lang="pug">
hr.toolbar__separator
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToolbarSeparator',
})
</script>

<style lang="sass" scoped>
.toolbar__separator
  border-color: #aaaaaa
  height: inherit
  margin: 4px 0
  max-width: 0
  vertical-align: text-bottom
</style>
