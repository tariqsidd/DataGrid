import React from "react";
import { IconButton, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { commonStyles } from "./styles";

const ErrorAlert = ({
  error = 0,
  handlePrevError = () => {},
  handleNextError = () => {},
}) => {
  const classes = commonStyles();
  return (
    <>
      {error > 0 && (
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
              <Typography>{`${error} Error(s) found !`}</Typography>
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
