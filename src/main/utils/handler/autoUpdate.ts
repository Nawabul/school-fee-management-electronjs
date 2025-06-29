import { autoUpdater } from 'electron-updater'
import { dialog } from 'electron'

// set autoDownload to false
autoUpdater.autoDownload = false

let isChecked = false
// main exported function
export const checkAndApplyUpdates = (): void => {
  if (isChecked) {
    return undefined
  }

    // check and notify updates
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    dialog.showErrorBox('There was an error', err + ' occurred while trying to look for updates')
  })

  // update available
  autoUpdater.on('update-available', () => {
    // dialog
    //   .showMessageBox({
    //     type: 'info',
    //     title: 'Update available',
    //     message: 'A new update is available. Do you want to update now?',
    //     buttons: ['Update']
    //   })
    //   .then((res) => {
    //     if (res.response === 0) {
    //       autoUpdater.downloadUpdate()
    //     }
    //   })
    //   .catch((err) => dialog.showErrorBox('Download Error','There has been an error downloading the update' + err))
    autoUpdater.downloadUpdate()
    // new Notification({
    //     title: "🚀 New Update Ready!",
    //     body: `✨ A new version (v${info.version}) of the app is now available!`
    // }).show();
  })

  // error
  autoUpdater.on('error', (err) => {
    dialog.showErrorBox(
      'Update Error',
      'An error occurred during the update process: ' + err.message
    )
  })

  // update downloaded
  autoUpdater.on('update-downloaded', (info) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'App Update Ready',
        message: `Update (v${info.version}) is ready. Install now?`,
        buttons: ['Later', 'Install and Restart']
      })
      .then((res) => {
        if (res.response === 1) {
          autoUpdater.quitAndInstall(true, true)
        }
      })
  })
  isChecked = true
}
