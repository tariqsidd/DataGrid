import { Menu, MenuItem } from "@material-ui/core";
import { commonStyles } from "./styles";

const ContextMenu = ({
  tableOptions = {},
  setData = () => {},
  data = [],
  contextMenuVisible,
  contextMenuPosition,
  closeContextMenu,
}) => {
  const classes = commonStyles();

  const duplicateRow = (rowIndex) => {
    const newData = [...data];
    const duplicateRow = newData[rowIndex];
    newData.push(duplicateRow);
    setData(newData);
    closeContextMenu();
  };

  const deleteRow = (id) => {
    const newData = [...data];
    let rowIndex = newData.findIndex((i)=> i.id === id)
    newData.splice(rowIndex, 1);
    setData(newData);
    closeContextMenu();
  //  new logic
  //   newData[rowIndex].isDeleted = true;
  //   closeContextMenu();
  };

  return (
    <div
      className={classes.contextMenu}
      style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
    >
      <Menu
        keepMounted
        open={contextMenuVisible}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuVisible
            ? { top: contextMenuPosition.top, left: contextMenuPosition.left }
            : undefined
        }
      >
        {tableOptions.deleteRow && (
          <MenuItem
            onClick={() => {
              console.log('contextMenuPosition',contextMenuPosition)
              deleteRow(contextMenuPosition.id);
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
  );
};

export default ContextMenu;
