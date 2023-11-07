import { makeStyles } from "@material-ui/core/styles";

export const commonStyles = makeStyles((theme) => ({
  dateField: {
    width: "90%",
    "& .MuiIconButton-root": {
      padding: 0,
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 8,
    },
    "& .MuiInputAdornment-positionEnd": {
      marginLeft: 8,
    },
  },
  selectField: {
    width: "90%",
  },
  textField: {
    width: "90%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingBottom: "8px",
  },
  button: {
    margin: "4px",
  },
  errorAlert: {
    paddingRight: "6px",
    paddingLeft: "8px",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#ffe6e6",
    display: "flex",
    // borderRadius: "4px",
    // boxShadow:
    //   "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    justifyContent: "space-between",
  },
  errorFreeAlert: {
    paddingRight: "6px",
    paddingLeft: "8px",
    paddingTop: "12px",
    paddingBottom: "12px",
    backgroundColor: "#ECFDF3",
    display: "flex",
    // borderRadius: "4px",
    // boxShadow:
    //   "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    justifyContent: "space-between",
  },
  errorTitle: {
    display: "flex",
    alignItems: "center",
  },
}));
