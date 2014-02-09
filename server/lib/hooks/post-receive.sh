#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=~/drake git checkout master -f
cd ~/drake
echo "start drake server"
sudo service drake install
sudo service drake start