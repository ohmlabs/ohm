exports.index = function(req, res){  
  res.render('index', {title:'Welcome to My Site'});
};
exports.parallax = function(req, res){
  res.render('parallax');
};
exports.error = function(req, res){
  res.render('404', {title: 'Page Not Found' });
};
