import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import VirtualTable from "../index";

describe("VirtualTable", () => {
  const tableHeaders = [
    { headerName: "Name", headerFieldName: "name" },
    { headerName: "Age", headerFieldName: "age" },
    { headerName: "Email", headerFieldName: "email" },
  ];

  const data = [
    { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
    {
      indexId: 2,
      name: "Jane Smith",
      age: 30,
      email: "jane.smith@example.com",
    },
    {
      indexId: 3,
      name: "Bob Johnson",
      age: 35,
      email: "bob.johnson@example.com",
    },
  ];

  const dataWithError = [
    { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
    {
      indexId: 2,
      name: "Jane Smith",
      age: 30,
      email: "jane.smith@example.com",
      error: { name: "Exceeds limiit" },
    },
    {
      indexId: 3,
      name: "Bob Johnson",
      age: 35,
      email: "bob.johnson@example.com",
    },
  ];
  it("should render table when no data is given", () => {
    <VirtualTable />;
  });

  it("should render a table with the given data and table options", () => {
    <VirtualTable incomingData={data} tableHeaders={tableHeaders} />;
  });

  it("should render a table with the given error data and table options", () => {
    <VirtualTable incomingData={dataWithError} tableHeaders={tableHeaders} />;
  });

  it("should render export button when default tableOptions", () => {
    render(
      <VirtualTable
        incomingData={data}
        tableHeaders={tableHeaders}
        onDataChange={() => {}}
      />
    );

    const exportButton = screen.getByTestId("export-button");
    expect(exportButton).toBeInTheDocument();
  });

  it("should call onSubmit when submit button clicked with no errors", () => {
    const onSubmitMock = jest.fn();
    render(
      <VirtualTable
        incomingData={data}
        tableHeaders={tableHeaders}
        onDataChange={() => {}}
        onSubmit={onSubmitMock}
      />
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalled();
  });

  it("should call onSkip when skip button clicked with errors", () => {
    const onSkipMock = jest.fn();
    render(
      <VirtualTable
        incomingData={dataWithError}
        tableHeaders={tableHeaders}
        onSkip={onSkipMock}
        onDataChange={() => {}}
      />
    );

    const skipButton = screen.getByTestId("skip-button");
    fireEvent.click(skipButton);

    expect(onSkipMock).toHaveBeenCalled();
  });

  it("should call onProceedAnyway when proceed button clicked", () => {
    const onProceedAnywayMock = jest.fn();
    render(
      <VirtualTable
        incomingData={data}
        tableHeaders={tableHeaders}
        onProceedAnyway={onProceedAnywayMock}
        onDataChange={() => {}}
      />
    );

    const proceedButton = screen.getByTestId("proceed-button");
    fireEvent.click(proceedButton);

    expect(onProceedAnywayMock).toHaveBeenCalled();
  });

  it("submit button should be disabled when data witn error", () => {
    const onSubmitMock = jest.fn();
    render(
      <VirtualTable
        incomingData={dataWithError}
        tableHeaders={tableHeaders}
        onDataChange={() => {}}
        onSubmit={onSubmitMock}
      />
    );

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);
    expect(submitButton).toHaveClass("Mui-disabled");
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("selection in unchecked initially", () => {
    render(
      <VirtualTable
        incomingData={data}
        tableHeaders={tableHeaders}
        onDataChange={() => {}}
      />
    );

    const selectionCheckbox = screen.getByTestId(`checkbox-${data[0].indexId}`);
    expect(selectionCheckbox).not.toHaveClass("Mui-checked");
    fireEvent.click(selectionCheckbox);
  });
});
