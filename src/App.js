import React from "react";
import {tableHeader, Data, dataArray} from "./Data";
import DataGrid from "./DataGrid/DataGrid";

const App = () => {
  return (
    <div>
      <DataGrid
        // incomingData={Data}
        incomingData={dataArray}
        tableHeaders={tableHeader}
      />
    </div>
  );
};

export default App;
