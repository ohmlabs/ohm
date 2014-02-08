#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
# Install generally useful apps
sudo apt-get install emacs htop git nginx
# Install RVM
\curl -L https://get.rvm.io | bash -s stable --ruby
source /home/ubuntu/.rvm/scripts/rvm
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
gem install sass compass ceaser-easing normalize bundle
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
        ./deploy.sh
elif [[ $REPLY =~ ^[Nn]$ ]]; then
        exit
fi
