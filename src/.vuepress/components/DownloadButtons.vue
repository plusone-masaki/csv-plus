<template>
<div class="downloads">
  <h3 v-if="release" class="version">最新バージョン： {{ release.tag_name }}</h3>
  <div class="downloads__main">
    <div v-if="downloads.windows" class="downloads__os">
      <div class="downloads__os--icon">
        <MdiIcon icon="windows" />
      </div>

      <div class="downloads__os--buttons">
        <DownloadButton
            title="Windows"
            subtitle="(インストーラ版)"
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

    <div v-if="downloads.debian" class="downloads__os">
      <div class="downloads__os--icon">
        <MdiIcon icon="linux" />
      </div>
      <div class="downloads__os--buttons">
        <DownloadButton
            v-if="downloads.debian"
            title="Debian/Ubuntu"
            subtitle="(.deb)"
            :href="downloads.debian.browser_download_url"
        />
      </div>
    </div>
  </div>

  <div v-if="downloads.others.length" class="downloads__other-release">
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
      <tr v-for="asset in downloads.others">
        <td>{{ targetOS(asset) }}</td>
        <td>{{ release.tag_name }}</td>
        <td>
          <a :href="asset.browser_download_url">{{ asset.name }}</a>
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
        mac: null,
        debian: null,
        others: [],
      },
    }
  },
  async mounted () {
    // 最新のリリース情報を取得
    const url = 'https://api.github.com/repos/plusone-masaki/csv-plus/releases'
    const { data } = await axios.get(url, { headers: { accept: 'application/vnd.github.v3+json' } })
    this.release = data.filter(release => !release.draft)[0]
    this.release.assets.forEach(asset => {
      if (/setup.+\.zip$/.test(asset.name)) this.downloads.windows = asset
      else if (/\.dmg$/.test(asset.name)) this.downloads.mac = asset
      else if (/\.deb$/.test(asset.name)) this.downloads.debian = asset
      else if (!/(.blockmap|ya?ml)$/.test(asset.name)) this.downloads.others.push(asset)
    })
  },
  methods: {
    targetOS (asset) {
      if (asset.name.indexOf('exe') !== -1) return 'Windows'
      if (asset.name.indexOf('win') !== -1) return 'Windows'
      if (asset.name.indexOf('AppImage') !== -1) return 'Linux'
    },
  },
}
</script>

<style lang="stylus" scoped>
.downloads
  .version
    text-align: center

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
