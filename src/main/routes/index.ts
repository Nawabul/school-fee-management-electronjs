import { BrowserWindow, ipcMain } from "electron";
import ClassController from "../controller/ClassController";


export default function (mainWindow:BrowserWindow){


  // class
  ipcMain.handle("class:create",ClassController.create);
}
