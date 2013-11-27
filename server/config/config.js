var env = process.argv[2];

var base = {
  is_prod: null,  
};
switch (env) {
case '-p':
  base['is_prod'] = true;
  base['host'] = '127.0.0.1';
  base['port'] = '8080';
  base['env'] = 'production';
  break;
default:
  base['is_prod'] = false;
  base['host'] = 'localhost';
  base['port'] = '8080';
  base['env'] = 'development';
};

module.exports = base;
