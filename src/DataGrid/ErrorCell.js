import {cellContent, getCellError} from "./utils";
import {Tooltip} from "@material-ui/core";
import React from "react";
import {DataGridOptions as tableOptions} from "./Constants";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";

const ErrorCell = ({data=[], row, header, hasError, rowIndex, isErrorFocused, handlePrevError=()=>{}, handleNextError=()=>{}})=>{
  return(
    <Tooltip title={getCellError(rowIndex, header.headerFieldName, data)} arrow>
      <div
        style={{
          minHeight: tableOptions.columnHeight,
          backgroundColor: "#ffe6e6",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: isErrorFocused ? "space-between" : "space-around",
            width: "100%",
            alignItems: "center",
          }}
        >
          {isErrorFocused && (
            <IconButton
              onClick={handlePrevError}
              // disabled={currentErrorIndex === 0}
              aria-label="previous error"
              style={{padding: "4px"}}
            >
              <ArrowBackIosIcon/>
            </IconButton>
          )}

          <span>{cellContent(row, header, hasError, rowIndex)}</span>
          {isErrorFocused && (
            <IconButton
              onClick={handleNextError}
              // disabled={currentErrorIndex === errorCells.length - 1}
              aria-label="next error"
              style={{padding: "4px", marginTop: "4px"}}
            >
              <ArrowForwardIosIcon/>
            </IconButton>
          )}
        </div>
      </div>
    </Tooltip>
  )
};

export default ErrorCell
