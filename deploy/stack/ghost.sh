#!/bin/bash
FILE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GHOST_DIR=/home/git/ghost

curl -L https://ghost.org/zip/ghost-latest.zip -o ghost.zip
unzip -uo ghost.zip -d $GHOST_DIR
cd $GHOST_DIR
sudo npm install sqlite3 --build-from-source
sudo npm install --production
# Install ghost service
sudo curl https://raw.github.com/TryGhost/Ghost-Config/master/init.d/ghost -o /etc/init.d/ghost
sudo chmod 0755 /etc/init.d/ghost
sudo patch /etc/init.d/ghost < $FILE_DIR/ghost.patch
sudo useradd -r ghost -U
sudo chown -R ghost:ghost $GHOST_DIR
sudo service ghost start