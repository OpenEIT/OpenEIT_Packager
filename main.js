// const electron = require('electron');
// const {session} = require('electron');

// // Module to control application life.
// const app = electron.app
// // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow

// const path = require('path')
// const url = require('url')


const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')


/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'pydistribution'
const PY_FOLDER = 'eit_dash'
const PY_MODULE = 'app' // without .py suffix
const PO_PI = 'bin'

let pyProc = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  // if (!guessPackaged()) {
  //   return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  // }
  // if (process.platform === 'win32') {
  //   return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  // }
  // return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
  return path.join(__dirname, PY_FOLDER, PY_MODULE+'.py')
}

const getPoPyPath = () => {

  // if (process.platform === 'win32') {
  //   return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  // }
  return path.join(__dirname, PY_DIST_FOLDER, PO_PI+'/python')
}

// 
// main window has to wait until create main window. 
// when it is execute rest of code. 
// 
const createPyProc = () => {
  let script  = getScriptPath()
  let popy    = getPoPyPath()

  //console.log(popy)
  //console.log(script)
  // 
  //let port = '' + selectPort()
  // if (guessPackaged()) {
  //   pyProc = require('child_process').execFile(script)
  // } else {
  //   pyProc = require('child_process').spawn('python', [script])
  // }
  // the below is correct
  //pyProc = require('child_process').spawn('/Users/jeanrintoul/Desktop/mindseyebiomedical/EIT/EIT_Altium/EIT_32/python/popy/osx/popy3.7m/bin/python', ['/Users/jeanrintoul/Desktop/mindseyebiomedical/EIT/EIT_Altium/EIT_32/python/OpenEIT_Dashboard/eit_dash/app.py'])
  pyProc = require('child_process').spawn(popy, [script])

 
  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success')
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  //const ses = session.fromPartition('persist:name');

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 600, minHeight: 150,
    //titleBarStyle: 'hidden', // OSX only
    //frame: false // all platforms
  })

  // and load the index.html of the app.
  /*
  const url = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });
  */

  // spawn a child process calling python app.py

  const url = 'http://127.0.0.1:8050/';

  // Failed attempt at clearing the cache
  // const options = {"extraHeaders" : "pragma: no-cache\n"};
  // ses.clearCache(()=> mainWindow.loadURL(url, options));

  mainWindow.loadURL(url);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
