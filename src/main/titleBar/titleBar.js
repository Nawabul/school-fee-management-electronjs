// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const titleBar = (ipcMain, mainWindow) => {
  ipcMain.handle('minimize', async () => {
    mainWindow.minimize()
  })

  ipcMain.handle('toggle', async () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.handle('close', async () => {
    mainWindow.close()
  })

  //events
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('isMaximize')
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('isRestore')
  })
}
export default titleBar
