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
var substring   = "openeit_server_started";
var loaded = false;
// Python Dash/Plotly Server will be running on http://127.0.0.1:8050/

let pyProc = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  return path.join(__dirname, PY_FOLDER, PY_MODULE+'.py')
}

const getPoPyPath = () => {
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

  // create a listener on the spawned child process, and pump this to the console. 
  pyProc.stderr.on('data', function(data) {
      console.log('stderr: ' + data);

      // find the marker that says the server has loaded then, and only then load the main window. 
      if (data.includes(substring)) {
        //console.log('we found it!')
        loaded = true 
        const url = 'http://127.0.0.1:8050/';
        mainWindow.loadURL(url);

        mainWindow.once('ready-to-show', () => {
          mainWindow.show()
          if (loaded) {
            console.log('finished loading python server')
            mainWindow.show()
          }
          else {
            console.log('not finished loading python server')
          }

        })

      }
  });

  pyProc.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
  });

  pyProc.on('close', function(code) {
      console.log('closing code: ' + code);
  });

  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success')
  }
  else {
      // trying again. 
      console.log('child process failed. Trying again... ')
      pyProc = require('child_process').spawn(popy, [script])
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
  mainWindow = new BrowserWindow({show: false, width: 1100, height: 700, minWidth: 600, minHeight: 150,
    //frame: false // all platforms
  })


  // const url = 'http://127.0.0.1:8050/';
  // mainWindow.loadURL(url);
  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  // })

  // Failed attempt at clearing the cache
  // const options = {"extraHeaders" : "pragma: no-cache\n"};
  // ses.clearCache(()=> mainWindow.loadURL(url, options));

  // and load the index.html of the app.
  /*
  const url = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });
  */
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

// require('electron-reload')(__dirname);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  pyProc.kill()
  pyProc = null
  app.quit()
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
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
