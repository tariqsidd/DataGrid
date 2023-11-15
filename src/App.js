import React, {useState} from "react";
import {tableHeader, Data, dataArray, dataSample} from "./Data";
import {Button} from "@material-ui/core";
import DataGrid from "./DataGrid/DataGrid";
import VirtualTable from "./VirtualRender";
import MaterialTable from "./Matrial-Table";
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
const cities = ["New York", "Los Angeles", "Chicago"];
const userData = [];

userData.push({
  name: `Name`,
  surname: `Surname `,
  date: new Date(2023, 9, (2 % 31) + 1).toLocaleDateString(),
  city: "Lordv",
  phoneNo: 1000000,
  country: `Country`,
  country1: `Country1`,
  country2: `Country2`,
  country3: `Country3`,
  country4: `Country4`,
  error: {
    name: "Error in name",
    surname: "Error in surname",
  },
  indexId: Math.random()
    .toString(36)
    .substring(2, 6 + 2),
});

for (let i = 0; i < 4000; i++) {
  userData.push({
    name: `Name ${i}`,
    surname: `Surname ${i}`,
    date: new Date(2023, 9, (i % 31) + 1).toLocaleDateString(),
    city: cities[i % cities.length],
    phoneNo: 1000000 + i,
    country: `Country ${i % 10}`,
    country1: `Country ${i % 10}`,
    country2: `Country ${i % 10}`,
    country3: `Country ${i % 10}`,
    country4: `Country ${i % 10}`,
    // error: {
    //   name: "Error in name",
    //   surname: "Error in surname",
    // },
    indexId: Math.random()
      .toString(36)
      .substring(2, 6 + 2),
  });
}

// Define the headers for the table
const options = {
  deleteRow: true,
  editing: true,
  showErrors: true,
  showErrorAlert: true,
  showExportButton: true,
  showSubmitButton: true,
  showProceedButton: true,
  showSkipButton: true,
};

const departments = [
  { label: "Engineering", value: "engineering" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Human Resources", value: "hr" },
];

const columns = [
  { header: 'Name', field: 'name', filterType: 'textField' },
  { header: 'Age', field: 'age', filterType: 'numberField' },
  { header: 'Department', field: 'department', filterType: 'select', options: departments },
  { header: 'Joining Date', field: 'joiningDate', filterType: 'dateSelect' }
];

const initialRows = [
  { id: 1, name: 'John Doe', age: 30, department: 'engineering', joiningDate: '2020-01-15' },
  { id: 2, name: 'Jane Smith', age: 28, department: 'marketing', joiningDate: '2019-07-23' },
  { id: 3, name: 'Alice Johnson', age: 35, department: 'sales', joiningDate: '2018-03-11' },

];

const App = () => {
  return (
    <MaterialTable
      data={initialRows}
      columns={columns}
      options={{
      selection: true,
      selectionProps: rowData => ({
        disabled: rowData.name === 'Alice Johnson'
      }),
      selectionActions:[
        {
          icon: <ClearIcon/>,
          action: ()=>{}
        },
        {
          icon: <DeleteIcon/>,
          action: ()=>{}
        }
      ]
    }}/>
  );
};

export default App;
