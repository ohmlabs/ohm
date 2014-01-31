#! /bin/sh
# /etc/init.d/drake
#

NAME=Drake.fm
grunt=/usr/bin/grunt
gem=/usr/bin/gem
forever=/usr/bin/forever
npm=/usr/bin/npm
bower=/usr/bin/bower
SITEROOT=/home/cam/drake
export PATH=$PATH:/usr/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $grunt prod
    $forever start drake.js -p
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop drake.js -p

    ;;
  install)
    echo "Beginning Installation for script $NAME"
    cd $SITEROOT
    $npm cache clean
    $npm install
    $bower install --allow-root
    git submodule init
    git submodule update

    ;;
  list)
    echo "List"
    $forever list
    ;;
  *)
    echo "Usage: /etc/init.d/drake {start|stop|list}"
    exit 1
    ;;
esac

exit 0
