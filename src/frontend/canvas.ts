const backgroundColor = "#999";
const aroundCellColor = "#c2b500";
const sameLineCellColor = "#9d9300"

const canvas = document.querySelector("#sudokuCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const width = canvas.width;
const height = canvas.height;
const cellSize = Math.round(Math.min(width, height) / 9);

const cellDomains: number[][][] = [];
const cellValues: (number | null)[][] = [];

let mousePosX = 0;
let mousePosY = 0;

canvas.addEventListener("mousemove", (event) => {
    const i = Math.min(Math.floor(event.offsetX / cellSize), 8);
    const j = Math.min(Math.floor(event.offsetY / cellSize), 8);

    if (mousePosX !== i || mousePosY !== j) {
        drawGrid();
        mousePosX = i;
        mousePosY = j;

        for (let k = 0; k < 9; k++) {
            drawCell(k, mousePosY, cellSize, "grey", sameLineCellColor);
            drawCell(mousePosX, k, cellSize, "grey", sameLineCellColor);
        }

        for (let k = mousePosX - 1; k < mousePosX + 2; k++) {
            for (let l = mousePosY - 1; l < mousePosY + 2; l++) {
                drawCell(k, l, cellSize, "grey", aroundCellColor);
            }
        }

        drawCell(mousePosX, mousePosY, cellSize, "yellow", "yellow");
        drawDomains();
    }
});

canvas.addEventListener("mouseout", (event) => {
    console.log("Sortie de la grille");
    drawGrid();
});

for (let i = 0; i < 9; i++) {
    cellDomains.push([]);
    cellValues.push([]);

    for (let j = 0; j < 9; j++) {
        cellDomains[i].push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        cellValues[i].push(null);
    }
}

const clearCanvas = () => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
};

const drawDomain = (i: number, j: number) => {
    const domain = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const areaSize = Math.max(cellSize - 2, Math.floor(cellSize * 0.8));
    const valueStep = Math.floor(areaSize / 3);
    const cellPadding = Math.max(1, Math.floor((cellSize * 0.1)));

    const x = i * cellSize + cellPadding;
    const y = j * cellSize + cellPadding;

    for (let k = 1; k <= 9; k++) {
        const vk = domain.includes(k) ? k : null;
        const vi = (k - 1) % 3;
        const vj = Math.floor((k - 1) / 3);
        const vx = x + valueStep * vi;
        const vy = y + valueStep * vj;

        ctx.fillText(vk !== null ? vk.toString() : "", vx, vy);
    }
}

const drawDomains = () => {
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textBaseline = "top";
    ctx.textAlign = "start";

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            drawDomain(i, j);
        }
    }
}

const drawCell = (x: number, y: number, cellSize: number, borderColor: string, fillColor?: string) => {
    const startX = x * cellSize;
    const startY = y * cellSize;

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(startX, startY, cellSize, cellSize);
    }

    ctx.strokeStyle = borderColor;
    ctx.strokeRect(startX, startY, cellSize, cellSize);
}

const drawGroup = (i: number, j: number) => {
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            drawCell(k + (3 * i), l + (3 * j), cellSize, "grey");
        }
    }
    drawCell(i, j, cellSize * 3, "black");
}

const drawGrid = () => {
    clearCanvas();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            drawGroup(i, j);
        }
    }

    drawDomains();
}

export {drawGrid};