import React from "react";
import { tableHeader, Data } from "./Data";
import DataGrid from "./DataGrid/DataGrid";

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
      <DataGrid
        incomingData={Data}
        tableHeaders={tableHeader}
        incomingTableOptions={tableOptions}
      />
    </div>
  );
};

export default App;
