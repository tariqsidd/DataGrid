import React, { useEffect, useRef, useState, memo } from "react";
import { IconButton, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {
  subscribeToData,
  setSubscribedData,
} from "../DataGrid/Reactive/subscriber";
import { commonStyles } from "../DataGrid/styles";
import { findIndexById } from "./utils";
import { errorIdentifier } from "../DataGrid/utils";

const ErrorAlert = ({ scrollToRow, data = [] }) => {
  console.log("Error Alert Rendered");
  // const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  // const [errorCells, setErrorCells] = useState([]);

  // useEffect(() => {
  //   subscribeToData("listenCellErrors", listenCellErrors);
  // }, []);

  // useEffect(() => {
  //   scrollToRow(errorCells[currentErrorIndex]);
  // }, [currentErrorIndex]);

  // const listenCellErrors = ({ error, key, rowId }) => {
  //   const compareNumbers = (a, b) => a - b;
  //   let index = findIndexById(rowId);
  //   if (error !== null && error[key] !== null) {
  //     // Add index if it is not already in errorCells
  //     setErrorCells((prevArray) =>
  //       prevArray.includes(index)
  //         ? prevArray.sort(compareNumbers)
  //         : [...prevArray, index].sort(compareNumbers)
  //     );
  //   } else {
  //     // Remove index from the errorCells
  //     setErrorCells((prevArray) =>
  //       prevArray.filter((item) => item !== index).sort(compareNumbers)
  //     );
  //   }

  //   // scrollToRow(290380)
  // };

  // const handleNextError = (event) => {
  //   event.stopPropagation();
  //   if (currentErrorIndex < errorCells.length - 1) {
  //     setCurrentErrorIndex((prev) => prev + 1);
  //   } else {
  //     setCurrentErrorIndex(0);
  //   }
  // };

  // const handlePrevError = (event) => {
  //   event.stopPropagation();
  //   if (currentErrorIndex > 0) {
  //     setCurrentErrorIndex((prev) => prev - 1);
  //   } else {
  //     setCurrentErrorIndex(errorCells.length - 1);
  //   }
  // };

  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorCells, setErrorCells] = useState([]);

  useEffect(() => {
    if (errorCells.length > 0) {
      let index = findIndexById(errorCells[currentErrorIndex].indexId);
      // console.log("scroll called");
      scrollToRow(index);
    }
  }, [currentErrorIndex]);

  useEffect(() => {
    // console.log("This called");
    const errors = errorIdentifier(data);
    if (errors.length > 0) {
      // console.log("Setting error focus cell");
      if (errors[0]) {
        setTimeout(() => {
          setSubscribedData("errorFocusCell", {
            current: {
              rowIndex: errors[errors.length - 1].rowIndex,
              fieldName: errors[errors.length - 1].cellName,
              rowId: errors[errors.length - 1].indexId,
            },
            next: {
              rowIndex: errors[0].rowIndex,
              fieldName: errors[0].cellName,
              rowId: errors[0].indexId,
            },
          });
          setCurrentErrorIndex(0);
        }, 50);
      }
    } else {
      setSubscribedData("errorFocusCell", null);
    }
    setErrorCells(errors);
  }, [data]);

  useEffect(() => {
    subscribeToData("gridData", getGridData);
  }, []);

  const getGridData = (value) => {
    // console.log("Get GRID DAta  called");
    const errors = errorIdentifier(value);
    if (errors.length > 0) {
      // console.log("Error Cells Length", errorCells.length);
      // console.log("Current Error Index", currentErrorIndex);
      // if (errorCells.length > 0) {
      //   console.log("Setting error focus cell");
      //   setTimeout(() => {
      //     setSubscribedData("errorFocusCell", {
      //       current: {
      //         rowIndex: errors[errors.length - 1].rowIndex,
      //         fieldName: errors[errors.length - 1].cellName,
      //         rowId: errors[errors.length - 1].indexId,
      //       },
      //       next: {
      //         rowIndex: errors[0].rowIndex,
      //         fieldName: errors[0].cellName,
      //         rowId: errors[0].indexId,
      //       },
      //     });
      //     setCurrentErrorIndex(0);
      //   }, 50);
      // }
    } else {
      setSubscribedData("errorFocusCell", null);
    }
    setErrorCells(errors);
  };

  const focusOnErrorCell = (currentErrorIndex, nextErrorIndex) => {
    if (errorCells[currentErrorIndex] && errorCells[nextErrorIndex]) {
      setSubscribedData("errorFocusCell", {
        current: {
          rowIndex: errorCells[currentErrorIndex].rowIndex,
          fieldName: errorCells[currentErrorIndex].cellName,
          rowId: errorCells[currentErrorIndex].indexId,
        },
        next: {
          rowIndex: errorCells[nextErrorIndex].rowIndex,
          fieldName: errorCells[nextErrorIndex].cellName,
          rowId: errorCells[nextErrorIndex].indexId,
        },
      });
    }
  };

  const handleNextError = (event) => {
    event.stopPropagation();

    if (currentErrorIndex < errorCells.length - 1) {
      setCurrentErrorIndex((prev) => prev + 1);
      focusOnErrorCell(currentErrorIndex, currentErrorIndex + 1);
    } else {
      setCurrentErrorIndex(0);
      focusOnErrorCell(currentErrorIndex, 0);
    }
  };

  const handlePrevError = (event) => {
    event.stopPropagation();

    if (currentErrorIndex > 0) {
      setCurrentErrorIndex((prev) => prev - 1);
      focusOnErrorCell(currentErrorIndex, currentErrorIndex - 1);
    } else {
      setCurrentErrorIndex(errorCells.length - 1);
      focusOnErrorCell(currentErrorIndex, errorCells.length - 1);
    }
  };

  const classes = commonStyles();

  return (
    <>
      {errorCells.length > 0 && (
        <div className={classes.errorAlert}>
          {errorCells.length > 0 && (
            <div className={classes.errorTitle}>
              <CancelIcon
                style={{
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  color: "#F04438",
                }}
              />
              <Typography>{`${errorCells.length} Error(s) found !`}</Typography>
            </div>
          )}
          <div>
            <IconButton
              onClick={handlePrevError}
              aria-label="previous error"
              style={{ padding: "4px" }}
              // disabled={currentErrorIndex <= 0}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={handleNextError}
              aria-label="next error"
              style={{ padding: "4px" }}
              // disabled={currentErrorIndex === errorCells.length - 1}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </div>
      )}
      {errorCells.length === 0 && (
        <div className={classes.errorFreeAlert}>
          <div className={classes.errorTitle}>
            <CheckCircleIcon
              style={{
                paddingRight: "8px",
                paddingLeft: "8px",
                color: "#12B76A",
              }}
            />
            <Typography>{`No Error(s) found !`}</Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorAlert;
