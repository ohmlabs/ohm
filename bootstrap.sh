#!/bin/bash
gem=/usr/bin/gem
npm=/usr/bin/npm
grunt=/usr/bin/grunt
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
        # install gloabal node modules
        sudo $npm install -g bower grunt-cli forever coffee-script node-inspector
        sudo $gem install sass compasss ceaser-easing normalize
}
function dev() {
        cd "$(dirname "${BASH_SOURCE}")"
        # install gloabal node modules
        $npm install -g bower grunt-cli forever coffee-script node-inspector
        $gem install sass compasss ceaser-easing normalize
}
if [ "$1" == "--force" -o "$1" == "-f" ]; then
        doIt
else
        read -p "This may overwrite existing files in your home directory. What type of install is this? (p)Prod (d)Dev enter anything else to cancel" -n 1
        echo
        if [[ $REPLY =~ ^[Pp]$ ]]; then
                doIt
	elif [[ $REPLY =~ ^[Dd]$ ]]; then
                dev
	fi
fi
unset doIt
