import React, {useState, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';

const TableComponent = ({data, tableHeaders, onRowChange}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [highlightedCell, setHighlightedCell] = useState(null); // { rowIndex, fieldName }
  const [draggingCell, setDraggingCell] = useState(null);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorFocusCell, setErrorFocusCell] = useState(null);

  const handleHighlight = (rowIndex, header) => {
    setHighlightedCell({rowIndex, fieldName: header.headerFieldName});
  };

  const handleDragStart = (rowIndex, header) => {
    setDraggingCell({rowIndex, fieldName: header.headerFieldName});
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (targetRowIndex, header) => {
    setHighlightedCell({rowIndex: targetRowIndex, fieldName: header.headerFieldName});
  };

  const handleDragEnd = () => {
    setHighlightedCell(null);
  };

  const handleDrop = (targetRowIndex, header) => {
    if (draggingCell && draggingCell.fieldName === header.headerFieldName) {
      const newData = [...data];
      for (let i = draggingCell.rowIndex; i <= targetRowIndex; i++) {
        newData[i][header.headerFieldName] = data[draggingCell.rowIndex][header.headerFieldName];
      }

      setDraggingCell(null);
      setHighlightedCell(null);
      onRowChange(newData);
    }
  };

  const handleDoubleClick = (rowIndex, header) => {
    setEditingCell({rowIndex, fieldName: header.headerFieldName});
    setEditingValue(data[rowIndex][header.headerFieldName]);
  };

  const handleBlur = () => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.rowIndex][editingCell.fieldName] = editingValue;

      onRowChange(newData[editingCell.rowIndex], editingCell.rowIndex);

      setEditingCell(null);
      setEditingValue('');
    }
  };

  const getCellError = (rowIndex, fieldName) => {
    const rowErrors = data[rowIndex].errors;
    if (rowErrors && rowErrors.length) {
      const errorObj = rowErrors.find(e => e.cellName === fieldName);
      if (errorObj) return errorObj.errorMsg;
    }
    return null;
  };

  const errorCells = data.flatMap((row, rowIndex) =>
    row.errors ? row.errors.map(error => ({rowIndex, cellName: error.cellName})) : []
  );


  const focusOnErrorCell = (index) => {
    if (errorCells[index]) {
      setErrorFocusCell({rowIndex: errorCells[index].rowIndex, fieldName: errorCells[index].cellName});
      setHighlightedCell({rowIndex: errorCells[index].rowIndex, fieldName: errorCells[index].cellName});
    }
  };

  useEffect(() => {
    if (errorCells.length > 0) {
      focusOnErrorCell(0);
    }
  }, [data]);

  const handleNextError = (event) => {
    event.stopPropagation(); // Stop event propagation

    if (currentErrorIndex < errorCells.length - 1) {
      setCurrentErrorIndex(prev => prev + 1);
      focusOnErrorCell(currentErrorIndex + 1);
    }
  };

  const handlePrevError = (event) => {
    event.stopPropagation(); // Stop event propagation

    if (currentErrorIndex > 0) {
      setCurrentErrorIndex(prev => prev - 1);
      focusOnErrorCell(currentErrorIndex - 1);
    }
  };

  const cellHasError = (rowIndex, fieldName) => {
    return !!getCellError(rowIndex, fieldName);
  };

  const cellContent = (row, header, hasError, rowIndex) => (
    <>
      {row[header.headerFieldName]}
      {hasError &&
      <div style={{color: 'red', fontSize: '0.75em'}}>
        {getCellError(rowIndex, header.headerFieldName)}
      </div>
      }
    </>
  );

  const renderErrorCell = (row, header, hasError, rowIndex, isErrorFocused ) => {
    return (
      <Paper elevation={4} style={{
        padding: '2px', // Reduced padding
        backgroundColor: '#ffe6e6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid red'
      }}>
      <span style={{ marginBottom: '2px' }}>
          {cellContent(row, header, hasError, rowIndex)}
      </span>
        {isErrorFocused &&
        <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
          <IconButton
            onClick={(e) => handlePrevError(e)}
            disabled={currentErrorIndex === 0}
            aria-label="previous error"
            style={{padding: '2px'}}
          >
            <ArrowBackIosIcon/>
          </IconButton>

          <IconButton
            onClick={(e) => handleNextError(e)}
            disabled={currentErrorIndex === errorCells.length - 1}
            aria-label="next error"
            style={{padding: '2px'}}
          >
            <ArrowForwardIosIcon/>
          </IconButton>
        </div>
        }
      </Paper>
    )
  };


  return (
    <div>
      <Table>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} style={{ height: '60px' }}>
              {tableHeaders.map(header => {
                const hasError = cellHasError(rowIndex, header.headerFieldName);
                const isHighlighted = highlightedCell && highlightedCell.rowIndex === rowIndex && highlightedCell.fieldName === header.headerFieldName;
                const isErrorFocused = errorFocusCell && errorFocusCell.rowIndex === rowIndex && errorFocusCell.fieldName === header.headerFieldName;
                const isEditing = editingCell && editingCell.rowIndex === rowIndex && editingCell.fieldName === header.headerFieldName;

                return (
                  <TableCell
                    key={header.headerName}
                    onClick={() => {
                      if (!editingCell) handleHighlight(rowIndex, header);
                    }}
                    onDoubleClick={() => handleDoubleClick(rowIndex, header)}
                    draggable={!editingCell}
                    onDragStart={() => handleDragStart(rowIndex, header)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(rowIndex, header)}
                    onDragEnd={handleDragEnd}
                    onDrop={() => handleDrop(rowIndex, header)}
                    style={
                      {
                        ...isHighlighted
                          ? {border: isEditing ? '2px solid blue' : '2px dotted blue', position: 'relative'}
                          : {},
                        padding: '2px', // Reduced padding
                        fontSize: '0.75em' // Reduced font size if needed
                      }
                    }
                  >
                    {isEditing ? (
                      <TextField
                        type={header.headerCellType === 'number' ? 'number' : 'text'}
                        value={editingValue}
                        onBlur={handleBlur}
                        onChange={e => setEditingValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <>
                        {hasError || isErrorFocused ? (
                          renderErrorCell(row, header, hasError, rowIndex, isErrorFocused )
                        ) : cellContent(row, header, hasError, rowIndex)}
                      </>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
