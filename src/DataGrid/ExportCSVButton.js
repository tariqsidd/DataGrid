import React, { useRef, useEffect } from "react";
import { CSVLink } from "react-csv";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { commonStyles } from "./styles";
import { errorIdentifier } from "./utils";

const ExportCSVButton = ({
  tableOptions = {},
  tableHeaders = [],
  data = [],
  callExportCSV = false,
  onSubmit = () => {},
}) => {
  console.log("Export CSV Button");
  const csvLinkRef = useRef();
  const errorCells = errorIdentifier(data);

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
    if (callExportCSV && csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  }, [callExportCSV]);

  const classes = commonStyles();
  return (
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
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onSubmit}
        disabled={errorCells.length > 0}
      >
        Submit
      </Button>
      <CSVLink
        data={prepareCSVData(data, tableHeaders)}
        filename="table-data.csv"
        ref={csvLinkRef}
      />
    </div>
  );
};
export default ExportCSVButton;
