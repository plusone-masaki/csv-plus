<template lang="pug">
.wrapper
  header
    slot(name="header")
  main
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
  grid-template-rows: 100px 1fr
  min-height: 100vh
  padding: 16px
</style>
