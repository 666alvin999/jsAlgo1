/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

const backgroundColor = "#999";
const sameGroupColor = "#c2b500";
const sameLineCellColor = "#9d9300"

const canvas = document.querySelector("#sudokuCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const width = canvas.width;
const height = canvas.height;
const cellSize = Math.round(Math.min(width, height) / 9);

const cellDomains: number[][][] = [];
const cellValues: (number | null)[][] = [];

let mousePosX: number | null = null;
let mousePosY: number | null = null;

for (let i: number = 0; i < 9; i++) {
    cellDomains.push([]);
    cellValues.push([]);

    for (let j: number = 0; j < 9; j++) {
        cellDomains[i].push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        cellValues[i].push(null);
    }
}

window.addEventListener("keypress", (event: KeyboardEvent) => {
    const keyNumber = parseInt(event.key);

    if (
        mousePosX !== null
        && mousePosY !== null
        && !isNaN(keyNumber)
        && keyNumber !== 0
    ) {
        for (let i: number = 0; i < 9; i++) {
            if (i !== mousePosX || i !== mousePosY) {
                if (cellValues[mousePosY][mousePosX] !== keyNumber) {
                    changeCellDomains(i, mousePosY, cellValues[mousePosY][mousePosX]);
                    changeCellDomains(mousePosX, i, cellValues[mousePosY][mousePosX]);
                }

                console.log(i, mousePosY, sameCellValuesModifyingCoordinates(i, mousePosY, keyNumber))

                if (!sameCellValuesModifyingCoordinates(i, mousePosY, keyNumber)) {
                    changeCellDomains(i, mousePosY, keyNumber);
                }

                if (!sameCellValuesModifyingCoordinates(mousePosX, i, keyNumber)) {
                    changeCellDomains(mousePosX, i, keyNumber);
                }
            }
        }

        for (let k: number = Math.floor(mousePosX / 3) * 3; k < ((Math.floor(mousePosX / 3) * 3) + 3); k++) {
            for (let l: number = Math.floor(mousePosY / 3) * 3; l < ((Math.floor(mousePosY / 3) * 3) + 3); l++) {
                if (k !== mousePosX && l !== mousePosY) {
                    if (cellValues[mousePosY][mousePosX] !== keyNumber) {
                        changeCellDomains(k, l, cellValues[mousePosY][mousePosX]);
                    }

                    changeCellDomains(k, l, keyNumber);
                }
            }
        }

        drawCell(mousePosX, mousePosY, cellSize, "grey", "yellow");
        changeCellValues(mousePosX, mousePosY, keyNumber.toString());
    }
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
    const i = Math.min(Math.floor(event.offsetX / cellSize), 8);
    const j = Math.min(Math.floor(event.offsetY / cellSize), 8);

    if (mousePosX !== i || mousePosY !== j) {
        drawGrid();
        mousePosX = i;
        mousePosY = j;

        for (let k: number = 0; k < 9; k++) {
            drawCell(k, mousePosY, cellSize, "grey", sameLineCellColor);
            drawCell(mousePosX, k, cellSize, "grey", sameLineCellColor);
        }

        for (let k: number = Math.floor(mousePosX / 3) * 3; k < ((Math.floor(mousePosX / 3) * 3) + 3); k++) {
            for (let l: number = Math.floor(mousePosY / 3) * 3; l < ((Math.floor(mousePosY / 3) * 3) + 3); l++) {
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

const sameCellValuesModifyingCoordinates = (posX: number, posY: number, keyNumber: number): boolean => {
    let foundCellValueModifyingCoordinates = false;
    let i = 0;

    while (!foundCellValueModifyingCoordinates && i < 9) {
        if (
            (
                (i !== mousePosY && posX !== mousePosX)
                && (i !== mousePosX && posY !== mousePosY)
            )
            && (
                cellValues[i][posX] === keyNumber
                || cellValues[posY][i] === keyNumber
            )
        ) {
            foundCellValueModifyingCoordinates = true;
        }
        i++;
    }

    return foundCellValueModifyingCoordinates;
}

const changeCellDomains = (i: number, j: number, value: number | null) => {
    if (value) {
        if (cellDomains[j][i].includes(value)) {
            cellDomains[j][i].splice(cellDomains[j][i].indexOf(value), 1);
        } else {
            cellDomains[j][i].push(value);
            cellDomains[j][i].sort();
        }
    }
}

const changeCellValues = (i: number, j: number, keyNumber: string) => {
    const value = parseInt(keyNumber);

    cellValues[j][i] = cellValues[j][i] !== value ? value : null;
    drawValue(i, j);
}

const clearCanvas = () => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
};

const drawDomain = (i: number, j: number) => {
    const domain = cellDomains[j][i];

    const areaSize = Math.max(cellSize - 2, Math.floor(cellSize * 0.8));
    const valueStep = Math.floor(areaSize / 3);
    const cellPadding = Math.max(1, Math.floor((cellSize * 0.1)));

    const x = i * cellSize + cellPadding;
    const y = j * cellSize + cellPadding;

    for (let k: number = 1; k <= 9; k++) {
        const vk = domain.includes(k) ? k : null;
        const vi = (k - 1) % 3;
        const vj = Math.floor((k - 1) / 3);
        const vx = x + valueStep * vi;
        const vy = y + valueStep * vj;

        ctx.fillText(vk ? vk.toString() : "", vx, vy);
    }
}

const drawDomains = () => {
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textBaseline = "top";
    ctx.textAlign = "start";

    for (let i: number = 0; i < 9; i++) {
        for (let j: number = 0; j < 9; j++) {
            if (!cellValues[j][i]) {
                drawDomain(i, j);
            }
        }
    }
}

const drawValues = () => {
    for (let i: number = 0; i < 9; i++) {
        for (let j: number = 0; j < 9; j++) {
            drawValue(i, j);
        }
    }
}

const drawValue = (i: number, j: number) => {
    if (cellValues[j][i]) {
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        ctx.fillText(cellValues[j][i]!.toString(), i * cellSize + cellSize / 2, j * cellSize + cellSize / 2);
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
    for (let k: number = 0; k < 3; k++) {
        for (let l: number = 0; l < 3; l++) {
            drawCell(k + (3 * i), l + (3 * j), cellSize, "grey");
        }
    }
    drawCell(i, j, cellSize * 3, "black");
}

const drawGrid = () => {
    clearCanvas();

    for (let i: number = 0; i < 3; i++) {
        for (let j: number = 0; j < 3; j++) {
            drawGroup(i, j);
        }
    }

    drawDomains();
    drawValues();
}

export {drawGrid};