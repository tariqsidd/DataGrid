import React, {useState, useRef, useCallback, useEffect} from "react";
import {Box, Tooltip} from "@material-ui/core";
import {DataGridOptions} from "./index";
import GenericTextField from "./GenericTextField";
import {
  clearOrdinates,
  getEndCellOrdinate,
  getStartCellOrdinate,
  setEndCellOrdinate,
  setStartCellOrdinate,
} from "./utils";
import {
  setSubscribedData,
  subscribeToData,
} from "../DataGrid/Reactive/subscriber";

const TableCell = React.memo(
  ({children, width, column, onChangeCell, rowId, isError}) => {
    console.log('isError',isError)
    const [validCell, setValidCell] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const cellValue = useRef(null);
    const cellRef = useRef(null);
    useEffect(() => {
      let keys = Object.keys(isError)
      if (keys[0] === column.headerFieldName && isError[column.headerFieldName] !== null) {
        isError[column.headerFieldName].length && setValidCell(false)
      }
    }, [isError]);

    useEffect(() => {
      cellValue.current = children;
    }, [children]);

    let extraProps = {
      ...(column?.headerOptions && {options: column.headerOptions}),
    };

    const renderInputField = () => {
      if (editMode) {
        return (
          <GenericTextField
            type={column.headerCellType}
            isError={validCell}
            errorObj={isError}
            label={column.headerName}
            schema={column.headerSchema}
            validationKey={column.headerFieldName}
            value={cellValue.current}
            onChange={(updatedCell, isValid, error) => {
              cellValue.current = updatedCell;
              onChangeCell(updatedCell, error);
              setEditMode(false);
              setValidCell(isValid);
              setSubscribedData("listenCellErrors", {rowId, error, key: column.headerFieldName})
            }}
            {...extraProps}
          />
        );
      }
      return children;
    };

    const onDoubleClick = () => {
      if (DataGridOptions.editing) {
        setEditMode(true);
      }
    };

    const onDragOver = useCallback((e) => {
      e.preventDefault();
    }, []);

    const onDragStart = (cellValue, key, rowId) => {
      setStartCellOrdinate(cellValue, key, rowId);
    };

    const onDrop = (cellValue, key, rowId) => {
      setEndCellOrdinate(cellValue, key, rowId);
      const startCellValues = getStartCellOrdinate();
      const endCellValues = getEndCellOrdinate();
      const CellOrdinates = {startCellValues, endCellValues};
      if (startCellValues.key === endCellValues.key) {
        setSubscribedData("willRowMutate", CellOrdinates);
      }
    };

    const BoxWithToolTip = ()=>{
      if(!validCell){
        return(
          <Tooltip title={isError[column.headerFieldName]} placement="bottom" style={{ color: 'red' }}>
            <Box
              ref={cellRef}
              draggable={true}
              onDragOver={onDragOver}
              onDrop={() => {
                onDrop(children, column.headerFieldName, rowId);
              }}
              style={tableCellStyles.cellStyle(width, validCell)}
              onDragStart={() => {
                onDragStart(children, column.headerFieldName, rowId);
              }}
              onDoubleClick={() => onDoubleClick(cellValue.current)}
              onDragEnd={clearOrdinates}>
              {renderInputField()}
            </Box>
          </Tooltip>
        )
      }
      else {
        return(
          <Box
            ref={cellRef}
            draggable={true}
            onDragOver={onDragOver}
            onDrop={() => {
              onDrop(children, column.headerFieldName, rowId);
            }}
            style={tableCellStyles.cellStyle(width, validCell)}
            onDragStart={() => {
              onDragStart(children, column.headerFieldName, rowId);
            }}
            onDoubleClick={() => onDoubleClick(cellValue.current)}
            onDragEnd={clearOrdinates}>
            {renderInputField()}
          </Box>
        )
      }
    }

    return (
      <BoxWithToolTip/>
    );
  }
);

export const tableCellStyles = {
  cellStyle: (width, validCell) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: width,
      textAlign: "left",
      padding: "16px",
      border: `1px solid rgba(224, 224, 224, 1)`,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
      ...(!validCell && {backgroundColor: "#ffe6e6"}),
    };
  },
};

export default TableCell;
