import labels from "./labels";

/**
 * Render boxes on canvas
 */
const renderBoxes = (boxes, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

  // font configs
  const font = "20px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  // iterate through all boxes
  boxes.forEach((box) => {
    const klass = labels[box.classId];
    const score = (box.probability * 100).toFixed(1);
    let [x1, y1, width, height] = box.bounding;

    // Draw the bounding box.
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 3.5;
    ctx.strokeRect(x1, y1, width, height);

    // Draw the label background.
    ctx.fillStyle = "#00FF00";
    const textWidth = ctx.measureText(klass + " - " + score + "%").width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x1 - 1, y1 - (textHeight + 2), textWidth + 2, textHeight + 2);

    // Draw labels
    ctx.fillStyle = "#ffffff";
    ctx.fillText(klass + " - " + score + "%", x1 - 1, y1 - (textHeight + 2));
  });
};

export { renderBoxes };
