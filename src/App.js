import React from "react";
import { tableHeader, Data } from "./Data";
import DataGrid from "./DataGrid/DataGrid";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Paper,
} from "@material-ui/core";
import { TableVirtuoso } from "react-virtuoso";

const TableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => <Table {...props} style={{ borderCollapse: "separate" }} />,
  TableHead: TableHead,
  TableRow: TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const tableOptions = {
  addRow: true,
  deleteRow: true,
  duplicateRow: true,
  columnHeight: "40px",
  editing: true,
  showErrors: true,
  showErrorAlert: true,
};

const App = () => {
  return (
    <div style={{ maxWidth: "1000px" }}>
      <TableVirtuoso
        style={{ height: 400 }}
        data={Data}
        components={TableComponents}
        fixedHeaderContent={() => (
          <TableRow>
            <TableCell style={{ width: 150, background: "white" }}>
              Name
            </TableCell>
            <TableCell style={{ background: "white" }}>Description</TableCell>
          </TableRow>
        )}
        itemContent={(index, user) => (
          <>
            <TableCell style={{ width: 150, background: "white" }}>
              {user.name}
            </TableCell>
            <TableCell style={{ background: "white" }}>
              {user.surname}
            </TableCell>
          </>
        )}
      />
      {/* <DataGrid
        incomingData={Data}
        tableHeaders={tableHeader}
        incomingTableOptions={tableOptions}
      /> */}
    </div>
  );
};

export default App;
