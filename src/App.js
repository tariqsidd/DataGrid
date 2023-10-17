import React, { useState } from "react";
import TableComponent from "./DataGrid";
import {_headers, _tableHeader, tableHeader} from "./Data";

const Data = [
  {
    name: "Jamil",
    surname: "Smith",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { },
  },
  {
    name: "John",
    surname: "Doe",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { },
  },
  {
    name: "Jane",
    surname: "",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { },
  },
];

const App = () => {
  const [data, setData] = useState(Data);
  return (
    <div>
      <TableComponent
        data={Data}
        tableHeaders={_headers}
        onRowChange={(data, i) => {
          console.log("data", data);
          console.log("index", i);
        }}
      />
    </div>
  );
};

export default App;
