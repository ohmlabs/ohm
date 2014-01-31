exports.index = function(req, res){  
//  res.render('index', {title:'Cameron W. Drake'});
  res.redirect('http://blog.drake.fm');
};
exports.resume = function(req, res){  
  res.render('resume');
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

