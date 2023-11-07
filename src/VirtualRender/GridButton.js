import React, { useRef, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import { commonStyles } from "./styles";
import { errorIdentifier } from "./utils";
import {
  subscribeToData,
  setSubscribedData,
  getSubscribedData,
} from "./Reactive/subscriber";
import { bulkDeleteFromDataAndHashMap } from "./utils";

const GridButtons = ({
  tableOptions = {},
  tableHeaders = [],
  // data = [],
  callExportCSV = false,
  onSubmit = () => {},
  onProceedAnyway = () => {},
  onSkip = () => {},
  onDataChange,
}) => {
  console.log("Export CSV BUtton");
  const csvLinkRef = useRef();
  const [error, setError] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [exportData, setExportData] = useState([]);

  const prepareCSVData = () => {
    const csvData = [];
    const headerRow = tableHeaders.map((header) => header.headerName);
    csvData.push(headerRow);
    exportData.forEach((row) => {
      const rowData = tableHeaders.map((header) => row[header.headerFieldName]);
      csvData.push(rowData);
    });
    return csvData;
  };

  //   useEffect(() => {
  //     //console.log("Button Data", data);
  //     setExportData(data);
  //     const errors = errorIdentifier(data);
  //     if (errors.length > 0) {
  //       setError(true);
  //     } else {
  //       setError(false);
  //     }
  //   }, [data]);

  useEffect(() => {
    subscribeToData("rowsToDelete", getRowsToDelete);
    // subscribeToData("gridData", getGridData);
  }, []);

  const getRowsToDelete = (value) => {
    console.log("Rows to Delete", value);
    setRowsToDelete([...value]);
  };

  const getGridData = (data) => {
    // setExportData([...data]);
  };

  const onDelete = (value) => {
    let _data = getSubscribedData("gridData");
    console.log("Data before Deletion", _data);
    // for (let i = 0; i < rowsToDelete.length; i++) {
    //   const rowIndex = _data.findIndex(
    //     (item) => item.indexId === rowsToDelete[i]
    //   );
    //   //   const rowIndex = findIndexById(rowsToDelete[i]);
    //   console.log(rowIndex);
    //   _data.splice(rowIndex, 1);
    // }
    // setExportData(_data);
    let modifiedData = bulkDeleteFromDataAndHashMap(_data, rowsToDelete);
    console.log("Data after Deletion", modifiedData);
    setRowsToDelete([]);
    setSubscribedData("rowsToDelete", []);
    onDataChange(modifiedData);
  };

  useEffect(() => {
    if (callExportCSV && csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  }, [callExportCSV]);

  const classes = commonStyles();
  return (
    <div style={{ backgroundColor: "white" }}>
      <div className={classes.exportCSVButton}>
        {tableOptions.showExportButton && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              if (csvLinkRef.current) {
                csvLinkRef.current.link.click();
              }
            }}
            startIcon={<GetAppIcon />}
          >
            Export CSV
          </Button>
        )}

        <CSVLink
          data={prepareCSVData()}
          filename="table-data.csv"
          ref={csvLinkRef}
        />
      </div>
      <div className={classes.exportCSVButton}>
        {error && (
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={onSkip}
          >
            Skip These Records
          </Button>
        )}
        {tableOptions.showSubmitButton && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onSubmit}
            disabled={error}
          >
            Submit
          </Button>
        )}
        {tableOptions.showProceedButton && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onProceedAnyway}
          >
            Proceed Anyway
          </Button>
        )}
      </div>
      {rowsToDelete.length > 0 && (
        <div className={classes.exportCSVButton}>
          <Button
            variant="contained"
            style={{ color: "white", backgroundColor: "red" }}
            className={classes.button}
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
export default GridButtons;
