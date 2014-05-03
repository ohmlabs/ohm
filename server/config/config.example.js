var env = process.argv[2];

var base = {
  is_prod: null,
  PARSE_APPLICATION_ID: "PARSEID",
  PARSE_JAVASCRIPT_KEY: "JAVASCRIPTKEY",
  PARSE_MASTER_KEY: "MASTERKEY",
  GOOGLE_MAPS_KEY: "GOOGLEMAPSKEY",
  GOOGLE_ANALYTICS: "UA-XXXXXX-1",
  AWS_ACCESS_KEY: "AWS_ACCESS",
  AWS_SECRET_KEY: "AWS_SECRET",
};
switch (env) {
case '-p':
  base['is_prod'] = true;
  base['host'] = '127.0.0.1';
  base['port'] = '8888';
  base['env'] = 'production';
  break;
default:
  base['is_prod'] = false;
  base['host'] = 'localhost';
  base['port'] = '8888';
  base['env'] = 'development';
};

module.exports = base;
