import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { validateNumeric } from '../../common/validators';
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
    FormControlLabel
} from '@material-ui/core';
import { Upload } from 'antd';
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
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddCategory = props => {
    const classes = useStyles();
    const { className, ...rest } = props;
    var [prodData, setProdData] = useState([]);
    var [supplierData, setSupplierData] = useState([]);
    var [selectedSupplier, setSelectedSupplier] = useState('');
    var [selectedProd, setSelectedProd] = useState({});
    var [images, setImages] = useState(null);
    var [imagesFile, setImagesFile] = useState(null);
    const [isExist,setIsExist]= useState(true);
    const [openData, setOpenData] = useState({
        openSuccess: false,
        openError: false
    });
    const [is_active, setIsActive] = useState(false);
    // var [searchedProd, setSearchedProd] = useState('');
    const [fileList, setFileList] = useState([]);
    const [catexist,setCatexist] = useState({
        name:'',
        code:'',
    });
    const [params, setParams] = useState({
        dataFetchStatus: true,
        submitStatus: false,
        code: "",
        image: "",
        is_active: false,
        name: ""
    });

    const handleIsActive = (event) => {
        console.log('check', event.target.checked)
        setIsActive(event.target.checked);
    };

    const handleChange = async event => {

        if (!validateNumeric(event.target.value) && event.target.name == 'price') {
            await setParams({
                ...params,
                [event.target.name]: {}
            });
        } else {
            console.log('else')
            setParams({
                ...params,
                [event.target.name]: event.target.value
            });
            let fieldName = event.target.name;
            if(event.target.value.length>=3){
                UserModel.getInstance().catExist(
                    {
                        field:event.target.name,
                        text:event.target.value
                    },
                    succ => {
                    if(!succ.exist){
                        console.log('if')
                        setCatexist({
                            ...catexist,
                            [fieldName]:`Category ${fieldName} available`
                        });
                        setIsExist(true);
                    }
                    else{
                        console.log('else')
                        setCatexist({
                            ...catexist,
                            [fieldName]:`Category ${fieldName} already exist!`
                        });
                        setIsExist(false);
                    }
                    console.log('success status',succ)
                    },
                    err => {
                        console.log(err)
                    }
                );
            }
        }
    };

    const isExistCheck = () => {
       if(isExist){
           return true;
       }
       else{
           alert('item already exist')
           return false;
       }
    }

    const checkErrors = () => {
        if (
            params.name === '' ||
            params.code === ''
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenData({ openSuccess: false, openError: false });
    };

    const allowedCharacters = () => {

        if(params.name.length < 3 || params.code.length != 3){
            alert('Plz Enter exactly 3 characters for category name and code') 
            return false
        }
        else {
            return true;
        }

    }


    const handleSubmit = () => {
        console.log({params})
        if (!params.submitStatus) {
            const errors = checkErrors();
            if (errors) {
                setOpenData({ ...openData, openError: true });
            } else {
                if(allowedCharacters()){
                    if(isExistCheck()){
                        setParams({ ...params, submitStatus: true });
                        let par = new FormData();
                        if (imagesFile) {
                            par.append('image', imagesFile);
                            UserModel.getInstance().uploadImage(
                                par,
                                succ => {
                                    console.log('secc', succ);
                                    var obj = {
                                        name: params.name,
                                        code: params.code,
                                        is_active: 0,
                                        is_active: is_active,
                                        image: succ.file.location
                                    };
                                    console.log('obj', obj);
                                    console.log(succ.file.location)
                                    UserModel.getInstance().addCategory(
                                        obj,
                                        succ => {
                                            console.log(succ);
                                            setOpenData({ ...openData, openSuccess: true });
                                            setTimeout(() => {
                                                props.history.push('/categories');
                                            }, 1000);
                                        },
                                        err => {
                                            setParams({ ...params, submitStatus: false });
                                            console.log(err);
                                        }
                                    );
                                    console.log(obj);
                                },
                                err => {
                                    console.log(err);
                                    setParams({ ...params, submitStatus: false });
                                }
                            );
                        } else {
                            var obj = {
                                name: params.name,
                                code: params.code,
                                is_active: 0,
                                image: params.image,
                                is_active: is_active
                            };
                            UserModel.getInstance().addCategory(
                                obj,
                                succ => {
                                    setOpenData({ ...openData, openSuccess: true });
                                    console.log(succ);
                                    setTimeout(() => {
                                        props.history.push('/categories');
                                    }, 1000);
                                },
                                err => {
                                    setParams({ ...params, submitStatus: false });
                                    console.log(obj);
                                }
                            );
                            console.log(obj);
                        }
                    }
                   
                }
                
            }
        }
    };

    const deleteImage = async () => {
        await setImages(null);
        await setImagesFile(null);
    };

    const handleImage = async event => {
        console.log('event image', event.target.files[0]);
        if (event) {
            let img = new Image();
            let flag = false;
            img.fil = event.target.files[0];
            img.src = URL.createObjectURL(event.target.files[0]);
            img.onload = () => {
                if (img.width <= 500 && img.height <= 500) {
                    setImagesFile(img.fil);
                    console.log('img src', img.src);
                    setImages(img.src);
                } else {
                    alert('Max size allowed 500x500');
                }
            };
            event.target.value = null;
        }
    };

    return (
        <div className={classes.root}>
            <Card {...rest} className={clsx(classes.root, className)}>
                <form autoComplete="off" noValidate>
                    <CardHeader title="Add Category" />
                    <Divider />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    helperText={catexist.name}
                                    label="Category name"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={params.name}
                                    variant="outlined"
                                    placeholder="Enter Category name"
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    helperText={catexist.code}
                                    label="Category Code"
                                    // margin="dense"
                                    name="code"
                                    // type="number"
                                    inputProps={{ min: 0 }}
                                    min={0}
                                    onChange={handleChange}
                                    required
                                    margin='dense'
                                    value={params.price}
                                    variant="outlined"
                                    placeholder="Enter Category code"
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <FormControlLabel
                                    control={<GreenCheckbox checked={is_active} onChange={handleIsActive} name="is_active" />}
                                    label="Is Active"
                                    color="red"
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleImage}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}>
                                        Upload Image
                                    </Button>
                                </label>

                                {images ? (
                                    <Card className={classes.cardroot}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={images}
                                                title="image"
                                            />
                                        </CardActionArea>
                                        <CardActions>
                                            <Button
                                                size="small"
                                                color="secondary"
                                                onClick={deleteImage}>
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ) : null}
                            </Grid>
                        </Grid>
                        <Snackbar
                            open={openData.openSuccess}
                            autoHideDuration={6000}
                            onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                                Category successfully added
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
                            Add Category
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default AddCategory;
