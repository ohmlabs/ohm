#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=/home/cam/drake git checkout master -f
echo "start drake server"
sudo service drake compile
