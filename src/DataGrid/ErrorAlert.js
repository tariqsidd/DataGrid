import React, { useEffect, useRef, useState, memo } from "react";
import { IconButton, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { subscribeToData, setSubscribedData } from "./Reactive/subscriber";
import { commonStyles } from "./styles";
import { findIndexById } from "../VirtualRender/utils";

const ErrorAlert = ({ scrollToRow }) => {
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [errorCells, setErrorCells] = useState([]);

  useEffect(() => {
    subscribeToData("listenCellErrors", listenCellErrors);
  }, []);

  useEffect(() => {
    scrollToRow(errorCells[currentErrorIndex]);
  }, [currentErrorIndex]);

  const listenCellErrors = ({ error, key, rowId }) => {
    const compareNumbers = (a, b) => a - b;
    let index = findIndexById(rowId);
    if (error !== null && error[key] !== null) {
      // Add index if it is not already in errorCells
      setErrorCells((prevArray) =>
        prevArray.includes(index)
          ? prevArray.sort(compareNumbers)
          : [...prevArray, index].sort(compareNumbers)
      );
    } else {
      // Remove index from the errorCells
      setErrorCells((prevArray) =>
        prevArray.filter((item) => item !== index).sort(compareNumbers)
      );
    }

    // scrollToRow(290380)
  };

  const handleNextError = (event) => {
    event.stopPropagation();
    if (currentErrorIndex < errorCells.length - 1) {
      setCurrentErrorIndex((prev) => prev + 1);
    } else {
      setCurrentErrorIndex(0);
    }
  };

  const handlePrevError = (event) => {
    event.stopPropagation();
    if (currentErrorIndex > 0) {
      setCurrentErrorIndex((prev) => prev - 1);
    } else {
      setCurrentErrorIndex(errorCells.length - 1);
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

export default memo(ErrorAlert);
