import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    CardActionArea,
    CardMedia,
    Divider,
    Grid,
    Button,
    TextField,
    Checkbox,
    Icon
} from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
// import 'antd/dist/antd.css';

const GreenCheckbox = withStyles({
    root: {
        color: 'orange',
        '&$checked': {
            color: 'orange',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    input: {
        display: 'none'
    },
    cardroot: {
        maxWidth: 250,
        marginTop: 30
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        flex: '1 0 auto',
        margin: theme.spacing(1),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddManualOrder = props => {
    const classes = useStyles();
    const { className, ...rest } = props;

    var [mobileData, setMobileData] = useState([]);
    var [selectedMobileData, setSelectedMobileData] = useState({});

    const [impCondition, setImpCondition] = useState(false)  // Ask before removing

    const [skuItems, setSkuItems] = useState([])
    const [selectedSkuItems, setSelectedSkuItems] = useState([{ id: null, name: '' }])
    const [orderItemRows, setOrderItemRows] = useState([{ name: '', quantity: '', price: '', cost: '' }])

    var [subTotal, setSubtotal] = useState('');

    const [openData, setOpenData] = useState({
        openSuccess: false,
        openError: false
    });
    const [params, setParams] = useState({
        dataFetchStatus: true,
        submitStatus: false,
        name: "",
    });

    useEffect(() => {
        let subtotal = 0;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows)
            && orderItemRows.forEach(item => {
                subtotal += item.cost
            })
        setSubtotal(subtotal)
    }, [orderItemRows])

    const mobileHandleChange = async (event, val) => {
        // var arr = event.target.getAttribute('data-option-index');
        // console.log('mobile val', val);
        if (val) {
            setSelectedMobileData({ mobile: val.mobile, name: val.name, id: val.id });
        }
    };

    const mobileSearch = async (event, value) => {
        await setParams({ ...params, dataFetchStatus: false });
        await UserModel.getInstance().getUsersListFromMobile(
            { 'users.mobile': value },
            succ => {
                // console.log(succ);
                setMobileData(succ);
                setParams({ ...params, dataFetchStatus: true });
            },
            err => {
                // console.log(err);
            }
        );
    };

    const handleChange = event => {
        setParams({
            ...params,
            [event.target.name]: event.target.value
        });
    };

    const checkErrors = () => {
        // console.log(selectedMobileData)
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(({ name, quantity, price, cost }, index) => {
            if (
                !name || !quantity || !price || !cost || !selectedSkuItems[index].id || !selectedSkuItems[index].name
            ) {
                return true;
            } else {
                return false;
            }
        })
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenData({ openSuccess: false, openError: false });
    };

    const handleSubmit = () => {
        // console.log({ params })
        if (!params.submitStatus) {
            const errors = checkErrors()
            if (errors) {
                setOpenData({ ...openData, openError: true });
            } else {
                setParams({ ...params, submitStatus: true });
                let par = new FormData();
                let orderList = orderItemRows && orderItemRows.filter(x => x.quantity > 0).map((item, index) => ({
                    sku_id: selectedSkuItems[index].id,
                    price: item.price,
                    qty: item.quantity
                }))
                if (orderList.length > 0) {
                    var obj = {
                        user_id: selectedMobileData.id, // retailer ID
                        items: orderList
                    };
                    UserModel.getInstance().postManualOrder(
                        obj,
                        succ => {
                            setOpenData({ ...openData, openSuccess: true });
                            // console.log(succ);
                            setTimeout(() => {
                                props.history.push('/manual-orders');
                            }, 1000);
                        },
                        err => {
                            setParams({ ...params, submitStatus: false });
                            console.log(err);
                            // console.log(obj);
                        }
                    );
                }
                else {
                    setOpenData({ ...openData, openWarning: true });
                }
            }
        }
    }


    const skuSearch = async (event, value) => {
        // console.log('skusearch', { event, value })
        // console.log({ event, value })
        if (value) {
            await setParams({ ...params, dataFetchStatus: false });
            await UserModel.getInstance().getSkuByName(
                { 'q': value },
                succ => {
                    // console.log(succ);
                    setSkuItems(succ);
                    setParams({ ...params, dataFetchStatus: true });
                },
                err => {
                    console.log(err);
                }
            );
        }
    };

    const handleOrderItemDetailsChange = (e, index) => {
        // console.log('eeeeeeeee handleOrderItemChange', e.target.name)
        // console.clear()
        // console.log('handleOrderItemChange')
        // console.log(e.target.name, e.target.value, { index })
        const orderItemsDetailArr = orderItemRows;
        orderItemsDetailArr[index][e.target.name] = e.target.value;
        if (e.target.name === 'quantity') {
            orderItemsDetailArr[index].cost = orderItemsDetailArr[index].quantity * orderItemsDetailArr[index].price;
        }
        setOrderItemRows(orderItemsDetailArr)
        let subtotal = 0;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(item => {
            subtotal += item.cost
        })
        setSubtotal(subtotal)
        setImpCondition(!impCondition)  // ask before removing
    }

    const orderItemHandleChange = async (event, val, index) => {
        // var arr = event.target.getAttribute('data-option-index');
        // console.log('orderItem val', val);
        // console.log(val, index);
        if (val) {
            const skuItemsDetailArr = selectedSkuItems;
            var newObj = { id: val.id, name: val.name }
            skuItemsDetailArr[index] = newObj
            setSelectedSkuItems(skuItemsDetailArr);

            const orderItemsDetailArr = orderItemRows;
            orderItemsDetailArr[index].name = val.name;
            // orderItemsDetailArr[index].quantity = val.quantity;
            orderItemsDetailArr[index].price = val.price;
            orderItemsDetailArr[index].cost = orderItemsDetailArr[index].quantity > 1 ? (orderItemsDetailArr[index].quantity * val.price) : (orderItemsDetailArr[index].quantity === 0 ? 0 : '')
            setOrderItemRows(orderItemsDetailArr)

            let subtotal = 0;
            orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(item => {
                subtotal += item.cost
            })
            setSubtotal(subtotal)
            setImpCondition(!impCondition)  // ask before removing
        }
    };

    const addNewOrderItemRow = () => {
        // console.log('add new order row')
        let rowFilled = false;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(({ name, quantity, price, cost }, index) => {
            // console.log(val)
            if (name && quantity && price && cost) {
                rowFilled = true
            } else {
                setOpenData({ ...openData, openWarning: true });
                rowFilled = false
                return;
            }
        })
        const newOrderItem = {
            name: '',
            quantity: '',
            price: '',
            cost: ''
        }
        const newSku = {
            id: null,
            name: '',
        }
        rowFilled && setOrderItemRows([...orderItemRows, newOrderItem])
        rowFilled && setSelectedSkuItems([...selectedSkuItems, newSku])
        setImpCondition(!impCondition)  // ask before removing
    }

    const removeOrderItem = (index) => {
        if (index !== orderItemRows.length - 1) {
            let orderItemsDetailArr = [...orderItemRows];
            orderItemsDetailArr.splice(index, 1)
            // console.log(orderItemsDetailArr)
            setOrderItemRows([...orderItemsDetailArr])
            let skuSelectedDetailsArr = [...selectedSkuItems];
            skuSelectedDetailsArr.splice(index, 1)
            // console.log(skuSelectedDetailsArr)
            setSelectedSkuItems([...skuSelectedDetailsArr])
            setImpCondition(!impCondition)  // ask before removing
        }
    }

    const generateOrderItemsRows = (values, index) => {
        // console.log({ orderItemRows, selectedSkuItems })
        // console.log({ values })
        return (
            <Grid container spacing={4}>

                <Grid item md={5} xs={12}>
                    <Autocomplete
                        id="sku"
                        // name='Sku_name'
                        options={skuItems}
                        getOptionLabel={option => option.name}
                        renderInput={params => (
                            <TextField {...params} label="SKU" variant="outlined" margin="dense" placeholder='Search SKU' />
                        )}
                        value={selectedSkuItems[index]}
                        onChange={(e, val) => orderItemHandleChange(e, val, index)}
                        onInputChange={skuSearch}
                        loading
                        loadingText={
                            params.dataFetchStatus ? 'Loading' : 'No Matches'
                        }
                    />
                </Grid>

                <Grid item md={2} xs={6}>
                    <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        type='number'
                        inputProps={{ min: 0 }}
                        min={0}
                        onChange={(e) => handleOrderItemDetailsChange(e, index)}
                        required
                        margin='dense'
                        value={values.quantity}
                        variant="outlined"
                        placeholder="Quantity"
                    />
                </Grid>

                <Grid item md={2} xs={6}>
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type='number'
                        inputProps={{ min: 0 }}
                        min={0}
                        onChange={(e) => handleOrderItemDetailsChange(e, index)}
                        required
                        margin='dense'
                        value={values.price}
                        variant="outlined"
                        // placeholder="Price"
                        disabled
                    />
                </Grid>

                <Grid item md={2} xs={6}>
                    <TextField
                        fullWidth
                        label="Cost"
                        name="cost"
                        type='number'
                        inputProps={{ min: 0 }}
                        min={0}
                        onChange={(e) => handleOrderItemDetailsChange(e, index)}
                        required
                        margin='dense'
                        value={values.cost}
                        variant="outlined"
                        // placeholder="Cost"
                        disabled
                    />
                </Grid>


                <Grid item md={1} xs={2}>
                    <Icon color="primary" style={{ fontSize: 40 }} onClick={() => removeOrderItem(index)}>cancel</Icon>
                </Grid>

            </Grid>
        )
    }


    return (
        <div className={classes.root}>
            <Card {...rest} className={clsx(classes.root, className)}>
                <form autoComplete="off" noValidate>
                    <CardHeader title="Add Manual Order" />
                    <Divider />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <Autocomplete
                                    id="Mobile"
                                    options={mobileData}
                                    getOptionLabel={option => option.mobile}
                                    renderInput={params => (
                                        <TextField {...params} label="Retailer's Mobile Number" variant="outlined" margin="dense" placeholder='Search retailer from mobile number' />
                                    )}
                                    value={selectedMobileData}
                                    onChange={mobileHandleChange}
                                    onInputChange={mobileSearch}
                                    loading
                                    loadingText={
                                        params.dataFetchStatus ? 'Loading' : 'No Matches'
                                    }
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder="Retailer Name"
                                    margin="dense"
                                    name="name"
                                    // onChange={handleChange}
                                    required
                                    value={selectedMobileData.name}
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <br />

                        {
                            <div id="orderSkuItems">
                                <h5>Order Items</h5>
                                <br/>
                                {orderItemRows && orderItemRows.length > 0 &&
                                    Array.isArray(orderItemRows) &&
                                    orderItemRows.map((val, index) => {
                                        return generateOrderItemsRows(val, index)
                                    })
                                }
                            </div>
                        }
                        <br />
                        <br />



                        <Grid container spacing={3}>
                            <Grid item md={9} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>

                            <Grid item md={2} xs={12}>
                                <TextField
                                    label="Sub Total"
                                    fullWidth
                                    onChange={handleChange}
                                    required
                                    value={subTotal}
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                        </Grid>

                        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Icon color="primary" style={{ fontSize: 50 }} onClick={() => addNewOrderItemRow()}>add_circle</Icon>
                        </CardActions>

                        <Snackbar
                            open={openData.openWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Please complete above row(s) by selecting SKU(s) and desired quantity!
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={openData.openSuccess}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                                Manual order successfully added
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={openData.openError}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                Error when making changes. Ensure all fields are filled
                            </Alert>
                        </Snackbar>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={params.submitStatus ? null : handleSubmit}>
                            Add Manual Order
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default AddManualOrder;
