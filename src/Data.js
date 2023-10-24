const cities = [
  { label: "New York", value: "New York" },
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "Chicago", value: "Chicago" },
  { label: "San Francisco", value: "San Francisco" },
];

export const tableHeader = [
  {
    headerName: "Name",
    headerFieldName: "name",
    headerFieldType: "string",
    headerCellType: "textField",
    headerSchema: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 2, maxLength: 8 },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    headerName: "Surname",
    headerFieldName: "surname",
    headerFieldType: "string",
    headerCellType: "textField",
    headerSchema: {
      type: "object",
      properties: {
        surname: { type: "string", maxLength: 8 },
      },
      required: ["surname"],
      additionalProperties: false,
    },
  },
  {
    headerName: "Date",
    headerFieldName: "date",
    headerFieldType: "Date",
    headerCellType: "date",
    headerSchema: {
      type: "object",
      properties: {
        date: { type: "string" },
      },
      required: ["date"],
      additionalProperties: false,
    },
    headerDateProperties: {
      min: "10/10/2023",
      max: "13/11/2023",
    },
  },
  {
    headerName: "City",
    headerFieldName: "city",
    headerFieldType: "string",
    headerCellType: "select",
    headerOptions: cities,
    headerSchema: {
      type: "object",
      properties: {
        city: { type: "string" },
      },
      required: ["city"],
      additionalProperties: false,
    },
  },
  {
    headerName: "Phone Number",
    headerFieldName: "phoneNo",
    headerFieldType: "number",
    headerCellType: "number",
    headerSchema: {
      type: "object",
      properties: {
        phoneNo: { type: "integer" },
      },
      required: ["phoneNo"],
      additionalProperties: false,
    },
  },
  {
    headerName: "Country",
    headerFieldName: "country",
    headerFieldType: "string",
    headerCellType: "textField",
  },
];

export const Data = [
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    // errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    errorObj: { surname: "surname required" },
  },
];

export const dataSample = [
  {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
    // errorObj: { city: "city not allowed" },
  },
  {
    name: "John",
    surname: "Doe",
    date: "18/10/2023",
    city: "New York",
    phoneNo: 1234567890,
    country: "USA",
    // errorObj: { phoneNo: "wrong country code" },
  },
  {
    name: "Jane",
    surname: "",
    date: "19/10/2023",
    city: "Los Angeles",
    phoneNo: 9876543210,
    country: "USA",
    //errorObj: { surname: "surname required" },
  },
];

function generateData(rows = 5000) {
  const baseData = {
    name: "Jamil",
    surname: "Smith",
    date: "17/10/2023",
    city: "Los Karachi",
    phoneNo: 2313453453,
    country: "PK",
  };

  const dataList = [];

  for (let i = 0; i < rows; i++) {
    const newData = { ...baseData };
    newData.name = `${baseData.name}${i}`;
    newData.surname = `${baseData.surname}${i}`;
    newData.phoneNo += Math.floor(Math.random() * 10000); // Add a small random increment for variation
    dataList.push(newData);
  }

  return dataList;
}

// Example usage
export const dataArray = generateData();
