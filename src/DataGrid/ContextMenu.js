import {Menu, MenuItem} from "@material-ui/core";

const ContextMenu = ({
                       tableOptions = {},
                       setData = () => {
                       },
                       data = [],
                       contextMenuVisible,
                       contextMenuPosition,
                       closeContextMenu
                     }) => {

  const duplicateRow = (rowIndex) => {
    const newData = [...data];
    const duplicateRow = newData[rowIndex];
    newData.push(duplicateRow);
    setData(newData);
    closeContextMenu();
  };

  const deleteRow = (rowIndex) => {
    const newData = [...data];
    newData.splice(rowIndex, 1);
    setData(newData);
    closeContextMenu();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: contextMenuPosition.top,
        left: contextMenuPosition.left,
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 5px #888888",
        zIndex: 1000,
      }}
    >
      <Menu
        keepMounted
        open={contextMenuVisible}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuVisible
            ? {top: contextMenuPosition.top, left: contextMenuPosition.left}
            : undefined
        }
      >
        {tableOptions.deleteRow && (
          <MenuItem
            onClick={() => {
              deleteRow(contextMenuPosition.rowIndex);
            }}
          >
            Delete Row
          </MenuItem>
        )}
        {tableOptions.duplicateRow && (
          <MenuItem
            onClick={() => {
              duplicateRow(contextMenuPosition.rowIndex);
            }}
          >
            Duplicate Row
          </MenuItem>
        )}
      </Menu>
    </div>
  )
};

export default ContextMenu
