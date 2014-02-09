#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=~/drake git checkout master -f
cd ~/drake
git submodule init 
git submodule update
echo "start drake server"
sudo service drake install
sudo service drake start