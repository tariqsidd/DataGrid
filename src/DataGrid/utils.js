import GridTextField from "./TextField";
import GridDateField from "./GridDateField";
import GridSelect from "./GridSelect";
import React from "react";

export const getCellType = (header, editingValue, handleBlur, setEditingValue) => {
  switch (header.headerCellType) {
    case "textField":
      return(
        <GridTextField
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}/>
      );
    case "number":
      return(
        <GridTextField
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}/>
      );
    case "date":
      return(
        <GridDateField
          header={header}
          editingValue={editingValue}
          setEditingValue={setEditingValue}
          handleBlur={handleBlur}/>
      );
    case "select":
      return(
        <GridSelect
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}/>
      );
    default:
      return(
        <GridTextField
          header={header}
          editingValue={editingValue}
          handleBlur={handleBlur}
          setEditingValue={setEditingValue}/>
      )
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

export const errorIdentifier = (data)=>(
  data.flatMap((row, rowIndex) =>
    Object.keys(row.errorObj).map((cellName) => ({
      rowIndex,
      cellName,
    }))
  )
);

export const cellContent = (row, header) => (row[header.headerFieldName]);

export const addNewRow = (tableHeaders, data)=>{
  const  getDefaultForType = (type) => {
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
    newRow[header.headerFieldName] = getDefaultForType(
      header.headerFieldType
    );
  });
  newRow["errorObj"] = {};
  const newData = [...data];
  newData.push(newRow);
  return newData
};

export const  prepareCSVData = (data, tableHeaders)=>{
  const csvData = [];

  // Add the header row
  const headerRow = tableHeaders.map((header) => header.headerName);
  csvData.push(headerRow);

  // Add the data rows
  data.forEach((row) => {
    const rowData = tableHeaders.map((header) => row[header.headerFieldName]);
    csvData.push(rowData);
  });

  return csvData;
};
