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

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {options.selection && (
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column}
                  // style={tableCellStyles.cellCustom(
                  //   column.width,
                  //   column.headerAlign
                  // )}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          <TableRow>
              {options.selection && (
                <TableCell />
              )}
              {columns.map((column) => (
                <TableCell key={column + "-filter"}>
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
            {rows.map((row) => (
              <TableRow key={row[options.uniqueIdKey]}>
                {options.selection && (
                  <TableCell>
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
                  <TableCell key={column.field}>
                    {column.render ? column.render(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
        component="div"
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
    </Paper>
  );
};
export default MaterialTable
