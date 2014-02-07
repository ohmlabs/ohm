#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install emacs htop git nginx
\curl -L https://get.rvm.io | bash -s stable --ruby
# Install RVM
source /home/ubuntu/.rvm/scripts/rvm
# Install Node (latest stable)
sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
echo "Successfully Installed the following:"
node -v
ruby -v
nginx -v
emacs -v
htop -v
git -v
