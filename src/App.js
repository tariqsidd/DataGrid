import React from "react";
import { tableHeader, Data, dataArray } from "./Data";
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
    <div>
      <DataGrid
        incomingData={Data}
        // incomingData={dataArray}
        tableHeaders={tableHeader}
        incomingTableOptions={tableOptions}
      />
    </div>
  );
};

export default App;
