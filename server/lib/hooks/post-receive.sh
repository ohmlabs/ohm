#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=~/boilerplate git checkout master -f
echo "start boilerplate server"
sudo service boilerplate start