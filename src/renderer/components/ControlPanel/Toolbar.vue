<template lang="pug">
div.toolbar
  div.toolbar__content
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toolbar',
})
</script>

<style lang="sass">
.toolbar
  border-left: 8px solid

  &__content
    align-items: center
    display: flex
    white-space: nowrap

  &__icon.icon-btn
    height: 28px
    padding: 4px
    width: 28px
</style>
