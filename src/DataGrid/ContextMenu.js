import { Menu, MenuItem } from "@material-ui/core";
import { commonStyles } from "./styles";
import { setSubscribedData } from "./Reactive/subscriber";

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
    setSubscribedData("gridData", newData);
    setData(newData);
    closeContextMenu();
  };

  const deleteRow = (rowIndex) => {
    const newData = [...data];
    newData.splice(rowIndex, 1);
    setSubscribedData("gridData", newData);
    setData(newData);
    closeContextMenu();
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
              deleteRow(contextMenuPosition.rowIndex);
            }}
          >
            Delete Row
          </MenuItem>
        )}
        {tableOptions.duplicateRow &&
          data.length < tableOptions.maxRowCount && (
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
