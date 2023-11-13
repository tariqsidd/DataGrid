import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorAlert from "../ErrorAlert";
import { convertToHashMap } from "../utils";

describe("Error Alert Tests", () => {
  const scrollToRow = jest.fn();
  const data = [
    { error: { field1: "error1" }, indexId: "765hge" },
    { error: { field2: "error2" }, indexId: "552hge" },
    { error: { field3: "error3" }, indexId: "855hge" },
  ];
  convertToHashMap(data);

  it("should render error-free alert icon in the box when no errors are present in data", () => {
    render(<ErrorAlert scrollToRow={scrollToRow} data={[]} />);
    const checkCircleIcon = screen.getByTestId("check-circle-icon");
    expect(checkCircleIcon).toBeInTheDocument();
  });

  it("should display no error message when no errors are present", () => {
    const { getByText } = render(
      <ErrorAlert scrollToRow={scrollToRow} data={[]} />
    );
    expect(getByText("No Error(s) found !")).toBeInTheDocument();
  });

  it("should render error alert icon in the box when errors are present in data", () => {
    render(<ErrorAlert scrollToRow={scrollToRow} data={data} />);
    const cancelIcon = screen.getByTestId("cancel-icon");
    expect(cancelIcon).toBeInTheDocument();
  });

  it("should render error traverse icons in the box when errors are present in data", () => {
    render(<ErrorAlert scrollToRow={scrollToRow} data={data} />);
    const forward = screen.getByTestId("arrow-forward-icon");
    const backward = screen.getByTestId("arrow-back-icon");
    expect(forward).toBeInTheDocument();
    expect(backward).toBeInTheDocument();
  });

  it("should display error message when errors are present", () => {
    const { getByText } = render(
      <ErrorAlert scrollToRow={scrollToRow} data={data} />
    );
    expect(getByText("3 Error(s) found !")).toBeInTheDocument();
  });

  it('should scroll to next error cell when "next error" button is clicked', () => {
    render(<ErrorAlert scrollToRow={scrollToRow} data={data} />);

    const nextErrorButton = screen.getByTestId("next-button");

    fireEvent.click(nextErrorButton);
    expect(scrollToRow).toHaveBeenCalledTimes(1);
    expect(scrollToRow).toHaveBeenCalledWith(1);

    fireEvent.click(nextErrorButton);
    expect(scrollToRow).toHaveBeenCalledTimes(2);
    expect(scrollToRow).toHaveBeenCalledWith(2);

    fireEvent.click(nextErrorButton);
    expect(scrollToRow).toHaveBeenCalledTimes(3);
    expect(scrollToRow).toHaveBeenCalledWith(0);
  });

  it('should scroll to previous error cell when "previous error" button is clicked', () => {
    render(<ErrorAlert scrollToRow={scrollToRow} data={data} />);

    const prevErrorButton = screen.getByTestId("prev-button");

    fireEvent.click(prevErrorButton);
    expect(scrollToRow).toHaveBeenCalledTimes(1);
    expect(scrollToRow).toHaveBeenCalledWith(2);

    fireEvent.click(prevErrorButton);
    expect(scrollToRow).toHaveBeenCalledTimes(2);
    expect(scrollToRow).toHaveBeenCalledWith(1);

    fireEvent.click(prevErrorButton);
    expect(scrollToRow).toHaveBeenCalledTimes(3);
    expect(scrollToRow).toHaveBeenCalledWith(0);
  });
});
