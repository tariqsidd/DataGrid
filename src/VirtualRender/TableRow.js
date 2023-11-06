import React, { useEffect, useState, memo, useCallback } from "react";
import { Box, Checkbox, Tooltip } from "@material-ui/core";
import TableCell from "./TableCell";
import {
  subscribeToData,
  setSubscribedData,
  getSubscribedData,
} from "../DataGrid/Reactive/subscriber";
import { findIndexById, getColumnOrder } from "./utils";
import { tableCellStyles } from "./TableHeader";
import Ajv from "ajv";

const ajv = new Ajv();

const TableRow = ({ item, itemHeight, columns, onRowChange, index }) => {
  const [rowData, setRowData] = useState(item);
  const [selected, setSelected] = useState(
    item.selected ? item.selected : false
  );

  useEffect(() => {
    setRowData(item);
    setSelected(item.selected ? item.selected : false);
    subscribeToData("willRowMutate", willRowMutate);
  }, []);

  const mutateRow = useCallback(
    (updatedCell, key, row, error) => {
      row[key] = updatedCell;
      row['error'] = error;
      setRowData({ ...row });
    },
    [rowData]
  );

  const willRowMutate = ({ endCellValues, startCellValues }) => {
    let { rowId: end_row_id } = endCellValues;
    let {
      key,
      column: header,
      cellValue: valueForOverWrite,
      rowId: start_row_id,
    } = startCellValues;
    let current = findIndexById(item.indexId);
    let from = findIndexById(start_row_id);
    let to = findIndexById(end_row_id);
    if (current >= from && current <= to) {
      rowData["error"] = validateRowData(
        key,
        rowData,
        header,
        valueForOverWrite
      );
      mutateRow(valueForOverWrite, key, rowData);
      onRowChange(rowData);
    }
  };

  const validateRowData = useCallback((fieldName, rowData, header, value) => {
    const errors = rowData.error
      ? JSON.parse(JSON.stringify(rowData.error))
      : {};
    if (errors.hasOwnProperty(fieldName)) {
      delete errors[fieldName];
    }
    const schema = header.headerSchema;
    const fieldKey = header.headerFieldName;
    let valueToValidate = {};
    if (header.headerCellType === "number") {
      if (typeof value === "number") {
        valueToValidate = { [fieldKey]: value };
      } else if (value.length > 0) {
        valueToValidate = { [fieldKey]: parseInt(value, 10) };
      }
    } else if (header.headerCellType === "select") {
      const options = header.headerOptions.map((option) => option.value);
      let valid = options.includes(value);
      if (!valid) {
        let error = `"${value}" is not a valid selection. Please choose from the available options in the dropdown`;
        errors[fieldKey] = error;
      }
      if (value.length > 0) {
        valueToValidate = { [fieldKey]: value };
      }
    } else {
      if (value.length > 0) {
        valueToValidate = { [fieldKey]: value };
      }
    }

    if (schema) {
      const validate = ajv.compile(schema);
      if (!validate(valueToValidate)) {
        errors[fieldKey] = validate.errors[0].message;
      }
    }

    //Sorting Error
    return Object.fromEntries(
      getColumnOrder()
        .filter((key) => errors.hasOwnProperty(key))
        .map((key) => [key, errors[key]])
    );
  }, []);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: item.top,
        height: itemHeight,
        width: "100%",
        backgroundColor: "#fff",
      }}
    >
      <Box key={item.indexId} style={tableCellStyles.cellStyle(columns, 15)}>
        <Tooltip title={"Select to Delete Row"} arrow>
          <Checkbox
            color="default"
            checked={selected}
            onChange={() => {
              const deleteRowsId = getSubscribedData("rowsToDelete");
              const index = deleteRowsId.indexOf(item.indexId);
              if (index === -1) {
                deleteRowsId.push(item.indexId);
              } else {
                deleteRowsId.splice(index, 1);
              }
              setSubscribedData("rowsToDelete", deleteRowsId);
              let row = { ...rowData };
              mutateRow(!selected, "selected", row);
              setSelected(!selected);
              onRowChange(row);
            }}
          />
        </Tooltip>
      </Box>

      {columns.map((column, index) => (
        <TableCell
          key={`${item.indexId}-${column.headerFieldName}-${index}`}
          column={column}
          rowId={item.indexId}
          width={`${100 / columns.length}%`}
          isError={rowData?.error ? rowData.error : {}}
          onChangeCell={(updatedCell, error) => {
            mutateRow(updatedCell, column.headerFieldName, rowData, error);
            onRowChange(rowData);
          }}
        >
          {rowData[column.headerFieldName]}
        </TableCell>
      ))}
    </Box>
  );
};

export default memo(TableRow, (previousProps, nextProps) => {
  return previousProps.item.top === nextProps.item.top
});

