import React, {useState, useRef, useCallback, useEffect} from "react";
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

const TableCell = React.memo(({ children, width, column, onChangeCell, rowId, header }) => {
  const [editMode, setEditMode] = useState(false);
  const cellValue = useRef(null);

  useEffect(()=>{
    cellValue.current = children
  },[children])

  let extraProps = {
    ...(column?.headerOptions && {options: column.headerOptions})
  };

  const renderInputField = () => {
    if(editMode){
      return(
        <GenericTextField
          type={column.headerCellType}
          label={column.headerName}
          schema={column.headerSchema}
          value={cellValue.current}
          onChange={(updatedCell)=>{
            cellValue.current = updatedCell;
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
      draggable={!header}
      onDragOver ={onDragOver}
      onDrop={()=>{onDrop(children, column.headerFieldName, rowId)}}
      style={tableCellStyles.cellStyle(width, header)}
      onDragStart={()=>{onDragStart(children, column.headerFieldName, rowId)}}
      onDoubleClick={()=>onDoubleClick(cellValue.current)}
      onDragEnd={clearOrdinates}>
      {renderInputField()}
    </Box>
  )
});

export const tableCellStyles = {
  cellStyle: (width, header)=>{
    return({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent:'center',
      width: width,
      textAlign: 'left',
      padding: '16px',
      ...(!header && {border: '1px solid rgba(224, 224, 224, 1)'}),
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    })
  }
};

export default TableCell
