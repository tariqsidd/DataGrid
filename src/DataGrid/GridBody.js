import React, { memo } from "react";
import { TableBody } from "@material-ui/core";
import GridRow from "./GridRow";
import { setSubscribedData } from "./Reactive/subscriber";
import isEqual from "lodash.isequal";

const GridBody = memo(
  ({ tableOptions, tableHeaders, data, openContextMenu, onDataChange }) => {
    console.log("TableBody RERENDER");
    console.log("Table Body in Data", data);
    const handleDataChange = (updatedRow) => {
      const rowIndex = data.findIndex((x) => x.id === updatedRow.id);
      data[rowIndex] = updatedRow;
      setSubscribedData("gridData", data);
      console.log("Updated Data in Table Body", data);
      onDataChange(data);
    };

    return (
      <TableBody style={{ height: data.length * 40 }}>
        {data.map((row, rowIndex) => {
          return (
            <GridRow
              key={row.id}
              // id={row.id}
              tableOptions={tableOptions}
              tableHeaders={tableHeaders}
              rowIndex={rowIndex}
              row={row}
              data={data}
              onRowChange={(updatedRow, rowIndex) => {
                console.log("Table Body Row: ", updatedRow);
                console.log("Table Body Row Index: ", rowIndex);
                // handleDataChange(updatedRow, rowIndex);
                handleDataChange(updatedRow);
              }}
              // openContextMenu={openContextMenu}
            />
          );
        })}
      </TableBody>
    );
  },
  isEqual
);

export default GridBody;
