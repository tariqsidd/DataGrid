import React, { useEffect, useState } from "react";
import { IconButton, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { setSubscribedData, subscribeToData } from "./Reactive/subscriber";
import { commonStyles } from "./styles";
import { errorIdentifier } from "./utils";

const ErrorAlert = ({ tableOptions = {}, data = [] }) => {
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorCells, setErrorCells] = useState([]);
  console.log("Error Alert Rendered");

  useEffect(() => {
    const errors = tableOptions.showErrors ? errorIdentifier(data) : [];
    if (errors.length > 0) {
      if (errors[0]) {
        setSubscribedData("errorFocusCell", {
          current: {
            rowIndex: errors[errors.length - 1].rowIndex,
            fieldName: errors[errors.length - 1].cellName,
            rowId: errors[errors.length - 1].id,
          },
          next: {
            rowIndex: errors[0].rowIndex,
            fieldName: errors[0].cellName,
            rowId: errors[0].id,
          },
        });
      }
    } else {
      setSubscribedData("errorFocusCell", null);
    }
    setErrorCells(errors);
  }, []);

  useEffect(() => {
    subscribeToData("gridData", getGridData);
  }, []);
  const getGridData = (value) => {
    const errors = tableOptions.showErrors ? errorIdentifier(value) : [];
    if (errors.length > 0) {
      if (errors[0]) {
        setSubscribedData("errorFocusCell", {
          current: {
            rowIndex: errors[errors.length - 1].rowIndex,
            fieldName: errors[errors.length - 1].cellName,
            rowId: errors[errors.length - 1].id,
          },
          next: {
            rowIndex: errors[0].rowIndex,
            fieldName: errors[0].cellName,
            rowId: errors[0].id,
          },
        });
      }
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
          rowId: errorCells[currentErrorIndex].id,
        },
        next: {
          rowIndex: errorCells[nextErrorIndex].rowIndex,
          fieldName: errorCells[nextErrorIndex].cellName,
          rowId: errorCells[nextErrorIndex].id,
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
          <div className={classes.errorAlert2}>
            <div className={classes.errorTitle}>
              <ErrorOutlineIcon
                style={{
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  color: "#f44336",
                }}
              />
              <Typography>{`${errorCells.length} Error(s) found !`}</Typography>
            </div>
            <div>
              <IconButton
                onClick={handlePrevError}
                aria-label="previous error"
                style={{ padding: "4px" }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={handleNextError}
                aria-label="next error"
                style={{ padding: "4px" }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorAlert;
