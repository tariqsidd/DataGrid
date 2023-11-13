import "@testing-library/jest-dom";
import TableHeader from "../TableHeader";

describe("Table Header", () => {
  const columns = [{ headerName: "Column 1" }, { headerName: "Column 2" }];

  it("should render table header when no data is given", () => {
    <TableHeader />;
  });

  it("should render table header when columns are given", () => {
    <TableHeader columns={columns} />;
  });
});
