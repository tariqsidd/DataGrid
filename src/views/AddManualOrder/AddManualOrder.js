import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    // CardActionArea,
    // CardMedia,
    Divider,
    Grid,
    Button,
    TextField,
    // Checkbox,
    Icon
} from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
// import Paper from '@material-ui/core/Paper';
// import { withStyles } from '@material-ui/core/styles';
import { validateNumeric, validateNumericNoDecimal } from 'common/validators';
import MaterialTable from 'material-table';
import AlertModal from '../../components/Modal';
// import style from './style.css';
// import 'antd/dist/antd.css';

// const GreenCheckbox = withStyles({
//     root: {
//         color: 'orange',
//         '&$checked': {
//             color: 'orange',
//         },
//     },
//     checked: {},
// })((props) => <Checkbox color="default" {...props} />);

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

    const [futureDatesOfDelivery, setFutureDatesOfDelivery] = useState([]);
    const [selectedDeliveryDate, setSelectedDeliveryDate] = useState({});

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

    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    var [alertData, setAlertData] = useState({});

    const [openData, setOpenData] = useState({
        openSuccess: false,
        openError: false
    });
    const [params, setParams] = useState({
        dataFetchStatus: true,
        submitStatus: false,
        name: "",
    });

    const [state, setState] = React.useState([
        { title: 'SKU', field: 'name', editable: 'never' },
        { title: 'Qty', field: 'quantity', editable: 'never' },
        { title: 'Final Price', field: 'final_price', editable: 'never' },
        { title: 'Total', field: 'cost', editable: 'never' },
    ]);

    // useEffect(() => {
    //     console.log(orderItemRows[0].quantity, orderItemRows[0].final_price)
    // })

    useEffect(() => {
        let userprofile = JSON.parse(localStorage.getItem('sales-profile'))
        let cityId = userprofile.city_id;

        UserModel.getInstance().getFutureDatesOfDelivery(
            cityId,
            data => {
            //   console.log('GET future DOD', data)
              let futureDates = []
            //   let id = 0;
              data && data.length > 0 && Array.isArray(data) && data.forEach(date => {
                futureDates.push({ id: date, name: moment(date).format('dddd - Do MMM YYYY') })
                // id++;
              })
              setFutureDatesOfDelivery(futureDates)
            },
            err => {
              // console.log('err', err)
            }
          );
    }, [])

    useEffect(() => {
        let subtotal = 0;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows)
            && orderItemRows.forEach(item => {
                subtotal += item.cost
            })
        setSubtotal(subtotal)

        var bill = applyPromoReferralGMVDiscounts(subtotal)

        // var bill = subtotal;
        // if (specialDiscount) {
        //     bill = bill - specialDiscount
        // }
        // // console.log(bill)

        // // console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
        // if (promoCodeDiscount) {
        //     // console.log(bill - promoCodeDiscount)
        //     bill = bill - promoCodeDiscount
        // }
        // // console.log(bill)

        // if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
        //     console.log('wallet')
        //     bill = bill - selectedMobileData.wallet[0].amount
        // }
        // // console.log(bill)

        settotalBill(bill)
        // eslint-disable-next-line
    }, [specialDiscount, orderItemRows, promoCodeDiscount, selectedMobileData])

    const mobileHandleChange = async (event, val) => {
        // var arr = event.target.getAttribute('data-option-index');
        // console.log('mobile val', val);
        if (val) {
            setSelectedMobileData({
                mobile: val.mobile,
                name: val.name,
                id: val.id,
                // wallet: val.wallet // Wallet Discount needs to be enabled later
            });
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

    const deliveryDateChange = async (event, val) => {
        // var arr = event.target.getAttribute('data-option-index');
        // console.log('mobile val', val);
        if (val) {
            setSelectedDeliveryDate(val);
        }
    };

    // const handleChange = event => {
    //     setParams({
    //         ...params,
    //         [event.target.name]: event.target.value
    //     });
    // };

    const checkErrors = () => {
        // console.log("selectedMobData", selectedMobileData)
        var err = false;
        var warning = false;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(({ name, quantity, pre_slash_price, post_slash_price, min_price, final_price, cost }, index) => {
            // console.log(!name, !quantity, quantity <= 0, !final_price, !cost, !selectedSkuItems[index].id, !selectedSkuItems[index].name)
            if (
                !name || !quantity || quantity <= 0 || !final_price || !cost || !selectedSkuItems[index] || !selectedSkuItems[index].id || !selectedSkuItems[index].name
            ) {
                err = true;
            }
            // if (/*final_price > post_slash_price || */ final_price < min_price) {
            //     // setOpenData({ openFinalPriceNotWithinRangeWarning: true, openMinOrderValueWarning: false, openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMobileNotSelectedWarning: false, openDeliveryDateWarning: false })
            //     warning = true;
            // } 
        // const err = orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.some(({ name, quantity, pre_slash_price, post_slash_price, min_price, final_price, cost }, index) => {
        //     if (
        //         !name || !quantity || quantity <= 0 || !final_price || !cost || !selectedSkuItems[index].id || !selectedSkuItems[index].name
        //     ) {
        //         // console.log('A')
        //         return true;
        //     }
        //     if (/*final_price > post_slash_price || */ final_price < min_price) {
        //         setOpenData({ openFinalPriceNotWithinRangeWarning: true, openMinOrderValueWarning: false, openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMobileNotSelectedWarning: false, openDeliveryDateWarning: false })
        //         return true;
        //     } 
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
        // console.log(err, warning)
        if (err)
            return 'err';
        else if (warning)
            return 'warning';
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenData({ openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false });
    };

    const handleSubmit = async () => {
        // console.log(params.submitStatus)
        // if (!params.submitStatus) { //Commented this because it is being handles in render method
        const validationCheck = await checkErrors() // Hamza you need to redo you error handling. It doesn not work
        if (validationCheck === 'err') {
            // console.log('A')
            setOpenData({ openError: true, openSuccess: false, openWarning: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false });
        } 
        else if (validationCheck === 'warning') {
            // console.log('B')
            setOpenData({ openFinalPriceNotWithinRangeWarning: true, openError: false, openSuccess: false, openWarning: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openDeliveryDateWarning: false });
        }
        else if (!selectedMobileData || !selectedMobileData.id) {
            // console.log('C')
            setOpenData({ openMobileNotSelectedWarning: true, openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false })
        }
        else if (!selectedDeliveryDate || !selectedDeliveryDate.name) {
            // console.log('D')
            setOpenData({ openDeliveryDateWarning: true, openMobileNotSelectedWarning: false, openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openFinalPriceNotWithinRangeWarning: false })
        }
        else if (subTotal < 1000) {
            setOpenData({ openMinOrderValueWarning: true, openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false })
        }
        else if (
            (specialDiscount > subTotal) ||
            (specialDiscount + promoCodeDiscount > subTotal) ||
            (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) &&
                (specialDiscount + promoCodeDiscount + selectedMobileData.wallet[0].amount > subTotal))
        ) {
            setOpenData({ openDiscountWarning: true, openSuccess: false, openWarning: false, openError: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false })
        }
        else if (totalBill && Number(totalBill) && totalBill > 0) {
            setParams({ ...params, submitStatus: true });
            // let par = new FormData();
            let orderList = orderItemRows && orderItemRows.filter(x => x.quantity > 0).map((item, index) => ({
                sku_id: selectedSkuItems[index].id,
                price: item.final_price,
                qty: +item.quantity
            }))
            if (orderList.length > 0 && selectedMobileData && selectedMobileData.id) {
                // console.log("MAKING")
                var obj = {
                    user_id: selectedMobileData.id, // retailer ID
                    items: orderList,
                    delivered_at: selectedDeliveryDate.id
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
                        setOpenData({ openSuccess: true, openWarning: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false });
                        setTimeout(() => {
                            props.history.push('/manual-orders');
                        }, 1000);
                    },
                    err => {
                        setParams({ ...params, submitStatus: false });
                        console.log(err);
                        const all_conflicting_skus = err;
                        if (all_conflicting_skus && all_conflicting_skus.length > 0 && Array.isArray(all_conflicting_skus)) {
                            const oos_skus = all_conflicting_skus.filter(sku => !!sku.is_stock == true)
                            const limited_skus = all_conflicting_skus.filter(sku => sku.aoos_limit - sku.current_aoos_inv)

                            const skus = {
                                oos_skus,
                                limited_skus
                            }
                            if (skus && (skus.oos_skus || skus.limited_skus)) {
                                setAlertDialogOpen(true);
                                setAlertData(skus)
                            }
                        }
                    }
                );
            }
            else {
                setParams({ ...params, submitStatus: false });
                setOpenData({ openWarning: true, openSuccess: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false });
            }
            // }
        }
        else {
            alert('Kindly check all fields')
        }
    }


    const skuSearch = async (event, value, index) => {
        // console.log('skusearch', { event, value })
        // console.log({ event, value })
        if (value) {
            // console.log('YES')
            await setParams({ ...params, dataFetchStatus: false });
            await UserModel.getInstance().getSkuByName(
                { 'q': value },
                data => {
                    // console.log(data);
                    let itemsInStockArr = [];
                    data && data.length > 0 && Array.isArray(data) && data.forEach((item) => {
                        // console.log(item.is_stock, item.name)
                        if (!item.is_stock /*&& item.latest_balance && item.latest_balance.rate && item.latest_balance.rate > 0*/) {
                            if (item.is_deal) {
                                // console.log({ item })
                                var tempItem = { ...item, name: item.name + " - DEAL" }
                                itemsInStockArr.push(tempItem)
                            } else {
                                itemsInStockArr.push(item)
                            }
                        }
                    })
                    // console.log(itemsInStockArr)
                    // console.log(selectedSkuItems)
                    var newItemsOnly = [];
                    // checked len > than 1, so that there is atleast some item to check (if it already exist) otherwise gives error of cannot access property of undefined.
                    // cuz 1st index is already empty line genrated by default, acc to logic.
                    if (selectedSkuItems && selectedSkuItems.length > 0 && Array.isArray(selectedSkuItems)) { 
                        newItemsOnly = itemsInStockArr.filter(item => selectedSkuItems.every(selectedskus => selectedskus.id != item.id))
                    }
                    // console.log(newItemsOnly)
                    setSkuItems([...newItemsOnly]);
                    setParams({ ...params, dataFetchStatus: true });
                },
                err => {
                    // console.log(err);
                }
            );
        } else {
            // console.log('NO')
            let selectedSkus = selectedSkuItems
            selectedSkus[index] = {id: '', name: ''}
            setSelectedSkuItems([...selectedSkus])
        }
    };

    const handlePlusMinusFinalPrice = (e, index, sign) => {
        var myevent = e;
        const copyOrderItems = orderItemRows;
        var thisItem = copyOrderItems[index];
        if (sign === 'minus') {
            myevent.target.value = +thisItem.final_price - 1;
        } else if (sign === 'plus') {
            myevent.target.value = +thisItem.final_price + 1;
        }
        
        handleOrderItemDetailsChange(myevent, index)
    }

    const handleOrderItemDetailsChange = (e, index) => {
        // console.log('eeeeeeeee handleOrderItemChange', e.target.name)
        // console.clear()
        // console.log('handleOrderItemChange')
        // console.log(e.target.name, e.target.value, { index })
        // console.log(e.target.name, e.target.value)
        const orderItemsDetailArr = orderItemRows;
        // console.log(orderItemsDetailArr)
        var orderitem = orderItemsDetailArr[index];
        // console.log(orderitem)
        var valuue = e.target.value;
        if (e.target.name === 'quantity' && orderitem.available_qty && valuue > orderitem.available_qty) {
            alert(`Max available qty. for ${selectedSkuItems[index]?.name} is ${orderitem.available_qty}`);
            return;
        }
        if (e.target.name === 'quantity' || e.target.name === 'final_price') {
            // if (validateNumeric(parseInt(valuue)) || valuue === '') {
            if (valuue === '' || (validateNumeric(+valuue) && validateNumericNoDecimal(+valuue) && !valuue.includes('.') && ((e.target.name === 'quantity' && orderitem.available_qty && valuue <= orderitem.available_qty) || e.target.name === 'final_price'))) {
                // console.log('vladatenumeric')
                // console.log('vladatenumeric', valuue)
                orderitem[e.target.name] = valuue;
                orderitem.cost = orderitem.quantity * orderitem.final_price;
            }
        }

        orderitem = applyBulkDiscounts(orderitem)

        // console.log(orderitem)
        // if (e.target.name === 'quantity' || e.target.name === 'final_price') {
        //     if (valuue === '' || (validateNumeric(+valuue) && validateNumericNoDecimal(+valuue) && !valuue.includes('.'))) {
        //         orderitem.cost = orderitem.quantity * orderitem.final_price;
        //     }
        // }
        orderItemsDetailArr[index] = orderitem;
        // console.log(orderItemsDetailArr)
        setOrderItemRows(orderItemsDetailArr)
        let subtotal = 0;
        orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(item => {
            subtotal += item.cost
        })
        setSubtotal(subtotal)

        var bill = applyPromoReferralGMVDiscounts(subtotal)

        // var bill = subtotal;
        // if (specialDiscount) {
        //     bill = bill - specialDiscount
        // }
        // // console.log(bill)

        // // console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
        // if (promoCodeDiscount) {
        //     // console.log(bill - promoCodeDiscount)
        //     bill = bill - promoCodeDiscount
        // }
        // // console.log(bill)

        // if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
        //     console.log('wallet')
        //     bill = bill - selectedMobileData.wallet[0].amount
        // }
        // // console.log(bill)

        settotalBill(bill)
        setImpCondition(!impCondition)  // ask before removing
    }

    const applyBulkDiscounts = (order_ITEM) => {
        var disc_Threshold_Found = false;
        if (order_ITEM && order_ITEM.qty_discount && order_ITEM.qty_discount.length > 0 && Array.isArray(order_ITEM.qty_discount)) {
            order_ITEM.qty_discount.forEach((dis_Obj, idx) => {
                // console.log('disObj',idx)
                // console.log('each iter')
                if (idx == order_ITEM.qty_discount.length - 1 && order_ITEM.quantity >= dis_Obj.lower) {
                    // console.log('A')
                    order_ITEM.final_price = (order_ITEM.post_slash_price - dis_Obj.value);
                    disc_Threshold_Found = true;
                    return;
                }
                if (order_ITEM.quantity >= dis_Obj.lower && order_ITEM.quantity <= dis_Obj.upper) {
                    // console.log('B')
                    // console.log('order post slash', order_ITEM.post_slash_price, dis_Obj.value)
                    order_ITEM.final_price = (order_ITEM.post_slash_price - dis_Obj.value);
                    disc_Threshold_Found = true;
                    return;
                }
            })

            if (!disc_Threshold_Found) {
                order_ITEM.final_price = order_ITEM.post_slash_price;
            }
        }
        return order_ITEM;
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

            // console.log(val.latest_balance ? val.latest_balance.rate : val.post_slash_price)
            // if (val.latest_balance)
            //     console.log('balrate', val.latest_balance.rate)
            // else console.log('postslash', val.post_slash_price)

            orderitem.name = val.name;
            orderitem.available_qty = (typeof(val.available_qty) == 'null' || typeof(val.available_qty) == 'undefined') ? 99999999 : val.available_qty;
            // orderitem.quantity = val.quantity;
            // orderitem.price = val.price;
            orderitem.pre_slash_price = val.price + val.discount;
            orderitem.post_slash_price = val.price;
            // console.log(val.latest_balance);
            orderitem.min_price = val.latest_balance ? val.latest_balance.rate : (val.price); // if VIC calculated rate is not available, display post slash as min value (maximum possible discounted value).
            orderitem.final_price = val.price;
            // orderitem.qty_discount = val.qty_discount; // Bulk Discount to be enabled later
            orderitem.cost = orderitem.quantity > 1 ? (orderitem.quantity * val.price) : (orderitem.quantity === 0 ? 0 : '')

            orderitem = applyBulkDiscounts(orderitem)
            orderItemsDetailArr[index] = orderitem;
            setOrderItemRows(orderItemsDetailArr)

            let subtotal = 0;
            orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.forEach(item => {
                subtotal += item.cost
            })
            setSubtotal(subtotal)

            var bill = applyPromoReferralGMVDiscounts(subtotal)

            // var bill = subtotal;
            // if (specialDiscount) {
            //     bill = bill - specialDiscount
            // }
            // // console.log(bill)

            // console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
            // if (promoCodeDiscount) {
            //     // console.log(bill - promoCodeDiscount)
            //     bill = bill - promoCodeDiscount
            // }
            // // console.log(bill)

            // if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
            //     console.log('wallet')
            //     bill = bill - selectedMobileData.wallet[0].amount
            // }
            // console.log(bill)

            settotalBill(bill)
            setImpCondition(!impCondition)  // ask before removing
        } else {
            const skuItemsDetailArr = selectedSkuItems;
            delete skuItemsDetailArr[index]
            // console.log(skuItemsDetailArr)
            setSelectedSkuItems(skuItemsDetailArr);

            const orderItemsDetailArr = orderItemRows;
            var orderitem = orderItemsDetailArr[index];

            orderitem.name = '';
            orderitem.quantity = '';
            // orderitem.price = '';
            orderitem.pre_slash_price = '';
            orderitem.post_slash_price = '';
            orderitem.min_price = '';
            orderitem.final_price = '';
            orderitem.qty_discount = '';
            orderitem.cost = '';

            setOrderItemRows(orderItemsDetailArr)

            let subtotal = 0;
            orderItemsDetailArr && orderItemsDetailArr.length > 0 && Array.isArray(orderItemsDetailArr) && orderItemsDetailArr.forEach(item => {
                subtotal += item.cost
            })
            setSubtotal(subtotal)

            var bill = applyPromoReferralGMVDiscounts(subtotal)
            // var bill = subtotal;
            // if (specialDiscount) {
            //     bill = bill - specialDiscount
            // }
            // // console.log(bill)

            // // console.log(specialDiscount, promoCodeDiscount, selectedMobileData.wallet)
            // if (promoCodeDiscount) {
            //     // console.log(bill - promoCodeDiscount)
            //     bill = bill - promoCodeDiscount
            // }
            // // console.log(bill)

            // if (selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) && selectedMobileData.wallet[0] && selectedMobileData.wallet[0].amount) {
            //     console.log('wallet')
            //     bill = bill - selectedMobileData.wallet[0].amount
            // }
            // // console.log(bill)

            settotalBill(bill)
            setImpCondition(!impCondition)  // ask before removing
        }
        setSkuItems([]) // important to empty it, so that list doesnot repeat the already added sku.
    };

    const applyPromoReferralGMVDiscounts = (subtotal) => {
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
            // console.log('wallet')
            bill = bill - selectedMobileData.wallet[0].amount
        }
        // console.log(bill)
        return bill;
    }

    const addNewOrderItemRow = async () => {
        // console.log('add new order row')
        // let rowFilled = false;
        const validationCheck = await checkErrors() // Hamza you need to redo you error handling. It doesn not work
        if (validationCheck === 'err') {
            setOpenData({ openError: true, openSuccess: false, openWarning: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false });
        } 
        else if (validationCheck === 'warning') {
            setOpenData({ openFinalPriceNotWithinRangeWarning: true, openError: false, openSuccess: false, openWarning: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openDeliveryDateWarning: false });
        }
        else if (!selectedMobileData || !selectedMobileData.id) {
            setOpenData({ openMobileNotSelectedWarning: true, openSuccess: false, openWarning: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openFinalPriceNotWithinRangeWarning: false, openDeliveryDateWarning: false })
        }
        // const err = orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) && orderItemRows.some(({ name, quantity, pre_slash_price, post_slash_price, min_price, final_price, cost }, index) => {
        //     // console.log(val)
        //     console.log(
        //         !name, !quantity, quantity <= 0, !final_price, final_price > post_slash_price, final_price >= min_price, !cost, !selectedSkuItems[index].id, !selectedSkuItems[index].name
        //     )

        //     if (
        //         !name || !quantity || quantity <= 0 || !final_price || !cost || !selectedSkuItems[index].id || !selectedSkuItems[index].name
        //     ) {
        //         return true;
        //     } 
        //     else if (final_price > post_slash_price || final_price < min_price) {
        //         setOpenData({ openFinalPriceNotWithinRangeWarning: true, openWarning: false, openSuccess: false, openError: false, openDiscountWarning: false, openMinOrderValueWarning: false, openMobileNotSelectedWarning: false, openDeliveryDateWarning: false });
        //         warning = true;
        //     }

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


        // })

        // console.log(validationCheck)

        else {
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
            setOrderItemRows([...orderItemRows, newOrderItem])
            setSelectedSkuItems([...selectedSkuItems, newSku])
        }
        setImpCondition(!impCondition)  // ask before removing
    }

    const removeOrderItem = (index) => {
        if (orderItemRows.length > 1) {
            let orderItemsDetailArr = [...orderItemRows];
            // console.log(orderItemRows)
            orderItemsDetailArr.splice(index, 1)
            // console.log(orderItemsDetailArr)
            setOrderItemRows([...orderItemsDetailArr])
            let skuSelectedDetailsArr = [...selectedSkuItems];
            // console.log(selectedSkuItems)
            skuSelectedDetailsArr.splice(index, 1)
            // console.log(skuSelectedDetailsArr)
            setSelectedSkuItems([...skuSelectedDetailsArr])
            setImpCondition(!impCondition)  // ask before removing
        }
    }

    const handleSpecialDiscountChange = event => {
        var spDiscount = event.target.value;
        // console.log(typeof(spDiscount))
        // console.log(spDiscount)
        // console.log(validateNumeric(spDiscount))
        // console.log(validateNumeric('8+4_23%#^&^'))
        // // console.log(validateNumeric(spDiscount), spDiscount !== 0, spDiscount !== '0', !spDiscount.includes('+'), !spDiscount.includes('-'))
        // // console.log(spDiscount == '', validateNumeric(spDiscount))
        // console.log(spDiscount == '', validateNumeric(spDiscount), spDiscount !== 0, spDiscount !== '0', !spDiscount.includes('+'), !spDiscount.includes('-'))
        // if (spDiscount == '' || (validateNumeric(spDiscount) && spDiscount !== 0 && spDiscount !== '0' && !spDiscount.includes('+') && !spDiscount.includes('-'))) {
        //     console.log(spDiscount)
        //     setspecialDiscount(spDiscount);
        // } 
        // else {
        //     // alert('helo')
        //     setspecialDiscount(specialDiscount);
        // }

        // console.log(validateNumeric(spDiscount))
        // console.log(validateInteger(+spDiscount))
        // console.log(validateNumericNoDecimal(+spDiscount))
        if (spDiscount === '' || (validateNumeric(+spDiscount) && validateNumericNoDecimal(+spDiscount) && !spDiscount.includes('.'))) {
            // console.log(spDiscount, +spDiscount)
            setspecialDiscount(spDiscount);
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

    const removeOOSitems = async oos_items => {
        // console.log(orderItemRows)
        // console.log(selectedSkuItems)
        let orderItemsDetailArr = [...orderItemRows];
        let skuSelectedDetailsArr = [...selectedSkuItems];
        // console.log(orderItemsDetailArr)
        // console.log(skuSelectedDetailsArr)
        oos_items.forEach(sku => {
            const index = skuSelectedDetailsArr.findIndex(item => item.id === sku.id)
            // console.log(index)
            if (index >= 0) {
                orderItemsDetailArr.splice(index, 1)
                skuSelectedDetailsArr.splice(index, 1)
            }
        })
        if (orderItemsDetailArr.length == 0 || skuSelectedDetailsArr.length == 0) {
            skuSelectedDetailsArr = [{ id: null, name: '' }]
            orderItemsDetailArr = [{ name: '', quantity: '', pre_slash_price: '', post_slash_price: '', min_price: '', final_price: '', cost: '', qty_discount: [] }]
        }

        setOrderItemRows([...orderItemsDetailArr])
        setSelectedSkuItems([...skuSelectedDetailsArr])
        setImpCondition(!impCondition)  // ask before removing
    }

    const reduceQtyOfLimiteditems = async limited_items => {
        // console.log(orderItemRows)
        let skuSelectedDetailsArr = [...selectedSkuItems];
        // let orderItemsDetailArr = [...orderItemRows];
        // console.log(orderItemsDetailArr)
        limited_items.forEach(sku => {
            const index = skuSelectedDetailsArr.findIndex(item => item.id === sku.id) // checking from sku state and not items array cuz sku id is stored only in order details state array.. took 3 hrs to debug the issue
            // console.log(index)
            if (index >= 0) {
                var e = {
                    target: {
                        name: 'quantity',
                        value: (sku.aoos_limit - sku.current_aoos_inv).toString()
                    }
                }
                // console.log(e)
                handleOrderItemDetailsChange(e, index)
            }
        })
    }

    const handleOrderChangeForOOSOrReducedQty = async (oos_items, limited_items) => {
        limited_items && limited_items && limited_items && await reduceQtyOfLimiteditems(limited_items);
        oos_items && oos_items && oos_items && await removeOOSitems(oos_items);
        setTimeout(() => {
            setAlertDialogOpen(false);
        }, 500)
    }


    const generateOrderItemsRows = (values, index) => {
        // console.log({ orderItemRows, selectedSkuItems })
        // console.log({ values })
        // console.log('dropdown SKU item', index, selectedSkuItems[index])
        let thisSku = selectedSkuItems[index]  // {id: 1, name: 'Prince biscuit'} new sahi
        return (
            <>
                <Grid container spacing={1} style={{ marginTop: 20 }}>

                    <Grid item md={4} xs={12}>
                        <Autocomplete
                            options={skuItems}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                                <TextField {...params} label="SKU" variant="outlined" 
                                    // margin="dense" 
                                    placeholder='Search SKU' />
                            )}
                            value={selectedSkuItems[index] ? selectedSkuItems[index] : {id: null, name: ''}}
                            onChange={(e, val) => orderItemHandleChange(e, val, index)}
                            onInputChange={(e, val) => skuSearch(e, val, index)}
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
                            inputProps={{ min: 1, max: values.available_qty }}
                            min={1}
                            max={values.available_qty}
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

                        <button 
                            type="button" 
                            name='final_price' 
                            onClick={(e) => handlePlusMinusFinalPrice(e, index, 'minus')} 
                            // value="-" 
                            disabled={!values.final_price || values.final_price <= values.min_price} 
                            data-field="final_price" 
                            style={{backgroundColor: '#DCDCDC', borderRadius: 3, padding: 6}}
                        >-</button>
                        <TextField
                            style={{ marginLeft: 5, marginRight: 5 }}
                            fullWidth
                            label="Final Price"
                            name="final_price"
                            type='text'
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
                        <button 
                            type="button" 
                            name='final_price' 
                            onClick={(e) => handlePlusMinusFinalPrice(e, index, 'plus')} 
                            // value="+" 
                            disabled={!values.final_price /* || values.final_price >= values.post_slash_price */} 
                            data-field="final_price" 
                            style={{backgroundColor: '#DCDCDC', borderRadius: 3, padding: 5}}
                        >+</button>

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

                        {/* These consitions were a backup plan if autocomplete didnt work, then tried to show remove button only on last index */}
                        {/* {selectedSkuItems && selectedSkuItems.length > 0 && Array.isArray(selectedSkuItems) && index+1 == selectedSkuItems.length 
                        ? */}
                            <Icon color="primary" style={{ fontSize: 40, marginLeft: 5, marginRight: 5 }} onClick={() => removeOrderItem(index)}>cancel</Icon>
                        {/* :
                            <span style={{margin: 23}}></span>
                        } */}
                    </Grid>

                </Grid>

                {/* Bulk Discount logic to be enabled later */}

                {/* <Grid container spacing={1}>
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
                </Grid> */}
            </>
        )
    }


    return (
        <div className={classes.root}>

            <AlertModal
                open={alertDialogOpen}
                close={() => setAlertDialogOpen(false)}
                data={alertData}
                // removeOOSitems={removeOOSitems}
                // reduceQtyOfLimiteditems={reduceQtyOfLimiteditems}
                handleOrderChangeForOOSOrReducedQty={(oos_skus, limited_skus) => handleOrderChangeForOOSOrReducedQty(oos_skus, limited_skus)}
            />

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

                            <Grid item md={6} xs={12}>
                                <Autocomplete
                                    id="future_DoD"
                                    options={futureDatesOfDelivery}
                                    getOptionLabel={option => option.name}
                                    renderInput={params => (
                                        <TextField {...params} label="Delivery Date" variant="outlined" required margin="dense" placeholder='Select delivery date' />
                                    )}
                                    value={selectedDeliveryDate}
                                    onChange={deliveryDateChange}
                                    // onInputChange={mobileSearch}
                                    loading
                                    loadingText={
                                        params.dataFetchStatus ? 'Loading' : 'No Matches'
                                    }
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <br />

                        {
                            <div id="orderSkuItems">
                                <h4 style={{ color: '#606060' }}>Order Items</h4>
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
                        <br />
                        <br />
                        <br />

                        {orderItemRows && orderItemRows.length > 0 && Array.isArray(orderItemRows) &&
                            <MaterialTable
                                title={<b style={{ fontSize: 16 }}>Final Bill Table</b>}
                                columns={state}
                                options={{
                                    filtering: false,
                                    paging: false,
                                    search: false
                                }}
                                data={orderItemRows}
                                className={clsx(classes.root, className)}
                            >
                            </MaterialTable>
                        }


                        <Grid container spacing={3} style={{ paddingTop: 20 }}>
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

                        {/* <br />
                        <Divider />
                        <br /> */}

                        {/* Promo Code need to be enabled later */}

                        {/* <Grid container spacing={3}>
                            <Grid item md={7} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>

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
                        </Grid> */}


                        {/* Wallet discount (Refferal/GMV) need to be enabled later */}

                        {/* {selectedMobileData && selectedMobileData.wallet && selectedMobileData.wallet.length > 0 && Array.isArray(selectedMobileData.wallet) &&
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
                        } */}

                        <Grid container spacing={3} style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid item md={7} xs={12}>
                                <Hidden>{() => { return null }}</Hidden>
                            </Grid>
                            <Grid item md={2} xs={12} style={{ position: 'relative', paddingTop: 18 }}>
                                <div>Special Discount :</div>
                            </Grid>

                            <Grid item md={2} xs={12}>
                                <TextField
                                    // label="Special Discount"
                                    fullWidth
                                    onChange={handleSpecialDiscountChange}
                                    required
                                    type="text"
                                    value={specialDiscount}
                                    variant="standard"
                                />
                            </Grid>
                        </Grid>

                        {/* <br />
                        <Divider />
                        <br /> */}

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
                            open={openData.openDeliveryDateWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Please select a delivery date for this order!
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={openData.openMobileNotSelectedWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Please select retailer's mobile number!
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={openData.openFinalPriceNotWithinRangeWarning}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Final price should be within Min. price and Post-slash price range!
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
                                Error when making changes. Ensure all order item fields are filled.
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
