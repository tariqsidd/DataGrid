import React, { useEffect, useState, memo, useCallback } from "react";
import { Box, Checkbox, Tooltip } from "@material-ui/core";
import isEqual from "lodash.isequal";
import TableCell from "./TableCell";
import { subscribeToData, setSubscribedData } from "./Reactive/subscriber";
import { findIndexById, getColumnOrder } from "./utils";
import { commonStyles } from "./styles";
import Ajv from "ajv";

const ajv = new Ajv();

const TableRow = ({ item, itemHeight, columns, onRowChange, tableOptions }) => {
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

  const classes = commonStyles();

  return (
    <Box style={fixedRowStyles.rowStyle(item, itemHeight)}>
      <Box
        key={item.indexId}
        style={fixedTableCellStyles.cellStyle(columns, 40)}
      >
        {tableOptions.deleteRow ? (
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
        ) : (
          findIndexById(item.indexId)
        )}
      </Box>

      {columns.map((column, index) => (
        <TableCell
          key={`${item.indexId}-${column.headerFieldName}-${index}`}
          column={column}
          rowId={item.indexId}
          width={`${100 / columns.length}%`}
          isError={rowData?.error ? rowData.error : {}}
          tableOptions={tableOptions}
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

const fixedTableCellStyles = {
  cellStyle: (columns, p = 100) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${p / columns.length}%`,
      minWidth: "60px",
      textAlign: "left",
      padding: "16px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
      borderLeft: `1px solid rgba(224, 224, 224, 1)`,
      borderBottom: `1px solid rgba(224, 224, 224, 1)`,
    };
  },
};

const fixedRowStyles = {
  rowStyle: (item, itemHeight) => {
    return {
      display: "flex",
      flexDirection: "row",
      position: "absolute",
      top: item.top,
      height: itemHeight,
      width: "100%",
      backgroundColor: "#fff",
    };
  },
};
export default memo(TableRow, isEqual);
