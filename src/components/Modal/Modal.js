import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, TextField, Dialog, Button, FormLabel, FormControl, FormControlLabel, DialogContent, DialogActions, Radio, RadioGroup } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import UserModel from 'models/UserModel';


const Modal = props => {
  const { className, onChange, style, data, ...rest } = props;


  
  return (
    <div style={{ width: '100%', margin: 10, position: 'relative' }}>

      <Dialog
        open={props.open}
        style={{ zIndex: 1000 }}
        // scroll="paper"
        onClose={props.close}
      >
        <DialogContent style={{ width: '600px', height: '70vh', minHeight: '50vh', fontFamily: 'Nunito Sans, Roboto, sans-serif' }}>

          <h3>Updated SKU Quantites</h3><br /><br />

          {data.oos_skus && data.oos_skus.length > 0 && Array.isArray(data.oos_skus) &&
            <div style={{ margin: 15 }}>
              <h4>Out Of Stock SKUs</h4>
              <ul style={{ padding: 20 }}>
                {
                  data.oos_skus.map(sku => (
                    <li>
                      <span style={{ fontSize: 18, color: 'red' }}>{sku.name}</span>
                      {/* <span>{` is Out Of Stock.`}</span> */}
                    </li>
                  ))
                }
              </ul>
            </div>
          }

          {data.limited_skus && data.limited_skus.length > 0 && Array.isArray(data.limited_skus) &&
            <div style={{ margin: 15 }}>
              <h4>Limited SKUs</h4>
              <ul style={{ padding: 20 }}>
                {
                  data.limited_skus.map(sku => (
                    <li>
                      <span style={{ fontSize: 18, color: 'blue', marginRight: 20 }}>{sku.name}</span>
                      <span>{` Remaining quantity: ${sku.aoos_limit - sku.current_aoos_inv}`}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          }

          {/* <br /><br /><br /><br /><br /> */}

        </DialogContent>
        <DialogActions>
          <div style={{fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>
            Are you sure you want to make the changes?
          </div>
          <Button
            onClick={() => props.handleOrderChangeForOOSOrReducedQty(data.oos_skus, data.limited_skus)} 
            color="primary"
          >
            Yes
          </Button>
          <Button 
            onClick={props.close} 
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

Modal.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object
};

export default Modal;
