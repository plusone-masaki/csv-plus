<template lang="pug">
.layout
  header.header
    slot(name="header")

  slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLayout',
})
</script>

<style lang="sass" scoped>
.layout
  box-sizing: border-box
  display: grid
  grid-auto-flow: column dense
  grid-template-rows: min-content 1fr
  min-height: 100vh
</style>
