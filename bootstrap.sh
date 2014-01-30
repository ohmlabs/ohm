#! /bin/sh
gem=/usr/bin/gem
npm=/usr/bin/npm
grunt=/usr/bin/grunt
NGINX_CONFIG=/etc/nginx/
GIT=~/git/boilerplate.git

cd "$(dirname "${BASH_SOURCE}")"
git pull origin master
function doIt() {
        ln -s server/lib/service.sh /etc/init.d/boilerplate
        chmod 0755 /etc/init.d/boilerplate
        cd $NGINX_CONFIG
        ln -s server/lib/nginx.conf .
        ln -s server/lib/sites-available sites-enabled
        cd $GIT
        ln -s server/lib/hooks/* hooks
        chmod +x hooks/pre-receive
        chmod +x hooks/post-receive
        cd "$(dirname "${BASH_SOURCE}")"
        # install gloabal node modules
        $npm install -g bower grunt-cli forever coffee-script node-inspector
        $gem install sass compasss ceaser-easing normalize
}
if [ "$1" == "--force" -o "$1" == "-f" ]; then
        doIt
else
        read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
                doIt
        fi
fi
unset doIt
