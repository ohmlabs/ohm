exports.index = function(req, res){  
  res.render('index', {title:'Welcome to My Site'});
};
exports.play = function(req, res){
  res.redirect('https://play.google.com/store/apps/details?id=com.ohmslab');
};
exports.parallax = function(req, res){
  res.render('parallax');
};
exports.ios = function(req, res){
  res.redirect('http://itunes.apple.com/us/app/ohm-music/id522608649?mt=8');
};

exports.error = function(req, res){
  res.render('404', {title: 'Page Not Found' });
};
