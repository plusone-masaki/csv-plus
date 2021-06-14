<template>
  <a
      class="download-button"
      :href="href"
  >
    <div class="download-button__title">
      {{ title }} <MdiIcon icon="download" color="#fff" size="21" />
    </div>
    <div class="download-button__subtitle">{{ subtitle }}</div>
  </a>
</template>

<script>
import MdiIcon from './common/MdiIcon'

export default {
  name: 'DownloadButton',
  components: { MdiIcon },
  props: {
    href: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
}
</script>

<style lang="stylus" scoped>
.download-button
  background-color: $accentColor
  border-radius: 4px
  color: #ffffff
  display: inline-block
  flex: 1 1 0
  justify-content: center
  margin: 0 4px
  padding: 8px 12px 8px 16px
  text-align: center
  transition: background-color .1s ease
  white-space: nowrap

  &:hover
    background-color lighten($accentColor, 10%)

  &__title
    align-items: flex-end
    display: inline-flex
    font-size: 21px
    font-weight: bold

    &__subtitle
      font-size: 16px
</style>
