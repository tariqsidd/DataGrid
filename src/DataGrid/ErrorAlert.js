import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { commonStyles } from "./styles";

const ErrorAlert = ({ error = 0 }) => {
  const classes = commonStyles();
  return (
    <>
      {error > 0 && (
        <div className={classes.errorAlert}>
          <MuiAlert elevation={4} variant="standard" severity="error">
            {`${error} Error(s) found !`}
          </MuiAlert>
        </div>
      )}
    </>
  );
};

export default ErrorAlert;
