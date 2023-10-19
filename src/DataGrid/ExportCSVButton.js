import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { commonStyles } from "./styles";

const ExportCSVButton = ({ tableHeaders = [], data = [] }) => {
  const csvLinkRef = useRef();

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

  const classes = commonStyles();
  return (
    <div className={classes.exportCSVButton}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (csvLinkRef.current) {
            csvLinkRef.current.link.click();
          }
        }}
        startIcon={<GetAppIcon />}
      >
        Export CSV
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
