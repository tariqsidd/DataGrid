import React, {useEffect, useState, memo, useCallback} from "react";
import {Box} from "@material-ui/core";
import TableCell from "./TableCell";
import {subscribeToData} from "../DataGrid/Reactive/subscriber";
import {findIndexById} from "./utils";

const TableRow = ({ item, itemHeight, columns, onRowChange }) => {
  const [rowData, setRowData] = useState(item);

  useEffect(()=>{
    setRowData(item);
    subscribeToData('willRowMutate', willRowMutate)
  },[]);

  const mutateRow = useCallback((updatedCell, key, row)=>{
    row[key] = updatedCell;
    setRowData({...row});
  },[rowData]);

  const willRowMutate = ({endCellValues, startCellValues})=>{
    let {rowId: end_row_id} = endCellValues;
    let {key, cellValue: valueForOverWrite, rowId: start_row_id} = startCellValues;
    let current = findIndexById(item.id);
    let from = findIndexById(start_row_id);
    let to = findIndexById(end_row_id);
    if (current >= from && current <= to){
      mutateRow(valueForOverWrite, key, rowData);
      onRowChange(rowData)
    }
  };

  return(
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: item.top,
        height: itemHeight,
        width: '100%',
        backgroundColor: '#fff',
      }}
    >
      {columns.map((column, index) => (
        <TableCell
          key={`${index}-cell`}
          column={column}
          rowId={item.id}
          width={`${100 / columns.length}%`}
          onChangeCell={(updatedCell)=>{
            let row =  {...rowData};
            mutateRow(updatedCell, column.headerFieldName, row);
            onRowChange(row)
          }}
        >
          {rowData[column.headerFieldName]}
        </TableCell>
      ))}
    </Box>
  )
};

export default memo(TableRow,(previousProps, nextProps)=>{
  return previousProps.id === nextProps.id
});
