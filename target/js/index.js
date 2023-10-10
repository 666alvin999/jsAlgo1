// src/frontend/webSocketStarter.ts
var webClientStarter = () => {
  const wsClient = new WebSocket(`ws://${location.host}`);
  wsClient.onopen = () => {
    setInterval(() => wsClient.send("Hello mon copaing"), 5000);
  };
  wsClient.onmessage = (event) => {
    if (event.data === "reload") {
      location.reload();
    }
  };
};
var webSocketStarter_default = webClientStarter;

// src/frontend/canvas.ts
var backgroundColor = "#999";
var sameGroupColor = "#c2b500";
var sameLineCellColor = "#9d9300";
var canvas = document.querySelector("#sudokuCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var cellSize = Math.round(Math.min(width, height) / 9);
var cellDomains = [];
var cellValues = [];
var mousePosX = null;
var mousePosY = null;
for (let i = 0;i < 9; i++) {
  cellDomains.push([]);
  cellValues.push([]);
  for (let j = 0;j < 9; j++) {
    cellDomains[i].push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    cellValues[i].push(null);
  }
}
window.addEventListener("keypress", (event) => {
  const keyNumber = parseInt(event.key);
  if (mousePosX !== null && mousePosY !== null && !isNaN(keyNumber) && keyNumber !== 0) {
    for (let i = 0;i < 9; i++) {
      if (i < Math.floor(mousePosX / 3) * 3 || i >= Math.floor(mousePosX / 3) * 3 + 3) {
        changeCellDomains(i, mousePosY, keyNumber);
        changeCellDomains(mousePosX, i, keyNumber);
      }
    }
    for (let k = Math.floor(mousePosX / 3) * 3;k < Math.floor(mousePosX / 3) * 3 + 3; k++) {
      for (let l = Math.floor(mousePosY / 3) * 3;l < Math.floor(mousePosY / 3) * 3 + 3; l++) {
        if (k !== mousePosX || l !== mousePosY) {
          changeCellDomains(k, l, keyNumber);
        }
      }
    }
    drawCell(mousePosX, mousePosY, cellSize, "grey", "yellow");
    changeCellValues(mousePosX, mousePosY, keyNumber.toString());
  } else if (mousePosX !== null && mousePosY !== null && !isNaN(keyNumber)) {
  }
});
canvas.addEventListener("mousemove", (event) => {
  const i = Math.min(Math.floor(event.offsetX / cellSize), 8);
  const j = Math.min(Math.floor(event.offsetY / cellSize), 8);
  if (mousePosX !== i || mousePosY !== j) {
    drawGrid();
    mousePosX = i;
    mousePosY = j;
    for (let k = 0;k < 9; k++) {
      drawCell(k, mousePosY, cellSize, "grey", sameLineCellColor);
      drawCell(mousePosX, k, cellSize, "grey", sameLineCellColor);
    }
    for (let k = Math.floor(mousePosX / 3) * 3;k < Math.floor(mousePosX / 3) * 3 + 3; k++) {
      for (let l = Math.floor(mousePosY / 3) * 3;l < Math.floor(mousePosY / 3) * 3 + 3; l++) {
        drawCell(k, l, cellSize, "grey", sameGroupColor);
      }
    }
    drawCell(mousePosX, mousePosY, cellSize, "yellow", "yellow");
    drawDomains();
    drawValues();
  }
});
canvas.addEventListener("mouseout", () => {
  drawGrid();
  mousePosX = null;
  mousePosY = null;
});
var changeCellDomains = (i, j, value) => {
  if (cellDomains[j][i].includes(value)) {
    cellDomains[j][i].splice(cellDomains[j][i].indexOf(value), 1);
  } else {
    cellDomains[j][i].push(value);
    cellDomains[j][i].sort();
  }
};
var changeCellValues = (i, j, keyNumber) => {
  const value = parseInt(keyNumber);
  cellValues[j][i] = cellValues[j][i] !== value ? value : cellValues[j][i] = null;
  drawValue(i, j);
  console.log(cellValues[j][i]);
};
var clearCanvas = () => {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
};
var drawDomain = (i, j) => {
  const domain = cellDomains[j][i];
  const areaSize = Math.max(cellSize - 2, Math.floor(cellSize * 0.8));
  const valueStep = Math.floor(areaSize / 3);
  const cellPadding = Math.max(1, Math.floor(cellSize * 0.1));
  const x = i * cellSize + cellPadding;
  const y = j * cellSize + cellPadding;
  for (let k = 1;k <= 9; k++) {
    const vk = domain.includes(k) ? k : null;
    const vi = (k - 1) % 3;
    const vj = Math.floor((k - 1) / 3);
    const vx = x + valueStep * vi;
    const vy = y + valueStep * vj;
    ctx.fillText(vk ? vk.toString() : "", vx, vy);
  }
};
var drawDomains = () => {
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.textBaseline = "top";
  ctx.textAlign = "start";
  for (let i = 0;i < 9; i++) {
    for (let j = 0;j < 9; j++) {
      if (!cellValues[j][i]) {
        drawDomain(i, j);
      }
    }
  }
};
var drawValues = () => {
  for (let i = 0;i < 9; i++) {
    for (let j = 0;j < 9; j++) {
      drawValue(i, j);
    }
  }
};
var drawValue = (i, j) => {
  if (cellValues[j][i]) {
    ctx.fillStyle = "#000";
    ctx.font = "32px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(cellValues[j][i].toString(), i * cellSize + cellSize / 2, j * cellSize + cellSize / 2);
  }
};
var drawCell = (x, y, cellSize2, borderColor, fillColor) => {
  const startX = x * cellSize2;
  const startY = y * cellSize2;
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(startX, startY, cellSize2, cellSize2);
  }
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(startX, startY, cellSize2, cellSize2);
};
var drawGroup = (i, j) => {
  for (let k = 0;k < 3; k++) {
    for (let l = 0;l < 3; l++) {
      drawCell(k + 3 * i, l + 3 * j, cellSize, "grey");
    }
  }
  drawCell(i, j, cellSize * 3, "black");
};
var drawGrid = () => {
  clearCanvas();
  for (let i = 0;i < 3; i++) {
    for (let j = 0;j < 3; j++) {
      drawGroup(i, j);
    }
  }
  drawDomains();
  drawValues();
};
console.log(cellValues);
console.log(cellDomains);

// src/frontend/index.ts
webSocketStarter_default();
drawGrid();
