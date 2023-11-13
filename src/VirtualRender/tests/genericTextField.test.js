import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import GenericTextField from "../GenericTextField";

describe("GenericTextField", () => {
  it("should render a TextField component with the given label and value", () => {
    const errorObj = {};
    const type = "text";
    const isError = false;
    const label = "Test Label";
    const value = "Test Value";
    const onChange = jest.fn();
    const options = [];
    const schema = null;
    const validationKey = null;

    render(
      <GenericTextField
        errorObj={errorObj}
        type={type}
        isError={isError}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        schema={schema}
        validationKey={validationKey}
      />
    );

    expect(screen.getByPlaceholderText(label)).toBeInTheDocument();
    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });

  it("should render a TextField component with the given label and value for number", () => {
    const errorObj = {};
    const type = "number";
    const isError = false;
    const label = "Test Label";
    const value = "Test Value";
    const onChange = jest.fn();
    const options = [];
    const schema = null;
    const validationKey = null;

    render(
      <GenericTextField
        errorObj={errorObj}
        type={type}
        isError={isError}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        schema={schema}
        validationKey={validationKey}
      />
    );

    expect(screen.getByPlaceholderText(label)).toBeInTheDocument();
    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });

  it('should render a Select component with the given options and value when type is "select"', () => {
    const errorObj = {};
    const type = "select";
    const isError = false;
    const label = "Test Label";
    const value = "Test Value";
    const onChange = jest.fn();
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    const schema = null;
    const validationKey = "";

    render(
      <GenericTextField
        errorObj={errorObj}
        type={type}
        isError={isError}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        schema={schema}
        validationKey={validationKey}
      />
    );

    expect(screen.getByTestId("selectField")).toBeInTheDocument();
  });

  it('should render a DatePicker component with the given value when type is "date"', () => {
    const errorObj = {};
    const type = "date";
    const isError = false;
    const label = "Test Label";
    const value = "01/01/2022";
    const onChange = jest.fn();
    const options = [];
    const schema = null;
    const validationKey = "";

    render(
      <GenericTextField
        errorObj={errorObj}
        type={type}
        isError={isError}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        schema={schema}
        validationKey={validationKey}
      />
    );
    expect(screen.getByTestId("dateField")).toBeInTheDocument();
  });
});
