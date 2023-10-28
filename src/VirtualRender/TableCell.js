import React, {useState, useRef, useCallback} from "react";
import {Box} from "@material-ui/core";
import {DataGridOptions} from "./index";
import GenericTextField from "./GenericTextField";
import {
  clearOrdinates,
  getEndCellOrdinate,
  getStartCellOrdinate,
  setEndCellOrdinate,
  setStartCellOrdinate
} from "./utils";
import {setSubscribedData} from "../DataGrid/Reactive/subscriber";

const TableCell = React.memo(({ children, width, column, onChangeCell, rowId }) => {
  const [editMode, setEditMode] = useState(false);
  const cellValue = useRef(children);

  let extraProps = {
    ...(column?.headerOptions && {options: column.headerOptions})
  };

  const renderInputField = () => {
    if(editMode){
      return(
        <GenericTextField
          type={column.headerCellType}
          label={column.headerName}
          value={cellValue.current}
          onChange={(updatedCell)=>{
            onChangeCell(updatedCell);
            setEditMode(false)
          }}
          {...extraProps}
        />
      )
    }
    return children
  };

  const onDoubleClick = ()=>{
    if (DataGridOptions.editing) {
      setEditMode(true)
    }
  };

  const onDragOver = useCallback((e)=>{
    e.preventDefault();
  },[]);

  const onDragStart = (cellValue, key, rowId)=>{
    setStartCellOrdinate(cellValue, key, rowId);
  };

  const onDrop = (cellValue, key, rowId)=>{
    setEndCellOrdinate(cellValue, key, rowId);
    const startCellValues =  getStartCellOrdinate();
    const endCellValues =  getEndCellOrdinate();
    const CellOrdinates= {startCellValues, endCellValues};
    if(startCellValues.key === endCellValues.key){
      setSubscribedData('willRowMutate',CellOrdinates)
    }
  };

  return(
    <Box
      draggable={true}
      onDragOver ={onDragOver}
      onDrop={()=>{onDrop(children, column.headerFieldName, rowId)}}
      style={tableCellStyles.cellStyle(width)}
      onDragStart={()=>{onDragStart(children, column.headerFieldName, rowId)}}
      onDoubleClick={()=>onDoubleClick(cellValue.current)}
      onDragEnd={clearOrdinates}>
      {renderInputField()}
    </Box>
  )
});

export const tableCellStyles = {
  cellStyle: (width)=>{
    return({
      display: 'inline-flex',
      alignItems: 'center',
      width: width,
      textAlign: 'left',
      padding: '16px',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    })
  }
};

export default TableCell
