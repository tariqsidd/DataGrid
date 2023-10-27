import React, { useRef, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import { commonStyles } from "./styles";
import { errorIdentifier } from "./utils";
import { subscribeToData, setSubscribedData } from "./Reactive/subscriber";

const GridButtons = ({
  tableOptions = {},
  tableHeaders = [],
  data = [],
  callExportCSV = false,
  onSubmit = () => {},
  onProceedAnyway = () => {},
  onSkip = () => {},
  onDataChange,
}) => {
  console.log("Export CSV BUtton");
  const csvLinkRef = useRef();
  const [error, setError] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [exportData, setExportData] = useState(data);

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

  useEffect(() => {
    console.log("Button Data", data);
    const errors = errorIdentifier(data);
    if (errors.length > 0) {
      setError(true);
    } else {
      setError(false);
    }
  }, [data]);

  useEffect(() => {
    subscribeToData("selectedRows", getSelectedRows);
  }, []);

  const getSelectedRows = (value) => {
    setSelectedRows([...value]);
  };

  const onDelete = (value) => {
    for (let i = 0; i < selectedRows.length; i++) {
      const rowIndex = exportData.findIndex(
        (item) => item.id === selectedRows[i]
      );
      exportData.splice(rowIndex, 1);
    }
    console.log(exportData);
    setExportData(exportData);
    setSelectedRows([]);
    setSubscribedData("selectedRows", []);
    onDataChange(exportData);
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
            disabled={error}
          >
            Submit
          </Button>
        )}

        <CSVLink
          data={prepareCSVData()}
          filename="table-data.csv"
          ref={csvLinkRef}
        />
      </div>
      {tableOptions.showSkipAndProceedButton && (
        <div className={classes.exportCSVButton}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={onSkip}
          >
            Skip These Records
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onProceedAnyway}
          >
            Proceed Anyway
          </Button>
        </div>
      )}

      {selectedRows.length > 0 && (
        <div className={classes.exportCSVButton}>
          <Button
            variant="contained"
            color="secondary"
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
