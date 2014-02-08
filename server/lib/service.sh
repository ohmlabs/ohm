#! /bin/sh
# /etc/init.d/boilerplate
# update these paths so that the script works correctly
NAME=ohm.fm
grunt=/usr/bin/grunt
gem=/usr/bin/gem
forever=/usr/bin/forever
npm=/usr/bin/npm
bower=/usr/bin/bower
SITEROOT=/home/ubuntu/production
export PATH=$PATH:/usr/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $grunt prod
    $forever start boilerplate.js -p
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop boilerplate.js -p

    ;;
  compile)
    echo "Compiling $NAME"
    cd $SITEROOT
    $grunt prod
    $forever restart boilerplate.js -p

    ;;
  install)
    echo "Beginning Installation for script $NAME"
    cd $SITEROOT
    $npm cache clean
    $npm install
    $bower install --allow-root
    #git submodule init
    #git submodule update
    #cd Ghost
    #sudo bundle install
    #npm install
    #grunt init
    #NODE_ENV=production forever start index.js

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
