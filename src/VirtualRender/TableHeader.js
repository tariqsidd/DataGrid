import { Box } from "@material-ui/core";
import React from "react";
import TableCell from "./TableCell";
import ErrorAlert from "../DataGrid/ErrorAlert";
import GridButtons from "./GridButton";

const TableHeader = ({
  data,
  columns,
  tableOptions,
  onDataChange,
  scrollToRow,
}) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <GridButtons
        data={data}
        tableOptions={tableOptions}
        tableHeaders={columns}
        onDataChange={(data) => {
          onDataChange(data);
        }}
        // callExportCSV={callExportCSV}
        // onSubmit={onSubmit}
        // onProceedAnyway={onProceedAnyway}
        // onSkip={onSkip}
        // onDataChange={(data) => {
        //   // setData([...data]);
        //   // onChangeInData(data);
        // }}
      />
      <ErrorAlert scrollToRow={scrollToRow} />
      <Box
        style={{
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
        }}
      >
        <Box style={tableCellStyles.cellStyle(columns, 15)}>{`#`}</Box>
        {columns.map((header) => (
          <Box style={tableCellStyles.cellStyle(columns)}>
            {header.headerName}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const tableCellStyles = {
  cellStyle: (columns, p = 100) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${p / columns.length}%`,
      textAlign: "left",
      padding: "16px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
    };
  },
};

export default TableHeader;
