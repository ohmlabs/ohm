#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=~/production git checkout master -f
cd ~/production
git submodule init 
git submodule update
echo "start boilerplate server"
sudo service boilerplate install
sudo service boilerplate start