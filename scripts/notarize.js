process.env.DEBUG = "electron-notarize*"
const { notarize } = require("electron-notarize")

const password = `@keychain:AC_PASSWORD`

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== "darwin") return

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appBundleId: "com.example.myapp", //★自分のアプリのBundleID(appId)に変更★
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: password,
    ascProvider: process.env.ASC_PROVIDER,
  })
}
