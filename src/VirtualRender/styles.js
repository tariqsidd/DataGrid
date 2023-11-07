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
  deleteButton: {
    margin: "4px",
    color: "white",
    backgroundColor: "#F04438",
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
  stickyHeaderBox: {
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  columnHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid rgba(224, 224, 224, 1)",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.5,
    letterSpacing: "0.01071em",
    color: "rgba(0, 0, 0, 0.87)",
    width: "min-content",
    minWidth: "100%",
  },
}));
