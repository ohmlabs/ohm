#!/bin/bash
gem=~/.rvm/bin/gem
npm=/usr/local/bin/npm
git=/usr/local/bin/git
bower=/usr/local/share/npm/bin/bower
NGINX_CONFIG=/etc/nginx/
GIT=~/git/boilerplate.git
FILE_DIR=`pwd`
echo $FILE_DIR
cd "$(dirname "${BASH_SOURCE}")"
git pull origin master
function doIt() {
        sudo ln -s $FILE_DIR/server/lib/service.sh /etc/init.d/boilerplate
        sudo chmod 0755 /etc/init.d/boilerplate
        cd $NGINX_CONFIG
  pwd
        sudo ln -s $FILE_DIR/server/lib/nginx.conf .
        sudo ln -s $FILE_DIR/server/lib/sites-available sites-enabled
        cd $GIT
  pwd
        ln -s $FILE_DIR/server/lib/hooks/ hooks
  cd hooks
  ls -la
        sudo chmod +x pre-receive.sh
        sudo chmod +x post-receive.sh
  cd "$(dirname "${BASH_SOURCE}")"
  pwd
        # install 
  sudo service boilerplate install
  sudo service boilerplate start
}
function dev() {
  cd "$(dirname "${BASH_SOURCE}")"
  ln -s $FILE_DIR/.gitconfig ~
  ln -s $FILE_DIR/.sshconfig  ~/.ssh/config
  ln -s $FILE_DIR/.zshrc  ~
  source ~/.zshrc
  # install global node modules first https://npmjs.org/ 
  sudo $npm install -g bower grunt-cli forever coffee-script node-inspector
  # install Ruby gems
  sudo $gem install sass compass ceaser-easing normalize
  # install node modules 
  $npm install
  # install client dependencies http://bower.io/
  $bower install
  $git submodule init
  $git submodule update
  tail -n 1 logs/node-bp.log
}
if [ "$1" == "--force" -o "$1" == "-f" ]; then
        doIt
else
        read -p "This may overwrite existing files in your home directory. What type of install is this? (p)Prod (d)Dev" -n 1
        echo
        if [[ $REPLY =~ ^[Pp]$ ]]; then
                doIt
        elif [[ $REPLY =~ ^[Dd]$ ]]; then
                dev
        fi
fi
unset doIt
unset dev
