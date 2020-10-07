import React, { useState, useEffect, Component } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  CardContent,
  colors
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import UserModel from '../../models/UserModel';

// export default class SignIn extends Component {

//   onClick(e) {
//     UserModel.getInstance().Login('admin@example.com','112112112', (data) => {
//       console.log('data',data)
//     }, (err) => {console.log('err', err)})
//   }

//   render() {
//     return(
//       <div>
//         <Button onClick={this.onClick}>SIGN IN</Button>
//       </div>
//     )
//   }

// }

const schema = {
  mobile: {
    presence: { allowEmpty: false, message: 'is required' },
    // email: true,
    length: {
      maximum: 13
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};
const inputProps = {
  step: 300,
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0),
    backgroundColor: colors.deepOrange[500]
    //   "&:hover": {
    //     //you want this to be the same as the backgroundColor above
    //     backgroundColor: "#FFF"
    // }
  }
}));

const SignIn = props => {
  const { history } = props;

  const classes = useStyles();
  const [invalidCredentials] = useState({ boolean: false });
  var [invalidAuthText] = useState('');

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleBack = () => {
    history.goBack();
  };

  const handleChange = event => {
    console.log(event.target.value);
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();
    console.log(formState.values);
    UserModel.getInstance().Login(
      formState.values.mobile,
      formState.values.password,
      data => {
        console.log(data);
        history.push('/dashboard');
      },
      err => {
        console.log(err);
        invalidCredentials.boolean = true;
        invalidAuthText = 'Incorrect credentials';
        alert(invalidAuthText);
      }
    );
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              {/* <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton> */}
            </div>
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={handleSignIn}>
                <Typography className={classes.title} variant="h2">
                  Sign in
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('mobile')}
                  fullWidth
                  helperText={
                    hasError('mobile') ? formState.errors.mobile[0] : null
                  }
                  label="Mobile number"
                  name="mobile"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.mobile || ''}
                  variant="outlined"
                  color="secondary"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                  color="secondary"
                />
  
                <Button
                  className={classes.signInButton}
                  // color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained">
                  Sign in 
                </Button>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
