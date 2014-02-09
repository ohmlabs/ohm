#!/bin/bash
npm=/usr/bin/npm
gem=~/.rvm/bin/gem
git=/usr/bin/git
GIT=~/git/drakefm.git
FILE_DIR=`pwd`
NGINX_DIR=/etc/nginx
WORK_TREE=~/drake

mkdir -p $GIT && cd $GIT
$git --bare init
ssh-keygen
cat ~/.ssh/id_rsa.pub
function setUp() {
  git --bare fetch git@github.com:cdrake757/drakefm.git master:master
  sudo cp -i $FILE_DIR/hooks/pre-receive.sh $GIT/hooks/pre-receive
  sudo cp -i $FILE_DIR/hooks/post-receive.sh $GIT/hooks/post-receive
  sudo chmod +x $GIT/hooks/pre-receive
  sudo chmod +x $GIT/hooks/post-receive
  sudo cp -i $FILE_DIR/service.sh /etc/init.d/drake
  sudo chmod 0755 /etc/init.d/drake
  sudo cp -i $FILE_DIR/nginx.conf $NGINX_DIR
  sudo rm -rf /etc/nginx/sites-enabled
  sudo cp -ir $FILE_DIR/sites-available/ $NGINX_DIR/sites-enabled  sudo service nginx restart
  mkdir $WORK_TREE
}
read -p "Key above added ?? https://github.com/cdrake757/drakefm/settings/keys (No to proceed with https authentication) [Y/n]" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  setUp
elif [[ $REPLY =~ ^[Nn]$ ]]; then
  echo "Proceeding with HTTPS authentication... not advised"
  setUp
fi
unset setUp