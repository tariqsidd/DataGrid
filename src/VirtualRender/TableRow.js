import React, {useEffect, useState, memo, useCallback} from "react";
import {Box, Checkbox, Tooltip} from "@material-ui/core";
import TableCell from "./TableCell";
import {
  subscribeToData,
  setSubscribedData,
  getSubscribedData,
} from "../DataGrid/Reactive/subscriber";
import {findIndexById} from "./utils";
import {tableCellStyles} from "./TableHeader";

const TableRow = ({item, itemHeight, columns, onRowChange}) => {
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
    (updatedCell, key, row) => {
      row[key] = updatedCell;
      setRowData({...row});
    },
    [rowData]
  );

  const willRowMutate = ({endCellValues, startCellValues}) => {
    let {rowId: end_row_id} = endCellValues;
    let {
      key,
      cellValue: valueForOverWrite,
      rowId: start_row_id,
    } = startCellValues;
    let current = findIndexById(item.indexId);
    let from = findIndexById(start_row_id);
    let to = findIndexById(end_row_id);
    if (current >= from && current <= to) {
      mutateRow(valueForOverWrite, key, rowData);
      onRowChange(rowData);
    }
  };

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
              let row = {...rowData};
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
          isError={rowData?.error || {[column.headerFieldName]: null}}
          onChangeCell={(updatedCell, error) => {
            let row = {...rowData, error};
            mutateRow(updatedCell, column.headerFieldName, row);
            onRowChange(row);
          }}
        >
          {rowData[column.headerFieldName]}
        </TableCell>
      ))}
    </Box>
  );
};

export default memo(TableRow, (previousProps, nextProps) => {
  return previousProps.id === nextProps.id;
});
