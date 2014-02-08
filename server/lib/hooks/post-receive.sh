#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=~/production git checkout master -f
echo "start boilerplate server"
sudo service boilerplate install
sudo service boilerplate start