var env = process.argv[2];

var base = {
  is_prod: null,
  PARSE_APPLICATION_ID: "0Oo10fhvF3DX8Le8JjCybiaV8VogpPM3kxY8sRUs",
  PARSE_JAVASCRIPT_KEY: "swogI2OnTAlsScMKdxgEKW6PmfWsen3kFOTTfga9",
  PARSE_MASTER_KEY: "NvcqymCsAobVwPcYiYYs58hl2fAagLz7BL9MnE3s",
  GOOGLE_MAPS_KEY: "AIzaSyC4Tnw7DEdnK7-mr7MG0a60H9qTIE87NQc",
  GOOGLE_ANALYTICS: "UA-37252623-1",
  AWS_ACCESS_KEY: "AKIAJELD3L7W67KQJLVA",
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
