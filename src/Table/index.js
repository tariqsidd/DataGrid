import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  IconButton,
  TablePagination,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { addParamsToUrl } from "./utils";
import { Filter } from "./Filter";
import { v4 as uuidv4 } from 'uuid';

const initializeFilters = (columns) => {
  const initialFilters = {};
  columns.forEach((column) => {
    initialFilters[column.field] =
      column.filterType === "dateSelect" ? null : "";
  });
  return initialFilters;
};

const MaterialTable = ({
  options,
  columns,
  data,
  page = 1,
  setPage = () => {},
  isNextPage = true,
  ssf,
  onChangeFilter = () => {},
  onPageSizeChange = () => {},
  selectedRow={},
  onRowSelection = ()=>{}
}) => {
  // Example data
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState(initializeFilters(columns));
  const [pageSize, setPageSize] = useState(
    options.rowsPerPageOptions
      ? options.rowsPerPageOptions[0]
      : options.defaultPageSize
  );

  useEffect(() => {
    if (!Object.keys(selectedRows).length) {
      setSelectAll(false);
    }
    onRowSelection(selectedRows)
  }, [selectedRows]);

  useEffect(() => {
    onChangeFilter(addParamsToUrl(filters));
  }, [filters]);

  useEffect(() => {
      const isIdMissing = data.some(row => row[options.uniqueIdKey] === undefined);

      if (isIdMissing) {
        const newData = data.map((row) => ({
          ...row,
          [options.uniqueIdKey]: row[options.uniqueIdKey] || uuidv4(), // Generate ID only if it's missing
        }));
        setRows(newData);
      } else {
        setRows(data);
      }
    setSelectedRows(selectedRow)
  }, [data]);

  const handleSelectRow = (id) => {
    const newRow = rows.find((row) => row[options.uniqueIdKey] === id);
    const isSelected = selectedRows[id];

    if (isSelected) {
      // Create a new object without the unselected row
      const { [id]: _, ...newSelectedRows } = selectedRows;
      setSelectedRows(newSelectedRows);
    } else {
      // Add the selected row
      setSelectedRows({
        ...selectedRows,
        [id]: newRow,
      });
    }
  };

  const handleSelectAll = () => {
    const newSelection = {};
    const isRowSelectable = (row) =>
      !(options.selectionProps && options.selectionProps(row).disabled);

    if (!selectAll) {
      rows.filter(isRowSelectable).forEach((row) => {
        newSelection[row[options.uniqueIdKey]] = row;
      });
    }

    setSelectAll(!selectAll);
    setSelectedRows(newSelection);
  };

  const handleFilterChange = (event, column) => {
    const value = event.target.value;
    setFilters({ ...filters, [column]: value });

    const filteredRows = data.filter((row) => {
      const rowValue = String(row[column]).toLowerCase();
      return rowValue.includes(value.toLowerCase());
    });

    if (!ssf) {
      setRows(filteredRows);
    }
  };

  const handleDateChange = (date, column) => {
    setFilters({ ...filters, [column]: date });

    const filteredRows = data.filter((row) => {
      // Assuming the date in your row data is a string in 'yyyy-MM-dd' format
      const rowDate = row[column];
      const filterDate = date ? date.toISOString().split("T")[0] : "";
      return filterDate ? rowDate === filterDate : true;
    });

    setRows(filteredRows);
  };

  // const classes = useStyles();
  return (
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 100px)' }}>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
          flexDirection: "row",
        }}
      >
        {Object.keys(selectedRows).length > 0 &&
          options.selectionActions?.map((i) => {
            return (
              <IconButton aria-label="clear date" onClick={i.action}>
                {i.icon}
              </IconButton>
            );
          })}
      </Box>
      <Box
        // style={{ overflowX: "auto", maxWidth: "100%" }}
        sx={{
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "6px",
          },
        }}
      >
        <Table sx={tableStyles.table}>
          <TableHead>
            <TableRow>
              {options.selection && (
                <TableCell
                  sx={[tableStyles.checkboxCell, tableStyles.headerCell]}
                >
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={tableStyles.headerCell}
                  style={tableCellStyles.cellCustom(
                    column.width,
                    column.headerAlign
                  )}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {options.selection && (
                <TableCell
                  sx={[tableStyles.checkboxCell,tableStyles.filterCell]}
                />
              )}
              {columns.map((column) => (
                <TableCell
                  key={column + "-filter"}
                  sx={tableStyles.filterCell}
                  style={tableCellStyles.cellCustom(
                    column.width,
                    column.headerAlign
                  )}
                >
                  <Filter
                    type={column.filterType}
                    value={filters[column.field]}
                    onChange={(event) =>
                      handleFilterChange(event, column.field)
                    }
                    handleDateChange={handleDateChange}
                    options={column?.options || []}
                    label={column.header}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row[options.uniqueIdKey]}>
                {options.selection && (
                  <TableCell
                    sx={[tableStyles.checkboxCell, tableStyles.cell]}
                  >
                    <Checkbox
                      checked={!!selectedRows[row[options.uniqueIdKey]]}
                      onChange={() => handleSelectRow(row[options.uniqueIdKey])}
                      disabled={
                        options.selectionProps
                          ? options.selectionProps(row).disabled
                          : false
                      }
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={tableStyles.cell}
                    style={tableCellStyles.cellCustom(
                      column.width,
                      column.cellAlign
                    )}
                  >
                    {column.render ? column.render(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
          flexDirection: "row",
        }}
      >
        <TablePagination
          rowsPerPageOptions={
            options.rowsPerPageOptions ? options.rowsPerPageOptions : []
          }
          rowsPerPage={pageSize}
          onRowsPerPageChange={(event) => {
            onPageSizeChange(event.target.value);
            setPageSize(event.target.value);
          }}
          count={2}
          page={page}
          nextIconButtonProps={{ disabled: !isNextPage }}
          backIconButtonProps={page === 1 ? { disabled: true } : undefined}
          onPageChange={(e, p) => {
            if (p > page) {
              setPage(p);
            } else {
              setPage(p);
            }
          }}
          labelDisplayedRows={() => {
            return `Page ${page}`;
          }}
        />
      </Box>
    </TableContainer>
  );
};

const tableStyles =  {
    table: {
      // minWidth: 750, // This is the minimum width for the entire table
      tableLayout: "auto", // Fixed table layout
    },
    headerCell: {
      position: "sticky",
      border: "none",
      top: 0, // Top of the table container
      zIndex: 10, // Higher than the row z-index to stay on top
      background: '#fff', // Ensures the background matches
      backgroundColor: "#ccc",
      fontWeight: "bold",
    },
    filterCell: {
      position: "sticky",
      top: 55, // Height of the header cell, adjust accordingly
      zIndex: 5, // Lower than the header but above the rows
      background: '#fff',
      paddingTop: "12px", // Consistent padding
      paddingBottom: "12px",
    },
    cell: {
      paddingTop: "8px", // Consistent padding
      paddingBottom: "8px",
    },
    container: {
      // maxHeight: "calc(100vh - 100px)", // Adjust the height accordingly
    },
    checkboxCell: {
      minWidth: "60px", // Reduce this to your desired width
      width: 60, // Set a fixed width for checkbox cells
    },
};

const tableCellStyles = {
  cellCustom: (cellWidth, align) => {
    return {
      minWidth: "250px",
      ...(align && {
        textAlign: align,
      }),
      ...(cellWidth && { minWidth: cellWidth }),
    };
  },
};

export default MaterialTable
