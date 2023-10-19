/// <reference lib="dom" />

import {wsInit, SudokuUI, eventHandlersInit} from "./io"
import Domain from "./io/bean/domain.ts";
import Variable from "./io/bean/variable.ts";

type SudokuValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type InitialState = {
    readonly canvas: HTMLCanvasElement,
    readonly ui: SudokuUI,
    readonly cells: Array<Array<Variable<SudokuValues>>>
}

function init(canvasId: string): InitialState | false {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;

    if (canvas === null) {
        console.error("Cannot get the given Canvas 2D rendering context");
        return false;
    }

    const ui = SudokuUI.get(canvas);

    if (!ui) {
        return false;
    }

    const cells: Array<Array<Variable<SudokuValues>>> = [];

    for (let j = 0; j < 9; j++) {
        cells.push([]);

        for (let i = 0; i < 9; i++) {
            cells[j][i] = new Variable<SudokuValues>(i, j, new Domain<SudokuValues>([1, 2, 3, 4, 5, 6, 7, 8, 9]));
        }
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell: Variable<SudokuValues> = cells[j][i];

            for (let k = 0; k < 9; k++) {
                cell.getRelatedVariables().add(cells[k][cell.getPosX()]);
                cell.getRelatedVariables().add(cells[cell.getPosY()][k]);
            }

            const iGroup = Math.floor(i / 3);
            const jGroup = Math.floor(j / 3);

            for (let j2 = 0; j2 < 3; j2++) {
                for (let i2 = 0; i2 < 3; i2++) {
                    const iCell = iGroup * 3 + i2;
                    const jCell = jGroup * 3 + j2;

                    if (iCell !== i && jCell !== j) {
                        cell.getRelatedVariables().add(cells[jCell][iCell]);
                    }
                }
            }
        }
    }

    return {canvas, ui, cells};
}

function start(initialState: InitialState) {
    const {canvas, ui, cells} = initialState;

    let selectedCell: [number, number] | null = null;

    function drawCellContent(i: number, j: number) {
        if (cells[j][i].getValue() !== null) {
            ui.drawCellValue(i, j, cells[j][i].getValue()!);
        } else {
            ui.drawCellDomain(i, j, cells[j][i].getDomain());
        }
    }

    function drawCellsContent() {
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 9; i++) {
                drawCellContent(i, j);
            }
        }
    }

    function toggle(v: SudokuValues) {
        const i = selectedCell![0];
        const j = selectedCell![1];

        if (cells[j][i].getValue() === null) {
            if (cells[j][i].getDomain().hasValue(v)) {
                cells[j][i].setValue(v);
                refreshGrid();
            }
        } else if (cells[j][i].getValue() === v) {
            cells[j][i].unsetValue();
            refreshGrid();
        }
    }

    function refreshGrid() {
        ui.drawEmptyGrid().colorizeSelectedStuff(selectedCell);

        drawCellsContent();
    }

    eventHandlersInit({
        canvas,
        ui,
        refreshGrid,
        toggle,
        getSelectedCell: () => selectedCell,
        setSelectedCell: (newCell: [number, number] | null) => selectedCell = newCell,
    });

    wsInit();
    refreshGrid();
}

const retInit = init("sudokuCanvas");

if (retInit) {
    start(retInit);
}
