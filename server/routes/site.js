exports.index = function(req, res){  
  res.redirect('http://blog.drake.fm');
};
exports.parallax= function(req, res){  
  res.render('parallax');
};
exports.photos = function(req, res){
  res.redirect('http://camwes.500px.com');
};
exports.work = function(req, res){
  res.redirect('http://camwes.prosite.com/');
}
exports.error = function(req, res){
  res.render('404', {title: 'You Dun Fd Up' });
};

