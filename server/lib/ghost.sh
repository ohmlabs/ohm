#!/bin/bash
FILE_DIR=`pwd`
curl -L https://ghost.org/zip/ghost-latest.zip -o ghost.zip
unzip -uo ghost.zip -d ~/ghost
cd ~/ghost
sudo npm install sqlite3 --build-from-source
sudo npm install --production
# Install ghost service
cd $FILE_DIR
sudo curl https://raw.github.com/TryGhost/Ghost-Config/master/init.d/ghost -o /etc/init.d/ghost
sudo chmod 0755 /etc/init.d/ghost
sudo patch /etc/init.d/ghost < ghost.patch
sudo useradd -r ghost -U
sudo chown -R ghost:ghost /home/ubuntu/ghost
sudo service ghost start