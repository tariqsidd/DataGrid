import React, { useState } from "react";
import TableComponent from "./DataGrid";
import { _tableHeader, tableHeader } from "./Data";

const Data = [
  {
    name: "Jamil",
    surname: "Smith",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errors: [{ cellName: "city", errorMsg: "city not allowed" }],
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errors: [{ cellName: "phoneNo", errorMsg: "wrong country code" }],
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errors: [{ cellName: "surname", errorMsg: "surname required" }],
    errorObj: { surname: "surname required" },
  },
];

const App = () => {
  const [data, setData] = useState(Data);
  return (
    <div>
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
