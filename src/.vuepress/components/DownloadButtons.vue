<template>
<div class="downloads">
  <div class="downloads__main">
    <div v-if="downloads.windows" class="downloads__os">
      <div class="downloads__os--icon">
        <MdiIcon icon="windows" />
      </div>

      <div class="downloads__os--buttons">
        <DownloadButton
            title="Windows"
            subtitle="(.exe)"
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
            subtitle="(.dmg)"
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
            subtitle="(.deb)"
            :href="downloads.ubuntu.browser_download_url"
        />
        <DownloadButton
            v-if="downloads.linux"
            title="Linux"
            subtitle="(.AppImage)"
            :href="downloads.linux.browser_download_url"
        />
      </div>
    </div>
  </div>

  <div v-if="downloads.zip" class="downloads__other-release">
    <h3>その他のリリース</h3>
    <table v-if="release" class="downloads__table">
      <thead>
      <tr>
        <th>対象OS</th>
        <th>バージョン</th>
        <th>ファイル</th>
        <th>最終更新日</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="downloads.zip">
        <td>Windows</td>
        <td>{{ release.tag_name }}</td>
        <td>
          <a :href="downloads.zip.browser_download_url"></a>
          {{ downloads.zip.name }}
        </td>
        <td>{{ release.created_at }}</td>
      </tr>
      </tbody>
    </table>
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
      release: null,
      downloads: {
        windows: null,
        zip: null,
        mac: null,
        ubuntu: null,
        linux: null,
      },
    }
  },
  async mounted () {
    // 最新のリリース情報を取得
    const url = 'https://api.github.com/repos/plusone-masaki/csv-plus/releases'
    const { data } = await axios.get(url, { headers: { accept: 'application/vnd.github.v3+json' } })
    this.release = data.filter(release => !release.draft)[0]
    this.release.assets.forEach(asset => {
      if (/\.exe$/.test(asset.name)) this.downloads.windows = asset
      if (/\.zip$/.test(asset.name)) this.downloads.zip = asset
      if (/\.dmg$/.test(asset.name)) this.downloads.mac = asset
      if (/\.deb$/.test(asset.name)) this.downloads.ubuntu = asset
      if (/\.AppImage$/.test(asset.name)) this.downloads.linux = asset
    })
  },
}
</script>

<style lang="stylus" scoped>
.downloads
  &__main
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

  &__other-release
    text-align: center

  &__table
    margin: 0 auto
    display: table

  @media (max-width: $MQMobile)
    flex-direction: column

    &__os
      margin: 0 1.5rem
</style>
