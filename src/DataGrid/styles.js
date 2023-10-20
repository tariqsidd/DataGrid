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
    width: "150px",
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
    width: "150px",
    backgroundColor: "#ffe6e6",
    display: "flex",
    flexDirection: "row",
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
  cellValue: {
    overflow: "hidden",
    maxWidth: "80%",
  },
}));