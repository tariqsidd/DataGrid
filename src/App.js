import React from "react";
import { tableHeader, Data } from "./Data";
import DataGrid from "./DataGrid/DataGrid";

const App = () => {
  return (
    <div style={{ maxWidth: "1000px" }}>
      <DataGrid incomingData={Data} tableHeaders={tableHeader} />
    </div>
  );
};

export default App;
