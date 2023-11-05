export const indexMap = new Map();
let DragStartCellOrdinate = null;
let DragEndCellOrdinate = null;
let columnOrder = [];

export const setColumnOrder = (tableHeaders) => {
  columnOrder = tableHeaders.map((item) => item.headerFieldName);
};

export const getColumnOrder = () => {
  return columnOrder;
};

export const setStartCellOrdinate = (cellValue, column, key, rowId) => {
  DragStartCellOrdinate = {
    cellValue,
    column,
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
  console.log("Clear ordinates called");
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

export const convertToHashMap = (data, chunkSize = 500) => {
  // Function to add items to the map in chunks
  const addToMapInChunks = (startIndex) => {
    for (
      let i = startIndex;
      i < Math.min(startIndex + chunkSize, data.length);
      i++
    ) {
      const item = data[i];
      indexMap.set(item.indexId, i);
    }
  };

  // Loop to process the entire dataset in chunks
  for (let i = 0; i < data.length; i += chunkSize) {
    addToMapInChunks(i);
  }
};
