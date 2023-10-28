import React, { useState } from "react";
import { tableHeader, Data, dataArray, dataSample } from "./Data";
import { Button } from "@material-ui/core";
import DataGrid from "./DataGrid/DataGrid";
import VirtualTable from "./VirtualRender";

const tableOptions = {
  addRow: true,
  deleteRow: true,
  duplicateRow: true,
  columnHeight: "40px",
  editing: true,
  showErrors: true,
  showErrorAlert: true,
  showExportButton: true,
  showSubmitButton: true,
};

const cities = ['New York', 'Los Angeles', 'Chicago'];
const userData = [];
for (let i = 0; i < 500000; i++) {
  userData.push({
    name: `Name ${i}`,
    surname: `Surname ${i}`,
    date: new Date(2023, 9, i % 31 + 1).toLocaleDateString(),
    city: cities[i % cities.length],
    phoneNo: 1000000 + i,
    country: `Country ${i % 10}`,
    id: Math.random().toString(36).substring(2, 6+2)
  });
}

// Define the headers for the table

const App = () => {
  return (
    <VirtualTable
      buffer={5}
      numberOfRows={50}
      itemHeight={50} // Adjust as needed
      incomingData={userData}
      tableHeaders={tableHeader}
    />
  );
};

export default App;
