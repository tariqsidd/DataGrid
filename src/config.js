const local  = {
  baseURL     :'http://localhost:4000/sales/'
}

const dev = {
  baseURL     :'https://api-dev.dastgyr.com/sales/'
};

const qa = {
  baseURL     :'https://api-qa4.dastgyr.com/sales/'
};

const qa2 = {
  baseURL     :'https://api-qa2.dastgyr.com/sales/',
  aclBaseUrl: 'https://qa2-acl.dastgyr.com/sales'
};


const staging = {
  baseURL     :'https://api-staging.dastgyr.com/sales/',
  aclBaseUrl: 'https://api-staging-acl.dastgyr.com/sales'
};

const prod = {
  baseURL     :'https://api.dastgyr.com/sales/',
  aclBaseUrl: 'https://acl.dastgyr.com/sales'
};

var config = staging;

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
  case 'qa2':
      config = qa2
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
