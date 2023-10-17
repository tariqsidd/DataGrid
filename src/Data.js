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
    headerOptions: null,
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
    headerOptions: null,
    headerSchema: {
      type: "object",
      properties: {
        surname: { type: "string", maxLength: 8 },
      },
      required: ["surname"],
      additionalProperties: false,
    },
  },
  // {
  //   headerName: "Date",
  //   headerFieldName: "date",
  //   headerFieldType: "Date",
  //   headerCellType: "date",
  //   headerOptions: null,
  //   headerSchema: {
  //     type: "object",
  //     properties: {
  //       date: { type: "string" },
  //     },
  //     required: ["date"],
  //     additionalProperties: false,
  //   },
  // },
  // {
  //   headerName: "Present",
  //   headerFieldName: "present",
  //   headerFieldType: "boolean",
  //   headerCellType: "checkbox",
  //   headerOptions: null,
  //   headerSchema: {
  //     type: "object",
  //     properties: {
  //       present: { type: "boolean" },
  //     },
  //     required: ["present"],
  //     additionalProperties: false,
  //   },
  // },
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
    // headerOptions: cities,
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
    headerOptions: null,
  },
];

export const _tableHeader = [
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
        name: { type: "string", minLength: 2, maxLength: 8 },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    headerName: "City",
    headerFieldName: "city",
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
    headerName: "Phone Number",
    headerFieldName: "phoneNo",
    headerFieldType: "number",
    headerCellType: "number",
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
    headerName: "Country",
    headerFieldName: "country",
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
];

export const columnOrder = tableHeader.map((item) => item.headerFieldName);
