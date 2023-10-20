import GridTextField from "./GridTextField";
import GridDateField from "./GridDateField";
import GridSelect from "./GridSelect";
import React from "react";

export const getCellType = (
  header,
  editingValue,
  handleBlur,
  setEditingValue
) => {
  switch (header.headerCellType) {
    case "textField":
      return (
        <GridTextField
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}
        />
      );
    case "number":
      return (
        <GridTextField
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}
        />
      );
    case "date":
      return (
        <GridDateField
          header={header}
          editingValue={editingValue}
          setEditingValue={setEditingValue}
          handleBlur={handleBlur}
        />
      );
    case "select":
      return (
        <GridSelect
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}
        />
      );
    default:
      return (
        <GridTextField
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}
        />
      );
  }
};

export const getCellError = (rowIndex, fieldName, data) => {
  const rowErrorsObj = data[rowIndex].errorObj;
  if (rowErrorsObj && rowErrorsObj[fieldName]) {
    return rowErrorsObj[fieldName];
  }
  return null;
};

export const cellHasError = (rowIndex, fieldName, data) => {
  return !!getCellError(rowIndex, fieldName, data);
};

export const errorIdentifier = (data) =>
  data.flatMap((row, rowIndex) =>
    row.errorObj
      ? Object.keys(row.errorObj).map((cellName) => ({
          rowIndex,
          cellName,
        }))
      : []
  );

export const cellContent = (row, header) => row[header.headerFieldName];

export const addNewRow = (tableHeaders, data) => {
  const getDefaultForType = (type) => {
    switch (type) {
      case "string":
        return "";
      case "Date":
        return "";
      case "number":
        return null;
      default:
        return "";
    }
  };
  const newRow = {};
  tableHeaders.forEach((header) => {
    newRow[header.headerFieldName] = getDefaultForType(header.headerFieldType);
  });
  newRow["errorObj"] = {};
  const newData = [...data];
  newData.push(newRow);
  return newData;
};
