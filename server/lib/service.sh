#! /bin/sh
# /etc/init.d/boilerplate
#

NAME=Boilerplate
grunt=/usr/bin/grunt
forever=/usr/bin/forever
forever=/usr/bin/forever
npm=/usr/bin/npm
bower=/usr/bin/bower
SITEROOT=~/boilerplate
export PATH=$PATH:/usr/local/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $bower install
    $npm install
    $grunt
    $forever start boilerplate.js
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop boilerplate.js

    ;;
  install)
    echo "Beginning Installation for script $NAME"
    cd $SITEROOT
    # install node modules https://npmjs.org/
    $npm install
    # install client dependencies http://bower.io/
    $bower install
    git submodule init
    git submodule update

    ;;
  list)
    echo "List"
    $forever list
    ;;
  *)
    echo "Usage: /etc/init.d/boilerplate {start|stop|list}"
    exit 1
    ;;
esac

exit 0