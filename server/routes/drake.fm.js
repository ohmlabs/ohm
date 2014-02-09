exports.index = function(req, res){  
  res.render('index', {title:'Welcome to My Site'});
};
exports.tumblr = function(req, res){  
  res.redirect('http://blog.drake.fm');
};
exports.photos = function(req, res){
  res.redirect('http://camwes.500px.com');
};
exports.work = function(req, res){
  res.redirect('http://camwes.prosite.com/');
};
exports.weiss = function(req, res){
  res.render('weiss');
};
exports.ohm= function(req, res){  
  res.render('ohmlabs');
};
exports.error = function(req, res){
  res.render('404', {title: 'You Dun Fd Up' });
};

