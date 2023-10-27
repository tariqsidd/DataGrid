import React, { useState } from "react";
import { tableHeader, Data, dataArray, dataSample } from "./Data";
import { Button } from "@material-ui/core";
import DataGrid from "./DataGrid/DataGrid";

const tableOptions = {
  addRow: true,
  deleteRow: true,
  duplicateRow: true,
  columnHeight: "40px",
  editing: true,
  showErrors: true,
  showErrorAlert: true,
  showExportButton: false,
  showSubmitButton: false,
  showSkipAndProceedButton: true,
};

const App = () => {
  const [exportCSV, setExportCSV] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setExportCSV(true);
        }}
      >
        Export CSV Outside
      </Button>
      <div style={{ maxWidth: "1000px" }}>
        <DataGrid
          //incomingData={Data}
          incomingData={dataArray}
          tableHeaders={tableHeader}
          incomingTableOptions={tableOptions}
          callExportCSV={exportCSV}
          onChangeInData={(data) => {
            console.log("Updated Data Outside", data);
          }}
          onSubmit={() => {
            console.log("On submit pressed");
          }}
          onProceedAnyway={() => {}}
          onSkip={() => {}}
        />
      </div>
    </>
  );
};

export default App;
