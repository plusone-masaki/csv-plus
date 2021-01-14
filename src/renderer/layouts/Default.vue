<template lang="pug">
.wrapper
  nav
    slot(name="nav")
  header.header
    slot(name="header")
  main.main
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLayout',
})
</script>

<style lang="sass" scoped>
.wrapper
  box-sizing: border-box
  display: grid
  grid-auto-flow: column dense
  grid-template-rows: min-content min-content 1fr
  min-height: 100vh

.header
  padding: 16px
.main
  box-sizing: inherit
  padding: 8px 16px
  position: relative
  width: 100vw
</style>
