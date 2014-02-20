#!/bin/bash
FILE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APACHE_DIR=/etc/apache2
###################
# Install Apache
###################
sudo apt-get install -y apache2
sudo cp -i $FILE_DIR/lamp/ports.conf $APACHE_DIR
sudo a2dissite default
# sudo a2dissite 000-default
# sudo cp -i $FILE_DIR/lamp/partypetition.com $APACHE_DIR/sites-available/partypetition.com.conf
# sudo a2ensite partypetition.com.conf
# Enable Mods
# sudo a2enmod rewrite
###################
# Install MySql
###################
sudo apt-get install -q -y mysql-server
# TODO: import mysql file
# sudo cp -i $FILE_DIR/lamp/my.cnf /etc/mysql/my.conf
# mysqladmin -u root -p password partyRhin0!
# sudo mysql_secure_installation
# create database and import dumpfile
# echo "create database p_petition" | mysql -u root -ppartyRhin0!
# mysql -u root -ppartyRhin0! p_petition < $FILE_DIR/p_petition.sql
###################
# Install PHP 5.5
###################
sudo add-apt-repository -y ppa:ondrej/php5
sudo apt-get update
sudo apt-get install -y php5 
sudo apt-get install -y php-pear php5-mysql php5-suhosin
sudo apt-get install -y mysql-server
sudo service apache2 start
