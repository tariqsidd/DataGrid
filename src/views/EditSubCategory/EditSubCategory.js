import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserModel from 'models/UserModel';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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
    FormControlLabel,
    MenuItem
} from '@material-ui/core';
// import { isObject } from 'validate.js';
// import { validateNumeric } from '../../common/validators'
import { withStyles } from '@material-ui/core/styles';

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

const EditSubCategory = props => {
    var [categoryData, setCategoryData] = useState([]);
    var [selectedCategory, setSelectedCategory] = useState({});
    var [subcategoryId, setSubCategoryId] = useState();
    const [is_active, setIsActive] = useState(true);
    const [openData, setOpenData] = useState({
        openSuccess: false,
        openError: false
    });
    const [params, setParams] = useState({
        name: '',
        code: '',
        image: '',
        dataFetchStatus: false,
    });
    var [imagesFile, setImagesFile] = useState(null);
    var [images, setImages] = useState(null);
    // const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('************** props params', props.match.params.id);
        const id = props.match.params.id;
        setSubCategoryId(id);
        UserModel.getInstance().getCategoryDetail(
            id,
            data => {
                console.log('Subcategory details', data);
                setParams({
                    ...params,
                    name: data.name,
                    image: data.image,
                    code: data.code,
                });
                setSelectedCategory({
                    name: data.cat_name,
                    id: data.parent_id
                })

                setIsActive(data.is_active);
                setImages(data.image);
                // console.log(data.cat_name,data.parent_id)
            },
            err => {
                console.log('Subcategory err', err);
            }
        );
        // GET ALL SUBCATEGORIES
        UserModel.getInstance().getCategory(
            null,
            data => {
                console.log({ data });
                let tempArray = [];
                data.forEach(obj => {
                    if (obj.name !== null) {
                        tempArray.push({
                            name: obj.name,
                            id: obj.id
                        });
                    }
                });
                setCategoryData(tempArray);
            },
            err => {
                console.log(err);
            }
        );

    }, []);

    useEffect(() => {
        console.log({selectedCategory, categoryData})
    })

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenData({ openSuccess: false, openError: false });
    };

    const classes = useStyles();
    const { className, ...rest } = props;

    const handleChange = event => {
        // console.log('validate', validateNumeric(event.target.value))
        // console.log('length', event.target.value.length)
        console.log('name', event.target.name)

        setParams({
            ...params,
            [event.target.name]: event.target.value
        });

    };

    const handleIsActive = (event) => {
        console.log()
        console.log('check', event.target.checked)
        setIsActive(event.target.checked);

    };


    const handleSubmit = async () => {
        console.log(
            categoryData,
            selectedCategory,
            subcategoryId,
            params
        )
        const errors = checkForBlanks();
        console.log('errors', errors);
        if (errors) {
            // alert('Fill all required fields');
            setOpenData({ ...openData, openError: true });
        } else {
            let par = new FormData();
            if (imagesFile) {
                console.log('images file');
                par.append('image', imagesFile);
                console.log('imag file', imagesFile);
                console.log('paramas', par);
                await UserModel.getInstance().uploadImage(
                    par,
                    succ => {
                        console.log('secc', succ);
                        var obj = {
                            name: params.name,
                            code: params.code,
                            image: succ.file.location,
                            is_active: is_active,
                            parent_id: selectedCategory.id
                        };
                        // console.log('subcat id', subcategoryId);
                        UserModel.getInstance().updateCategory(
                            // subcategoryId,
                            obj,
                            succ => {
                                setOpenData({ ...openData, openSuccess: true });
                                console.log(succ);
                                console.log('props save', props);

                                setTimeout(() => {
                                    props.history.push('/subcategories');
                                }, 1000);
                            },
                            err => {
                                console.log(err);
                            }
                        );

                        console.log('edit obj', obj);
                    },
                    err => {
                        console.log(err);
                    }
                );
            } else {
                var obj = {
                    name: params.name,
                    code: params.code,
                    image: images,
                    is_active: is_active,
                    parent_id: selectedCategory.id
                };
                await UserModel.getInstance().updateCategory(
                    subcategoryId,
                    obj,
                    succ => {
                        setOpenData({ ...openData, openSuccess: true });
                        console.log(succ);
                        console.log('props save', props);

                        setTimeout(() => {
                            props.history.push('/subcategories');
                        }, 1000);
                    },
                    err => {
                        console.log(err);
                    }
                );
                console.log('ooobj', obj);
            }
        }
    };

    const categoryHandleChange = async (event, val) => {
        console.log({ event, val })
        var arr = event.target.id.split('-')[2];
        await setParams({ ...params, dataFetchStatus: true });
        if (val) {
            await setSelectedCategory({ id: val.id, name: val.name });
            await setParams({ ...params, dataFetchStatus: false });
        }
    };

    const checkForBlanks = () => {
        if (
            params.name === '' ||
            params.code === ''
        ) {
            return true;
        } else {
            return false;
        }
    };

    const deleteImage = async () => {
        await setImages(null);
        await setImagesFile(null);
    };

    const handleImage = async event => {
        console.log('event image', event);
        if (event) {
            let img = new Image();
            let flag = false;
            img.fil = event.target.files[0];
            img.src = URL.createObjectURL(event.target.files[0]);
            img.onload = () => {
                if (img.width <= 500 && img.height <= 500) {
                    setImagesFile(img.fil);

                    setImages(img.src);
                } else {
                    alert('Max size allowed 500x500');
                }
            };
            event.target.value = null;
        }
    };

    const handleCloser = (event) => {
        console.log('close')
        // setSelectedProd('')
    }


    return (
        <div className={classes.root}>
            <Card {...rest} className={clsx(classes.root, className)}>
                <form autoComplete="off" noValidate>
                    <CardHeader title="Change Subcategory" />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    // helperText="Specify Subcategory name"
                                    label="Subcategory name"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={params.name}
                                    variant="outlined"
                                    placeholder="Enter Subcategory name"
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    helperText="Specify Subcategory code"
                                    label="Subcategory Code"
                                    margin="dense"
                                    name="code"
                                    onChange={handleChange}
                                    required
                                    value={params.code}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <Autocomplete
                                    // id="category"
                                    options={categoryData}
                                    value={selectedCategory}
                                    getOptionLabel={option => option.name}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Category name"
                                            variant="outlined"
                                            margin="dense"
                                            placeholder="Change Category name for subcategory"
                                        />
                                    )}
                                    onChange={categoryHandleChange}
                                />
                            </Grid>

                            {/* <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    // name="vehicleId"
                                    value={params.selectedCategory}
                                    onChange={categoryHandleChange}
                                    label="Category name"
                                    variant="outlined"
                                    margin="dense"
                                    placeholder="Change Category name for subcategory"
                                >
                                    {categoryData.map((option) => (
                                        <MenuItem key={option.value} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid> */}




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
                                        {images ? (
                                            <span>Update Image</span>
                                        ) : (
                                                <span>Upload Image</span>
                                            )}
                                    </Button>
                                </label>

                                {images ? (
                                    <Card className={classes.cardroot}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                alt={params.name}
                                                height="140"
                                                image={images}
                                                title={params.name}
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
                            <Snackbar
                                open={openData.openSuccess}
                                autoHideDuration={6000}
                                onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success">
                                    Subcategory successfully updated
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
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button color="primary" variant="contained" onClick={handleSubmit}>
                            Make changes
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default EditSubCategory;
