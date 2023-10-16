import { TextField } from "@material-ui/core";
import { columnOrder } from "Data";

let Ajv = require("ajv");
let ajv = new Ajv({ allErrors: true });

export const CustomTextField = (
  header,
  editingValue,
  setEditingValue,
  handleBlur,
  data,
  rowIndex
) => {
  console.log(editingValue);
  //   let object = {};
  //   if (editingValue.length > 0) {
  //     object = { [header.headerFieldName]: editingValue };
  //   }
  //   let validate = ajv.compile(header.headerSchema);
  //   let valid = validate(object);
  //   if (!valid) {
  //     const error = ajv.errorsText(validate.errors);
  //     const newData = [...data];
  //     newData[rowIndex]["errorObj"][header.headerFieldName] = error;
  //     const obj = newData[rowIndex]["errorObj"];
  //     const sortedErrorObj = Object.fromEntries(
  //       columnOrder
  //         .filter((key) => obj.hasOwnProperty(key)) // Filter out keys not in the object
  //         .map((key) => [key, obj[key]])
  //     );
  //     newData[rowIndex]["errorObj"] = sortedErrorObj;
  //   }
  return (
    <TextField
      style={{
        padding: "0px",
      }}
      type={header.headerCellType === "number" ? "number" : "text"}
      variant="outlined"
      value={editingValue}
      onBlur={handleBlur}
      onChange={(e) => setEditingValue(e.target.value)}
      autoFocus
    />
  );
};
