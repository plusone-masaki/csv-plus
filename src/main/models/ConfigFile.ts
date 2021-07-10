import fs from 'fs'
import { app } from 'electron'

export default class ConfigFile {
  private static CONFIG_FILE_PATH = app.getPath('userData') + '/config.json'

  public static async getConfig () {
    try {
      fs.accessSync(ConfigFile.CONFIG_FILE_PATH, fs.constants.F_OK)
      return JSON.parse(fs.readFileSync(this.CONFIG_FILE_PATH, { encoding: 'utf8' }))
    } catch (e) {
      return {}
    }
  }

  public static save (data: string) {
    fs.writeFile(ConfigFile.CONFIG_FILE_PATH, data, error => {
      if (error) throw error
    })
  }
}
