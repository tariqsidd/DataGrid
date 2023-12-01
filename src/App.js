import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import _MaterialTable from './Table';
import {Chip, IconButton} from "@mui/material";

const cities = [
  {label: "New York", value: "New York"},
  {label: "Los Angeles", value: "Los Angeles"},
  {label: "Chicago", value: "Chicago"},
  {label: "San Francisco", value: "San Francisco"},
];

const columns = [
  {
    field: "name",
    header: "Name",
    type: "text",
    filterType: "textField",
    width: "400px",
  },
  {
    field: "age",
    header: "Age",
    type: "number",
    filterType: "numberField",
  },
  {field: "email", header: "Email"},
  {
    field: "city",
    header: "City",
    filterType: "select",
    options: cities,
    render: (rowData) => (
      <Chip
        label={rowData.city}
        variant="outlined"
        style={{
          color: "#EB6262",
          backgroundColor: "#eb626238",
          fontWeight: "500",
        }}
      />
    ),
    headerAlign: "left",
    cellAlign: "center",
  },
  {field: "date", header: "Date", filterType: "dateSelect"},
  {
    header: "Actions",
    render: (rowData) => (
      <IconButton onClick={() => {
      }}>
        <VisibilityIcon
          style={{
            color: "#ff9800",
          }}
        />
      </IconButton>
    ),
    width: "100px",
    align: "left",
  },
  // {
  //   field: "name",
  //   header: "Name",
  //   type: "text",
  //   filterType: "textField",
  // },
  // {
  //   field: "age",
  //   header: "Age",
  //   type: "number",
  //   filterType: "numberField",
  // },
  // { field: "email", header: "Email" },
  // { field: "city", header: "City", filterType: "select", options: cities },
  // { field: "date", header: "Date", filterType: "dateSelect" },
  // {
  //   field: "name",
  //   header: "Name",
  //   type: "text",
  //   filterType: "textField",
  // },
  // {
  //   field: "age",
  //   header: "Age",
  //   type: "number",
  //   filterType: "numberField",
  // },
  // { field: "email", header: "Email" },
  // { field: "city", header: "City", filterType: "select", options: cities },
  // { field: "date", header: "Date", filterType: "dateSelect" },
];
const initialRows = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    email: "john.doe@example.com",
    city: "New York",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 34,
    email: "jane.smith@example.com",
    city: "New York",
    date: "2023-11-23",
  },
  {
    id: "3",
    name: "Alice Johnson",
    age: 34,
    email: "jane.smith@example.com",
    city: "Los Angeles",
    date: "2023-11-22",
  },
  {
    id: "1",
    name: "John Doe",
    age: 28,
    email: "john.doe@example.com",
    city: "New York",
    date: "2023-11-22",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 34,
    email: "jane.smith@example.com",
    city: "New York",
    date: "2023-11-23",
  },
  {
    id: "3",
    name: "Alice Johnson",
    age: 34,
    email: "jane.smith@example.com",
    city: "Los Angeles",
    date: "2023-11-22",
  },
  {
    id: "1",
    name: "John Doe",
    age: 28,
    email: "john.doe@example.com",
    city: "New York",
    date: "2023-11-22",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 34,
    email: "jane.smith@example.com",
    city: "New York",
    date: "2023-11-23",
  },
  {
    id: "3",
    name: "Alice Johnson",
    age: 34,
    email: "jane.smith@example.com",
    city: "Los Angeles",
    date: "2023-11-22",
  },

  {
    id: "1",
    name: "John Doe",
    age: 28,
    email: "john.doe@example.com",
    city: "New York",
    date: "2023-11-22",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 34,
    email: "jane.smith@example.com",
    city: "New York",
    date: "2023-11-23",
  },
  {
    id: "3",
    name: "Alice Johnson",
    age: 34,
    email: "jane.smith@example.com",
    city: "Los Angeles",
    date: "2023-11-22",
  },
  // {
  //   id: "1",
  //   name: "John Doe",
  //   age: 28,
  //   email: "john.doe@example.com",
  //   city: "New York",
  //   date: "2023-11-22",
  // },
  // {
  //   id: "2",
  //   name: "Jane Smith",
  //   age: 34,
  //   email: "jane.smith@example.com",
  //   city: "New York",
  //   date: "2023-11-23",
  // },
  // {
  //   id: "3",
  //   name: "Alice Johnson",
  //   age: 34,
  //   email: "jane.smith@example.com",
  //   city: "Los Angeles",
  //   date: "2023-11-22",
  // },
  // {
  //   id: "1",
  //   name: "John Doe2",
  //   age: 28,
  //   email: "john.doe@example.com",
  //   city: "New York",
  //   date: "2023-11-22",
  // },
  // {
  //   id: "2",
  //   name: "Jane Smith2",
  //   age: 34,
  //   email: "jane.smith@example.com",
  //   city: "New York",
  //   date: "2023-11-23",
  // },
  // {
  //   id: "3",
  //   name: "Alice Johnson2",
  //   age: 34,
  //   email: "jane.smith@example.com",
  //   city: "Los Angeles",
  //   date: "2023-11-22",
  // },
  // {
  //   id: "1",
  //   name: "John Doe2",
  //   age: 28,
  //   email: "john.doe@example.com",
  //   city: "New York",
  //   date: "2023-11-22",
  // },
  // {
  //   id: "2",
  //   name: "Jane Smith2",
  //   age: 34,
  //   email: "jane.smith@example.com",
  //   city: "New York",
  //   date: "2023-11-23",
  // },
  // {
  //   id: "3",
  //   name: "Alice Johnson2",
  //   age: 34,
  //   email: "jane.smith@example.com",
  //   city: "Los Angeles",
  //   date: "2023-11-22",
  // },
];
const App = () => {
  return (
    <>
      {/* <VirtualDataGrid
        // containerHeight={400}
        buffer={30}
        numberOfRows={50}
        itemHeight={50} // Adjust as needed
        incomingData={getUserData(5000)}
        tableHeaders={tableHeader}
        incomingTableOptions={tableOptions}
        callExportCSV={false}
        onDataChange={(data) => {
          console.log(data);
        }}
      /> */}
      <_MaterialTable
        data={initialRows}
        onRowSelection={(rows)=>{
          console.log('rows',rows)
        }}
        // selectedRow={{
        //   "1": {
        //     "id": "1",
        //     "name": "John Doe",
        //     "age": 28,
        //     "email": "john.doe@example.com",
        //     "city": "New York",
        //     "date": "2023-11-29T11:52:07.475Z"
        //   },
        //   "2": {
        //     "id": "2",
        //     "name": "Jane Smith",
        //     "age": 34,
        //     "email": "jane.smith@example.com",
        //     "city": "New York",
        //     "date": "2023-11-23"
        //   }
        // }}
        // ssf
        // onChangeFilter={(qp)=>{
        //   console.log('qp',qp)
        // }}
        columns={columns}
        // isNextPage={false}
        options={{
          uniqueIdKey:'id',
          // selection: true,
          // selectionProps: (rowData) => ({
          //   disabled: rowData.name === "Alice Johnson",
          // }),
          rowsPerPageOptions: [10, 20, 50, 100],
          selectionActions: [
            {
              icon: <DeleteIcon/>, action: () => {
              }
            },
            {
              icon: <GetAppRoundedIcon/>, action: () => {
              }
            },
          ],
          defaultPageSize: 10,
        }}
        setPage={(page) => {
          console.log("Current Page:", page);
        }}
        onPageSizeChange={(pageSize) => {
          console.log("Page Size:", pageSize);
        }}
      />
    </>
  );
};

export default App;
