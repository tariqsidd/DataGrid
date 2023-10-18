import React, { useState } from "react";
import TableComponent from "./DataGrid";
import { tableHeader, Data } from "./Data";

const App = () => {
  return (
    <div style={{ maxWidth: "1000px" }}>
      <TableComponent
        data={Data}
        tableHeaders={tableHeader}
        onRowChange={(data, i) => {
          console.log("data", data);
          console.log("index", i);
        }}
      />
    </div>
  );
};

export default App;
