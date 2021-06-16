<template>
<div class="downloads">
  <div v-if="downloads.windows" class="downloads__os">
    <div class="downloads__os--icon">
      <MdiIcon icon="windows" />
    </div>

    <div class="downloads__os--buttons">
      <DownloadButton
          title="Windows"
          :subtitle="downloads.windows.name"
          :href="downloads.windows.browser_download_url"
      />
    </div>
  </div>

  <div v-if="downloads.mac" class="downloads__os">
    <div class="downloads__os--icon">
      <MdiIcon icon="apple" />
    </div>
    <div class="downloads__os--buttons">
      <DownloadButton
          title="MacOS"
          :subtitle="downloads.mac.name"
          :href="downloads.mac.browser_download_url"
      />
    </div>
  </div>

  <div v-if="downloads.ubuntu || downloads.linux" class="downloads__os">
    <div class="downloads__os--icon">
      <MdiIcon icon="linux" />
    </div>
    <div class="downloads__os--buttons">
      <DownloadButton
          v-if="downloads.ubuntu"
          title="Ubuntu"
          :subtitle="downloads.ubuntu.name"
          :href="downloads.ubuntu.browser_download_url"
      />
      <DownloadButton
          v-if="downloads.linux"
          title="Linux"
          :subtitle="downloads.linux.name"
          :href="downloads.linux.browser_download_url"
      />
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import MdiIcon from './common/MdiIcon'
import DownloadButton from './DownloadButton'

export default {
  name: 'DownloadButtons',
  components: {
    MdiIcon,
    DownloadButton,
  },
  data () {
    return {
      downloads: {
        windows: null,
        mac: null,
        ubuntu: null,
        linux: null,
      },
    }
  },
  async mounted () {
    // 最新のリリース情報を取得
    const url = 'https://api.github.com/repos/plusone-masaki/csv-plus/releases/latest'
    const { data } = await axios.get(url, { headers: { accept: 'application/vnd.github.v3+json' } })
    data.assets.forEach(asset => {
      if (/\.msi$/.test(asset.name)) this.downloads.windows = asset
      if (/\.dmg$/.test(asset.name)) this.downloads.mac = asset
      if (/\.deb$/.test(asset.name)) this.downloads.ubuntu = asset
      if (/\.AppImage$/.test(asset.name)) this.downloads.linux = asset
    })
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
