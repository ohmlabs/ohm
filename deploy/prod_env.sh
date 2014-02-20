#!/bin/bash
FILE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
###################
# Create Git User
###################
sudo adduser --disabled-password --gecos "" git
sudo usermod -a -G sudo git
sudo chmod a+rx /home/git
# Configure Time Zone 
sudo dpkg-reconfigure tzdata
sudo ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get upgrade --show-upgraded
###################
# Install
###################
sudo apt-get install -y emacs htop tree git tig wget tmux rubygems unzip ntp fail2ban zsh
# Install Mosh  
sudo apt-get install -y python-software-properties
sudo add-apt-repository -y ppa:keithw/mosh
sudo apt-get update
sudo apt-get install -y mosh
# Set clock/restart cron
ntpdate && hwclock –w
sudo service cron stop
sudo service cron start
# Install Rubygems
sudo gem install sass compass ceaser-easing compass-normalize bundle
###################
# Stack
###################
read -p "Ready to build environment. Would you like to use LVNN(N) or LAMP(A)? [N/A]" -n 1
echo
if [[ $REPLY =~ ^[Aa]$ ]]; then
  sudo ./stack/lamp.sh
elif [[ $REPLY =~ ^[Nn]$ ]]; then
  sudo ./stack/lvnn.sh
fi
###################
# TODO: Firewall
###################
# sudo cp -i $FILE_DIR/stack/iptables.firewall.rules /etc/iptables.firewall.rules
# sudo iptables-restore < /etc/iptables.firewall.rules
# sudo cp -i $FILE_DIR/stack/firewall /etc/network/if-pre-up.d/firewall
###################
# Fail2Ban
###################
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
###################
# Deploy Key
###################
sudo ssh-keygen
sudo cat /root/.ssh/id_rsa.pub
###################
# Git Deployment
###################
read -p "Server Initialized, Do you want to create a git repo for deployment? [Y/n]" -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo ./production/deploy.sh
elif [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "continuing..."
fi
echo "Successfully Installed the following:"
node -v
npm ls -g --depth=0
ruby -v
gem list
nginx -v
htop -v
mosh -v
tig -v
tree --version
emacs --version
git --version
ntpd --version
unzip -v
varnishlog
