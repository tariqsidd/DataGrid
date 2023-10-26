import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Checkbox, IconButton
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

function CustomTable({ columns, data, actions, components }) {
  const [filters, setFilters] = useState({});
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const handleFilterChange = (event, column) => {
    setFilters({ ...filters, [column.field]: event.target.value });
  };

  const handleEdit = (row) => {
    setEditableRow(row.tableData.id);
    setEditedData(row);
  };

  const handleSave = (id) => {
    // Save logic here
    setEditableRow(null);
  };

  const handleSelection = (event, id) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(item => item !== id));
    }
  };

  let filteredData = data.filter(row => {
    return columns.every(column => {
      if (!filters[column.field]) return true;
      return String(row[column.field]).includes(filters[column.field]);

    });
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"/>
            {columns.map((column) => (
              <TableCell key={column.field}>
                {column.title}
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
          <TableRow>
            <TableCell padding="checkbox"/>
            {columns.map((column) => (
              <TableCell key={column.field}>
                {column.filtering !== false && (
                  <TextField
                    value={filters[column.field] || ''}
                    onChange={(e) => handleFilterChange(e, column)}
                    placeholder="Filter"
                  />
                )}
              </TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow key={row.tableData.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.includes(row.tableData.id)}
                  onChange={(e) => handleSelection(e, row.tableData.id)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {editableRow === row.tableData.id ?
                    <TextField
                      value={editedData[column.field]}
                      onChange={(e) => setEditedData({ ...editedData, [column.field]: e.target.value })}
                    />
                    :
                    column.render ? column.render(row) : row[column.field]
                  }
                </TableCell>
              ))}
              <TableCell>
                {editableRow === row.tableData.id ? (
                  <>
                    <IconButton onClick={() => handleSave(row.tableData.id)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => setEditableRow(null)}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                )}
                {actions && actions.map((action, index) => (
                  <IconButton key={index} onClick={() => action.onClick(row)}>
                    {action.icon}
                  </IconButton>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomTable;
