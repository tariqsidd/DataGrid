import React, { useEffect, useState, memo, useCallback } from "react";
import { Box, Checkbox, Tooltip } from "@material-ui/core";
import isEqual from 'lodash.isequal'
import TableCell from "./TableCell";
import {
  subscribeToData,
  setSubscribedData,
  getSubscribedData,
} from "../DataGrid/Reactive/subscriber";
import { findIndexById, getColumnOrder } from "./utils";
import { fixedTableCellStyles, tableCellStyles } from "./TableHeader";
import Ajv from "ajv";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

const ajv = new Ajv();

const TableRow = ({ item, itemHeight, columns, onRowChange, index }) => {
  const [rowData, setRowData] = useState({});
  const [selected, setSelected] = useState(
    item.selected ? item.selected : false
  );

  useEffect(() => {
    setRowData(item);
    setSelected(item.selected ? item.selected : false);
    subscribeToData("willRowMutate", willRowMutate);
  }, [rowData]);

  const mutateRow = useCallback(
    (updatedCell, key, row, error) => {
      row[key] = updatedCell;
      if (error) {
        row["error"] = error;
      }
      setRowData({ ...row });
      onRowChange(row);
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
      let error = validateRowData(key, rowData, header, valueForOverWrite);
      mutateRow(valueForOverWrite, key, rowData, error);
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
      <Box
        key={item.indexId}
        style={fixedTableCellStyles.cellStyle(columns, 15)}
      >
        <Tooltip title={"Select to Delete Row"} arrow>
          <Checkbox
            color="default"
            checked={selected}
            onChange={() => {
              setSubscribedData("rowsToDelete", rowData.indexId);
              mutateRow(!selected, "selected", rowData);
              setSelected(!selected);
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
          }}
        >
          {rowData[column.headerFieldName]}
        </TableCell>
      ))}
    </Box>
  );
};

export default memo(TableRow, isEqual);

