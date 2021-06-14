<template>
<div class="downloads">
  <div class="downloads__os">
    <div class="downloads__os--icon">
      <MdiIcon icon="windows" />
    </div>

    <div class="downloads__os--buttons">
      <DownloadButton
          href=""
          title="Windows"
          subtitle="(.msi)"
      />
    </div>
  </div>

  <div class="downloads__os">
    <div class="downloads__os--icon">
      <MdiIcon icon="apple" />
    </div>
    <div class="downloads__os--buttons">
      <DownloadButton
          href=""
          title="MacOS"
          subtitle="(.app)"
      />
    </div>
  </div>

  <div class="downloads__os">
    <div class="downloads__os--icon">
      <MdiIcon icon="linux" />
    </div>
    <div class="downloads__os--buttons">
      <DownloadButton
          href=""
          title="Ubuntu"
          subtitle="(.deb)"
      />
      <DownloadButton
          href=""
          title="Linux"
          subtitle="(.AppImage)"
      />
    </div>
  </div>
</div>
</template>

<script>
import MdiIcon from './common/MdiIcon'
import DownloadButton from './DownloadButton'

export default {
  name: 'DownloadButtons',
  components: {
    MdiIcon,
    DownloadButton,
  },
}
</script>

<style lang="stylus" scoped>
.downloads
  border-bottom: solid 1px $borderColor
  display: flex
  justify-content: center
  margin: 0 -1.5rem 3rem
  text-align: center

  &__os
    margin: 0 16px
    padding: 16px
    width: 300px

    &--buttons
      display: flex
      margin: 16px -4px 0

  @media (max-width: $MQMobile)
    flex-direction: column

    &__os
      margin: 0 1.5rem
</style>
