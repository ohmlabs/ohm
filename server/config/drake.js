var env = process.argv[2];

var base = {
  is_prod: null,
  PARSE_APPLICATION_ID: "c7pHlbVtdDYh54d8nmS9qq0o0ERDZoxoGPzdov4K",
  PARSE_JAVASCRIPT_KEY: "enmABY6AJC0KyK3hgxwBMnn0xhs5WZw2vLoJuLHG",
  PARSE_MASTER_KEY: "BC9h0BS4b6avZFEuXODi1PUFZFw88Qj7m5yef8bc",
  GOOGLE_MAPS_KEY: "AIzaSyC4Tnw7DEdnK7-mr7MG0a60H9qTIE87NQc",
  GOOGLE_ANALYTICS: "UA-37252623-1",
  AWS_ACCESS_KEY: "AKIAIXUQ7IM6EAVQ6UQQ",
  AWS_SECRET_KEY: "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",
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
  base['port'] = '8888';
  base['env'] = 'development';
};

module.exports = base;
