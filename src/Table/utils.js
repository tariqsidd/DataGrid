export const addParamsToUrl = (obj) => {
  console.log('obj',obj)
  const queryString = Object.entries(obj).reduce((acc, [key, value], index) => {
    if (value !== '' && value !== null) {
      acc.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
    return acc;
  }, []).join('&');

  return queryString ? `?${queryString}` : '';
};
