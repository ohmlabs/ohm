#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
# Install generally useful apps
sudo apt-get install emacs htop git nginx rubygems unzip
# Install Varnish via https://www.varnish-cache.org/installation/ubuntu
curl http://repo.varnish-cache.org/debian/GPG-key.txt | sudo apt-key add -
echo "deb http://repo.varnish-cache.org/ubuntu/ precise varnish-3.0" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install varnish
sudo patch /etc/default/varnish < varnish.diff
sudo patch /etc/varnish/default.vcl < default.vcl.diff
# Install Node (latest stable)
sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
# install global node modules first https://npmjs.org/ cache clean just in case
sudo npm cache clean
sudo npm install -g bower grunt-cli forever coffee-script node-inspector
# install Ruby gems
sudo gem install sass compass ceaser-easing compass-normalize bundle
echo "Successfully Installed the following:"
node -v
ruby -v
nginx -v
htop -v
emacs --version
git --version
npm ls -g --depth=0
gem list
read -p "Server Successfully Initialized, Do you want to create a git repo for deployment? [Y/n]" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./production/deploy.sh
elif [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "continuing..."
fi
read -p "Deployment Setup Complete, Do you want to install Ghost? [Y/n]" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./ghost/ghost.sh
elif [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "install complete"
fi
sudo service nginx start
sudo service varnish start
echo "Deployment Setup Complete
