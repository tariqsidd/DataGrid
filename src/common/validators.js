const checked = (value, options) => {
  if (value !== true) {
    return options.message || 'must be checked';
  }
};
export const validateNumeric = (text) => {
  var re = /^(\d*\.?\d[^a-zA-Z]*)$/
 
    return (re.test(text))
}


export const validateInteger = (text) => {
  var re = / ^[0-9]*[1-9][0-9]*$/

  return (re.test(text))
}

export const validateEmail = text => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  ///^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (re.test(text))
}

export const validateNumericNoDecimal = (text) => {
  var re = /^\d{1,10}$/
  return (re.test(text))
}

export default {
  checked
};
