const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ort = require("onnxruntime-node");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Load YOLOv7 model
let session;
(async () => {
  session = await ort.InferenceSession.create(path.join(__dirname, "yolov7-tiny.onnx"));

  // warmup model
  var tensor = new ort.Tensor("float32", new Float32Array(1228800), [1, 3, 640, 640]);
  await session.run({ images: tensor });
  console.log(session);
})();

// Use express to serve frontend
const express = require("express");
const server = express();
server.use(express.static(path.join(__dirname, "frontend-dist")));

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend-dist", "index.html"));
});

const serving = server.listen(0, () => {
  console.log("Listening on port:", serving.address().port);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // load from vite development point
  if (process.env.SERVER === "vite") mainWindow.loadURL("http://localhost:5173/");
  // if not SERVER specified from express
  else mainWindow.loadURL(`http://localhost:${serving.address().port}/`);

  // If development mode open the DevTools.
  if (process.env.NODE_ENV === "development") mainWindow.webContents.openDevTools();
};

/**
 * Detect image frame from frontend
 */
const detect = async (frame) => {
  var input = new Float32Array(frame.buffer); // array buffer to float32array
  var tensor = new ort.Tensor("float32", input, [1, 3, 640, 640]); // create ort.Tensor
  var { output } = await session.run({ images: tensor }); // run session and get output layer
  var boxes = [];

  // looping through output
  for (let r = 0; r < output.size; r += output.dims[1]) {
    var data = output.data.slice(r, r + output.dims[1]); // get rows
    var [x0, y0, x1, y1, classId, score] = data.slice(1);
    var w = x1 - x0,
      h = y1 - y0;
    boxes.push({
      classId: classId,
      probability: score,
      bounding: [x0, y0, w, h],
    });
  }
  return boxes;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("image", async (event, data) => {
    const boxes = await detect(data);
    return boxes;
  });

  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
