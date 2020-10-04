import React, { ReactFragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import FileUploader from '../../helpers/FileUploader';
import UserModel from 'models/UserModel';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BatchUploadSku = props => {
  const useStyles = makeStyles(theme => ({
    root: {},
    input: {
      display: 'none'
    }
  }));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenData({ openSuccess: false, openError: false });
  };

  const { className, ...rest } = props;
  const classes = useStyles();
  const [skuData, setSkuData] = useState([]);
  const [openData, setOpenData] = useState({
    openSuccess: false,
    openError: false
  });

  return (
    <div>
      <FileUploader
        getData={async data => {
          setSkuData(data);
          const errs = false;
          await data.forEach(sku => {
            // console.log(sku.Sku_Id);
            if (
              sku.Sku_Id !== '' &&
              sku.Sku_Id !== '' &&
              sku.Product_Id !== '' &&
              sku.Price !== '' &&
              sku.Supplier_Id !== '' &&
              sku.Stock !== ''
            ) {
              let obj = {
                supplier: [sku.Supplier_Id],
                product_id: sku.Product_Id,
                price: sku.Price,
                is_stock: sku.Stock
              };
              UserModel.getInstance().updateSku(
                sku.Sku_Id,
                obj,
                succ => {
                  console.log(succ);
                  setOpenData({ ...openData, openSuccess: true });
                },
                err => {
                  errs = true;
                  console.log(err);
                  setOpenData({ ...openData, openError: true });
                }
              );
            }
          });
          // if (errs) {
          //   setOpenData({ ...openData, openError: true });
          // } else {
          //   setOpenData({ ...openData, openSuccess: true });
          // }
        }}
      />
      <Snackbar
        open={openData.openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Sku successfully updated
        </Alert>
      </Snackbar>
      <Snackbar
        open={openData.openError}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Sku's not updated properly. Check file for blanks or incorrect format
        </Alert>
      </Snackbar>
      {/* <input
        accept=".csv,file/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={fileHandleChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span" on>
          Upload
        </Button>
      </label> */}
    </div>
  );
};

export default BatchUploadSku;
