import React, { useEffect, useState, useRef, createRef } from "react";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import GridHeader from "./GridHeader";
import GridFooter from "./GridFooter";
import GridRow from "./GridRow";
import { DataGridOptions } from "./Constants";
import { addNewRow, errorIdentifier } from "./utils";
import ContextMenu from "./ContextMenu";
import { commonStyles } from "./styles";
import ExportCSVButton from "./ExportCSVButton";
import ErrorAlert from "./ErrorAlert";
import { subscribeToData, unsubscribe } from "./Reactive/subscriber";

const DataGrid = ({
  incomingData,
  tableHeaders,
  incomingTableOptions,
  callExportCSV,
  itemHeight = 40,
  buffer = 15,
}) => {
  console.log("RE-Render");
  // const [errorFocusCell, setErrorFocusCell] = useState(null);
  const [data, setData] = useState(incomingData);
  const [tableOptions, setTableOptions] = useState(DataGridOptions);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
    rowIndex: -1,
  });
  const containerRef = useRef(null);
  const visibleRangeRef = useRef([0, 0]);
  const errorCells = tableOptions.showErrors ? errorIdentifier(data) : [];

  // useEffect(() => {
  //   subscribeToData("errorFocusCell", getErrorFocusCell);
  //   return () => {
  //     // Run on unmount
  //     unsubscribe("errorFocusCell");
  //   };
  // }, []);

  // const getErrorFocusCell = (value) => {
  //   setErrorFocusCell(value);
  // };

  // const rowRefs = data.map(() => createRef());

  // useEffect(() => {
  //   console.log(errorFocusCell);
  //   console.log(rowRefs);
  //   if (errorFocusCell !== null && rowRefs[errorFocusCell.rowIndex].current) {
  //     console.log("here");
  //     const targetRowRef = rowRefs[errorFocusCell.rowIndex].current;
  //     const parentContainer = targetRowRef.closest(".table-container");

  //     if (parentContainer) {
  //       targetRowRef.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }
  //   }
  // }, [errorFocusCell]);

  useEffect(() => {
    function updateVisibleItems() {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const startIndex = Math.max(
          0,
          Math.floor(scrollTop / itemHeight) - buffer
        );
        const endIndex = Math.min(
          data.length,
          startIndex +
            Math.ceil(containerRef.current.clientHeight / itemHeight) +
            2 * buffer
        );
        visibleRangeRef.current = [startIndex, endIndex];
        // setVisibleRange([startIndex, endIndex]);
      }
    }

    updateVisibleItems();
    window.addEventListener("scroll", updateVisibleItems);

    return () => {
      window.removeEventListener("scroll", updateVisibleItems);
    };
  }, [itemHeight, buffer, data.length]);

  useEffect(() => {
    let updatedTableOptions = {
      ...tableOptions,
      ...incomingTableOptions,
    };
    const contextMenu =
      updatedTableOptions.deleteRow || updatedTableOptions.duplicateRow;

    setTableOptions({
      ...updatedTableOptions,
      contextMenu: contextMenu,
    });
  }, [incomingTableOptions]);

  const openContextMenu = (event, rowIndex) => {
    event.preventDefault();
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
      rowIndex: rowIndex,
    });
    setContextMenuVisible(true);
  };

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  const classes = commonStyles();
  return (
    <div className="table-container">
      <ExportCSVButton
        data={data}
        tableOptions={tableOptions}
        tableHeaders={tableHeaders}
        callExportCSV={callExportCSV}
      />
      {tableOptions.showErrorAlert && tableOptions.showErrors && (
        <ErrorAlert errorCells={errorCells} />
      )}
      <Table
        stickyHeader
        ref={containerRef}
        style={{ overflowY: "auto", height: "100%" }}
      >
        <GridHeader tableOptions={tableOptions} tableHeaders={tableHeaders} />
        <TableBody style={{ height: data.length * itemHeight }}>
          {data
            .slice(visibleRangeRef.current[0], visibleRangeRef.current[1])
            .map((row, rowIndex) => (
              // <TableRow
              //   key={rowIndex}
              //   style={{ height: tableOptions.columnHeight }}
              //   onContextMenu={(event) =>
              //     tableOptions.contextMenu
              //       ? openContextMenu(event, rowIndex)
              //       : null
              //   }
              // >
              //   <TableCell className={classes.smallCell} align="center">
              //     {rowIndex}
              //   </TableCell>
              //   {tableHeaders.map((header) => {
              //     const hasError = tableOptions.showErrors
              //       ? cellHasError(rowIndex, header.headerFieldName, data)
              //       : false;
              //     // const isHighlighted =
              //     //   highlightedCell &&
              //     //   highlightedCell.rowIndex === rowIndex &&
              //     //   highlightedCell.fieldName === header.headerFieldName;
              //     const isErrorFocused =
              //       errorFocusCell &&
              //       errorFocusCell.rowIndex === rowIndex &&
              //       errorFocusCell.fieldName === header.headerFieldName;
              //     const isEditing =
              //       editingCell &&
              //       editingCell.rowIndex === rowIndex &&
              //       editingCell.fieldName === header.headerFieldName;

              //     return (
              //       <TableCell
              //         id={`cell-${rowIndex}-${header.headerFieldName}`}
              //         key={header.headerName}
              //         align="center"
              //         onClick={() => {
              //           if (!editingCell)
              //             handleHighlight(rowIndex, header.headerFieldName);
              //         }}
              //         onDoubleClick={() => handleDoubleClick(rowIndex, header)}
              //         draggable={tableOptions.editing ? !editingCell : false}
              //         onDragStart={() => handleDragStart(rowIndex, header)}
              //         onDragOver={handleDragOver}
              //         onDragEnter={() => handleDragEnter(rowIndex, header)}
              //         onDragEnd={handleDragEnd}
              //         onDrop={() => handleDrop(rowIndex, header)}
              //         style={getCellStyle(rowIndex, header)}
              //         // style={{
              //         //   width: "100px",
              //         //   maxWidth: "100px",
              //         //   overflow: "hidden",
              //         //   ...(isHighlighted
              //         //     ? {
              //         //         border: isEditing ? "" : "2px dotted black",
              //         //         position: "relative",
              //         //       }
              //         //     : {
              //         //         border: "1px solid #8080801a",
              //         //       }),
              //         //   padding: "0px",
              //         //   fontSize: "0.75em",
              //         //   backgroundColor:
              //         //     hasError || isErrorFocused ? "#ffe6e6" : "#fff",
              //         // }}
              //       >
              //         {tableOptions.editing && isEditing ? (
              //           getCellType(
              //             header,
              //             editingValue,
              //             handleBlur,
              //             setEditingValue
              //           )
              //         ) : (
              //           <>
              //             {tableOptions.showErrors &&
              //             (hasError || isErrorFocused) ? (
              //               <ErrorCell
              //                 tableOptions={tableOptions}
              //                 data={data}
              //                 row={row}
              //                 header={header}
              //                 hasError={hasError}
              //                 rowIndex={rowIndex}
              //                 isErrorFocused={isErrorFocused}
              //                 errorCells={errorCells}
              //                 currentErrorIndex={currentErrorIndex}
              //                 setCurrentErrorIndex={setCurrentErrorIndex}
              //                 setErrorFocusCell={setErrorFocusCell}
              //                 setHighlightedCell={setHighlightedCell}
              //                 handleHighlight={handleHighlight}
              //               />
              //             ) : (
              //               cellContent(row, header, hasError, rowIndex)
              //             )}
              //           </>
              //         )}
              //       </TableCell>
              //     );
              //   })}
              // </TableRow>
              <GridRow
                tableOptions={tableOptions}
                tableHeaders={tableHeaders}
                rowIndex={rowIndex}
                row={row}
                data={data.slice(
                  visibleRangeRef.current[0],
                  visibleRangeRef.current[1]
                )}
                rowrefs={rowRefs[rowIndex]}
                openContextMenu={openContextMenu}
              />
            ))}
          {tableOptions.addRow && (
            <GridFooter
              addRow={() => setData(addNewRow(tableHeaders, data))}
              tableHeaders={tableHeaders}
              tableOptions={tableOptions}
            />
          )}
        </TableBody>
      </Table>
      <ContextMenu
        tableOptions={tableOptions}
        setData={setData}
        data={data}
        contextMenuVisible={contextMenuVisible}
        contextMenuPosition={contextMenuPosition}
        closeContextMenu={closeContextMenu}
      />
    </div>
  );
};

export default DataGrid;
