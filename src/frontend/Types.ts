type SudokuValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type JSONPrimitives = number | string | boolean | null
type JSONArray = JSON[]
type JSONObject = { [key: string]: JSON }
type JSON = JSONPrimitives | JSONArray | JSONObject

export {SudokuValues, JSON, JSONPrimitives, JSONObject, JSONArray}