#!/bin/bash
gem=~/.rvm/bin/gem
npm=/usr/bin/npm
git=/usr/local/bin/git
bower=/usr/local/share/npm/bin/bower
FILE_DIR=`pwd`
echo $FILE_DIR
cd "$(dirname "${BASH_SOURCE}")"
git pull origin master
read -p "This may overwrite existing files in your home directory. Proceed? (Y/N)" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd "$(dirname "${BASH_SOURCE}")"
  # install global node modules first https://npmjs.org/ 
  sudo $npm install -g bower grunt-cli forever coffee-script node-inspector strong-cli
  # install Ruby gems
  sudo $gem install sass compass ceaser-easing normalize
  # install node modules 
  $npm install
  # install client dependencies http://bower.io/
  $bower install
  $grunt
  $grunt forever:start
  tail -n 1 logs/node-bp.log
elif [[ $REPLY =~ ^[Nn]$ ]]; then
        exit
fi
