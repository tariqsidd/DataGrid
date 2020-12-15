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
import { validateNumeric } from 'common/validators';
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

const walletDiscountTypes = [
    { id: 1, name: 'Referral Discount' },
    { id: 2, name: 'Referral Discount' },
    { id: 3, name: 'GMV Discount' },
]

const AddManualOrder = props => {
    const classes = useStyles();
    const { className, ...rest } = props;

    var [mobileData, setMobileData] = useState([]);
    var [selectedMobileData, setSelectedMobileData] = useState({});

    const [impCondition, setImpCondition] = useState(false)  // Ask before removing

    const [skuItems, setSkuItems] = useState([])
    const [selectedSkuItems, setSelectedSkuItems] = useState([{ id: null, name: '' }])
    const [orderItemRows, setOrderItemRows] = useState([{ name: '', quantity: '', pre_slash_price: '', post_slash_price: '', min_price: '', final_price: '', cost: '', qty_discount: [] }])

    var [subTotal, setSubtotal] = useState('');
    var [promoCode, setpromoCode] = useState('');
    var [couponId, setcouponId] = useState(null);
    var [promoCodeDiscount, setpromoCodeDiscount] = useState('');
    var [specialDiscount, setspecialDiscount] = useState('');
    var [totalBill, settotalBill] = useState('');

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
        console.log( orderItemRows[0].quantity, orderItemRows[0].final_price )
    })

    useEffect(() => {
        let subtotal = 0;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows)
            && orderItemRows.forEach(item => {
                subtotal += item.cost
            })
        setSubtotal(subtotal)
        var bill = subtotal;
        if (specialDiscount) {
            bill = bill - specialDiscount
        }
        // console.log(bill)

        // console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
        if (promoCodeDiscount) {
            // console.log(bill - promoCodeDiscount)
            bill = bill - promoCodeDiscount
        }
        // console.log(bill)

        if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
            console.log(selectedMobileData.wallet[0].amount, 'here')
            bill = bill - selectedMobileData.wallet[0].amount
        }
        console.log(bill)

        settotalBill(bill)
    }, [specialDiscount, orderItemRows, promoCodeDiscount, selectedMobileData])

    const mobileHandleChange = async (event, val) => {
        // var arr = event.target.getAttribute('data-option-index');
        // console.log('mobile val', val);
        if (val) {
            setSelectedMobileData({ mobile: val.mobile, name: val.name, id: val.id, wallet: val.wallet });
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
        console.log("selectedMobData", selectedMobileData)
        const err = orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.some(({ name, quantity, pre_slash_price, post_slash_price, min_price, final_price, cost }, index) => {
            if (
                !name || !quantity || quantity <= 0 || !final_price || final_price > post_slash_price || final_price < min_price || !cost || !selectedSkuItems[index].id || !selectedSkuItems[index].name || !selectedMobileData || !selectedMobileData.id
            ) {
                // console.log('A')
                return true;
            } 
            // else {
            //     console.log('B')
            //     // if (min_price > 0) {
            //     if (final_price >= min_price) {
            //         console.log('D')
            //         return false;
            //     }
            //     //     return true;
            //     // } 
            //     // else if (final_price >= post_slash_price) {
            //     //     return false;
            //     // }
            //     console.log('C')
            //     return true;
            // }
        })
        return err;
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenData({ openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false });
    };

    const handleSubmit = async () => {
        console.log(params.submitStatus)
        // if (!params.submitStatus) { //Commented this because it is being handles in render method
        const errors = await checkErrors() // Hamza you need to redo you error handling. It doesn not work
        if (errors) {
            setOpenData({ ...openData, openError: true });
        } else if (subTotal < 1000) {
            setOpenData({ ...openData, openMinOrderValueWarning: true })
        } 
        else if (specialDiscount + promoCodeDiscount > subTotal) {
            setOpenData({ ...openData, openDiscountWarning: true })
        }
        else if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && specialDiscount + promoCodeDiscount + selectedMobileData.wallet[0].amount > subTotal) {
            setOpenData({ ...openData, openDiscountWarning: true })
        }
        else if (totalBill && Number(totalBill) && totalBill > 0) {
            setParams({ ...params, submitStatus: true });
            let par = new FormData();
            let orderList = orderItemRows && orderItemRows.filter(x => x.quantity > 0).map((item, index) => ({
                sku_id: selectedSkuItems[index].id,
                price: item.final_price,
                qty: +item.quantity
            }))
            if (orderList.length > 0 && selectedMobileData && selectedMobileData.id) {
                console.log("MAKING")
                var obj = {
                    user_id: selectedMobileData.id, // retailer ID
                    items: orderList,
                };
                if (specialDiscount) {
                    obj = {
                        ...obj,
                        special_discount: +specialDiscount,
                    }
                }
                if (promoCodeDiscount) {
                    obj = {
                        ...obj,
                        coupon_id: couponId ? couponId : null
                    }
                }
                if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
                    obj = {
                        ...obj,
                        wallet_id: (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet[0]) ? selectedMobileData.wallet[0].id : null
                    }
                }

                UserModel.getInstance().postManualOrder(
                    obj,
                    succ => {
                        setOpenData({ ...openData, openSuccess: true });
                        setTimeout(() => {
                            props.history.push('/manual-orders');
                        }, 1000);
                    },
                    err => {
                        setParams({ ...params, submitStatus: false });
                        console.log(err);
                    }
                );
            }
            else {
                setParams({ ...params, submitStatus: false });
                setOpenData({ ...openData, openWarning: true });
            }
            // }
        }
        else {
            alert('Kindly check all fields')
        }
    }


    const skuSearch = async (event, value) => {
        // console.log('skusearch', { event, value })
        // console.log({ event, value })
        if (value) {
            await setParams({ ...params, dataFetchStatus: false });
            await UserModel.getInstance().getSkuByName(
                { 'q': value },
                data => {
                    // console.log(data);
                    let itemsInStockArr = [];
                    data && data.length > 0 && Array.isArray(data) && data.forEach((item) => {
                        // console.log(item.is_stock, item.name)
                        if (!item.is_stock) {
                            if (item.is_deal) {
                                console.log({ item })
                                var tempItem = { ...item, name: item.name + " - DEAL" }
                                itemsInStockArr.push(tempItem)
                            } else {
                                itemsInStockArr.push(item)
                            }
                        }
                    })
                    setSkuItems([...itemsInStockArr]);
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
        console.log(e.target.name, e.target.value)
        const orderItemsDetailArr = orderItemRows;
        var orderitem = orderItemsDetailArr[index];
        if ((e.target.name === 'quantity' || e.target.name === 'final_price')) {
            if (validateNumeric(parseInt(e.target.value)) || e.target.value === '') {
                console.log('vladatenumeric')
                console.log('vladatenumeric', e.target.value)
                orderitem[e.target.name] = e.target.value;
            } 
        }

        var disc_Threshold_Found = false;
        if (orderitem && orderitem.qty_discount && orderitem.qty_discount.length > 0 && Array.isArray(orderitem.qty_discount)) {
            orderitem.qty_discount.forEach((dis_Obj, idx) => {
                // console.log('disObj',idx)
                console.log('each iter')
                if (idx == orderitem.qty_discount.length - 1 && orderitem.quantity >= dis_Obj.lower) {
                    // console.log('A')
                    orderitem.final_price = (orderitem.post_slash_price - dis_Obj.value);
                    disc_Threshold_Found = true;
                    return;
                }
                if (orderitem.quantity >= dis_Obj.lower && orderitem.quantity <= dis_Obj.upper) {
                    // console.log('B')
                    // console.log('order post slash', orderitem.post_slash_price, dis_Obj.value)
                    orderitem.final_price = (orderitem.post_slash_price - dis_Obj.value);
                    disc_Threshold_Found = true;
                    return;
                }
            })

            if (!disc_Threshold_Found) {
                orderitem.final_price = orderitem.post_slash_price;
            }
        }

        // console.log(orderitem)

        if (e.target.name === 'quantity' || e.target.name === 'final_price') {
            orderitem.cost = orderitem.quantity * orderitem.final_price;
        }
        orderItemsDetailArr[index] = orderitem;
        // console.log(orderItemsDetailArr)
        setOrderItemRows(orderItemsDetailArr)
        let subtotal = 0;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(item => {
            subtotal += item.cost
        })
        setSubtotal(subtotal)

        var bill = subtotal;
        if (specialDiscount) {
            bill = bill - specialDiscount
        }
        // console.log(bill)

        console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
        if (promoCodeDiscount) {
            console.log(bill - promoCodeDiscount)
            bill = bill - promoCodeDiscount
        }
        // console.log(bill)

        if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
            console.log('wallet')
            bill = bill - selectedMobileData.wallet[0].amount
        }
        // console.log(bill)

        settotalBill(bill)
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
            var orderitem = orderItemsDetailArr[index];
            var disc_Threshold_Found = false;
            if (orderitem && orderitem.qty_discount && orderitem.qty_discount.length > 0 && Array.isArray(orderitem.qty_discount)) {
                orderitem.qty_discount.forEach((dis_Obj, idx) => {
                    // console.log('disObj',idx)
                    // console.log('each iter')
                    if (idx == orderitem.qty_discount.length - 1 && orderitem.quantity >= dis_Obj.lower) {
                        // console.log('A')
                        orderitem.final_price = (orderitem.post_slash_price - dis_Obj.value);
                        disc_Threshold_Found = true;
                        return;
                    }
                    if (orderitem.quantity >= dis_Obj.lower && orderitem.quantity <= dis_Obj.upper) {
                        // console.log('B')
                        // console.log('order post slash', orderitem.post_slash_price, dis_Obj.value)
                        orderitem.final_price = (orderitem.post_slash_price - dis_Obj.value);
                        disc_Threshold_Found = true;
                        return;
                    }
                })
                
                if (!disc_Threshold_Found) {
                    orderitem.final_price = orderitem.post_slash_price;
                }
            }
            console.log(val.latest_balance ? val.latest_balance.rate : val.post_slash_price)
            if (val.latest_balance)
            console.log('balrate', val.latest_balance.rate)
            else console.log('postslash', val.post_slash_price)

            orderItemsDetailArr[index].name = val.name;
            // orderItemsDetailArr[index].quantity = val.quantity;
            // orderItemsDetailArr[index].price = val.price;
            orderItemsDetailArr[index].pre_slash_price = val.price;
            orderItemsDetailArr[index].post_slash_price = val.price - val.discount;
            // console.log(val.latest_balance);
            orderItemsDetailArr[index].min_price = val.latest_balance ? val.latest_balance.rate : (val.price - val.discount); // if VIC calculated rate is not available, display post slash as min value (maximum possible discounted value).
            orderItemsDetailArr[index].final_price = val.price;
            orderItemsDetailArr[index].qty_discount = val.qty_discount;
            orderItemsDetailArr[index].cost = orderItemsDetailArr[index].quantity > 1 ? (orderItemsDetailArr[index].quantity * val.price) : (orderItemsDetailArr[index].quantity === 0 ? 0 : '')
            setOrderItemRows(orderItemsDetailArr)

            let subtotal = 0;
            orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(item => {
                subtotal += item.cost
            })
            setSubtotal(subtotal)
            var bill = subtotal;
            if (specialDiscount) {
                bill = bill - specialDiscount
            }
            console.log(bill)

            console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
            if (promoCodeDiscount) {
                console.log(bill - promoCodeDiscount)
                bill = bill - promoCodeDiscount
            }
            console.log(bill)

            if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
                console.log('wallet')
                bill = bill - selectedMobileData.wallet[0].amount
            }
            console.log(bill)

            settotalBill(bill)
            setImpCondition(!impCondition)  // ask before removing
        } else {
            const skuItemsDetailArr = selectedSkuItems;
            delete skuItemsDetailArr[index]
            console.log(skuItemsDetailArr)
            setSelectedSkuItems(skuItemsDetailArr);

            const orderItemsDetailArr = orderItemRows;
            orderItemsDetailArr[index].name = '';
            orderItemsDetailArr[index].quantity = '';
            // orderItemsDetailArr[index].price = '';
            orderItemsDetailArr[index].pre_slash_price = '';
            orderItemsDetailArr[index].post_slash_price = '';
            orderItemsDetailArr[index].min_price = '';
            orderItemsDetailArr[index].final_price = '';
            orderItemsDetailArr[index].qty_discount = '';
            orderItemsDetailArr[index].cost = '';
            setOrderItemRows(orderItemsDetailArr)

            let subtotal = 0;
            orderItemsDetailArr && orderItemsDetailArr.length > 0 && Array.isArray(orderItemsDetailArr) && orderItemsDetailArr.forEach(item => {
                subtotal += item.cost
            })
            setSubtotal(subtotal)
            var bill = subtotal;
            if (specialDiscount) {
                bill = bill - specialDiscount
            }
            console.log(bill)

            console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
            if (promoCodeDiscount) {
                console.log(bill - promoCodeDiscount)
                bill = bill - promoCodeDiscount
            }
            console.log(bill)

            if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
                console.log('wallet')
                bill = bill - selectedMobileData.wallet[0].amount
            }
            console.log(bill)

            settotalBill(bill)
            setImpCondition(!impCondition)  // ask before removing
        }
    };

    const addNewOrderItemRow = () => {
        // console.log('add new order row')
        // let rowFilled = false;
        const err = orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.some(({ name, quantity, pre_slash_price, post_slash_price, min_price, final_price, cost }, index) => {
            // console.log(val)
            console.log(
                name, quantity, quantity > 0, final_price, final_price >= min_price, final_price <= post_slash_price, cost
            )

            if (
                !name || !quantity || quantity <= 0 || !final_price || final_price > post_slash_price || final_price >= min_price || !cost || !selectedSkuItems[index].id || !selectedSkuItems[index].name
            ) {
                return true;
            } 
            // else {
            //     // if (min_price > 0) {
            //     if (final_price >= min_price) {
            //         return false;
            //     }
            //     //     return true;
            //     // } 
            //     // else if (final_price >= post_slash_price) {
            //     //     return false;
            //     // }
            //     return true;
            // }

            // final_price >= min_price && final_price <= post_slash_price 

            // if (name && quantity && quantity > 0 && final_price && cost) {
            //     if (min_price > 0) {
            //         if (final_price >= min_price) {
            //             rowFilled = true;
            //         } else {
            //             rowFilled = false;
            //         }
            //     } else if (final_price >= post_slash_price) {
            //         rowFilled = true;
            //     }
            // } else {
            //     setOpenData({ ...openData, openWarning: true });
            //     rowFilled = false
            //     return;
            // }
        })
        const newOrderItem = {
            name: '',
            quantity: '',
            pre_slash_price: '',
            post_slash_price: '',
            min_price: '',
            final_price: '',
            cost: ''
        }
        const newSku = {
            id: null,
            name: '',
        }
        if (err) {
            setOpenData({ openSuccess: false, openWarning: true, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false });
        } else {
            setOrderItemRows([...orderItemRows, newOrderItem])
            setSelectedSkuItems([...selectedSkuItems, newSku])
        }
        setImpCondition(!impCondition)  // ask before removing
    }

    const removeOrderItem = (index) => {
        if (orderItemRows.length > 1) {
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

    const handleSpecialDiscountChange = event => {
        var spDiscount = event.target.value;
        console.log(spDiscount)
        // console.log(validateNumeric(spDiscount))
        // console.log(validateNumeric('8+4_23%#^&^'))
        if (validateNumeric(spDiscount) && spDiscount !== 0 && spDiscount !== '0' && spDiscount !== '' && !spDiscount.includes('+') && !spDiscount.includes('-')) {
            console.log(spDiscount)
            setspecialDiscount(spDiscount);
        } else {
            setspecialDiscount('');
        }
    };

    // useEffect(() => {
    //     var bill = subTotal - specialDiscount
    //     settotalBill(bill)
    // }, [specialDiscount])

    const handlePromoChange = event => {
        var promo = event.target.value;
        setpromoCode(promo);
        var obj = {
            code: promo,
            user_id: selectedMobileData.id
        }
        UserModel.getInstance().postCheckPromoExistAndReturnAmount(
            obj,
            data => {
                // console.log(data)
                setcouponId(data.coupon_id)
                setpromoCodeDiscount(data.discount)
            },
            err => {
                // console.log(err);
                setcouponId(null)
                setpromoCodeDiscount('')
            }
        );
    };


    const generateOrderItemsRows = (values, index) => {
        // console.log({ orderItemRows, selectedSkuItems })
        // console.log({ values })
        return (
            <>
                <Grid container spacing={1} style={{ marginTop: 20 }}>

                    <Grid item md={4} xs={12}>
                        <Autocomplete
                            id="sku"
                            // name='Sku_name'
                            options={skuItems}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                                <TextField {...params} label="SKU" variant="outlined"
                                    // margin="dense" 
                                    placeholder='Search SKU' />
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

                    <Grid item md={1} xs={6}>
                        <TextField
                            fullWidth
                            label="Qty"
                            name="quantity"
                            type='number'
                            inputProps={{ min: 1 }}
                            min={1}
                            onChange={(e) => handleOrderItemDetailsChange(e, index)}
                            required
                            // margin='dense'
                            value={values.quantity}
                            variant="outlined"
                            placeholder="Qty"
                        />
                    </Grid>

                    {/* <Grid item md={1} xs={6}>
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
                </Grid> */}

                    <Grid item md={7} xs={6} style={{ display: 'flex' }}>
                        <TextField
                            style={{ marginLeft: 5, marginRight: 5 }}
                            fullWidth
                            label="Pre Slash Price"
                            name="pre_slash_price"
                            type='number'
                            inputProps={{ min: 0 }}
                            min={0}
                            onChange={(e) => handleOrderItemDetailsChange(e, index)}
                            // required
                            // margin='dense'
                            value={values.pre_slash_price}
                            variant="outlined"
                            // placeholder="Pre-Slash Price"
                            disabled
                        />

                        <TextField
                            style={{ marginLeft: 5, marginRight: 5 }}
                            fullWidth
                            label="Post Slash Price"
                            name="post_slash_price"
                            type='number'
                            inputProps={{ min: 0 }}
                            min={0}
                            onChange={(e) => handleOrderItemDetailsChange(e, index)}
                            // required
                            // margin='dense'
                            value={values.post_slash_price}
                            variant="outlined"
                            // placeholder="Post-Slash Price"
                            disabled
                        />

                        <TextField
                            style={{ marginLeft: 5, marginRight: 5 }}
                            fullWidth
                            label="Min. Price"
                            name="min_price"
                            type='number'
                            inputProps={{ min: 0 }}
                            min={0}
                            onChange={(e) => handleOrderItemDetailsChange(e, index)}
                            // required
                            // margin='dense'
                            value={values.min_price}
                            variant="outlined"
                            // placeholder="Min. Price"
                            disabled
                        />

                        <TextField
                            style={{ marginLeft: 5, marginRight: 5 }}
                            fullWidth
                            label="Final Price"
                            name="final_price"
                            type='number'
                            inputProps={{ min: values.min_price, max: values.pre_slash_price }}
                            min={values.min_price}
                            max={values.post_slash_price}
                            onChange={(e) => handleOrderItemDetailsChange(e, index)}
                            // required
                            // margin='dense'
                            value={values.final_price}
                            variant="outlined"
                        // placeholder="Final Price"
                        />

                        <TextField
                            style={{ marginLeft: 5, marginRight: 5 }}
                            fullWidth
                            label="Cost"
                            name="cost"
                            // type='number'
                            inputProps={{ min: 0 }}
                            min={0}
                            onChange={(e) => handleOrderItemDetailsChange(e, index)}
                            // required
                            // margin='dense'
                            value={values.cost}
                            variant="outlined"
                            // placeholder="Cost"
                            disabled
                        />

                        <Icon color="primary" style={{ fontSize: 40, marginLeft: 5, marginRight: 5 }} onClick={() => removeOrderItem(index)}>cancel</Icon>
                    </Grid>

                </Grid>

                <Grid container spacing={1}>
                    {values.qty_discount && values.qty_discount.length > 0 && Array.isArray(values.qty_discount) &&
                        values.qty_discount.map((x, idx) => (
                            <Grid item lg={12} md={12} sm={12} xs={12}
                                style={{ color: 'red', paddingLeft: 20 }}
                            >
                                <div>
                                    {
                                        idx === values.qty_discount.length - 1 && x.upper === 0 ?
                                            `More than ${x.lower - 1} units -> ${x.value} Rs. discount/unit` :
                                            `${x.lower} - ${x.upper} units -> ${x.value} Rs. discount/unit`
                                    }
                                </div>
                            </Grid>
                        ))
                    }
                </Grid>
            </>
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
                                        <TextField {...params} label="Retailer's Mobile Number" variant="outlined" required margin="dense" placeholder='Search retailer from mobile number' />
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
                                <h4 style={{color: '#606060'}}>Order Items</h4>
                                {/* <br /> */}
                                {orderItemRows && orderItemRows.length > 0 &&
                                    Array.isArray(orderItemRows) &&
                                    orderItemRows.map((val, index) => {
                                        return generateOrderItemsRows(val, index)
                                    })
                                }
                            </div>
                        }


                        <br />
                        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Icon color="primary" style={{ fontSize: 50 }} onClick={() => addNewOrderItemRow()}>add_circle</Icon>
                        </CardActions>
                        <br />




                        <Grid container spacing={3}>
                            <Grid item md={7} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>
                            <Grid item md={2} xs={12} style={{ position: 'relative' }}>
                                <div style={{ textAlign: 'center', margin: 0, position: 'absolute', top: '50%' }}>Sub Total :</div>
                            </Grid>

                            <Grid item md={2} xs={12}>
                                <TextField
                                    // label="Sub Total"
                                    fullWidth
                                    // onChange={handleChange}
                                    required
                                    value={subTotal}
                                    margin="dense"
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                        </Grid>

                        <br />
                        <Divider />
                        <br />

                        <Grid container spacing={3}>
                            <Grid item md={7} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>
                            {/* <Grid item md={2} xs={12} style={{position: 'relative'}}>
                                <div style={{textAlign: 'center', margin: 0, position: 'absolute', top: '50%' }}>Sub Total :</div>
                            </Grid> */}

                            <Grid item md={2} xs={12}>
                                <TextField
                                    label="Promo Code"
                                    fullWidth
                                    onChange={handlePromoChange}
                                    required
                                    value={promoCode}
                                    margin="dense"
                                // variant="outlined"
                                // disabled
                                />
                            </Grid>

                            <Grid item md={2} xs={12} style={{ marginTop: 15 }}>
                                <TextField
                                    // label="Promo Code Discount"
                                    fullWidth
                                    required
                                    type="numeric"
                                    margin="dense"
                                    value={promoCodeDiscount}
                                    placeholder="Promo Code Discount"
                                    variant="standard"
                                    disabled
                                />
                            </Grid>
                        </Grid>


                        {selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) &&
                            <Grid container spacing={3} style={{ marginTop: 10 }}>
                                <Grid item md={7} xs={12}>
                                    <Hidden>{() => { return null }}</Hidden>
                                </Grid>
                                <Grid item md={2} xs={12} style={{ position: 'relative' }}>
                                    <div>{selectedMobileData.wallet[0].type ? walletDiscountTypes.find(typeobj => typeobj.id == selectedMobileData.wallet[0].type).name : ''} :</div>
                                </Grid>

                                <Grid item md={2} xs={12}>
                                    <TextField
                                        // label="Wallet discount"
                                        fullWidth
                                        // onChange={}
                                        required
                                        type="numeric"
                                        value={selectedMobileData.wallet[0].amount}
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>
                        }

                        <Grid container spacing={3} style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid item md={7} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>
                            <Grid item md={2} xs={12} style={{ position: 'relative' }}>
                                <div>Special Discount :</div>
                            </Grid>

                            <Grid item md={2} xs={12}>
                                <TextField
                                    // label="Special Discount"
                                    fullWidth
                                    onChange={handleSpecialDiscountChange}
                                    required
                                    // type="number"
                                    value={specialDiscount}
                                    variant="standard"
                                />
                            </Grid>
                        </Grid>

                        <br />
                        <Divider />
                        <br />

                        <Grid container spacing={3}>
                            <Grid item md={7} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>
                            <Grid item md={2} xs={12} style={{ position: 'relative' }}>
                                <div style={{ textAlign: 'center', margin: 0, position: 'absolute', top: '50%', fontWeight: 600 }}>Total Bill :</div>
                            </Grid>

                            <Grid item md={2} xs={12}>
                                <TextField
                                    // label="Total Bill"
                                    fullWidth
                                    // onChange={handleChange}
                                    required
                                    type="numeric"
                                    value={totalBill}
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                        </Grid>


                        <Snackbar
                            open={openData.openWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Please complete above row(s) by selecting SKU(s), desired quantity and mobile!
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={openData.openMinOrderValueWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Order value cannot be less than 1000!
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={openData.openDiscountWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Discounts cannot be greater than the subtotal!
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
