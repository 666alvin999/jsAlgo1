// src/frontend/io/eventHandlers.ts
function eventHandlersInit(params) {
  function canvasMouseMove(event) {
    event.stopPropagation();
    const x = event.offsetX;
    const y = event.offsetY;
    const i = Math.min(Math.floor(x / params.ui.cellSize), 8);
    const j = Math.min(Math.floor(y / params.ui.cellSize), 8);
    const selectedCell = params.getSelectedCell();
    if (selectedCell === null || selectedCell[0] !== i || selectedCell[1] !== j) {
      params.setSelectedCell([i, j]);
      params.refreshGrid();
    }
  }
  function canvasMouseOut(event) {
    event.stopPropagation();
    if (params.getSelectedCell() !== null) {
      params.setSelectedCell(null);
      params.refreshGrid();
    }
  }
  function keyUp(event) {
    event.stopPropagation();
    if (event.key >= "1" && event.key <= "9" && params.getSelectedCell() !== null) {
      params.toggle(parseInt(event.key));
    }
  }
  params.canvas.addEventListener("mousemove", canvasMouseMove);
  params.canvas.addEventListener("mouseout", canvasMouseOut);
  document.onkeyup = keyUp;
}
// src/frontend/io/ui.ts
class SudokuUI {
  _canvas;
  _ctx;
  static _uis = new WeakMap;
  _cellSize;
  static bgColor = "#DDD";
  static thinLineColor = "#AAA";
  static boldLineColor = "#000";
  static impactedColor = "#eec";
  static selectedColor = "#ff6";
  static get(canvas) {
    if (SudokuUI._uis.has(canvas)) {
      return SudokuUI._uis.get(canvas);
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return false;
    }
    const ui = new SudokuUI(canvas, ctx);
    SudokuUI._uis.set(canvas, ui);
    return ui;
  }
  constructor(_canvas, _ctx) {
    this._canvas = _canvas;
    this._ctx = _ctx;
    this._cellSize = Math.round(Math.min(_canvas.width, _canvas.height) / 9);
  }
  get width() {
    return this._canvas.width;
  }
  get height() {
    return this._canvas.height;
  }
  get cellSize() {
    return this._cellSize;
  }
  clearCanvas() {
    this._ctx.fillStyle = SudokuUI.bgColor;
    this._ctx.fillRect(0, 0, this.width, this.height);
    return this;
  }
  drawCell(i, j, cellSize = this._cellSize, borderColor = SudokuUI.thinLineColor, fillColor) {
    const x = i * cellSize;
    const y = j * cellSize;
    if (fillColor) {
      this._ctx.fillStyle = fillColor;
      this._ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    }
    this._ctx.strokeStyle = borderColor;
    this._ctx.strokeRect(x, y, cellSize, cellSize);
    return this;
  }
  drawRow(j, fillColor) {
    for (let i = 0;i < 9; i++) {
      this.drawCell(i, j, this._cellSize, SudokuUI.thinLineColor, fillColor);
    }
    return this;
  }
  drawColumn(i, fillColor) {
    for (let j = 0;j < 9; j++) {
      this.drawCell(i, j, this._cellSize, SudokuUI.thinLineColor, fillColor);
    }
    return this;
  }
  drawGroup(groupI, groupJ, fillColor) {
    this.drawCell(groupI, groupJ, this._cellSize * 3, SudokuUI.boldLineColor, fillColor);
    for (let j = 0;j < 3; j++) {
      for (let i = 0;i < 3; i++) {
        this.drawCell(groupI * 3 + i, groupJ * 3 + j, this._cellSize, SudokuUI.thinLineColor);
      }
    }
    return this;
  }
  drawCellValue(i, j, value) {
    this._ctx.fillStyle = "#000";
    this._ctx.font = "bold 60px Arial";
    this._ctx.textBaseline = "middle";
    this._ctx.textAlign = "center";
    const x = i * this._cellSize + Math.floor(this._cellSize * 0.5);
    const y = j * this._cellSize + Math.floor(this._cellSize * 0.575);
    this._ctx.fillText(value.toString(), x, y);
    return this;
  }
  drawCellDomain(i, j, domain) {
    this._ctx.fillStyle = "#000";
    this._ctx.font = "16px Arial";
    this._ctx.textBaseline = "top";
    this._ctx.textAlign = "start";
    const areaSize = Math.max(this._cellSize - 2, Math.floor(this._cellSize * 0.8));
    const valueStep = Math.floor(areaSize / 3);
    const cellPadding = Math.max(1, Math.floor(this._cellSize * 0.1));
    const x = i * this._cellSize + cellPadding;
    const y = j * this._cellSize + cellPadding;
    for (let k = 1;k <= 9; k++) {
      const vk = domain.hasValue(k) ? k : null;
      const vi = (k - 1) % 3;
      const vj = Math.floor((k - 1) / 3);
      const vx = x + valueStep * vi;
      const vy = y + valueStep * vj;
      this._ctx.fillText(vk !== null ? vk.toString() : "", vx, vy);
    }
    return this;
  }
  drawEmptyGrid() {
    this.clearCanvas();
    for (let j = 0;j < 3; j++) {
      for (let i = 0;i < 3; i++) {
        this.drawGroup(i, j);
      }
    }
    return this;
  }
  colorizeSelectedStuff(selectedCell) {
    if (selectedCell === null) {
      return this;
    }
    const selectedGroup = [
      Math.floor(selectedCell[0] / 3),
      Math.floor(selectedCell[1] / 3)
    ];
    this.drawRow(selectedCell[1], SudokuUI.impactedColor).drawColumn(selectedCell[0], SudokuUI.impactedColor).drawGroup(selectedGroup[0], selectedGroup[1], SudokuUI.impactedColor).drawCell(selectedCell[0], selectedCell[1], this._cellSize, SudokuUI.thinLineColor, SudokuUI.selectedColor);
    return this;
  }
}
// src/frontend/io/ws.ts
function wsInit() {
  const ws = new WebSocket(`ws://${location.host}`);
  ws.onopen = () => setInterval(() => ws.send("ping"), 5000);
  ws.onmessage = (event) => {
    if (event.data !== "Well received") {
      console.log(event.data);
    }
    if (event.data === "reload") {
      location.reload();
    }
  };
}
// src/frontend/bean/domain.ts
class Domain {
  domain;
  constructor(values) {
    this.domain = new Set(values);
  }
  removeValueFromDomain(value) {
    this.domain.delete(value);
  }
  insertValueInDomain(value) {
    this.domain.add(value);
  }
  hasValue(value) {
    return this.domain.has(value);
  }
  copy() {
    return new Domain(Array.from(this.domain));
  }
  toJSON() {
    const result = [];
    for (const v of this.domain) {
      result.push(v);
    }
    return result;
  }
  static validateJSON(json) {
    if (Array.isArray(json) && json.length > 0) {
      const type = typeof json[0];
      const validationOk = json.reduce((acc, element) => acc && typeof element !== type, true);
      if (!validationOk) {
        return false;
      }
    }
    return true;
  }
  static fromJSON(json) {
    if (Domain.validateJSON(json)) {
      return new Domain(json);
    }
    throw new Error(`At least one element do not have the same type as the other`);
  }
}
var domain_default = Domain;

// src/frontend/bean/variable.ts
class Variable {
  domain2;
  value;
  relatedVariables;
  constructor(domain2, value) {
    this.domain = domain2;
    this.value = value;
    this.relatedVariables = new Set;
  }
  removeValueFromDomain(value) {
    this.domain.removeValueFromDomain(value);
  }
  insertValueInDomain(value) {
    if (!this.moreThanOneRelatedVariableHasValue(value)) {
      this.domain.insertValueInDomain(value);
    }
  }
  getDomain() {
    return this.domain;
  }
  getRelatedVariables() {
    return this.relatedVariables;
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    this.value = value;
    Array.from(this.relatedVariables).map((variable) => {
      variable.removeValueFromDomain(value);
    });
  }
  unsetValue() {
    Array.from(this.relatedVariables).map((variable) => {
      variable.insertValueInDomain(this.value);
    });
    this.value = undefined;
  }
  isSet() {
    return typeof this.value !== "undefined";
  }
  toJSON() {
    const result = {
      domain: this.domain.toJSON()
    };
    if (this.isSet()) {
      result.value = this.value;
    }
    return result;
  }
  static fromJSON(json) {
    let validationOk = typeof json === "object" && ("domain" in json);
    if (validationOk && domain_default.validateJSON(json.domain)) {
      const domain2 = new domain_default(json.domain);
      return new Variable(domain2);
    }
    throw new Error(`Unexpected JSONVariable object: ${JSON.stringify(json)}`);
  }
  moreThanOneRelatedVariableHasValue(value) {
    return Array.from(this.relatedVariables).filter((variable) => variable.getValue() === value).length > 1;
  }
}
var variable_default = Variable;

// src/frontend/index.ts
var init = function(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (canvas === null) {
    console.error("Cannot get the given Canvas 2D rendering context");
    return false;
  }
  const ui2 = SudokuUI.get(canvas);
  if (!ui2) {
    return false;
  }
  const cells = [];
  for (let j = 0;j < 9; j++) {
    cells.push([]);
    for (let i = 0;i < 9; i++) {
      cells[j][i] = new variable_default(new domain_default([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    }
  }
  for (let j = 0;j < 9; j++) {
    for (let i = 0;i < 9; i++) {
      let cell = cells[j][i];
      for (let k = 0;k < 9; k++) {
        cell.getRelatedVariables().add(cells[j][k]);
        cell.getRelatedVariables().add(cells[k][i]);
      }
      const iGroup = Math.floor(i / 3);
      const jGroup = Math.floor(j / 3);
      for (let j2 = 0;j2 < 3; j2++) {
        for (let i2 = 0;i2 < 3; i2++) {
          const iCell = iGroup * 3 + i2;
          const jCell = jGroup * 3 + j2;
          if (iCell !== i && jCell !== j) {
            cell.getRelatedVariables().add(cells[jCell][iCell]);
          }
        }
      }
    }
  }
  return { canvas, ui: ui2, cells };
};
var start = function(initialState) {
  const { canvas, ui: ui2, cells } = initialState;
  let selectedCell = null;
  function drawCellContent(i, j) {
    if (cells[j][i].getValue() !== undefined) {
      ui2.drawCellValue(i, j, cells[j][i].getValue());
    } else {
      ui2.drawCellDomain(i, j, cells[j][i].getDomain());
    }
  }
  function drawCellsContent() {
    for (let j = 0;j < 9; j++) {
      for (let i = 0;i < 9; i++) {
        drawCellContent(i, j);
      }
    }
  }
  function toggle(v) {
    const i = selectedCell[0];
    const j = selectedCell[1];
    if (cells[j][i].getValue() === undefined) {
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
    ui2.drawEmptyGrid().colorizeSelectedStuff(selectedCell);
    drawCellsContent();
  }
  eventHandlersInit({
    canvas,
    ui: ui2,
    refreshGrid,
    toggle,
    getSelectedCell: () => selectedCell,
    setSelectedCell: (newCell) => selectedCell = newCell
  });
  wsInit();
  refreshGrid();
};
var retInit = init("sudokuCanvas");
if (retInit) {
  start(retInit);
}
