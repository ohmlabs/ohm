#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=/home/git/drake git checkout master -f
echo "start drake server"
sudo service drake install
sudo service drake start