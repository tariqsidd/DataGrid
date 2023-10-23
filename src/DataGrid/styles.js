import { makeStyles } from "@material-ui/core/styles";

export const commonStyles = makeStyles((theme) => ({
  smallCell: {
    border: "1px solid #8080801a",
    width: "30px",
    maxWidth: "30px",
    overflow: "hidden",
    padding: "0px",
    fontSize: "0.75em",
  },
  highlightedSmallCell: {
    width: "30px",
    maxWidth: "30px",
    padding: "4px",
    fontSize: "0.75em",
    border: "1px solid #8080801a",
    backgroundColor: "#fafafa",
  },
  highlightedCell: {
    padding: "4px",
    fontSize: "0.75em",
    border: "1px solid #8080801a",
    backgroundColor: "#fafafa",
  },
  footerAddIcon: {
    color: "#000000de",
    height: "25px",
  },
  errorCell: {
    backgroundColor: "#ffe6e6",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  errorCellContentFocused: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorCellContentUnFocused: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  contextMenu: {
    position: "fixed",
    background: "white",
    border: "1px solid #ccc",
    boxShadow: "2px 2px 5px #888888",
    zIndex: 1000,
  },
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
  exportCSVButton: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px",
  },
  errorAlert: {
    paddingRight: "4px",
    paddingLeft: "4px",
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  errorAlert2: {
    paddingRight: "6px",
    paddingLeft: "8px",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#ffe6e6",
    display: "flex",
    borderRadius: "4px",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    justifyContent: "space-between",
  },
  errorTitle: {
    display: "flex",
    alignItems: "center",
  },
  cellValue: {
    overflow: "hidden",
    maxWidth: "80%",
  },
}));
