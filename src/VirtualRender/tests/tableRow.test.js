import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TableRow from "../TableRow";
describe("Table Row tests", () => {
  const item = {
    name: "Jane Smith",
    age: 30,
    email: "jane.smith@example.com",
    indexId: "1",
    selected: false,
  };

  const itemHeight = 50;

  const columns = [
    {
      headerName: "Name",
      headerFieldName: "name",
      headerFieldType: "string",
      headerCellType: "text",
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
      headerName: "Age",
      headerFieldName: "age",
      headerFieldType: "number",
      headerCellType: "number",
      headerSchema: {
        type: "object",
        properties: {
          age: { type: "integer" },
        },
        required: ["age"],
        additionalProperties: false,
      },
    },
  ];

  const onRowChange = (row) => {
    console.log("Row changed:", row);
  };

  it("should render a row with the correct data and columns and selection", async () => {
    const tableOptions = {
      deleteRow: true,
    };

    render(
      <TableRow
        item={item}
        itemHeight={itemHeight}
        columns={columns}
        onRowChange={onRowChange}
        tableOptions={tableOptions}
      />
    );

    const selectionCheckbox = screen.getByTestId(`checkbox-${item.indexId}`);
    expect(selectionCheckbox).not.toHaveClass("Mui-checked");
  });

  it("should render a row with the correct data and columns and delete option false", () => {
    const tableOptions = {
      deleteRow: false,
    };

    render(
      <TableRow
        item={item}
        itemHeight={itemHeight}
        columns={columns}
        onRowChange={onRowChange}
        tableOptions={tableOptions}
      />
    );
  });
});
