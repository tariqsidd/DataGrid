const checked = (value, options) => {
  if (value !== true) {
    return options.message || 'must be checked';
  }
};
export const validateNumeric = (text) => {
  var re = /^(\d*\.?\d[^a-zA-Z]*)$/
 
    return (re.test(text))
}

export default {
  checked
};
