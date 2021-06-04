const local  = {
  baseURL     :'http://localhost:8000/sales/'
}

const dev = {
  baseURL     :'https://api-dev.dastgyr.com/sales/'
};

const qa = {
  baseURL     :'https://api-qa.dastgyr.com/sales/'
};

const staging = {
  baseURL     :'https://api-staging.dastgyr.com/sales/'
};

const prod = {
  baseURL     :'https://api.dastgyr.com/sales/'
};

var config = local;

switch (process.env.REACT_APP_STAGE) {
  case 'local':
      config = local
      break;
  case 'dev':
      config = dev
      break;
  case 'qa':
      config = qa
      break;
  case 'staging':
      config = staging
      break;
  case 'prod':
      config = prod
}

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};