import React, { useRef, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { commonStyles } from "./styles";
import { errorIdentifier } from "./utils";
import {
  getSubscribedData,
  setSubscribedData,
  subscribeToData,
  unsubscribe,
} from "./Reactive/subscriber";

const ExportAndSubmitButton = ({
  tableOptions = {},
  tableHeaders = [],
  data = [],
  callExportCSV = false,
  onSubmit = () => {},
  setData,
}) => {
  console.log("Export CSV Button");
  const csvLinkRef = useRef();
  const [errorCells, setErrorCells] = useState(errorIdentifier(data));
  const [selectedRows, setSelectedRows] = useState([]);
  const [dataState, setDataState] = useState(data);
  const prepareCSVData = (data, tableHeaders) => {
    const csvData = [];
    const headerRow = tableHeaders.map((header) => header.headerName);
    csvData.push(headerRow);
    data.forEach((row) => {
      const rowData = tableHeaders.map((header) => row[header.headerFieldName]);
      csvData.push(rowData);
    });
    return csvData;
  };

  useEffect(() => {
    subscribeToData("gridData", getGridData);
    subscribeToData("selectedRows", getSelectedRows);
    //setSelectedRows(getSubscribedData("selectedRows"));
    return () => {
      // Run on unmount
      // unsubscribe("gridData");
    };
  }, []);

  const getGridData = (value) => {
    setDataState([...value]);
    const errors = errorIdentifier(value);
    setErrorCells(errors);
  };

  const getSelectedRows = (value) => {
    console.log(value);
    setSelectedRows([...value]);
    console.log("Selection set");
  };
  console.log("Selected Rows", selectedRows);
  const onDelete = (value) => {
    const newData = [...dataState];
    for (let i = 0; i < selectedRows.length; i++) {
      const rowIndex = newData.findIndex((item) => item.id === selectedRows[i]);
      newData.splice(rowIndex, 1);
    }
    console.log(newData);
    setData(newData);
    setSelectedRows([]);
    setSubscribedData("selectedRows", []);
    setSubscribedData("gridData", newData);
  };

  useEffect(() => {
    if (callExportCSV && csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  }, [callExportCSV]);

  const classes = commonStyles();
  return (
    <div>
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
        {tableOptions.showSubmitButton && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onSubmit}
            disabled={errorCells.length > 0}
          >
            Submit
          </Button>
        )}

        <CSVLink
          data={prepareCSVData(data, tableHeaders)}
          filename="table-data.csv"
          ref={csvLinkRef}
        />
      </div>
      <div className={classes.exportCSVButton}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={onDelete}
          disabled={selectedRows.length === 0}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
export default ExportAndSubmitButton;
