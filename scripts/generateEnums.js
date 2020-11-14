const fs = require('fs');
const request = require('request-promise');

const DOMAIN = `http://${process.env.REACT_APP_LOCAL_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;

const ENUMS_PATH = '/constants/enums';

const WARNING = '// WARNING: this file is AUTOGENERATED. Rerun yarn generate:enums to update';


