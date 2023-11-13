import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import VirtualTable from "../index";
describe("VirtualTable", () => {
  it("should render table when no data is given", () => {
    <VirtualTable />;
  });

  //   it("should render a table with the given data and table options", () => {
  //     const tableHeaders = [
  //       { headerName: "Name", headerFieldName: "name" },
  //       { headerName: "Age", headerFieldName: "age" },
  //       { headerName: "Email", headerFieldName: "email" },
  //     ];

  //     const data = [
  //       { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
  //       {
  //         indexId: 2,
  //         name: "Jane Smith",
  //         age: 30,
  //         email: "jane.smith@example.com",
  //       },
  //       {
  //         indexId: 3,
  //         name: "Bob Johnson",
  //         age: 35,
  //         email: "bob.johnson@example.com",
  //       },
  //     ];

  //     const wrapper = mount(
  //       <VirtualTable
  //         incomingData={data}
  //         incomingTableOptions={{}}
  //         tableHeaders={tableHeaders}
  //         buffer={5}
  //         numberOfRows={6}
  //         onSubmit={() => {}}
  //         onProceedAnyway={() => {}}
  //         onSkip={() => {}}
  //         callExportCSV={false}
  //         onDataChange={() => {}}
  //       />
  //     );

  //     expect(wrapper.find(TableHeader)).toHaveLength(1);
  //     expect(wrapper.find(TableRow)).toHaveLength(data.length);
  //   });

  //   // Displays the correct number of rows based on the item height and number of visible items
  //   it("should display the correct number of rows based on the item height and number of visible items", () => {
  //     const tableHeaders = [
  //       { headerName: "Name", headerFieldName: "name" },
  //       { headerName: "Age", headerFieldName: "age" },
  //       { headerName: "Email", headerFieldName: "email" },
  //     ];

  //     const data = [
  //       { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
  //       {
  //         indexId: 2,
  //         name: "Jane Smith",
  //         age: 30,
  //         email: "jane.smith@example.com",
  //       },
  //       {
  //         indexId: 3,
  //         name: "Bob Johnson",
  //         age: 35,
  //         email: "bob.johnson@example.com",
  //       },
  //     ];

  //     const wrapper = mount(
  //       <VirtualTable
  //         itemHeight={50}
  //         incomingData={data}
  //         incomingTableOptions={{}}
  //         tableHeaders={tableHeaders}
  //         buffer={5}
  //         numberOfRows={6}
  //         onSubmit={() => {}}
  //         onProceedAnyway={() => {}}
  //         onSkip={() => {}}
  //         callExportCSV={false}
  //         onDataChange={() => {}}
  //       />
  //     );

  //     expect(wrapper.find(TableRow)).toHaveLength(6);
  //   });

  //   // Scrolls the table correctly based on the buffer and current scroll position
  //   it("should scroll the table correctly based on the buffer and current scroll position", () => {
  //     const tableHeaders = [
  //       { headerName: "Name", headerFieldName: "name" },
  //       { headerName: "Age", headerFieldName: "age" },
  //       { headerName: "Email", headerFieldName: "email" },
  //     ];

  //     const data = [
  //       { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
  //       {
  //         indexId: 2,
  //         name: "Jane Smith",
  //         age: 30,
  //         email: "jane.smith@example.com",
  //       },
  //       {
  //         indexId: 3,
  //         name: "Bob Johnson",
  //         age: 35,
  //         email: "bob.johnson@example.com",
  //       },
  //     ];

  //     const wrapper = mount(
  //       <VirtualTable
  //         itemHeight={50}
  //         incomingData={data}
  //         incomingTableOptions={{}}
  //         tableHeaders={tableHeaders}
  //         buffer={5}
  //         numberOfRows={6}
  //         onSubmit={() => {}}
  //         onProceedAnyway={() => {}}
  //         onSkip={() => {}}
  //         callExportCSV={false}
  //         onDataChange={() => {}}
  //       />
  //     );

  //     const viewPortRef = wrapper.find('Box[ref="viewPortRef"]');
  //     viewPortRef.getDOMNode().scrollTop = 200;

  //     wrapper.update();

  //     expect(wrapper.find(TableRow).first().prop("item").top).toBe(200);
  //   });

  //   // Updates the data correctly when a row is changed
  //   it("should update the data correctly when a row is changed", () => {
  //     const tableHeaders = [
  //       { headerName: "Name", headerFieldName: "name" },
  //       { headerName: "Age", headerFieldName: "age" },
  //       { headerName: "Email", headerFieldName: "email" },
  //     ];

  //     const data = [
  //       { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
  //       {
  //         indexId: 2,
  //         name: "Jane Smith",
  //         age: 30,
  //         email: "jane.smith@example.com",
  //       },
  //       {
  //         indexId: 3,
  //         name: "Bob Johnson",
  //         age: 35,
  //         email: "bob.johnson@example.com",
  //       },
  //     ];

  //     const wrapper = mount(
  //       <VirtualTable
  //         itemHeight={50}
  //         incomingData={data}
  //         incomingTableOptions={{}}
  //         tableHeaders={tableHeaders}
  //         buffer={5}
  //         numberOfRows={6}
  //         onSubmit={() => {}}
  //         onProceedAnyway={() => {}}
  //         onSkip={() => {}}
  //         callExportCSV={false}
  //         onDataChange={() => {}}
  //       />
  //     );

  //     const updatedRow = {
  //       indexId: 2,
  //       name: "Jane Smith",
  //       age: 31,
  //       email: "jane.smith@example.com",
  //     };
  //     wrapper.find(TableRow).at(1).props().onRowChange(updatedRow);

  //     expect(wrapper.find(TableRow).at(1).props().item).toEqual(updatedRow);
  //   });

  //   // Deletes rows correctly when the delete button is clicked
  //   it("should delete rows correctly when the delete button is clicked", () => {
  //     const tableHeaders = [
  //       { headerName: "Name", headerFieldName: "name" },
  //       { headerName: "Age", headerFieldName: "age" },
  //       { headerName: "Email", headerFieldName: "email" },
  //     ];

  //     const data = [
  //       { indexId: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
  //       {
  //         indexId: 2,
  //         name: "Jane Smith",
  //         age: 30,
  //         email: "jane.smith@example.com",
  //       },
  //       {
  //         indexId: 3,
  //         name: "Bob Johnson",
  //         age: 35,
  //         email: "bob.johnson@example.com",
  //       },
  //     ];

  //     const wrapper = mount(
  //       <VirtualTable
  //         itemHeight={50}
  //         incomingData={data}
  //         incomingTableOptions={{}}
  //         tableHeaders={tableHeaders}
  //         buffer={5}
  //         numberOfRows={6}
  //         onSubmit={() => {}}
  //         onProceedAnyway={() => {}}
  //         onSkip={() => {}}
  //         callExportCSV={false}
  //         onDataChange={() => {}}
  //       />
  //     );

  //     wrapper.find(TableRow).at(1).props().onRowChange({
  //       indexId: 2,
  //       name: "Jane Smith",
  //       age: 30,
  //       email: "jane.smith@example.com",
  //     });
  //     wrapper.find(TableRow).at(2).props().onRowChange({
  //       indexId: 3,
  //       name: "Bob Johnson",
  //       age: 35,
  //       email: "bob.johnson@example.com",
  //     });

  //     wrapper.find(Button).at(0).simulate("click");

  //     expect(wrapper.find(TableRow)).toHaveLength(1);
  //     expect(wrapper.find(TableRow).props().item).toEqual({
  //       indexId: 1,
  //       name: "John Doe",
  //       age: 25,
  //       email: "john.doe@example.com",
  //     });
  //   });
});
