#!/bin/bash
npm=/usr/bin/npm
gem=~/.rvm/bin/gem
git=/usr/bin/git
GIT=~/git/production.git
FILE_DIR=`pwd`
WORK_TREE=~/production

mkdir -p $GIT && cd $GIT
$git --bare init
git --bare fetch git@github.com:ohmlabs/ohmlabs.git master:master
sudo cp -i $FILE_DIR/hooks/pre-receive.sh $GIT/hooks/pre-receive
sudo cp -i $FILE_DIR/hooks/post-receive.sh $GIT/hooks/post-receive
sudo chmod +x $GIT/hooks/pre-receive
sudo chmod +x $GIT/hooks/post-receive
sudo cp -i $FILE_DIR/service.sh /etc/init.d/ohmlabs
sudo chmod 0755 /etc/init.d/ohmlabs
mkdir $WORK_TREE
