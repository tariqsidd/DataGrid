export const indexMap = new Map();
let DragStartCellOrdinate = null;
let DragEndCellOrdinate = null;

export const setStartCellOrdinate = (cellValue, key, rowId) => {
  DragStartCellOrdinate = {
    cellValue,
    key,
    rowId,
  };
};

export const setEndCellOrdinate = (cellValue, key, rowId) => {
  DragEndCellOrdinate = {
    cellValue,
    key,
    rowId,
  };
};

export const getStartCellOrdinate = () => {
  return DragStartCellOrdinate;
};

export const getEndCellOrdinate = () => {
  return DragEndCellOrdinate;
};

export const clearOrdinates = () => {
  DragStartCellOrdinate = null;
  DragEndCellOrdinate = null;
};

export const convertToHasMap = (data) => {
  const indexMap = new Map();
  data.forEach((item, index) => {
    indexMap.set(item.indexId, index);
  });
  return indexMap;
};

export const findIndexById = (indexId) => {
  return indexMap.has(indexId) ? indexMap.get(indexId) : -1;
};