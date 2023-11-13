import "@testing-library/jest-dom";
import {
  getColumnOrder,
  setColumnOrder,
  errorIdentifier,
  setStartCellOrdinate,
  getStartCellOrdinate,
  setEndCellOrdinate,
  getEndCellOrdinate,
  clearOrdinates,
  convertToHashMap,
  indexMap,
  bulkDeleteFromDataAndHashMap,
} from "../utils";

describe("Column Order Tests", () => {
  it("should set columnOrder array to an empty array when no argument is passed", () => {
    setColumnOrder();
    expect(getColumnOrder()).toEqual([]);
  });

  it("should set columnOrder array to an array of header field names extracted from tableHeaders argument", () => {
    const tableHeaders = [
      { headerFieldName: "Name" },
      { headerFieldName: "Age" },
      { headerFieldName: "Location" },
    ];
    setColumnOrder(tableHeaders);
    expect(getColumnOrder()).toEqual(["Name", "Age", "Location"]);
  });

  it("should correctly set columnOrder array when tableHeaders contains only one header field", () => {
    const tableHeaders = [{ headerFieldName: "Name" }];
    setColumnOrder(tableHeaders);
    expect(getColumnOrder()).toEqual(["Name"]);
  });

  it("should correctly set columnOrder array when tableHeaders is null", () => {
    setColumnOrder(null);
    expect(getColumnOrder()).toEqual([]);
  });

  it("should correctly set columnOrder array when tableHeaders is undefined", () => {
    setColumnOrder(undefined);
    expect(getColumnOrder()).toEqual([]);
  });

  it("should correctly set columnOrder array when tableHeaders is an empty array", () => {
    setColumnOrder([]);
    expect(getColumnOrder()).toEqual([]);
  });

  it("should set columnOrder array correctly when tableHeaders contains duplicate header field names", () => {
    const tableHeaders = [
      { headerFieldName: "Field 1" },
      { headerFieldName: "Field 1" },
      { headerFieldName: "Field 2" },
    ];
    setColumnOrder(tableHeaders);
    expect(getColumnOrder()).toEqual(["Field 1", "Field 1", "Field 2"]);
  });

  it("should set columnOrder array correctly when tableHeaders contains non-string header field names", () => {
    const tableHeaders = [
      { headerFieldName: "Field 1" },
      { headerFieldName: 123 },
      { headerFieldName: true },
    ];
    setColumnOrder(tableHeaders);
    expect(getColumnOrder()).toEqual(["Field 1", "123", "true"]);
  });

  it("should set columnOrder array correctly when tableHeaders contains objects without headerFieldName property", () => {
    const tableHeaders = [
      { headerField: "Field 1" },
      { headerField: "Field 2" },
      { headerField: "Field 3" },
    ];
    setColumnOrder(tableHeaders);
    expect(getColumnOrder()).toEqual([]);
  });

  it("should set columnOrder array correctly when tableHeaders contains objects with null headerFieldName property", () => {
    const tableHeaders = [
      { headerFieldName: null },
      { headerFieldName: "Field 1" },
      { headerFieldName: null },
    ];
    setColumnOrder(tableHeaders);
    expect(getColumnOrder()).toEqual(["Field 1"]);
  });
});

describe("Error Identifier Tests", () => {
  it("should return an empty array when the input data is an empty array", () => {
    const data = [];
    const result = errorIdentifier(data);
    expect(result).toEqual([]);
  });

  it("should return an empty array when there are no errors in the input data", () => {
    const data = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
    ];
    const result = errorIdentifier(data);
    expect(result).toEqual([]);
  });

  it("should return an array of objects with the expected properties when there are errors in the input data", () => {
    const data = [
      { name: "John", age: 25, error: { age: "Invalid age" } },
      { name: "Jane", age: 30 },
      {
        name: "Bob",
        age: 35,
        error: { name: "Invalid name", age: "Invalid age" },
      },
    ];
    const result = errorIdentifier(data);
    expect(result).toEqual([
      { rowIndex: 0, cellName: "age", indexId: undefined },
      { rowIndex: 2, cellName: "name", indexId: undefined },
      { rowIndex: 2, cellName: "age", indexId: undefined },
    ]);
  });

  it("should return an empty array when the input data is an array of non-objects", () => {
    const data = [1, 2, 3];
    const result = errorIdentifier(data);
    expect(result).toEqual([]);
  });

  it("should return an array of objects with the expected properties when the input data is an array of objects with empty 'error' properties", () => {
    const data = [
      { error: {}, indexId: 1 },
      { error: {}, indexId: 2 },
      { error: {}, indexId: 3 },
    ];
    const result = errorIdentifier(data);
    expect(result).toEqual([]);
  });
});

describe("Drag Start Cell Ordinate Tests", () => {
  const cellValue = "value";
  const column = "column";
  const key = "key";
  const rowId = "rowId";

  it("should not return anything", () => {
    expect(getStartCellOrdinate()).toBeNull();
  });

  it("should set the DragStartCellOrdinate object with the provided values", () => {
    setStartCellOrdinate(cellValue, column, key, rowId);

    expect(getStartCellOrdinate()).toEqual({
      cellValue,
      column,
      key,
      rowId,
    });
  });

  it("should correctly set the DragStartCellOrdinate object with the provided values", () => {
    setStartCellOrdinate(cellValue, column, key, rowId);

    const DragStartCellOrdinate = getStartCellOrdinate();
    expect(DragStartCellOrdinate.cellValue).toBe(cellValue);
    expect(DragStartCellOrdinate.column).toBe(column);
    expect(DragStartCellOrdinate.key).toBe(key);
    expect(DragStartCellOrdinate.rowId).toBe(rowId);
  });

  it("should update the DragStartCellOrdinate object correctly when called multiple times with different parameters", () => {
    const cellValue1 = "value1";
    const column1 = "column1";
    const key1 = "key1";
    const rowId1 = "rowId1";

    setStartCellOrdinate(cellValue1, column1, key1, rowId1);

    expect(getStartCellOrdinate()).toEqual({
      cellValue: cellValue1,
      column: column1,
      key: key1,
      rowId: rowId1,
    });

    const cellValue2 = "value2";
    const column2 = "column2";
    const key2 = "key2";
    const rowId2 = "rowId2";

    setStartCellOrdinate(cellValue2, column2, key2, rowId2);

    expect(getStartCellOrdinate()).toEqual({
      cellValue: cellValue2,
      column: column2,
      key: key2,
      rowId: rowId2,
    });
  });
});

describe("Drag End Cell Ordinate Tests", () => {
  const cellValue = "value";
  const key = "key";
  const rowId = "rowId";

  it("should not return anything", () => {
    expect(getEndCellOrdinate()).toBeNull();
  });

  it("should set the DragEndCellOrdinate object with the provided values", () => {
    setEndCellOrdinate(cellValue, key, rowId);

    expect(getEndCellOrdinate()).toEqual({
      cellValue,
      key,
      rowId,
    });
  });

  it("should correctly set the DragEndCellOrdinate object with the provided values", () => {
    setEndCellOrdinate(cellValue, key, rowId);

    const DragEndCellOrdinate = getEndCellOrdinate();
    expect(DragEndCellOrdinate.cellValue).toBe(cellValue);
    expect(DragEndCellOrdinate.key).toBe(key);
    expect(DragEndCellOrdinate.rowId).toBe(rowId);
  });

  it("should update the DragStartCellOrdinate object correctly when called multiple times with different parameters", () => {
    const cellValue1 = "value1";
    const key1 = "key1";
    const rowId1 = "rowId1";

    setEndCellOrdinate(cellValue1, key1, rowId1);

    expect(getEndCellOrdinate()).toEqual({
      cellValue: cellValue1,
      key: key1,
      rowId: rowId1,
    });

    const cellValue2 = "value2";
    const key2 = "key2";
    const rowId2 = "rowId2";

    setEndCellOrdinate(cellValue2, key2, rowId2);

    expect(getEndCellOrdinate()).toEqual({
      cellValue: cellValue2,
      key: key2,
      rowId: rowId2,
    });
  });
});

describe("clear Ordinates Test", () => {
  it("should set DragStartCellOrdinate to null", () => {
    clearOrdinates();
    expect(getStartCellOrdinate()).toBeNull();
  });

  it("should set DragEndCellOrdinate to null", () => {
    clearOrdinates();
    expect(getEndCellOrdinate()).toBeNull();
  });
});

describe("convert To HashMap Test", () => {
  beforeEach(() => {
    indexMap.clear();
  });

  it("should correctly convert the input data into a hashmap", () => {
    const data = [
      { indexId: 1, value: "A" },
      { indexId: 2, value: "B" },
      { indexId: 3, value: "C" },
    ];
    convertToHashMap(data);

    expect(indexMap.size).toBe(3);
    expect(indexMap.get(1)).toBe(0);
    expect(indexMap.get(2)).toBe(1);
    expect(indexMap.get(3)).toBe(2);
  });

  it("should handle large datasets by processing them in chunks", () => {
    const data = Array.from({ length: 10000 }, (_, index) => ({
      indexId: index + 1,
      value: String.fromCharCode(65 + (index % 26)),
    }));

    convertToHashMap(data);

    expect(indexMap.size).toBe(10000);
    expect(indexMap.get(1)).toBe(0);
    expect(indexMap.get(10000)).toBe(9999);
  });

  it("should correctly add items to the hashmap", () => {
    const data = [
      { indexId: 1, value: "A" },
      { indexId: 2, value: "B" },
      { indexId: 3, value: "C" },
    ];

    convertToHashMap(data);

    expect(indexMap.size).toBe(3);
    expect(indexMap.get(1)).toBe(0);
    expect(indexMap.get(2)).toBe(1);
    expect(indexMap.get(3)).toBe(2);

    const newItem = { indexId: 4, value: "D" };
    data.push(newItem);
    convertToHashMap(data);

    expect(indexMap.size).toBe(4);
    expect(indexMap.get(4)).toBe(3);
  });

  it("should handle empty input data by not creating a hashmap", () => {
    const data = [];

    convertToHashMap(data);

    expect(indexMap.size).toBe(0);
  });

  it("should handle input data with duplicate indexIds by overwriting the previous value in the hashmap", () => {
    const data = [
      { indexId: 1, value: "A" },
      { indexId: 2, value: "B" },
      { indexId: 3, value: "C" },
      { indexId: 2, value: "D" },
    ];

    convertToHashMap(data);

    expect(indexMap.size).toBe(3);
    expect(indexMap.get(1)).toBe(0);
    expect(indexMap.get(2)).toBe(3);
    expect(indexMap.get(3)).toBe(2);
  });

  it("should handle input data with missing indexIds by not adding them to the hashmap", () => {
    const data = [
      { indexId: 1, value: "A" },
      { value: "B" },
      { indexId: 3, value: "C" },
    ];

    convertToHashMap(data);

    expect(indexMap.size).toBe(2);
    expect(indexMap.get(1)).toBe(0);
    expect(indexMap.get(3)).toBe(2);
  });
});

describe("bulkDeleteFromDataAndHashMap Test", () => {
  it("should remove items with matching indexId from data array and return updated data array", () => {
    const data = [
      { indexId: 1, name: "Item 1" },
      { indexId: 2, name: "Item 2" },
      { indexId: 3, name: "Item 3" },
      { indexId: 4, name: "Item 4" },
    ];
    const idsToDelete = [2, 4];

    convertToHashMap(data);
    const result = bulkDeleteFromDataAndHashMap(data, idsToDelete);

    expect(result).toEqual([
      { indexId: 1, name: "Item 1" },
      { indexId: 3, name: "Item 3" },
    ]);
  });

  it("should return original data array when items do not have indexId", () => {
    const data = [
      { name: "Item 1" },
      { name: "Item 2" },
      { name: "Item 3" },
      { name: "Item 4" },
    ];
    const idsToDelete = [2, 4];

    convertToHashMap(data);
    const result = bulkDeleteFromDataAndHashMap(data, idsToDelete);

    expect(result).toEqual([
      { name: "Item 1" },
      { name: "Item 2" },
      { name: "Item 3" },
      { name: "Item 4" },
    ]);
  });

  it("should remove all items with matching indexId from data array and return updated data array when items have duplicate indexId", () => {
    const data = [
      { indexId: 1, name: "Item 1" },
      { indexId: 2, name: "Item 2" },
      { indexId: 2, name: "Item 3" },
      { indexId: 3, name: "Item 4" },
    ];
    const idsToDelete = [2];

    convertToHashMap(data);
    const result = bulkDeleteFromDataAndHashMap(data, idsToDelete);
    expect(result).toEqual([
      { indexId: 1, name: "Item 1" },
      { indexId: 3, name: "Item 4" },
    ]);
  });

  it("should return empty data array when data array is empty", () => {
    const data = [];
    const idsToDelete = [1, 2, 3];

    convertToHashMap(data);
    const result = bulkDeleteFromDataAndHashMap(data, idsToDelete);

    expect(result).toEqual([]);
  });

  it("should return original data array when idsToDelete array is null", () => {
    const data = [
      { indexId: 1, name: "Item 1" },
      { indexId: 2, name: "Item 2" },
      { indexId: 3, name: "Item 3" },
      { indexId: 4, name: "Item 4" },
    ];
    const idsToDelete = null;

    convertToHashMap(data);
    const result = bulkDeleteFromDataAndHashMap(data, idsToDelete);

    expect(result).toEqual([
      { indexId: 1, name: "Item 1" },
      { indexId: 2, name: "Item 2" },
      { indexId: 3, name: "Item 3" },
      { indexId: 4, name: "Item 4" },
    ]);
  });

  it("should return original data array when idsToDelete array is undefined", () => {
    const data = [
      { indexId: 1, name: "Item 1" },
      { indexId: 2, name: "Item 2" },
      { indexId: 3, name: "Item 3" },
      { indexId: 4, name: "Item 4" },
    ];
    const idsToDelete = undefined;

    convertToHashMap(data);
    const result = bulkDeleteFromDataAndHashMap(data, idsToDelete);

    expect(result).toEqual([
      { indexId: 1, name: "Item 1" },
      { indexId: 2, name: "Item 2" },
      { indexId: 3, name: "Item 3" },
      { indexId: 4, name: "Item 4" },
    ]);
  });
});
