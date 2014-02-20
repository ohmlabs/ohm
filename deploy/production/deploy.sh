#!/bin/bash
FILE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT=/home/git/drakefm.git
WORK_TREE=/home/git/drake
git=/usr/bin/git

sudo mkdir -p $GIT && cd $GIT
$git --bare init
function setUp() {
  git --bare fetch git@github.com:cdrake757/drakefm.git master:master
  sudo cp -i $FILE_DIR/hooks/pre-receive.sh $GIT/hooks/pre-receive
  sudo cp -i $FILE_DIR/hooks/post-receive.sh $GIT/hooks/post-receive
  sudo chmod +x $GIT/hooks/pre-receive
  sudo chmod +x $GIT/hooks/post-receive
  sudo cp -i $FILE_DIR/service.sh /etc/init.d/drake
  sudo chmod 0755 /etc/init.d/drake
  sudo mkdir -p $WORK_TREE
}
read -p "Visit https://github.com/cdrake757/drakefm/settings/keys to add Deploy Key (No to proceed with https authentication) [Y/n]" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  setUp
elif [[ $REPLY =~ ^[Nn]$ ]]; then
  echo "Proceeding with HTTPS authentication... not advised"
  setUp
fi
unset setUp