exports.index = function(req, res){  
  res.render('index', {title:'Welcome to My Site'});
};
exports.weiss= function(req, res){  
  res.render('weiss');
};
exports.error = function(req, res){
  res.render('404', {title: 'You Dun Fd Up' });
};

