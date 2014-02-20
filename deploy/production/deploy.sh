#!/bin/bash
FILE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
git=/usr/bin/git
GIT=/home/ubuntu/git/production.git
WORK_TREE=/home/ubuntu/production

mkdir -p $GIT && cd $GIT
$git --bare init
function setUp() {
  git --bare fetch git@github.com:cdrake757/boilerplate.git master:master
  sudo cp -i $FILE_DIR/hooks/pre-receive.sh $GIT/hooks/pre-receive
  sudo cp -i $FILE_DIR/hooks/post-receive.sh $GIT/hooks/post-receive
  sudo chmod +x $GIT/hooks/pre-receive
  sudo chmod +x $GIT/hooks/post-receive
  sudo cp -i $FILE_DIR/service.sh /etc/init.d/boilerplate
  sudo chmod 0755 /etc/init.d/boilerplate
  mkdir $WORK_TREE
}
read -p "Key above added ?? https://github.com/cdrake757/boilerplate/settings/keys (No to proceed with https authentication) [Y/n]" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  setUp
elif [[ $REPLY =~ ^[Nn]$ ]]; then
  echo "Proceeding with HTTPS authentication... not advised"
  setUp
fi
unset setUp