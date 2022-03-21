import fs from 'fs'
import { app } from 'electron'
import { ConfigData } from '@/@types/types'

const CONFIG_FILE_PATH = app.getPath('userData') + '/config.json'

const defaultConfigData = (): ConfigData => ({
  updateNotification: true,
})

class Config {
  readonly config: ConfigData

  public constructor () {
    try {
      fs.accessSync(CONFIG_FILE_PATH, fs.constants.F_OK)
      const configData = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8' }))
      this.config = Object.assign(defaultConfigData(), configData)
    } catch (e) {
      this.config = defaultConfigData()
    } finally {
      this.save()
    }
  }

  get updateNotification () {
    return this.config.updateNotification ?? true
  }

  set updateNotification (enable: boolean) {
    this.config.updateNotification = enable
    this.save()
  }

  private save () {
    fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(this.config), error => {
      if (error) throw error
    })
  }
}

export default new Config()
