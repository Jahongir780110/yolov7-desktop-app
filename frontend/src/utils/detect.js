import { renderBoxes } from "./renderBox";

/**
 * Do detection process to show boxes in canvas
 * WARNING: this function really depended on global streaming state and electronAPI
 */
const detect = (src, canvas, kind = "video") => {
  const ctx = canvas.getContext("2d");
  const [modelWidth, modelHeight] = [640, 640];

  if (kind === "video") {
    const cap = new cv.VideoCapture(src); // capture video
    const mat = new cv.Mat(src.height, src.width, cv.CV_8UC4); // original frame
    const matC3 = new cv.Mat(modelWidth, modelHeight, cv.CV_8UC3); // resize to new image matrix

    const processVideo = async () => {
      try {
        // if streaming is off
        if (!window.streaming) {
          // clean memory.
          mat.delete();
          matC3.delete();
          return;
        }
        // start processing.
        cap.read(mat); // read video frame
        cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR
        const input = cv.blobFromImage(
          matC3,
          1 / 255.0,
          new cv.Size(modelWidth, modelHeight),
          new cv.Scalar(0, 0, 0),
          true,
          false
        ); // preprocessing image matrix to blob
        const array = input.data32F.slice(); // image array
        const boxes = await electronAPI.detect(array); // detect image and await result from backend
        renderBoxes(boxes, ctx); // render boxes
        input.delete(); // clean memory

        requestAnimationFrame(processVideo); // request next frame
      } catch (err) {
        console.error(err);
      }
    };

    processVideo(); // start
  } else if (kind === "image") {
    // start processing.
    const mat = cv.imread(src); // read image
    const matC3 = new cv.Mat(modelWidth, modelHeight, cv.CV_8UC3); // resize to new image matrix
    cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR
    const input = cv.blobFromImage(
      matC3,
      1 / 255.0,
      new cv.Size(modelWidth, modelHeight),
      new cv.Scalar(0, 0, 0),
      true,
      false
    ); // preprocessing image matrix to blob
    const array = input.data32F.slice(); // image array
    electronAPI.detect(array).then((boxes) => {
      renderBoxes(boxes, ctx); // render boxes
      input.delete(); // clean memory
      matC3.delete();
    }); // detect image and await result from backend
  }
};

export { detect };
